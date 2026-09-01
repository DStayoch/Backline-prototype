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
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function supabaseRest(path: string, options: RequestInit = {}) {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRole) throw new Error("Supabase service credentials are not configured.");
  return fetch(`${url}${path}`, {
    ...options,
    headers: {
      apikey: serviceRole,
      Authorization: `Bearer ${serviceRole}`,
      ...(options.headers || {})
    }
  });
}

async function verifiedUser(request: Request) {
  const token = request.headers.get("Authorization") || "";
  if (!token.toLowerCase().startsWith("bearer ")) throw new Error("Sign in before updating subscription seats.");
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRole) throw new Error("Supabase service credentials are not configured.");
  const response = await fetch(`${url}/auth/v1/user`, {
    headers: { apikey: serviceRole, Authorization: token }
  });
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
  if (request.method !== "POST") return json({ error: "Use POST to reconcile Backline subscription seats." }, 405);

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const additionalUserPriceId = Deno.env.get("STRIPE_BACKLINE_ADDITIONAL_USER_PRICE_ID");
    if (!stripeKey || !additionalUserPriceId) {
      throw new Error("Backline seat billing is not configured on this environment.");
    }

    const body = await request.json().catch(() => ({}));
    const organizationId = String(body.organizationId || "");
    if (!isUuid(organizationId)) return json({ error: "A valid Backline workspace is required." }, 400);

    const user = await verifiedUser(request);
    type OwnerMembership = { organization_id: string };
    const owner = await firstRow<OwnerMembership>(`/rest/v1/organization_members?organization_id=eq.${encodeURIComponent(organizationId)}&user_id=eq.${encodeURIComponent(String(user.id || ""))}&role=eq.owner&select=organization_id&limit=1`);
    if (!owner) return json({ error: "Only the shop owner can reconcile Backline subscription seats." }, 403);

    type Billing = { stripe_subscription_id: string | null; plan_key: string | null; status: string | null };
    const billing = await firstRow<Billing>(`/rest/v1/organization_billing?organization_id=eq.${encodeURIComponent(organizationId)}&select=stripe_subscription_id,plan_key,status&limit=1`);
    if (!billing?.stripe_subscription_id || !["trialing", "active", "past_due"].includes(String(billing.status || ""))) {
      return json({ synced: false, reason: "No active subscription to reconcile." });
    }
    if (String(billing.plan_key || "").toLowerCase() !== "shop") {
      return json({ synced: false, reason: "This plan does not use additional-user seats." });
    }

    type Member = { user_id: string };
    const membersResponse = await supabaseRest(`/rest/v1/organization_members?organization_id=eq.${encodeURIComponent(organizationId)}&select=user_id`);
    if (!membersResponse.ok) throw new Error(await membersResponse.text());
    const members = await membersResponse.json() as Member[];
    const memberCount = Array.isArray(members) ? members.length : 0;
    const additionalUserCount = Math.max(0, memberCount - 10);

    const stripe = new Stripe(stripeKey, { apiVersion: "2026-07-29.dahlia" });
    const subscription = await stripe.subscriptions.retrieve(billing.stripe_subscription_id);
    const existingSeatItem = subscription.items.data.find((item) => item.price.id === additionalUserPriceId);
    const currentQuantity = existingSeatItem?.quantity || 0;

    if (currentQuantity === additionalUserCount) {
      return json({ synced: true, changed: false, memberCount, additionalUserCount });
    }

    if (existingSeatItem && additionalUserCount === 0) {
      await stripe.subscriptionItems.del(existingSeatItem.id, { proration_behavior: "create_prorations" });
    } else if (existingSeatItem) {
      await stripe.subscriptionItems.update(existingSeatItem.id, {
        quantity: additionalUserCount,
        proration_behavior: "create_prorations"
      });
    } else {
      await stripe.subscriptionItems.create({
        subscription: subscription.id,
        price: additionalUserPriceId,
        quantity: additionalUserCount,
        proration_behavior: "create_prorations"
      });
    }

    return json({ synced: true, changed: true, memberCount, additionalUserCount });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Backline could not reconcile subscription seats." }, 500);
  }
});
