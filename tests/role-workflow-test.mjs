import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync("app.js", "utf8");

const rolePermissions = {
  owner: {
    views: ["dashboard", "schedule", "inbox", "money", "followups", "communications", "jobsdb", "customers", "team", "activity", "insights"],
    actions: ["book", "start", "complete", "estimate", "approval", "portal", "portal-update", "payment-request", "customer-profile", "approve", "change", "invoice", "parts", "paid", "reopen", "close", "delete", "task", "task-toggle", "check-diagnosis", "check-photos", "check-signature"],
    createJob: true,
    uploadFiles: true,
    exportData: true,
    manageTeam: true
  },
  admin: {
    views: ["dashboard", "schedule", "inbox", "money", "followups", "communications", "jobsdb", "customers", "team", "activity", "insights"],
    actions: ["book", "start", "complete", "estimate", "approval", "portal", "portal-update", "payment-request", "customer-profile", "approve", "change", "invoice", "parts", "paid", "reopen", "close", "delete", "task", "task-toggle", "check-diagnosis", "check-photos", "check-signature"],
    createJob: true,
    uploadFiles: true,
    exportData: true,
    manageTeam: true
  },
  dispatcher: {
    views: ["schedule", "inbox", "followups", "communications", "jobsdb", "customers"],
    actions: ["book", "portal", "portal-update", "payment-request", "customer-profile", "task", "task-toggle"],
    createJob: true,
    uploadFiles: false,
    exportData: false,
    manageTeam: false
  },
  tech: {
    views: ["schedule", "inbox"],
    actions: ["start", "complete", "parts", "task", "task-toggle", "check-diagnosis", "check-photos", "check-signature"],
    createJob: false,
    uploadFiles: true,
    exportData: false,
    manageTeam: false
  }
};

const rolePermissionCatalog = [
  { key: "view-dashboard", label: "Home", type: "view", value: "dashboard" },
  { key: "view-schedule", label: "Schedule", type: "view", value: "schedule" },
  { key: "view-inbox", label: "Inbox", type: "view", value: "inbox" },
  { key: "view-money", label: "Money", type: "view", value: "money" },
  { key: "view-followups", label: "Follow-Ups", type: "view", value: "followups" },
  { key: "view-communications", label: "Comms", type: "view", value: "communications" },
  { key: "view-jobsdb", label: "Jobs database", type: "view", value: "jobsdb" },
  { key: "view-customers", label: "Customers", type: "view", value: "customers" },
  { key: "view-team", label: "Team", type: "view", value: "team" },
  { key: "view-activity", label: "Activity log", type: "view", value: "activity" },
  { key: "view-insights", label: "Insights", type: "view", value: "insights" },
  { key: "createJob", label: "Create jobs", type: "flag", value: "createJob" },
  { key: "book", label: "Schedule and dispatch", type: "action", value: "book" },
  { key: "start", label: "Start jobs", type: "action", value: "start" },
  { key: "complete", label: "Complete field work", type: "action", value: "complete" },
  { key: "estimate", label: "Send estimates", type: "action", value: "estimate" },
  { key: "approval", label: "Create approval links", type: "action", value: "approval" },
  { key: "change", label: "Change orders", type: "action", value: "change" },
  { key: "invoice", label: "Invoices, pricebook, inventory", type: "action", value: "invoice" },
  { key: "paid", label: "Record payments", type: "action", value: "paid" },
  { key: "payment-request", label: "Request payment", type: "action", value: "payment-request" },
  { key: "portal", label: "Customer portal links", type: "action", value: "portal" },
  { key: "portal-update", label: "Customer updates", type: "action", value: "portal-update" },
  { key: "customer-profile", label: "Edit customer profiles", type: "action", value: "customer-profile" },
  { key: "parts", label: "Log parts and equipment", type: "action", value: "parts" },
  { key: "uploadFiles", label: "Upload files/photos", type: "flag", value: "uploadFiles" },
  { key: "task", label: "Create tasks", type: "action", value: "task" },
  { key: "task-toggle", label: "Complete/reopen tasks", type: "action", value: "task-toggle" },
  { key: "check-diagnosis", label: "Diagnosis checklist", type: "action", value: "check-diagnosis" },
  { key: "check-photos", label: "Photo checklist", type: "action", value: "check-photos" },
  { key: "check-signature", label: "Signature checklist", type: "action", value: "check-signature" },
  { key: "reopen", label: "Reopen jobs", type: "action", value: "reopen" },
  { key: "close", label: "Close jobs", type: "action", value: "close" },
  { key: "delete", label: "Delete/archive jobs", type: "action", value: "delete" },
  { key: "manageTeam", label: "Manage team and roles", type: "flag", value: "manageTeam" },
  { key: "exportData", label: "Workspace settings/export", type: "flag", value: "exportData" }
];

const rolePermissionDependencies = {
  createJob: ["view-inbox"],
  book: ["view-schedule", "view-inbox"],
  start: ["view-inbox"],
  complete: ["view-inbox"],
  estimate: ["view-inbox"],
  approval: ["view-inbox"],
  change: ["view-inbox"],
  invoice: ["view-inbox", "view-money"],
  paid: ["view-inbox", "view-money"],
  "payment-request": ["view-inbox"],
  portal: ["view-inbox"],
  "portal-update": ["view-inbox"],
  "customer-profile": ["view-customers"],
  parts: ["view-inbox"],
  uploadFiles: ["view-inbox"],
  task: ["view-inbox"],
  "task-toggle": ["view-inbox"],
  "check-diagnosis": ["view-inbox"],
  "check-photos": ["view-inbox"],
  "check-signature": ["view-inbox"],
  reopen: ["view-inbox"],
  close: ["view-inbox"],
  delete: ["view-inbox"],
  manageTeam: ["view-team"],
  exportData: ["view-dashboard"]
};

function expandedRolePermissionKeys(keys = []) {
  const selected = new Set(Array.isArray(keys) ? keys : []);
  let changed = true;
  while (changed) {
    changed = false;
    [...selected].forEach((key) => {
      (rolePermissionDependencies[key] || []).forEach((requiredKey) => {
        if (!selected.has(requiredKey)) {
          selected.add(requiredKey);
          changed = true;
        }
      });
    });
  }
  return selected;
}

function rolePermissionFromKeys(keys = [], template = "tech") {
  const base = rolePermissions[template] || rolePermissions.tech;
  const permissions = {
    views: [],
    actions: [],
    createJob: false,
    uploadFiles: false,
    exportData: false,
    manageTeam: false
  };
  const selected = expandedRolePermissionKeys(keys);
  rolePermissionCatalog.forEach((permission) => {
    const enabled = selected.has(permission.key);
    if (permission.type === "view") {
      if (enabled) permissions.views.push(permission.value);
      return;
    }
    if (permission.type === "action") {
      if (enabled) permissions.actions.push(permission.value);
      return;
    }
    permissions[permission.value] = enabled;
  });
  return {
    ...permissions,
    views: permissions.views.length ? permissions.views : [...base.views],
    actions: permissions.actions
  };
}

function roleSlug(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

function normalizeCustomRole(role = {}, existing = new Set()) {
  const label = String(role.label || "").trim();
  const slug = roleSlug(role.slug || label);
  if (!label || !slug || rolePermissions[slug] || existing.has(slug)) return null;
  const template = rolePermissions[role.template] ? role.template : "tech";
  return {
    slug,
    label,
    template,
    summary: String(role.summary || "").trim(),
    permissions: rolePermissionFromKeys(role.permissionKeys || [], template)
  };
}

function enforceBuiltInRolePermissionLimits(slug, permissions = {}) {
  const next = {
    views: [...(permissions.views || [])],
    actions: [...(permissions.actions || [])],
    createJob: Boolean(permissions.createJob),
    uploadFiles: Boolean(permissions.uploadFiles),
    exportData: Boolean(permissions.exportData),
    manageTeam: Boolean(permissions.manageTeam)
  };
  if (["dispatcher", "tech"].includes(slug)) {
    next.manageTeam = false;
  }
  return next;
}

function roleDefinition(settings, role) {
  return settings.roleOverrides?.[role]?.permissions || settings.customRoles.find((customRole) => customRole.slug === role)?.permissions || rolePermissions[role] || null;
}

function canManageTeamRole(settings, role) {
  if (role === "owner") return true;
  if (["dispatcher", "tech"].includes(role)) return false;
  return Boolean(roleDefinition(settings, role)?.manageTeam);
}

function can(settings, currentRole, action) {
  const role = roleDefinition(settings, currentRole) || rolePermissions.tech;
  if (action === "createJob") return Boolean(role.createJob);
  if (action === "uploadFiles") return Boolean(role.uploadFiles);
  if (action === "exportData") return Boolean(role.exportData);
  if (action === "manageTeam") return canManageTeamRole(settings, currentRole);
  return role.actions.includes(action);
}

function allowedViews(settings, currentRole, isCreator = false) {
  const views = [...(roleDefinition(settings, currentRole)?.views || [])];
  if (isCreator && !views.includes("creator")) views.push("creator");
  return views;
}

function visibleActionButtons(settings, currentRole) {
  return ["book", "start", "complete", "estimate", "approval", "portal", "portal-update", "payment-request", "invoice", "paid", "parts", "reopen", "close", "delete"]
    .filter((action) => can(settings, currentRole, action));
}

function isFieldScopedRole(settings, role) {
  return role === "tech" || settings.customRoles.find((customRole) => customRole.slug === role)?.template === "tech";
}

function isAssignedToUser(job, tokens, fieldScoped) {
  if (!fieldScoped) return true;
  const technician = String(job.technician || "").toLowerCase();
  if (!technician || technician === "to be determined") return false;
  return tokens.some((token) => technician.includes(token));
}

function roleScopedJobs(settings, role, jobs, tokens) {
  const fieldScoped = isFieldScopedRole(settings, role);
  return jobs.filter((job) => isAssignedToUser(job, tokens, fieldScoped)).map((job) => job.id);
}

const baseSettings = {
  customRoles: [],
  roleOverrides: {},
  settingsUpdatedAt: "2026-06-12T12:00:00.000Z"
};

assert.deepEqual(allowedViews(baseSettings, "owner"), rolePermissions.owner.views);
assert.deepEqual(allowedViews(baseSettings, "admin"), rolePermissions.admin.views);
assert.deepEqual(allowedViews(baseSettings, "dispatcher"), ["schedule", "inbox", "followups", "communications", "jobsdb", "customers"]);
assert.deepEqual(allowedViews(baseSettings, "tech"), ["schedule", "inbox"]);
assert.deepEqual(allowedViews(baseSettings, "tech", true), ["schedule", "inbox", "creator"]);

for (const role of ["owner", "admin"]) {
  assert.equal(can(baseSettings, role, "manageTeam"), true);
  assert.equal(can(baseSettings, role, "exportData"), true);
  assert.equal(can(baseSettings, role, "delete"), true);
  assert.equal(can(baseSettings, role, "invoice"), true);
}

assert.equal(can(baseSettings, "dispatcher", "createJob"), true);
assert.equal(can(baseSettings, "dispatcher", "book"), true);
assert.equal(can(baseSettings, "dispatcher", "portal-update"), true);
assert.equal(can(baseSettings, "dispatcher", "payment-request"), true);
assert.equal(can(baseSettings, "dispatcher", "invoice"), false);
assert.equal(can(baseSettings, "dispatcher", "paid"), false);
assert.equal(can(baseSettings, "dispatcher", "manageTeam"), false);
assert.equal(can(baseSettings, "dispatcher", "exportData"), false);

assert.equal(can(baseSettings, "tech", "start"), true);
assert.equal(can(baseSettings, "tech", "complete"), true);
assert.equal(can(baseSettings, "tech", "parts"), true);
assert.equal(can(baseSettings, "tech", "uploadFiles"), true);
assert.equal(can(baseSettings, "tech", "createJob"), false);
assert.equal(can(baseSettings, "tech", "book"), false);
assert.equal(can(baseSettings, "tech", "invoice"), false);
assert.equal(can(baseSettings, "tech", "manageTeam"), false);

const noEstimateLead = normalizeCustomRole({
  label: "Field lead - no estimates",
  template: "tech",
  summary: "Can close assigned jobs without selling.",
  permissionKeys: [
    "view-schedule",
    "view-inbox",
    "view-jobsdb",
    "start",
    "complete",
    "approval",
    "parts",
    "uploadFiles",
    "task",
    "task-toggle",
    "check-diagnosis",
    "check-photos",
    "check-signature",
    "close"
  ]
});
const roleAdmin = normalizeCustomRole({
  label: "Role manager",
  template: "dispatcher",
  summary: "Can manage people, but only because manage team is explicitly checked.",
  permissionKeys: ["manageTeam"]
});
const billingOnly = normalizeCustomRole({
  label: "Billing only",
  template: "dispatcher",
  summary: "Can invoice and record payments.",
  permissionKeys: ["invoice", "paid"]
});

const settings = {
  customRoles: [noEstimateLead, roleAdmin, billingOnly],
  roleOverrides: {
    dispatcher: {
      label: "Dispatcher plus attempted admin",
      summary: "Manage team should still be blocked for this built-in role.",
      permissions: enforceBuiltInRolePermissionLimits("dispatcher", {
        ...rolePermissions.dispatcher,
        manageTeam: true
      })
    }
  }
};
const savedSettings = settings;
const assignedRole = noEstimateLead.slug;

assert.equal(noEstimateLead.slug, "field-lead-no-estimates");
assert.deepEqual(allowedViews(settings, noEstimateLead.slug), ["schedule", "inbox", "jobsdb"]);
assert.equal(can(settings, noEstimateLead.slug, "start"), true);
assert.equal(can(settings, noEstimateLead.slug, "complete"), true);
assert.equal(can(settings, noEstimateLead.slug, "parts"), true);
assert.equal(can(settings, noEstimateLead.slug, "approval"), true);
assert.equal(can(settings, noEstimateLead.slug, "estimate"), false);
assert.equal(can(settings, noEstimateLead.slug, "manageTeam"), false);
assert.equal(can(settings, noEstimateLead.slug, "exportData"), false);
assert.deepEqual(visibleActionButtons(settings, noEstimateLead.slug), ["start", "complete", "approval", "parts", "close"]);
assert.equal(can(savedSettings, assignedRole, "estimate"), false);
assert.equal(visibleActionButtons(savedSettings, assignedRole).includes("estimate"), false);

assert.equal(roleAdmin.slug, "role-manager");
assert.equal(can(settings, roleAdmin.slug, "manageTeam"), true);
assert.deepEqual(allowedViews(settings, roleAdmin.slug), ["team"]);

assert.equal(billingOnly.slug, "billing-only");
assert.equal(can(settings, billingOnly.slug, "invoice"), true);
assert.equal(can(settings, billingOnly.slug, "paid"), true);
assert.deepEqual(allowedViews(settings, billingOnly.slug), ["inbox", "money"]);

assert.equal(can(settings, "dispatcher", "manageTeam"), false);

const jobs = [
  { id: "mine", technician: "tech.test" },
  { id: "mine-email", technician: "tech.test@example.com" },
  { id: "other", technician: "other.tech" },
  { id: "tbd", technician: "To Be Determined" }
];
const tokens = ["tech.test", "tech.test@example.com"];
assert.deepEqual(roleScopedJobs(baseSettings, "tech", jobs, tokens), ["mine", "mine-email"]);
assert.deepEqual(roleScopedJobs(settings, noEstimateLead.slug, jobs, tokens), ["mine", "mine-email"]);
assert.deepEqual(roleScopedJobs(baseSettings, "dispatcher", jobs, tokens), ["mine", "mine-email", "other", "tbd"]);

assert.match(app, /function canManageTeamRole\(roleSlug = currentRole\(\)\)/);
assert.match(app, /if \(roleSlug === "owner"\) return true/);
assert.match(app, /if \(\["dispatcher", "tech"\]\.includes\(roleSlug\)\) return false/);
assert.match(app, /if \(action === "manageTeam"\) return canManageTeamRole\(\)/);
assert.match(app, /if \(view === "creator"\) return Boolean\(state\.isCreator\)/);
assert.match(app, /button\.hidden = !isViewAllowed\(view\)/);
assert.match(app, /section\.hidden = !allowed/);
assert.match(app, /elements\.newJobButton\.hidden = !can\("createJob"\)/);
assert.match(app, /querySelector\("#settingsExportButton"\)\?\.toggleAttribute\("hidden", !can\("exportData"\)\)/);
assert.match(app, /const canManageTeam = can\("manageTeam"\)/);
assert.match(app, /teamAdminPanel\.hidden = !canManageTeam/);
assert.match(app, /canManage \? `[\s\S]*data-member-role-picker/);
assert.match(app, /canManage \? `<section class="team-section team-invites-section">/);
assert.match(app, /field\.disabled = !canManage/);
assert.match(app, /function isFieldScopedRole\(role = currentRole\(\)\)/);
assert.match(app, /return role === "tech" \|\| customRoleMap\(\)\[role\]\?\.template === "tech"/);
assert.match(app, /function roleScopedJobs\(\)[\s\S]*?return state\.jobs\.filter/);
assert.match(app, /if \(action === "note" \? !canAddInternalNote\(\) : !canOrRecord\(action, "job action"\)\) return/);
assert.match(app, /function canRemoveInternalNote\(\)[\s\S]*?\["owner", "admin"\]\.includes\(currentRole\(\)\)/);
assert.match(app, /if \(!canOrRecord\("uploadFiles", "upload job file"\)\) return/);
assert.match(app, /if \(!canOrRecord\("createJob", "create job"\)\) return/);
assert.match(app, /if \(!canOrRecord\("delete", "delete job"\)\) return/);
assert.match(app, /if \(!canOrRecord\("customer-profile", "update customer profile"\)\) return/);

console.log("Role workflow test passed.");
