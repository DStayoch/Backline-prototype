# Backline Billing Incident Runbook

Use this runbook when a workspace owner reports that they paid but Backline is still read-only, or when Stripe reports a failed webhook delivery.

## Set up before launch

1. Keep the Stripe account owner email (`backline.application@gmail.com`) monitored. Stripe emails account users when webhook delivery fails.
2. In Stripe Workbench, keep the Backline `stripe-webhook` destination subscribed only to the billing events listed in `stripe-billing-setup.md`.
3. For the first 30 days after launch, review Workbench > Webhooks > `stripe-webhook` > Events once each business day and investigate every Pending or Failed delivery.
4. Keep `support@backlineoffice.com` forwarding to the monitored support inbox. Owners can use the Backline subscription screen to start a billing-support email with their workspace details.

## Paid but still locked

1. Ask the owner to open the Backline subscription screen and select **Check subscription**.
2. If the workspace remains read-only, confirm the signed-in email and workspace ID in the support message.
3. In Stripe Workbench > Webhooks > `stripe-webhook` > Events, find the relevant `checkout.session.completed` or `customer.subscription.updated` event. Confirm the delivery returned `200`.
4. If the event is Pending or Failed, read the response, correct the underlying configuration, then use **Resend** for that event.
5. In Supabase Table Editor, find the row in `organization_billing` for that workspace. Confirm `status` is `trialing` or `active`, and that its `plan_key` and Stripe subscription ID match Stripe.
6. Ask the owner to select **Check subscription** again. The server access check should now return full access.
7. If Stripe is paid and the webhook is delivered but the workspace is still locked, add a short `workspace_access_overrides` record only while investigating. Record the support case and remove the override after billing is corrected.

## Failed webhook delivery

1. Stripe automatically retries failed live webhook deliveries for up to three days. Do not disable the Backline endpoint while an incident is open.
2. In Workbench, open the failed delivery and inspect its response status and body.
3. For signature errors, compare the endpoint signing secret with Supabase `STRIPE_WEBHOOK_SECRET`, then redeploy `stripe-webhook` and resend the event.
4. For an unmapped Price ID, update the matching Supabase Price-ID secret, redeploy `stripe-webhook`, and resend the event.
5. For a Supabase outage or `5xx`, wait for service recovery, confirm a test delivery returns `200`, then resend the oldest affected billing events first.
6. Record the incident date, Stripe event ID, affected workspace ID, cause, fix, and confirmation that the billing row updated.

## Do not do this

- Do not change `organization_billing` from the browser.
- Do not give a customer `platform_admins` access.
- Do not leave a support override without an expiration and a case note.
