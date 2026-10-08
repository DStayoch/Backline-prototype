import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync("app.js", "utf8");
const schema = readFileSync("supabase-schema.sql", "utf8");
const portalSchema = readFileSync("supabase-schema-14-customer-portal.sql", "utf8");
const approvalSchema = readFileSync("supabase-schema-05-approval-rpc.sql", "utf8");
const tokenSchema = readFileSync("supabase-schema-17-public-token-hardening.sql", "utf8");

assert.match(app, /function renderTokenCustomerPortalPage\(token, options = \{\}\)/);
assert.match(app, /client\.rpc\("get_customer_portal_by_token", \{ input_token: token \}\)/);
assert.match(app, /renderCustomerPortalPage\(remoteJob, \{ \.\.\.options, companySettings: row\.company_settings \}\)/);
assert.match(app, /function renderTokenApprovalPage\(token\)/);
assert.match(app, /client\.rpc\("get_approval_by_token", \{ input_token: token \}\)/);
assert.match(app, /renderApprovalPage\(row\.job, \{ token, publicMode: true, linkStatus: row\.link_status, companySettings: row\.company_settings \}\)/);

assert.match(app, /const decisionSent =[\s\S]*?options\.linkStatus === "used"/);
assert.match(app, /function approvalPdfLines\(job, company = companySettings\(\)\)/);
assert.match(app, /function approvalPdfSections\(job, company = companySettings\(\)\)/);
assert.match(app, /function customerFacingTechnicianName\(value\)/);
assert.match(app, /const label = businessTerminology\(\)\.assignee;\s+return first === "there" \? label : `\$\{label\} \$\{first\}`/s, "Customer-facing assignment names should use the workspace's terminology.");
assert.match(app, /\["Technician", customerFacingTechnicianName\(job\.technician\)\]/);
assert.match(app, /customerFacingTechnicianName\(job\.technician\)\s+\]\);/);
assert.match(app, /title: "Service provider"/);
assert.match(app, /title: "Customer and job"/);
assert.match(app, /title: "Estimate approval"/);
assert.match(app, /title: "Terms and notes"/);
assert.match(app, /const PDF_PAGE_WIDTH = 612/);
assert.match(app, /const PDF_PAGE_BOTTOM = 672/);
assert.match(app, /const PDF_FOOTER_TOP = 710/);
assert.match(app, /const APPROVAL_PDF_LAYOUT_VERSION = "2026-08-footer-band"/);
assert.match(app, /function ensurePdfSpace\(pdf, y, requiredHeight, margin = 48\)/);
assert.match(app, /function addPdfSectionTitle\(pdf, title, margin, y\)/);
assert.match(app, /pdf\.splitTextToSize\(String\(footerText \|\| ""\), PDF_PAGE_WIDTH - margin \* 2\)\.slice\(0, 3\)/);
assert.match(app, /function addPdfBrandHeader\(pdf, title, subtitle = "", company = companySettings\(\)\)/);
assert.match(app, /const company = options\.companySettings[\s\S]*?customerFacingCompanySettings\(options\.companySettings\)[\s\S]*?: companySettings\(\)/);
assert.match(app, /createApprovalPdfFile\(pdfJob, \{ companySettings: state\.portalCompanySettings \}\)/);
assert.match(app, /approvalPdfLines\(job, company\)/);
assert.match(app, /approvalPdfSections\(job, company\)\.forEach/);
assert.match(app, /y = ensurePdfSpace\(pdf, y, 164, margin\)/);
assert.match(app, /layoutVersion: APPROVAL_PDF_LAYOUT_VERSION/);
assert.match(app, /function approvalPdfFileIsCurrent\(file = \{\}\)/);
assert.match(app, /function refreshCurrentApprovalPdfs\(options = \{\}\)/);
assert.match(app, /\(job\.files \|\| \[\]\)\.filter\(\(file\) => String\(file\.source \|\| ""\)\.toLowerCase\(\) !== "approval pdf"\)/);
assert.match(app, /const refreshedApprovalPdfs = await refreshCurrentApprovalPdfs\(\)/);
assert.match(app, /Thank you\. Your approval has been sent\./);
assert.match(app, /approvalPdfFile && !submittedJob\.files\.some/);
assert.match(app, /renderApprovalPage\(submittedJob, \{ token, publicMode: true, linkStatus: "used", decision, approvalPdfFile, companySettings: state\.portalCompanySettings \}\)/);

assert.match(app, /function customerPortalMessages\(job = \{\}\)[\s\S]*?filter\(isCustomerPortalMessage\)/);
assert.match(app, /function allCustomerPortalMessages\(job = \{\}\)[\s\S]*?filter\(isCustomerPortalMessage\)/);
assert.match(app, /function invoicePaymentLink\(job = \{\}, company = companySettings\(\)\)[\s\S]*?normalizePaymentLink\(company\?\.defaultPaymentLink\)/);
assert.match(app, /const paymentLink = invoicePaymentLink\(job, company\)/);
assert.match(app, /href="\$\{escapeHtml\(paymentLink\)\}" target="_blank" rel="noopener noreferrer"/);
assert.match(app, />Pay \$\{escapeHtml\(formatMoney\(requestedAmount\)\)\}<\/a>/);
assert.match(app, /Backline does not store card or bank details/);
assert.match(readFileSync("index.html", "utf8"), /<input name="email" type="email" autocomplete="email" placeholder="customer@example\.com">/, "New work items collect the customer's email");
assert.match(app, /email: String\(formData\.get\("email"\) \|\| ""\)\.trim\(\),/, "The work item keeps the email it was created with");
assert.match(app, /Added to an existing customer/, "A matching phone number is announced, not merged silently");
assert.match(app, /function customersWithPhone\(phone\)/, "The form finds every customer using a phone number");
assert.match(app, /name="customerChoice" value="\$\{NEW_CUSTOMER_CHOICE\}"/, "People who share a phone number can be separate customers");
assert.match(app, /if \(customerChoice === NEW_CUSTOMER_CHOICE && sharedPhoneCustomers\.length\) \{\s+job\.customerId = separateCustomerIdForPhone\(job\.phone\);/, "Choosing a separate customer gives the work item its own customer ID");
assert.match(app, /if \(box\.dataset\.matchKey === key\) return;/, "Typing in other fields must not reset the customer choice");
assert.match(app, /functions\.invoke\("send-customer-email", \{\s+body: \{ organizationId: state\.organizationId, jobId, kind, \.\.\.\(message \? \{ message \} : \{\}\) \}/, "The app names the job and kind only; the server picks the recipient and link");
assert.match(app, /"portal-email": "portal",\s+"approval-email": "approval"/, "Email actions use the permission of what they send");
assert.match(app, /const checked = Object\.keys\(draft\)\.length \? draft\.emailCustomer === "on" : true;/, "An unticked email box must stay unticked when the form redraws");
assert.match(app, /await waitForSecureSave\(\);/, "Pending saves land before the server reads the job");
assert.match(app, /defaultPaymentLink: normalizePaymentLink\(settings\.defaultPaymentLink\)/, "Shops set one default payment link in Settings");
assert.match(app, /renderCustomerPortalPaymentRequest\(job, company\)/, "The portal uses the shop's settings, not the viewer's");
assert.match(app, /Already paid\? Let the office know/, "The report-a-payment form stays available behind a toggle");
assert.match(app, /\["Other ways to pay", company\.paymentInstructions/, "Invoices list the shop's other payment methods");
assert.match(app, /function customerFacingMessageAuthor\(message = \{\}, company = companySettings\(\)\)/);
assert.match(app, /customerFacingTechnicianName\(normalized\.createdBy\)/);
assert.match(app, /escapeHtml\(customerFacingMessageAuthor\(message, company\)\)/);
assert.match(app, /escapeHtml\(customerFacingTechnicianName\(job\.technician\)\)/);
assert.match(app, /function customerPortalPaymentTimelineLabel\(payment = \{\}\)/);
assert.match(app, /deposit: "deposit received"/);
assert.match(app, /refund: "refund issued"/);
assert.match(app, /title: customerPortalPaymentTimelineLabel\(payment\)/);
assert.match(app, /detail: customerPortalPaymentTimelineDetail\(payment, invoice\)/);
assert.match(app, /createdAt: payment\.paidAt \|\| payment\.createdAt/);
assert.match(app, /function invoicePaidInFullTimelinePayment\(invoice = \{\}\)/);
assert.match(app, /return collected >= record\.amount/);
assert.match(app, /title: "Invoice paid in full"/);
assert.match(app, /detail: `\$\{formatMoney\(invoice\.amount\)\} total has been received\.`/);
assert.match(app, /label: "Invoice paid in full"/);
assert.match(app, /detail: `\$\{invoice\.number\} - \$\{formatMoney\(invoice\.amount\)\} total received`/);
assert.match(app, /submit_customer_portal_reply/);
assert.match(app, /input_reply: reply/);
assert.match(app, /input_reply: message/);

for (const sql of [schema, portalSchema, tokenSchema]) {
  assert.match(sql, /create or replace function public\.get_customer_portal_by_token\(input_token text\)/);
  assert.match(sql, /returns table \(\s+job jsonb,\s+company_settings jsonb\s+\)/);
  assert.match(sql, /join public\.organizations o on o\.id = j\.organization_id/);
  assert.match(sql, /where organization_id = target_org_id\s+and id = target_job_id/);
}

for (const sql of [schema, approvalSchema, tokenSchema]) {
  assert.match(sql, /create or replace function public\.get_approval_by_token\(input_token text\)/);
  assert.match(sql, /returns table \(\s+job jsonb,\s+company_settings jsonb,\s+link_status text/);
  assert.match(sql, /join public\.jobs j on j\.id = l\.job_id and j\.organization_id = l\.organization_id/);
  assert.match(sql, /join public\.organizations o on o\.id = l\.organization_id/);
  assert.match(sql, /where organization_id = target_org_id\s+and id = target_job_id/);
  assert.match(sql, /where organization_id = target_org_id\s+and token = input_token/);
}

assert.match(schema, /where lower\(coalesce\(message->>'customerVisible', 'false'\)\) = 'true'/);
assert.match(schema, /where lower\(coalesce\(file->>'customerVisible', 'false'\)\) = 'true'/);
assert.match(schema, /- 'parts'[\s\S]*- 'equipment'[\s\S]*- 'customerSignatureImage'/);

console.log("Customer-facing flow contracts passed.");
