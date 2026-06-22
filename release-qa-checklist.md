# Backline Release QA Checklist

Last QA pass: June 16, 2026

## Automated Checks

Passed:

- JavaScript syntax check: `node --check app.js`
- Smoke suite: `tests/smoke-test.mjs`
- Debug sweep: `tests/debug-sweep.mjs`
- Local server cache tag: `app.js?v=20260616-production-checklist`
- Security hardening schema added: `supabase-schema-16-security-hardening.sql`
- Migration cleanup: schemas 14, 15, and 16 now include clearer preflight checks, schema 15 creates missing invite structures, and storage policies use safe UUID parsing.
- Public token hardening schema added: `supabase-schema-17-public-token-hardening.sql`
- Activity append-only schema added: `supabase-schema-18-activity-append-only.sql`
- Settings menu includes a read-only **Test secure connection** check for Supabase auth, workspace access, and job records.

Coverage notes:

- The current smoke/debug suites include 2,400+ assertions across required files, Supabase schema files, role permissions, modal wiring, customer search, approval links, customer portal, invoice/payment math, pricebook, inventory, activity log, closeout flow, and cache-busting.
- No `TODO`, `FIXME`, `HACK`, or `XXX` leftovers were found in the main app, styles, HTML, or product docs.
- The only local URL match found is the README local-run instruction: `http://127.0.0.1:8765`.

## Launch Blockers

No automated launch blockers found in this pass.

Manual browser testing is still required before a real beta because the current suite is mostly static/runtime guard coverage, not a full click-through test across logged-in roles.

Run database migrations before beta testing against the secure database:

- Fresh Supabase project: run `supabase-schema.sql`.
- Existing project already on schema 13 or later: run `supabase-schema-14-customer-portal.sql`, then `supabase-schema-15-custom-roles.sql`, then `supabase-schema-16-security-hardening.sql`, then `supabase-schema-17-public-token-hardening.sql`, then `supabase-schema-18-activity-append-only.sql`.
- If Supabase reports a Backline preflight error, run the schema file named in that message first, then retry the failed file.
- After the schema run, open Backline Settings and use **Test secure connection** while signed in as the owner.

## Manual Role QA

Owner/Admin:

- Confirm workspace settings, pricebook edits, deleted-job archive, activity edits, and file visibility/delete still work after schema 16.
- Sign in and confirm the app does not flash another user's workspace.
- Create a customer/job with phone formatting and a scheduled appointment.
- Send an estimate, approve it from the approval link, generate the approval PDF, and attach it to job files.
- Create an invoice from the approved estimate.
- Record partial payment and verify total, collected, and balance remain correct.
- Add a second approved estimate after reopening a job and verify only the intended estimate is invoiced.
- Close a job only after closeout requirements are complete.
- Review Activity by day and confirm changes are understandable.
- Update workspace settings, including shop slogan, phone, time zone, labor rate, tax, templates, and PDF language.
- Confirm Team tab shows display names, roles, and no remove button for the owner.

Dispatcher:

- Confirm only dispatcher-allowed tabs show: Schedule, Inbox, Follow-Ups, Comms, Jobs, Customers.
- Book an unscheduled job and assign a technician from database-backed team members.
- Send a customer portal link and confirm it opens.
- Confirm dispatcher cannot see owner-only money/team/activity controls and cannot write admin-only records through Supabase.

Technician:

- Sign in and confirm restricted tabs do not flash during load.
- Confirm assigned jobs are visible and unassigned/private jobs are hidden.
- Start a job, complete checklist work, add notes, upload files/photos, log parts, edit/remove logged parts, and add equipment.
- Confirm technician uploads can be viewed, and that they cannot delete/update files uploaded by other users.
- Confirm the technician field is hidden on their job detail view.
- Confirm other accounts can see equipment and logged parts after save.

Customer:

- Open approval link.
- Confirm customer name must match the job customer name.
- Draw signature and approve once.
- Confirm the approval page changes to a submitted/thank-you state and cannot be approved or declined again.
- Decline an estimate and confirm the reason box is required.
- Open customer portal link, view only key shop/customer messages, send a reply, and confirm Backline receives it.
- View files from the file list, and confirm downloads are optional.

## Workflow QA

Scheduling:

- Print today's schedule.
- Print this week's schedule.
- Confirm later appointments show year and only jobs within six weeks are grouped as later.

Money:

- Confirm paid work cannot be accidentally removed from the invoice total.
- Confirm collected can never exceed total without the locked prior-paid-work line preserving the billed amount.
- Confirm "Create invoice from approved estimate" appears for the newest approved estimate that is not already invoiced.
- Confirm insights totals use invoice/estimate/payment values, not zeroed placeholders.

Communications:

- Confirm sending notes, SMS, customer replies, queued automations, and status changes keep the message thread pinned to the bottom.
- Confirm only useful customer-facing messages appear in the customer portal.
- Confirm communication completion is per-account.

Inventory:

- Add a pricebook item with Backline dropdowns for category/unit.
- Log a part from a job and verify inventory usage updates.
- View usage from inventory.
- Copy reorder list, including fallback modal if clipboard is blocked.
- Edit supplier/order details and confirm modal sizing works.

Customer Directory:

- Search by first name, last name, phone, address, and job context.
- Confirm selecting a result opens the customer profile without changing unrelated page data.
- Confirm selected customer rows have a visible selected border.
- Save customer email/details and verify persistence after reload.
- Confirm customer events are grouped by day and expandable.

## Polish Backlog

- Replace remaining browser `alert()` and `confirm()` calls with Backline-styled toast/modals where it improves flow.
- Add true browser automation for the most important owner/admin/dispatcher/tech/customer scenarios.
- Pin the Supabase CDN dependency to a specific tested version before a public beta instead of using the broad `@2` major tag.
- Add a beta seed-data reset script so QA can run the same scenarios repeatedly without hand-cleaning records.
