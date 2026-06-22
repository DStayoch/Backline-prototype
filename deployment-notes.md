# Backline Deployment Notes

Last updated: June 19, 2026

Backline is a static browser app. The main production risk is not a build step; it is pointing the hosted app at the wrong Supabase project or email sender.

## Environments

Use separate Supabase projects for local testing and production beta.

Local/dev:

- Use `supabase-config.local.example.js` as the starting template.
- Copy it to `supabase-config.js`.
- Point it at a throwaway or development Supabase project.
- Use local URLs such as `http://127.0.0.1:8765` only for desktop testing.

Production:

- Use `supabase-config.production.example.js` as the starting template.
- Copy it to `supabase-config.js` only in the hosted production deployment.
- Point it at a fresh production Supabase project.
- Configure Supabase Auth with the production HTTPS Backline URL.
- Deploy the `send-team-invite` Edge Function to the same production Supabase project.
- Use a Resend sender from a verified domain before inviting non-test recipients.

## Safe Promotion Flow

1. Keep local testing on the development Supabase project.
2. Create a fresh production Supabase project.
3. Follow `supabase-production-setup.md`, then run `supabase-schema.sql` in production or run the split schema files through `supabase-schema-19-platform-admins.sql`.
4. Configure `supabase-config.js` for production.
5. For GitHub Pages, set repository variable `BACKLINE_SUPABASE_URL` and repository secret `BACKLINE_SUPABASE_ANON_KEY`.
6. Run `npm run deploy:preflight`.
7. Deploy the static app to the production host.
8. Set Supabase Auth site URL and redirect URLs to the production host.
9. Deploy `send-team-invite` and set function secrets.
10. Sign in as the owner and run **Settings** -> **Test secure connection**.
11. Mark the Phone/SMS beta mode: live provider, portal-only replies, or manual logged messages.
12. Complete one owner/admin/dispatcher/technician/customer walkthrough before inviting a real shop.

## Do Not Mix

- Do not use the local testing Supabase project for a real shop.
- Do not point a production URL at your development Supabase project.
- Do not test destructive restore/import flows against production customer data.
- Do not use Resend test mode for a real invite workflow; it only sends to the verified account email.
- Do not send customer approval, portal, file, or receipt links that contain `localhost`, `127.0.0.1`, or `file://`.

## Production Manual Checks

- Owner can create a workspace and save workspace settings.
- Team invite email sends from the verified production sender.
- Invited technician attaches to the same shop.
- Approval links and customer portal links open from the production URL.
- Approval, portal, file, and receipt links never use local-only URLs.
- File upload/view works from owner, technician, and customer portal flows.
- Mobile opens the production URL without LAN or firewall workarounds.
- Phone/SMS beta behavior matches what pilot testers are promised.
