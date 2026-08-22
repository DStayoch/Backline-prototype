import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(resolve(root, path), "utf8");
const schema = read("supabase-schema-20-billing.sql");
const checkout = read("supabase/functions/create-billing-checkout/index.ts");
const portal = read("supabase/functions/create-billing-portal/index.ts");
const webhook = read("supabase/functions/stripe-webhook/index.ts");
const setup = read("supabase/stripe-billing-setup.md");

assert.match(schema, /create table if not exists public\.organization_billing/i, "Billing schema needs a workspace billing record.");
assert.match(schema, /enable row level security/i, "Billing schema must use RLS.");
assert.match(schema, /for select[\s\S]*organization_members/i, "Workspace members should be able to read their billing status.");
assert.doesNotMatch(schema, /for (insert|update|delete)[\s\S]*to authenticated/i, "Clients must not directly mutate billing state.");

assert.match(checkout, /mode: "subscription"/, "Checkout must create subscriptions.");
assert.match(checkout, /role=eq\.owner/, "Only a workspace owner may start billing checkout.");
assert.match(checkout, /STRIPE_SECRET_KEY/, "Stripe credentials must be server-side secrets.");
assert.doesNotMatch(checkout, /payment_method_types/, "Checkout must use Stripe dynamic payment methods.");
assert.match(checkout, /STRIPE_TAX_ENABLED/, "Tax must be a deliberate server-side setting.");

assert.match(portal, /billingPortal\.sessions\.create/, "Billing management must use Stripe Customer Portal.");
assert.match(portal, /role=eq\.owner/, "Only a workspace owner may open billing management.");

assert.match(webhook, /constructEventAsync/, "Webhook signatures must be verified.");
assert.match(webhook, /await request\.text\(\)/, "Webhook verification must use the raw request body.");
assert.match(webhook, /stripe_webhook_events/, "Webhook delivery must be idempotent.");
assert.match(webhook, /customer\.subscription\.updated/, "Webhook must track subscription changes.");
assert.match(webhook, /invoice\.payment_failed/, "Webhook must track failed renewals.");
assert.match(webhook, /parent\?\.subscription_details/, "Webhook must support the current Stripe invoice subscription shape.");

assert.match(setup, /STRIPE_TAX_ENABLED=false/, "Tax must remain off until registrations are confirmed.");
assert.match(setup, /stripe-webhook/i, "Setup must document webhook deployment.");

console.log("Stripe billing contracts passed.");
