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

function backlineAppOrigin() {
  const configured = backlineAppUrl();
  return configured ? new URL(configured).origin : "*";
}

const corsHeaders = {
  "Access-Control-Allow-Origin": backlineAppOrigin(),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json"
    }
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

function textFromRole(role: string) {
  return role
    .split("-")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ") || "Team member";
}

function displayPersonName(value: unknown) {
  const identity = String(value ?? "").trim();
  if (!identity) return "Your workspace";
  const username = identity.includes("@") ? identity.split("@")[0] : identity;
  return username
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ") || "Your workspace";
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function supabaseRest(path: string, options: RequestInit = {}) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase service credentials are not configured.");
  }

  return fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      ...(options.headers || {})
    }
  });
}

async function readSingle<T>(path: string): Promise<T | null> {
  const response = await supabaseRest(path, {
    headers: { Accept: "application/json" }
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  const rows = await response.json();
  return Array.isArray(rows) && rows.length ? rows[0] as T : null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Use POST to send a team invite." }, 405);
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("INVITE_FROM_EMAIL");
    if (!resendApiKey || !fromEmail) {
      return jsonResponse({ error: "Invite email is not configured. Set RESEND_API_KEY and INVITE_FROM_EMAIL on the Supabase function." }, 500);
    }

    const authHeader = request.headers.get("Authorization") || "";
    if (!authHeader.toLowerCase().startsWith("bearer ")) {
      return jsonResponse({ error: "Sign in before sending an invite email." }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) {
      return jsonResponse({ error: "Supabase service credentials are not configured." }, 500);
    }

    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: authHeader
      }
    });
    if (!userResponse.ok) {
      return jsonResponse({ error: "Your session could not be verified." }, 401);
    }
    const user = await userResponse.json();
    const userId = String(user?.id || "");
    if (!isUuid(userId)) {
      return jsonResponse({ error: "Your session could not be verified." }, 401);
    }

    const body = await request.json().catch(() => ({}));
    const inviteId = String(body?.inviteId || "");
    if (!isUuid(inviteId)) {
      return jsonResponse({ error: "A valid invite ID is required." }, 400);
    }

    type InviteRow = { id: string; email: string; role: string; organization_id: string };
    const invite = await readSingle<InviteRow>(`/rest/v1/team_invites?id=eq.${encodeURIComponent(inviteId)}&status=eq.pending&select=id,email,role,organization_id&limit=1`);
    if (!invite) {
      return jsonResponse({ error: "That invite is no longer pending." }, 404);
    }

    type MemberRow = { display_name: string | null; email: string | null; role: string };
    const member = await readSingle<MemberRow>(`/rest/v1/organization_members?organization_id=eq.${encodeURIComponent(invite.organization_id)}&user_id=eq.${encodeURIComponent(userId)}&role=in.(owner,admin)&select=display_name,email,role&limit=1`);
    if (!member) {
      return jsonResponse({ error: "Only an owner or admin can send invite emails." }, 403);
    }

    type OrganizationRow = { name: string | null; payload: Record<string, unknown> | null };
    const organization = await readSingle<OrganizationRow>(`/rest/v1/organizations?id=eq.${encodeURIComponent(invite.organization_id)}&select=name,payload&limit=1`);
    const payload = organization?.payload || {};
    const companySettings = (payload.companySettings && typeof payload.companySettings === "object")
      ? payload.companySettings as Record<string, unknown>
      : payload;
    const shopName = String(companySettings.companyName || organization?.name || "Backline");
    const inviteUrl = backlineAppUrl();
    if (!inviteUrl) {
      return jsonResponse({ error: "Invite email is not configured. Set BACKLINE_APP_URL to your HTTPS Backline app URL." }, 500);
    }
    const roleName = textFromRole(invite.role);
    const senderName = displayPersonName(member.display_name || member.email || "Your workspace");
    const replyTo = Deno.env.get("INVITE_REPLY_TO_EMAIL") || member.email || undefined;
    const subject = `${shopName} invited you to Backline`;
    const text = [
      `${senderName} invited you to join ${shopName} on Backline.`,
      "",
      `Role: ${roleName}`,
      `Email to use: ${invite.email}`,
      "",
      `Open Backline: ${inviteUrl}`,
      "",
      "Create your Backline account with this email. Backline will connect you to the shop automatically."
    ].join("\n");
    const html = `
      <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#0f172a">
        <h1 style="font-size:22px;margin:0 0 12px">${escapeHtml(shopName)} invited you to Backline</h1>
        <p>${escapeHtml(senderName)} invited you to join their Backline workspace.</p>
        <p><strong>Role:</strong> ${escapeHtml(roleName)}<br><strong>Email to use:</strong> ${escapeHtml(invite.email)}</p>
        <p><a href="${escapeHtml(inviteUrl)}" style="display:inline-block;background:#2563eb;color:white;padding:10px 14px;border-radius:8px;text-decoration:none;font-weight:700">Open Backline</a></p>
        <p>Create your Backline account with this email. Backline will connect you to the shop automatically.</p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: fromEmail,
        to: invite.email,
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {})
      })
    });

    const emailResult = await emailResponse.json().catch(() => ({}));
    if (!emailResponse.ok) {
      return jsonResponse({
        error: String(emailResult?.message || "Email provider rejected the invite.")
      }, 502);
    }

    return jsonResponse({ ok: true, id: emailResult?.id || null });
  } catch (error) {
    return jsonResponse({
      error: error instanceof Error ? error.message : "Invite email could not be sent."
    }, 500);
  }
});
