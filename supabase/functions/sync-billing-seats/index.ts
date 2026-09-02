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
  if (!token.toLowerCase().startsWith("bearer ")) throw new Error("Sign in before viewing subscription seats.");
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
  if (request.method !== "POST") return json({ error: "Use POST to review Backline subscription seats." }, 405);

  try {
    const body = await request.json().catch(() => ({}));
    const organizationId = String(body.organizationId || "");
    if (!isUuid(organizationId)) return json({ error: "A valid Backline workspace is required." }, 400);

    const user = await verifiedUser(request);
    type OwnerMembership = { organization_id: string };
    const owner = await firstRow<OwnerMembership>(`/rest/v1/organization_members?organization_id=eq.${encodeURIComponent(organizationId)}&user_id=eq.${encodeURIComponent(String(user.id || ""))}&role=eq.owner&select=organization_id&limit=1`);
    if (!owner) return json({ error: "Only the workspace owner can review Backline subscription seats." }, 403);

    type Billing = { plan_key: string | null; status: string | null; additional_seat_quantity: number | null };
    const billing = await firstRow<Billing>(`/rest/v1/organization_billing?organization_id=eq.${encodeURIComponent(organizationId)}&select=plan_key,status,additional_seat_quantity&limit=1`);
    if (!billing || !["trialing", "active", "past_due"].includes(String(billing.status || ""))) {
      return json({ synced: false, reason: "No active subscription to review." });
    }
    return json({
      synced: true,
      changed: false,
      plan: billing.plan_key || "unknown",
      additionalSeatQuantity: Math.max(0, Number(billing.additional_seat_quantity || 0)),
      reason: "Stripe Customer Portal manages plan and additional-user quantities."
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Backline could not review subscription seats." }, 500);
  }
});
