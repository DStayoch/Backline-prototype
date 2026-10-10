// Runs the real send-customer-email Edge Function under Node with a stand-in
// for Deno and for the network, and checks every rule it is meant to enforce.
// Unlike the pattern checks in the other test files, this executes the code.
// (Node 24 runs the TypeScript source directly; no dependencies are needed.)
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const ORG = "10000000-0000-4000-8000-00000000000a";
const USER = "00000000-0000-4000-8000-0000000000a1";
const env = {
  RESEND_API_KEY: "re_test", INVITE_FROM_EMAIL: "Backline <invite@backlineoffice.com>",
  SUPABASE_URL: "https://db.test", SUPABASE_SERVICE_ROLE_KEY: "service-key", SUPABASE_ANON_KEY: "anon-key",
  BACKLINE_APP_URL: "https://backlineoffice.com/app/"
};
let handler = null;
globalThis.Deno = { env: { get: (name) => env[name] }, serve: (fn) => { handler = fn; } };
await import(pathToFileURL(resolve("supabase/functions/send-customer-email/index.ts")).href);

// A small fake of the services the function talks to.
function world(overrides = {}) {
  const w = {
    user: { id: USER, email: "owner@shop.test" },
    permissions: { org_has_permission: true, can_access_job: true, has_backline_full_access: true },
    job: { id: "job-1", customer_id: "8135550101", payload: { id: "job-1", name: "Maya Rivera", email: "old-address@example.com", portalToken: "portal-0123456789abcdef0123", paymentRequests: [{ status: "requested", amount: 225, dueDate: "2026-10-14", createdAt: "2026-10-07T10:00:00Z" }] } },
    hasCustomerRecord: true,
    customerEmail: "maya@example.com",
    approvalLink: { token: "approvaltoken123", expires_at: null },
    organization: { name: "Junk in Our Trunk", payload: { companySettings: { companyName: "Junk in Our Trunk", supportEmail: "office@junk.test", phone: "(813)555-0199" } } },
    sentToday: 0, sentThisHour: 0, resendStatus: 200,
    calls: [], rpcArgs: [], sent: null, logged: null,
    ...overrides
  };
  w.fetch = async (url, options = {}) => {
    const u = String(url); const method = options.method || "GET";
    w.calls.push(`${method} ${u.replace("https://db.test", "")}`.slice(0, 120));
    const json = (body, status = 200, headers = {}) => new Response(body === null ? null : JSON.stringify(body), { status, headers });
    if (u.endsWith("/auth/v1/user")) return w.user ? json(w.user) : json({ message: "bad token" }, 401);
    const rpc = u.match(/\/rest\/v1\/rpc\/(\w+)$/);
    if (rpc) {
      if (options.headers.apikey !== "anon-key" || options.headers.Authorization !== "Bearer user-token") return json({ message: "permission checks must run as the user" }, 500);
      w.rpcArgs.push(JSON.parse(options.body));
      return json(w.permissions[rpc[1]] === true);
    }
    if (u === "https://api.resend.com/emails") { if (options.headers.Authorization !== "Bearer re_test") return json({ message: "bad resend key" }, 500); w.sent = JSON.parse(options.body); return json(w.resendStatus === 200 ? { id: "email_123" } : { message: "rejected" }, w.resendStatus); }
    if (options.headers?.apikey !== "service-key") return json({ message: "expected service role" }, 500);
    if (u.includes("/rest/v1/jobs?")) return json(w.job && u.includes(`organization_id=eq.${ORG}`) ? [w.job] : []);
    if (u.includes("/rest/v1/customers?")) return json(w.hasCustomerRecord ? [{ email: w.customerEmail || null }] : []);
    if (u.includes("/rest/v1/approval_links?")) return json(w.approvalLink ? [w.approvalLink] : []);
    if (u.includes("/rest/v1/organizations?")) return json([w.organization]);
    if (u.includes("/rest/v1/customer_email_log") && method === "HEAD") return new Response(null, { status: 200, headers: { "content-range": `0-0/${u.includes("job_id=eq.") ? w.sentThisHour : w.sentToday}` } });
    if (u.includes("/rest/v1/customer_email_log") && method === "POST") { w.logged = JSON.parse(options.body); return json(null, 201); }
    return json({ message: `unexpected request ${u}` }, 500);
  };
  return w;
}
async function send(w, body, { token = "Bearer user-token", method = "POST" } = {}) {
  globalThis.fetch = w.fetch;
  const response = await handler(new Request("https://fn.test/send-customer-email", {
    method, headers: { "Content-Type": "application/json", ...(token ? { Authorization: token } : {}) },
    body: method === "POST" ? JSON.stringify(body) : undefined
  }));
  return { status: response.status, body: await response.json().catch(() => null), cors: response.headers.get("access-control-allow-origin") };
}
const req = (extra = {}) => ({ organizationId: ORG, jobId: "job-1", kind: "portal-link", ...extra });

let failures = 0;
const check = (label, pass, detail = "") => { if (pass) return; failures++; console.log(`FAIL  ${label}${detail ? `: ${detail}` : ""}`); };
const quiet = console.error; console.error = () => {};

let w = world();
let r = await send(w, req());
check("portal link email is sent", r.status === 200 && r.body.sent === true && r.body.to === "maya@example.com", JSON.stringify(r.body));
check("it goes to the email on the customer's profile, from the shop's name on Backline's address", w.sent.to[0] === "maya@example.com" && w.sent.from === "Junk in Our Trunk via Backline <invite@backlineoffice.com>", w.sent.from);
check("replies go to the shop", w.sent.reply_to === "office@junk.test");
check("the link is built by the server from the job's own portal token", w.sent.text.includes("https://backlineoffice.com/app/#portal=portal-0123456789abcdef0123") && w.sent.html.includes('href="https://backlineoffice.com/app/#portal=portal-0123456789abcdef0123"'));
check("the send is logged for the limits", w.logged?.organization_id === ORG && w.logged.job_id === "job-1" && w.logged.kind === "portal-link" && w.logged.recipient === "maya@example.com" && w.logged.sent_by === USER, JSON.stringify(w.logged));
check("responses allow only the Backline app origin", r.cors === "https://backlineoffice.com");

w = world(); r = await send(w, req({ kind: "portal-update", message: "We are running 20 minutes late.\nSee you soon." }));
check("portal update includes the shop's message", r.status === 200 && w.sent.text.includes("We are running 20 minutes late.") && w.sent.subject === "Update from Junk in Our Trunk");
w = world(); r = await send(w, req({ kind: "approval-request" }));
check("approval request links to the latest approval link", r.status === 200 && w.sent.text.includes("#approval-token=approvaltoken123") && !w.sent.text.includes("#portal="), w.sent?.subject);
w = world(); r = await send(w, req({ kind: "payment-request" }));
check("payment request states the amount and due date from the job", r.status === 200 && w.sent.text.includes("$225.00") && w.sent.text.includes("Wednesday, October 14"), w.sent?.text.split("\n")[2]);
w = world(); w.job.payload.invoice = { number: "BL-1042", amount: 425, payments: [{ amount: 200, kind: "payment" }] };
r = await send(w, req({ kind: "invoice-ready" }));
check("invoice email states the number, the total, and what is still due", r.status === 200 && w.sent.subject === "Your invoice from Junk in Our Trunk" && w.sent.text.includes("invoice BL-1042 for $425.00.") && w.sent.text.includes("$225.00 is still due.") && w.sent.text.includes("#portal=portal-0123456789abcdef0123") && w.logged.kind === "invoice-ready", w.sent?.text.split("\n")[2]);
check("invoice email needs the invoice permission", w.rpcArgs.some((a) => a.requested_permission === "invoice"), JSON.stringify(w.rpcArgs));
w = world(); w.job.payload.invoice = { number: "BL-7", amount: 300, payments: [] };
r = await send(w, req({ kind: "invoice-ready" }));
check("an unpaid invoice does not repeat its total as a balance", r.status === 200 && w.sent.text.includes("invoice BL-7 for $300.00. You can view it") && !w.sent.text.includes("still due"), w.sent?.text.split("\n")[2]);
w = world(); w.job.payload.invoice = { number: "BL-8", amount: 425, payments: [{ amount: 200, kind: "payment" }, { amount: 50, kind: "refund" }] };
r = await send(w, req({ kind: "invoice-ready" }));
check("refunds count back toward the balance", r.status === 200 && w.sent.text.includes("$275.00 is still due."), w.sent?.text.split("\n")[2]);
w = world(); r = await send(w, req({ kind: "invoice-ready" }));
check("a job with no invoice cannot be emailed as one", r.status === 409 && /Save an invoice/.test(r.body.error) && w.sent === null, r.body?.error);
w = world(); w.job.payload.invoice = { number: "BL-9", amount: 100, payments: [{ amount: 100, kind: "payment" }] };
r = await send(w, req({ kind: "invoice-ready" }));
check("a fully paid invoice is not sent as a bill", r.status === 409 && /already paid in full/.test(r.body.error) && w.sent === null, r.body?.error);
w = world(); w.job.payload.invoice = { number: 'BL-1"><script>x</script>', amount: 50, payments: [] };
r = await send(w, req({ kind: "invoice-ready" }));
check("an invoice number cannot inject markup", r.status === 200 && !w.sent.html.includes("<script>") && !w.sent.subject.includes("<"), w.sent?.text.split("\n")[2]);
check("an outdated email on the job is ignored when the profile has one", !JSON.stringify(w.sent).includes("old-address@example.com"));
w = world({ customerEmail: "" }); r = await send(w, req());
check("an email removed from the profile is not replaced by the job's old one", r.status === 400 && /Add an email address/.test(r.body.error) && w.sent === null, r.body?.error);
w = world({ hasCustomerRecord: false, job: { id: "job-1", customer_id: null, payload: { name: "Maya", email: "typed-on-job@example.com", portalToken: "portal-0123456789abcdef0123" } } });
r = await send(w, req());
check("a job with no customer record uses the email typed on the job", r.status === 200 && w.sent.to[0] === "typed-on-job@example.com");

w = world(); r = await send(w, req({ to: "victim@elsewhere.test", recipient: "victim@elsewhere.test", email: "victim@elsewhere.test", url: "https://evil.test", actionUrl: "https://evil.test" }));
check("cannot choose the recipient or the link", r.status === 200 && w.sent.to.length === 1 && w.sent.to[0] === "maya@example.com" && !JSON.stringify(w.sent).includes("evil.test") && !JSON.stringify(w.sent).includes("victim"));
for (const text of ["Pay here https://evil.test/pay", "visit www.evil.test", "go to evil-site.com now"]) {
  w = world(); r = await send(w, req({ kind: "portal-update", message: text }));
  check(`rejects a link in an update ("${text.slice(0, 22)}...")`, r.status === 400 && w.sent === null, r.body?.error);
}
w = world(); r = await send(w, req({ kind: "portal-link", message: "extra words" }));
check("only updates can carry custom text", r.status === 400 && w.sent === null);
w = world(); r = await send(w, req({ kind: "portal-update", message: "x".repeat(1001) }));
check("long messages are refused", r.status === 400 && w.sent === null);
w = world(); r = await send(w, req({ kind: "portal-update", message: '<script>alert(1)</script> & "quotes"' }));
check("message text is escaped in the HTML email", r.status === 200 && w.sent.html.includes("&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quotes&quot;") && !w.sent.html.includes("<script>"));
w = world({ organization: { name: "x", payload: { companySettings: { companyName: 'Evil" <ceo@bank.com>\r\nBcc: all@x.com' } } } }); r = await send(w, req());
check("a shop name cannot inject headers or fake a sender", r.status === 200 && !/[\r\n"]/.test(w.sent.from.replace(/ <invite@backlineoffice\.com>$/, "")) && w.sent.from.endsWith("via Backline <invite@backlineoffice.com>") && (w.sent.from.match(/</g) || []).length === 1, w.sent?.from);

w = world(); r = await send(w, req(), { token: "" });
check("signed-out requests are refused", r.status === 401 && w.sent === null);
w = world({ user: null }); r = await send(w, req());
check("invalid sessions are refused", r.status === 401 && w.sent === null);
for (const [fn, label, status] of [["org_has_permission", "a role without the permission", 403], ["can_access_job", "someone without access to the job", 403], ["has_backline_full_access", "a read-only workspace", 403]]) {
  w = world(); w.permissions[fn] = false; r = await send(w, req());
  check(`${label} is refused`, r.status === status && w.sent === null, r.body?.error);
}
w = world(); await send(w, req({ kind: "approval-request" }));
check("permission checks run as the signed-in user, per kind", w.calls.some((c) => c.includes("rpc/org_has_permission")) && w.calls.filter((c) => c.includes("/rpc/")).length === 3);
w = world({ job: null }); r = await send(w, req());
check("a job outside the workspace is not found", r.status === 404 && w.sent === null);

w = world({ sentToday: 100 }); r = await send(w, req());
check("workspace daily limit stops the send", r.status === 429 && w.sent === null, r.body?.error.slice(0, 60));
w = world({ sentThisHour: 6 }); r = await send(w, req());
check("per-job hourly limit stops the send", r.status === 429 && w.sent === null);
w = world({ customerEmail: "", job: { id: "job-1", customer_id: "8135550101", payload: { name: "Maya", portalToken: "portal-0123456789abcdef0123" } } }); r = await send(w, req());
check("no email on file gives a clear message", r.status === 400 && /Add an email address/.test(r.body.error) && w.sent === null);
w = world({ customerEmail: "not-an-email" }); r = await send(w, req());
check("a malformed stored email is refused", r.status === 400 && w.sent === null);
w = world(); w.job.payload.portalToken = "short"; r = await send(w, req());
check("a job without a valid portal token is refused", r.status === 409 && w.sent === null);
w = world({ approvalLink: null }); r = await send(w, req({ kind: "approval-request" }));
check("approval email needs an approval link", r.status === 409 && w.sent === null);
w = world({ approvalLink: { token: "old", expires_at: "2020-01-01T00:00:00Z" } }); r = await send(w, req({ kind: "approval-request" }));
check("an expired approval link is not emailed", r.status === 409 && w.sent === null);
w = world({ resendStatus: 422 }); r = await send(w, req());
check("an email-service failure is reported and not logged", r.status === 502 && w.logged === null);
for (const bad of [{ organizationId: "nope" }, { jobId: "bad id!" }, { kind: "newsletter" }]) {
  w = world(); r = await send(w, req(bad));
  check(`invalid request is refused (${Object.keys(bad)[0]})`, r.status === 400 && w.sent === null);
}
w = world(); r = await send(w, null, { method: "GET" });
check("only POST is accepted", r.status === 405);

console.error = quiet;
console.log(failures ? `\n${failures} customer email function check(s) FAILED` : "Customer email function test passed.");
process.exit(failures ? 1 : 0);
