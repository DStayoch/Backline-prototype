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
assert.match(app, /Thank you\. Your approval has been sent\./);
assert.match(app, /approvalPdfFile && !submittedJob\.files\.some/);
assert.match(app, /renderApprovalPage\(submittedJob, \{ token, publicMode: true, linkStatus: "used", decision, approvalPdfFile, companySettings: state\.portalCompanySettings \}\)/);

assert.match(app, /function customerPortalMessages\(job = \{\}\)[\s\S]*?filter\(isCustomerPortalMessage\)/);
assert.match(app, /function allCustomerPortalMessages\(job = \{\}\)[\s\S]*?filter\(isCustomerPortalMessage\)/);
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
