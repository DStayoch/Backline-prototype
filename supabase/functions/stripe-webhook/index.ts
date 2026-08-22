import Stripe from "npm:stripe@22.4.0";

type BillingPatch = Record<string, unknown>;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

function asUnixTimestamp(value: unknown) {
  return typeof value === "number" ? new Date(value * 1000).toISOString() : null;
}

function stripeId(value: string | { id: string } | null | undefined) {
  return typeof value === "string" ? value : value?.id || null;
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

async function firstRow<T>(path: string): Promise<T | null> {
  const response = await supabaseRest(path, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(await response.text());
  const rows = await response.json();
  return Array.isArray(rows) && rows.length ? rows[0] as T : null;
}

async function wasProcessed(eventId: string) {
  type EventRow = { id: string };
  return Boolean(await firstRow<EventRow>(`/rest/v1/stripe_webhook_events?id=eq.${encodeURIComponent(eventId)}&select=id&limit=1`));
}

async function recordEvent(event: Stripe.Event) {
  const response = await supabaseRest("/rest/v1/stripe_webhook_events", {
    method: "POST",
    headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({
      id: event.id,
      event_type: event.type,
      created_at_stripe: asUnixTimestamp(event.created)
    })
  });
  if (!response.ok && response.status !== 409) throw new Error(await response.text());
}

async function billingForOrganization(organizationId: string) {
  type BillingRow = { last_stripe_event_created_at: string | null };
  return firstRow<BillingRow>(`/rest/v1/organization_billing?organization_id=eq.${encodeURIComponent(organizationId)}&select=last_stripe_event_created_at&limit=1`);
}

async function billingForSubscription(subscriptionId: string) {
  type BillingRow = { organization_id: string; last_stripe_event_created_at: string | null };
  return firstRow<BillingRow>(`/rest/v1/organization_billing?stripe_subscription_id=eq.${encodeURIComponent(subscriptionId)}&select=organization_id,last_stripe_event_created_at&limit=1`);
}

async function updateBilling(organizationId: string, patch: BillingPatch, eventCreatedAt: number) {
  const existing = await billingForOrganization(organizationId);
  const recordedAt = existing?.last_stripe_event_created_at ? Date.parse(existing.last_stripe_event_created_at) : 0;
  if (Number.isFinite(recordedAt) && recordedAt > eventCreatedAt * 1000) return;

  const response = await supabaseRest(`/rest/v1/organization_billing?organization_id=eq.${encodeURIComponent(organizationId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify({
      organization_id: organizationId,
      ...patch,
      last_stripe_event_created_at: asUnixTimestamp(eventCreatedAt),
      updated_at: new Date().toISOString()
    })
  });
  if (!response.ok) throw new Error(await response.text());
}

function organizationIdFromMetadata(metadata: Stripe.Metadata | null | undefined) {
  return asString(metadata?.backline_organization_id);
}

async function handleSubscription(subscription: Stripe.Subscription, event: Stripe.Event) {
  const organizationId = organizationIdFromMetadata(subscription.metadata);
  if (!organizationId) return;
  const item = subscription.items.data[0];
  await updateBilling(organizationId, {
    stripe_customer_id: stripeId(subscription.customer),
    stripe_subscription_id: subscription.id,
    stripe_price_id: item?.price?.id || null,
    plan_key: asString(subscription.metadata.backline_plan_key) || null,
    status: subscription.status,
    cancel_at_period_end: subscription.cancel_at_period_end,
    current_period_end: asUnixTimestamp(subscription.current_period_end),
    trial_end: asUnixTimestamp(subscription.trial_end)
  }, event.created);
}

async function handleCheckout(session: Stripe.Checkout.Session, event: Stripe.Event) {
  const organizationId = organizationIdFromMetadata(session.metadata) || asString(session.client_reference_id);
  const subscriptionId = stripeId(session.subscription);
  if (!organizationId || !subscriptionId || session.payment_status === "unpaid") return;
  await updateBilling(organizationId, {
    stripe_customer_id: stripeId(session.customer),
    stripe_subscription_id: subscriptionId,
    plan_key: asString(session.metadata?.backline_plan_key) || null
  }, event.created);
}

async function handleInvoice(invoice: Stripe.Invoice, event: Stripe.Event) {
  // Stripe's newest Invoice shape nests the source subscription under parent,
  // while older webhook payloads can still provide the legacy top-level field.
  const invoiceData = invoice as Stripe.Invoice & {
    subscription?: string | { id: string } | null;
    parent?: { subscription_details?: { subscription?: string | { id: string } | null } | null } | null;
  };
  const subscriptionId = stripeId(
    invoiceData.parent?.subscription_details?.subscription || invoiceData.subscription
  );
  if (!subscriptionId) return;
  const billing = await billingForSubscription(subscriptionId);
  if (!billing) return;
  await updateBilling(billing.organization_id, {
    latest_invoice_id: invoice.id
  }, event.created);
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "Use POST for Stripe webhooks." }, 405);

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const signingSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const signature = request.headers.get("stripe-signature");
    if (!stripeKey || !signingSecret) throw new Error("Stripe webhook secrets are not configured.");
    if (!signature) return json({ error: "Missing Stripe signature." }, 400);

    const stripe = new Stripe(stripeKey, { apiVersion: "2026-07-29.dahlia" });
    const rawBody = await request.text();
    const event = await stripe.webhooks.constructEventAsync(rawBody, signature, signingSecret);
    if (await wasProcessed(event.id)) return json({ received: true });

    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded":
        await handleCheckout(event.data.object as Stripe.Checkout.Session, event);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        await handleSubscription(event.data.object as Stripe.Subscription, event);
        break;
      case "invoice.paid":
      case "invoice.payment_failed":
      case "invoice.payment_action_required":
      case "invoice.finalization_failed":
        await handleInvoice(event.data.object as Stripe.Invoice, event);
        break;
      default:
        break;
    }

    await recordEvent(event);
    return json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Stripe webhook could not be processed.";
    const status = message.includes("signature") ? 400 : 500;
    return json({ error: message }, status);
  }
});
