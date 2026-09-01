# Backline Supabase Production Setup

Last updated: September 1, 2026

Use this after creating the production Supabase project and before inviting a real beta shop.

## 1. Create The Production Project

- Create a fresh Supabase project for production beta.
- Do not reuse the local/dev Supabase project.
- Save the project URL and publishable/anon key for GitHub Pages:
  - `BACKLINE_SUPABASE_URL`
  - `BACKLINE_SUPABASE_ANON_KEY`

## 2. Run The Database Schema

Preferred:

- Open Supabase SQL Editor.
- Run `supabase-schema.sql`.

If the SQL editor fails with a line 0 or paste-size issue, run the split files in this order:

1. `supabase-schema-01-tables.sql`
2. `supabase-schema-02-function.sql`
3. `supabase-schema-03-policies.sql`
4. `supabase-schema-04-indexes.sql`
5. `supabase-schema-05-approval-rpc.sql`
6. `supabase-schema-06-job-files.sql`
7. `supabase-schema-07-team-management.sql`
8. `supabase-schema-08-deleted-jobs.sql`
9. `supabase-schema-09-approval-signatures.sql`
10. `supabase-schema-10-team-display-names.sql`
11. `supabase-schema-11-activity-log.sql`
12. `supabase-schema-12-pricebook.sql`
13. `supabase-schema-13-company-settings.sql`
14. `supabase-schema-14-customer-portal.sql`
15. `supabase-schema-15-custom-roles.sql`
16. `supabase-schema-16-security-hardening.sql`
17. `supabase-schema-17-public-token-hardening.sql`
18. `supabase-schema-18-activity-append-only.sql`
19. `supabase-schema-19-platform-admins.sql`
20. `supabase-schema-20-billing.sql`
21. `supabase-schema-21-billing-access.sql`
22. `supabase-schema-22-secure-sync.sql`
23. `supabase-schema-23-launch-hardening.sql`
24. `supabase-schema-24-public-link-guardrails.sql`

If `supabase-schema-07-team-management.sql` hits a line 0 paste error, run these three files instead of step 7:

1. `supabase-schema-07a-team-tables.sql`
2. `supabase-schema-07b-team-functions.sql`
3. `supabase-schema-07c-team-policies.sql`

For an existing workspace already through schema 23, run `supabase-schema-24-public-link-guardrails.sql` before loading the matching Backline release. It keeps reusable customer portal links, rejects malformed portal tokens, and limits reply bursts from a single link.

## 3. Add Foundry Operator Access

Create or sign in with the Backline account that should have Foundry access. Then run this in Supabase SQL Editor after replacing the email:

```sql
insert into public.platform_admins (user_id, email, display_name)
select id, email, 'Backline creator'
from auth.users
where lower(email) = lower('creator@example.com')
on conflict (user_id) do update
set email = excluded.email,
    display_name = excluded.display_name;
```

Foundry access is separate from shop owner/admin roles. Shop owners cannot grant it from Backline.

## 4. Configure Auth URLs

In Supabase Auth URL settings:

- Set Site URL to the hosted Backline HTTPS URL:
  `https://backlineoffice.com/app/`
- Add the hosted Backline HTTPS URL to allowed redirect URLs:
  `https://backlineoffice.com/app/**`
- Do not use `localhost`, `127.0.0.1`, or `file://` for production auth URLs.
- Confirm account email links return to the hosted Backline URL, not a local machine URL.

## 5. Enable Google And Facebook OAuth

In Supabase Auth provider settings:

- Enable Google.
- Enable Facebook.
- Copy the Supabase callback URL from each provider panel into the matching Google/Facebook developer console.
- Add the Google Client ID/secret and Facebook App ID/secret back into Supabase.
- Keep the hosted Backline URL above as the return URL for the app.

OAuth sign-in is started by Backline, but Google, Facebook, and Supabase own the credential handling.

## 6. Confirm Storage

The schema creates and scopes the `job-files` storage bucket.

After the hosted app is connected:

- Upload a file as owner/admin.
- Upload a file as technician.
- Open a customer-visible file from the customer portal.
- Confirm files are stored under the correct organization folder.

## 7. Deploy Team Invite Email Function

Deploy `supabase/functions/send-team-invite` to the production Supabase project.

Required secrets:

```bash
RESEND_API_KEY=your_resend_api_key
INVITE_FROM_EMAIL="Backline <invite@yourdomain.com>"
```

Optional:

```bash
INVITE_REPLY_TO_EMAIL=office@yourshop.com
```

For production invites, verify a real domain in Resend and use that domain in `INVITE_FROM_EMAIL`. Resend test mode only sends to the verified account email.

## 8. Connect Hosted Backline

In GitHub:

- Set repository variable `BACKLINE_SUPABASE_URL`.
- Set repository secret `BACKLINE_SUPABASE_ANON_KEY`.
- Deploy GitHub Pages from Actions.

Backline generates `supabase-config.js` during the Pages workflow. Do not commit production `supabase-config.js`.

## 9. Post-Setup Checks

In hosted Backline:

- Sign in as owner.
- Run **Settings** -> **Test secure connection**.
- Create a test shop.
- Save workspace settings and refresh.
- Invite a test team member.
- Confirm the invitee attaches to the same shop.
- Open Foundry and confirm platform access.
- Create a test job, approval link, customer portal link, and customer-visible file.
- Confirm all customer-facing links use the hosted HTTPS URL.

Only move to a pilot shop after these checks pass or known issues are documented.
