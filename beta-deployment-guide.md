# Backline Beta Deployment Guide

Last updated: June 19, 2026

Use this when moving Backline from local testing to a hosted beta URL.

## 1. Prepare Production Services

- Create a fresh production Supabase project.
- Follow `supabase-production-setup.md`.
- Run `supabase-schema.sql`, or run the split schema files through `supabase-schema-22-secure-sync.sql`.
- Add trusted Backline operators to `platform_admins` for Foundry access.
- Configure Supabase Auth:
  - Site URL: hosted Backline HTTPS URL
  - Redirect URLs: hosted Backline HTTPS URL
- Deploy the `send-team-invite` Edge Function in the same Supabase project.
- Set Edge Function secrets:
  - `RESEND_API_KEY`
  - `INVITE_FROM_EMAIL`
  - optional `INVITE_REPLY_TO_EMAIL`
- Verify a real sending domain in Resend before sending invites to non-test recipients.

## 2. Configure GitHub Pages

In GitHub repository settings:

- Set Pages source to GitHub Actions.
- Add repository variable `BACKLINE_SUPABASE_URL`.
- Add repository secret `BACKLINE_SUPABASE_ANON_KEY`.

The Pages workflow generates `supabase-config.js` inside `_site` during deploy. Do not commit a production `supabase-config.js`.

## 3. Preflight Before Push

Run:

```bash
npm test
npm run deploy:preflight
```

Confirm:

- No real Supabase keys are committed.
- The production config points to the production Supabase project only.
- Local/dev Supabase projects are not used for real shops.
- Phone/SMS beta mode is documented: live provider, portal-only replies, or manual logged messages.

## 4. Deploy

- Push to `main`, or run the GitHub Pages workflow manually.
- Open the deployed Pages URL.
- Sign in as the production owner account.
- Open Settings and run **Test secure connection**.
- Open Foundry and confirm production readiness status.

## 5. Hosted URL Checks

Before inviting a real shop, confirm these links use the hosted HTTPS URL and never `localhost`, `127.0.0.1`, or `file://`:

- Team invite link
- Customer portal link
- Approval link
- Customer-visible file link
- Receipt or invoice link

## 6. Beta Walkthrough

Run `beta-walkthrough.md` end to end on the hosted URL:

- Owner setup
- Team invite
- Dispatcher schedule
- Technician field workflow
- Customer approval
- Invoice and partial/full payment
- Customer portal reply
- Mobile spot check
- Data safety check

Only invite a real pilot shop after the hosted walkthrough passes or known issues are explicitly documented.
