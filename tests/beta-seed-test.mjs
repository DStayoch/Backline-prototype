import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const seed = JSON.parse(await readFile("tools/beta-seed.json", "utf8"));
const resetNotes = await readFile("tools/beta-reset-notes.md", "utf8");
const walkthrough = await readFile("beta-walkthrough.md", "utf8");
const launchChecklist = await readFile("production-launch-checklist.md", "utf8");
const supabaseSetup = await readFile("supabase-production-setup.md", "utf8");

assert.equal(seed.meta?.format, "backline-export", "Seed should use Backline export format.");
assert.equal(seed.meta?.version, 2, "Seed should use current export version.");
assert.equal(seed.meta?.companyName, "Junk in Our Trunk", "Seed should identify the test shop.");

assert.ok(Array.isArray(seed.jobs), "Seed should include jobs.");
assert.ok(Array.isArray(seed.customers), "Seed should include customers.");
assert.ok(Array.isArray(seed.pricebookItems), "Seed should include pricebook items.");
assert.ok(Array.isArray(seed.suppliers), "Seed should include suppliers.");
assert.ok(Array.isArray(seed.activityEvents), "Seed should include activity events.");

assert.ok(seed.jobs.length >= 4, "Seed should include enough jobs for a full walkthrough.");
assert.ok(seed.customers.length >= 4, "Seed should include enough customers for search/directory checks.");
assert.ok(seed.pricebookItems.length >= 3, "Seed should include pricebook and inventory examples.");
assert.ok(seed.suppliers.length >= 2, "Seed should include supplier examples.");

const statuses = new Set(seed.jobs.map((job) => job.status));
for (const status of ["open", "booked", "estimated", "invoiced"]) {
  assert.ok(statuses.has(status), `Seed should include a ${status} job.`);
}

const bookedJob = seed.jobs.find((job) => job.status === "booked");
assert.ok(bookedJob?.scheduleDate, "Booked seed job should have a date.");
assert.ok(bookedJob?.startTime, "Booked seed job should have a start time.");
assert.notEqual(bookedJob?.technician, "To Be Determined", "Booked seed job should be assigned.");

const estimatedJob = seed.jobs.find((job) => job.status === "estimated");
assert.ok(estimatedJob?.estimate?.amount > 0, "Estimated seed job should have an estimate amount.");
assert.equal(estimatedJob?.approvalStatus, "sent", "Estimated seed job should have a sent approval state.");

const invoicedJob = seed.jobs.find((job) => job.status === "invoiced");
assert.ok(invoicedJob?.invoice?.lineItems?.length > 0, "Invoiced seed job should have line items.");
assert.ok(invoicedJob?.invoice?.payments?.length > 0, "Invoiced seed job should have payment history.");
const invoiceTotal = invoicedJob.invoice.lineItems.reduce((sum, line) => sum + Number(line.qty || 1) * Number(line.unitPrice || 0), 0);
const collected = invoicedJob.invoice.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
assert.ok(collected > 0 && collected < invoiceTotal, "Invoiced seed job should be partially paid.");

assert.ok(seed.jobs.some((job) => Array.isArray(job.equipment) && job.equipment.length), "Seed should include equipment records.");
assert.ok(seed.jobs.some((job) => Array.isArray(job.parts) && job.parts.length), "Seed should include logged parts.");
assert.ok(seed.jobs.every((job) => job.portalToken), "Seed jobs should include portal tokens for portal testing.");

for (const item of seed.pricebookItems) {
  assert.ok(item.id && item.name && item.category && item.unit, "Each pricebook item should have core fields.");
}

assert.match(resetNotes, /Do not restore `tools\/beta-seed\.json` into a real customer workspace/);
assert.match(walkthrough, /tools\/beta-seed\.json/);
assert.match(walkthrough, /supabase-schema-19-platform-admins\.sql/);
assert.match(walkthrough, /Creator account is added to `platform_admins`/);
assert.match(walkthrough, /SMS beta mode/);
assert.match(walkthrough, /Portal link is not localhost, `127\.0\.0\.1`, or `file:\/\/`/);
assert.match(launchChecklist, /tools\/beta-seed\.json/);
assert.match(launchChecklist, /tests\/real-shop-workflow-test\.mjs/);
assert.match(launchChecklist, /clear SMS\/missed-call beta mode/);
assert.match(supabaseSetup, /Only move to a pilot shop after these checks pass/);

console.log("Beta seed test passed.");
