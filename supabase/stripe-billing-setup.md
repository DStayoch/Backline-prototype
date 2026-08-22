# Stripe Billing Setup For Backline

Backline uses Stripe only to charge each shop for its Backline subscription. It does not replace the shop's existing point-of-sale devices or customer-payment provider.

## Before deploying

1. In Stripe test mode, create separate products for each Backline plan you will sell. Give each product a recurring monthly Price. Record the non-secret Price IDs, such as `price_...`.
2. In Stripe Dashboard, configure the Customer Portal. Enable the actions you want shop owners to use, such as updating payment methods, viewing invoices, cancelling, and switching plans.
3. Leave `STRIPE_TAX_ENABLED` set to `false` until you have confirmed where Backline must collect tax and added an active Stripe Tax registration. Automatic tax without an active registration does not collect tax.

## Supabase secrets

In Supabase Dashboard, open Edge Functions, then Secrets. Add these values there. Never add API keys to GitHub Pages, source files, browser storage, or chat messages.

```text
STRIPE_SECRET_KEY=rk_test_or_rk_live_value
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BACKLINE_STARTER_PRICE_ID=price_...
STRIPE_BACKLINE_PRO_PRICE_ID=price_...
BACKLINE_APP_URL=https://dstayoch.github.io/Backline-prototype/
STRIPE_TAX_ENABLED=false
```

Use a Stripe restricted API key (`rk_`) where practical. Configure it with only the customer, Checkout, subscription, invoice, and customer-portal permissions these functions need. Use test-mode values first.

## Database and functions

Run `supabase-schema-20-billing.sql` in Supabase SQL Editor after schemas 01 through 19. Then deploy these Edge Functions:

```text
create-billing-checkout
create-billing-portal
stripe-webhook
```

Deploy `stripe-webhook` with JWT verification disabled because Stripe authenticates it using the webhook signature. The function verifies that signature before it processes any event.

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

## Test before live mode

1. Create a test Checkout session for a workspace owner.
2. Complete it using Stripe's test payment method in Stripe Checkout.
3. Confirm an `organization_billing` row shows the customer, subscription, Price, and `active` or `trialing` status.
4. Open the customer portal and test a payment-method update or cancellation.
5. Confirm the relevant webhook events appear in Stripe and update the same billing row.

Only replace test values with live values after the full flow works in test mode.
