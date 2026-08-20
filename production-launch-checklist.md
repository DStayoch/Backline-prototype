# Backline Production Launch Checklist

Last updated: June 19, 2026

This checklist is for moving Backline from local prototype to a real beta URL. It separates repo-verified items from manual checks that must be confirmed in Supabase, Resend, GitHub, and a browser.

## Repo Status

- [x] Static app entry exists: `index.html`
- [x] Local server exists: `server.js`
- [x] Start script exists: `npm start`
- [x] Automated test script exists: `npm test`
- [x] GitHub CI workflow exists: `.github/workflows/ci.yml`
- [x] GitHub Pages workflow exists: `.github/workflows/pages.yml`
- [x] App cache tag is declared in `index.html`: `app.js?v=20260617-creator-access`
- [x] Supabase config template exists: `supabase-config.example.js`
- [x] Local Supabase config template exists: `supabase-config.local.example.js`
- [x] Production Supabase config template exists: `supabase-config.production.example.js`
- [x] Deployment notes exist: `deployment-notes.md`
- [x] Manual beta walkthrough exists: `beta-walkthrough.md`
- [x] Beta seed backup exists: `tools/beta-seed.json`
- [x] Beta reset notes exist: `tools/beta-reset-notes.md`
- [x] Real shop workflow audit exists: `tests/real-shop-workflow-test.mjs`
- [x] Secure connection check exists in Backline Settings
- [x] Edge Function source exists: `supabase/functions/send-team-invite/index.ts`
- [x] Edge Function README exists: `supabase/functions/send-team-invite/README.md`

## Supabase Database

- [x] Combined schema file exists: `supabase-schema.sql`
- [x] Split schema files exist through `supabase-schema-19-platform-admins.sql`
- [x] Job file storage bucket setup is present in schema: `job-files`
- [x] Approval link RPCs are present
- [x] Customer portal RPCs are present
- [x] Custom role support is present
- [x] Security hardening and public token hardening files are present
- [x] Activity events are append-only from browser clients
- [x] Creator/platform access is separate from shop roles
- [ ] Production creator account added manually to `platform_admins`
- [ ] Production Supabase project created
- [ ] Production project is separate from local/dev testing project
- [ ] Production schema run successfully
- [ ] Supabase Auth production site URL configured
- [ ] Supabase Auth allowed redirect URLs include the production Backline URL
- [ ] Owner account created in production
- [ ] Backline Settings -> Test secure connection passes as owner
- [ ] Owner can create a second test user through Team invite
- [ ] Technician/dispatcher/admin role visibility works in production

## Supabase Storage

- [x] `job-files` bucket creation is included in schema
- [x] Storage policies are scoped by organization folder
- [ ] Upload a file as owner/admin and view it from Backline
- [ ] Upload a file as technician and confirm owner/admin can view it
- [ ] Confirm a technician cannot delete another user's file unless their role permits it
- [ ] Confirm customer portal file view works from the production URL

## Edge Function And Email

- [x] `send-team-invite` function checks signed-in owner/admin before sending
- [x] Function secrets are documented
- [ ] Deploy `send-team-invite` to production Supabase
- [ ] Set `RESEND_API_KEY`
- [ ] Set `INVITE_FROM_EMAIL`
- [ ] Set optional `INVITE_REPLY_TO_EMAIL`
- [ ] Verify a real sending domain in Resend before inviting non-test recipients
- [ ] Send invite email to a real test address
- [ ] Confirm invitee can create an account and attach to the correct shop
- [ ] Confirm invite failures show Backline toast feedback, not persistent inline status clutter

## Phone And SMS

- [ ] Decide beta SMS mode: manual message logging, Twilio/provider integration, or no SMS in first beta
- [ ] If SMS is enabled, configure a dedicated business number outside the owner's personal phone
- [ ] If SMS is manual, label outbound messages clearly as logged/simulated in beta notes
- [ ] Confirm customer replies from the portal are enough for first beta if live SMS is deferred
- [ ] Confirm missed-call recovery promise matches the actual beta capability

## Hosting

- [x] GitHub Pages workflow can publish the static app
- [ ] Confirm final production host: GitHub Pages, Netlify, Vercel, or another static host
- [ ] Confirm production URL uses HTTPS
- [ ] Confirm `supabase-config.js` points to the production Supabase project
- [ ] Confirm production deployment does not include local/dev Supabase values
- [ ] GitHub Actions repository variable `BACKLINE_SUPABASE_URL` is set
- [ ] GitHub Actions repository secret `BACKLINE_SUPABASE_ANON_KEY` is set
- [ ] Supabase Auth Site URL is `https://dstayoch.github.io/Backline-prototype/`
- [ ] Supabase Auth Redirect URLs include `https://dstayoch.github.io/Backline-prototype/`
- [ ] Google OAuth provider is enabled in Supabase if Google sign-in is shown
- [ ] Apple OAuth provider is enabled in Supabase if Apple sign-in is shown
- [ ] `npm run deploy:preflight` passes before pushing a production deploy
- [ ] Confirm customer approval links use the production URL
- [ ] Confirm customer portal links use the production URL
- [ ] Confirm mobile opens the production URL without local-network workarounds
- [ ] Confirm customer-facing links never use `127.0.0.1`, `localhost`, or `file://`

## External Dependencies

- [x] jsPDF CDN is pinned to `2.5.1`
- [ ] Pin Supabase JS CDN to a specific tested `2.x.x` version before public beta
- [ ] Confirm CDN loading works on the production host
- [ ] Decide whether to vendor CDN scripts locally for resilience

## Data Safety

- [x] Workspace isolation test exists
- [x] Security isolation test exists
- [x] Download backup and restore from backup are present
- [ ] Create production backup before inviting a real shop
- [ ] Restore a backup into a non-production test workspace
- [ ] Confirm one shop cannot view another shop's customers, jobs, files, roles, or activity
- [ ] Confirm activity log records lower-role task updates
- [ ] Confirm deleted jobs archive is owner/admin scoped

## Manual Browser QA

- [ ] Restore `tools/beta-seed.json` into a disposable test workspace before repeat walkthroughs
- [ ] Run `beta-walkthrough.md` end to end on the hosted URL
- [ ] Run `npm test` locally before each hosted beta push
- [ ] Owner full workflow: create job, schedule, estimate, approval, invoice, partial payment, close job
- [ ] Dispatcher workflow: schedule, assign tech, send portal update, no owner-only pages
- [ ] Technician workflow: view assigned jobs, complete tasks, log/remove parts, upload file
- [ ] Customer approval workflow: approve once, decline with reason, signature required
- [ ] Customer portal workflow: view updates/files and send reply back to Backline
- [ ] Mobile workflow: home, schedule, inbox/job detail, customer portal, approval link

## Current Launch Notes

- The repo is structurally ready for a hosted beta, but production launch still depends on manual Supabase, Resend, and hosted-browser checks.
- The biggest remaining production polish item is pinning the Supabase CDN script to a specific tested version instead of using the broad `@2` tag.
- The real shop workflow audit now covers lead to schedule to field work to approval to invoice to partial/full payment to closeout, but hosted portal, approval, file, email, and mobile behavior still need manual confirmation on the production URL.
- The safest beta path is one production Supabase project, one verified Resend/domain sender, one HTTPS static URL, a clear SMS/missed-call beta mode, then a full owner/admin/dispatcher/tech/customer walkthrough.
