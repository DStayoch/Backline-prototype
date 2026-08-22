import Stripe from "npm:stripe@22.4.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("BACKLINE_APP_URL") || "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
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
  if (!token.toLowerCase().startsWith("bearer ")) throw new Error("Sign in before starting a subscription.");
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
  if (request.method !== "POST") return json({ error: "Use POST to start a Backline subscription checkout." }, 405);

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const appUrl = Deno.env.get("BACKLINE_APP_URL");
    if (!stripeKey || !appUrl) throw new Error("Stripe billing is not configured on this Backline environment.");

    const body = await request.json().catch(() => ({}));
    const organizationId = String(body.organizationId || "");
    const planKey = String(body.plan || "").toLowerCase();
    const plans: Record<string, { priceId: string | undefined; memberCap: number; allowsAdditionalUsers?: boolean }> = {
      solo: { priceId: Deno.env.get("STRIPE_BACKLINE_SOLO_PRICE_ID"), memberCap: 1 },
      crew: { priceId: Deno.env.get("STRIPE_BACKLINE_CREW_PRICE_ID"), memberCap: 5 },
      shop: { priceId: Deno.env.get("STRIPE_BACKLINE_SHOP_PRICE_ID"), memberCap: 10, allowsAdditionalUsers: true }
    };
    const plan = plans[planKey];
    if (!organizationId || !plan?.priceId) return json({ error: "Choose an available Backline plan before checkout." }, 400);

    const user = await verifiedUser(request);
    type Member = { organization_id: string };
    const member = await firstRow<Member>(`/rest/v1/organization_members?organization_id=eq.${encodeURIComponent(organizationId)}&user_id=eq.${encodeURIComponent(user.id)}&role=eq.owner&select=organization_id&limit=1`);
    if (!member) return json({ error: "Only the shop owner can manage Backline billing." }, 403);

    const teamResponse = await supabaseRest(`/rest/v1/organization_members?organization_id=eq.${encodeURIComponent(organizationId)}&select=user_id`);
    if (!teamResponse.ok) throw new Error(await teamResponse.text());
    const teamMembers = await teamResponse.json();
    if (!Array.isArray(teamMembers)) throw new Error("Backline could not verify the active team size.");
    const additionalUserCount = Math.max(0, teamMembers.length - plan.memberCap);
    if (additionalUserCount && !plan.allowsAdditionalUsers) {
      return json({ error: `This shop has more than ${plan.memberCap} active Backline users. Choose a larger plan before checkout.` }, 400);
    }
    const additionalUserPriceId = Deno.env.get("STRIPE_BACKLINE_ADDITIONAL_USER_PRICE_ID");
    if (additionalUserCount && !additionalUserPriceId) {
      throw new Error("Additional-user billing is not configured for this Backline environment.");
    }

    type Organization = { id: string; name: string };
    type Billing = { stripe_customer_id: string | null };
    const organization = await firstRow<Organization>(`/rest/v1/organizations?id=eq.${encodeURIComponent(organizationId)}&select=id,name&limit=1`);
    if (!organization) return json({ error: "This Backline workspace was not found." }, 404);
    const billing = await firstRow<Billing>(`/rest/v1/organization_billing?organization_id=eq.${encodeURIComponent(organizationId)}&select=stripe_customer_id&limit=1`);

    const stripe = new Stripe(stripeKey, { apiVersion: "2026-07-29.dahlia" });
    let customerId = billing?.stripe_customer_id || "";
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: String(user.email || "") || undefined,
        name: organization.name,
        metadata: { backline_organization_id: organizationId }
      });
      customerId = customer.id;
      const response = await supabaseRest("/rest/v1/organization_billing?on_conflict=organization_id", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ organization_id: organizationId, stripe_customer_id: customerId, updated_at: new Date().toISOString() })
      });
      if (!response.ok) throw new Error(await response.text());
    }

    const automaticTax = Deno.env.get("STRIPE_TAX_ENABLED") === "true";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      integration_identifier: "backline_billing_checkout_xvupjldq",
      customer: customerId,
      client_reference_id: organizationId,
      line_items: [
        { price: plan.priceId, quantity: 1 },
        ...(additionalUserCount ? [{ price: additionalUserPriceId, quantity: additionalUserCount }] : [])
      ],
      allow_promotion_codes: true,
      billing_address_collection: automaticTax ? "required" : "auto",
      ...(automaticTax ? { automatic_tax: { enabled: true } } : {}),
      success_url: `${appUrl}?billing=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}?billing=canceled`,
      metadata: { backline_organization_id: organizationId, backline_plan_key: planKey, backline_member_cap: String(plan.memberCap), backline_additional_user_count: String(additionalUserCount) },
      subscription_data: {
        trial_period_days: 14,
        metadata: { backline_organization_id: organizationId, backline_plan_key: planKey, backline_member_cap: String(plan.memberCap), backline_additional_user_count: String(additionalUserCount) }
      }
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    return json({ url: session.url });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not start Stripe checkout." }, 500);
  }
});
