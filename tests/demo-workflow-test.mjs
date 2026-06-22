import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync("app.js", "utf8");
const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const schema = readFileSync("supabase-schema.sql", "utf8");

function has(pattern, message, source = app) {
  assert.match(source, pattern, message);
}

function lacks(pattern, message, source = app) {
  assert.doesNotMatch(source, pattern, message);
}

const rolloutSteps = [
  {
    name: "Create and configure shop",
    html: [/id="companySettingsModal"/, /id="workspaceSetupProgress"/, /name="companyName"/, /name="companySlogan"/, /name="phone"/, /name="serviceArea"/, /id="companyTimezonePicker"/, /name="invoiceTerms"/, /name="approvalWording"/],
    app: [/function workspaceSetupItems\(/, /function persistRemoteCompanySettings\(/, /payload: \{ companySettings: company, suppliers: state\.suppliers\.map\(normalizeSupplierRecord\) \}/]
  },
  {
    name: "Invite team and assign role",
    html: [/id="teamInviteForm"/, /name="email"/, /id="teamInviteRolePicker"/],
    app: [/async function createTeamInvite\(/, /async function sendTeamInviteEmail\(/, /client\.functions\.invoke\("send-team-invite"/, /function updateTeamMemberRole\(/, /showToast\("Role updated"/, /field: "roleAssignment"/]
  },
  {
    name: "Create customer and job",
    html: [/id="jobModal"/, /id="jobForm"/, /name="name"/, /name="phone"/, /id="jobTemplatePicker"/],
    app: [/function createJob\(/, /syncCustomersFromJobs\(\)/, /applyJobTemplate\(job/, /Job created/]
  },
  {
    name: "Schedule and assign technician",
    app: [/book: \{[\s\S]*?title: isReschedule \? "Reschedule job" : "Book job"/, /name: "scheduleDate"/, /name: "startTime"/, /name: "durationMinutes"/, /name: "technician"/, /recordAssignmentUpdate\(job, nextTechnician\)/, /queueJobNotification\(job, "customer_confirmation"\)/, /queueJobNotification\(job, "tech_assignment"\)/]
  },
  {
    name: "Technician starts and completes work",
    app: [/data-tech-job-action/, /job\.status = "in_progress"/, /title: "Complete job"/, /name: "diagnosis"/, /name: "photos"/, /name: "signature"/, /name: "nextStep"/, /fieldChecklist/]
  },
  {
    name: "Send customer portal and updates",
    app: [/function ensureJobPortalToken\(/, /function renderCustomerPortalPage\(/, /function renderCustomerPortalNextStep\(/, /data-action="portal"/, /data-action="portal-update"/, /customerVisible: true/, /submit_customer_portal_reply/, /companySettings: row\.company_settings/],
    css: [/\.portal-next-step/, /\.portal-file-note/, /\.portal-message/],
    schema: [/get_customer_portal_by_token\(input_token text\)[\s\S]*company_settings jsonb/]
  },
  {
    name: "Send estimate and approval link",
    app: [/title: "Send estimate"/, /appendEstimateRevision\(job, nextEstimate, estimateStatus\)/, /queueJobNotification\(job, "estimate_followup"\)/, /async function createApprovalLink\(/, /queueJobNotification\(nextJob, "approval_link"/, /#approval-token=/]
  },
  {
    name: "Customer approves or declines once",
    app: [/function renderApprovalPage\(/, /function approvalSignatureMatches\(/, /function approvalSignatureImage\(/, /submit_approval_by_token/, /input_approval_pdf_file: approvalPdfFile/, /linkStatus: "used"/, /Thank you\. Your approval has been sent\./],
    schema: [/and l\.used_at is null/, /update public\.approval_links\s+set used_at = coalesce\(used_at, now\(\)\)/s, /get_approval_by_token\(input_token text\)[\s\S]*company_settings jsonb/]
  },
  {
    name: "Create invoice from approved estimate",
    app: [/function canCreateInvoiceFromEstimate\(/, /function createInvoiceFromApprovedEstimate\(/, /data-create-invoice-from-estimate/, /Create invoice from approved estimate/, /Invoice created from approved estimate/]
  },
  {
    name: "Record partial or full payment and generate receipt",
    app: [/title: "Record payment"/, /data-payment-amount-input step="0\.01" min="0"/, /const paymentAmount = normalizeValue\(data\.get\("paidAmount"\)\)/, /const isPaidInFull = invoiceTotal > 0 && collected >= invoiceTotal/, /attachReceiptToPayment\(job, payment\.id\)/, /Receipt PDF attached to job files/],
    css: [/\.receipt-action-button/, /\.payment-ledger-list/]
  },
  {
    name: "Close job after closeout readiness",
    app: [/function closeoutSummary\(/, /function closeJobRecord\(/, /data-action="close"/, /closeoutBlockedMessage\(summary\)/, /Job closed/],
    css: [/\.closeout-panel/, /\.closeout-item/, /\.closeout-actions/]
  },
  {
    name: "Audit activity and database state",
    html: [/id="view-activity"/, /id="activityList"/, /id="activityDetailModal"/],
    app: [/function recordActivity\(/, /activity_events/, /ignoreDuplicates: true/, /field: "roleAssignment"/, /field: "rolePermissions"/, /label: "Custom role updated"/, /Task \$\{task\.done \? "completed" : "reopened"\}/],
    schema: [/create table if not exists public\.activity_events/, /activity_events_created_idx/]
  }
];

for (const step of rolloutSteps) {
  for (const pattern of step.html || []) has(pattern, `${step.name}: missing HTML contract`, html);
  for (const pattern of step.app || []) has(pattern, `${step.name}: missing app contract`);
  for (const pattern of step.css || []) has(pattern, `${step.name}: missing CSS contract`, css);
  for (const pattern of step.schema || []) has(pattern, `${step.name}: missing schema contract`, schema);
}

for (const action of ["book", "estimate", "invoice", "paid", "payment-request", "parts", "portal-update", "complete"]) {
  const configKey = action.includes("-") ? `"${action}": \\{` : `${action}: \\{`;
  has(new RegExp(`${configKey}[\\s\\S]*?submit:`), `Action modal should define ${action}`);
  has(new RegExp(`if \\(action === "${action}"\\)`), `applyActionForm should handle ${action}`);
}

for (const requiredAction of ["portal", "approval", "reopen", "close", "delete", "start", "approve", "check-photos", "check-signature"]) {
  has(new RegExp(`if \\(action === "${requiredAction}"\\)`), `Job action handler should include ${requiredAction}`);
}

has(/function invoiceBalance\(/, "Invoice balance must be computed from invoice total and collected payments");
has(/collected >= amount\s+\?\s+"paid"\s+:\s+collected > 0\s+\?\s+"partial"/, "Invoice status should distinguish partial payments");
has(/Collected work cannot be removed from the invoice total/, "Paid work must stay locked in invoice totals");
has(/function customerPortalBillingStatus\(/, "Customer portal should summarize billing status");
has(/Downloads are optional\./, "Customer files should explain optional downloads");
lacks(/normalizeValue\(data\.get\("paidAmount"\)\) \|\| invoiceBalance\(job\)/, "Payment form must not silently replace a partial payment with full balance");
lacks(/download: true/, "Customer documents should not force browser downloads");

console.log("Demo workflow readiness test passed.");
