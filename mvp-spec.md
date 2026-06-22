# MVP Spec

## Product Name Placeholder

Backline

## Primary User

Owner-operator or office admin at a small HVAC/plumbing shop.

## Jobs To Be Done

- Capture customers when calls are missed
- Turn vague requests into schedulable job cards
- Give field techs a fast job-completion flow on mobile
- Make customer history searchable from the job page
- Get customer approval for estimates and change orders quickly
- Track parts used without forcing a full inventory system
- Reduce manual follow-up
- Get customers from request to booking to payment faster
- Show the owner which recovered jobs created revenue

## V1 Screens

### Inbox

A triage view for new customer requests.

Fields:

- Customer name
- Phone number
- Address
- Trade type
- Job type
- Issue summary
- Urgency
- Site contact
- Likely parts/tools
- Preferred time
- Source
- AI confidence
- Status

Actions:

- Call
- Text
- Book
- Mark not a fit
- Assign technician

### Calendar

A simple schedule view for appointments.

Actions:

- Create job
- Reschedule job
- Assign technician
- Send confirmation SMS

### Job Detail

Single view of customer, issue, appointment, notes, estimate, invoice, and follow-up timeline.

Actions:

- Start job
- Complete job
- Add note
- Upload photo
- Capture signature
- Log parts used
- Send approval link
- Send change order
- Send estimate
- Send invoice
- Send payment link
- Request review

### Field Workflow

Mobile-first completion flow for the technician.

Fields:

- Started at
- Completed at
- Diagnosis captured
- Photos captured
- Customer signature captured
- Parts used
- Truck-stock/source note
- Scope changes

Actions:

- Start
- Mark diagnosis
- Mark photos captured
- Mark signature captured
- Log parts
- Complete
- Invoice

### Automations

Simple toggles for:

- Missed-call text-back
- Appointment reminder
- Estimate follow-up
- Invoice follow-up
- Review request

### Metrics

Small dashboard showing:

- Missed calls
- Recovered conversations
- Jobs booked
- Estimated recovered revenue
- Unpaid invoices

## Data Model

Backline stores operating data in browser IndexedDB for the static prototype, with localStorage retained as a migration/export fallback. For secure mode, Backline uses Supabase Auth, Postgres, and Row Level Security. The secure database has these primary tables:

- `organizations`
- `organization_members`
- `customers`
- `jobs`
- `approval_links`

Customer records are rebuilt and kept in sync whenever jobs are created or updated, so past and present jobs can be searched and grouped by customer.

Secure mode requires login. RLS policies scope customers, jobs, and approval links to the authenticated user's organization.

Role-based views keep the app practical for a real crew:

- `owner` and `admin`: full workspace, exports, job creation, approvals, money, insights
- `dispatcher`: schedule, inbox, follow-ups, customers, booking, approval links
- `tech`: assigned schedule/inbox only, field start/complete, checklist, photos/files, parts

Team management adds pending email invites, role changes, member removal, and technician assignment suggestions. Invited users join by signing in with the invited email, which the secure database connects through `accept_team_invite()`.

The Jobs database view shows active past, present, and future jobs plus a deleted-job archive. Deletes are soft-deletes from this point forward, with restore support and optional secure sync through the `deleted_jobs` table.

### Customer

- id
- name
- phone
- email
- address
- lastJobId
- lastJobStatus
- lastJobAt
- totalValue
- jobCount
- createdAt
- updatedAt

### Job

- id
- customerId
- trade
- issue
- urgency
- status
- jobType
- scheduledStart
- scheduledEnd
- technicianId
- siteContact
- partsNote
- approvalStatus
- fieldChecklist
- parts
- scopeChanges
- source
- estimatedValue
- createdAt

### Message

- id
- customerId
- jobId
- direction
- channel
- body
- createdAt

### Estimate

- id
- jobId
- amount
- status
- sentAt
- approvedAt

### Invoice

- id
- jobId
- amount
- status
- sentAt
- paidAt

## Automation Logic

### Missed Call

Trigger:

- Incoming call missed or after-hours voicemail event

Behavior:

- Send SMS within 30 seconds
- Ask for issue and address
- Ask if emergency
- Offer booking windows
- Create or update customer
- Create job card
- Notify owner

### Estimate Follow-Up

Trigger:

- Estimate sent and not approved after 24 hours

Behavior:

- Send friendly SMS follow-up
- Notify owner after second failed follow-up

### Invoice Follow-Up

Trigger:

- Invoice unpaid after 48 hours

Behavior:

- Send payment link reminder
- Escalate after 7 days

## Non-Goals For V1

- Complex route optimization
- Full accounting ledger
- Payroll
- Inventory
- Supplier purchasing
- Multi-branch enterprise support
- Deep custom workflows

## Build Order

1. Manual dashboard with seeded/demo data
2. Job inbox and job detail
3. SMS simulation
4. Calendar scheduling
5. Estimate/invoice status tracking
6. Real SMS provider
7. Payment link integration
8. Phone/missed-call integration
