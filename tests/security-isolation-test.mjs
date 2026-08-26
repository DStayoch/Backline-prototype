import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync("app.js", "utf8");
const schema05 = readFileSync("supabase-schema-05-approval-rpc.sql", "utf8");
const schema09 = readFileSync("supabase-schema-09-approval-signatures.sql", "utf8");
const schema14 = readFileSync("supabase-schema-14-customer-portal.sql", "utf8");
const schema15 = readFileSync("supabase-schema-15-custom-roles.sql", "utf8");
const schema16 = readFileSync("supabase-schema-16-security-hardening.sql", "utf8");
const schema17 = readFileSync("supabase-schema-17-public-token-hardening.sql", "utf8");
const schema22 = readFileSync("supabase-schema-22-secure-sync.sql", "utf8");
const fullSchema = readFileSync("supabase-schema.sql", "utf8");

function assertOrgScopedSelect(table, label = table) {
  assert.match(
    app,
    new RegExp(`\\.from\\("${table}"\\)[\\s\\S]{0,220}\\.eq\\("organization_id", state\\.organizationId\\)`),
    `${label} reads must be scoped to the signed-in workspace`
  );
}

function assertOrgScopedPolicy(sql, table, policyKind = "is_org_member") {
  assert.match(
    sql,
    new RegExp(`on public\\.${table}[\\s\\S]{0,260}${policyKind}\\(organization_id\\)`),
    `${table} policies must stay workspace-scoped`
  );
}

for (const table of ["jobs", "customers", "job_files", "pricebook_items", "deleted_jobs", "activity_events", "organization_members", "team_invites"]) {
  assertOrgScopedSelect(table);
}

for (const mapper of ["customerToRemoteRow", "jobToRemoteRow", "deletedJobToRemoteRow", "activityToRemoteRow", "pricebookToRemoteRow"]) {
  assert.match(
    app,
    new RegExp(`function ${mapper}\\([\\s\\S]*?organization_id: state\\.organizationId`),
    `${mapper} must write organization_id from the active workspace`
  );
}

assert.match(app, /function secureCompanySettingsKey\(orgId = state\.organizationId\)/);
assert.match(app, /if \(record\?\.organizationId && record\.organizationId !== orgId\) return null/);
assert.match(app, /organizationId: orgId/);
assert.match(app, /payload: \{ companySettings: company, suppliers: state\.suppliers\.map\(normalizeSupplierRecord\) \}/);
assert.match(app, /\.from\("organizations"\)[\s\S]{0,220}\.eq\("id", state\.organizationId\)/);
assert.match(app, /const SELECTED_WORKSPACE_KEY_PREFIX = "backline\.selectedWorkspace"/);
assert.match(app, /function loadSelectedWorkspaceId\(userId = state\.currentUser\?\.id\)/);
assert.match(app, /function saveSelectedWorkspaceId\(organizationId = state\.organizationId, userId = state\.currentUser\?\.id\)/);
assert.match(app, /sessionStorage\.setItem\(key, organizationId\)/);
assert.match(app, /saveSelectedWorkspaceId\(state\.organizationId\)/);
assert.match(app, /resetSecureWorkspaceState\(\)[\s\S]*?state\.jobs = \[\][\s\S]*?state\.customers = \[\][\s\S]*?state\.portalCompanySettings = null/);
assert.match(app, /async function loadDatabaseData\(\) \{\s+if \(state\.secureMode\) return;/);
assert.match(app, /async function persistDatabase\(\) \{\s+if \(state\.secureMode\) return;/);

assert.match(app, /organizationId: state\.secureMode \? state\.organizationId : null/);
assert.match(app, /sourceOrg && sourceOrg !== state\.organizationId/);
assert.match(app, /This export belongs to a different Backline workspace/);
assert.match(app, /state\.jobs\.map\(sanitizeJobForExport\)/);
assert.match(app, /delete exported\.url/);

assert.match(app, /settings\.customRoles = \[\.\.\.settings\.customRoles, role\]/);
assert.match(app, /settings\.roleOverrides = \{/);
assert.match(app, /await saveRoleSettingsChange\(\)/);
assert.match(schema15, /drop constraint if exists organization_members_role_check/);
assert.match(schema15, /drop constraint if exists team_invites_role_check/);

assert.match(app, /\.from\("activity_events"\)[\s\S]{0,180}\.upsert\(state\.activityEvents\.map\(activityToRemoteRow\), \{ onConflict: "id", ignoreDuplicates: true \}\)/);
assert.doesNotMatch(app, /\.from\("activity_events"\)[\s\S]{0,180}\.update\(/);

assertOrgScopedPolicy(schema16, "pricebook_items");
assertOrgScopedPolicy(schema16, "activity_events");
assertOrgScopedPolicy(schema16, "job_files");
assertOrgScopedPolicy(schema16, "deleted_jobs", "is_org_admin");
assert.match(schema16, /public\.is_org_admin\(id\)/);
assert.match(schema16, /storage\.foldername\(name\)\)\[1\]/);

assert.match(app, /client\.rpc\("sync_job_if_revision"/);
assert.match(app, /client\.rpc\("sync_customer_if_revision"/);
assert.match(app, /const dirtyCustomers = can\("customer-profile"\)\s*\?\s*state\.customers\.filter\(remoteRecordIsDirty\)\s*:\s*\[\];/s, "Technician job changes must not require customer-profile permission.");
assert.match(app, /function fieldRoleJobPayload\(job, payload\)/, "Field roles need a payload path that preserves server-only job fields.");
assert.match(app, /const nextPayload = JSON\.parse\(JSON\.stringify\(job\._remotePayload\)\);/, "Field roles must begin from the server's job payload instead of writing local defaults.");
assert.match(app, /if \(can\("start"\)\) \["status", "startedAt", "notifications"\]/, "Field-role start sync must send only start-related job fields.");
assert.match(app, /expected_revision: Number\(job\._remoteRevision\) \|\| 0/);
assert.match(app, /expected_revision: Number\(customer\._remoteRevision\) \|\| 0/);
assert.match(app, /function registerRemoteSyncConflict/);
assert.doesNotMatch(app, /\.from\("jobs"\)[\s\S]{0,180}\.(upsert|update|insert|delete)\(/);
assert.doesNotMatch(app, /\.from\("customers"\)[\s\S]{0,180}\.(upsert|update|insert|delete)\(/);
assert.match(schema22, /add column if not exists revision bigint/);
assert.match(schema22, /create or replace function public\.sync_job_if_revision/);
assert.match(schema22, /create or replace function public\.sync_customer_if_revision/);
assert.match(schema22, /create or replace function public\.delete_job_if_revision/);
assert.match(schema22, /return jsonb_build_object\('status', 'conflict'/);
assert.match(schema22, /array\['status', 'startedAt', 'assignmentSeenBy', 'messages', 'notifications'\]/, "Technicians need to persist assignment acknowledgement and the start timestamp when starting assigned work.");
assert.match(schema22, /drop policy if exists "Members can manage jobs"/);
assert.match(schema22, /drop policy if exists "Members can manage customers"/);

for (const internalField of ["parts", "reservations", "tasks", "notifications", "followupState", "assignmentSeenBy", "fieldChecklist", "equipment", "customerSignatureImage"]) {
  assert.match(schema17, new RegExp(`- '${internalField}'`), `Public token responses must strip ${internalField}`);
}
assert.match(schema17, /where lower\(coalesce\(message->>'customerVisible', 'false'\)\) = 'true'/);
assert.match(schema17, /where lower\(coalesce\(file->>'customerVisible', 'false'\)\) = 'true'/);
assert.match(schema17, /join public\.jobs j on j\.id = l\.job_id and j\.organization_id = l\.organization_id/);
assert.match(schema17, /where organization_id = target_org_id\s+and id = target_job_id/);
assert.match(schema17, /where organization_id = target_org_id\s+and token = input_token/);
assert.match(schema17, /return public\.customer_safe_job\(next_payload\)/);
assert.match(schema17, /returns table \(\s+job jsonb,\s+company_settings jsonb,\s+link_status text/);
assert.match(schema17, /returns table \(\s+job jsonb,\s+company_settings jsonb\s+\)/);
assert.match(schema17, /join public\.organizations o on o\.id = l\.organization_id/);
assert.match(schema17, /join public\.organizations o on o\.id = j\.organization_id/);
for (const schema of [schema05, schema09, schema14]) {
  assert.match(schema, /where organization_id = target_org_id\s+and id = target_job_id/, "Incremental public token writes must stay workspace-scoped");
}
for (const schema of [schema05, schema14]) {
  assert.match(schema, /company_settings jsonb/, "Incremental public token readers must return workspace branding");
  assert.match(schema, /join public\.organizations o on o\.id = (l|j)\.organization_id/, "Incremental public token readers must derive branding from the token workspace");
}
assert.match(fullSchema, /jobs_portal_token_unique_idx/);
assert.match(fullSchema, /returns table \(\s+job jsonb,\s+company_settings jsonb,\s+link_status text/);
assert.match(fullSchema, /returns table \(\s+job jsonb,\s+company_settings jsonb\s+\)/);
assert.match(fullSchema, /join public\.organizations o on o\.id = l\.organization_id/);
assert.match(fullSchema, /join public\.organizations o on o\.id = j\.organization_id/);
assert.match(fullSchema, /where organization_id = target_org_id\s+and id = target_job_id/);
assert.match(fullSchema, /where organization_id = target_org_id\s+and token = input_token/);

console.log("Security isolation test passed.");
