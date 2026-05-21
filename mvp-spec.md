# MVP Spec

## Product Name Placeholder

Backline

## Primary User

Owner-operator or office admin at a small HVAC/plumbing shop.

## Jobs To Be Done

- Capture customers when calls are missed
- Turn vague requests into schedulable job cards
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
- Issue summary
- Urgency
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

- Add note
- Upload photo
- Send estimate
- Send invoice
- Send payment link
- Request review

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

### Customer

- id
- name
- phone
- email
- address
- createdAt

### Job

- id
- customerId
- trade
- issue
- urgency
- status
- scheduledStart
- scheduledEnd
- technicianId
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
