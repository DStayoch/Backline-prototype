# Backline Current State Handoff

Last updated: 2026-06-24

This file is for continuing Backline development on another computer or in a fresh Codex thread. Start by reading this file before making changes.

## Project Summary

Backline is an AI-powered back-office and field-service operations app for small trade businesses, especially HVAC, plumbing, electrical, roofing, and similar 1-10 technician shops.

Positioning:

> Your office, handled.

Core workflows:

- Capture missed calls, web leads, customer replies, and portal responses.
- Schedule jobs, dispatch technicians, and manage appointment windows.
- Run job detail workflows: tasks, checklists, photos/files, equipment, parts, notes, and customer messages.
- Send estimates and approval links with customer signature capture.
- Convert approved estimates into invoice line items.
- Request and record payments, track collected amounts and remaining balances.
- Manage pricebook, inventory-lite materials, suppliers, reorder lists, and part usage.
- Manage teams, custom roles, permissions, activity logs, and platform Foundry access.
- Support a reusable customer portal link for key updates, files, replies, and payments.

## Repo And Live App

GitHub repo:

- `DStayoch/Backline-prototype`
- Default branch: `main`
- GitHub Pages is used for the hosted version.

Important: the local workspace currently contains newer app work than the GitHub Pages source. We have pushed several small live-server CSS/workflow fixes through the GitHub connector, but the full local `app.js`, `styles.css`, and `index.html` state has not been pushed as one clean Git sync yet.

Recommended next infrastructure step:

1. Install Git on this computer, or use GitHub Desktop.
2. Turn this local folder into a real Git working copy or clone the repo cleanly.
3. Carefully sync the current local files to GitHub.
4. Do not commit `supabase-config.js`.
5. Run CI and confirm GitHub Pages deploys green.

## Local Workspace

Current local path on the original computer:

`C:\Users\user\Documents\Codex\2026-05-21\i-ll-frame-this-as-a`

Important: this path is historical/reference only. The user is switching computers, so the next machine will almost certainly have a different local path. On the new computer, use the checked-out/cloned repo path as the workspace root and do not assume this Windows path exists.

Key files:

- `index.html`
- `app.js`
- `styles.css`
- `field-polish.css`
- `.github/workflows/ci.yml`
- `.github/workflows/pages.yml`
- `tests/*.mjs`
- `supabase-schema-01-tables.sql` through `supabase-schema-19-platform-admins.sql`
- `supabase-config.example.js`
- `supabase-config.local.example.js`
- `supabase-config.production.example.js`

Do not commit:

- `supabase-config.js`
- Any real Supabase keys
- Any service-role key
- Any Resend API key

## Current Local Runtime

The app is a mostly static browser app with a tiny Node local server.

Local commands:

```powershell
node server.js
```

or use:

```powershell
start-backline.bat
```

If port `8765` is already in use, another local server is already running. Open:

`http://127.0.0.1:8765/`

Test command:

```powershell
npm test
```

If `npm` is unavailable, use the bundled Node runtime:

```powershell
C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\smoke-test.mjs
```

Useful individual checks:

```powershell
C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe --check app.js
C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\pages-artifact-test.mjs
C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe tests\mobile-readiness-test.mjs
```

## Supabase State

The app uses Supabase for secure database/auth.

Known setup:

- The user has a Supabase project configured locally through `supabase-config.js`.
- The local config includes a publishable/anon key and project URL.
- The production GitHub Pages workflow generates `supabase-config.js` from GitHub repository variable/secret:
  - `BACKLINE_SUPABASE_URL`
  - `BACKLINE_SUPABASE_ANON_KEY`

Important:

- Never commit `supabase-config.js`.
- Never commit service-role keys.
- `supabase-config.example.js` is safe to commit.

Schemas that have been added over time:

- Customer/job core tables
- Approval RPC and signatures
- Job files
- Team management
- Deleted jobs archive
- Activity log
- Pricebook
- Company settings
- Customer portal
- Custom roles
- Security hardening
- Public token hardening
- Append-only activity hardening
- Platform admins / Foundry access

If a function is missing in Supabase, the user may need to run the relevant numbered schema SQL again in Supabase SQL editor.

## GitHub Pages Notes

Recent GitHub live-server fixes were pushed through the GitHub connector because local Git was not installed.

Recent live CSS/workflow changes:

- Added `field-polish.css`.
- Pages workflow now copies `field-polish.css` into `_site`.
- Generated `supabase-config.js` injects `field-polish.css` if `index.html` does not already include it.
- Current polish cache tag: `field-polish.css?v=20260624-flat-meta-labels`.
- The purpose is to make job/detail card labels professional and flat instead of filled blue bubbles.

Important caveat:

GitHub Pages may still be missing many newer local `app.js` features until a full Git sync happens.

## Product Features Already Built Locally

Authentication and workspace:

- Owner signup/login.
- New owner should land in workspace settings first.
- Re-enter password field on account creation.
- Sign out returns to login.
- Workspace settings modal with setup progress.
- Company name, slogan, contact details, service area, time zone, terms, policies, deposit defaults, labor rate, and margin settings.
- Settings persistence was tested and fixed locally.

Shop/workspace isolation:

- Multiple shop accounts should not bleed jobs, customers, settings, roles, portal branding, or other data.
- Several isolation sweeps were done.
- Keep testing this heavily before beta.

Navigation and roles:

- Tabs are permission-aware.
- Technician and custom roles should only see allowed tabs/actions.
- Team tab supports built-in roles and custom role builder.
- Custom role permissions should persist per shop.
- Role management UI hides edit controls from users without permission.
- Activity log should record role permission changes.

Foundry:

- Foundry is platform/creator access, not a normal shop role.
- Used for Backline operators to inspect read-only platform diagnostics.
- Foundry access is separate from owner/admin/technician shop roles.

Jobs:

- Create job with customer info, phone formatting, schedule, technician, urgency, trade/type/template, issue.
- Job templates can apply default tasks.
- Job detail has action groups and More actions.
- Sticky job header/action area has been adjusted.
- Inbox can collapse; inbox/detail scrolling was heavily worked on for desktop/mobile.
- Schedule tab replaced old Today tab.
- Later appointments show year and are bounded.
- Print schedule supports today/week; week should be Monday-Sunday.

Customer directory:

- Search dropdown under search bar.
- Search should support first name, last name, phone, address, and service type.
- Selecting a customer opens customer profile.
- Customer profile has current/open job access.
- Customer details email save was fixed.
- Events can collapse by day and support newest/oldest sorting.

Customer portal:

- Reusable customer portal link.
- Customer can view key updates/files/messages.
- Portal should not show internal/system-only noise like repeated portal link copied.
- Customer replies from portal should come back into Backline.
- Uploaded files should open/view from portal.
- Portal branding must stay isolated to the correct shop.

Messages/comms:

- Message thread should stay pinned to the bottom.
- Adding notes/customer replies/automated messages should not jump to top.
- New message badges exist.
- Comms tab items can be completed per account, not globally.
- Several queued comms were considered too noisy; keep UI clean and log instead of forcing every prewritten communication into a confirmation queue.

Approvals and PDFs:

- Approval links require legal typed name matching the job customer name.
- Customer drawn signature is captured.
- Approved/declined decision should be one-time only.
- Decline flow asks for reason.
- Approved page should show decision sent, not allow repeat signing.
- Approval PDF is generated with signature and attached to job files.
- There was PDF layout overlap near disclaimers/signature; fix was made locally.
- A Regenerate approval PDF action was added locally for old PDFs using the latest format.
- Best practice: send a new approval for changed scope rather than modifying the historical approval record.

Invoice/payment:

- Estimates and invoices previously fought each other; logic was improved.
- Approved estimates can become invoice line items.
- Payments can be partial; collected and balance should update correctly.
- Total should represent all billable work.
- Collected should represent actual payments collected.
- Balance should be total minus collected, floored at zero.
- Prior paid work is locked so paid totals are not accidentally removed.
- Reopen job exists for changes after paid/closed.
- Create invoice from approved estimate appears when a current approved estimate is not yet invoiced.

Pricebook/inventory:

- Pricebook items are customizable.
- Backline custom dropdowns are preferred over native HTML selects.
- Category and unit use Backline dropdowns.
- Workspace phone uses formatted phone input.
- Time zone uses Backline dropdown.
- Parts inventory includes materials, supplier, cost, on-hand stock, reorder point, pending orders, usage view, and copy reorder list.
- Truck stock wording was changed to On Hand.
- Supplier edit/save was fixed locally.
- Logged parts can be edited/removed.
- Logged parts should not revert typed input to old values.

Activity:

- Activity log groups by day and can filter/select by day.
- Activity detail modal was centered.
- Role updates should toast once, not duplicate.
- Task complete/reopen events should show meaningful activity entries.
- Activity should remain viewable by owners/admins with permission.
- Non-authorized users should not see/edit permission controls.

Mobile:

- A lot of mobile work was done, but keep auditing.
- Mobile inbox/detail needed real mobile-specific layout, not just squeezed desktop.
- Action buttons were stacked on mobile.
- Inbox scroll bugs were fixed locally.
- Continue checking all views at phone width.

Visual polish:

- Brand assets exist in `assets`.
- Light and dark logo variants were added.
- Sidebar and topbar polish done.
- Field/card labels were changed from blue bubble backgrounds to flat professional uppercase labels via `field-polish.css`.
- Cards have stronger borders/left accents to improve scanability.

## Current Known Risks

1. Local and GitHub Pages are not fully synced.
   The live server has recent CSS/workflow patches, but may not have the newest local `app.js`.

2. `supabase-config.js` is local-only and must not be committed.

3. Git is not installed in this local workspace yet.
   `where.exe git` previously failed.

4. The `.git` folder in this Codex workspace did not behave like a real clone.
   Treat this folder as a working file copy until Git is installed and repo sync is handled carefully.

5. GitHub connector can update small/medium files but is not a good path for pushing the 900KB `app.js`.

6. Continue to test workspace/shop isolation. Any cross-shop data bleed is critical.

## Recommended Next Steps

Immediate next step before switching computers:

1. Install Git for Windows from `https://git-scm.com/download/win`.
2. Verify:

```powershell
git --version
```

3. Clone `DStayoch/Backline-prototype` into a clean folder.
4. Compare this local Codex folder against the clone.
5. Copy over intended local changes, excluding:
   - `supabase-config.js`
   - generated backups/zips
   - temporary visual comparison files unless needed
6. Run:

```powershell
npm test
```

7. Commit and push to `main` or a PR branch.
8. Confirm GitHub Actions and GitHub Pages deploy green.
9. Open the live URL and retest owner, technician, customer portal, approval, estimate, invoice/payment, roles, activity, and mobile.

## Suggested Prompt For The Next Codex

Use this on the other computer:

```text
You are continuing Backline development. First read handoff/backline-current-state.md, then inspect the repo before changing code. The priority is syncing the full local app state to GitHub safely, without committing supabase-config.js or secrets. After that, run tests and verify GitHub Pages parity.
```

## Important Tone/Working Preference

The user calls the assistant Brahma. They like direct, collaborative product-building. They care a lot about professional polish, real business usability, role/security isolation, and not shipping confusing UI. Be proactive but do not bulldoze product decisions.
