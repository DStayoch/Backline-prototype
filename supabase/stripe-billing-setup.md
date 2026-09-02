# Stripe Billing Setup For Backline

Backline uses Stripe only to charge each shop for its Backline subscription. It does not replace the shop's existing point-of-sale devices or customer-payment provider.

## Before deploying

1. In Stripe test mode, create four separate products and recurring monthly Prices: `Backline Solo` ($49, one active user), `Backline Crew` ($99, up to five active users), `Backline Shop` ($179, includes ten active users), and `Backline Additional User` ($15 for each user above ten). Record the non-secret Price IDs, such as `price_...`. Backline's checkout function applies a 14-day trial to each new subscription.
2. In Stripe Dashboard, configure the Customer Portal. Enable updating payment methods, viewing invoices, cancelling, and switching the Solo, Crew, and Shop plan prices. Do not rely on the portal to sell a first `Backline Additional User` item: Stripe can adjust an add-on item only after it exists. Backline needs a dedicated verified extra-seat purchase flow before that add-on is offered self-service.
3. Leave `STRIPE_TAX_ENABLED` set to `false` until you have confirmed where Backline must collect tax and added an active Stripe Tax registration. Automatic tax without an active registration does not collect tax.

## Supabase secrets

In Supabase Dashboard, open Edge Functions, then Secrets. Add these values there. Never add API keys to GitHub Pages, source files, browser storage, or chat messages.

```text
STRIPE_SECRET_KEY=rk_test_or_rk_live_value
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BACKLINE_SOLO_PRICE_ID=price_...
STRIPE_BACKLINE_CREW_PRICE_ID=price_...
STRIPE_BACKLINE_SHOP_PRICE_ID=price_...
STRIPE_BACKLINE_ADDITIONAL_USER_PRICE_ID=price_...
BACKLINE_APP_URL=https://backlineoffice.com/app/
STRIPE_TAX_ENABLED=false
```

Use a Stripe restricted API key (`rk_`) where practical. Configure it with only the customer, Checkout, subscription, invoice, and customer-portal permissions these functions need. Use test-mode values first.

## Database and functions

Run `supabase-schema-20-billing.sql` in Supabase SQL Editor after schemas 01 through 19. Then deploy these Edge Functions:

```text
create-billing-checkout
create-billing-portal
stripe-webhook
sync-billing-seats
```

Deploy `stripe-webhook` with JWT verification disabled because Stripe authenticates it using the webhook signature. The function verifies that signature before it processes any event.

Run `supabase-schema-25-subscription-seat-limits.sql` after schema 21, then redeploy `stripe-webhook` and `sync-billing-seats`. The database blocks members and pending invites beyond the paid plan capacity. The signed webhook maps Stripe plan Prices and records any existing Shop additional-user quantity; the browser never changes paid billing directly.

## Subscription access control

Run `supabase-schema-21-billing-access.sql` immediately after schema 20, then redeploy `stripe-webhook`. This enforces the subscription on the server, not just in the browser:

- `trialing` and `active` workspaces have full access.
- `past_due` workspaces stay fully usable for seven days, then become read-only until the payment is resolved.
- Canceled, unpaid, paused, incomplete, and never-subscribed workspaces are read-only. They can still view records and download a backup.

Before running schema 21 in your development project, make sure the Backline founder account is in `platform_admins`. That server-controlled role keeps your own development workspace usable without a subscription:

```sql
insert into public.platform_admins (user_id, email, display_name)
select id, email, 'Backline creator'
from auth.users
where lower(email) = lower('derekstayoch@gmail.com')
on conflict (user_id) do update
set email = excluded.email,
    display_name = excluded.display_name;
```

Do not add customer accounts to `platform_admins`.

## Stripe webhook

Create a webhook endpoint in Stripe that points to:

```text
https://YOUR_SUPABASE_PROJECT_REF.supabase.co/functions/v1/stripe-webhook
```

Subscribe it to these events:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
customer.subscription.paused
customer.subscription.resumed
invoice.paid
invoice.payment_failed
invoice.payment_action_required
invoice.finalization_failed
```

Copy that endpoint's signing secret into `STRIPE_WEBHOOK_SECRET`. The webhook, rather than the Checkout return page, updates Backline's billing records after sign-up, renewals, payment failures, and cancellations.

## Failed-webhook response

Before launch, follow `supabase/billing-incident-runbook.md`. Keep the Stripe account email monitored, review the Backline webhook's Pending and Failed deliveries in Stripe Workbench, and use Stripe's **Resend** action after correcting a delivery issue. Backline provides the workspace owner a **Check subscription** refresh and a **I paid but I am still locked** support path on the read-only screen.

## Test before live mode

1. Create a test Checkout session for a workspace owner.
2. Complete it using Stripe's test payment method in Stripe Checkout.
3. Confirm an `organization_billing` row shows the customer, subscription, mapped Price, plan key, additional-seat quantity, and `active` or `trialing` status.
4. Open the customer portal and test a plan change.
5. Confirm the `customer.subscription.updated` webhook updates the same billing row and that Backline applies the new member limit.

Only replace test values with live values after the full flow works in test mode.
