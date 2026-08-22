import Stripe from "npm:stripe@22.4.0";

function backlineAppOrigin() {
  const appUrl = Deno.env.get("BACKLINE_APP_URL");
  if (!appUrl) return "*";
  try {
    return new URL(appUrl).origin;
  } catch {
    return "*";
  }
}

const corsHeaders = {
  "Access-Control-Allow-Origin": backlineAppOrigin(),
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

async function supabaseRest(path: string, options: RequestInit = {}) {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRole) throw new Error("Supabase service credentials are not configured.");
  return fetch(`${url}${path}`, {
    ...options,
    headers: { apikey: serviceRole, Authorization: `Bearer ${serviceRole}`, ...(options.headers || {}) }
  });
}

async function verifiedUser(request: Request) {
  const token = request.headers.get("Authorization") || "";
  if (!token.toLowerCase().startsWith("bearer ")) throw new Error("Sign in before managing billing.");
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRole) throw new Error("Supabase service credentials are not configured.");
  const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: serviceRole, Authorization: token } });
  if (!response.ok) throw new Error("Your Backline session could not be verified.");
  return response.json();
}

async function firstRow<T>(path: string): Promise<T | null> {
  const response = await supabaseRest(path, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json();
  return Array.isArray(rows) && rows.length ? rows[0] as T : null;
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Use POST to open the Stripe billing portal." }, 405);
  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const appUrl = Deno.env.get("BACKLINE_APP_URL");
    if (!stripeKey || !appUrl) throw new Error("Stripe billing is not configured on this Backline environment.");
    const body = await request.json().catch(() => ({}));
    const organizationId = String(body.organizationId || "");
    const user = await verifiedUser(request);
    type Member = { organization_id: string };
    type Billing = { stripe_customer_id: string | null };
    const member = await firstRow<Member>(`/rest/v1/organization_members?organization_id=eq.${encodeURIComponent(organizationId)}&user_id=eq.${encodeURIComponent(user.id)}&role=eq.owner&select=organization_id&limit=1`);
    if (!member) return json({ error: "Only the shop owner can manage Backline billing." }, 403);
    const billing = await firstRow<Billing>(`/rest/v1/organization_billing?organization_id=eq.${encodeURIComponent(organizationId)}&select=stripe_customer_id&limit=1`);
    if (!billing?.stripe_customer_id) return json({ error: "Start a Backline subscription before opening billing management." }, 400);

    const stripe = new Stripe(stripeKey, { apiVersion: "2026-07-29.dahlia" });
    const session = await stripe.billingPortal.sessions.create({ customer: billing.stripe_customer_id, return_url: appUrl });
    return json({ url: session.url });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not open the Stripe billing portal." }, 500);
  }
});
