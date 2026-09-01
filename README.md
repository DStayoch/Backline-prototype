# Backline Prototype

Backline is an MVP for an AI-first missed-call recovery dashboard for small trade contractors. It runs locally by default and can be connected to a secure Supabase database with login.

The first wedge is simple:

> Never lose a job because nobody answered the phone.

## What Is Included

- Create and manage real recovered-call jobs
- Save data in browser IndexedDB/local fallback
- Optional secure Supabase login and database mode
- Customer and job database records
- Search and filter the job inbox
- Book jobs, send estimate/invoice status changes, and mark paid
- Add notes, outbound SMS entries, and customer replies
- Toggle follow-up automations
- Export and import workspace data
- View live schedule and pipeline metrics
- Product brief, MVP spec, and validation plan

## Local Preview

Open `index.html` in a browser.

You can also serve it locally:

```bash
python -m http.server 8765
```

Or with Node:

```bash
npm start
```

On this Windows workspace you can also double-click:

```text
start-backline.bat
```

Or run the bundled Node runtime directly:

```powershell
C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe server.js
```

Then visit:

```text
http://127.0.0.1:8765
```

For phone/mobile testing on the same Wi-Fi or local network, use the `Backline mobile/LAN URL` printed by `server.js`, such as:

```text
http://192.168.1.107:8765
```

`127.0.0.1` only works on the computer running Backline; on a phone it points back to the phone.

## Test

```bash
npm test
```

Or run the bundled Node runtime directly:

```powershell
C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\smoke-test.mjs
C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\debug-sweep.mjs
```

The tests check JavaScript syntax, core MVP wiring, DOM selector consistency, role/view coverage, approval RPC wiring, and recent regression-prone flows.

## Secure Database Mode

Backline can use Supabase Auth + Postgres + Row Level Security.

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `supabase-schema.sql`, or run the split schema files in order:
   - `supabase-schema-01-tables.sql`
   - `supabase-schema-02-function.sql`
   - `supabase-schema-03-policies.sql`
   - `supabase-schema-04-indexes.sql`
   - `supabase-schema-05-approval-rpc.sql`
   - `supabase-schema-06-job-files.sql`
   - `supabase-schema-07-team-management.sql`
   - Or, if Supabase shows a line 0 paste error on chunk 07, run these smaller files instead:
     - `supabase-schema-07a-team-tables.sql`
     - `supabase-schema-07b-team-functions.sql`
     - `supabase-schema-07c-team-policies.sql`
   - `supabase-schema-08-deleted-jobs.sql`
   - `supabase-schema-09-approval-signatures.sql`
   - `supabase-schema-10-team-display-names.sql`
   - `supabase-schema-11-activity-log.sql`
   - `supabase-schema-12-pricebook.sql`
   - `supabase-schema-13-company-settings.sql`
   - `supabase-schema-14-customer-portal.sql`
   - `supabase-schema-15-custom-roles.sql`
   - `supabase-schema-16-security-hardening.sql`
   - `supabase-schema-17-public-token-hardening.sql`
   - `supabase-schema-18-activity-append-only.sql`
   - `supabase-schema-19-platform-admins.sql`
   - `supabase-schema-20-billing.sql`
   - `supabase-schema-21-billing-access.sql`
   - `supabase-schema-22-secure-sync.sql`
   - `supabase-schema-23-launch-hardening.sql`
   - `supabase-schema-24-public-link-guardrails.sql`
4. Copy the right config template to `supabase-config.js`:
   - Local testing: start from `supabase-config.local.example.js`
   - Production beta: start from `supabase-config.production.example.js`
   - Generic template: `supabase-config.example.js`
5. Fill in the matching Supabase project URL and anon key.
6. Open the app and create/sign in to an account.
7. In Backline, open **Settings** -> **Test secure connection** and confirm auth, workspace access, and job records are reachable.

When Supabase is configured, the app requires login and stores customers/jobs in the secure remote database. When it is not configured, it continues using the browser database for local prototyping.

Use separate Supabase projects for local testing and production beta. Do not point a hosted production Backline URL at the same project used for experimental local testing. See `deployment-notes.md` for the promotion checklist.

For production setup, follow `supabase-production-setup.md` before inviting a real shop.

If sign-in says the credentials are invalid, use **Create account** first. Supabase may also require email confirmation before sign-in; check your inbox, then return to the app and sign in.

Team access uses the `organization_members.role` field. Built-in roles are `owner`, `admin`, `dispatcher`, and `tech`; owner-defined custom role slugs are also supported after `supabase-schema-15-custom-roles.sql` removes the original role check constraints.

Creator/platform access is separate from shop roles. Run `supabase-schema-19-platform-admins.sql`, then manually add trusted Backline operator accounts to `platform_admins` from the Supabase SQL editor. Follow it with schemas 20 through 24 for billing access, guarded job/customer sync, field-assignment enforcement, ownership protection, and reusable-portal abuse protection. Shop owners and custom roles cannot grant creator access from the app.

Team invites use `team_invites` plus the `accept_team_invite()` RPC from `supabase-schema-07-team-management.sql`. Invite someone by email in Backline, then have them create/sign in with that same email so the invite can attach them to the shop.

To send invite emails directly from Backline, deploy the Supabase Edge Function in `supabase/functions/send-team-invite` and set these function secrets:

```bash
RESEND_API_KEY=your_resend_api_key
INVITE_FROM_EMAIL="Backline <invite@yourdomain.com>"
```

Optional:

```bash
INVITE_REPLY_TO_EMAIL=office@yourshop.com
```

The browser app calls `send-team-invite` from the signed-in session. The function verifies the requester is an owner/admin for the invite's shop before sending through Resend. If the function or email key is not configured, use **Copy instructions** in the Team tab as the fallback.

With the Supabase CLI, the deploy flow is:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key INVITE_FROM_EMAIL="Backline <invite@yourdomain.com>"
supabase functions deploy send-team-invite
```

For production invite emails, verify a real sending domain in Resend and use an address from that domain for `INVITE_FROM_EMAIL`. Resend test mode only sends to the verified account email.

Deleted job history uses `deleted_jobs` from `supabase-schema-08-deleted-jobs.sql`. Backline keeps deleted jobs visible in the Jobs database tab and lets permitted users restore them.

Secure approval links use `#approval-token=...` URLs. Customers can open those links without a shop login, review only the linked estimate, then approve/decline through Supabase RPC functions.

If Supabase says it cannot find `public.get_approval_by_token(input_token)` in the schema cache, rerun `supabase-schema-05-approval-rpc.sql` in the SQL editor. The file ends with a PostgREST schema cache reload so the browser API can see the function.

After approval-flow changes, rerun `supabase-schema-05-approval-rpc.sql` too. The approval link submit function stores decline reasons and blocks repeat decisions after a link has been used once.

Job photos and attachments use the `job-files` Supabase Storage bucket in secure mode. In local prototype mode, uploads are kept as browser object URLs for the current browser session.

Before using a production URL, add that URL to the Supabase Auth URL configuration so account confirmation and future auth emails return users to the right Backline workspace URL.

For this deployment, use:

```text
https://backlineoffice.com/app/
```

In Supabase, open **Authentication** -> **URL Configuration**:

- Set **Site URL** to the hosted Backline URL above.
- Add `https://backlineoffice.com/app/**` to **Redirect URLs**.
- Keep local URLs only in a local/dev Supabase project, not production.

Backline also supports Google and Facebook sign-in through Supabase OAuth. Enable each provider in **Authentication** -> **Providers**, add the provider credentials from Google/Facebook, and use the Supabase callback URL shown in that provider panel when configuring Google/Facebook.

## GitHub Pages

This repo includes a GitHub Pages workflow. After pushing to GitHub:

1. Open the repository on GitHub.
2. Go to `Settings` -> `Secrets and variables` -> `Actions`.
3. Add a repository variable named `BACKLINE_SUPABASE_URL` with the production Supabase project URL.
4. Add a repository secret named `BACKLINE_SUPABASE_ANON_KEY` with the production Supabase publishable/anon key.
5. Go to `Settings` -> `Pages`.
6. Set `Build and deployment` source to `GitHub Actions`.
7. Push to `main`.

The `Deploy GitHub Pages` workflow builds a clean `_site` folder, generates `supabase-config.js` from those GitHub settings, and publishes only the static app files. Your local `supabase-config.js` is ignored so local testing does not leak into production.

Before pushing a production deploy, run:

```bash
npm run deploy:preflight
```

## Product Docs

- `product-brief.md`
- `mvp-spec.md`
- `validation-plan.md`
- `production-launch-checklist.md`
- `deployment-notes.md`
- `beta-deployment-guide.md`
- `supabase-production-setup.md`
- `beta-walkthrough.md`
