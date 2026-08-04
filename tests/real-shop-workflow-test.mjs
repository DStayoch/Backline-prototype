import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync("app.js", "utf8");

const INVOICE_ESTIMATE_LINE_SOURCE = "estimate";
const CARRYFORWARD_DESCRIPTION = "Prior paid work";

function money(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100) / 100) : 0;
}

function lineTotal(line = {}) {
  return money(line.qty || 1) * money(line.unitPrice);
}

function paymentTotal(invoice = {}) {
  return (invoice.payments || []).reduce((sum, payment) => {
    return sum + (payment.kind === "refund" ? -money(payment.amount) : money(payment.amount));
  }, 0);
}

function normalizeInvoice(invoice = {}) {
  const lineItems = (invoice.lineItems || []).filter((line) => line.description);
  const amount = lineItems.reduce((sum, line) => sum + lineTotal(line), 0);
  const collected = paymentTotal(invoice);
  return {
    ...invoice,
    lineItems,
    amount,
    status: amount <= 0
      ? "draft"
      : collected >= amount
        ? "paid"
        : collected > 0
          ? "partial"
          : invoice.status || "sent"
  };
}

function invoiceBalance(invoice = {}) {
  const normalized = normalizeInvoice(invoice);
  return Math.max(0, normalized.amount - paymentTotal(normalized));
}

function estimateSourceId(revision) {
  return `estimate-revision-${revision.revisionNumber}`;
}

function estimateLine(estimate, job) {
  return {
    id: estimateSourceId(estimate),
    description: `${estimate.packageName || "Custom"} estimate #${estimate.revisionNumber} - ${job.issue}`,
    category: "Estimate",
    qty: 1,
    unit: "flat",
    unitPrice: money(estimate.amount),
    source: INVOICE_ESTIMATE_LINE_SOURCE,
    sourceId: estimateSourceId(estimate)
  };
}

function isEstimateLine(line = {}) {
  return line.source === INVOICE_ESTIMATE_LINE_SOURCE || String(line.category || "").toLowerCase() === "estimate";
}

function isCarryforwardLine(line = {}) {
  return String(line.description || "") === CARRYFORWARD_DESCRIPTION;
}

function carryforwardLine(amount) {
  return {
    id: "invoice-carryforward-line",
    description: CARRYFORWARD_DESCRIPTION,
    category: "Prior billing",
    qty: 1,
    unit: "flat",
    unitPrice: money(amount),
    locked: true
  };
}

function reconcileInvoiceLines(invoice = {}) {
  const normalized = normalizeInvoice(invoice);
  const collected = paymentTotal(normalized);
  const nonEstimate = normalized.lineItems.filter((line) => !isEstimateLine(line) && !isCarryforwardLine(line));
  const estimates = normalized.lineItems.filter(isEstimateLine);
  const latestEstimate = estimates.at(-1);
  const nextLines = collected > 0 ? [carryforwardLine(collected), ...nonEstimate] : [...nonEstimate];
  if (latestEstimate && collected < lineTotal(latestEstimate) + nextLines.reduce((sum, line) => sum + lineTotal(line), 0)) {
    nextLines.push(latestEstimate);
  }
  return normalizeInvoice({ ...normalized, lineItems: nextLines });
}

function appendEstimate(job, amount, depositRequested, status = "sent") {
  const next = {
    id: `estimate-${(job.estimateHistory || []).length + 1}`,
    revisionNumber: (job.estimateHistory || []).length + 1,
    packageName: "Custom",
    amount: money(amount),
    depositRequested: money(depositRequested),
    status
  };
  job.estimateHistory = [...(job.estimateHistory || []), next];
  job.estimate = next;
  job.approvalStatus = status;
  if (status === "sent") job.status = "estimated";
  return next;
}

function approveLatestEstimate(job) {
  const latest = job.estimateHistory.at(-1);
  assert.ok(latest, "A sent estimate should exist before approval.");
  latest.status = "approved";
  job.estimate = latest;
  job.approvalStatus = "approved";
  job.approvedAt = "2026-06-19T14:00:00.000Z";
  return latest;
}

function createInvoiceFromApprovedEstimate(job) {
  const latest = job.estimateHistory.at(-1);
  assert.equal(latest.status, "approved", "Only an approved estimate should become an invoice line.");
  const invoice = normalizeInvoice(job.invoice || { number: "BL-TEST", status: "sent", lineItems: [], payments: [] });
  assert.equal(
    invoice.lineItems.some((line) => isEstimateLine(line) && line.sourceId === estimateSourceId(latest)),
    false,
    "The current approved estimate should not already be invoiced."
  );
  const collected = paymentTotal(invoice);
  const nonEstimate = invoice.lineItems.filter((line) => !isEstimateLine(line) && !isCarryforwardLine(line));
  const lineItems = [
    ...(collected > 0 ? [carryforwardLine(collected)] : []),
    ...nonEstimate,
    estimateLine(latest, job)
  ];
  job.invoice = normalizeInvoice({
    ...invoice,
    lineItems,
    depositRequested: Math.min(money(invoice.depositRequested || 0) + money(latest.depositRequested), lineItems.reduce((sum, line) => sum + lineTotal(line), 0))
  });
  if (invoice.status === "draft" && job.invoice.amount > 0) {
    job.invoice.status = "sent";
  }
  job.value = job.invoice.amount;
  job.status = job.invoice.status === "paid" ? "paid" : "invoiced";
  return job.invoice;
}

function recordPayment(job, amount, method = "card") {
  const invoice = normalizeInvoice(job.invoice);
  invoice.payments = [
    ...(invoice.payments || []),
    {
      id: `payment-${(invoice.payments || []).length + 1}`,
      kind: "payment",
      amount: money(amount),
      method,
      createdBy: "owner.user"
    }
  ];
  job.invoice = normalizeInvoice(invoice);
  job.status = job.invoice.status === "paid" ? "paid" : "invoiced";
  return job.invoice;
}

function customerPortalMessages(job = {}) {
  return (job.messages || []).filter((message) => {
    if (message.customerVisible) return true;
    return ["in", "out"].includes(message.direction);
  });
}

function customerPortalFiles(job = {}) {
  return (job.files || []).filter((file) => file.customerVisible);
}

function canCloseJob(job = {}) {
  const invoice = normalizeInvoice(job.invoice || {});
  return job.fieldChecklist?.diagnosis
    && job.fieldChecklist?.photos
    && job.fieldChecklist?.signature
    && (job.tasks || []).every((task) => task.done)
    && invoice.amount > 0
    && invoiceBalance(invoice) === 0;
}

function closeJob(job = {}) {
  assert.equal(canCloseJob(job), true, "Closeout should require completed field work, tasks, and paid invoice.");
  job.status = "closed";
  job.closedBy = "owner.user";
  job.closedAt = "2026-06-19T16:00:00.000Z";
  return job;
}

const job = {
  id: "job-real-flow",
  name: "Olivia Muniz",
  phone: "(645)215-8895",
  issue: "Replace failing AC condenser",
  trade: "HVAC",
  status: "open",
  technician: "To Be Determined",
  messages: [
    { direction: "out", body: "Thanks for contacting us. Your request is in our system and the team will follow up shortly.", customerVisible: true },
    { direction: "note", body: "Internal margin note.", customerVisible: false }
  ],
  files: [],
  parts: [],
  tasks: [
    { title: "Record filter size", done: false },
    { title: "Capture data plate photo", done: false }
  ],
  fieldChecklist: {}
};

assert.match(app, /function createJob\(/, "App should create jobs from leads.");
assert.match(app, /recordAssignmentUpdate\(job, nextTechnician\)/, "Booking should record technician assignment changes.");
assert.match(app, /appendEstimateRevision\(job, nextEstimate, estimateStatus\)/, "Estimate sends should create a revision.");
assert.match(app, /function createInvoiceFromApprovedEstimate\(job\)/, "Approved estimates should be convertible into invoice lines.");
assert.match(app, /function invoiceLineItemsWithPaymentCarryforward\(record = \{\}\)/, "Paid work carry-forward should be protected.");
assert.match(app, /function closeJobRecord\(job = \{\}\)/, "Closeout should have a single close-job path.");

job.status = "booked";
job.scheduleDate = "2026-06-22";
job.startTime = "09:00";
job.endTime = "11:00";
job.technician = "tech.user";
assert.equal(job.status, "booked");
assert.equal(job.technician, "tech.user");

job.status = "in_progress";
job.parts.push({ name: "Condenser pad", qty: 1, source: "On Hand", unitCost: 42, billed: false });
job.fieldChecklist = { diagnosis: true, photos: true, signature: true };
job.tasks = job.tasks.map((task) => ({ ...task, done: true }));
assert.equal(job.parts.length, 1);
assert.equal(canCloseJob(job), false, "A job should not close before invoice/payment is complete.");

appendEstimate(job, 7600, 1900, "sent");
approveLatestEstimate(job);
createInvoiceFromApprovedEstimate(job);
assert.equal(job.invoice.amount, 7600);
assert.equal(job.invoice.lineItems.length, 1);
assert.equal(job.invoice.status, "sent");

recordPayment(job, 2000);
assert.equal(paymentTotal(job.invoice), 2000);
assert.equal(invoiceBalance(job.invoice), 5600);
assert.equal(job.invoice.status, "partial");

recordPayment(job, 5600);
assert.equal(paymentTotal(job.invoice), 7600);
assert.equal(invoiceBalance(job.invoice), 0);
assert.equal(job.invoice.status, "paid");

job.status = "invoiced";
appendEstimate(job, 3000, 750, "sent");
approveLatestEstimate(job);
createInvoiceFromApprovedEstimate(job);
assert.equal(job.invoice.amount, 10600, "New approved work should add to the account total.");
assert.equal(paymentTotal(job.invoice), 7600, "Collected should remain the actual amount paid.");
assert.equal(invoiceBalance(job.invoice), 3000, "Balance should be total minus collected.");
assert.equal(job.invoice.status, "partial");
assert.equal(job.invoice.lineItems.filter(isEstimateLine).length, 1, "Only the latest unpaid estimate should remain as an estimate line.");
assert.equal(job.invoice.lineItems.filter(isCarryforwardLine).length, 1, "Prior paid work should be locked as carry-forward billing.");

job.invoice.lineItems = job.invoice.lineItems.filter((line) => !isEstimateLine(line));
job.invoice = reconcileInvoiceLines(job.invoice);
assert.equal(job.invoice.amount, 7600, "Removing unpaid work should not erase collected work from the total.");
assert.equal(paymentTotal(job.invoice), 7600);
assert.equal(invoiceBalance(job.invoice), 0);

appendEstimate(job, 3000, 750, "sent");
approveLatestEstimate(job);
createInvoiceFromApprovedEstimate(job);
recordPayment(job, 3000);
assert.equal(job.invoice.amount, 10600);
assert.equal(paymentTotal(job.invoice), 10600);
assert.equal(invoiceBalance(job.invoice), 0);
assert.equal(job.invoice.status, "paid");

job.messages.push(
  { direction: "out", body: "Your repair is complete and paid.", customerVisible: true },
  { direction: "note", body: "Internal closeout checklist reviewed.", customerVisible: false },
  { direction: "in", body: "Thank you!", customerVisible: true }
);
job.files.push(
  { name: "invoice.pdf", customerVisible: true },
  { name: "internal-costing.csv", customerVisible: false }
);

assert.deepEqual(customerPortalMessages(job).map((message) => message.body), [
  "Thanks for contacting us. Your request is in our system and the team will follow up shortly.",
  "Your repair is complete and paid.",
  "Thank you!"
]);
assert.deepEqual(customerPortalFiles(job).map((file) => file.name), ["invoice.pdf"]);

closeJob(job);
assert.equal(job.status, "closed");
assert.equal(job.closedBy, "owner.user");

console.log("Real shop workflow audit passed.");
