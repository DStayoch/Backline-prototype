# Backline Beta Walkthrough

Last updated: June 19, 2026

Run this walkthrough on the hosted Backline URL before inviting a real shop. Use a production-like Supabase project, a test shop, and test users only.

## Test Setup

Record these before starting:

- Backline URL:
- Supabase project:
- Owner email:
- Admin email:
- Dispatcher email:
- Technician email:
- Customer test name:
- Customer test phone:
- Customer test email:
- SMS beta mode:

Before starting:

- [ ] `npm run deploy:preflight` passed before deploy
- [ ] Production schema is installed through `supabase-schema-19-platform-admins.sql`
- [ ] Creator account is added to `platform_admins` for Foundry access
- [ ] Supabase Auth site URL points to the hosted Backline URL
- [ ] Supabase Auth redirect URLs include the hosted Backline URL
- [ ] `send-team-invite` Edge Function is deployed
- [ ] Resend sender is configured, or Copy instructions fallback is accepted for this test
- [ ] SMS mode is explicit: live provider, portal-only replies, or manual logged messages
- [ ] Open Backline in a desktop browser and a phone browser
- [ ] Optional: restore `tools/beta-seed.json` into a disposable test workspace before starting

Seed reset:

- Use `tools/beta-seed.json` only in disposable beta/test workspaces.
- Follow `tools/beta-reset-notes.md` before restoring seed data.
- Never restore seed data into a real customer workspace.

## 1. Owner Creates The Shop

Steps:

- [ ] Open the hosted Backline URL
- [ ] Create a new owner account
- [ ] Confirm the first screen opens Workspace settings
- [ ] Fill shop name, slogan, phone, email, address, service area, time zone, invoice terms, labor rate, tax, and default deposit
- [ ] Save settings
- [ ] Open Settings -> Test secure connection

Expected:

- [ ] Owner can sign in without seeing another shop's data
- [ ] Workspace settings persist after refresh
- [ ] Test secure connection passes
- [ ] Activity log records setup-related changes

## 2. Owner Invites Team

Steps:

- [ ] Open Team
- [ ] Create or verify Admin, Dispatcher, and Technician roles
- [ ] Invite one admin
- [ ] Invite one dispatcher
- [ ] Invite one technician
- [ ] Use Send email or Copy instructions
- [ ] Sign in as each invitee in a separate browser/profile

Expected:

- [ ] Invitee joins the same shop
- [ ] Team tab shows display names, not raw email-only labels
- [ ] Owner cannot remove self
- [ ] Admin can manage permitted team settings
- [ ] Dispatcher cannot see owner-only money/team/admin pages unless role allows it
- [ ] Technician sees only assigned work surfaces

## 3. Owner Creates A Customer And Job

Steps:

- [ ] Sign in as owner
- [ ] Create a new job
- [ ] Enter customer name, phone, email, address, trade, urgency, issue, and job template
- [ ] Save the job
- [ ] Confirm the customer appears in Customers
- [ ] Search by first name, last name, phone, and address

Expected:

- [ ] Phone formats correctly
- [ ] Job is visible in Inbox/Jobs database
- [ ] Customer profile opens from search without changing unrelated page data
- [ ] Customer details can be edited and persist after refresh
- [ ] Job activity is grouped by day in the customer profile

## 4. Dispatcher Books And Assigns The Job

Steps:

- [ ] Sign in as dispatcher
- [ ] Open Schedule or Inbox
- [ ] Book the job for a specific date/time
- [ ] Assign the technician from the database-backed technician list
- [ ] Send a portal update or confirmation
- [ ] Refresh the page

Expected:

- [ ] Schedule reflects the appointment
- [ ] Technician assignment persists
- [ ] Assigned technician receives an in-app badge/new-work signal
- [ ] Customer-facing message appears in the job message thread
- [ ] Dispatcher cannot access restricted owner/admin surfaces

## 5. Technician Completes Field Work

Steps:

- [ ] Sign in as technician
- [ ] Confirm only assigned jobs are visible
- [ ] Open the assigned job
- [ ] Start the job
- [ ] Complete at least one job task
- [ ] Reopen and complete a task again
- [ ] Add an internal note
- [ ] Add a customer-visible message
- [ ] Upload a photo or PDF
- [ ] Log a part
- [ ] Edit the logged part
- [ ] Remove the logged part
- [ ] Add equipment/property details
- [ ] Complete diagnosis, photo, and signature checklist items

Expected:

- [ ] Task changes appear in Activity for the owner
- [ ] Message thread stays pinned to the bottom after sending
- [ ] Uploaded file appears in Files as a list item with View
- [ ] Owner/admin can view technician upload
- [ ] Logged parts can be edited and removed
- [ ] Equipment is visible to other shop accounts
- [ ] Close Job button does not appear until closeout requirements are complete

## 6. Owner Sends Estimate

Steps:

- [ ] Sign in as owner
- [ ] Open the job
- [ ] Add or verify pricebook item
- [ ] Send an estimate
- [ ] Copy/open approval link in a customer browser

Expected:

- [ ] Estimate revision is listed
- [ ] Approval link uses hosted Backline URL
- [ ] Estimate amount and deposit are correct
- [ ] Communication log does not create unnecessary duplicate clutter

## 7. Customer Approval Link

Steps:

- [ ] Open approval link as customer
- [ ] Try approving with the wrong typed name
- [ ] Type the correct customer name
- [ ] Draw signature
- [ ] Approve estimate
- [ ] Refresh approval page
- [ ] Open the same link again

Expected:

- [ ] Wrong name is rejected
- [ ] Signature drawing is required
- [ ] Approval submits once
- [ ] Thank-you/submitted state appears
- [ ] Same approval link cannot be approved or declined again
- [ ] Approved PDF is attached to job files

Decline path:

- [ ] Send a second estimate or use a separate test job
- [ ] Decline without a reason
- [ ] Confirm reason is required
- [ ] Submit a decline reason

Expected:

- [ ] Decline reason returns to Backline
- [ ] Link cannot be reused after decline

## 8. Invoice And Payment

Steps:

- [ ] Sign in as owner
- [ ] Confirm Create invoice from approved estimate appears
- [ ] Create invoice from the newest approved estimate
- [ ] Record a partial payment
- [ ] Confirm Total, Collected, and Balance
- [ ] Record another payment
- [ ] Reopen the job and send a new estimate
- [ ] Approve the new estimate
- [ ] Create invoice from only the newest approved estimate

Expected:

- [ ] Invoice line items match the intended approved estimate
- [ ] Prior paid work remains locked
- [ ] Collected never removes billable work from Total
- [ ] Balance equals Total minus Collected
- [ ] Paid status only appears when balance is zero
- [ ] Payment history shows readable recorded-by names

## 9. Customer Portal

Steps:

- [ ] Copy/open portal link
- [ ] Confirm portal shows key updates only
- [ ] Send a customer reply
- [ ] Submit a payment response if available
- [ ] Open a visible file

Expected:

- [ ] Portal link uses hosted Backline URL
- [ ] Portal link is not localhost, `127.0.0.1`, or `file://`
- [ ] Customer reply appears in Backline
- [ ] Backline shows unread/new message badge
- [ ] Portal does not expose internal notes or admin-only activity
- [ ] File View opens correctly
- [ ] Customer is asked before downloading anything generated automatically

## 10. Closeout And Close Job

Steps:

- [ ] Complete all required closeout checklist items
- [ ] Confirm Close Job appears in the action row and closeout area
- [ ] Close the job
- [ ] Refresh

Expected:

- [ ] Close Job disappears after closing
- [ ] Job status is closed
- [ ] Activity log records the close
- [ ] Job remains searchable in Jobs database/history

## 11. Mobile Spot Check

Run on a phone using the hosted HTTPS URL.

Steps:

- [ ] Sign in as owner
- [ ] Open Home
- [ ] Search customer
- [ ] Open Inbox/job detail
- [ ] Open Schedule
- [ ] Open Customer profile
- [ ] Open approval link
- [ ] Open customer portal link

Expected:

- [ ] No horizontal page overflow
- [ ] Top controls do not bleed through while scrolling
- [ ] Job action buttons fit the mobile layout
- [ ] Inbox/job detail can scroll
- [ ] Customer search results appear below the search bar
- [ ] Settings menu does not overlap search results
- [ ] Approval and portal pages are usable on mobile

## 12. Data Safety Final Check

Steps:

- [ ] Export a backup
- [ ] Restore backup into a non-production test workspace only
- [ ] Confirm activity log shows role/task/file/payment changes
- [ ] Confirm deleted job archive is visible only to permitted roles
- [ ] Confirm a second shop account cannot see the first shop's data

Expected:

- [ ] Backup downloads
- [ ] Restore preview appears before replacing data
- [ ] Workspace isolation holds across customers, jobs, files, roles, activity, and deleted jobs

## Beta Sign-Off

- [ ] Owner/admin path passed
- [ ] Dispatcher path passed
- [ ] Technician path passed
- [ ] Customer approval path passed
- [ ] Customer portal path passed
- [ ] Mobile spot check passed
- [ ] Data safety check passed
- [ ] Hosted link check passed: approval, portal, files, and receipts open from the public URL
- [ ] Email/domain check passed or copy-instructions fallback is explicitly approved
- [ ] SMS/missed-call beta mode is documented for testers
- [ ] Known issues documented before inviting a real shop

Notes:

```text

```
