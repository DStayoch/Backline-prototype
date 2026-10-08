// Emails a shop's customer about one of the shop's jobs: their portal link,
// a portal update, an approval request, or a payment request.
//
// The browser only says which job and which kind of email. The recipient, the
// links, and the amounts are read from the database here, and the wording is
// a fixed template, so a signed-in account cannot use Backline's sending
// domain to email arbitrary people or arbitrary links.

type EmailKind = "portal-link" | "portal-update" | "approval-request" | "payment-request";

const KIND_PERMISSION: Record<EmailKind, string> = {
  "portal-link": "portal",
  "portal-update": "portal-update",
  "approval-request": "approval",
  "payment-request": "payment-request"
};

// Sending limits protect the shared sending domain's reputation.
const WORKSPACE_DAILY_LIMIT = 100;
const JOB_HOURLY_LIMIT = 6;
const MAX_MESSAGE_LENGTH = 1000;

function backlineAppUrl() {
  const configured = String(Deno.env.get("BACKLINE_APP_URL") || "").trim();
  if (!configured) return "";
  try {
    const url = new URL(configured);
    return url.protocol === "https:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function corsHeaders() {
  const appUrl = backlineAppUrl();
  return {
    "Access-Control-Allow-Origin": appUrl ? new URL(appUrl).origin : "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" }
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isRecordId(value: string) {
  return /^[A-Za-z0-9_-]{1,96}$/.test(value);
}

function isEmailAddress(value: string) {
  return value.length <= 254 && /^[^\s@<>(),;:"']+@[^\s@<>(),;:"']+\.[^\s@<>(),;:"']{2,}$/.test(value);
}

// "Backline <invite@backlineoffice.com>" -> "invite@backlineoffice.com"
function addressOnly(value: string) {
  const match = value.match(/<([^<>]+)>/);
  return (match ? match[1] : value).trim();
}

// A shop name is shown as the sender's display name, so strip anything that
// could break out of the From header or impersonate an address.
function senderDisplayName(shopName: string) {
  const cleaned = shopName
    .replace(/[\r\n\t"<>@,;:\\()[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
  return cleaned || "Your service provider";
}

// Free-text updates may not carry links. The only links in these emails are
// the ones this function builds itself.
function containsLink(text: string) {
  return /(https?:\/\/|www\.)/i.test(text)
    || /\b[a-z0-9-]+\.(com|net|org|io|co|us|info|biz|app|me|ly|xyz|site|online|link|shop)\b/i.test(text);
}

function firstName(name: string) {
  const first = name.trim().split(/\s+/)[0] || "";
  return first.slice(0, 40);
}

function formatMoney(value: unknown) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return "";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

function formatDueDate(value: unknown) {
  const text = String(value || "");
  if (!/^\d{4}-\d{2}-\d{2}/.test(text)) return "";
  const date = new Date(`${text.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" }).format(date);
}

type EmailInput = {
  kind: EmailKind;
  shopName: string;
  customerName: string;
  actionUrl: string;
  message: string;
  amountLabel: string;
  dueLabel: string;
  shopContact: string;
};

export function buildCustomerEmail(input: EmailInput) {
  const greeting = firstName(input.customerName) ? `Hi ${firstName(input.customerName)},` : "Hello,";
  let subject = "";
  let lead = "";
  let button = "";
  switch (input.kind) {
    case "portal-link":
      subject = `Your job page from ${input.shopName}`;
      lead = `${input.shopName} set up a page for your job. You can see your appointment, updates, documents, and balance there, and send the office a message.`;
      button = "Open your job page";
      break;
    case "portal-update":
      subject = `Update from ${input.shopName}`;
      lead = `${input.shopName} sent you an update:`;
      button = "View and reply";
      break;
    case "approval-request":
      subject = `${input.shopName} needs your approval`;
      lead = `${input.shopName} sent you an estimate to review. You can look over the work and approve or decline it online.`;
      button = "Review the estimate";
      break;
    case "payment-request": {
      const amount = input.amountLabel ? ` of ${input.amountLabel}` : "";
      const due = input.dueLabel ? `, due ${input.dueLabel}` : "";
      subject = `Payment request from ${input.shopName}`;
      lead = `${input.shopName} sent you a payment request${amount}${due}. Your job page shows the details and how to pay.`;
      button = "View payment details";
      break;
    }
  }
  const footer = `Sent by ${input.shopName} using Backline.${input.shopContact ? ` Questions? Contact ${input.shopContact}, or reply to this email.` : " Reply to this email to reach them."}`;
  const text = [
    greeting,
    "",
    lead,
    ...(input.message ? ["", input.message] : []),
    "",
    `${button}: ${input.actionUrl}`,
    "",
    footer
  ].join("\n");
  const html = `
    <div style="font-family: Arial, sans-serif; color: #172033; line-height: 1.5; max-width: 560px;">
      <p>${escapeHtml(greeting)}</p>
      <p>${escapeHtml(lead)}</p>
      ${input.message ? `<p style="margin: 16px 0; padding: 12px 14px; border-left: 4px solid #2563eb; background: #f3f6fb; white-space: pre-line;">${escapeHtml(input.message)}</p>` : ""}
      <p style="margin: 22px 0;">
        <a href="${escapeHtml(input.actionUrl)}" style="display: inline-block; padding: 12px 20px; border-radius: 8px; background: #2563eb; color: #ffffff; font-weight: bold; text-decoration: none;">${escapeHtml(button)}</a>
      </p>
      <p style="color: #5b6b80; font-size: 13px;">${escapeHtml(footer)}</p>
    </div>
  `;
  return { subject, text, html };
}

async function readJson(response: Response) {
  return response.json().catch(() => null);
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders() });
  if (request.method !== "POST") return jsonResponse({ error: "Use POST to email a customer." }, 405);

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromAddress = addressOnly(String(Deno.env.get("CUSTOMER_FROM_EMAIL") || Deno.env.get("INVITE_FROM_EMAIL") || ""));
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const appUrl = backlineAppUrl();
    if (!resendApiKey || !isEmailAddress(fromAddress) || !supabaseUrl || !serviceRoleKey || !anonKey || !appUrl) {
      return jsonResponse({ error: "Customer email is not set up on this Backline environment yet." }, 500);
    }

    const authHeader = request.headers.get("Authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return jsonResponse({ error: "Sign in before emailing a customer." }, 401);
    }
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: serviceRoleKey, Authorization: authHeader } });
    const user = userResponse.ok ? await readJson(userResponse) : null;
    const userId = String(user?.id || "");
    if (!isUuid(userId)) return jsonResponse({ error: "Your session could not be verified." }, 401);

    const body = (await request.json().catch(() => ({}))) || {};
    const organizationId = String(body.organizationId || "");
    const jobId = String(body.jobId || "");
    const kind = String(body.kind || "") as EmailKind;
    const message = String(body.message || "").trim();
    if (!isUuid(organizationId) || !isRecordId(jobId) || !(kind in KIND_PERMISSION)) {
      return jsonResponse({ error: "That email request is not valid." }, 400);
    }
    if (kind === "portal-update" && !message) return jsonResponse({ error: "Write an update before emailing it." }, 400);
    if (kind !== "portal-update" && message) return jsonResponse({ error: "Only portal updates can include a custom message." }, 400);
    if (message.length > MAX_MESSAGE_LENGTH) return jsonResponse({ error: `Keep emailed updates under ${MAX_MESSAGE_LENGTH} characters.` }, 400);
    if (message && containsLink(message)) {
      return jsonResponse({ error: "Emailed updates cannot contain links. The customer's job page link is added automatically." }, 400);
    }

    // Checks that depend on who is asking run as that person, so the
    // database's own role, assignment, and subscription rules decide.
    const asUser = async (fn: string, args: Record<string, unknown>) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${fn}`, {
        method: "POST",
        headers: { apikey: anonKey, Authorization: authHeader, "Content-Type": "application/json" },
        body: JSON.stringify(args)
      });
      return response.ok ? (await readJson(response)) === true : false;
    };
    if (!(await asUser("org_has_permission", { target_org: organizationId, requested_permission: KIND_PERMISSION[kind] }))) {
      return jsonResponse({ error: "Your role cannot send this to customers." }, 403);
    }
    if (!(await asUser("can_access_job", { target_org: organizationId, target_job_id: jobId }))) {
      return jsonResponse({ error: "You do not have access to that job." }, 403);
    }
    if (!(await asUser("has_backline_full_access", { target_org: organizationId }))) {
      return jsonResponse({ error: "This workspace is read-only until its subscription is active." }, 403);
    }

    const serviceHeaders = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` };
    const firstRow = async (path: string) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, { headers: { ...serviceHeaders, Accept: "application/json" } });
      if (!response.ok) throw new Error(await response.text());
      const rows = await readJson(response);
      return Array.isArray(rows) && rows.length ? rows[0] : null;
    };
    const countRows = async (path: string) => {
      const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, { method: "HEAD", headers: { ...serviceHeaders, Prefer: "count=exact" } });
      if (!response.ok) throw new Error("Could not check the sending limit.");
      const total = Number(String(response.headers.get("content-range") || "").split("/")[1]);
      if (!Number.isFinite(total)) throw new Error("Could not check the sending limit.");
      return total;
    };
    const org = encodeURIComponent(organizationId);
    const job = encodeURIComponent(jobId);

    const jobRow = await firstRow(`jobs?organization_id=eq.${org}&id=eq.${job}&select=id,customer_id,payload&limit=1`);
    if (!jobRow) return jsonResponse({ error: "That job was not found. Save it and try again." }, 404);
    const payload = (jobRow.payload && typeof jobRow.payload === "object" ? jobRow.payload : {}) as Record<string, unknown>;

    // Recipient: the email on this job, otherwise the one on its customer record.
    let recipient = String(payload.email || "").trim();
    if (!recipient && jobRow.customer_id) {
      const customer = await firstRow(`customers?organization_id=eq.${org}&id=eq.${encodeURIComponent(String(jobRow.customer_id))}&select=email&limit=1`);
      recipient = String(customer?.email || "").trim();
    }
    if (!isEmailAddress(recipient)) {
      return jsonResponse({ error: "Add an email address for this customer before emailing them." }, 400);
    }

    const since = (ms: number) => encodeURIComponent(new Date(Date.now() - ms).toISOString());
    if ((await countRows(`customer_email_log?organization_id=eq.${org}&created_at=gte.${since(24 * 60 * 60 * 1000)}&select=id`)) >= WORKSPACE_DAILY_LIMIT) {
      return jsonResponse({ error: `This workspace has reached today's limit of ${WORKSPACE_DAILY_LIMIT} customer emails. Copy the link instead, or try again tomorrow.` }, 429);
    }
    if ((await countRows(`customer_email_log?organization_id=eq.${org}&job_id=eq.${job}&created_at=gte.${since(60 * 60 * 1000)}&select=id`)) >= JOB_HOURLY_LIMIT) {
      return jsonResponse({ error: "This customer has already been emailed several times in the last hour. Try again later." }, 429);
    }

    const portalToken = String(payload.portalToken || "");
    // Same rule the database applies to portal links (schema 24).
    if (!/^portal-[A-Za-z0-9_-]{16,120}$/.test(portalToken)) {
      return jsonResponse({ error: "This job's customer link is not ready yet. Open the job, wait for it to save, and try again." }, 409);
    }
    let actionUrl = `${appUrl}#portal=${encodeURIComponent(portalToken)}`;
    if (kind === "approval-request") {
      const link = await firstRow(`approval_links?organization_id=eq.${org}&job_id=eq.${job}&used_at=is.null&select=token,expires_at&order=created_at.desc&limit=1`);
      const expired = link?.expires_at && new Date(link.expires_at).getTime() < Date.now();
      if (!link?.token || expired) {
        return jsonResponse({ error: "Create an approval link for this job first, then email it." }, 409);
      }
      actionUrl = `${appUrl}#approval-token=${encodeURIComponent(String(link.token))}`;
    }

    const organization = await firstRow(`organizations?id=eq.${org}&select=name,payload&limit=1`);
    const settings = ((organization?.payload as Record<string, unknown>)?.companySettings || {}) as Record<string, unknown>;
    const shopName = senderDisplayName(String(settings.companyName || organization?.name || ""));
    const shopEmail = [settings.supportEmail, settings.email, user?.email].map((value) => String(value || "").trim()).find(isEmailAddress) || "";
    const shopPhone = String(settings.supportPhone || settings.phone || "").trim();

    let amountLabel = "";
    let dueLabel = "";
    if (kind === "payment-request") {
      const requests = Array.isArray(payload.paymentRequests) ? payload.paymentRequests as Array<Record<string, unknown>> : [];
      const active = requests
        .filter((item) => item && item.status === "requested")
        .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))[0];
      amountLabel = formatMoney(active?.amount);
      dueLabel = formatDueDate(active?.dueDate);
    }

    const email = buildCustomerEmail({
      kind,
      shopName,
      customerName: String(payload.name || ""),
      actionUrl,
      message,
      amountLabel,
      dueLabel,
      shopContact: [shopPhone, shopEmail].filter(Boolean).join(" or ")
    });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: `${shopName} via Backline <${fromAddress}>`,
        to: [recipient],
        ...(shopEmail ? { reply_to: shopEmail } : {}),
        subject: email.subject,
        text: email.text,
        html: email.html
      })
    });
    const resendResult = await readJson(resendResponse);
    if (!resendResponse.ok) {
      console.error("Resend rejected a customer email", resendResponse.status, resendResult);
      return jsonResponse({ error: "The email service could not send that message. Copy the link instead, or try again." }, 502);
    }

    // The log is what the sending limits count. A logging failure must not
    // hide a sent email from the shop, so it is reported but not fatal.
    const logResponse = await fetch(`${supabaseUrl}/rest/v1/customer_email_log`, {
      method: "POST",
      headers: { ...serviceHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        organization_id: organizationId,
        job_id: jobId,
        kind,
        recipient,
        sent_by: userId,
        provider_message_id: String(resendResult?.id || "") || null
      })
    });
    if (!logResponse.ok) console.error("Customer email sent but not logged", await logResponse.text());

    return jsonResponse({ sent: true, to: recipient });
  } catch (error) {
    console.error("send-customer-email failed", error);
    return jsonResponse({ error: "Backline could not send that email. Try again in a moment." }, 500);
  }
});
