const STORAGE_KEY = "backline.jobs.v2";
const DELETED_JOBS_KEY = "backline.deletedJobs.v1";
const ACTIVITY_KEY = "backline.activity.v1";
const AUTOMATION_KEY = "backline.automations.v1";
const PRICEBOOK_KEY = "backline.pricebook.v1";
const SUPPLIER_KEY = "backline.suppliers.v1";
const COMPANY_SETTINGS_KEY = "backline.companySettings.v1";
const SECURE_COMPANY_SETTINGS_KEY_PREFIX = "backline.secureCompanySettings";
const SELECTED_WORKSPACE_KEY_PREFIX = "backline.selectedWorkspace";
const FOUNDRY_PILOT_CRM_KEY = "backline.foundryPilotCrm.v1";
const THEME_KEY = "backline.theme.v1";
const OWNER_ONBOARDING_KEY = "backline.ownerOnboardingEmail.v1";
const DATABASE_NAME = "backline.field-service";
const DATABASE_VERSION = 5;
const JOB_STORE = "jobs";
const CUSTOMER_STORE = "customers";
const DELETED_JOB_STORE = "deletedJobs";
const ACTIVITY_STORE = "activityEvents";
const PRICEBOOK_STORE = "pricebookItems";
const SUPPLIER_STORE = "suppliers";
const SCHEDULE_LATER_WINDOW_DAYS = 42;
const DEFAULT_JOB_DURATION_MINUTES = 90;
const DAILY_TECH_CAPACITY_MINUTES = 8 * 60;
const MESSAGE_THREAD_DEFAULT_HEIGHT = 340;
const MESSAGE_THREAD_MIN_HEIGHT = 220;
const MESSAGE_THREAD_MAX_HEIGHT = 680;
const INVOICE_BASELINE_DESCRIPTION = "Existing invoice total";
const INVOICE_BASELINE_LINE_ID = "invoice-baseline-line";
const INVOICE_ESTIMATE_LINE_SOURCE = "estimate";
const INVOICE_CARRYFORWARD_LINE_ID = "prior-paid-work-line";
const INVOICE_CARRYFORWARD_SOURCE = "prior-paid-work";
const INVOICE_PART_LINE_SOURCE = "logged-part";
const durationOptions = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
  { value: "240", label: "4 hours" }
];

const timeZoneOptions = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu"
];

const defaultAutomations = {
  missedCall: true,
  appointmentReminder: true,
  estimateFollowUp: true,
  invoiceFollowUp: false,
  reviewRequest: true
};

const betaReadinessChecklist = [
  { key: "owner-signup", label: "Owner signup works", detail: "Create account, confirm login, and reach the workspace." },
  { key: "workspace-settings", label: "Workspace settings persist", detail: "Shop profile, phone, service area, slogan, and timezone survive refresh." },
  { key: "invite-email", label: "Invite email works", detail: "Team invite email sends or fallback copy is clear." },
  { key: "technician-role", label: "Technician permissions work", detail: "Technician sees assigned work without owner-only tabs." },
  { key: "approval-link", label: "Approval link works", detail: "Customer can approve/decline once, with signature and reason handling." },
  { key: "portal-reply", label: "Customer portal reply works", detail: "Customer replies reach Backline and only customer-visible updates show." },
  { key: "file-view", label: "File upload/view works", detail: "Uploaded files can be viewed from Backline and the portal when visible." },
  { key: "payment-recording", label: "Payment recording works", detail: "Partial/full payments update collected and balance correctly." },
  { key: "mobile-job-view", label: "Mobile inbox/job view works", detail: "Inbox, job actions, tasks, and customer details fit on a phone." },
  { key: "activity-log", label: "Activity log records changes", detail: "Task, role, billing, customer, and job changes appear for permitted users." }
];

const betaReadinessStatuses = {
  open: "Open",
  passed: "Passed",
  needs_work: "Needs work"
};

const productionReadinessChecklist = [
  { key: "production-url", label: "Production URL configured", detail: "Hosted HTTPS URL is live and not running from localhost or file mode." },
  { key: "environment-label", label: "Environment label declared", detail: "Backline config clearly identifies dev, beta, or production." },
  { key: "supabase-connected", label: "Supabase project connected", detail: "Hosted app uses the intended Supabase project URL and publishable key." },
  { key: "workspace-isolation", label: "Workspace isolation verified", detail: "New shops only see their own jobs, customers, roles, settings, files, and activity." },
  { key: "email-domain", label: "Email domain verified", detail: "Invite sender is on a verified domain, not Resend test-only delivery." },
  { key: "invite-function", label: "Invite email function works", detail: "Edge function sends real invites and shows Backline toast feedback on errors." },
  { key: "phone-sms-mode", label: "Phone/SMS beta mode declared", detail: "Missed-call recovery is clearly live SMS, portal-only replies, or manual logged messaging for beta testers." },
  { key: "hosted-link-safety", label: "Hosted link safety verified", detail: "Approval, portal, file, and receipt links never use localhost, 127.0.0.1, or file mode in production." },
  { key: "customer-portal-hosted", label: "Customer portal works on hosted URL", detail: "Portal link opens publicly, receives replies, and hides internal-only events." },
  { key: "approval-hosted", label: "Approval link works on hosted URL", detail: "Customer can sign once, approve or decline, and Backline receives the result." },
  { key: "file-view-hosted", label: "Hosted file viewing works", detail: "Customer-visible PDFs and images open from Backline and the portal." },
  { key: "real-phone-mobile", label: "Real phone mobile pass", detail: "Owner, technician, and customer portal flows fit and scroll on an actual phone." },
  { key: "backup-export", label: "Backup/export path confirmed", detail: "Owner can export data and Foundry can see secure database activity." },
  { key: "legal-support", label: "Legal and support info configured", detail: "Shop support contact, receipt wording, customer-facing footer, and privacy/terms plan are ready." }
];

const productionReadinessStatuses = {
  open: "Open",
  ready: "Ready",
  needs_work: "Needs work"
};

const supabaseProductionSetupChecklist = [
  { key: "production-project", label: "Production project created", detail: "Fresh Supabase project exists and is separate from local/dev testing." },
  { key: "schema-installed", label: "Schema installed through 19", detail: "Run supabase-schema.sql or split files through supabase-schema-19-platform-admins.sql." },
  { key: "team-schema-fallback", label: "Team schema fallback noted", detail: "Use 07a/07b/07c instead of 07 if Supabase shows a line 0 paste error." },
  { key: "foundry-bootstrap", label: "Foundry operator added", detail: "Trusted Backline operator account inserted into platform_admins after auth account exists." },
  { key: "auth-urls", label: "Auth URLs configured", detail: "Site URL and redirect URLs point to the hosted HTTPS Backline URL." },
  { key: "storage-check", label: "Storage checked", detail: "job-files bucket and organization-scoped file access work from hosted Backline." },
  { key: "invite-function", label: "Invite function deployed", detail: "send-team-invite Edge Function is deployed to the production Supabase project." },
  { key: "resend-secrets", label: "Resend secrets set", detail: "RESEND_API_KEY, INVITE_FROM_EMAIL, and optional INVITE_REPLY_TO_EMAIL are configured." },
  { key: "github-pages-config", label: "GitHub Pages config set", detail: "BACKLINE_SUPABASE_URL variable and BACKLINE_SUPABASE_ANON_KEY secret are set." },
  { key: "hosted-secure-check", label: "Hosted secure check passed", detail: "Owner can sign in on hosted URL and Settings -> Test secure connection passes." }
];

const foundryBetaTestStatuses = {
  not_run: "Not run",
  passed: "Passed",
  needs_work: "Needs work"
};

const foundryPilotStatuses = {
  prospect: "Prospect",
  invited: "Invited",
  onboarding: "Onboarding",
  testing: "Testing",
  follow_up: "Follow-up",
  graduated: "Graduated",
  not_fit: "Not fit"
};

const foundryPilotOutcomes = {
  undecided: "Undecided",
  retained: "Retained",
  blocked: "Blocked",
  churned: "Churned",
  willing_to_pay: "Willing to pay",
  reference_ready: "Reference-ready"
};

const foundryBetaTestScripts = [
  {
    key: "owner",
    label: "Owner smoke test",
    persona: "Shop owner",
    goal: "Confirm a new owner can configure the shop, create work, bill, and audit activity.",
    steps: [
      "Sign in as the owner and confirm the Home, Schedule, Inbox, Money, Team, Activity, Insights, and Foundry visibility match the account.",
      "Open Workspace settings, update shop phone, service area, timezone, slogan, legal/support fields, and save. Refresh and confirm the values persist.",
      "Create a new job from New job, choose a job template, set customer contact details, schedule the appointment, and assign either a technician or To Be Determined.",
      "Send an estimate, copy/open the approval link, approve it with the matching customer name and signature, then create the invoice from the approved estimate.",
      "Record a partial payment, then a final payment. Confirm Total, Collected, Balance, Payment history, and Activity log all agree."
    ],
    expected: "Owner can run the full office workflow without seeing cross-shop data, stale settings, duplicate toasts, or broken totals."
  },
  {
    key: "dispatcher",
    label: "Dispatcher test",
    persona: "Admin or dispatcher",
    goal: "Confirm schedule and customer communication work for a non-owner operations role.",
    steps: [
      "Sign in as an admin, dispatcher, or custom role with Schedule, Inbox + job detail, Customer updates, and Customer portal links.",
      "Open Schedule and reschedule a job. Confirm the appointment window updates in the job header, customer timeline, and Activity log.",
      "Assign or change the technician on a job. Confirm the technician sees the updated assignment and the old assignee no longer receives the job if permissions require it.",
      "Send a customer portal update and add an internal note. Confirm only customer-visible updates appear in the customer portal.",
      "Search for a customer by first name, last name, phone, and address. Confirm selecting a result opens that customer without changing unrelated page data."
    ],
    expected: "Dispatcher can move work through the schedule and communication flow without owner-only controls or permission leaks."
  },
  {
    key: "technician",
    label: "Technician field test",
    persona: "Technician",
    goal: "Confirm a tech can work assigned jobs on desktop and phone without back-office clutter.",
    steps: [
      "Sign in as a technician and confirm only assigned jobs and permitted tabs are visible.",
      "Open an assigned job from Schedule or Inbox, start the job, and confirm the action buttons fit cleanly on mobile.",
      "Complete and reopen at least one task. Confirm the task state persists after refresh and appears in the owner Activity log.",
      "Log a part or piece of equipment, edit it, remove it, and confirm other permitted accounts can see the changes.",
      "Upload a photo/file, mark customer signature or proof steps as complete, then mark Job completed."
    ],
    expected: "Technician can complete field work without owner/admin tabs, hidden dropdown issues, input resets, or mobile overflow."
  },
  {
    key: "customer-portal",
    label: "Customer portal test",
    persona: "Customer",
    goal: "Confirm the customer-facing link is clean, secure, and only shows customer-safe content.",
    steps: [
      "Copy a customer portal link from Backline and open it in a separate browser session or private window.",
      "Confirm the portal shows key updates, customer-visible files, receipts, shop support details, and policy links only.",
      "Send a customer reply from the portal and confirm it appears in Backline with the correct customer and job context.",
      "Open an approval link, approve once with the exact customer name and signature, then refresh and confirm it cannot be approved again.",
      "Repeat with a decline path and enter a decline reason. Confirm Backline records the decision."
    ],
    expected: "Customer can reply, view safe records, and submit one final approval or decline without seeing internal notes."
  },
  {
    key: "mobile",
    label: "Mobile fit test",
    persona: "Phone user",
    goal: "Confirm Backline is usable on a real phone before public beta.",
    steps: [
      "Open Backline on a phone or narrow viewport and sign in as owner, technician, and customer portal across separate checks.",
      "Check Home search, Settings menu, New job, and toast placement for overlap or bleed-through while scrolling.",
      "Open Inbox and job detail. Confirm the inbox and selected job scroll correctly and no buttons hang off the screen.",
      "Type a customer message, wait a few seconds, then send it. Confirm the input does not clear or jump to the top of the thread.",
      "Open expandable sections such as tasks, equipment, files, activity, settings, roles, and inventory. Confirm each stays open while editing."
    ],
    expected: "Core mobile flows fit within the phone screen, scroll naturally, and do not reuse desktop-only layout assumptions."
  }
];

const deploymentEnvironmentLabels = {
  local: "Local",
  beta: "Beta",
  production: "Production",
  custom: "Custom",
  undeclared: "Undeclared"
};

const FOUNDRY_SNAPSHOT_LIMIT = 12;

const defaultCompanySettings = {
  companyName: "Backline",
  companySlogan: "",
  legalName: "",
  phone: "",
  email: "",
  supportPhone: "",
  supportEmail: "",
  address: "",
  serviceArea: "",
  timeZone: "America/New_York",
  invoiceTerms: "Payment is due upon receipt unless otherwise agreed in writing.",
  defaultTaxRate: 0,
  defaultDepositPercent: 25,
  defaultLaborCostRate: 85,
  targetMarginPercent: 45,
  estimateExpirationDays: 14,
  estimateIntroText: "Thank you for the opportunity to earn your business. Please review the recommended work below.",
  estimateWarrantyText: "Warranty coverage follows the manufacturer's terms plus any written labor warranty provided by the shop.",
  estimateDisclaimer: "Final pricing may change if hidden conditions, code requirements, or customer-requested scope changes are discovered.",
  defaultDepositWording: "Deposit may be requested before work begins.",
  approvalWording: "By approving, you authorize the described work and acknowledge the estimate total.",
  approvalDisclaimerText: "Approval is based on the scope and pricing shown here. Contact the office before approving if anything looks incorrect.",
  pdfFooter: "Keep this document with your service records. Contact the shop with any questions.",
  customerFooterText: "",
  receiptSupportLine: "",
  privacyUrl: "",
  termsUrl: "",
  servicePolicyText: "",
  reviewLink: "",
  templateSettings: {},
  betaReadiness: {},
  productionReadiness: {},
  supabaseProductionSetup: {},
  foundryTestResults: {},
  foundrySnapshots: [],
  roleOverrides: {},
  customRoles: [],
  settingsUpdatedAt: ""
};

const estimatePackageOptions = ["Good", "Better", "Best", "Custom"];

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

const rolePermissionGroups = [
  {
    title: "Can open",
    description: "Tabs and pages this role can see.",
    keys: ["view-dashboard", "view-schedule", "view-inbox", "view-money", "view-followups", "view-communications", "view-jobsdb", "view-customers", "view-team", "view-activity", "view-insights"]
  },
  {
    title: "Can do on jobs",
    description: "Job actions. Backline includes the required page access automatically.",
    keys: ["createJob", "book", "start", "complete", "estimate", "approval", "change", "portal", "portal-update", "payment-request", "invoice", "paid", "parts", "uploadFiles", "task", "task-toggle", "check-diagnosis", "check-photos", "check-signature", "reopen", "close", "delete"]
  },
  {
    title: "Customer and admin",
    description: "Customer records, team controls, settings, and export utilities.",
    keys: ["customer-profile", "manageTeam", "exportData"]
  }
];

const customRoleTemplates = {
  "office-manager": {
    label: "Office manager",
    template: "dispatcher",
    summary: "Runs scheduling, customer updates, payments, files, and daily office follow-up.",
    permissionKeys: [
      "view-dashboard",
      "view-schedule",
      "view-inbox",
      "view-money",
      "view-followups",
      "view-communications",
      "view-jobsdb",
      "view-customers",
      "createJob",
      "book",
      "portal",
      "portal-update",
      "payment-request",
      "invoice",
      "paid",
      "customer-profile",
      "uploadFiles",
      "task",
      "task-toggle"
    ]
  },
  "lead-tech": {
    label: "Lead tech",
    template: "tech",
    summary: "Handles assigned field work, job documentation, parts, estimates, and closeout.",
    permissionKeys: [
      "view-schedule",
      "view-inbox",
      "view-jobsdb",
      "start",
      "complete",
      "estimate",
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
  },
  "sales-estimator": {
    label: "Sales / estimator",
    template: "dispatcher",
    summary: "Views customers and jobs, sends estimates, approval links, and customer follow-up.",
    permissionKeys: [
      "view-dashboard",
      "view-schedule",
      "view-inbox",
      "view-followups",
      "view-communications",
      "view-customers",
      "estimate",
      "approval",
      "change",
      "portal",
      "portal-update",
      "customer-profile",
      "task",
      "task-toggle"
    ]
  },
  bookkeeper: {
    label: "Bookkeeper",
    template: "dispatcher",
    summary: "Manages invoices, payments, pricebook, inventory, money, and workspace exports.",
    permissionKeys: [
      "view-dashboard",
      "view-money",
      "view-jobsdb",
      "view-customers",
      "invoice",
      "paid",
      "payment-request",
      "customer-profile",
      "exportData"
    ]
  }
};

let state = {
  jobs: loadJobs(),
  deletedJobs: loadDeletedJobs(),
  activityEvents: loadActivityEvents(),
  customers: [],
  teamMembers: [],
  teamInvites: [],
  teamNotice: "",
  pricebookItems: loadPricebookItems(),
  suppliers: loadSuppliers(),
  companySettings: loadCompanySettings(),
  automations: loadAutomations(),
  themePreference: loadThemePreference(),
  databaseReady: false,
  secureMode: false,
  currentUser: null,
  isCreator: false,
  organizationId: null,
  userRole: "owner",
  supabaseClient: null,
  lastSupabaseNetworkToastAt: 0,
  lastProductionLinkWarningAt: 0,
  selectedJobId: null,
  selectedCustomerId: null,
  customerTimelineSort: "newest",
  customerProfileNotice: null,
  activeFilter: "all",
  scheduleFilter: "week",
  jobsDatabaseFilter: "active",
  inventoryOrderFilter: "open",
  activityTypeFilter: "all",
  activityDateFilter: "all",
  selectedActivityId: "",
  portalCompanySettings: null,
  fileCategoryFilter: "all",
  fileSearch: "",
  foundryBetaFilter: "all",
  foundryProductionFilter: "all",
  foundrySetupFilter: "all",
  foundryPilotRecords: loadFoundryPilotRecords(),
  foundryPilotFilter: "active",
  foundryPilotSearch: "",
  foundrySnapshotText: "",
  editingCustomRoleSlug: null,
  rolePreviewSlug: "",
  inboxCollapsed: false,
  expandedPanels: {},
  jobActionMenuOpen: false,
  messageThreadHeight: MESSAGE_THREAD_DEFAULT_HEIGHT,
  messageThreadScrollToBottom: false,
  messageDrafts: {},
  openTechnicianPicker: "",
  openBacklinePicker: "",
  jobActionNotice: null,
  actionDraft: null,
  pendingPaymentReview: null,
  portalJob: null,
  approvalDownloadFile: null,
  openWorkspaceSettingsAfterLoad: false,
  search: ""
};

let messageThreadResize = null;
let lastRemoteRefreshAt = 0;
let secureSavePromise = null;

const elements = {
  authGate: document.querySelector("#authGate"),
  toastRegion: document.querySelector("#toastRegion"),
  authForm: document.querySelector("#authForm"),
  authGateStatus: document.querySelector("#authGateStatus"),
  authStatus: document.querySelector("#authStatus"),
  signOutButton: document.querySelector("#signOutButton"),
  newJobButton: document.querySelector("#newJobButton"),
  statsStrip: document.querySelector("#statsStrip"),
  approvalPage: document.querySelector("#approvalPage"),
  attentionSummary: document.querySelector("#attentionSummary"),
  attentionList: document.querySelector("#attentionList"),
  betaReadinessSummary: document.querySelector("#betaReadinessSummary"),
  betaReadinessPanel: document.querySelector("#betaReadinessPanel"),
  todayPanel: document.querySelector("#todayPanel"),
  moneyPanel: document.querySelector("#moneyPanel"),
  followupPanel: document.querySelector("#followupPanel"),
  workGrid: document.querySelector("#workGrid"),
  collapseInboxButton: document.querySelector("#collapseInboxButton"),
  techWorkPanel: document.querySelector("#techWorkPanel"),
  jobList: document.querySelector("#jobList"),
  jobDetail: document.querySelector("#jobDetail"),
  timeline: document.querySelector("#timeline"),
  automationList: document.querySelector("#automationList"),
  metricsGrid: document.querySelector("#metricsGrid"),
  profitWatch: document.querySelector("#profitWatch"),
  pipelineTable: document.querySelector("#pipelineTable"),
  creatorDiagnostics: document.querySelector("#creatorDiagnostics"),
  moneyList: document.querySelector("#moneyList"),
  receivablesList: document.querySelector("#receivablesList"),
  paymentReviewList: document.querySelector("#paymentReviewList"),
  pricebookForm: document.querySelector("#pricebookForm"),
  pricebookList: document.querySelector("#pricebookList"),
  pricebookCategoryPicker: document.querySelector("#pricebookCategoryPicker"),
  pricebookUnitPicker: document.querySelector("#pricebookUnitPicker"),
  pricebookEditModal: document.querySelector("#pricebookEditModal"),
  pricebookEditForm: document.querySelector("#pricebookEditForm"),
  pricebookEditCategoryPicker: document.querySelector("#pricebookEditCategoryPicker"),
  pricebookEditUnitPicker: document.querySelector("#pricebookEditUnitPicker"),
  inventorySummary: document.querySelector("#inventorySummary"),
  inventoryOrdersList: document.querySelector("#inventoryOrdersList"),
  inventorySupplierList: document.querySelector("#inventorySupplierList"),
  inventoryList: document.querySelector("#inventoryList"),
  inventoryReorderList: document.querySelector("#inventoryReorderList"),
  inventoryUsageModal: document.querySelector("#inventoryUsageModal"),
  inventoryUsageContent: document.querySelector("#inventoryUsageContent"),
  inventoryOrderDetailModal: document.querySelector("#inventoryOrderDetailModal"),
  inventoryOrderDetailContent: document.querySelector("#inventoryOrderDetailContent"),
  inventoryOrderModal: document.querySelector("#inventoryOrderModal"),
  inventoryOrderForm: document.querySelector("#inventoryOrderForm"),
  inventoryOrderTitle: document.querySelector("#inventoryOrderTitle"),
  inventoryOrderSubtitle: document.querySelector("#inventoryOrderSubtitle"),
  inventoryOrderSubmit: document.querySelector("#inventoryOrderSubmit"),
  inventoryOrderLines: document.querySelector("#inventoryOrderLines"),
  supplierModal: document.querySelector("#supplierModal"),
  supplierForm: document.querySelector("#supplierForm"),
  supplierFormStatus: document.querySelector("#supplierFormStatus"),
  supplierModalTitle: document.querySelector("#supplierModalTitle"),
  supplierPreferredContactPicker: document.querySelector("#supplierPreferredContactPicker"),
  reorderCopyModal: document.querySelector("#reorderCopyModal"),
  reorderCopyText: document.querySelector("#reorderCopyText"),
  companyTimezonePicker: document.querySelector("#companyTimezonePicker"),
  followupList: document.querySelector("#followupList"),
  communicationSummary: document.querySelector("#communicationSummary"),
  communicationList: document.querySelector("#communicationList"),
  jobsDatabaseSummary: document.querySelector("#jobsDatabaseSummary"),
  jobsDatabaseList: document.querySelector("#jobsDatabaseList"),
  deletedJobsList: document.querySelector("#deletedJobsList"),
  activitySummary: document.querySelector("#activitySummary"),
  activityList: document.querySelector("#activityList"),
  activityTypeFilter: document.querySelector("#activityTypeFilter"),
  activityDateFilter: document.querySelector("#activityDateFilter"),
  permissionAuditPanel: document.querySelector("#permissionAuditPanel"),
  activityDetailModal: document.querySelector("#activityDetailModal"),
  activityDetailContent: document.querySelector("#activityDetailContent"),
  customerList: document.querySelector("#customerList"),
  customerProfile: document.querySelector("#customerProfile"),
  customerSearchResults: document.querySelector("#customerSearchResults"),
  teamList: document.querySelector("#teamList"),
  teamHeaderSubtitle: document.querySelector("#teamHeaderSubtitle"),
  teamAccessSummary: document.querySelector("#teamAccessSummary"),
  teamInviteForm: document.querySelector("#teamInviteForm"),
  teamInviteStatus: document.querySelector("#teamInviteStatus"),
  teamInviteRolePicker: document.querySelector("#teamInviteRolePicker"),
  rolePreviewSelect: document.querySelector("#rolePreviewSelect"),
  rolePreviewPanel: document.querySelector("#rolePreviewPanel"),
  createCustomRoleButton: document.querySelector("#createCustomRoleButton"),
  customRoleModal: document.querySelector("#customRoleModal"),
  customRoleForm: document.querySelector("#customRoleForm"),
  customRolePermissions: document.querySelector("#customRolePermissions"),
  customRolePermissionSummary: document.querySelector("#customRolePermissionSummary"),
  customRoleStatus: document.querySelector("#customRoleStatus"),
  customRoleFormTitle: document.querySelector("#customRoleFormTitle"),
  customRoleFormSubtitle: document.querySelector("#customRoleFormSubtitle"),
  customRolePreview: document.querySelector("#customRolePreview"),
  customRoleTemplatePicker: document.querySelector("#customRoleTemplatePicker"),
  customRoleSubmit: document.querySelector("#customRoleSubmit"),
  cancelCustomRoleEdit: document.querySelector("#cancelCustomRoleEdit"),
  roleGuide: document.querySelector("#roleGuide"),
  technicianOptions: document.querySelector("#technicianOptions"),
  searchInput: document.querySelector("#searchInput"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsMenu: document.querySelector("#settingsMenu"),
  workspaceSettingsButton: document.querySelector("#workspaceSettingsButton"),
  themeSelect: document.querySelector("#themePicker"),
  printScheduleRange: document.querySelector("#printScheduleRange"),
  printSchedule: document.querySelector("#printSchedule"),
  companySettingsModal: document.querySelector("#companySettingsModal"),
  companySettingsForm: document.querySelector("#companySettingsForm"),
  workspaceSetupProgress: document.querySelector("#workspaceSetupProgress"),
  templateSettingsList: document.querySelector("#templateSettingsList"),
  jobModal: document.querySelector("#jobModal"),
  jobForm: document.querySelector("#jobForm"),
  jobTradePicker: document.querySelector("#jobTradePicker"),
  jobTypePicker: document.querySelector("#jobTypePicker"),
  jobTemplatePicker: document.querySelector("#jobTemplatePicker"),
  jobUrgencyPicker: document.querySelector("#jobUrgencyPicker"),
  jobDurationPicker: document.querySelector("#jobDurationPicker"),
  actionModal: document.querySelector("#actionModal"),
  actionForm: document.querySelector("#actionForm"),
  actionModalEyebrow: document.querySelector("#actionModalEyebrow"),
  actionModalTitle: document.querySelector("#actionModalTitle"),
  actionModalSubtitle: document.querySelector("#actionModalSubtitle"),
  actionModalFields: document.querySelector("#actionModalFields"),
  actionModalSubmit: document.querySelector("#actionModalSubmit"),
  deleteModal: document.querySelector("#deleteModal"),
  deleteForm: document.querySelector("#deleteForm"),
  deleteModalSummary: document.querySelector("#deleteModalSummary"),
  teamRemoveModal: document.querySelector("#teamRemoveModal"),
  teamRemoveForm: document.querySelector("#teamRemoveForm"),
  teamRemoveModalSummary: document.querySelector("#teamRemoveModalSummary"),
  importConfirmModal: document.querySelector("#importConfirmModal"),
  importConfirmForm: document.querySelector("#importConfirmForm"),
  importConfirmSummary: document.querySelector("#importConfirmSummary"),
  todayLabel: document.querySelector("#todayLabel"),
  topbarGreeting: document.querySelector("#topbarGreeting"),
  topbarInsight: document.querySelector("#topbarInsight"),
  storageStatus: document.querySelector("#storageStatus")
};

elements.todayLabel.textContent = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric"
}).format(new Date());

applyTheme(state.themePreference);
renderSettingsPickers();

if (!state.selectedJobId && state.jobs.length > 0) {
  state.selectedJobId = state.jobs[0].id;
}

function loadJobs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function loadDeletedJobs() {
  try {
    return JSON.parse(localStorage.getItem(DELETED_JOBS_KEY)) || [];
  } catch {
    return [];
  }
}

function loadActivityEvents() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || [];
  } catch {
    return [];
  }
}

function loadAutomations() {
  try {
    return { ...defaultAutomations, ...JSON.parse(localStorage.getItem(AUTOMATION_KEY)) };
  } catch {
    return { ...defaultAutomations };
  }
}

function showToast(title, message = "", type = "info", options = {}) {
  if (!elements.toastRegion) return;
  if (options.id) {
    elements.toastRegion.querySelector(`[data-toast-id="${CSS.escape(options.id)}"]`)?.remove();
  }
  const toast = document.createElement("div");
  toast.className = `toast ${["success", "warning", "danger", "info"].includes(type) ? type : ""}`.trim();
  toast.setAttribute("role", type === "danger" ? "alert" : "status");
  if (options.id) {
    toast.dataset.toastId = options.id;
  }
  const heading = document.createElement("strong");
  heading.textContent = title;
  toast.append(heading);
  if (message) {
    const detail = document.createElement("span");
    detail.textContent = message;
    toast.append(detail);
  }
  if (options.dismissible || options.persistent) {
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "toast-close";
    closeButton.setAttribute("aria-label", "Dismiss notification");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => toast.remove());
    toast.append(closeButton);
  }
  elements.toastRegion.append(toast);
  const timeout = Number(options.timeout || 4200);
  if (timeout > 0) {
    window.setTimeout(() => toast.remove(), timeout);
  }
  return toast;
}

function dismissToast(id) {
  if (!id || !elements.toastRegion) return;
  elements.toastRegion.querySelector(`[data-toast-id="${CSS.escape(id)}"]`)?.remove();
}

function loadPricebookItems() {
  try {
    const items = JSON.parse(localStorage.getItem(PRICEBOOK_KEY)) || [];
    return items.map(normalizePricebookItem);
  } catch {
    return [];
  }
}

function loadSuppliers() {
  try {
    const suppliers = JSON.parse(localStorage.getItem(SUPPLIER_KEY)) || [];
    return suppliers.map(normalizeSupplierRecord);
  } catch {
    return [];
  }
}

function loadCompanySettings() {
  try {
    return normalizeCompanySettings(JSON.parse(localStorage.getItem(COMPANY_SETTINGS_KEY)) || {});
  } catch {
    return normalizeCompanySettings({});
  }
}

function normalizeFoundryPilotRecord(record = {}) {
  const shopName = String(record.shopName || record.name || "").trim();
  if (!shopName) return null;
  const status = foundryPilotStatuses[record.status] ? record.status : "prospect";
  const outcome = foundryPilotOutcomes[record.outcome] ? record.outcome : "undecided";
  const score = Math.min(100, Math.max(0, Math.round(Number(record.fitScore ?? record.score) || 0)));
  return {
    id: String(record.id || createId()),
    shopName,
    trade: String(record.trade || "").trim(),
    teamSize: Math.max(0, Math.round(Number(record.teamSize) || 0)),
    contactName: String(record.contactName || "").trim(),
    contactEmail: String(record.contactEmail || "").trim(),
    contactPhone: formatPhoneNumber(record.contactPhone || ""),
    source: String(record.source || "").trim(),
    status,
    outcome,
    fitScore: score,
    nextFollowUp: String(record.nextFollowUp || "").trim(),
    lastContactedAt: String(record.lastContactedAt || "").trim(),
    notes: String(record.notes || "").trim(),
    createdAt: String(record.createdAt || new Date().toISOString()).trim(),
    updatedAt: String(record.updatedAt || record.createdAt || new Date().toISOString()).trim(),
    updatedBy: String(record.updatedBy || "").trim()
  };
}

function normalizeFoundryPilotRecords(records = []) {
  return (Array.isArray(records) ? records : [])
    .map(normalizeFoundryPilotRecord)
    .filter(Boolean)
    .sort((a, b) => {
      const aDue = a.nextFollowUp ? new Date(a.nextFollowUp).getTime() : Infinity;
      const bDue = b.nextFollowUp ? new Date(b.nextFollowUp).getTime() : Infinity;
      if (aDue !== bDue) return aDue - bDue;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
}

function loadFoundryPilotRecords() {
  try {
    return normalizeFoundryPilotRecords(JSON.parse(localStorage.getItem(FOUNDRY_PILOT_CRM_KEY)) || []);
  } catch {
    return [];
  }
}

function saveFoundryPilotRecords() {
  try {
    state.foundryPilotRecords = normalizeFoundryPilotRecords(state.foundryPilotRecords);
    localStorage.setItem(FOUNDRY_PILOT_CRM_KEY, JSON.stringify(state.foundryPilotRecords));
  } catch {
    showToast("Pilot CRM not saved", "Browser storage blocked the Foundry pilot records.", "warning", {
      id: "foundry-pilot-save",
      timeout: 4200
    });
  }
}

function secureCompanySettingsKey(orgId = state.organizationId) {
  return orgId ? `${SECURE_COMPANY_SETTINGS_KEY_PREFIX}.${orgId}` : "";
}

function loadSecureCompanySettingsBackup(orgId = state.organizationId) {
  const key = secureCompanySettingsKey(orgId);
  if (!key) return null;
  try {
    const record = JSON.parse(localStorage.getItem(key) || "null");
    if (record?.organizationId && record.organizationId !== orgId) return null;
    return record ? {
      companySettings: normalizeCompanySettings(record.companySettings || record),
      suppliers: Array.isArray(record.suppliers) ? record.suppliers.map(normalizeSupplierRecord) : [],
      pricebookItems: Array.isArray(record.pricebookItems) ? record.pricebookItems.map(normalizePricebookItem) : [],
      deletedJobs: Array.isArray(record.deletedJobs) ? record.deletedJobs.map(ensureDeletedJobDefaults) : [],
      activityEvents: Array.isArray(record.activityEvents) ? record.activityEvents : []
    } : null;
  } catch {
    return null;
  }
}

function saveSecureCompanySettingsBackup(company = state.companySettings, suppliers = state.suppliers, orgId = state.organizationId) {
  const key = secureCompanySettingsKey(orgId);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify({
      organizationId: orgId,
      companySettings: normalizeCompanySettings(company),
      suppliers: suppliers.map(normalizeSupplierRecord),
      pricebookItems: state.pricebookItems.map(normalizePricebookItem),
      deletedJobs: state.deletedJobs.map(ensureDeletedJobDefaults),
      activityEvents: state.activityEvents,
      savedAt: new Date().toISOString()
    }));
  } catch {
    // A remote save can still succeed even if the browser blocks local fallback storage.
  }
}

function loadThemePreference() {
  try {
    const preference = localStorage.getItem(THEME_KEY);
    return ["light", "dark"].includes(preference) ? preference : "light";
  } catch {
    return "light";
  }
}

function roleSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
}

function cloneRolePermissionSet(permissionSet = {}) {
  return {
    views: [...(permissionSet.views || [])],
    actions: [...(permissionSet.actions || [])],
    createJob: Boolean(permissionSet.createJob),
    uploadFiles: Boolean(permissionSet.uploadFiles),
    exportData: Boolean(permissionSet.exportData),
    manageTeam: Boolean(permissionSet.manageTeam)
  };
}

function permissionCatalogByKey() {
  return rolePermissionCatalog.reduce((records, permission) => {
    records[permission.key] = permission;
    return records;
  }, {});
}

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

function rolePermissionDependencyDetails(keys = []) {
  const original = new Set(Array.isArray(keys) ? keys : []);
  const expanded = expandedRolePermissionKeys(keys);
  const catalog = permissionCatalogByKey();
  return [...expanded]
    .filter((key) => !original.has(key))
    .map((key) => {
      const requiredBy = [...original]
        .filter((selectedKey) => (rolePermissionDependencies[selectedKey] || []).includes(key))
        .map((selectedKey) => permissionCatalogLabel(catalog[selectedKey] || { label: selectedKey }));
      return {
        key,
        label: permissionCatalogLabel(catalog[key] || { label: key }),
        requiredBy
      };
    });
}

function permissionCatalogLabel(permission = {}) {
  if (permission.key === "view-inbox") return "Inbox + job detail";
  if (permission.key === "view-money") return "Money";
  if (permission.key === "view-customers") return "Customers";
  return permission.label || permission.key || "";
}

function rolePermissionFromKeys(keys = [], template = "tech") {
  const base = cloneRolePermissionSet(rolePermissions[template] || rolePermissions.tech);
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

function customRolePresetKey(value = "") {
  const raw = String(value || "");
  return raw.startsWith("preset:") ? raw.replace("preset:", "") : "";
}

function customRolePreset(value = "") {
  return customRoleTemplates[customRolePresetKey(value)] || null;
}

function roleTemplateBase(value = "tech") {
  const preset = customRolePreset(value);
  return preset?.template || (rolePermissions[value] ? value : "tech");
}

function customRoleTemplateKeys(value = "tech") {
  const preset = customRolePreset(value);
  if (preset) return preset.permissionKeys;
  return rolePermissionKeys(roleDefinition(value) || rolePermissions.tech);
}

function customRoleDraftFromForm(form = elements.customRoleForm) {
  if (!form) {
    return {
      label: "Custom role",
      summary: "Draft permissions",
      template: "tech",
      permissions: rolePermissions.tech
    };
  }
  const data = new FormData(form);
  const templateValue = String(data.get("template") || "tech");
  const label = String(data.get("label") || customRolePreset(templateValue)?.label || "Custom role").trim() || "Custom role";
  const summary = String(data.get("summary") || customRolePreset(templateValue)?.summary || "Draft permissions").trim();
  return {
    label,
    summary,
    template: roleTemplateBase(templateValue),
    permissions: rolePermissionFromKeys(customRoleFormKeys(), roleTemplateBase(templateValue))
  };
}

function canRoleEditPermission(roleRecord, permission) {
  if (!permission) return false;
  if (permission.key !== "manageTeam") return true;
  if (!roleRecord?.builtIn) return true;
  return roleRecord.slug === "admin";
}

function enforceBuiltInRolePermissionLimits(slug, permissions = {}) {
  const next = cloneRolePermissionSet(permissions);
  if (["dispatcher", "tech"].includes(slug)) {
    next.manageTeam = false;
  }
  return next;
}

function rolePermissionKeys(permissionSet = {}) {
  const views = new Set(permissionSet.views || []);
  const actions = new Set(permissionSet.actions || []);
  return rolePermissionCatalog
    .filter((permission) => {
      if (permission.type === "view") return views.has(permission.value);
      if (permission.type === "action") return actions.has(permission.value);
      return Boolean(permissionSet[permission.value]);
    })
    .map((permission) => permission.key);
}

function rolePermissionAuditLabel(key) {
  const catalog = permissionCatalogByKey();
  return permissionCatalogLabel(catalog[key] || { label: key });
}

function rolePermissionAuditText(permissionSet = {}) {
  const keys = rolePermissionKeys(permissionSet);
  return keys.length ? keys.map(rolePermissionAuditLabel).join(", ") : "No access";
}

function rolePermissionAuditDelta(beforePermissions = {}, afterPermissions = {}) {
  const before = new Set(rolePermissionKeys(beforePermissions));
  const after = new Set(rolePermissionKeys(afterPermissions));
  return {
    added: [...after].filter((key) => !before.has(key)).map(rolePermissionAuditLabel),
    removed: [...before].filter((key) => !after.has(key)).map(rolePermissionAuditLabel)
  };
}

function roleAuditChanges(beforeRole = null, afterRole = null) {
  const changes = [];
  const beforePermissions = beforeRole?.permissions || {};
  const afterPermissions = afterRole?.permissions || {};
  if ((beforeRole?.label || "") !== (afterRole?.label || "")) {
    changes.push({
      field: "roleLabel",
      label: "Role name",
      before: beforeRole?.label || "Not set",
      after: afterRole?.label || "Not set"
    });
  }
  if ((beforeRole?.summary || "") !== (afterRole?.summary || "")) {
    changes.push({
      field: "roleSummary",
      label: "Role summary",
      before: beforeRole?.summary || "Not set",
      after: afterRole?.summary || "Not set"
    });
  }
  const delta = rolePermissionAuditDelta(beforePermissions, afterPermissions);
  if (delta.added.length) {
    changes.push({
      field: "rolePermissionsAdded",
      label: "Permissions added",
      before: "Not included",
      after: delta.added.join(", ")
    });
  }
  if (delta.removed.length) {
    changes.push({
      field: "rolePermissionsRemoved",
      label: "Permissions removed",
      before: delta.removed.join(", "),
      after: "Removed"
    });
  }
  if (!changes.length && JSON.stringify(beforePermissions) !== JSON.stringify(afterPermissions)) {
    changes.push({
      field: "rolePermissions",
      label: "Permissions",
      before: rolePermissionAuditText(beforePermissions),
      after: rolePermissionAuditText(afterPermissions)
    });
  }
  return changes;
}

function normalizeCustomRole(role = {}, existingSlugs = new Set()) {
  const label = String(role.label || role.name || "").trim();
  if (!label) return null;
  const builtIn = new Set(Object.keys(rolePermissions));
  const baseSlug = roleSlug(role.slug || label);
  if (!baseSlug || builtIn.has(baseSlug)) return null;
  let slug = baseSlug;
  let counter = 2;
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  const template = rolePermissions[role.template] ? role.template : "tech";
  const permissions = role.permissions
    ? rolePermissionFromKeys(rolePermissionKeys(role.permissions), template)
    : rolePermissionFromKeys(role.permissionKeys || role.keys || [], template);
  existingSlugs.add(slug);
  return {
    slug,
    label,
    template,
    summary: String(role.summary || "").trim(),
    permissions
  };
}

function normalizeCustomRoles(roles = []) {
  const seen = new Set();
  return (Array.isArray(roles) ? roles : [])
    .map((role) => normalizeCustomRole(role, seen))
    .filter(Boolean);
}

function normalizeRoleOverrides(overrides = {}) {
  return ["admin", "dispatcher", "tech"].reduce((records, slug) => {
    const override = overrides?.[slug];
    if (!override) return records;
    const permissions = enforceBuiltInRolePermissionLimits(slug, override.permissions
      ? rolePermissionFromKeys(rolePermissionKeys(override.permissions), slug)
      : rolePermissionFromKeys(override.permissionKeys || override.keys || [], slug));
    records[slug] = {
      label: String(override.label || "").trim(),
      summary: String(override.summary || "").trim(),
      permissions
    };
    return records;
  }, {});
}

function normalizeBetaReadiness(readiness = {}) {
  const records = {};
  betaReadinessChecklist.forEach((item) => {
    const raw = readiness?.[item.key] || {};
    const status = betaReadinessStatuses[raw.status] ? raw.status : "open";
    records[item.key] = {
      status,
      note: String(raw.note || "").trim(),
      updatedAt: String(raw.updatedAt || "").trim(),
      updatedBy: String(raw.updatedBy || "").trim()
    };
  });
  return records;
}

function normalizeProductionReadiness(readiness = {}) {
  const records = {};
  productionReadinessChecklist.forEach((item) => {
    const raw = readiness?.[item.key] || {};
    const status = productionReadinessStatuses[raw.status] ? raw.status : "open";
    records[item.key] = {
      status,
      note: String(raw.note || "").trim(),
      updatedAt: String(raw.updatedAt || "").trim(),
      updatedBy: String(raw.updatedBy || "").trim()
    };
  });
  return records;
}

function normalizeSupabaseProductionSetup(readiness = {}) {
  const records = {};
  supabaseProductionSetupChecklist.forEach((item) => {
    const raw = readiness?.[item.key] || {};
    const status = productionReadinessStatuses[raw.status] ? raw.status : "open";
    records[item.key] = {
      status,
      note: String(raw.note || "").trim(),
      updatedAt: String(raw.updatedAt || "").trim(),
      updatedBy: String(raw.updatedBy || "").trim()
    };
  });
  return records;
}

function normalizeFoundryTestResults(results = {}) {
  const records = {};
  foundryBetaTestScripts.forEach((script) => {
    const raw = results?.[script.key] || {};
    const status = foundryBetaTestStatuses[raw.status] ? raw.status : "not_run";
    records[script.key] = {
      status,
      note: String(raw.note || "").trim(),
      updatedAt: String(raw.updatedAt || "").trim(),
      updatedBy: String(raw.updatedBy || "").trim()
    };
  });
  return records;
}

function normalizeFoundrySnapshots(snapshots = []) {
  return (Array.isArray(snapshots) ? snapshots : [])
    .map((snapshot) => {
      const counts = snapshot?.counts || {};
      return {
        id: String(snapshot?.id || createId()),
        createdAt: String(snapshot?.createdAt || "").trim(),
        createdBy: String(snapshot?.createdBy || "").trim() || "Backline",
        workspaceId: String(snapshot?.workspaceId || "").trim(),
        appVersion: String(snapshot?.appVersion || "").trim(),
        environment: String(snapshot?.environment || "").trim(),
        progress: Math.min(100, Math.max(0, Math.round(Number(snapshot?.progress) || 0))),
        counts: {
          passed: Math.max(0, Math.round(Number(counts.passed) || 0)),
          needs_work: Math.max(0, Math.round(Number(counts.needs_work) || 0)),
          open: Math.max(0, Math.round(Number(counts.open) || 0))
        },
        testProgress: Math.min(100, Math.max(0, Math.round(Number(snapshot?.testProgress) || 0))),
        testCounts: {
          passed: Math.max(0, Math.round(Number(snapshot?.testCounts?.passed) || 0)),
          needs_work: Math.max(0, Math.round(Number(snapshot?.testCounts?.needs_work) || 0)),
          not_run: Math.max(0, Math.round(Number(snapshot?.testCounts?.not_run) || 0))
        },
        stats: {
          jobs: Math.max(0, Math.round(Number(snapshot?.stats?.jobs) || 0)),
          customers: Math.max(0, Math.round(Number(snapshot?.stats?.customers) || 0)),
          team: Math.max(0, Math.round(Number(snapshot?.stats?.team) || 0)),
          openBalance: Math.max(0, Number(snapshot?.stats?.openBalance) || 0)
        },
        needsWorkLabels: Array.isArray(snapshot?.needsWorkLabels)
          ? snapshot.needsWorkLabels.map((label) => String(label || "").trim()).filter(Boolean).slice(0, betaReadinessChecklist.length)
          : [],
        openLabels: Array.isArray(snapshot?.openLabels)
          ? snapshot.openLabels.map((label) => String(label || "").trim()).filter(Boolean).slice(0, betaReadinessChecklist.length)
          : [],
        testNeedsWorkLabels: Array.isArray(snapshot?.testNeedsWorkLabels)
          ? snapshot.testNeedsWorkLabels.map((label) => String(label || "").trim()).filter(Boolean).slice(0, foundryBetaTestScripts.length)
          : [],
        testNotRunLabels: Array.isArray(snapshot?.testNotRunLabels)
          ? snapshot.testNotRunLabels.map((label) => String(label || "").trim()).filter(Boolean).slice(0, foundryBetaTestScripts.length)
          : [],
        snapshotText: String(snapshot?.snapshotText || "")
      };
    })
    .filter((snapshot) => snapshot.createdAt)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, FOUNDRY_SNAPSHOT_LIMIT);
}

function normalizeCompanySettings(settings = {}) {
  return {
    ...defaultCompanySettings,
    ...settings,
    companyName: String(settings.companyName || settings.name || defaultCompanySettings.companyName).trim() || defaultCompanySettings.companyName,
    companySlogan: String(settings.companySlogan || settings.tagline || "").trim(),
    legalName: String(settings.legalName || "").trim(),
    phone: formatPhoneNumber(settings.phone),
    email: String(settings.email || "").trim(),
    supportPhone: formatPhoneNumber(settings.supportPhone || settings.customerSupportPhone || ""),
    supportEmail: String(settings.supportEmail || settings.customerSupportEmail || "").trim(),
    address: String(settings.address || "").trim(),
    serviceArea: String(settings.serviceArea || "").trim(),
    timeZone: String(settings.timeZone || defaultCompanySettings.timeZone).trim() || defaultCompanySettings.timeZone,
    invoiceTerms: String(settings.invoiceTerms || defaultCompanySettings.invoiceTerms).trim(),
    defaultTaxRate: Math.max(0, Number(settings.defaultTaxRate) || 0),
    defaultDepositPercent: Math.min(100, Math.max(0, Number(settings.defaultDepositPercent ?? defaultCompanySettings.defaultDepositPercent) || 0)),
    defaultLaborCostRate: Math.max(0, Number(settings.defaultLaborCostRate ?? defaultCompanySettings.defaultLaborCostRate) || 0),
    targetMarginPercent: Math.min(100, Math.max(0, Number(settings.targetMarginPercent ?? defaultCompanySettings.targetMarginPercent) || 0)),
    estimateExpirationDays: Math.max(1, Math.round(Number(settings.estimateExpirationDays) || defaultCompanySettings.estimateExpirationDays)),
    estimateIntroText: String(settings.estimateIntroText || defaultCompanySettings.estimateIntroText).trim(),
    estimateWarrantyText: String(settings.estimateWarrantyText || defaultCompanySettings.estimateWarrantyText).trim(),
    estimateDisclaimer: String(settings.estimateDisclaimer || defaultCompanySettings.estimateDisclaimer).trim(),
    defaultDepositWording: String(settings.defaultDepositWording || defaultCompanySettings.defaultDepositWording).trim(),
    approvalWording: String(settings.approvalWording || defaultCompanySettings.approvalWording).trim(),
    approvalDisclaimerText: String(settings.approvalDisclaimerText || defaultCompanySettings.approvalDisclaimerText).trim(),
    pdfFooter: String(settings.pdfFooter || defaultCompanySettings.pdfFooter).trim(),
    customerFooterText: String(settings.customerFooterText || "").trim(),
    receiptSupportLine: String(settings.receiptSupportLine || "").trim(),
    privacyUrl: String(settings.privacyUrl || "").trim(),
    termsUrl: String(settings.termsUrl || "").trim(),
    servicePolicyText: String(settings.servicePolicyText || "").trim(),
    reviewLink: String(settings.reviewLink || "").trim(),
    templateSettings: normalizeWorkspaceTemplateSettings(settings.templateSettings || {}),
    betaReadiness: normalizeBetaReadiness(settings.betaReadiness || {}),
    productionReadiness: normalizeProductionReadiness(settings.productionReadiness || {}),
    supabaseProductionSetup: normalizeSupabaseProductionSetup(settings.supabaseProductionSetup || {}),
    foundryTestResults: normalizeFoundryTestResults(settings.foundryTestResults || {}),
    foundrySnapshots: normalizeFoundrySnapshots(settings.foundrySnapshots || []),
    roleOverrides: normalizeRoleOverrides(settings.roleOverrides || {}),
    customRoles: normalizeCustomRoles(settings.customRoles || settings.roles || []),
    settingsUpdatedAt: String(settings.settingsUpdatedAt || "").trim()
  };
}

function companySettings() {
  state.companySettings = normalizeCompanySettings(state.companySettings);
  return state.companySettings;
}

function customerFacingShopLine(company = companySettings()) {
  return String(company.companySlogan || company.serviceArea || "Service updates, documents, and messages").trim();
}

function customerFacingCompanySettings(settings = null) {
  return normalizeCompanySettings(settings || companySettings());
}

function customerFacingLegalName(company = companySettings()) {
  return String(company.legalName || company.companyName || "the shop").trim();
}

function customerFacingContactLine(company = companySettings()) {
  return [company.supportPhone || company.phone, company.supportEmail || company.email].filter(Boolean).join(" / ") || "Contact the office directly";
}

function customerFacingSupportLine(company = companySettings()) {
  const contact = customerFacingContactLine(company);
  return contact === "Contact the office directly"
    ? `Contact ${company.companyName || "the office"} directly for support.`
    : `For support, contact ${company.companyName || "the office"} at ${contact}.`;
}

function customerFacingPolicyLinks(company = companySettings()) {
  return [
    company.privacyUrl ? { label: "Privacy", url: company.privacyUrl } : null,
    company.termsUrl ? { label: "Terms", url: company.termsUrl } : null
  ].filter(Boolean);
}

function shopInitials(name = companySettings().companyName) {
  const initials = String(name || "Backline")
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return initials || "B";
}

function customerFacingBrandMarkup(context = "Customer portal", settings = null) {
  const company = customerFacingCompanySettings(settings);
  return `
    <div class="customer-facing-brand">
      <div class="customer-facing-mark" aria-hidden="true">${escapeHtml(shopInitials(company.companyName))}</div>
      <div>
        <strong>${escapeHtml(company.companyName || "Backline")}</strong>
        <span>${escapeHtml(customerFacingShopLine(company))}</span>
        <small>${escapeHtml(customerFacingContactLine(company))}</small>
      </div>
      <em>${escapeHtml(context)}</em>
    </div>
  `;
}

function customerFacingSupportMarkup(company = companySettings()) {
  const links = customerFacingPolicyLinks(company);
  const policyText = String(company.servicePolicyText || "").trim();
  return `
    <div class="customer-facing-support">
      <strong>${escapeHtml(customerFacingLegalName(company))}</strong>
      <p>${escapeHtml(company.customerFooterText || customerFacingSupportLine(company))}</p>
      ${policyText ? `<p>${escapeHtml(policyText)}</p>` : ""}
      ${links.length ? `
        <div class="customer-facing-links">
          ${links.map((link) => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function customerDocumentFooter(company = companySettings()) {
  const footer = String(company.customerFooterText || company.pdfFooter || "").trim();
  const legacyFooter = "Generated by Backline. Keep this document with the customer job record.";
  if (footer && footer !== legacyFooter) return footer;
  return `Keep this document with your service records. ${customerFacingSupportLine(company)}`;
}

function companySettingsRevision(settings = {}) {
  const timestamp = new Date(settings.settingsUpdatedAt || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function markCompanySettingsChanged(settings = state.companySettings) {
  return normalizeCompanySettings({
    ...settings,
    settingsUpdatedAt: new Date().toISOString()
  });
}

function newestCompanySettings(...settingsRecords) {
  const normalized = settingsRecords
    .filter(Boolean)
    .map((settings) => normalizeCompanySettings(settings));
  if (!normalized.length) return normalizeCompanySettings({});
  return normalized.reduce((newest, settings) => (
    companySettingsRevision(settings) > companySettingsRevision(newest) ? settings : newest
  ), normalized[0]);
}

function newerCompanySettings(remoteSettings = {}, backupSettings = null, currentSettings = null) {
  return newestCompanySettings(remoteSettings, backupSettings, currentSettings);
}

function estimateExpiresAt(days = companySettings().estimateExpirationDays) {
  const expires = new Date();
  expires.setDate(expires.getDate() + Math.max(1, Math.round(Number(days) || defaultCompanySettings.estimateExpirationDays)));
  return dateToISO(expires);
}

function estimateDepositAmount(amount, percent = companySettings().defaultDepositPercent) {
  return Math.max(0, Math.round(normalizeValue(amount) * (Math.max(0, Number(percent) || 0) / 100)));
}

function normalizeEstimateRecord(record = {}, job = {}) {
  const company = companySettings();
  const amount = normalizeValue(record.amount ?? job.value);
  const expirationDays = Math.max(1, Math.round(Number(record.expirationDays) || company.estimateExpirationDays));
  const requestedDeposit = normalizeValue(record.depositRequested);
  const requestedPercent = Number(record.depositPercent);
  const depositRequested = amount > 0
    ? Math.min(requestedDeposit || estimateDepositAmount(amount, Number.isFinite(requestedPercent) ? requestedPercent : company.defaultDepositPercent), amount)
    : 0;
  const depositPercent = amount > 0
    ? Math.min(100, Math.max(0, Math.round((depositRequested / amount) * 100)))
    : Math.min(100, Math.max(0, Number.isFinite(requestedPercent) ? requestedPercent : company.defaultDepositPercent));
  return {
    amount,
    packageName: estimatePackageOptions.includes(record.packageName) ? record.packageName : "Custom",
    introText: String(record.introText || company.estimateIntroText).trim(),
    warrantyText: String(record.warrantyText || company.estimateWarrantyText).trim(),
    disclaimer: String(record.disclaimer || company.estimateDisclaimer).trim(),
    expirationDays,
    expiresAt: record.expiresAt || estimateExpiresAt(expirationDays),
    depositPercent,
    depositRequested,
    terms: String(record.terms || company.defaultDepositWording).trim(),
    updatedAt: record.updatedAt || "",
    updatedBy: record.updatedBy || ""
  };
}

function estimateRevisionStatus(value = "draft") {
  const normalized = String(value || "").trim().toLowerCase();
  if (["sent", "approved", "declined", "draft"].includes(normalized)) return normalized;
  if (normalized === "not_sent") return "draft";
  return "draft";
}

function normalizeEstimateRevision(record = {}, job = {}, index = 0) {
  const estimate = normalizeEstimateRecord(record, job);
  const status = estimateRevisionStatus(record.status || record.approvalStatus || job.approvalStatus);
  const createdAt = record.createdAt || record.sentAt || estimate.updatedAt || new Date().toISOString();
  return {
    ...estimate,
    id: record.id || `estimate-${createId()}`,
    revisionNumber: Math.max(1, Math.round(Number(record.revisionNumber) || index + 1)),
    status,
    createdAt,
    createdBy: record.createdBy || estimate.updatedBy || accountDisplayName(),
    sentAt: record.sentAt || (status === "sent" ? createdAt : ""),
    approvedAt: record.approvedAt || (status === "approved" ? createdAt : ""),
    declinedAt: record.declinedAt || (status === "declined" ? createdAt : ""),
    declineReason: String(record.declineReason || "").trim()
  };
}

function hasMeaningfulEstimate(record = {}, job = {}) {
  const amount = normalizeValue(record.amount ?? job.value);
  return amount > 0 && Boolean(
    record.updatedAt ||
    record.createdAt ||
    record.sentAt ||
    job.status === "estimated" ||
    ["sent", "approved", "declined"].includes(job.approvalStatus)
  );
}

function normalizeEstimateHistory(history = [], job = {}) {
  const normalized = Array.isArray(history)
    ? history.map((record, index) => normalizeEstimateRevision(record, job, index)).filter((record) => record.amount > 0)
    : [];
  if (normalized.length) {
    return normalized
      .sort((a, b) => a.revisionNumber - b.revisionNumber || String(a.createdAt).localeCompare(String(b.createdAt)))
      .map((record, index) => ({ ...record, revisionNumber: index + 1 }));
  }
  if (hasMeaningfulEstimate(job.estimate || {}, job)) {
    return [normalizeEstimateRevision({
      ...(job.estimate || {}),
      id: "estimate-revision-1",
      revisionNumber: 1,
      status: estimateRevisionStatus(job.approvalStatus),
      createdAt: job.estimate?.updatedAt || job.createdAt || new Date().toISOString(),
      createdBy: job.estimate?.updatedBy || "Backline"
    }, job, 0)];
  }
  return [];
}

function latestEstimateRevision(job = {}) {
  const history = normalizeEstimateHistory(job.estimateHistory || [], job);
  return history[history.length - 1] || null;
}

function syncEstimateHistoryWithApprovalStatus(job) {
  const status = estimateRevisionStatus(job.approvalStatus);
  if (!["approved", "declined"].includes(status)) return job;
  const latest = latestEstimateRevision(job);
  if (!latest || latest.status === status) return job;
  return updateLatestEstimateRevisionStatus(job, status, {
    approvedAt: status === "approved" ? job.approvedAt || new Date().toISOString() : "",
    declinedAt: status === "declined" ? job.declinedAt || new Date().toISOString() : "",
    declineReason: job.declineReason || "",
    updatedBy: "Customer"
  });
}

function appendEstimateRevision(job, estimate, status) {
  const history = normalizeEstimateHistory(job.estimateHistory || [], job);
  const nextRevision = normalizeEstimateRevision({
    ...estimate,
    id: `estimate-${createId()}`,
    revisionNumber: history.length + 1,
    status: estimateRevisionStatus(status),
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName(),
    sentAt: status === "sent" ? new Date().toISOString() : "",
    approvedAt: status === "approved" ? new Date().toISOString() : ""
  }, job, history.length);
  job.estimateHistory = [...history, nextRevision];
  job.estimate = normalizeEstimateRecord(nextRevision, job);
  job.approvalStatus = nextRevision.status === "draft" ? "not_sent" : nextRevision.status;
  return nextRevision;
}

function updateLatestEstimateRevisionStatus(job, status, details = {}) {
  const history = normalizeEstimateHistory(job.estimateHistory || [], job);
  if (!history.length) return job;
  const nextStatus = estimateRevisionStatus(status);
  const now = new Date().toISOString();
  const latestIndex = history.length - 1;
  job.estimateHistory = history.map((revision, index) => index === latestIndex
    ? normalizeEstimateRevision({
        ...revision,
        status: nextStatus,
        approvedAt: nextStatus === "approved" ? details.approvedAt || now : revision.approvedAt,
        declinedAt: nextStatus === "declined" ? details.declinedAt || now : revision.declinedAt,
        declineReason: nextStatus === "declined" ? details.declineReason || revision.declineReason : revision.declineReason,
        updatedAt: now,
        updatedBy: details.updatedBy || accountDisplayName()
      }, job, index)
    : revision);
  const latest = job.estimateHistory[latestIndex];
  job.estimate = normalizeEstimateRecord(latest, job);
  job.approvalStatus = latest.status === "draft" ? "not_sent" : latest.status;
  return job;
}

function estimateAmount(job = {}) {
  return (latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job)).amount;
}

function supabaseConfig() {
  const config = window.BACKLINE_SUPABASE_CONFIG || {};
  return {
    url: String(config.url || "").trim(),
    anonKey: String(config.anonKey || "").trim(),
    environment: String(config.environment || "").trim()
  };
}

function isLocalOrigin() {
  return location.protocol === "file:" || ["localhost", "127.0.0.1", "::1"].includes(location.hostname);
}

function deploymentEnvironment() {
  const raw = supabaseConfig().environment.toLowerCase();
  if (["local", "beta", "production"].includes(raw)) return raw;
  if (raw) return "custom";
  return isLocalOrigin() ? "local" : "undeclared";
}

function deploymentEnvironmentLabel(environment = deploymentEnvironment()) {
  return deploymentEnvironmentLabels[environment] || deploymentEnvironmentLabels.undeclared;
}

function deploymentEnvironmentDetail(environment = deploymentEnvironment()) {
  if (environment === "production" && isLocalOrigin()) {
    return "Production config is loaded from a local origin. Verify this before release.";
  }
  if (environment === "production") return "Production config is loaded for a hosted build.";
  if (environment === "beta") return "Beta environment is declared for pre-release testing.";
  if (environment === "local") return "Local/dev environment is declared for testing.";
  if (environment === "custom") return `Custom environment: ${supabaseConfig().environment}`;
  return "No environment label is declared in supabase-config.js.";
}

function deploymentEnvironmentTone(environment = deploymentEnvironment()) {
  if (environment === "production" && isLocalOrigin()) return "warning";
  if (["production", "beta", "local"].includes(environment)) return "ready";
  return "warning";
}

function isSupabaseConfigured() {
  const config = supabaseConfig();
  return Boolean(config.url && config.anonKey && window.supabase?.createClient);
}

function updateAuthStatus() {
  if (!isSupabaseConfigured()) {
    elements.authStatus.textContent = "Local mode";
    elements.signOutButton.hidden = true;
    return;
  }

  if (state.currentUser) {
    elements.authStatus.textContent = `${roleLabel()}: ${accountDisplayName()}`;
    elements.signOutButton.hidden = false;
    return;
  }

  elements.authStatus.textContent = "Secure database configured";
  elements.signOutButton.hidden = true;
}

function friendlyAuthError(error) {
  const message = String(error?.message || "").toLowerCase();
  if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
    return "An account already exists for that email. Use Sign in instead.";
  }
  if (message.includes("invalid login credentials")) {
    return "Invalid login. Create an account first, confirm your email if Supabase asks, then sign in with the same password.";
  }
  if (message.includes("email not confirmed")) {
    return "Check your email and confirm the account before signing in.";
  }
  return error?.message || "Authentication failed. Please try again.";
}

function friendlyApprovalError(error) {
  const message = String(error?.message || "");
  if (isSupabaseNetworkError(error)) {
    return friendlySupabaseError(error, "Could not reach the secure approval database.");
  }
  if (/schema cache|could not find the function/i.test(message)) {
    return "Backline's approval database function needs the signature update. Run supabase-schema-09-approval-signatures.sql in Supabase, wait a few seconds, then try this approval again.";
  }
  return message || "Could not submit approval.";
}

function isSupabaseNetworkError(error) {
  const message = String(error?.message || error || "");
  return error?.name === "TypeError" && /failed to fetch|network|load failed/i.test(message);
}

function friendlySupabaseError(error, fallback = "Backline could not reach Supabase.") {
  if (isSupabaseNetworkError(error)) {
    return `${fallback} Check your internet/VPN/firewall, make sure the local Backline server is running, then try again.`;
  }
  return String(error?.message || fallback);
}

function notifySupabaseIssue(error, options = {}) {
  const now = Date.now();
  const important = options.important || isSupabaseNetworkError(error);
  if (!important && !options.always) return;
  if (!options.always && now - (state.lastSupabaseNetworkToastAt || 0) < 30000) return;
  state.lastSupabaseNetworkToastAt = now;
  showToast(
    options.title || "Secure database unavailable",
    friendlySupabaseError(error, options.fallback || "Backline could not reach Supabase."),
    options.type || "danger",
    { id: "supabase-network", timeout: options.timeout || 8000 }
  );
}

function isExistingSignup(result) {
  if (!result?.data?.user) return false;
  const identities = result.data.user.identities;
  return Array.isArray(identities) && identities.length === 0;
}

function formatDisplayName(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ".")
    .replace(/[^a-z0-9._-]/g, "");
}

function normalizeApprovalName(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function approvalSignatureMatches(signature, customerName) {
  return Boolean(normalizeApprovalName(signature) && normalizeApprovalName(signature) === normalizeApprovalName(customerName));
}

function signatureCanvasPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (canvas.width / rect.width),
    y: (event.clientY - rect.top) * (canvas.height / rect.height)
  };
}

function signatureCanvasContext(canvas) {
  const context = canvas.getContext("2d");
  context.lineWidth = 2.4;
  context.lineCap = "round";
  context.lineJoin = "round";
  context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#162033";
  return context;
}

function clearApprovalSignature(form) {
  const canvas = form?.querySelector("[data-signature-pad]");
  const signatureImage = form?.querySelector("[data-signature-image]");
  if (!canvas) return;
  signatureCanvasContext(canvas).clearRect(0, 0, canvas.width, canvas.height);
  canvas.dataset.signed = "";
  canvas.dataset.drawing = "";
  if (signatureImage) signatureImage.value = "";
}

function approvalSignatureImage(form) {
  const canvas = form?.querySelector("[data-signature-pad]");
  if (!canvas || canvas.dataset.signed !== "true") return "";
  return canvas.toDataURL("image/png");
}

function approvalJobFromForm(form, overrides = {}) {
  let job = {};
  try {
    job = JSON.parse(form?.dataset.jobPayload || "{}");
  } catch {
    job = {};
  }
  return ensureJobDefaults({
    ...job,
    ...overrides
  });
}

function approvalPdfLines(job, company = companySettings()) {
  const estimate = normalizeEstimateRecord(job.estimate || {}, job);
  return [
    ["Provider", customerFacingLegalName(company)],
    ["Company phone", company.phone || "Not provided"],
    ["Company email", company.email || "Not provided"],
    ["Customer", job.name],
    ["Customer phone", job.phone || "Not provided"],
    ["Service address", job.address],
    ["Service type", `${job.trade} / ${jobTypeLabel(job)}`],
    ["Scheduled service", scheduleText(job)],
    ["Technician", customerFacingTechnicianName(job.technician)],
    ["Requested work", job.issue],
    ["Estimate package", estimate.packageName],
    ["Estimate expires", estimate.expiresAt ? new Date(`${estimate.expiresAt}T12:00:00`).toLocaleDateString() : "Not set"],
    ["Approval total", formatMoney(estimate.amount)],
    ["Deposit requested", formatMoney(estimate.depositRequested)],
    ["Deposit collected", job.depositCollected ? "Yes" : "No"],
    ["Approval terms", company.approvalWording],
    ["Important note", company.approvalDisclaimerText],
    ["Service policy", company.servicePolicyText || "Not provided"],
    ["Warranty", estimate.warrantyText],
    ["Estimate disclaimer", estimate.disclaimer],
    ["Typed approval name", job.customerSignature || job.name],
    ["Approved date", job.approvedAt ? new Date(job.approvedAt).toLocaleString() : new Date().toLocaleString()]
  ];
}

function approvalPdfSections(job, company = companySettings()) {
  const valuesByLabel = new Map(approvalPdfLines(job, company));
  const pick = (labels) => labels
    .map((label) => [label, valuesByLabel.get(label)])
    .filter(([, value]) => value !== undefined);
  return [
    {
      title: "Service provider",
      lines: pick(["Provider", "Company phone", "Company email"])
    },
    {
      title: "Customer and job",
      lines: pick(["Customer", "Customer phone", "Service address", "Service type", "Scheduled service", "Technician", "Requested work"])
    },
    {
      title: "Estimate approval",
      lines: pick(["Estimate package", "Estimate expires", "Approval total", "Deposit requested", "Deposit collected", "Typed approval name", "Approved date"])
    },
    {
      title: "Terms and notes",
      lines: pick(["Approval terms", "Important note", "Service policy", "Warranty", "Estimate disclaimer"])
    }
  ];
}

function invoicePdfLines(job) {
  const invoice = invoiceRecord(job);
  const company = companySettings();
  return [
    ["Company", company.companyName],
    ["Legal business name", customerFacingLegalName(company)],
    ["Company phone", company.phone || "Not provided"],
    ["Company email", company.email || "Not provided"],
    ["Support contact", customerFacingContactLine(company)],
    ["Company address", company.address || "Not provided"],
    ["Customer", job.name],
    ["Phone", job.phone || "Not provided"],
    ["Service address", job.address],
    ["Trade", `${job.trade} / ${jobTypeLabel(job)}`],
    ["Scheduled", scheduleText(job)],
    ["Technician", customerFacingTechnicianName(job.technician)],
    ["Invoice number", invoice.number],
    ["Invoice status", invoiceStatusLabel(invoice.status)],
    ["Service description", job.issue],
    ["Line items", invoice.lineItems.length ? `${invoice.lineItems.length} item${invoice.lineItems.length === 1 ? "" : "s"}` : "No line items"],
    ["Invoice total", formatMoney(invoice.amount)],
    ["Deposit requested", formatMoney(invoice.depositRequested)],
    ["Deposit collected", formatMoney(invoice.depositCollected)],
    ["Paid amount", formatMoney(invoice.paidAmount)],
    ["Balance due", formatMoney(invoiceBalance(job))],
    ["Payment method", paymentMethodLabel(invoice.paymentMethod)],
    ["Payment terms", company.invoiceTerms],
    ["Deposit policy", company.defaultDepositWording],
    ["Customer support", company.receiptSupportLine || customerFacingSupportLine(company)],
    ["Default tax rate", `${company.defaultTaxRate}%`],
    ["Updated by", invoice.updatedBy || accountDisplayName()],
    ["Updated at", invoice.updatedAt ? new Date(invoice.updatedAt).toLocaleString() : new Date().toLocaleString()]
  ];
}

function receiptPdfLines(job, payment = {}) {
  const invoice = invoiceRecord(job);
  const company = companySettings();
  const record = normalizePaymentRecord(payment);
  return [
    ["Company", company.companyName],
    ["Legal business name", customerFacingLegalName(company)],
    ["Company phone", company.phone || "Not provided"],
    ["Company email", company.email || "Not provided"],
    ["Support contact", company.receiptSupportLine || customerFacingSupportLine(company)],
    ["Customer", job.name],
    ["Phone", job.phone || "Not provided"],
    ["Service address", job.address],
    ["Invoice number", invoice.number],
    ["Invoice total", formatMoney(invoice.amount)],
    ["Amount received", formatMoney(record.amount)],
    ["Payment type", paymentKindLabel(record.kind)],
    ["Payment method", paymentMethodLabel(record.method || invoice.paymentMethod)],
    ["Paid date", record.paidAt ? new Date(`${record.paidAt}T12:00:00`).toLocaleDateString() : new Date().toLocaleDateString()],
    ["Total collected", formatMoney(invoiceCollectedAmount(invoice))],
    ["Remaining balance", formatMoney(invoiceBalance(job))],
    ["Recorded by", record.createdBy || invoice.updatedBy || accountDisplayName()]
  ];
}

const PDF_PAGE_WIDTH = 612;
const PDF_PAGE_BOTTOM = 672;
const PDF_FOOTER_TOP = 710;
const APPROVAL_PDF_LAYOUT_VERSION = "2026-08-footer-band";

function ensurePdfSpace(pdf, y, requiredHeight, margin = 48) {
  if (y + requiredHeight <= PDF_PAGE_BOTTOM) return y;
  pdf.addPage();
  return margin;
}

function addPdfLines(pdf, lines, margin, y, labelWidth = 132, options = {}) {
  const pageWidth = options.pageWidth || PDF_PAGE_WIDTH;
  const valueX = margin + labelWidth;
  const valueWidth = options.valueWidth || pageWidth - valueX - margin;
  const labelColor = options.labelColor || [71, 85, 105];
  const valueColor = options.valueColor || [15, 23, 42];
  pdf.setFontSize(10);
  lines.forEach(([label, value]) => {
    const wrapped = pdf.splitTextToSize(String(value || "Not provided"), valueWidth);
    const rowHeight = Math.max(24, wrapped.length * 13 + 8);
    y = ensurePdfSpace(pdf, y, rowHeight, margin);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(...labelColor);
    pdf.text(`${label}:`, margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(...valueColor);
    pdf.text(wrapped, valueX, y);
    y += rowHeight;
  });
  pdf.setTextColor(0);
  return y;
}

function addPdfSectionTitle(pdf, title, margin, y) {
  y = ensurePdfSpace(pdf, y, 60, margin);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(37, 99, 235);
  pdf.text(String(title || "").toUpperCase(), margin, y);
  y += 10;
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, y, PDF_PAGE_WIDTH - margin, y);
  pdf.setTextColor(0);
  return y + 18;
}

function addPdfBrandHeader(pdf, title, subtitle = "", company = companySettings()) {
  const shopLine = company.companySlogan
    || company.serviceArea
    || [company.phone, company.email].filter(Boolean).join(" / ")
    || "Service documentation";
  pdf.setFillColor(15, 37, 60);
  pdf.rect(0, 0, 612, 94, "F");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(21);
  pdf.setTextColor(255, 255, 255);
  pdf.text(company.companyName || "Backline", 48, 42);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(191, 219, 254);
  pdf.text(pdf.splitTextToSize(shopLine, 300), 48, 62);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text(title, 390, 42);
  if (subtitle) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(226, 232, 240);
    pdf.text(pdf.splitTextToSize(subtitle, 170), 390, 60);
  }
  pdf.setTextColor(0);
  return 126;
}

function addPdfInfoPanel(pdf, x, y, title, lines = [], width = 246) {
  pdf.setDrawColor(220, 227, 236);
  pdf.setFillColor(247, 249, 252);
  pdf.roundedRect(x, y, width, 102, 7, 7, "FD");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text(String(title || "").toUpperCase(), x + 12, y + 18);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(22, 32, 51);
  let lineY = y + 38;
  lines.filter(Boolean).slice(0, 4).forEach((line) => {
    const wrapped = pdf.splitTextToSize(String(line), width - 24);
    pdf.text(wrapped, x + 12, lineY);
    lineY += Math.max(14, wrapped.length * 11);
  });
  pdf.setTextColor(0);
}

function addPdfSummaryCards(pdf, cards = [], margin = 48, y = 0) {
  const width = 118;
  const gap = 10;
  cards.slice(0, 4).forEach((card, index) => {
    const x = margin + index * (width + gap);
    pdf.setDrawColor(220, 227, 236);
    pdf.setFillColor(255, 255, 255);
    pdf.roundedRect(x, y, width, 58, 7, 7, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(String(card.label || "").toUpperCase(), x + 10, y + 17);
    pdf.setFontSize(13);
    pdf.setTextColor(22, 32, 51);
    pdf.text(String(card.value || "Not set"), x + 10, y + 38);
    if (card.detail) {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text(pdf.splitTextToSize(String(card.detail), width - 20), x + 10, y + 50);
    }
  });
  pdf.setTextColor(0);
  return y + 78;
}

function addPdfFooter(pdf, margin, footerText) {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(95);
  pdf.setDrawColor(226, 232, 240);
  pdf.line(margin, PDF_FOOTER_TOP, PDF_PAGE_WIDTH - margin, PDF_FOOTER_TOP);
  const wrapped = pdf.splitTextToSize(String(footerText || ""), PDF_PAGE_WIDTH - margin * 2).slice(0, 3);
  pdf.text(wrapped, margin, PDF_FOOTER_TOP + 14);
  pdf.setTextColor(0);
}

function createInvoicePdfFile(job) {
  const JsPdf = window.jspdf?.jsPDF;
  if (!JsPdf) {
    throw new Error("The PDF generator is still loading. Refresh Backline and try again.");
  }

  const invoice = invoiceRecord(job);
  const company = companySettings();
  const pdf = new JsPdf({ unit: "pt", format: "letter" });
  const margin = 48;
  const fileName = invoicePdfFileName(job);
  let y = addPdfBrandHeader(pdf, "Invoice", `${invoice.number} - generated ${new Date().toLocaleDateString()}`, company);

  addPdfInfoPanel(pdf, margin, y, "Bill to", [
    job.name,
    job.phone || "Phone not provided",
    job.address
  ]);
  addPdfInfoPanel(pdf, 318, y, "Job", [
    `${job.trade} / ${jobTypeLabel(job)}`,
    job.issue,
    `Scheduled ${scheduleText(job, { includeYear: true })}`,
    customerFacingTechnicianName(job.technician)
  ]);
  y += 124;

  y = addPdfSummaryCards(pdf, [
    { label: "Invoice", value: invoice.number },
    { label: "Total", value: formatMoney(invoice.amount) },
    { label: "Collected", value: formatMoney(invoiceCollectedAmount(invoice)) },
    { label: "Balance", value: formatMoney(invoiceBalance(job)) }
  ], margin, y);

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Official invoice record generated from the job billing details.", margin, y);
  pdf.setTextColor(0);
  y += 24;

  if (invoice.lineItems.length) {
    y += 8;
    pdf.setFont("helvetica", "bold");
    pdf.text("Invoice line items:", margin, y);
    y += 18;
    pdf.setFontSize(10);
    pdf.text("Description", margin, y);
    pdf.text("Qty", 330, y);
    pdf.text("Rate", 380, y);
    pdf.text("Total", 460, y);
    y += 12;
    pdf.setDrawColor(220);
    pdf.line(margin, y, 540, y);
    y += 16;
    pdf.setFont("helvetica", "normal");
    invoice.lineItems.forEach((item) => {
      const description = `${item.description} (${item.category}, ${item.unit}${item.taxable ? ", taxable" : ""})`;
      const wrapped = pdf.splitTextToSize(description, 250);
      pdf.text(wrapped, margin, y);
      pdf.text(String(item.qty), 330, y);
      pdf.text(formatMoney(item.unitPrice), 380, y);
      pdf.text(formatMoney(invoiceLineItemTotal(item)), 460, y);
      y += Math.max(18, wrapped.length * 13);
    });
  }

  if (job.parts?.length) {
    y += 8;
    pdf.setFont("helvetica", "bold");
    pdf.text("Parts and materials:", margin, y);
    y += 16;
    pdf.setFont("helvetica", "normal");
    job.parts.slice(0, 8).forEach((part) => {
      const partText = `${part.qty || "1"} x ${part.name} (${part.source || "stock"})${part.cost ? ` - ${formatMoney(part.cost)} each` : ""}`;
      const wrapped = pdf.splitTextToSize(partText, 500);
      pdf.text(wrapped, margin + 14, y);
      y += Math.max(16, wrapped.length * 14);
    });
  }

  if (invoice.note) {
    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Invoice note:", margin, y);
    y += 16;
    pdf.setFont("helvetica", "normal");
    pdf.text(pdf.splitTextToSize(invoice.note, 500), margin, y);
    y += 38;
  }

  y += 8;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.text("Terms", margin, y);
  y += 15;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(pdf.splitTextToSize(company.invoiceTerms || "Payment is due upon receipt.", 500), margin, y);

  addPdfFooter(pdf, margin, customerDocumentFooter(company));
  const url = pdf.output("datauristring");
  return {
    id: createId(),
    name: fileName,
    type: "application/pdf",
    size: dataUrlSize(url),
    url,
    note: "Invoice PDF generated from job billing details",
    source: "invoice pdf",
    customerVisible: true,
    createdAt: new Date().toISOString()
  };
}

function createReceiptPdfFile(job, payment = {}) {
  const JsPdf = window.jspdf?.jsPDF;
  if (!JsPdf) {
    throw new Error("The PDF generator is still loading. Refresh Backline and try again.");
  }

  const invoice = invoiceRecord(job);
  const company = companySettings();
  const record = normalizePaymentRecord(payment);
  const pdf = new JsPdf({ unit: "pt", format: "letter" });
  const margin = 48;
  const fileName = receiptPdfFileName(job, record);
  let y = addPdfBrandHeader(pdf, "Payment Receipt", `${invoice.number} - ${formatMoney(record.amount)} received`, company);

  addPdfInfoPanel(pdf, margin, y, "Received from", [
    job.name,
    job.phone || "Phone not provided",
    job.address
  ]);
  addPdfInfoPanel(pdf, 318, y, "Payment", [
    `${paymentKindLabel(record.kind)} by ${paymentMethodLabel(record.method || invoice.paymentMethod)}`,
    `Paid ${record.paidAt ? new Date(`${record.paidAt}T12:00:00`).toLocaleDateString() : new Date().toLocaleDateString()}`,
    record.note || "No note"
  ]);
  y += 124;

  y = addPdfSummaryCards(pdf, [
    { label: "Received", value: formatMoney(record.amount) },
    { label: "Invoice total", value: formatMoney(invoice.amount) },
    { label: "Collected", value: formatMoney(invoiceCollectedAmount(invoice)) },
    { label: "Balance", value: formatMoney(invoiceBalance(job)) }
  ], margin, y);

  y += 18;
  pdf.setFont("helvetica", "bold");
  pdf.text(invoiceBalance(job) ? "Payment recorded" : "Paid in full", margin, y);
  y += 16;
  pdf.setFont("helvetica", "normal");
  pdf.text(pdf.splitTextToSize(record.note || invoice.note || "Thank you for your payment.", 500), margin, y);
  y += 38;
  pdf.setFont("helvetica", "bold");
  pdf.text("Receipt support", margin, y);
  y += 16;
  pdf.setFont("helvetica", "normal");
  pdf.text(pdf.splitTextToSize(company.receiptSupportLine || customerFacingSupportLine(company), 500), margin, y);

  addPdfFooter(pdf, margin, customerDocumentFooter(company));
  const url = pdf.output("datauristring");
  return {
    id: createId(),
    name: fileName,
    type: "application/pdf",
    size: dataUrlSize(url),
    url,
    note: "Payment receipt PDF generated after payment was recorded",
    source: "receipt pdf",
    customerVisible: true,
    createdAt: new Date().toISOString()
  };
}

async function createApprovalPdfFile(job, options = {}) {
  const JsPdf = window.jspdf?.jsPDF;
  if (!JsPdf) {
    throw new Error("The PDF generator is still loading. Refresh Backline and approve again.");
  }

  const pdf = new JsPdf({ unit: "pt", format: "letter" });
  const company = options.companySettings
    ? customerFacingCompanySettings(options.companySettings)
    : companySettings();
  const margin = 48;
  const fileName = approvalPdfFileName(job);
  const estimate = normalizeEstimateRecord(job.estimate || {}, job);
  let y = addPdfBrandHeader(pdf, "Approved Estimate", `${formatMoney(estimate.amount)} approved by ${job.customerSignature || job.name}`, company);

  addPdfInfoPanel(pdf, margin, y, "Customer", [
    job.name,
    job.phone || "Phone not provided",
    job.address
  ]);
  addPdfInfoPanel(pdf, 318, y, "Approval", [
    `${job.trade} / ${jobTypeLabel(job)}`,
    `Scheduled ${scheduleText(job, { includeYear: true })}`,
    `Approved ${job.approvedAt ? new Date(job.approvedAt).toLocaleString() : new Date().toLocaleString()}`
  ]);
  y += 124;

  y = addPdfSummaryCards(pdf, [
    { label: "Estimate", value: formatMoney(estimate.amount) },
    { label: "Deposit", value: formatMoney(estimate.depositRequested) },
    { label: "Package", value: estimate.packageName || "Custom" },
    { label: "Status", value: "Approved" }
  ], margin, y);

  approvalPdfSections(job, company).forEach((section) => {
    y = addPdfSectionTitle(pdf, section.title, margin, y);
    y = addPdfLines(pdf, section.lines, margin, y, 122, { valueWidth: 382 });
    y += 8;
  });

  if (job.scopeChanges?.length) {
    y = ensurePdfSpace(pdf, y, 48, margin);
    y += 8;
    pdf.setFont("helvetica", "bold");
    pdf.text("Approved changes:", margin, y);
    y += 16;
    pdf.setFont("helvetica", "normal");
    job.scopeChanges.forEach((change) => {
      const text = `${change.description} - ${formatMoney(change.amount)}`;
      const lines = pdf.splitTextToSize(text, 500);
      y = ensurePdfSpace(pdf, y, Math.max(18, lines.length * 14), margin);
      pdf.text(lines, margin + 14, y);
      y += Math.max(16, lines.length * 14);
    });
  }

  y = ensurePdfSpace(pdf, y, 164, margin);
  y += 22;
  pdf.setFont("helvetica", "bold");
  pdf.text("Customer drawn signature:", margin, y);
  y += 12;
  pdf.setDrawColor(200);
  pdf.rect(margin, y, 250, 92);
  if (job.customerSignatureImage) {
    pdf.addImage(job.customerSignatureImage, "PNG", margin + 8, y + 8, 234, 76);
  }
  y += 112;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(71, 85, 105);
  const confirmationNote = "This approval record includes the typed customer name and drawn signature captured at the time of approval.";
  pdf.text(pdf.splitTextToSize(confirmationNote, 500), margin, y);
  pdf.setTextColor(0);
  addPdfFooter(pdf, margin, customerDocumentFooter(company));

  const url = pdf.output("datauristring");
  return {
    id: createId(),
    name: fileName,
    type: "application/pdf",
    size: dataUrlSize(url),
    url,
    note: "Approved estimate PDF with customer signature",
    source: "approval pdf",
    layoutVersion: APPROVAL_PDF_LAYOUT_VERSION,
    customerVisible: true,
    createdAt: new Date().toISOString()
  };
}

function accountDisplayName() {
  const metadata = state.currentUser?.user_metadata || {};
  const email = state.currentUser?.email || "";
  return metadata.display_name || metadata.full_name || email.split("@")[0] || "Backline user";
}

function displayFirstName(value = accountDisplayName()) {
  const raw = String(value || "").trim();
  if (!raw) return "there";
  const name = raw.includes("@") ? raw.split("@")[0] : raw;
  const first = name
    .split(/[\s._-]+/)
    .find(Boolean);
  if (!first || first.toLowerCase() === "backline" || first.toLowerCase() === "local") return "there";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

function usernameFromIdentity(value) {
  const identity = String(value || "").trim();
  if (!identity) return "local user";
  return identity.includes("@") ? identity.split("@")[0] : identity;
}

function displayPersonName(value) {
  const username = usernameFromIdentity(value);
  if (!username || username === "local user") return "Local User";
  return username
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function isBacklineIdentity(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return !normalized || ["backline", "backline user", "local user"].includes(normalized);
}

function technicianDisplayName(value) {
  const technician = normalizeTechnician(value);
  return technician === "To Be Determined" ? technician : displayPersonName(technician);
}

function customerFacingTechnicianName(value) {
  const technician = normalizeTechnician(value);
  if (technician === "To Be Determined") return technician;
  const first = displayFirstName(technician);
  return first === "there" ? "Technician" : `Technician ${first}`;
}

function internalActorDisplayName(value) {
  return isBacklineIdentity(value) ? "Backline" : displayPersonName(value);
}

function customerFacingMessageAuthor(message = {}, company = companySettings()) {
  const normalized = normalizeJobMessage(message);
  if (normalized.direction === "in") return normalized.createdBy || "Customer";
  return isBacklineIdentity(normalized.createdBy)
    ? company.companyName || "Backline"
    : customerFacingTechnicianName(normalized.createdBy);
}

function normalizeTechnician(value) {
  const name = usernameFromIdentity(value);
  return name && name !== "local user" ? name : "To Be Determined";
}

function teamMemberDisplayName(member) {
  if (member?.isCurrentUser) return accountDisplayName();
  return normalizeTechnician(member?.displayName || member?.email);
}

function teamMemberDisplayLabel(member) {
  return displayPersonName(teamMemberDisplayName(member));
}

function customRoleMap() {
  const map = {};
  companySettings().customRoles.forEach((role) => {
    map[role.slug] = role;
  });
  return map;
}

function builtInRoleOverride(role) {
  return companySettings().roleOverrides?.[role] || null;
}

function roleDefinition(role) {
  return builtInRoleOverride(role)?.permissions || rolePermissions[role] || customRoleMap()[role]?.permissions || null;
}

function allAssignableRoles() {
  return [
    { slug: "admin", label: roleName("admin"), builtIn: true },
    { slug: "dispatcher", label: roleName("dispatcher"), builtIn: true },
    { slug: "tech", label: roleName("tech"), builtIn: true },
    ...companySettings().customRoles.map((role) => ({
      slug: role.slug,
      label: role.label,
      builtIn: false
    }))
  ];
}

function currentRole() {
  if (roleDefinition(state.userRole)) return state.userRole;
  return state.secureMode ? "tech" : "owner";
}

function canManageTeamRole(roleSlug = currentRole()) {
  if (roleSlug === "owner") return true;
  if (["dispatcher", "tech"].includes(roleSlug)) return false;
  const definition = roleDefinition(roleSlug);
  return Boolean(definition?.manageTeam);
}

function can(action) {
  if (action === "manageTeam") return canManageTeamRole();
  const role = roleDefinition(currentRole()) || rolePermissions.owner;
  if (action === "createJob") return Boolean(role.createJob);
  if (action === "uploadFiles") return Boolean(role.uploadFiles);
  if (action === "exportData") return Boolean(role.exportData);
  return role.actions.includes(action);
}

function denyAction(action, detail = "") {
  recordActivity({
    type: "updated",
    label: "Blocked permission attempt",
    detail: `${roleLabel()} tried to ${action}${detail ? `: ${detail}` : ""}`
  });
  save();
  return false;
}

function canOrRecord(action, detail = "") {
  return can(action) || denyAction(action, detail);
}

function allowedViews() {
  const views = [...((roleDefinition(currentRole()) || rolePermissions.owner).views || [])];
  if (state.isCreator && !views.includes("creator")) {
    views.push("creator");
  }
  return views;
}

function isViewAllowed(view) {
  if (view === "creator") return Boolean(state.isCreator);
  return allowedViews().includes(view);
}

function activateView(view) {
  if (!isViewAllowed(view)) return false;
  document.querySelectorAll(".nav-item").forEach((button) => button.classList.remove("active"));
  document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
  document.querySelector(`[data-view="${view}"]`)?.classList.add("active");
  document.querySelector(`#view-${view}`)?.classList.add("active");
  return true;
}

function roleLabel() {
  return roleName(currentRole());
}

function roleName(role) {
  const labels = {
    owner: "Owner",
    admin: "Admin",
    dispatcher: "Dispatcher",
    tech: "Technician"
  };
  return builtInRoleOverride(role)?.label || labels[role] || customRoleMap()[role]?.label || "Owner";
}

function roleSummary(role) {
  const summaries = {
    owner: "Full access, team controls, exports, money, and insights.",
    admin: "Full workspace access and team controls, except ownership transfer.",
    dispatcher: "Books jobs, manages schedule, handles inbox, follow-ups, and customers.",
    tech: "Sees assigned jobs only, completes field work, uploads proof, and logs parts."
  };
  return builtInRoleOverride(role)?.summary || summaries[role] || customRoleMap()[role]?.summary || "Custom permissions set by the owner.";
}

function allRoleChoices({ includeOwner = false } = {}) {
  return [
    ...(includeOwner ? [{ slug: "owner", label: roleName("owner"), builtIn: true }] : []),
    ...allAssignableRoles()
  ];
}

function rolePermissionItems(role) {
  const definition = roleDefinition(role) || rolePermissions.tech;
  return rolePermissionCatalog.filter((permission) => {
    if (permission.type === "view") return (definition.views || []).includes(permission.value);
    if (permission.type === "action") return (definition.actions || []).includes(permission.value);
    if (permission.key === "manageTeam") return canManageTeamRole(role);
    return Boolean(definition[permission.value]);
  });
}

function rolePermissionChipMarkup(items, emptyText) {
  return items.length
    ? items.map((item) => `<span>${escapeHtml(permissionCatalogLabel(item))}</span>`).join("")
    : `<em>${escapeHtml(emptyText)}</em>`;
}

function roleCan(role, action) {
  const definition = roleDefinition(role) || rolePermissions.tech;
  if (action === "manageTeam") return canManageTeamRole(role);
  if (action === "createJob") return Boolean(definition.createJob);
  if (action === "uploadFiles") return Boolean(definition.uploadFiles);
  if (action === "exportData") return Boolean(definition.exportData);
  if (String(action).startsWith("view:")) {
    return (definition.views || []).includes(action.replace("view:", ""));
  }
  return (definition.actions || []).includes(action);
}

function roleWorkflowPreviewItems(role) {
  const item = (label, checks = []) => {
    const complete = checks.filter((check) => roleCan(role, check)).length;
    return {
      label,
      complete,
      total: checks.length,
      status: complete === checks.length ? "ready" : complete > 0 ? "partial" : "blocked"
    };
  };
  return [
    item("Scheduling", ["view:schedule", "view:inbox", "book"]),
    item("Field work", ["view:inbox", "start", "complete", "task-toggle", "parts", "check-diagnosis", "check-photos", "check-signature"]),
    item("Customer updates", ["view:inbox", "view:customers", "portal", "portal-update", "customer-profile"]),
    item("Billing", ["view:money", "estimate", "approval", "invoice", "payment-request", "paid"]),
    item("Admin controls", ["view:team", "view:activity", "manageTeam", "exportData"])
  ];
}

function roleRestrictedPreviewItems(role) {
  const sensitive = [
    { label: "Delete or archive jobs", action: "delete" },
    { label: "Reopen closed work", action: "reopen" },
    { label: "Close jobs", action: "close" },
    { label: "Manage team and roles", action: "manageTeam" },
    { label: "Download workspace backup", action: "exportData" }
  ];
  return sensitive.map((item) => ({ ...item, allowed: roleCan(role, item.action) }));
}

function roleOperationalPreviewMarkup(role) {
  const definition = roleDefinition(role) || rolePermissions.tech;
  const permissions = rolePermissionItems(role);
  const views = permissions.filter((permission) => permission.type === "view");
  const actions = permissions.filter((permission) => permission.type !== "view");
  const workflows = roleWorkflowPreviewItems(role);
  const restricted = roleRestrictedPreviewItems(role);
  const openCount = (definition.views || []).length;
  const actionCount = (definition.actions || []).length + ["createJob", "uploadFiles", "exportData", "manageTeam"].filter((action) => roleCan(role, action)).length;
  const health = workflows.every((item) => item.status === "ready")
    ? "Full workflow"
    : workflows.some((item) => item.status === "partial")
      ? "Scoped workflow"
      : "View-only";

  return `
    <article class="role-operational-preview">
      <div class="role-operational-header">
        <div>
          <span>Previewing</span>
          <strong>${escapeHtml(roleName(role))}</strong>
          <small>${escapeHtml(roleSummary(role))}</small>
        </div>
        <div class="role-preview-score">
          <b>${escapeHtml(health)}</b>
          <small>${escapeHtml(`${openCount} tabs - ${actionCount} actions`)}</small>
        </div>
      </div>
      <div class="role-preview-metrics">
        <div>
          <span>Can open</span>
          <strong>${escapeHtml(String(openCount))}</strong>
          <small>Tabs and pages</small>
        </div>
        <div>
          <span>Can do</span>
          <strong>${escapeHtml(String(actionCount))}</strong>
          <small>Actions and utilities</small>
        </div>
        <div class="${canManageTeamRole(role) ? "warning" : ""}">
          <span>Role risk</span>
          <strong>${escapeHtml(canManageTeamRole(role) ? "High" : roleCan(role, "delete") || roleCan(role, "paid") ? "Medium" : "Low")}</strong>
          <small>${escapeHtml(canManageTeamRole(role) ? "Can change access" : "Limited controls")}</small>
        </div>
      </div>
      <div class="role-preview-columns">
        <section>
          <h4>Tabs visible</h4>
          <div class="role-test-chips">${rolePermissionChipMarkup(views, "No tabs")}</div>
        </section>
        <section>
          <h4>Actions visible</h4>
          <div class="role-test-chips">${rolePermissionChipMarkup(actions, "No actions")}</div>
        </section>
      </div>
      <div class="role-workflow-grid">
        ${workflows.map((workflow) => `
          <div class="role-workflow-card ${escapeHtml(workflow.status)}">
            <span>${escapeHtml(workflow.status === "ready" ? "Ready" : workflow.status === "partial" ? "Partial" : "Blocked")}</span>
            <strong>${escapeHtml(workflow.label)}</strong>
            <small>${escapeHtml(`${workflow.complete}/${workflow.total} needed access points`)}</small>
          </div>
        `).join("")}
      </div>
      <div class="role-restriction-list">
        ${restricted.map((item) => `
          <div class="${item.allowed ? "allowed" : "blocked"}">
            <span>${escapeHtml(item.allowed ? "Allowed" : "Blocked")}</span>
            <strong>${escapeHtml(item.label)}</strong>
          </div>
        `).join("")}
      </div>
    </article>
  `;
}

function roleAccessSummaryMarkup(role, { title = "", note = "", preview = false, permissionSet = null, label = "", summary = "" } = {}) {
  const permissions = permissionSet
    ? rolePermissionCatalog.filter((permission) => {
      if (permission.type === "view") return (permissionSet.views || []).includes(permission.value);
      if (permission.type === "action") return (permissionSet.actions || []).includes(permission.value);
      return Boolean(permissionSet[permission.value]);
    })
    : rolePermissionItems(role);
  const views = permissions.filter((permission) => permission.type === "view");
  const actions = permissions.filter((permission) => permission.type !== "view");
  const hasTeamManagement = permissionSet ? Boolean(permissionSet.manageTeam) : canManageTeamRole(role);
  return `
    <article class="role-access-card ${hasTeamManagement ? "powerful" : ""}">
      <div class="role-access-header">
        <div>
          <span>${escapeHtml(title || (preview ? "Previewing" : "Access level"))}</span>
          <strong>${escapeHtml(label || roleName(role))}</strong>
          <small>${escapeHtml(note || summary || roleSummary(role))}</small>
        </div>
        ${hasTeamManagement ? '<b class="role-power-badge">Can manage roles</b>' : ""}
      </div>
      <div class="permission-summary compact">
        <div class="permission-summary-row">
          <strong>Can open</strong>
          <div>${rolePermissionChipMarkup(views, "No pages")}</div>
        </div>
        <div class="permission-summary-row">
          <strong>Can do</strong>
          <div>${rolePermissionChipMarkup(actions, "No actions")}</div>
        </div>
      </div>
      ${hasTeamManagement ? `
        <div class="permission-summary-alert">
          This role can invite people, change roles, and edit permissions. Assign it only to trusted managers.
        </div>
      ` : ""}
    </article>
  `;
}

function isFieldScopedRole(role = currentRole()) {
  return role === "tech" || customRoleMap()[role]?.template === "tech";
}

function userAssignmentTokens() {
  const email = state.currentUser?.email || "";
  const handle = email.split("@")[0] || "";
  return [email, handle, accountDisplayName()].filter(Boolean).map((value) => value.toLowerCase());
}

function isAssignedToCurrentUser(job) {
  if (!isFieldScopedRole()) return true;
  const technician = String(job.technician || "").toLowerCase();
  if (!technician || technician === "to be determined") return false;
  return userAssignmentTokens().some((token) => technician.includes(token));
}

function assignmentSeenKey() {
  return (state.currentUser?.id || state.currentUser?.email || accountDisplayName() || "local-user").toLowerCase();
}

function isAssignableTechnician(technician) {
  return normalizeTechnician(technician) !== "To Be Determined";
}

function recordAssignmentUpdate(job, technician = job.technician) {
  const assignedTech = normalizeTechnician(technician);
  job.technician = assignedTech;
  if (!isAssignableTechnician(assignedTech)) return;
  job.assignmentUpdatedAt = new Date().toISOString();
  job.assignmentUpdatedBy = accountDisplayName();
  job.assignmentSeenBy = {};
}

function isNewAssignment(job) {
  ensureJobDefaults(job);
  return isFieldScopedRole() &&
    isAssignedToCurrentUser(job) &&
    Boolean(job.assignmentUpdatedAt) &&
    !job.assignmentSeenBy[assignmentSeenKey()];
}

function newAssignmentJobs() {
  return roleScopedJobs().filter(isNewAssignment);
}

function technicianOpenTaskJobs() {
  if (!isFieldScopedRole()) return [];
  return roleScopedJobs()
    .map(ensureJobDefaults)
    .filter((job) => !["closed", "paid"].includes(job.status) && incompleteTaskCount(job) > 0)
    .sort(sortBySchedule);
}

function technicianAttentionJobs() {
  if (!isFieldScopedRole()) return newAssignmentJobs();
  const attention = new Map();
  newAssignmentJobs().forEach((job) => attention.set(job.id, job));
  technicianOpenTaskJobs()
    .filter((job) => job.scheduleDate === todayISO() || job.status === "in_progress")
    .forEach((job) => attention.set(job.id, job));
  return [...attention.values()].sort(sortBySchedule);
}

function markAssignmentSeen(jobId) {
  if (!isFieldScopedRole()) return;
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job || !isNewAssignment(job)) return;
  ensureJobDefaults(job);
  job.assignmentSeenBy[assignmentSeenKey()] = new Date().toISOString();
  save();
}

function isUnreadInboundMessage(message) {
  const normalized = normalizeJobMessage(message);
  return normalized.direction === "in" && !normalized.seenBy[assignmentSeenKey()];
}

function unreadInboundMessages(job) {
  ensureJobDefaults(job);
  return job.messages.filter(isUnreadInboundMessage);
}

function hasUnreadInboundMessages(job) {
  return unreadInboundMessages(job).length > 0;
}

function unreadMessageJobs() {
  return roleScopedJobs().filter(hasUnreadInboundMessages);
}

function markJobMessagesSeen(jobId) {
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return false;
  ensureJobDefaults(job);
  const unread = unreadInboundMessages(job);
  if (!unread.length) return false;
  const seenAt = new Date().toISOString();
  const seenKey = assignmentSeenKey();
  job.messages = job.messages.map((message) => {
    const normalized = normalizeJobMessage(message);
    if (normalized.direction !== "in" || normalized.seenBy[seenKey]) return normalized;
    return {
      ...normalized,
      seenBy: {
        ...normalized.seenBy,
        [seenKey]: seenAt
      }
    };
  });
  save();
  return true;
}

function roleScopedJobs() {
  return state.jobs.filter((job) => {
    ensureJobDefaults(job);
    return isAssignedToCurrentUser(job);
  });
}

function fallbackTeamMember() {
  const email = state.currentUser?.email || "owner@backline.local";
  return {
    userId: state.currentUser?.id || "local-owner",
    email,
    displayName: accountDisplayName(),
    role: currentRole(),
    createdAt: new Date().toISOString(),
    isCurrentUser: true
  };
}

function normalizedTeamMembers() {
  const members = state.teamMembers.length ? state.teamMembers : [fallbackTeamMember()];
  const currentEmail = String(state.currentUser?.email || "").toLowerCase();
  return members.map((member) => ({
    ...member,
    role: roleDefinition(member.role) ? member.role : "tech",
    isCurrentUser: Boolean(member.isCurrentUser || String(member.email || "").toLowerCase() === currentEmail)
  }));
}

function technicianSuggestions() {
  const suggestions = new Set(["To Be Determined"]);
  normalizedTeamMembers()
    .filter((member) => roleDefinition(member.role))
    .forEach((member) => {
      const username = teamMemberDisplayName(member);
      if (username && username !== "local user") suggestions.add(username);
    });
  return [...suggestions].filter(Boolean).sort((a, b) => a.localeCompare(b));
}

function technicianOptionNames(selectedTechnician = "To Be Determined") {
  const selected = normalizeTechnician(selectedTechnician);
  const suggestions = new Set(technicianSuggestions());
  suggestions.add(selected);
  const sorted = [...suggestions].filter(Boolean).sort((a, b) => a.localeCompare(b));
  return ["To Be Determined", ...sorted.filter((name) => name !== "To Be Determined")];
}

function technicianOptionItems(selectedTechnician = "To Be Determined") {
  return technicianOptionNames(selectedTechnician).map((name) => ({
    value: name,
    label: technicianDisplayName(name)
  }));
}

function resetAuthCreateAccountState() {
  const usernameField = elements.authForm?.querySelector("[data-username-field]");
  const confirmPasswordField = elements.authForm?.querySelector("[data-confirm-password-field]");
  const signInButton = elements.authForm?.querySelector("[data-auth-signin-button]");
  const backButton = elements.authForm?.querySelector("[data-auth-back-login]");
  const signupButton = elements.authForm?.querySelector("[data-auth-signup-button]");
  elements.authForm?.classList.remove("signup-mode");
  if (usernameField) {
    usernameField.hidden = true;
  }
  if (confirmPasswordField) {
    confirmPasswordField.hidden = true;
  }
  if (signInButton) {
    signInButton.hidden = false;
  }
  if (backButton) {
    backButton.hidden = true;
  }
  if (signupButton) {
    signupButton.classList.remove("primary-button");
    signupButton.classList.add("secondary-button");
  }
  if (elements.authForm.elements.displayName) {
    elements.authForm.elements.displayName.value = "";
  }
  if (elements.authForm.elements.confirmPassword) {
    elements.authForm.elements.confirmPassword.value = "";
  }
}

function setAuthGate(visible, message = "") {
  elements.authGate.hidden = !visible;
  document.body.classList.toggle("auth-mode", visible);
  if (visible) {
    resetAuthCreateAccountState();
  }
  if (message) {
    elements.authGateStatus.textContent = message;
  }
}

function setAccountSwitching(active, message = "") {
  document.body.classList.toggle("account-switching", active);
  if (message) {
    elements.authGateStatus.textContent = message;
  }
}

function resetSecureWorkspaceState() {
  state.secureMode = false;
  state.isCreator = false;
  state.organizationId = null;
  state.jobs = [];
  state.deletedJobs = [];
  state.customers = [];
  state.teamMembers = [];
  state.teamInvites = [];
  state.pricebookItems = [];
  state.suppliers = [];
  state.activityEvents = [];
  state.companySettings = normalizeCompanySettings({});
  state.portalCompanySettings = null;
  state.automations = { ...defaultAutomations };
  state.selectedJobId = null;
  state.selectedCustomerId = null;
  state.pendingPaymentReview = null;
  state.portalJob = null;
  state.customerProfileNotice = null;
  state.expandedPanels = {};
}

function tabAuthStorage() {
  return {
    getItem(key) {
      return sessionStorage.getItem(key);
    },
    setItem(key, value) {
      sessionStorage.setItem(key, value);
    },
    removeItem(key) {
      sessionStorage.removeItem(key);
    }
  };
}

function selectedWorkspaceKey(userId = state.currentUser?.id) {
  return userId ? `${SELECTED_WORKSPACE_KEY_PREFIX}.${userId}` : "";
}

function loadSelectedWorkspaceId(userId = state.currentUser?.id) {
  const key = selectedWorkspaceKey(userId);
  if (!key) return "";
  try {
    return sessionStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function saveSelectedWorkspaceId(organizationId = state.organizationId, userId = state.currentUser?.id) {
  const key = selectedWorkspaceKey(userId);
  if (!key || !organizationId) return;
  try {
    sessionStorage.setItem(key, organizationId);
  } catch {
    // Workspace selection still works for the current render even without session storage.
  }
}

function normalizedOnboardingEmail(email = "") {
  return String(email || "").trim().toLowerCase();
}

function setPendingOwnerOnboarding(email) {
  const normalized = normalizedOnboardingEmail(email);
  if (!normalized) return;
  try {
    sessionStorage.setItem(OWNER_ONBOARDING_KEY, normalized);
  } catch {
    // Onboarding still works for same-session signups when session storage is unavailable.
  }
}

function consumePendingOwnerOnboarding(email) {
  const normalized = normalizedOnboardingEmail(email);
  if (!normalized) return false;
  try {
    const pending = sessionStorage.getItem(OWNER_ONBOARDING_KEY);
    if (pending !== normalized) return false;
    sessionStorage.removeItem(OWNER_ONBOARDING_KEY);
    return true;
  } catch {
    return false;
  }
}

function queueOwnerWorkspaceSettingsOnboarding(force = false) {
  if (!force && !consumePendingOwnerOnboarding(state.currentUser?.email)) return;
  state.openWorkspaceSettingsAfterLoad = currentRole() === "owner" && can("exportData");
}

function openQueuedWorkspaceSettings() {
  if (!state.openWorkspaceSettingsAfterLoad) return;
  state.openWorkspaceSettingsAfterLoad = false;
  requestAnimationFrame(() => {
    if (document.body.classList.contains("approval-mode") || document.body.classList.contains("auth-mode")) return;
    if (elements.companySettingsModal?.open) return;
    openCompanySettingsModal();
  });
}

function getSupabaseClient() {
  if (state.supabaseClient) return state.supabaseClient;
  if (!isSupabaseConfigured()) return null;
  const config = supabaseConfig();
  state.supabaseClient = window.supabase.createClient(config.url, config.anonKey, {
    auth: {
      storageKey: "backline.tab.auth",
      storage: tabAuthStorage(),
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
  return state.supabaseClient;
}

function isMissingCreatorAccessFunction(error) {
  return /is_platform_admin|schema cache|could not find the function/i.test(String(error?.message || ""));
}

async function loadCreatorAccess() {
  state.isCreator = false;
  const client = getSupabaseClient();
  if (!client || !state.currentUser) return false;
  try {
    const { data, error } = await client.rpc("is_platform_admin");
    if (error) throw error;
    state.isCreator = data === true;
  } catch (error) {
    state.isCreator = false;
    if (!isMissingCreatorAccessFunction(error)) {
      notifySupabaseIssue(error, {
        fallback: "Backline could not verify creator access."
      });
    }
  }
  return state.isCreator;
}

async function setupSecureBackend() {
  const client = getSupabaseClient();
  if (!client) {
    updateAuthStatus();
    return false;
  }

  let sessionResult;
  try {
    sessionResult = await client.auth.getSession();
  } catch (caughtError) {
    elements.storageStatus.textContent = "Secure database connection failed";
    notifySupabaseIssue(caughtError, {
      fallback: "Backline could not check your secure session."
    });
    throw caughtError;
  }

  const { data, error } = sessionResult;
  if (error) {
    elements.storageStatus.textContent = "Secure auth check failed";
    notifySupabaseIssue(error, {
      fallback: "Backline could not verify your secure session.",
      important: true
    });
    updateAuthStatus();
    return false;
  }

  const sessionUser = data.session?.user || null;
  resetSecureWorkspaceState();
  state.currentUser = sessionUser;
  updateAuthStatus();

  if (!state.currentUser) {
    setAuthGate(true, "Sign in to load the secure Backline database.");
    return true;
  }

  await loadCreatorAccess();
  const createdOwnerWorkspace = await ensureRemoteOrganization();
  queueOwnerWorkspaceSettingsOnboarding(createdOwnerWorkspace);
  await loadRemoteData();
  setAuthGate(false);
  return true;
}

async function ensureRemoteOrganization() {
  const client = getSupabaseClient();
  if (!client || !state.currentUser) return false;

  const preferredOrganizationId = loadSelectedWorkspaceId();
  let { data: memberships } = await client
    .from("organization_members")
    .select("organization_id, role")
    .eq("user_id", state.currentUser.id)
    .order("created_at", { ascending: true });
  let membership = (memberships || []).find((item) => item.organization_id === preferredOrganizationId) || (memberships || [])[0] || null;

  if (!membership?.organization_id) {
    let acceptedOrganizationId = "";
    try {
      const accepted = await client.rpc("accept_team_invite");
      acceptedOrganizationId = accepted.data || "";
    } catch {
      // No pending invite, or the team schema has not been installed yet.
    }
    let acceptedQuery = client
      .from("organization_members")
      .select("organization_id, role")
      .eq("user_id", state.currentUser.id)
      .order("created_at", { ascending: true });
    if (acceptedOrganizationId) {
      acceptedQuery = acceptedQuery.eq("organization_id", acceptedOrganizationId);
    }
    const { data: acceptedMemberships } = await acceptedQuery;
    membership = (acceptedMemberships || []).find((item) => item.organization_id === acceptedOrganizationId) || (acceptedMemberships || [])[0] || null;
  }

  if (membership?.organization_id) {
    state.organizationId = membership.organization_id;
    state.userRole = membership.role || "owner";
    saveSelectedWorkspaceId(state.organizationId);
    await syncCurrentMemberDisplayName();
    updateAuthStatus();
    return false;
  }

  const orgName = `${state.currentUser.email?.split("@")[0] || "Backline"} shop`;
  const { data: org, error: orgError } = await client
    .from("organizations")
    .insert({ name: orgName, owner_id: state.currentUser.id })
    .select("id")
    .single();

  if (orgError) throw orgError;

  let { error: memberError } = await client
    .from("organization_members")
    .insert({ organization_id: org.id, user_id: state.currentUser.id, email: state.currentUser.email, display_name: accountDisplayName(), role: "owner" });

  if (memberError) {
    const fallback = await client
      .from("organization_members")
      .insert({ organization_id: org.id, user_id: state.currentUser.id, email: state.currentUser.email, role: "owner" });
    memberError = fallback.error;
  }

  if (memberError) throw memberError;
  state.organizationId = org.id;
  state.userRole = "owner";
  saveSelectedWorkspaceId(state.organizationId);
  updateAuthStatus();
  return true;
}

async function syncCurrentMemberDisplayName() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId || !state.currentUser) return;
  try {
    const { error } = await client.rpc("sync_member_display_name", {
      target_org: state.organizationId,
      input_display_name: accountDisplayName(),
      input_email: state.currentUser.email
    });
    if (!error) return;
  } catch {
    // Fall back to direct update for databases that have not installed the helper function.
  }
  try {
    await client
      .from("organization_members")
      .update({
        email: state.currentUser.email,
        display_name: accountDisplayName()
      })
      .eq("organization_id", state.organizationId)
      .eq("user_id", state.currentUser.id);
  } catch {
    // Older databases may not have display_name until supabase-schema-10-team-display-names.sql is run.
  }
}

function jobToRemoteRow(job) {
  ensureJobDefaults(job);
  return {
    id: job.id,
    organization_id: state.organizationId,
    customer_id: job.customerId,
    status: job.status,
    trade: job.trade,
    job_type: job.jobType,
    urgency: job.urgency,
    schedule_date: job.scheduleDate || null,
    start_time: job.startTime || null,
    technician: job.technician || null,
    estimated_value: normalizeValue(job.value),
    approval_status: job.approvalStatus,
    payload: job,
    created_at: job.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function deletedJobToRemoteRow(record) {
  const job = ensureJobDefaults(record.job || {});
  return {
    id: record.id,
    organization_id: state.organizationId,
    job_id: job.id,
    customer_id: job.customerId,
    customer_name: job.name,
    deleted_by: usernameFromIdentity(record.deletedBy || accountDisplayName()),
    deleted_at: record.deletedAt || new Date().toISOString(),
    payload: {
      ...record,
      job
    }
  };
}

function customerToRemoteRow(customer) {
  const normalized = normalizeCustomerRecord(customer);
  return {
    id: normalized.id,
    organization_id: state.organizationId,
    name: normalized.name,
    phone: normalized.phone,
    email: normalized.email || null,
    address: normalized.address,
    last_job_id: normalized.lastJobId,
    last_job_status: normalized.lastJobStatus,
    last_job_at: normalized.lastJobAt || null,
    total_value: normalized.totalValue || 0,
    job_count: normalized.jobCount || 0,
    payload: normalized,
    created_at: normalized.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function pricebookToRemoteRow(item) {
  const normalized = normalizePricebookItem(item);
  return {
    id: normalized.id,
    organization_id: state.organizationId,
    name: normalized.name,
    category: normalized.category,
    unit: normalized.unit,
    unit_price: normalized.unitPrice,
    active: normalized.active,
    taxable: normalized.taxable,
    payload: normalized,
    created_at: normalized.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

async function loadRemoteData() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId) return;

  await loadRemoteCompanySettings();

  const [{ data: jobs, error: jobsError }, { data: customers, error: customersError }] = await Promise.all([
    client.from("jobs").select("*").eq("organization_id", state.organizationId).order("created_at", { ascending: false }),
    client.from("customers").select("*").eq("organization_id", state.organizationId).order("name", { ascending: true })
  ]);

  if (jobsError || customersError) {
    throw jobsError || customersError;
  }

  state.secureMode = true;
  state.databaseReady = true;
  state.jobs = (jobs || []).map((row) => ensureJobDefaults(row.payload || {}));
  await loadRemoteJobFiles();
  state.customers = (customers || []).map((row) => normalizeCustomerRecord(row.payload || {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    address: row.address,
    lastJobId: row.last_job_id,
    lastJobStatus: row.last_job_status,
    lastJobAt: row.last_job_at,
    totalValue: Number(row.total_value) || 0,
    jobCount: row.job_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));

  await loadRemoteDeletedJobs();
  await loadRemoteActivityEvents();
  await loadRemotePricebookItems();

  await loadRemoteTeamData();
}

async function loadRemoteJobFiles() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId || !state.jobs.length) return;
  try {
    const { data, error } = await client
      .from("job_files")
      .select("id, job_id, customer_id, file_name, file_type, file_size, storage_path, note, created_at")
      .eq("organization_id", state.organizationId)
      .order("created_at", { ascending: true });
    if (error) throw error;

    const filesByJob = new Map();
    await Promise.all((data || []).map(async (row) => {
      const existingJob = state.jobs.find((job) => job.id === row.job_id);
      if (!existingJob) return;
      const existing = (existingJob.files || []).find((file) => file.id === row.id || file.storagePath === row.storage_path) || {};
      let signedUrl = existing.url || "";
      try {
        if (row.storage_path) {
          const { data: signed, error: signedError } = await client.storage.from("job-files").createSignedUrl(row.storage_path, 60 * 60);
          if (!signedError) signedUrl = signed?.signedUrl || signedUrl;
        }
      } catch {
        // Keep the file listed even if a temporary storage issue prevents preview URL creation.
      }
      const file = {
        ...existing,
        id: row.id,
        name: row.file_name,
        type: row.file_type || existing.type || "",
        size: Number(row.file_size) || existing.size || 0,
        storagePath: row.storage_path,
        url: signedUrl,
        note: row.note || existing.note || "",
        source: existing.source || "secure storage",
        createdAt: row.created_at || existing.createdAt || new Date().toISOString()
      };
      if (!filesByJob.has(row.job_id)) filesByJob.set(row.job_id, []);
      filesByJob.get(row.job_id).push(file);
    }));

    state.jobs = state.jobs.map((job) => {
      const remoteFiles = filesByJob.get(job.id) || [];
      if (!remoteFiles.length) return job;
      const remoteKeys = new Set(remoteFiles.flatMap((file) => [file.id, file.storagePath]).filter(Boolean));
      const localOnlyFiles = (job.files || []).filter((file) => !remoteKeys.has(file.id) && !remoteKeys.has(file.storagePath));
      return ensureJobDefaults({
        ...job,
        files: [...remoteFiles, ...localOnlyFiles]
      });
    });
  } catch {
    // Older workspaces may not have supabase-schema-06-job-files.sql yet.
  }
}

async function loadRemoteCompanySettings() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId) return;
  const backup = loadSecureCompanySettingsBackup();
  const currentCompanySettings = state.companySettings;
  try {
    const { data, error } = await client
      .from("organizations")
      .select("name,payload")
      .eq("id", state.organizationId)
      .maybeSingle();
    if (error) throw error;
    const remoteSettings = data?.payload?.companySettings || data?.payload || {};
    const remoteCompanySettings = normalizeCompanySettings({
      ...remoteSettings,
      companyName: remoteSettings.companyName || data?.name || backup?.companySettings?.companyName || defaultCompanySettings.companyName
    });
    state.companySettings = newerCompanySettings(remoteCompanySettings, backup?.companySettings || null, currentCompanySettings);
    state.suppliers = Array.isArray(data?.payload?.suppliers) ? data.payload.suppliers.map(normalizeSupplierRecord) : (backup?.suppliers || []);
    saveSecureCompanySettingsBackup(state.companySettings, state.suppliers);
    if (companySettingsRevision(state.companySettings) > companySettingsRevision(remoteCompanySettings)) {
      try {
        await persistRemoteCompanySettings();
      } catch {
        // Keep the newer local settings backup until Supabase accepts the payload.
      }
    }
    return;
  } catch (error) {
    if (!String(error?.message || "").includes("payload")) {
      if (backup) {
        state.companySettings = backup.companySettings;
        state.suppliers = backup.suppliers;
      }
      return;
    }
  }

  try {
    const { data, error } = await client
      .from("organizations")
      .select("name")
      .eq("id", state.organizationId)
      .maybeSingle();
    if (error) throw error;
    state.companySettings = normalizeCompanySettings({
      ...(backup?.companySettings || {}),
      companyName: data?.name || backup?.companySettings?.companyName || defaultCompanySettings.companyName
    });
    state.suppliers = backup?.suppliers || [];
  } catch {
    state.companySettings = backup?.companySettings || normalizeCompanySettings({});
    state.suppliers = backup?.suppliers || [];
  }
}

async function loadRemotePricebookItems() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId) return;
  const backup = loadSecureCompanySettingsBackup();
  try {
    const { data, error } = await client
      .from("pricebook_items")
      .select("*")
      .eq("organization_id", state.organizationId)
      .order("category", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw error;
    state.pricebookItems = (data || []).map((row) => normalizePricebookItem(row.payload || {
      id: row.id,
      name: row.name,
      category: row.category,
      unit: row.unit,
      unitPrice: row.unit_price,
      active: row.active,
      taxable: row.taxable,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    saveSecureCompanySettingsBackup();
  } catch {
    state.pricebookItems = backup?.pricebookItems?.length ? backup.pricebookItems : state.pricebookItems.map(normalizePricebookItem);
  }
}

async function loadRemoteDeletedJobs() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId) return;
  const backup = loadSecureCompanySettingsBackup();

  try {
    const { data, error } = await client
      .from("deleted_jobs")
      .select("*")
      .eq("organization_id", state.organizationId)
      .order("deleted_at", { ascending: false });
    if (error) throw error;
    state.deletedJobs = (data || []).map((row) => row.payload || {
      id: row.id,
      deletedAt: row.deleted_at,
      deletedBy: usernameFromIdentity(row.deleted_by),
      job: {}
    });
    saveSecureCompanySettingsBackup();
  } catch {
    state.deletedJobs = backup?.deletedJobs?.length ? backup.deletedJobs : state.deletedJobs.map(ensureDeletedJobDefaults);
  }
}

async function loadRemoteActivityEvents() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId) return;
  const backup = loadSecureCompanySettingsBackup();

  try {
    const { data, error } = await client
      .from("activity_events")
      .select("*")
      .eq("organization_id", state.organizationId)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    state.activityEvents = (data || []).map((row) => row.payload || {
      id: row.id,
      type: row.activity_type || "updated",
      label: "Activity recorded",
      detail: "",
      job: { id: row.job_id || "" },
      changes: [],
      actor: { name: row.actor_name || "Backline user", role: "" },
      createdAt: row.created_at
    });
    saveSecureCompanySettingsBackup();
  } catch {
    state.activityEvents = backup?.activityEvents?.length ? backup.activityEvents : state.activityEvents;
  }
}

async function loadRemoteTeamData() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId) {
    state.teamMembers = [fallbackTeamMember()];
    state.teamInvites = [];
    return;
  }

  const membersQuery = async (withDisplayName = true) => client
    .from("organization_members")
    .select(withDisplayName ? "organization_id, user_id, email, display_name, role, created_at" : "organization_id, user_id, email, role, created_at")
    .eq("organization_id", state.organizationId)
    .order("created_at", { ascending: true });

  let [{ data: members, error: membersError }, { data: invites, error: invitesError }] = await Promise.all([
    membersQuery(true),
    client
      .from("team_invites")
      .select("id, organization_id, email, role, status, created_at, accepted_at, revoked_at")
      .eq("organization_id", state.organizationId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
  ]);

  if (membersError && String(membersError.message || "").includes("display_name")) {
    const fallback = await membersQuery(false);
    members = fallback.data;
    membersError = fallback.error;
  }

  if (membersError || invitesError) {
    state.teamMembers = [fallbackTeamMember()];
    state.teamInvites = [];
    return;
  }

  const currentEmail = String(state.currentUser?.email || "").toLowerCase();
  state.teamMembers = (members || []).map((member) => ({
    userId: member.user_id,
    email: member.email || (member.user_id === state.currentUser?.id ? state.currentUser.email : "member pending email"),
    displayName: member.display_name || "",
    role: member.role || "tech",
    createdAt: member.created_at,
    isCurrentUser: member.user_id === state.currentUser?.id || String(member.email || "").toLowerCase() === currentEmail
  }));
  if (!state.teamMembers.length) {
    state.teamMembers = [fallbackTeamMember()];
  }
  state.teamInvites = invites || [];
}

async function persistRemotePricebookItems() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId || !state.currentUser || !state.pricebookItems.length) return;
  try {
    const { error } = await client.from("pricebook_items").upsert(state.pricebookItems.map(pricebookToRemoteRow));
    if (error) throw error;
  } catch {
    // Pricebook sync is optional until schema 12 is installed.
  }
}

async function persistRemoteCompanySettings() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId || !state.currentUser) return;
  const company = companySettings();
  saveSecureCompanySettingsBackup(company, state.suppliers);
  try {
    const { error } = await client
      .from("organizations")
      .update({
        name: company.companyName,
        payload: { companySettings: company, suppliers: state.suppliers.map(normalizeSupplierRecord) }
      })
      .eq("id", state.organizationId);
    if (error) throw error;
    return;
  } catch (error) {
    if (!String(error?.message || "").includes("payload")) throw error;
  }

  try {
    await client
      .from("organizations")
      .update({ name: company.companyName })
      .eq("id", state.organizationId);
  } catch {
    throw new Error("Workspace settings saved on this device, but Supabase settings sync needs supabase-schema-13-company-settings.sql.");
  }
}

async function persistRemoteData() {
  const client = getSupabaseClient();
  if (!client || !state.organizationId || !state.currentUser) return;

  await persistRemoteCompanySettings();

  const writes = [];
  if (state.customers.length) {
    writes.push(client.from("customers").upsert(state.customers.map(customerToRemoteRow)));
  }
  if (state.jobs.length) {
    writes.push(client.from("jobs").upsert(state.jobs.map(jobToRemoteRow)));
  }
  if (writes.length) {
    const results = await Promise.all(writes);
    const error = results.find((result) => result.error)?.error;
    if (error) throw error;
  }

  if (state.deletedJobs.length) {
    try {
      const { error: deletedError } = await client.from("deleted_jobs").upsert(state.deletedJobs.map(deletedJobToRemoteRow));
      if (deletedError) throw deletedError;
    } catch {
      // Deleted-job audit sync is optional until schema 08 is installed.
    }
  }

  if (state.activityEvents.length) {
    try {
      const { error: activityError } = await client
        .from("activity_events")
        .upsert(state.activityEvents.map(activityToRemoteRow), { onConflict: "id", ignoreDuplicates: true });
      if (activityError) throw activityError;
    } catch {
      // Activity sync is optional until schema 11 is installed.
    }
  }

  await persistRemotePricebookItems();
}

async function refreshRemoteDataIfNeeded(options = {}) {
  if (!state.secureMode || !state.organizationId || !state.currentUser) return;
  if (document.body.classList.contains("approval-mode") || document.body.classList.contains("auth-mode")) return;
  if (hasOpenModalForm()) return;
  if (secureSavePromise) {
    try {
      await secureSavePromise;
    } catch {
      // The refresh below will surface whether the remote copy is available.
    }
  }
  const now = Date.now();
  if (!options.force && now - lastRemoteRefreshAt < 12000) return;
  lastRemoteRefreshAt = now;
  try {
    await loadRemoteData();
    render();
    elements.storageStatus.textContent = `Secure database synced ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  } catch (caughtError) {
    elements.storageStatus.textContent = "Secure database sync paused";
    notifySupabaseIssue(caughtError, {
      fallback: "Backline could not refresh the secure database."
    });
  }
}

async function deleteRemoteActiveJob(jobId) {
  const client = getSupabaseClient();
  if (!client || !state.organizationId || !state.currentUser) return;
  try {
    await client
      .from("jobs")
      .delete()
      .eq("organization_id", state.organizationId)
      .eq("id", jobId);
  } catch {
    // Local archive still keeps the deletion visible if remote cleanup fails.
  }
}

async function deleteRemoteArchivedJob(recordId) {
  const client = getSupabaseClient();
  if (!client || !state.organizationId || !state.currentUser) return;
  try {
    await client
      .from("deleted_jobs")
      .delete()
      .eq("organization_id", state.organizationId)
      .eq("id", recordId);
  } catch {
    // Deleted-job table is optional until schema 08 is installed.
  }
}

function openDatabase() {
  if (!("indexedDB" in window)) {
    return Promise.reject(new Error("IndexedDB is not available"));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(JOB_STORE)) {
        const jobs = db.createObjectStore(JOB_STORE, { keyPath: "id" });
        jobs.createIndex("customerId", "customerId", { unique: false });
        jobs.createIndex("status", "status", { unique: false });
        jobs.createIndex("scheduleDate", "scheduleDate", { unique: false });
      }
      if (!db.objectStoreNames.contains(CUSTOMER_STORE)) {
        const customers = db.createObjectStore(CUSTOMER_STORE, { keyPath: "id" });
        customers.createIndex("phone", "phone", { unique: false });
        customers.createIndex("name", "name", { unique: false });
      }
      if (!db.objectStoreNames.contains(DELETED_JOB_STORE)) {
        const deletedJobs = db.createObjectStore(DELETED_JOB_STORE, { keyPath: "id" });
        deletedJobs.createIndex("deletedAt", "deletedAt", { unique: false });
        deletedJobs.createIndex("jobId", "job.id", { unique: false });
      }
      if (!db.objectStoreNames.contains(ACTIVITY_STORE)) {
        const activity = db.createObjectStore(ACTIVITY_STORE, { keyPath: "id" });
        activity.createIndex("createdAt", "createdAt", { unique: false });
        activity.createIndex("type", "type", { unique: false });
        activity.createIndex("jobId", "job.id", { unique: false });
      }
      if (!db.objectStoreNames.contains(PRICEBOOK_STORE)) {
        const pricebook = db.createObjectStore(PRICEBOOK_STORE, { keyPath: "id" });
        pricebook.createIndex("category", "category", { unique: false });
        pricebook.createIndex("active", "active", { unique: false });
      }
      if (!db.objectStoreNames.contains(SUPPLIER_STORE)) {
        const suppliers = db.createObjectStore(SUPPLIER_STORE, { keyPath: "id" });
        suppliers.createIndex("name", "name", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function readStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

function replaceStore(db, storeName, records) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.clear();
    records.forEach((record) => store.put(record));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

function customerIdFromPhone(phone, fallbackId = "") {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits || String(phone || fallbackId || createId()).trim().toLowerCase();
}

function normalizeCustomerRecord(customer = {}) {
  const id = customer.id || customerIdFromPhone(customer.phone, customer.name);
  return {
    id,
    name: String(customer.name || "").trim(),
    phone: String(customer.phone || "").trim(),
    email: String(customer.email || "").trim(),
    address: String(customer.address || "").trim(),
    siteContact: String(customer.siteContact || customer.site_contact || "").trim(),
    customerType: String(customer.customerType || customer.customer_type || "residential").trim() || "residential",
    tags: Array.isArray(customer.tags)
      ? customer.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : String(customer.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
    accountFlag: String(customer.accountFlag || customer.account_flag || "").trim(),
    notes: String(customer.notes || "").trim(),
    preferredContact: String(customer.preferredContact || customer.preferred_contact || "").trim(),
    lastJobId: customer.lastJobId || customer.last_job_id || "",
    lastJobStatus: customer.lastJobStatus || customer.last_job_status || "",
    lastJobAt: customer.lastJobAt || customer.last_job_at || "",
    firstJobAt: customer.firstJobAt || customer.first_job_at || "",
    nextVisitAt: customer.nextVisitAt || customer.next_visit_at || "",
    unpaidBalance: normalizeValue(customer.unpaidBalance || customer.unpaid_balance),
    totalValue: normalizeValue(customer.totalValue || customer.total_value),
    jobCount: Math.max(0, Math.round(Number(customer.jobCount || customer.job_count || 0) || 0)),
    createdAt: customer.createdAt || customer.created_at || new Date().toISOString(),
    updatedAt: customer.updatedAt || customer.updated_at || new Date().toISOString()
  };
}

function customerFromJob(job) {
  const customerId = job.customerId || customerIdFromPhone(job.phone, job.id);
  job.customerId = customerId;
  return normalizeCustomerRecord({
    id: customerId,
    name: job.name,
    phone: job.phone,
    address: job.address,
    siteContact: job.siteContact || "",
    lastJobId: job.id,
    lastJobStatus: job.status,
    lastJobAt: job.createdAt,
    firstJobAt: job.createdAt,
    nextVisitAt: isScheduled(job) && job.scheduleDate >= todayISO() ? job.scheduleDate : "",
    unpaidBalance: ["invoiced", "completed"].includes(job.status) ? invoiceBalance(job) : job.status === "estimated" ? estimateAmount(job) : 0,
    totalValue: invoiceRecord(job).amount || estimateAmount(job),
    jobCount: 1,
    createdAt: job.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
}

function mergeCustomerRecords(calculated, stored = {}) {
  const base = normalizeCustomerRecord(calculated);
  const saved = normalizeCustomerRecord(stored);
  return normalizeCustomerRecord({
    ...saved,
    ...base,
    email: saved.email || base.email,
    customerType: saved.customerType || base.customerType,
    tags: saved.tags.length ? saved.tags : base.tags,
    accountFlag: saved.accountFlag || base.accountFlag,
    notes: saved.notes || base.notes,
    preferredContact: saved.preferredContact || base.preferredContact,
    createdAt: saved.createdAt || base.createdAt
  });
}

function buildCustomersFromJobs(jobs, storedCustomers = state.customers) {
  const customers = new Map();
  const stored = new Map((storedCustomers || []).map((customer) => {
    const normalized = normalizeCustomerRecord(customer);
    return [normalized.id, normalized];
  }));
  jobs.forEach((job) => {
    ensureJobDefaults(job);
    const next = customerFromJob(job);
    const existing = customers.get(next.id);
    if (!existing) {
      customers.set(next.id, next);
      return;
    }

    existing.name = next.name || existing.name;
    existing.phone = next.phone || existing.phone;
    existing.address = next.address || existing.address;
    existing.siteContact = next.siteContact || existing.siteContact;
    existing.lastJobId = next.lastJobId;
    existing.lastJobStatus = next.lastJobStatus;
    existing.lastJobAt = next.lastJobAt;
    existing.firstJobAt = [existing.firstJobAt, next.firstJobAt].filter(Boolean).sort()[0] || existing.firstJobAt;
    existing.nextVisitAt = [existing.nextVisitAt, next.nextVisitAt].filter(Boolean).sort()[0] || "";
    existing.unpaidBalance += next.unpaidBalance;
    existing.totalValue += next.totalValue;
    existing.jobCount += 1;
    existing.updatedAt = next.updatedAt;
  });
  return [...customers.values()]
    .map((customer) => mergeCustomerRecords(customer, stored.get(customer.id)))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function syncCustomersFromJobs() {
  state.customers = buildCustomersFromJobs(state.jobs);
}

async function loadDatabaseData() {
  if (state.secureMode) return;
  try {
    const db = await openDatabase();
    const [jobs, customers, deletedJobs, activityEvents, pricebookItems, suppliers] = await Promise.all([
      readStore(db, JOB_STORE),
      readStore(db, CUSTOMER_STORE),
      readStore(db, DELETED_JOB_STORE),
      readStore(db, ACTIVITY_STORE),
      readStore(db, PRICEBOOK_STORE),
      readStore(db, SUPPLIER_STORE)
    ]);
    state.databaseReady = true;
    state.deletedJobs = deletedJobs.length ? deletedJobs : loadDeletedJobs();
    state.activityEvents = activityEvents.length ? activityEvents : loadActivityEvents();
    state.pricebookItems = pricebookItems.length ? pricebookItems.map(normalizePricebookItem) : loadPricebookItems();
    state.suppliers = suppliers.length ? suppliers.map(normalizeSupplierRecord) : loadSuppliers();

    if (jobs.length > 0) {
      state.jobs = jobs.map(ensureJobDefaults);
      state.customers = customers.length ? customers.map(normalizeCustomerRecord) : buildCustomersFromJobs(state.jobs);
      syncCustomersFromJobs();
      await persistDatabase();
      return;
    }

    state.jobs = state.jobs.map(ensureJobDefaults);
    syncCustomersFromJobs();
    await persistDatabase();
  } catch {
    state.databaseReady = false;
    state.jobs = state.jobs.map(ensureJobDefaults);
    syncCustomersFromJobs();
    elements.storageStatus.textContent = "Browser database unavailable; using fallback storage";
  }
}

async function persistDatabase() {
  if (state.secureMode) return;
  try {
    const db = await openDatabase();
    await Promise.all([
      replaceStore(db, JOB_STORE, state.jobs),
      replaceStore(db, CUSTOMER_STORE, state.customers),
      replaceStore(db, DELETED_JOB_STORE, state.deletedJobs),
      replaceStore(db, ACTIVITY_STORE, state.activityEvents),
      replaceStore(db, PRICEBOOK_STORE, state.pricebookItems),
      replaceStore(db, SUPPLIER_STORE, state.suppliers)
    ]);
  } catch {
    elements.storageStatus.textContent = "Saved locally; database sync paused";
  }
}

function save() {
  state.jobs = state.jobs.map(ensureJobDefaults);
  state.pricebookItems = state.pricebookItems.map(normalizePricebookItem);
  state.suppliers = state.suppliers.map(normalizeSupplierRecord);
  state.companySettings = normalizeCompanySettings(state.companySettings);
  syncCustomersFromJobs();
  if (state.secureMode) {
    saveSecureCompanySettingsBackup(state.companySettings, state.suppliers);
    elements.storageStatus.textContent = `Saving secure database ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    const saveJob = (secureSavePromise || Promise.resolve())
      .catch(() => {})
      .then(() => persistRemoteData());
    secureSavePromise = saveJob;
    saveJob
      .then(() => {
        lastRemoteRefreshAt = Date.now();
        elements.storageStatus.textContent = `Secure database saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
      })
      .catch((caughtError) => {
        elements.storageStatus.textContent = "Secure database save failed";
        notifySupabaseIssue(caughtError, {
          fallback: "Backline could not save to the secure database."
        });
      })
      .finally(() => {
        if (secureSavePromise === saveJob) {
          secureSavePromise = null;
        }
      });
    return saveJob;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.jobs));
  localStorage.setItem(DELETED_JOBS_KEY, JSON.stringify(state.deletedJobs));
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(state.activityEvents));
  localStorage.setItem(PRICEBOOK_KEY, JSON.stringify(state.pricebookItems));
  localStorage.setItem(SUPPLIER_KEY, JSON.stringify(state.suppliers));
  localStorage.setItem(COMPANY_SETTINGS_KEY, JSON.stringify(state.companySettings));
  localStorage.setItem(AUTOMATION_KEY, JSON.stringify(state.automations));
  elements.storageStatus.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  persistDatabase();
  return Promise.resolve();
}

function applyTheme(preference) {
  document.documentElement.dataset.theme = preference === "dark" ? "dark" : "light";
  document.documentElement.dataset.themePreference = preference;
}

function setThemePreference(preference) {
  state.themePreference = preference;
  localStorage.setItem(THEME_KEY, preference);
  applyTheme(preference);
}

function panelExpanded(key, defaultOpen = false) {
  if (!key) return Boolean(defaultOpen);
  const saved = state.expandedPanels?.[key];
  return typeof saved === "boolean" ? saved : Boolean(defaultOpen);
}

function detailExpandedAttributes(key, defaultOpen = false) {
  const safeKey = String(key || "").trim();
  const isOpen = panelExpanded(safeKey, defaultOpen);
  return `${safeKey ? `data-expanded-key="${escapeHtml(safeKey)}"` : ""}${isOpen ? " open" : ""}`;
}

function closeSettingsMenu() {
  if (elements.settingsMenu.hidden) return;
  elements.settingsMenu.hidden = true;
  elements.settingsButton.setAttribute("aria-expanded", "false");
}

function toggleSettingsMenu() {
  const isOpen = !elements.settingsMenu.hidden;
  elements.settingsMenu.hidden = isOpen;
  elements.settingsButton.setAttribute("aria-expanded", String(!isOpen));
}

function companySettingsDraftFromForm(form = elements.companySettingsForm) {
  if (!form) return companySettings();
  const data = new FormData(form);
  return normalizeCompanySettings({
    ...companySettings(),
    companyName: data.get("companyName"),
    companySlogan: data.get("companySlogan"),
    legalName: data.get("legalName"),
    phone: data.get("phone"),
    email: data.get("email"),
    supportPhone: data.get("supportPhone"),
    supportEmail: data.get("supportEmail"),
    address: data.get("address"),
    serviceArea: data.get("serviceArea"),
    timeZone: data.get("timeZone") || companySettings().timeZone,
    invoiceTerms: data.get("invoiceTerms"),
    defaultDepositPercent: data.get("defaultDepositPercent"),
    reviewLink: data.get("reviewLink"),
    approvalDisclaimerText: data.get("approvalDisclaimerText"),
    pdfFooter: data.get("pdfFooter"),
    customerFooterText: data.get("customerFooterText"),
    receiptSupportLine: data.get("receiptSupportLine"),
    privacyUrl: data.get("privacyUrl"),
    termsUrl: data.get("termsUrl"),
    servicePolicyText: data.get("servicePolicyText")
  });
}

function workspaceSetupItems(settings = companySettings()) {
  const normalized = normalizeCompanySettings(settings);
  const hasTeamSetup = normalizedTeamMembers().filter((member) => !member.isCurrentUser).length > 0 || (state.teamInvites || []).length > 0;
  return [
    { label: "Shop name", complete: Boolean(normalized.companyName && normalized.companyName !== defaultCompanySettings.companyName) },
    { label: "Shop phone", complete: Boolean(phoneDigits(normalized.phone).length === 10) },
    { label: "Service area", complete: Boolean(normalized.serviceArea) },
    { label: "Time zone", complete: Boolean(normalized.timeZone) },
    { label: "Invoice terms", complete: Boolean(normalized.invoiceTerms) },
    { label: "Default deposit", complete: Number.isFinite(Number(normalized.defaultDepositPercent)) },
    { label: "Review link", complete: Boolean(normalized.reviewLink) },
    { label: "Support contact", complete: Boolean(normalized.supportPhone || normalized.phone) && Boolean(normalized.supportEmail || normalized.email) },
    { label: "Customer footer", complete: Boolean(normalized.customerFooterText || normalized.pdfFooter) },
    { label: "First team invite", complete: hasTeamSetup }
  ];
}

function renderWorkspaceSetupProgress(settings = companySettings()) {
  if (!elements.workspaceSetupProgress) return;
  const items = workspaceSetupItems(settings);
  const complete = items.filter((item) => item.complete).length;
  elements.workspaceSetupProgress.innerHTML = `
    <div class="setup-progress-header">
      <div>
        <h3>Setup progress</h3>
        <p>${escapeHtml(`${complete} of ${items.length} setup items complete`)}</p>
      </div>
      <span>${escapeHtml(`${Math.round((complete / items.length) * 100)}%`)}</span>
    </div>
    <div class="setup-progress-bar" aria-hidden="true">
      <span style="width: ${Math.round((complete / items.length) * 100)}%"></span>
    </div>
    <div class="setup-progress-list">
      ${items.map((item) => `
        <span class="${item.complete ? "complete" : ""}">
          <b>${item.complete ? "Done" : "Open"}</b>
          ${escapeHtml(item.label)}
        </span>
      `).join("")}
    </div>
  `;
}

function populateCompanySettingsForm() {
  const form = elements.companySettingsForm;
  if (!form) return;
  const settings = companySettings();
  if (elements.companyTimezonePicker) {
    elements.companyTimezonePicker.innerHTML = renderTimeZonePicker("company-time-zone", settings.timeZone);
  }
  if (elements.templateSettingsList) {
    elements.templateSettingsList.innerHTML = renderTemplateSettingsList(settings.templateSettings || {});
  }
  Object.entries(settings).forEach(([key, value]) => {
    if (form.elements[key]) {
      form.elements[key].value = value;
    }
  });
  renderWorkspaceSetupProgress(settings);
}

function renderTemplateSettingsList(settings = {}) {
  return templateDefinitionsForSettings(settings).map((template) => renderTemplateSettingsCard(template, settings)).join("");
}

function renderTemplateSettingsCard(template, settings = templateSettings()) {
  const merged = workspaceTemplate(template, settings);
  const checklist = merged.checklist || {};
  const tasks = merged.tasks.length ? merged.tasks : normalizedTemplateTasks(template.tasks, template);
  return `
    <article class="template-settings-card ${template.custom ? "custom-template" : ""}" data-template-settings-card="${escapeHtml(template.key)}" data-template-custom="${template.custom ? "true" : "false"}">
      <div class="template-settings-header">
        <label class="template-toggle">
          <input type="checkbox" name="template-${escapeHtml(template.key)}-enabled" ${merged.enabled ? "checked" : ""}>
          <span>
            <strong>${escapeHtml(merged.title)}</strong>
            <small>${escapeHtml(merged.trade)} ${template.custom ? "custom" : "default"} template</small>
          </span>
        </label>
        <div class="template-card-actions">
          <span>${escapeHtml(tasks.length)} task${tasks.length === 1 ? "" : "s"}</span>
          ${template.custom ? `<button class="invoice-remove-button" type="button" data-remove-template-card="${escapeHtml(template.key)}">Remove</button>` : ""}
        </div>
      </div>
      <div class="template-settings-body">
        <label>
          Template name
          <input name="template-${escapeHtml(template.key)}-title" value="${escapeHtml(merged.title)}">
        </label>
        <label>
          Trade
          ${backlineDropdown({
            id: `template-trade-${template.key}`,
            name: `template-${template.key}-trade`,
            value: merged.trade,
            options: templateTradeOptions(merged.trade),
            placeholder: "Trade",
            direction: "down"
          })}
        </label>
        <label>
          Job types
          <input name="template-${escapeHtml(template.key)}-jobTypes" value="${escapeHtml(templateJobTypeDisplay(merged.jobTypes))}" placeholder="diagnostic, repair">
        </label>
        <label class="wide">
          Description
          <input name="template-${escapeHtml(template.key)}-description" value="${escapeHtml(merged.description)}">
        </label>
        <label>
          Pricebook matches
          <input name="template-${escapeHtml(template.key)}-recommendations" value="${escapeHtml(templateRecommendationsFromValue(merged.recommendations).join(", "))}" placeholder="Diagnostic, capacitor, install">
        </label>
        <label>
          Diagnosis checklist
          <input name="template-${escapeHtml(template.key)}-checklist-diagnosis" value="${escapeHtml(checklist.diagnosis || "")}">
        </label>
        <label>
          Photos checklist
          <input name="template-${escapeHtml(template.key)}-checklist-photos" value="${escapeHtml(checklist.photos || "")}">
        </label>
        <label>
          Signature checklist
          <input name="template-${escapeHtml(template.key)}-checklist-signature" value="${escapeHtml(checklist.signature || "")}">
        </label>
      </div>
      <div class="template-task-editor">
        <div class="template-task-editor-header">
          <strong>Default tasks</strong>
          <button class="utility-button" type="button" data-add-template-task="${escapeHtml(template.key)}">Add task</button>
        </div>
        <div class="template-task-list" data-template-task-list="${escapeHtml(template.key)}">
          ${tasks.map((task, index) => renderTemplateSettingsTaskRow(template.key, task, index)).join("")}
        </div>
      </div>
    </article>
  `;
}

function renderTemplateSettingsTaskRow(templateKey, task = {}, index = 0) {
  const safeKey = `${templateKey}-${index}-${createId().slice(0, 6)}`;
  return `
    <div class="template-task-row" data-template-task="${escapeHtml(templateKey)}">
      <input name="template-${escapeHtml(templateKey)}-task-title" value="${escapeHtml(task.title || "")}" placeholder="Task title">
      ${backlineDropdown({
        id: `template-task-phase-${safeKey}`,
        name: `template-${templateKey}-task-phase`,
        value: templatePhaseDropdownValue(task.phase),
        options: ["Before job", "During job", "Closeout", "Office"],
        placeholder: "Phase"
      })}
      ${backlineDropdown({
        id: `template-task-role-${safeKey}`,
        name: `template-${templateKey}-task-role`,
        value: templateRoleDropdownValue(task.role),
        options: ["Technician", "Dispatcher", "Owner/Admin", "Any role"],
        placeholder: "Role"
      })}
      <button class="invoice-remove-button" type="button" data-remove-template-task>Remove</button>
    </div>
  `;
}

function templateSettingsFromForm(form) {
  const data = new FormData(form);
  const settings = {};
  const customTemplates = [];
  [...form.querySelectorAll("[data-template-settings-card]")].forEach((card) => {
    const templateKey = card.dataset.templateSettingsCard;
    const isCustom = card.dataset.templateCustom === "true";
    const tasks = [...(card?.querySelectorAll(`[data-template-task="${CSS.escape(templateKey)}"]`) || [])]
      .map((row) => ({
        title: row.querySelector(`[name="template-${templateKey}-task-title"]`)?.value || "",
        phase: templatePhaseValue(row.querySelector(`[name="template-${templateKey}-task-phase"]`)?.value || "field"),
        role: templateRoleValue(row.querySelector(`[name="template-${templateKey}-task-role"]`)?.value || "tech")
      }))
      .filter((task) => task.title.trim());
    const templatePayload = {
      key: templateKey,
      enabled: data.get(`template-${templateKey}-enabled`) === "on",
      title: data.get(`template-${templateKey}-title`),
      trade: data.get(`template-${templateKey}-trade`),
      jobTypes: templateJobTypes(data.get(`template-${templateKey}-jobTypes`)),
      description: data.get(`template-${templateKey}-description`),
      recommendations: templateRecommendationsFromValue(data.get(`template-${templateKey}-recommendations`)),
      checklist: {
        diagnosis: data.get(`template-${templateKey}-checklist-diagnosis`),
        photos: data.get(`template-${templateKey}-checklist-photos`),
        signature: data.get(`template-${templateKey}-checklist-signature`)
      },
      tasks
    };
    if (isCustom) {
      customTemplates.push(templatePayload);
    } else {
      settings[templateKey] = templatePayload;
    }
  });
  settings.customTemplates = customTemplates;
  return settings;
}

function companySettingsFromForm(form) {
  const data = new FormData(form);
  return markCompanySettingsChanged({
    ...companySettings(),
    companyName: data.get("companyName"),
    companySlogan: data.get("companySlogan"),
    legalName: data.get("legalName"),
    phone: formatPhoneNumber(data.get("phone")),
    email: data.get("email"),
    supportPhone: formatPhoneNumber(data.get("supportPhone")),
    supportEmail: data.get("supportEmail"),
    address: data.get("address"),
    serviceArea: data.get("serviceArea"),
    timeZone: data.get("timeZone"),
    invoiceTerms: data.get("invoiceTerms"),
    defaultTaxRate: data.get("defaultTaxRate"),
    defaultDepositPercent: data.get("defaultDepositPercent"),
    defaultLaborCostRate: data.get("defaultLaborCostRate"),
    targetMarginPercent: data.get("targetMarginPercent"),
    estimateExpirationDays: data.get("estimateExpirationDays"),
    estimateIntroText: data.get("estimateIntroText"),
    estimateWarrantyText: data.get("estimateWarrantyText"),
    estimateDisclaimer: data.get("estimateDisclaimer"),
    defaultDepositWording: data.get("defaultDepositWording"),
    approvalWording: data.get("approvalWording"),
    approvalDisclaimerText: data.get("approvalDisclaimerText"),
    pdfFooter: data.get("pdfFooter"),
    customerFooterText: data.get("customerFooterText"),
    receiptSupportLine: data.get("receiptSupportLine"),
    privacyUrl: data.get("privacyUrl"),
    termsUrl: data.get("termsUrl"),
    servicePolicyText: data.get("servicePolicyText"),
    reviewLink: data.get("reviewLink"),
    templateSettings: templateSettingsFromForm(form)
  });
}

function openCompanySettingsModal() {
  if (!can("exportData")) return;
  populateCompanySettingsForm();
  elements.companySettingsModal.showModal();
}

function exportMetadata() {
  return {
    app: "Backline",
    format: "backline-export",
    version: 2,
    exportedAt: new Date().toISOString(),
    secureMode: Boolean(state.secureMode),
    organizationId: state.secureMode ? state.organizationId : null,
    companyName: companySettings().companyName || "Backline",
    exportedBy: accountDisplayName()
  };
}

function sanitizeFileForExport(file = {}) {
  const exported = { ...file };
  if (exported.storagePath || exported.source === "secure storage") {
    delete exported.url;
  }
  return exported;
}

function sanitizeJobForExport(job = {}) {
  const exported = ensureJobDefaults(JSON.parse(JSON.stringify(job || {})));
  exported.files = (exported.files || []).map(sanitizeFileForExport);
  return exported;
}

function exportPayload() {
  return {
    meta: exportMetadata(),
    jobs: state.jobs.map(sanitizeJobForExport),
    deletedJobs: state.deletedJobs.map((record) => {
      const deleted = ensureDeletedJobDefaults(record);
      return {
        ...deleted,
        job: sanitizeJobForExport(deleted.job)
      };
    }),
    activityEvents: state.activityEvents,
    customers: state.customers.map(normalizeCustomerRecord),
    pricebookItems: state.pricebookItems.map(normalizePricebookItem),
    suppliers: state.suppliers.map(normalizeSupplierRecord),
    companySettings: normalizeCompanySettings(state.companySettings),
    automations: { ...state.automations },
    themePreference: state.themePreference
  };
}

function importPayloadData(data = {}) {
  return data?.meta?.format === "backline-export" ? data : { meta: null, ...data };
}

function requestImportConfirmation(message) {
  return new Promise((resolve) => {
    if (!elements.importConfirmModal || !elements.importConfirmForm) {
      resolve(false);
      return;
    }
    let settled = false;
    const settle = (value) => {
      if (settled) return;
      settled = true;
      elements.importConfirmForm.removeEventListener("submit", onSubmit);
      elements.importConfirmModal.removeEventListener("close", onClose);
      resolve(value);
    };
    const onSubmit = (event) => {
      event.preventDefault();
      elements.importConfirmModal.close("import");
    };
    const onClose = () => {
      settle(elements.importConfirmModal.returnValue === "import");
    };
    elements.importConfirmSummary.textContent = message;
    elements.importConfirmForm.addEventListener("submit", onSubmit);
    elements.importConfirmModal.addEventListener("close", onClose);
    elements.importConfirmModal.showModal();
  });
}

async function validateImportForWorkspace(payload = {}) {
  if (!state.secureMode || !state.organizationId) return true;
  const sourceOrg = payload.meta?.organizationId || null;
  if (sourceOrg && sourceOrg !== state.organizationId) {
    showToast("Import blocked", "This export belongs to a different Backline workspace.", "danger");
    return false;
  }
  if (!sourceOrg) {
    return requestImportConfirmation("This export does not identify a secure workspace. Import it into the current Backline workspace?");
  }
  return true;
}

function exportData() {
  const blob = new Blob([JSON.stringify(exportPayload(), null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "backline-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function testSecureConnection() {
  if (!isSupabaseConfigured()) {
    showToast("Secure database not configured", "Backline is using local browser storage on this device.", "warning", { timeout: 6500 });
    elements.storageStatus.textContent = "Local database mode";
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    showToast("Secure database unavailable", "Supabase is configured, but the browser client did not load.", "danger", { timeout: 7000 });
    elements.storageStatus.textContent = "Secure database unavailable";
    return;
  }

  const button = document.querySelector("#settingsConnectionButton");
  const previousText = button?.textContent || "Test secure connection";
  if (button) {
    button.disabled = true;
    button.textContent = "Checking...";
  }
  elements.storageStatus.textContent = "Testing secure database";

  try {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    const user = sessionData?.session?.user || null;
    if (!user) {
      showToast("Sign in required", "The secure database is reachable. Sign in to test workspace access.", "warning", { timeout: 7000 });
      elements.storageStatus.textContent = "Secure database reachable; sign in required";
      return;
    }

    const organizationId = state.organizationId || "";
    if (!organizationId) {
      showToast("Workspace not loaded", "The secure database is reachable, but this account is not attached to a workspace yet.", "warning", { timeout: 7000 });
      elements.storageStatus.textContent = "Secure database reachable; workspace needed";
      return;
    }

    const [{ error: memberError }, { error: jobError }] = await Promise.all([
      client
        .from("organization_members")
        .select("organization_id")
        .eq("organization_id", organizationId)
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle(),
      client
        .from("jobs")
        .select("id")
        .eq("organization_id", organizationId)
        .limit(1)
    ]);
    if (memberError) throw memberError;
    if (jobError) throw jobError;

    state.databaseReady = true;
    elements.storageStatus.textContent = `Secure database checked ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
    showToast("Secure database connected", "Auth, workspace access, and job records are reachable.", "success", { timeout: 6500 });
  } catch (caughtError) {
    elements.storageStatus.textContent = "Secure database check failed";
    notifySupabaseIssue(caughtError, {
      title: "Connection check failed",
      fallback: "Backline could not complete the secure database check.",
      always: true,
      timeout: 9000
    });
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = previousText;
    }
  }
}

function setTeamStatus(message, toast = null) {
  state.teamNotice = message;
  if (elements.teamInviteStatus) {
    elements.teamInviteStatus.textContent = "";
    elements.teamInviteStatus.hidden = true;
  }
  if (toast) {
    showToast(toast.title || "Team update", message, toast.type || "info", toast.options || {});
  }
}

async function edgeFunctionErrorMessage(error, data = null, fallback = "The request could not be completed.") {
  if (data?.error) return String(data.error);
  if (isSupabaseNetworkError(error)) {
    return friendlySupabaseError(error, fallback);
  }
  const context = error?.context;
  if (context && (typeof context.json === "function" || typeof context.text === "function")) {
    const response = typeof context.clone === "function" ? context.clone() : context;
    try {
      if (typeof response.json === "function") {
        const payload = await response.json();
        if (payload?.error) return String(payload.error);
        if (payload?.message) return String(payload.message);
      }
    } catch {
      try {
        const text = typeof response.text === "function" ? await response.text() : "";
        if (text) return text;
      } catch {
        // Fall back to Supabase's wrapper error below.
      }
    }
  }
  return String(error?.message || fallback);
}

function teamRoleConstraintMessage(error) {
  const message = String(error?.message || "");
  if (!/organization_members_role_check|team_invites_role_check|violates check constraint/i.test(message)) {
    return "";
  }
  return "Custom role is saved, but Supabase still has the old role constraint. Run supabase-schema-15-custom-roles.sql in the Supabase SQL editor, then try again.";
}

async function refreshTeamData() {
  await loadRemoteTeamData();
  render();
}

function requireTeamManagement(action = "manage team settings") {
  if (can("manageTeam")) return true;
  setTeamStatus("This account can view the team directory but cannot change roles, invites, or permissions.", {
    title: "Permission needed",
    type: "warning",
    options: { timeout: 6500 }
  });
  renderTeam();
  return false;
}

async function createTeamInvite(formData) {
  if (!requireTeamManagement("create team invite")) return;
  if (!state.secureMode || !state.organizationId || !state.currentUser) {
    setTeamStatus("Turn on secure database mode before inviting team members.", { title: "Invite blocked", type: "warning" });
    return;
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const role = String(formData.get("role") || "tech");
  if (!email || !roleDefinition(role) || role === "owner") {
    setTeamStatus("Enter an email and choose a valid role.", { title: "Invite needs details", type: "warning" });
    return;
  }

  if (normalizedTeamMembers().some((member) => String(member.email || "").toLowerCase() === email)) {
    setTeamStatus(`${usernameFromIdentity(email)} is already on this team.`, { title: "Already on team", type: "warning" });
    return;
  }

  const client = getSupabaseClient();
  const { error } = await client.from("team_invites").insert({
    organization_id: state.organizationId,
    email,
    role,
    invited_by: state.currentUser.id
  });

  if (error) {
    setTeamStatus(teamRoleConstraintMessage(error) || error.message || "Invite could not be created.", { title: "Invite failed", type: "danger" });
    return;
  }

  elements.teamInviteForm.reset();
  setTeamStatus(`Invite saved for ${usernameFromIdentity(email)}. Use Send email or Copy instructions, then have them create/sign in with that exact email.`, { title: "Invite saved", type: "success" });
  recordActivity({
    type: "updated",
    label: "Team invite created",
    detail: `${usernameFromIdentity(email)} invited as ${roleName(role)}`
  });
  save();
  await refreshTeamData();
}

async function updateTeamMemberRole(userId, role) {
  if (!requireTeamManagement("update team role") || !state.secureMode || !state.organizationId) return;
  if (!roleDefinition(role) || role === "owner") {
    setTeamStatus("Owner role cannot be assigned here.", { title: "Role blocked", type: "warning" });
    renderTeam();
    return;
  }
  const member = normalizedTeamMembers().find((item) => item.userId === userId);
  if (!member || member.role === "owner") return;

  const client = getSupabaseClient();
  const { error } = await client
    .from("organization_members")
    .update({ role })
    .eq("organization_id", state.organizationId)
    .eq("user_id", userId);

  if (error) {
    setTeamStatus(teamRoleConstraintMessage(error) || error.message || "Role update failed.", { title: "Role update failed", type: "danger" });
    renderTeam();
    return;
  }

  const memberLabel = teamMemberDisplayLabel(member);
  setTeamStatus(`${memberLabel} is now ${roleName(role)}.`, { title: "Role updated", type: "success" });
  recordActivity({
    type: "updated",
    label: "Team role changed",
    detail: `${memberLabel} changed from ${roleName(member.role)} to ${roleName(role)} by ${displayPersonName(accountDisplayName())}`,
    changes: [{
      field: "roleAssignment",
      label: "Assigned role",
      before: roleName(member.role),
      after: roleName(role)
    }]
  });
  save();
  await refreshTeamData();
}

function setCustomRoleStatus(message) {
  if (elements.customRoleStatus) {
    elements.customRoleStatus.textContent = message;
  }
}

function customRoleFormKeys({ expand = true } = {}) {
  const keys = [...(elements.customRolePermissions?.querySelectorAll('[name="permissionKeys"]:checked') || [])]
    .filter((input) => expand || input.dataset.autoIncluded !== "true")
    .map((input) => input.value);
  return expand ? [...expandedRolePermissionKeys(keys)] : keys;
}

function editableRoleRecord(slug) {
  if (["admin", "dispatcher", "tech"].includes(slug)) {
    return {
      slug,
      builtIn: true,
      label: roleName(slug),
      template: slug,
      summary: roleSummary(slug),
      permissions: roleDefinition(slug)
    };
  }
  const custom = companySettings().customRoles.find((role) => role.slug === slug);
  return custom ? { ...custom, builtIn: false } : null;
}

function renderCustomRolePermissions(template = "tech", selectedKeys = null, editingRole = null) {
  if (!elements.customRolePermissions) return;
  const baseTemplate = roleTemplateBase(template);
  const permissionSet = roleDefinition(baseTemplate) || rolePermissions.tech;
  const sourceKeys = selectedKeys || customRoleTemplateKeys(template);
  const source = new Set(sourceKeys);
  const selected = expandedRolePermissionKeys(sourceKeys);
  const catalog = permissionCatalogByKey();
  elements.customRolePermissions.innerHTML = rolePermissionGroups
    .map((group) => {
      const toggles = group.keys
        .map((key) => catalog[key])
        .filter((permission) => canRoleEditPermission(editingRole, permission))
        .map((permission) => `
          <label class="permission-toggle ${selected.has(permission.key) && !source.has(permission.key) ? "auto-included" : ""}">
            <input type="checkbox" name="permissionKeys" value="${escapeHtml(permission.key)}" ${selected.has(permission.key) ? "checked" : ""} ${selected.has(permission.key) && !source.has(permission.key) ? 'data-auto-included="true"' : ""}>
            <span>${escapeHtml(permissionCatalogLabel(permission))}</span>
          </label>
        `)
        .join("");
      return `
        <section class="permission-group">
          <div class="permission-group-header">
            <strong>${escapeHtml(group.title)}</strong>
            <span>${escapeHtml(group.description)}</span>
          </div>
          <div class="permission-group-grid">${toggles}</div>
        </section>
      `;
    })
    .join("");
  renderCustomRolePermissionSummary(sourceKeys);
  renderCustomRoleDependencyNote(sourceKeys);
  renderCustomRoleLivePreview();
}

function renderCustomRolePermissionSummary(keys = customRoleFormKeys({ expand: false })) {
  if (!elements.customRolePermissionSummary) return;
  const expanded = expandedRolePermissionKeys(keys);
  const catalog = permissionCatalogByKey();
  const included = rolePermissionDependencyDetails(keys);
  const canManageRoles = expanded.has("manageTeam");
  const chips = (items, emptyText) => items.length
    ? items.map((item) => `<span>${escapeHtml(permissionCatalogLabel(item))}</span>`).join("")
    : `<em>${escapeHtml(emptyText)}</em>`;

  elements.customRolePermissionSummary.innerHTML = `
    ${included.length ? `
      <div class="permission-summary-row included">
        <strong>Included</strong>
        <div>${chips(included, "No included access")}</div>
      </div>
    ` : ""}
    ${canManageRoles ? `
      <div class="permission-summary-alert">
        This role can invite team members, change roles, and edit permissions. Assign it only to trusted managers.
      </div>
    ` : ""}
    ${!included.length && !canManageRoles ? `
      <div class="permission-summary-row">
        <strong>Preview</strong>
        <div><em>Changes update the role preview above instantly.</em></div>
      </div>
    ` : ""}
  `;
  renderCustomRoleLivePreview();
}

function renderCustomRoleLivePreview() {
  if (!elements.customRolePreview) return;
  const draft = customRoleDraftFromForm();
  const allowedViews = rolePermissionCatalog
    .filter((permission) => permission.type === "view" && (draft.permissions.views || []).includes(permission.value))
    .map(permissionCatalogLabel);
  const jobActions = rolePermissionCatalog
    .filter((permission) => permission.type === "action" && (draft.permissions.actions || []).includes(permission.value))
    .map(permissionCatalogLabel);
  const flags = [
    draft.permissions.createJob ? "Can create new jobs" : "Cannot create new jobs",
    draft.permissions.uploadFiles ? "Can upload job files and photos" : "Cannot upload files",
    draft.permissions.exportData ? "Can use workspace export/settings utilities" : "No export access",
    draft.permissions.manageTeam ? "Can manage team and roles" : "Cannot manage team or roles"
  ];
  elements.customRolePreview.innerHTML = `
    <div class="role-editor-preview-header">
      <div>
        <span>Role preview</span>
        <strong>${escapeHtml(draft.label)}</strong>
      </div>
      <b>${escapeHtml(draft.summary || "Draft permissions")}</b>
    </div>
    <div class="role-editor-preview-grid">
      <section>
        <h4>This role will see</h4>
        <div>${rolePermissionChipMarkup(allowedViews.map((label) => ({ label })), "No tabs")}</div>
      </section>
      <section>
        <h4>This role can do</h4>
        <div>${rolePermissionChipMarkup(jobActions.map((label) => ({ label })), "No job actions")}</div>
      </section>
      <section class="wide">
        <h4>Before assigning</h4>
        <ul>
          ${flags.map((flag) => `<li>${escapeHtml(flag)}</li>`).join("")}
        </ul>
      </section>
    </div>
  `;
}

function applyCustomRoleTemplate(value) {
  if (!elements.customRoleForm) return;
  const preset = customRolePreset(value);
  const editingRole = state.editingCustomRoleSlug ? editableRoleRecord(state.editingCustomRoleSlug) : null;
  if (preset && !editingRole) {
    elements.customRoleForm.elements.label.value = preset.label;
    elements.customRoleForm.elements.summary.value = preset.summary;
  }
  renderCustomRolePermissions(value, preset ? preset.permissionKeys : null, editingRole);
  renderCustomRoleLivePreview();
}

function renderCustomRoleDependencyNote(keys = customRoleFormKeys({ expand: false })) {
  const details = rolePermissionDependencyDetails(keys);
  if (!details.length) {
    dismissToast("role-included-access");
    return;
  }
  showToast(
    "Included access",
    details.map((detail) => `${detail.label}${detail.requiredBy.length ? ` for ${detail.requiredBy.join(", ")}` : ""}`).join(" - "),
    "info",
    {
      id: "role-included-access",
      persistent: true,
      timeout: 0
    }
  );
}

function syncCustomRolePermissionDependencies() {
  const rawKeys = customRoleFormKeys({ expand: false });
  const expanded = expandedRolePermissionKeys(rawKeys);
  const raw = new Set(rawKeys);
  elements.customRolePermissions?.querySelectorAll('[name="permissionKeys"]').forEach((input) => {
    input.checked = expanded.has(input.value);
    input.dataset.autoIncluded = expanded.has(input.value) && !raw.has(input.value) ? "true" : "";
    input.closest(".permission-toggle")?.classList.toggle("auto-included", input.dataset.autoIncluded === "true");
  });
  renderCustomRolePermissionSummary(rawKeys);
  renderCustomRoleDependencyNote(rawKeys);
}

function renderCustomRoleForm() {
  if (!elements.customRoleForm) return;
  const canManage = can("manageTeam");
  const editingRole = state.editingCustomRoleSlug ? editableRoleRecord(state.editingCustomRoleSlug) : null;
  const currentTemplateValue = elements.customRoleForm.elements.template?.value || "preset:office-manager";
  if (elements.customRoleForm.dataset.editingSlug !== (editingRole?.slug || "")) {
    if (editingRole) {
      elements.customRoleForm.elements.label.value = editingRole.label || "";
      renderCustomRoleTemplatePicker(editingRole.template || "tech", Boolean(editingRole.builtIn) || !canManage);
      elements.customRoleForm.elements.summary.value = editingRole.summary || "";
      renderCustomRolePermissions(editingRole.template || "tech", rolePermissionKeys(editingRole.permissions), editingRole);
      elements.customRoleForm.dataset.editingSlug = editingRole.slug;
    } else {
      elements.customRoleForm.dataset.editingSlug = "";
      renderCustomRoleTemplatePicker(currentTemplateValue, !canManage);
      if (!elements.customRolePermissions.children.length) {
        renderCustomRolePermissions(elements.customRoleForm.elements.template?.value || "tech");
      }
    }
  } else {
    renderCustomRoleTemplatePicker(elements.customRoleForm.elements.template?.value || editingRole?.template || currentTemplateValue, Boolean(editingRole?.builtIn) || !canManage);
  }
  if (elements.customRoleFormTitle) {
    elements.customRoleFormTitle.textContent = editingRole ? `Edit ${editingRole.label}` : "Create custom role";
  }
  if (elements.customRoleFormSubtitle) {
    elements.customRoleFormSubtitle.textContent = editingRole
      ? editingRole.builtIn
        ? "Customize this built-in role for this workspace. Assigned team members keep the same role."
        : "Update this role's label, description, and permissions. Assigned team members keep this role."
      : "Start from a built-in role, then choose exactly what this role can see and do.";
  }
  if (elements.customRoleSubmit) {
    elements.customRoleSubmit.textContent = editingRole ? "Save role" : "Add custom role";
  }
  if (elements.cancelCustomRoleEdit) {
    elements.cancelCustomRoleEdit.hidden = false;
  }
  elements.customRoleForm.querySelectorAll("input, button").forEach((field) => {
    if (field.closest(".modal-header")) return;
    if (field.name === "template" && editingRole?.builtIn) {
      field.disabled = true;
      return;
    }
    field.disabled = !canManage;
  });
  elements.customRoleTemplatePicker?.querySelector("button")?.toggleAttribute("disabled", Boolean(editingRole?.builtIn) || !canManage);
  if (elements.customRoleStatus && !elements.customRoleStatus.textContent) {
    elements.customRoleStatus.textContent = canManage
      ? "Custom roles are saved with this workspace."
      : "Only owners and admins can create custom roles.";
  }
}

function openCustomRoleEditor(slug = "") {
  if (!requireTeamManagement(slug ? "edit custom role" : "create custom role")) return;
  state.editingCustomRoleSlug = slug;
  if (!slug) {
    elements.customRoleForm?.reset();
    if (elements.customRoleForm) {
      elements.customRoleForm.dataset.editingSlug = "";
    }
    applyCustomRoleTemplate(elements.customRoleForm?.elements.template?.value || "preset:office-manager");
    setCustomRoleStatus("Create a custom role for this workspace.");
  }
  renderCustomRoleForm();
  try {
    elements.customRoleModal?.showModal();
  } catch {
    elements.customRoleModal?.setAttribute("open", "");
  }
}

function closeCustomRoleEditor() {
  try {
    elements.customRoleModal?.close("cancel");
  } catch {
    elements.customRoleModal?.removeAttribute("open");
  }
}

function customRoleFromForm(form, excludedSlug = "") {
  const data = new FormData(form);
  const label = String(data.get("label") || "").trim();
  const template = roleTemplateBase(String(data.get("template") || "tech"));
  const existing = new Set(companySettings().customRoles.filter((role) => role.slug !== excludedSlug).map((role) => role.slug));
  return normalizeCustomRole({
    label,
    template,
    summary: data.get("summary"),
    permissionKeys: customRoleFormKeys()
  }, existing);
}

async function saveRoleSettingsChange() {
  try {
    await save();
    return true;
  } catch {
    setCustomRoleStatus("Role changed locally, but Supabase did not confirm the save. Try again before refreshing.");
    return false;
  }
}

async function createCustomRole(form) {
  if (!requireTeamManagement("create custom role")) return;
  const role = customRoleFromForm(form);
  if (!role) {
    setCustomRoleStatus("Enter a unique role name that does not match a built-in role.");
    return;
  }
  const settings = companySettings();
  settings.customRoles = [...settings.customRoles, role];
  state.companySettings = markCompanySettingsChanged(settings);
  setCustomRoleStatus(`${role.label} role added.`);
  showToast("Role created", `${role.label} is now available for team members.`, "success");
  recordActivity({
    type: "updated",
    label: "Custom role created",
    detail: `${role.label} created from ${roleName(role.template)} by ${accountDisplayName()}`,
    changes: roleAuditChanges(null, role)
  });
  form.reset();
  form.dataset.editingSlug = "";
  state.editingCustomRoleSlug = null;
  renderCustomRolePermissions("tech");
  await saveRoleSettingsChange();
  closeCustomRoleEditor();
  render();
}

async function updateCustomRole(form, slug) {
  if (!requireTeamManagement("update custom role")) return;
  if (["admin", "dispatcher", "tech"].includes(slug)) {
    const data = new FormData(form);
    const settings = companySettings();
    const beforeRole = editableRoleRecord(slug);
    const permissions = enforceBuiltInRolePermissionLimits(slug, rolePermissionFromKeys(customRoleFormKeys(), slug));
    const afterRole = {
      slug,
      builtIn: true,
      label: String(data.get("label") || roleName(slug)).trim() || roleName(slug),
      template: slug,
      summary: String(data.get("summary") || "").trim(),
      permissions
    };
    settings.roleOverrides = {
      ...(settings.roleOverrides || {}),
      [slug]: {
        label: afterRole.label,
        summary: afterRole.summary,
        permissions
      }
    };
    state.companySettings = markCompanySettingsChanged(settings);
    state.editingCustomRoleSlug = null;
    setCustomRoleStatus(`${roleName(slug)} role updated.`);
    showToast("Role updated", `${afterRole.label} permissions were saved.`, "success");
    recordActivity({
      type: "updated",
      label: "Built-in role updated",
      detail: `${afterRole.label} permissions customized by ${accountDisplayName()}`,
      changes: roleAuditChanges(beforeRole, afterRole)
    });
    form.reset();
    form.dataset.editingSlug = "";
    renderCustomRolePermissions("tech");
    await saveRoleSettingsChange();
    closeCustomRoleEditor();
    render();
    return;
  }
  const settings = companySettings();
  const index = settings.customRoles.findIndex((role) => role.slug === slug);
  if (index === -1) {
    state.editingCustomRoleSlug = null;
    setCustomRoleStatus("That role no longer exists.");
    render();
    return;
  }
  const current = settings.customRoles[index];
  const nextRole = customRoleFromForm(form, slug);
  if (!nextRole) {
    setCustomRoleStatus("Enter a unique role name that does not match another role.");
    return;
  }
  nextRole.slug = current.slug;
  settings.customRoles = settings.customRoles.map((role) => role.slug === slug ? nextRole : role);
  state.companySettings = markCompanySettingsChanged(settings);
  state.editingCustomRoleSlug = null;
  setCustomRoleStatus(`${nextRole.label} role updated.`);
  showToast("Role updated", `${nextRole.label} permissions were saved.`, "success");
  recordActivity({
    type: "updated",
    label: "Custom role updated",
    detail: `${nextRole.label} permissions updated by ${accountDisplayName()}`,
    changes: roleAuditChanges(current, nextRole)
  });
  form.reset();
  form.dataset.editingSlug = "";
  renderCustomRolePermissions("tech");
  await saveRoleSettingsChange();
  closeCustomRoleEditor();
  render();
}

async function saveCustomRole(form) {
  if (!requireTeamManagement("save custom role")) return;
  if (state.editingCustomRoleSlug) {
    await updateCustomRole(form, state.editingCustomRoleSlug);
    return;
  }
  await createCustomRole(form);
}

function editCustomRole(slug) {
  if (!requireTeamManagement("edit custom role")) return;
  const role = editableRoleRecord(slug);
  if (!role) return;
  setCustomRoleStatus(`Editing ${role.label}.`);
  openCustomRoleEditor(slug);
}

function cancelCustomRoleEdit() {
  state.editingCustomRoleSlug = null;
  elements.customRoleForm?.reset();
  if (elements.customRoleForm) {
    elements.customRoleForm.dataset.editingSlug = "";
  }
  renderCustomRolePermissions("tech");
  setCustomRoleStatus("Custom role edit canceled.");
  closeCustomRoleEditor();
  render();
}

async function removeCustomRole(slug) {
  if (!requireTeamManagement("remove custom role")) return;
  const settings = companySettings();
  const role = settings.customRoles.find((item) => item.slug === slug);
  if (!role) return;
  if (normalizedTeamMembers().some((member) => member.role === slug)) {
    setCustomRoleStatus(`${role.label} is assigned to a team member. Change their role before removing it.`);
    return;
  }
  settings.customRoles = settings.customRoles.filter((item) => item.slug !== slug);
  state.companySettings = markCompanySettingsChanged(settings);
  if (state.editingCustomRoleSlug === slug) {
    state.editingCustomRoleSlug = null;
  }
  setCustomRoleStatus(`${role.label} role removed.`);
  showToast("Role removed", `${role.label} was removed from workspace roles.`, "success");
  recordActivity({
    type: "updated",
    label: "Custom role removed",
    detail: `${role.label} removed from workspace roles by ${accountDisplayName()}`,
    changes: roleAuditChanges(role, null)
  });
  await saveRoleSettingsChange();
  render();
}

async function removeTeamMember(userId) {
  if (!requireTeamManagement("remove team member") || !state.secureMode || !state.organizationId) return;
  const member = normalizedTeamMembers().find((item) => item.userId === userId);
  if (!member || member.isCurrentUser || member.role === "owner") return;
  elements.teamRemoveForm.dataset.userId = userId;
  elements.teamRemoveModalSummary.textContent = `${teamMemberDisplayName(member)} will no longer be able to open this shop workspace.`;
  elements.teamRemoveModal.showModal();
}

async function confirmRemoveTeamMember(userId) {
  if (!requireTeamManagement("remove team member") || !state.secureMode || !state.organizationId) return;
  const member = normalizedTeamMembers().find((item) => item.userId === userId);
  if (!member || member.isCurrentUser || member.role === "owner") return;

  const client = getSupabaseClient();
  const { error } = await client
    .from("organization_members")
    .delete()
    .eq("organization_id", state.organizationId)
    .eq("user_id", userId);

  if (error) {
    setTeamStatus(error.message || "Could not remove member.", { title: "Remove failed", type: "danger" });
    return;
  }

  setTeamStatus(`${teamMemberDisplayName(member)} was removed from the team.`, { title: "Member removed", type: "success" });
  recordActivity({
    type: "updated",
    label: "Team member removed",
    detail: `${teamMemberDisplayName(member)} removed from workspace`
  });
  save();
  await refreshTeamData();
}

async function revokeTeamInvite(inviteId) {
  if (!requireTeamManagement("revoke team invite") || !state.secureMode || !state.organizationId) return;
  const invite = state.teamInvites.find((item) => item.id === inviteId);
  if (!invite) return;

  const client = getSupabaseClient();
  const { error } = await client
    .from("team_invites")
    .update({ status: "revoked", revoked_at: new Date().toISOString() })
    .eq("id", inviteId)
    .eq("organization_id", state.organizationId);

  if (error) {
    setTeamStatus(error.message || "Could not revoke invite.", { title: "Revoke failed", type: "danger" });
    return;
  }

  setTeamStatus(`Invite for ${usernameFromIdentity(invite.email)} was revoked.`, { title: "Invite revoked", type: "success" });
  recordActivity({
    type: "updated",
    label: "Team invite revoked",
    detail: `${usernameFromIdentity(invite.email)} invite revoked`
  });
  save();
  await refreshTeamData();
}

function appEntryUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

function warnIfUnsafeProductionCustomerLink(label = "customer-facing link") {
  if (deploymentEnvironment() !== "production" || !isLocalOrigin()) return;
  const now = Date.now();
  if (now - (state.lastProductionLinkWarningAt || 0) < 12000) return;
  state.lastProductionLinkWarningAt = now;
  showToast(
    "Production link warning",
    `${label} was generated from a local address. Use the hosted HTTPS Backline URL before sending it to a customer.`,
    "warning",
    { id: "production-link-warning", timeout: 9000 }
  );
}

function teamInviteMessage(invite) {
  return [
    "You've been invited to join Backline.",
    "",
    `Role: ${roleName(invite.role)}`,
    `Email to use: ${invite.email}`,
    "",
    `Open Backline here: ${appEntryUrl()}`,
    "Create an account or sign in with this same email, and Backline will connect you to the shop automatically."
  ].join("\n");
}

async function sendTeamInviteEmail(inviteId) {
  if (!requireTeamManagement("send team invite") || !state.secureMode || !state.organizationId) return;
  const invite = state.teamInvites.find((item) => item.id === inviteId);
  if (!invite) return;
  const client = getSupabaseClient();
  if (!client?.functions?.invoke) {
    setTeamStatus("Invite email needs Supabase Edge Functions. Use Copy instructions for now.", { title: "Email not configured", type: "warning" });
    return;
  }

  setTeamStatus(`Sending invite email to ${usernameFromIdentity(invite.email)}...`);
  let data = null;
  let error = null;
  try {
    const result = await client.functions.invoke("send-team-invite", {
      body: {
        inviteId: invite.id,
        appUrl: appEntryUrl()
      }
    });
    data = result.data;
    error = result.error;
  } catch (caughtError) {
    error = caughtError;
  }

  if (error || data?.error) {
    const message = await edgeFunctionErrorMessage(error, data, "Invite email could not be sent.");
    setTeamStatus(`${message} Use Copy instructions if you need to invite them now.`, { title: "Invite email failed", type: "danger", options: { timeout: 7000 } });
    return;
  }

  setTeamStatus(`Invite email sent to ${usernameFromIdentity(invite.email)}.`, { title: "Invite email sent", type: "success" });
  recordActivity({
    type: "updated",
    label: "Team invite emailed",
    detail: `${usernameFromIdentity(invite.email)} invite email sent`
  });
  save();
}

async function copyTeamInvite(inviteId) {
  if (!requireTeamManagement("copy team invite")) return;
  const invite = state.teamInvites.find((item) => item.id === inviteId);
  if (!invite) return;
  const message = teamInviteMessage(invite);
  try {
    await navigator.clipboard.writeText(message);
    setTeamStatus(`Invite instructions copied for ${usernameFromIdentity(invite.email)}. Paste them into an email or text message.`, { title: "Invite copied", type: "success" });
  } catch {
    setTeamStatus(`Copy failed. Send them this Backline URL and tell them to sign up with ${invite.email}: ${appEntryUrl()}`, { title: "Copy failed", type: "warning", options: { timeout: 7000 } });
  }
}

function approvalUrlFromToken(token) {
  warnIfUnsafeProductionCustomerLink("Approval link");
  return `${window.location.origin}${window.location.pathname}#approval-token=${encodeURIComponent(token)}`;
}

function approvalUrl(job) {
  warnIfUnsafeProductionCustomerLink("Local approval preview link");
  return `${window.location.origin}${window.location.pathname}#approve=${encodeURIComponent(job.id)}`;
}

function secureApprovalUrlForJob(job = {}) {
  const approvalMessage = [...(job.messages || [])]
    .map(normalizeJobMessage)
    .reverse()
    .find((message) => /#approval-token=/i.test(message.body || ""));
  const match = String(approvalMessage?.body || "").match(/https?:\/\/\S*#approval-token=[A-Za-z0-9_-]+|#approval-token=[A-Za-z0-9_-]+/i);
  return match?.[0] || "";
}

function customerPortalUrl(job) {
  const token = typeof job === "string" ? job : ensureJobPortalToken(job);
  warnIfUnsafeProductionCustomerLink("Customer portal link");
  return `${window.location.origin}${window.location.pathname}#portal=${encodeURIComponent(token || "")}`;
}

function isPortalToken(value) {
  return /^portal-[0-9a-f-]{12,}$/i.test(String(value || ""));
}

async function createApprovalLink(job) {
  if (!state.secureMode || !state.organizationId || !state.currentUser) {
    return approvalUrl(job);
  }

  await persistRemoteData();
  const client = getSupabaseClient();
  const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await client
    .from("approval_links")
    .insert({
      organization_id: state.organizationId,
      job_id: job.id,
      expires_at: expiresAt
    })
    .select("token")
    .single();

  if (error) throw error;
  return approvalUrlFromToken(data.token);
}

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(Number(value) || 0);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function copyTextToClipboard(text = "") {
  const value = String(text || "");
  if (!value) return false;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Fall through to the textarea copy path for browsers that block async clipboard.
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.append(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch {
    return false;
  }
}

function normalizeValue(value) {
  return Number(String(value || "0").replace(/[$,]/g, "")) || 0;
}

function phoneDigits(value) {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

function formatPhoneNumber(value) {
  const digits = phoneDigits(value);
  if (digits.length <= 3) return digits ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 3)})${digits.slice(3)}`;
  return `(${digits.slice(0, 3)})${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function safeFileName(value) {
  return String(value || "approval")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "approval";
}

function approvalPdfFileName(job) {
  return `approval-${safeFileName(job.name)}-${dateToISO(new Date())}.pdf`;
}

function invoicePdfFileName(job) {
  const invoice = invoiceRecord(job);
  return `invoice-${safeFileName(invoice.number || job.name)}-${safeFileName(job.name)}-${dateToISO(new Date())}.pdf`;
}

function receiptPdfFileName(job, payment = {}) {
  const invoice = invoiceRecord(job);
  const record = normalizePaymentRecord(payment);
  const paidDate = record.paidAt || dateToISO(new Date());
  const receiptId = safeFileName(record.id || "payment").slice(0, 16);
  return `receipt-${safeFileName(invoice.number || job.name)}-${safeFileName(job.name)}-${paidDate}-${receiptId}.pdf`;
}

function dataUrlSize(dataUrl) {
  const base64 = String(dataUrl || "").split(",")[1] || "";
  return Math.round((base64.length * 3) / 4);
}

function dataUrlToBlob(dataUrl) {
  const [header, base64] = String(dataUrl || "").split(",");
  const mime = header.match(/data:([^;]+)/)?.[1] || "application/octet-stream";
  const binary = atob(base64 || "");
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mime });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(reader.error || new Error("File could not be read.")));
    reader.readAsDataURL(file);
  });
}

function jobFileUrl(file = {}) {
  return file.dataUrl || file.url || "";
}

function viewJobFile(file) {
  const url = jobFileUrl(file);
  if (!url) return;
  if (String(url).startsWith("data:")) {
    const blobUrl = URL.createObjectURL(dataUrlToBlob(url));
    window.open(blobUrl, "_blank", "noopener");
    window.setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    return;
  }
  window.open(url, "_blank", "noopener");
}

function downloadJobFile(file = {}) {
  const url = jobFileUrl(file);
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name || "backline-file";
  document.body.append(link);
  link.click();
  link.remove();
}

function latestApprovalPdfFile(job = {}) {
  return [...(job.files || [])]
    .filter((file) => String(file.source || "").toLowerCase() === "approval pdf")
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0] || null;
}

function approvalPdfFileIsCurrent(file = {}) {
  return String(file.source || "").toLowerCase() === "approval pdf"
    && file.layoutVersion === APPROVAL_PDF_LAYOUT_VERSION;
}

function jobHasApprovedEstimate(job = {}) {
  const estimate = normalizeEstimateRecord(job.estimate || {}, job);
  return estimateRevisionStatus(estimate.status || job.approvalStatus) === "approved";
}

async function refreshCurrentApprovalPdfs(options = {}) {
  if (!window.jspdf?.jsPDF || document.body.classList.contains("approval-mode")) return 0;
  const company = options.companySettings || companySettings();
  let refreshed = 0;
  for (const job of state.jobs) {
    ensureJobDefaults(job);
    if (!jobHasApprovedEstimate(job)) continue;
    if (latestApprovalPdfFile(job) && (job.files || []).some(approvalPdfFileIsCurrent)) continue;
    const nextFile = await createApprovalPdfFile(job, { companySettings: company });
    job.files = [
      ...(job.files || []).filter((file) => String(file.source || "").toLowerCase() !== "approval pdf"),
      nextFile
    ];
    refreshed += 1;
  }
  if (!refreshed) return 0;
  await save();
  return refreshed;
}

function createId() {
  return crypto.randomUUID?.() || `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createPortalToken() {
  return `portal-${createId()}`;
}

function ensureJobPortalToken(job = {}) {
  job.portalToken ||= createPortalToken();
  return job.portalToken;
}

function dateToISO(date) {
  return date.toISOString().slice(0, 10);
}

function todayISO() {
  return dateToISO(new Date());
}

function addDaysISO(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateToISO(date);
}

function addDaysToISO(isoDate, days) {
  const [year, month, day] = String(isoDate || todayISO()).split("-").map(Number);
  const date = new Date(year || new Date().getFullYear(), (month || 1) - 1, day || 1);
  date.setDate(date.getDate() + (Number(days) || 0));
  return dateToISO(date);
}

function calendarWeekStartISO(isoDate = todayISO()) {
  const [year, month, day] = String(isoDate || todayISO()).split("-").map(Number);
  const date = new Date(year || new Date().getFullYear(), (month || 1) - 1, day || 1);
  const dayOfWeek = date.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  date.setDate(date.getDate() + mondayOffset);
  return dateToISO(date);
}

function calendarWeekDaysISO(isoDate = todayISO()) {
  const start = calendarWeekStartISO(isoDate);
  return Array.from({ length: 7 }, (_, index) => addDaysToISO(start, index));
}

function daysUntilISO(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = String(isoDate).split("-").map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

function formatDateLabel(isoDate, options = {}) {
  if (!isoDate) return "Unscheduled";
  const value = isoDate instanceof Date ? dateToISO(isoDate) : String(isoDate).slice(0, 10);
  const [year, month, day] = value.split("-").map(Number);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return "Unscheduled";
  const date = new Date(year, month - 1, day);
  const formatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric"
  };
  if (options.includeYear) {
    formatOptions.year = "numeric";
  }
  return new Intl.DateTimeFormat("en-US", formatOptions).format(date);
}

function formatTime(value) {
  if (!value) return "";
  const [hour, minute] = value.split(":").map(Number);
  const date = new Date();
  date.setHours(hour, minute || 0, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function timeToMinutes(value) {
  if (!value || !/^\d{1,2}:\d{2}$/.test(String(value))) return null;
  const [hour, minute] = String(value).split(":").map(Number);
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  return hour * 60 + minute;
}

function minutesToTime(value) {
  const minutes = Math.max(0, Math.min(23 * 60 + 59, Number(value) || 0));
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function normalizeDurationMinutes(value, fallback = DEFAULT_JOB_DURATION_MINUTES) {
  const duration = Number(value);
  if (!Number.isFinite(duration) || duration <= 0) return fallback;
  return Math.max(15, Math.min(720, Math.round(duration)));
}

function inferDurationMinutes(job) {
  const start = timeToMinutes(job.startTime);
  const end = timeToMinutes(job.endTime);
  if (start !== null && end !== null && end > start) {
    return end - start;
  }
  return DEFAULT_JOB_DURATION_MINUTES;
}

function jobDurationMinutes(job) {
  return normalizeDurationMinutes(job.durationMinutes, inferDurationMinutes(job));
}

function durationLabel(minutes) {
  const duration = Math.max(0, Math.round(Number(minutes) || 0));
  if (duration === 0) return "0 minutes";
  if (duration < 60) return `${duration} minutes`;
  const hours = Math.floor(duration / 60);
  const remainder = duration % 60;
  return remainder ? `${hours}h ${remainder}m` : `${hours} hour${hours === 1 ? "" : "s"}`;
}

function durationOptionItems(minutes) {
  const selected = String(normalizeDurationMinutes(minutes));
  if (durationOptions.some((option) => option.value === selected)) return durationOptions;
  return [{ value: selected, label: durationLabel(selected) }, ...durationOptions];
}

function effectiveEndTime(job) {
  if (!isScheduled(job)) return "";
  const explicitEnd = timeToMinutes(job.endTime);
  const start = timeToMinutes(job.startTime);
  if (explicitEnd !== null && start !== null && explicitEnd > start) {
    return job.endTime;
  }
  return minutesToTime((start || 0) + jobDurationMinutes(job));
}

function isScheduled(job) {
  return Boolean(job.scheduleDate && job.startTime);
}

function scheduleText(job, options = { includeYear: true }) {
  if (isScheduled(job)) {
    const endTime = effectiveEndTime(job);
    const time = endTime ? `${formatTime(job.startTime)}-${formatTime(endTime)}` : formatTime(job.startTime);
    return `${formatDateLabel(job.scheduleDate, options)} at ${time}`;
  }
  return job.window || "Unscheduled";
}

function scheduleStatusMeta(job, conflictText = "") {
  if (conflictText) {
    return {
      label: "Conflict",
      className: "conflict",
      detail: conflictText
    };
  }
  if (!isScheduled(job)) {
    return {
      label: "Unscheduled",
      className: "unscheduled",
      detail: "Needs a date and arrival window"
    };
  }
  const status = String(job.status || "open");
  const labels = {
    open: "Open",
    booked: "Booked",
    in_progress: "In progress",
    completed: "Completed",
    estimated: "Estimated",
    invoiced: "Invoiced"
  };
  return {
    label: labels[status] || statusLabel(status),
    className: status.replaceAll("_", "-"),
    detail: scheduleText(job, { includeYear: true })
  };
}

function quickScheduleSlots(job = {}) {
  const startTime = job.startTime || "09:00";
  return [
    { label: "Today", date: todayISO(), time: startTime },
    { label: "Tomorrow", date: addDaysISO(1), time: startTime }
  ];
}

function scheduleRange(job, overrides = {}) {
  const candidate = ensureJobDefaults({ ...job, ...overrides });
  if (!isScheduled(candidate)) return null;
  const start = timeToMinutes(candidate.startTime);
  if (start === null) return null;
  const end = timeToMinutes(effectiveEndTime(candidate)) || start + jobDurationMinutes(candidate);
  return {
    date: candidate.scheduleDate,
    start,
    end: Math.max(start + 1, end),
    technician: normalizeTechnician(candidate.technician)
  };
}

function scheduleConflictsForJob(job, overrides = {}) {
  const range = scheduleRange(job, overrides);
  if (!range || range.technician === "To Be Determined") return [];
  return state.jobs
    .map(ensureJobDefaults)
    .filter((other) => other.id !== job.id && !["closed", "paid"].includes(other.status))
    .filter((other) => {
      const otherRange = scheduleRange(other);
      if (!otherRange) return false;
      return otherRange.date === range.date &&
        otherRange.technician === range.technician &&
        range.start < otherRange.end &&
        range.end > otherRange.start;
    });
}

function scheduleConflictText(job, overrides = {}) {
  const conflicts = scheduleConflictsForJob(job, overrides);
  if (!conflicts.length) return "";
  const names = conflicts.slice(0, 2).map((conflict) => conflict.name).join(", ");
  const extra = conflicts.length > 2 ? ` and ${conflicts.length - 2} more` : "";
  return `Schedule conflict with ${names}${extra}.`;
}

function scheduleCapacityText(job, overrides = {}) {
  const candidate = ensureJobDefaults({ ...job, ...overrides });
  const technician = normalizeTechnician(candidate.technician);
  if (!isScheduled(candidate) || technician === "To Be Determined") return "";
  const bookedMinutes = state.jobs
    .map(ensureJobDefaults)
    .filter((other) => other.id !== candidate.id)
    .filter((other) => isScheduled(other) && other.scheduleDate === candidate.scheduleDate)
    .filter((other) => normalizeTechnician(other.technician) === technician)
    .filter((other) => !["closed", "paid"].includes(other.status))
    .reduce((total, other) => total + jobDurationMinutes(other), 0) + jobDurationMinutes(candidate);
  if (bookedMinutes > DAILY_TECH_CAPACITY_MINUTES) {
    return `${technician} would be over capacity by ${durationLabel(bookedMinutes - DAILY_TECH_CAPACITY_MINUTES)}.`;
  }
  if (bookedMinutes >= DAILY_TECH_CAPACITY_MINUTES * 0.85) {
    return `${technician} would be nearly full with ${durationLabel(bookedMinutes)} booked.`;
  }
  return "";
}

function scheduleImpactMessages(job, overrides = {}) {
  return [scheduleConflictText(job, overrides), scheduleCapacityText(job, overrides)].filter(Boolean);
}

function renderScheduleImpactWarning(job, overrides = {}) {
  const messages = scheduleImpactMessages(job, overrides);
  if (!messages.length) {
    return '<div class="schedule-ok wide" data-schedule-warning>Schedule looks clear.</div>';
  }
  return `<div class="schedule-warning wide" data-schedule-warning>${messages.map(escapeHtml).join("<br>")}</div>`;
}

function scheduleTechnicianNames(jobs) {
  const names = isFieldScopedRole() ? new Set() : new Set(technicianOptionNames());
  jobs.forEach((job) => names.add(normalizeTechnician(job.technician)));
  const sorted = [...names].filter(Boolean).sort((a, b) => a.localeCompare(b));
  return ["To Be Determined", ...sorted.filter((name) => name !== "To Be Determined")];
}

function workloadStatusLabel(minutes) {
  if (minutes > DAILY_TECH_CAPACITY_MINUTES) return "Over capacity";
  if (minutes === DAILY_TECH_CAPACITY_MINUTES) return "Fully booked";
  if (minutes >= DAILY_TECH_CAPACITY_MINUTES * 0.85) return "Nearly full";
  if (minutes > 0) return "Open capacity";
  return "Available";
}

function workloadStatusClass(minutes) {
  if (minutes > DAILY_TECH_CAPACITY_MINUTES) return "overloaded";
  if (minutes >= DAILY_TECH_CAPACITY_MINUTES * 0.85) return "busy";
  if (minutes > 0) return "open";
  return "available";
}

function technicianWorkloadRows(jobs, day = todayISO()) {
  const scopedJobs = jobs.map(ensureJobDefaults);
  const dayJobs = scopedJobs.filter((job) => isScheduled(job) && job.scheduleDate === day);
  return scheduleTechnicianNames(scopedJobs).map((technician) => {
    const assignedJobs = technician === "To Be Determined"
      ? scopedJobs.filter((job) => normalizeTechnician(job.technician) === technician)
      : dayJobs.filter((job) => normalizeTechnician(job.technician) === technician);
    const bookedMinutes = assignedJobs.reduce((total, job) => total + jobDurationMinutes(job), 0);
    const conflictCount = assignedJobs.filter((job) => scheduleConflictsForJob(job).length > 0).length;
    const remainingMinutes = Math.max(0, DAILY_TECH_CAPACITY_MINUTES - bookedMinutes);
    return {
      technician,
      jobs: assignedJobs,
      bookedMinutes,
      remainingMinutes,
      conflictCount,
      status: technician === "To Be Determined" ? "unassigned" : workloadStatusClass(bookedMinutes),
      statusLabel: technician === "To Be Determined" ? "Needs assignment" : workloadStatusLabel(bookedMinutes)
    };
  });
}

function renderTechnicianWorkload(jobs) {
  const rows = technicianWorkloadRows(jobs)
    .filter((row) => row.technician !== "To Be Determined" || row.jobs.length > 0);
  const unassignedCount = rows.find((row) => row.technician === "To Be Determined")?.jobs.length || 0;
  const scheduledCount = rows
    .filter((row) => row.technician !== "To Be Determined")
    .reduce((total, row) => total + row.jobs.length, 0);
  const bookedMinutes = rows
    .filter((row) => row.technician !== "To Be Determined")
    .reduce((total, row) => total + row.bookedMinutes, 0);
  return `
    <section class="workload-board" aria-label="Technician workload">
      <div class="workload-header">
        <div>
          <h3>Technician workload</h3>
          <p>${scheduledCount || unassignedCount ? `${scheduledCount} scheduled today · ${durationLabel(bookedMinutes)} booked · ${unassignedCount} waiting for assignment.` : "No scheduled work today. Open capacity is clear."}</p>
        </div>
        <span>${formatDateLabel(todayISO(), { includeYear: true })}</span>
      </div>
      <div class="workload-grid">
        ${rows.length ? rows.map((row) => `
          <article class="workload-card ${escapeHtml(row.status)}">
            <div>
              <strong>${escapeHtml(row.technician)}</strong>
              <span>${escapeHtml(row.statusLabel)}</span>
            </div>
            <div class="workload-metrics">
              <b>${row.jobs.length} job${row.jobs.length === 1 ? "" : "s"}</b>
              ${row.technician === "To Be Determined"
                ? '<small>Assign before dispatch</small>'
                : `<small>${escapeHtml(durationLabel(row.bookedMinutes))} booked · ${escapeHtml(durationLabel(row.remainingMinutes))} open</small>`}
            </div>
            ${row.conflictCount ? `<em>${row.conflictCount} conflict${row.conflictCount === 1 ? "" : "s"}</em>` : ""}
          </article>
        `).join("") : `
          <div class="empty-state compact-empty">
            <strong>No workload to show</strong>
            <span>Book jobs or assign technicians to build today's board.</span>
          </div>
        `}
      </div>
    </section>
  `;
}

function sortBySchedule(a, b) {
  return `${a.scheduleDate || "9999"} ${a.startTime || "99:99"}`.localeCompare(`${b.scheduleDate || "9999"} ${b.startTime || "99:99"}`);
}

function statusLabel(status) {
  const labels = {
    open: "open",
    booked: "booked",
    in_progress: "in progress",
    completed: "completed",
    estimated: "estimated",
    invoiced: "invoiced",
    paid: "paid",
    closed: "closed"
  };
  return labels[status] || status;
}

function jobTypeLabel(job) {
  if (job.jobType === "tbd") return "To Be Determined";
  return job.jobType ? job.jobType.replaceAll("_", " ") : "diagnostic";
}

const jobTemplates = [
  {
    key: "hvac_diagnostic",
    trade: "HVAC",
    jobTypes: ["diagnostic", "maintenance", "emergency"],
    title: "HVAC diagnostic",
    description: "Equipment history, model details, operating condition, photos, and customer sign-off.",
    checklist: {
      diagnosis: "Diagnosis and readings noted",
      photos: "Unit and data plate photos captured",
      signature: "Customer sign-off captured"
    },
    tasks: [
      { title: "Confirm equipment type, location, model, and serial", phase: "field", role: "tech" },
      { title: "Record filter size, refrigerant, and visible condition", phase: "field", role: "tech" },
      { title: "Capture photos of unit, data plate, thermostat, and issue area", phase: "field", role: "tech" },
      { title: "Recommend repair, replacement, or maintenance next step", phase: "closeout", role: "tech" }
    ],
    recommendations: ["Equipment record", "Good/better/best estimate", "Maintenance plan follow-up"]
  },
  {
    key: "plumbing_repair",
    trade: "Plumbing",
    jobTypes: ["repair", "diagnostic", "emergency"],
    title: "Plumbing repair",
    description: "Leak/source diagnosis, fixture details, shutoff notes, parts used, photos, and cleanup.",
    checklist: {
      diagnosis: "Source and repair path noted",
      photos: "Before/after photos captured",
      signature: "Customer sign-off captured"
    },
    tasks: [
      { title: "Identify source, affected fixtures, and shutoff location", phase: "field", role: "tech" },
      { title: "Log parts used and whether follow-up material is needed", phase: "field", role: "tech" },
      { title: "Capture before and after photos", phase: "field", role: "tech" },
      { title: "Confirm cleanup and customer approval before leaving", phase: "closeout", role: "tech" }
    ],
    recommendations: ["Parts log", "Fixture/equipment record", "Invoice from logged parts"]
  },
  {
    key: "electrical_service",
    trade: "Electrical",
    jobTypes: ["diagnostic", "repair", "replacement", "emergency"],
    title: "Electrical service",
    description: "Panel/service details, safety notes, issue photos, permit/inspection needs, and closeout.",
    checklist: {
      diagnosis: "Electrical diagnosis noted",
      photos: "Panel and work area photos captured",
      signature: "Customer sign-off captured"
    },
    tasks: [
      { title: "Capture panel, breaker, and work area photos", phase: "field", role: "tech" },
      { title: "Record voltage/load notes and safety concerns", phase: "field", role: "tech" },
      { title: "Flag permit or inspection requirements if applicable", phase: "office", role: "dispatcher" },
      { title: "Document completed repair or recommended next step", phase: "closeout", role: "tech" }
    ],
    recommendations: ["Panel record", "Permit note", "Inspection follow-up"]
  },
  {
    key: "roofing_inspection",
    trade: "Roofing",
    jobTypes: ["diagnostic", "repair", "replacement", "emergency"],
    title: "Roofing inspection",
    description: "Roof condition, leak source, exterior photos, scope notes, and estimate-ready documentation.",
    checklist: {
      diagnosis: "Roof condition and leak source noted",
      photos: "Exterior and problem-area photos captured",
      signature: "Customer sign-off captured"
    },
    tasks: [
      { title: "Capture roof, flashing, penetration, and damage photos", phase: "field", role: "tech" },
      { title: "Record age, material, slope/access, and visible condition", phase: "field", role: "tech" },
      { title: "Note temporary repair needs or weather concerns", phase: "closeout", role: "tech" },
      { title: "Prepare repair/replacement estimate from inspection notes", phase: "office", role: "dispatcher" }
    ],
    recommendations: ["Inspection photo set", "Repair estimate", "Replacement estimate"]
  },
  {
    key: "general_service",
    trade: "Other",
    jobTypes: ["tbd", "diagnostic", "repair", "replacement", "maintenance", "emergency"],
    title: "General service",
    description: "Basic intake, field proof, customer approval, and closeout tasks for custom work.",
    checklist: {
      diagnosis: "Issue and next step noted",
      photos: "Relevant photos captured",
      signature: "Customer sign-off captured"
    },
    tasks: [
      { title: "Confirm site contact, issue, and access notes", phase: "prep", role: "dispatcher" },
      { title: "Capture proof photos and field notes", phase: "field", role: "tech" },
      { title: "Log parts, materials, or follow-up needs", phase: "field", role: "tech" },
      { title: "Confirm customer next step before closing", phase: "closeout", role: "tech" }
    ],
    recommendations: ["Custom pricebook line", "Customer follow-up"]
  }
];

function normalizedTemplateText(value = "") {
  return String(value || "").trim().toLowerCase();
}

function normalizeWorkspaceTemplateSettings(settings = {}) {
  const source = settings && typeof settings === "object" ? settings : {};
  return {
    ...source,
    customTemplates: Array.isArray(source.customTemplates) ? source.customTemplates : []
  };
}

function templateSettings() {
  return normalizeWorkspaceTemplateSettings(state?.companySettings?.templateSettings || {});
}

function templateSettingFor(template, settings = templateSettings()) {
  return normalizeWorkspaceTemplateSettings(settings)[template.key] || {};
}

function templateTradeOptions(value = "") {
  return [...new Set(["HVAC", "Plumbing", "Electrical", "Roofing", "Other", value].filter(Boolean))];
}

function templateJobTypes(value = []) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  const normalized = raw
    .map((item) => normalizedTemplateText(item).replaceAll(" ", "_"))
    .filter(Boolean);
  return normalized.length ? [...new Set(normalized)] : ["tbd", "diagnostic", "repair", "replacement", "maintenance", "emergency"];
}

function templateJobTypeDisplay(value = []) {
  return templateJobTypes(value).map((item) => item.replaceAll("_", " ")).join(", ");
}

function templateRecommendationsFromValue(value = []) {
  const raw = Array.isArray(value) ? value : String(value || "").split(",");
  return raw
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function templatePhaseValue(value = "field") {
  const normalized = normalizedTemplateText(value);
  const map = {
    prep: "prep",
    "before job": "prep",
    field: "field",
    "during job": "field",
    closeout: "closeout",
    office: "office"
  };
  return map[normalized] || "field";
}

function templateRoleValue(value = "tech") {
  const normalized = normalizedTemplateText(value);
  const map = {
    any: "any",
    "any role": "any",
    owner: "owner",
    "owner/admin": "owner",
    admin: "owner",
    dispatcher: "dispatcher",
    tech: "tech",
    technician: "tech"
  };
  return map[normalized] || "tech";
}

function templatePhaseDropdownValue(value = "field") {
  const labels = {
    prep: "Before job",
    field: "During job",
    closeout: "Closeout",
    office: "Office"
  };
  return labels[templatePhaseValue(value)];
}

function templateRoleDropdownValue(value = "tech") {
  const labels = {
    any: "Any role",
    owner: "Owner/Admin",
    dispatcher: "Dispatcher",
    tech: "Technician"
  };
  return labels[templateRoleValue(value)];
}

function normalizedTemplateTasks(tasks = [], template = jobTemplates[0]) {
  return (Array.isArray(tasks) ? tasks : [])
    .map((task) => normalizeTemplateTask({
      ...task,
      phase: templatePhaseValue(task.phase),
      role: templateRoleValue(task.role)
    }, template))
    .filter((task) => task.title);
}

function customTemplateDefinitions(settings = templateSettings()) {
  return normalizeWorkspaceTemplateSettings(settings).customTemplates
    .map((template, index) => ({
      key: String(template.key || `custom_template_${index + 1}`).trim(),
      custom: true,
      trade: String(template.trade || "Other").trim() || "Other",
      jobTypes: templateJobTypes(template.jobTypes),
      title: String(template.title || `Custom template ${index + 1}`).trim() || `Custom template ${index + 1}`,
      description: String(template.description || "Custom workflow for this shop.").trim(),
      checklist: {
        diagnosis: template.checklist?.diagnosis || "Issue and next step noted",
        photos: template.checklist?.photos || "Relevant photos captured",
        signature: template.checklist?.signature || "Customer sign-off captured"
      },
      tasks: normalizedTemplateTasks(template.tasks || [], { key: template.key || `custom_template_${index + 1}` }),
      recommendations: templateRecommendationsFromValue(template.recommendations).length
        ? templateRecommendationsFromValue(template.recommendations)
        : ["Custom workflow"],
      enabled: template.enabled !== false
    }))
    .filter((template) => template.key);
}

function templateDefinitionsForSettings(settings = templateSettings(), options = {}) {
  const custom = customTemplateDefinitions(settings);
  const defaults = jobTemplates.map((template) => workspaceTemplate(template, settings));
  return options.customFirst ? [...custom, ...defaults] : [...defaults, ...custom];
}

function jobTemplateByKey(key = "") {
  const templateKey = String(key || "").trim();
  if (!templateKey || templateKey === "__auto") return null;
  const template = templateDefinitionsForSettings(templateSettings(), { customFirst: true })
    .find((item) => item.key === templateKey);
  return template ? workspaceTemplate(template) : null;
}

function jobTemplatePickerOptions(selectedKey = "") {
  const templates = templateDefinitionsForSettings(templateSettings(), { customFirst: true })
    .filter((template) => template.enabled !== false);
  const options = [
    { value: "__auto", label: "Automatic best match" },
    ...templates.map((template) => ({
      value: template.key,
      label: `${template.title} (${template.trade})`
    }))
  ];
  if (selectedKey && selectedKey !== "__auto" && !options.some((option) => option.value === selectedKey)) {
    const selected = jobTemplateByKey(selectedKey);
    options.push({
      value: selectedKey,
      label: selected ? `${selected.title} (${selected.trade})` : "Saved template"
    });
  }
  return options;
}

function suggestedJobTemplateKeyFromForm(form = elements.jobForm) {
  if (!form) return "__auto";
  const candidate = jobTemplateFor({
    trade: form.elements.trade?.value || "Other",
    jobType: form.elements.jobType?.value || "tbd"
  });
  return candidate?.key || "__auto";
}

function jobTradeOptions() {
  return ["HVAC", "Plumbing", "Electrical", "Roofing", "Other"].map((value) => ({ value, label: value }));
}

function jobTypeOptions() {
  return [
    { value: "tbd", label: "To Be Determined" },
    { value: "diagnostic", label: "Diagnostic" },
    { value: "repair", label: "Repair" },
    { value: "replacement", label: "Replacement" },
    { value: "maintenance", label: "Maintenance" },
    { value: "emergency", label: "Emergency" }
  ];
}

function urgencyOptions() {
  return [
    { value: "normal", label: "Normal" },
    { value: "urgent", label: "Urgent" }
  ];
}

function renderNewJobPickers(values = {}) {
  const form = elements.jobForm;
  const current = {
    trade: form?.elements.trade?.value,
    jobType: form?.elements.jobType?.value,
    urgency: form?.elements.urgency?.value,
    durationMinutes: form?.elements.durationMinutes?.value,
    technician: form?.elements.technician?.value
  };
  const nextValues = { ...current, ...values };
  if (elements.jobTradePicker) {
    elements.jobTradePicker.innerHTML = backlineDropdown({
      id: "new-job-trade",
      name: "trade",
      value: nextValues.trade || "HVAC",
      options: jobTradeOptions(),
      placeholder: "Trade",
      direction: "up"
    });
  }
  if (elements.jobTypePicker) {
    elements.jobTypePicker.innerHTML = backlineDropdown({
      id: "new-job-type",
      name: "jobType",
      value: nextValues.jobType || "tbd",
      options: jobTypeOptions(),
      placeholder: "Job type",
      direction: "up"
    });
  }
  if (elements.jobUrgencyPicker) {
    elements.jobUrgencyPicker.innerHTML = backlineDropdown({
      id: "new-job-urgency",
      name: "urgency",
      value: nextValues.urgency || "normal",
      options: urgencyOptions(),
      placeholder: "Urgency",
      direction: "up"
    });
  }
  if (elements.jobDurationPicker) {
    elements.jobDurationPicker.innerHTML = backlineDropdown({
      id: "new-job-duration",
      name: "durationMinutes",
      value: nextValues.durationMinutes || String(DEFAULT_JOB_DURATION_MINUTES),
      options: durationOptionItems(nextValues.durationMinutes || DEFAULT_JOB_DURATION_MINUTES),
      placeholder: "Duration",
      direction: "up"
    });
  }
  renderTechnicianOptions(nextValues.technician || "To Be Determined");
}

function renderJobTemplatePicker(selectedKey = "") {
  if (!elements.jobTemplatePicker) return;
  const value = selectedKey || "__auto";
  elements.jobTemplatePicker.innerHTML = backlineDropdown({
    id: "new-job-template",
    name: "jobTemplateKey",
    value,
    options: jobTemplatePickerOptions(value),
    placeholder: "Job template",
    direction: "up"
  });
}

function newCustomTemplateDefinition() {
  const key = `custom_template_${Date.now().toString(36)}_${createId().slice(0, 6)}`;
  return {
    key,
    custom: true,
    trade: "Other",
    jobTypes: ["diagnostic", "repair"],
    title: "New custom template",
    description: "Custom workflow for this shop.",
    checklist: {
      diagnosis: "Issue and next step noted",
      photos: "Relevant photos captured",
      signature: "Customer sign-off captured"
    },
    tasks: [
      { title: "Confirm site contact, issue, and access notes", phase: "prep", role: "dispatcher" },
      { title: "Capture field notes and proof photos", phase: "field", role: "tech" }
    ],
    recommendations: ["Custom workflow"],
    enabled: true
  };
}

function workspaceTemplate(template, settings = templateSettings()) {
  const setting = template.custom ? {} : templateSettingFor(template, settings);
  const enabled = setting.enabled !== false;
  const checklist = {
    ...(template.checklist || {}),
    ...(setting.checklist || {})
  };
  const customTasks = Array.isArray(setting.tasks) ? normalizedTemplateTasks(setting.tasks, template) : null;
  return {
    ...template,
    enabled: template.custom ? template.enabled !== false : enabled,
    trade: String(setting.trade || template.trade || "Other").trim() || "Other",
    jobTypes: templateJobTypes(setting.jobTypes || template.jobTypes),
    title: String(setting.title || template.title).trim() || template.title,
    description: String(setting.description || template.description).trim() || template.description,
    checklist,
    tasks: (template.custom ? template.enabled !== false : enabled) ? (customTasks || normalizedTemplateTasks(template.tasks, template)) : [],
    recommendations: templateRecommendationsFromValue(setting.recommendations).length
      ? templateRecommendationsFromValue(setting.recommendations)
      : templateRecommendationsFromValue(template.recommendations)
  };
}

function jobTemplateFor(job = {}) {
  const selectedTemplate = jobTemplateByKey(job.templateKey);
  if (selectedTemplate) return selectedTemplate;
  const trade = normalizedTemplateText(job.trade);
  const jobType = normalizedTemplateText(job.jobType || "tbd");
  const templates = templateDefinitionsForSettings(templateSettings(), { customFirst: true });
  const exact = templates.find((template) =>
    normalizedTemplateText(template.trade) === trade &&
    template.jobTypes.includes(jobType)
  );
  if (exact) return workspaceTemplate(exact);
  const tradeDefault = templates.find((template) => normalizedTemplateText(template.trade) === trade);
  return workspaceTemplate(tradeDefault || jobTemplates.find((template) => template.key === "general_service"));
}

function normalizeTemplateTask(task = {}, template = jobTemplates[0]) {
  return {
    id: task.id || createId(),
    title: String(task.title || "").trim(),
    phase: String(task.phase || "field"),
    role: String(task.role || "tech"),
    done: Boolean(task.done),
    doneAt: task.doneAt || "",
    doneBy: task.doneBy || "",
    createdAt: task.createdAt || new Date().toISOString(),
    createdBy: task.createdBy || "Backline template",
    source: task.source || "template",
    sourceKey: task.sourceKey || `${template.key}:${normalizedTemplateText(task.title)}`
  };
}

function normalizeJobTask(task = {}) {
  return {
    id: task.id || createId(),
    title: String(task.title || "").trim(),
    phase: String(task.phase || "field"),
    role: String(task.role || "tech"),
    done: Boolean(task.done),
    doneAt: task.doneAt || "",
    doneBy: task.doneBy || "",
    createdAt: task.createdAt || new Date().toISOString(),
    createdBy: task.createdBy || accountDisplayName(),
    source: task.source || "manual",
    sourceKey: task.sourceKey || ""
  };
}

function cloneJobTasks(tasks = []) {
  return (Array.isArray(tasks) ? tasks : []).map((task) => normalizeJobTask({ ...task }));
}

function applyJobTemplate(job, options = {}) {
  const template = jobTemplateFor(job);
  if (!template.enabled) {
    job.templateKey = template.key;
    return { template, added: 0 };
  }
  const existingKeys = new Set((job.tasks || [])
    .map((task) => task.sourceKey || `${template.key}:${normalizedTemplateText(task.title)}`));
  const templateTasks = template.tasks
    .map((task) => normalizeTemplateTask(task, template))
    .filter((task) => task.title && !existingKeys.has(task.sourceKey));
  if (!templateTasks.length && !options.forceMetadata) {
    job.templateKey = job.templateKey || template.key;
    return { template, added: 0 };
  }
  job.templateKey = template.key;
  job.tasks = [...(job.tasks || []), ...templateTasks];
  return { template, added: templateTasks.length };
}

function templateChecklist(job = {}) {
  return jobTemplateFor(job).checklist || jobTemplates[jobTemplates.length - 1].checklist;
}

function fallbackInvoiceNumber(job = {}) {
  const suffix = String(job.id || createId()).replace(/\W/g, "").slice(-6).toUpperCase() || "000001";
  return `BL-${suffix}`;
}

function normalizePricebookItem(item = {}) {
  return {
    id: item.id || createId(),
    name: String(item.name || "").trim(),
    description: String(item.description || "").trim(),
    category: String(item.category || "General").trim() || "General",
    unit: String(item.unit || "each").trim() || "each",
    unitPrice: normalizeValue(item.unitPrice ?? item.unit_price),
    taxable: Boolean(item.taxable),
    active: item.active !== false,
    preferredSupplier: String(item.preferredSupplier || item.preferred_supplier || "").trim(),
    defaultCost: normalizeValue(item.defaultCost ?? item.default_cost),
    truckStock: Math.max(0, Math.round(Number(item.truckStock ?? item.truck_stock ?? 0) || 0)),
    reorderPoint: Math.max(0, Math.round(Number(item.reorderPoint ?? item.reorder_point ?? 0) || 0)),
    lastUsedAt: item.lastUsedAt || item.last_used_at || "",
    usageCount: Math.max(0, Math.round(Number(item.usageCount ?? item.usage_count ?? 0) || 0)),
    orders: Array.isArray(item.orders) ? item.orders.map(normalizeInventoryOrder) : [],
    movements: Array.isArray(item.movements) ? item.movements.map(normalizeStockMovement) : [],
    createdAt: item.createdAt || item.created_at || new Date().toISOString(),
    updatedAt: item.updatedAt || item.updated_at || ""
  };
}

function supplierIdFromName(name = "") {
  return normalizedInventoryName(name || "Supplier not set") || "supplier-not-set";
}

function normalizeSupplierWebsite(value = "") {
  const website = String(value || "").trim();
  if (!website) return "";
  if (/^https?:\/\//i.test(website)) return website;
  return `https://${website}`;
}

function normalizeSupplierRecord(record = {}) {
  const name = normalizedSupplierName(record.name || record.supplier || "");
  return {
    id: record.id || supplierIdFromName(name),
    name,
    phone: formatPhoneNumber(record.phone || ""),
    email: String(record.email || "").trim(),
    website: normalizeSupplierWebsite(record.website || ""),
    accountNumber: String(record.accountNumber || record.account_number || "").trim(),
    preferredContact: String(record.preferredContact || record.preferred_contact || "phone").trim() || "phone",
    deliveryNotes: String(record.deliveryNotes || record.delivery_notes || record.notes || "").trim(),
    createdAt: record.createdAt || record.created_at || new Date().toISOString(),
    createdBy: record.createdBy || record.created_by || accountDisplayName(),
    updatedAt: record.updatedAt || record.updated_at || "",
    updatedBy: record.updatedBy || record.updated_by || ""
  };
}

function supplierRecords() {
  const records = new Map();
  state.suppliers.map(normalizeSupplierRecord).forEach((supplier) => {
    records.set(normalizedSupplierName(supplier.name), supplier);
  });
  inventoryMaterialItems().forEach((item) => {
    const name = normalizedSupplierName(item.preferredSupplier);
    if (!records.has(name)) {
      records.set(name, normalizeSupplierRecord({ name, createdBy: "Backline" }));
    }
  });
  return [...records.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function supplierRecordByName(name = "") {
  const supplier = normalizedSupplierName(name);
  return supplierRecords().find((record) => normalizedSupplierName(record.name) === supplier) || normalizeSupplierRecord({ name: supplier });
}

function normalizeInventoryOrder(order = {}) {
  const qty = Math.max(0, Math.round(Number(order.qty ?? order.quantity ?? order.orderedQty ?? order.ordered_qty ?? 0) || 0));
  const receivedQty = Math.max(0, Math.round(Number(order.receivedQty ?? order.received_qty ?? 0) || 0));
  const unitCost = normalizeValue(order.unitCost ?? order.unit_cost);
  const status = String(order.status || "ordered").toLowerCase();
  return {
    id: order.id || createId(),
    purchaseOrderId: order.purchaseOrderId || order.purchase_order_id || "",
    purchaseOrderNumber: order.purchaseOrderNumber || order.purchase_order_number || "",
    supplier: String(order.supplier || "").trim(),
    qty,
    unitCost,
    expectedDate: order.expectedDate || order.expected_date || "",
    status: ["ordered", "received", "cancelled"].includes(status) ? status : "ordered",
    note: String(order.note || "").trim(),
    orderedAt: order.orderedAt || order.ordered_at || new Date().toISOString(),
    orderedBy: order.orderedBy || order.ordered_by || accountDisplayName(),
    receivedQty,
    receivedAt: order.receivedAt || order.received_at || "",
    receivedBy: order.receivedBy || order.received_by || ""
  };
}

function normalizeStockMovement(movement = {}) {
  const qty = Math.round(Number(movement.qty ?? movement.quantity ?? 0) || 0);
  return {
    id: movement.id || createId(),
    type: String(movement.type || "adjustment").trim().toLowerCase() || "adjustment",
    qty,
    beforeQty: Math.max(0, Math.round(Number(movement.beforeQty ?? movement.before_qty ?? 0) || 0)),
    afterQty: Math.max(0, Math.round(Number(movement.afterQty ?? movement.after_qty ?? 0) || 0)),
    note: String(movement.note || "").trim(),
    jobId: movement.jobId || movement.job_id || "",
    jobName: String(movement.jobName || movement.job_name || "").trim(),
    orderId: movement.orderId || movement.order_id || "",
    purchaseOrderId: movement.purchaseOrderId || movement.purchase_order_id || "",
    purchaseOrderNumber: movement.purchaseOrderNumber || movement.purchase_order_number || "",
    createdAt: movement.createdAt || movement.created_at || new Date().toISOString(),
    createdBy: movement.createdBy || movement.created_by || accountDisplayName()
  };
}

function stockMovement(type, qty, beforeQty, afterQty, details = {}) {
  return normalizeStockMovement({
    type,
    qty,
    beforeQty,
    afterQty,
    ...details,
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName()
  });
}

function normalizeInvoiceLineItem(item = {}) {
  const qty = Number(String(item.qty ?? item.quantity ?? "1").replace(/,/g, "")) || 1;
  const unitPrice = normalizeValue(item.unitPrice ?? item.unit_price);
  return {
    id: item.id || createId(),
    pricebookItemId: item.pricebookItemId || item.pricebook_item_id || "",
    description: String(item.description || item.name || "").trim(),
    category: String(item.category || "General").trim() || "General",
    qty,
    unit: String(item.unit || "each").trim() || "each",
    unitPrice,
    taxable: Boolean(item.taxable),
    createdAt: item.createdAt || new Date().toISOString(),
    createdBy: item.createdBy || accountDisplayName(),
    source: item.source || "",
    sourceId: item.sourceId || item.source_id || ""
  };
}

function invoiceLineItemTotal(item = {}) {
  const line = normalizeInvoiceLineItem(item);
  return line.qty * line.unitPrice;
}

function invoiceLineItems(record = {}) {
  return Array.isArray(record.lineItems)
    ? record.lineItems.map(normalizeInvoiceLineItem).filter((item) => item.description)
    : [];
}

function normalizePaymentRecord(record = {}, index = 0) {
  const amount = normalizeValue(record.amount ?? record.paidAmount ?? record.depositCollected);
  const kind = String(record.kind || record.type || "payment").trim().toLowerCase();
  return {
    id: record.id || `payment-${createId()}`,
    amount,
    kind: ["deposit", "payment", "refund", "credit"].includes(kind) ? kind : "payment",
    method: String(record.method || record.paymentMethod || "").trim(),
    note: String(record.note || "").trim(),
    paidAt: record.paidAt || record.createdAt || todayISO(),
    createdAt: record.createdAt || new Date().toISOString(),
    createdBy: record.createdBy || record.updatedBy || accountDisplayName(),
    receiptFileId: record.receiptFileId || record.receipt_file_id || "",
    receiptFileName: record.receiptFileName || record.receipt_file_name || "",
    legacyOrder: index
  };
}

function normalizePaymentRequest(record = {}, job = {}) {
  const invoice = invoiceRecord(job);
  const requestedAmount = normalizeValue(record.amount ?? record.requestedAmount);
  const balance = invoiceBalance(job);
  return {
    id: record.id || `payreq-${createId()}`,
    amount: requestedAmount > 0 ? requestedAmount : balance || invoice.amount || 0,
    dueDate: record.dueDate || addDaysISO(7),
    note: String(record.note || "").trim(),
    status: ["requested", "responded", "cancelled"].includes(record.status) ? record.status : "requested",
    response: String(record.response || "").trim(),
    responseAt: record.responseAt || "",
    createdAt: record.createdAt || new Date().toISOString(),
    createdBy: record.createdBy || accountDisplayName()
  };
}

function paymentRequests(job = {}) {
  return Array.isArray(job.paymentRequests)
    ? job.paymentRequests.map((request) => normalizePaymentRequest(request, job)).filter((request) => request.amount > 0)
    : [];
}

function activePaymentRequest(job = {}) {
  return paymentRequests(job)
    .filter((request) => request.status === "requested")
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0] || null;
}

function paymentRequestUrl(job = {}) {
  return customerPortalUrl(job);
}

function legacyPaymentRecords(record = {}) {
  const legacy = [];
  const depositCollected = normalizeValue(record.depositCollected);
  const paidAmount = normalizeValue(record.paidAmount || (record.status === "paid" ? normalizeValue(record.amount) : 0));
  if (depositCollected > 0) {
    legacy.push(normalizePaymentRecord({
      id: "legacy-deposit",
      amount: depositCollected,
      kind: "deposit",
      method: record.paymentMethod,
      note: "Legacy deposit collected",
      paidAt: record.paidAt || record.updatedAt || todayISO(),
      createdAt: record.updatedAt || new Date().toISOString(),
      createdBy: record.updatedBy || "Backline"
    }, 0));
  }
  if (paidAmount > 0) {
    legacy.push(normalizePaymentRecord({
      id: "legacy-payment",
      amount: paidAmount,
      kind: "payment",
      method: record.paymentMethod,
      note: "Legacy payment recorded",
      paidAt: record.paidAt || record.updatedAt || todayISO(),
      createdAt: record.updatedAt || new Date().toISOString(),
      createdBy: record.updatedBy || "Backline"
    }, 1));
  }
  return legacy;
}

function paymentRecords(record = {}) {
  const stored = Array.isArray(record.payments)
    ? record.payments.map(normalizePaymentRecord).filter((payment) => payment.amount > 0)
    : [];
  return stored.length ? stored : legacyPaymentRecords(record);
}

function invoiceCollectedAmount(record = {}) {
  return paymentRecords(record)
    .reduce((sum, payment) => sum + (payment.kind === "refund" ? -payment.amount : payment.amount), 0);
}

function isInvoiceBaselineLine(item = {}) {
  return String(item.description || "").trim().toLowerCase() === INVOICE_BASELINE_DESCRIPTION.toLowerCase()
    && String(item.category || "").trim().toLowerCase() === "prior billing";
}

function repairInvoiceBaselineLines(record = {}) {
  const lineItems = invoiceLineItems(record);
  const baselineIndex = lineItems.findIndex(isInvoiceBaselineLine);
  if (baselineIndex < 0) return lineItems;
  const collected = invoiceCollectedAmount(record);
  const currentBaseline = normalizeValue(lineItems[baselineIndex].unitPrice);
  if (collected <= currentBaseline) return lineItems;
  return lineItems.map((item, index) => index === baselineIndex
    ? normalizeInvoiceLineItem({ ...item, unitPrice: collected })
    : item);
}

function normalizeInvoiceRecord(record = {}, job = {}) {
  const lineItems = invoiceLineItems(record);
  const payments = paymentRecords(record);
  const depositCollected = payments
    .filter((payment) => payment.kind === "deposit")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const paidAmount = payments
    .filter((payment) => payment.kind !== "deposit")
    .reduce((sum, payment) => sum + (payment.kind === "refund" ? -payment.amount : payment.amount), 0);
  const collected = depositCollected + paidAmount;
  const amount = lineItems.reduce((sum, item) => sum + invoiceLineItemTotal(item), 0);
  const rawDepositRequested = normalizeValue(record.depositRequested);
  const depositRequested = amount > 0 ? Math.min(rawDepositRequested, amount) : 0;
  let status = record.status || (job.status === "paid" ? "paid" : job.status === "invoiced" ? "sent" : "draft");
  if (amount > 0 && collected >= amount) {
    status = "paid";
  } else if (amount > 0 && collected > 0) {
    status = "partial";
  } else if (amount <= 0) {
    status = "draft";
  } else if (status === "paid") {
    status = "sent";
  }
  return {
    number: String(record.number || fallbackInvoiceNumber(job)).trim(),
    amount,
    lineItems,
    payments,
    depositRequested,
    depositCollected,
    paidAmount,
    paymentMethod: String(record.paymentMethod || "").trim(),
    status,
    note: String(record.note || "").trim(),
    paidAt: record.paidAt || "",
    updatedAt: record.updatedAt || "",
    updatedBy: record.updatedBy || ""
  };
}

function invoiceRecord(job = {}) {
  return normalizeInvoiceRecord(job.invoice || {}, job);
}

function invoiceBalance(job = {}) {
  const invoice = invoiceRecord(job);
  return Math.max(0, invoice.amount - invoiceCollectedAmount(invoice));
}

function jobReportingValue(job = {}) {
  const invoice = invoiceRecord(job);
  return Math.max(
    normalizeValue(invoice.amount),
    invoiceCollectedAmount(invoice),
    estimateAmount(job),
    normalizeValue(job.value)
  );
}

function canViewJobCosting() {
  return can("exportData");
}

function partQuantity(part = {}) {
  const qty = parseFloat(String(part.qty || "1").replace(/,/g, ""));
  return Number.isFinite(qty) && qty > 0 ? qty : 1;
}

function partUnitCost(part = {}) {
  return Math.max(0, normalizeValue(part.cost ?? part.unitCost ?? part.unitPrice));
}

function partCostTotal(part = {}) {
  return partQuantity(part) * partUnitCost(part);
}

function normalizeJobPart(part = {}, index = 0) {
  const name = String(part.name || "").trim();
  const source = String(part.source || "truck stock").trim() || "truck stock";
  return {
    id: part.id || `part-${createId()}`,
    name,
    qty: String(part.qty || "1").trim() || "1",
    source,
    cost: normalizeValue(part.cost ?? part.unitCost ?? ""),
    createdAt: part.createdAt || new Date().toISOString(),
    createdBy: part.createdBy || accountDisplayName(),
    updatedAt: part.updatedAt || "",
    updatedBy: part.updatedBy || "",
    invoiceLineItemId: part.invoiceLineItemId || part.invoice_line_item_id || "",
    billedAt: part.billedAt || part.billed_at || "",
    billedBy: part.billedBy || part.billed_by || "",
    pricebookItemId: part.pricebookItemId || part.pricebook_item_id || "",
    legacyOrder: index
  };
}

function normalizeJobReservation(reservation = {}, index = 0) {
  const qty = Math.max(1, Math.round(Number(reservation.qty ?? reservation.quantity ?? 1) || 1));
  const status = String(reservation.status || "reserved").toLowerCase();
  return {
    id: reservation.id || `reservation-${createId()}`,
    pricebookItemId: reservation.pricebookItemId || reservation.pricebook_item_id || "",
    name: String(reservation.name || "").trim(),
    qty,
    status: ["reserved", "picked"].includes(status) ? status : "reserved",
    note: String(reservation.note || "").trim(),
    createdAt: reservation.createdAt || reservation.created_at || new Date().toISOString(),
    createdBy: reservation.createdBy || reservation.created_by || accountDisplayName(),
    pickedAt: reservation.pickedAt || reservation.picked_at || "",
    pickedBy: reservation.pickedBy || reservation.picked_by || "",
    legacyOrder: index
  };
}

function partSuggestedBillRate(part = {}) {
  const cost = partUnitCost(part);
  if (cost <= 0) return 0;
  const targetMargin = Math.min(95, Math.max(0, companySettings().targetMarginPercent || 0));
  return Math.round((cost / (1 - (targetMargin / 100))) * 100) / 100;
}

function partInvoiceSourceId(part = {}) {
  return part.id ? `${INVOICE_PART_LINE_SOURCE}:${part.id}` : "";
}

function partInvoiceLine(part = {}) {
  const normalized = normalizeJobPart(part);
  const rate = partSuggestedBillRate(normalized) || partUnitCost(normalized);
  return normalizeInvoiceLineItem({
    description: normalized.name,
    category: "Materials",
    qty: partQuantity(normalized),
    unit: "each",
    unitPrice: rate,
    taxable: false,
    source: INVOICE_PART_LINE_SOURCE,
    sourceId: partInvoiceSourceId(normalized),
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName()
  });
}

function invoiceLineForPart(invoice = {}, part = {}) {
  const sourceId = partInvoiceSourceId(part);
  if (!sourceId) return null;
  return invoiceLineItems(invoice).find((line) => normalizeInvoiceLineItem(line).source === INVOICE_PART_LINE_SOURCE && normalizeInvoiceLineItem(line).sourceId === sourceId) || null;
}

function isPartBilled(job = {}, part = {}) {
  const normalized = normalizeJobPart(part);
  const invoice = invoiceRecord(job);
  return Boolean(normalized.invoiceLineItemId && invoice.lineItems.some((line) => normalizeInvoiceLineItem(line).id === normalized.invoiceLineItemId))
    || Boolean(invoiceLineForPart(invoice, normalized));
}

function partSavedToPricebook(part = {}) {
  const normalized = normalizeJobPart(part);
  return Boolean(normalized.pricebookItemId && pricebookItemById(normalized.pricebookItemId));
}

function normalizedInventoryName(value = "") {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function inventoryMaterialItems() {
  return state.pricebookItems
    .map(normalizePricebookItem)
    .filter((item) => item.active && item.name && (item.category.toLowerCase() === "materials" || item.defaultCost > 0 || item.truckStock > 0 || item.reorderPoint > 0))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function inventoryItemForPartName(name = "") {
  const needle = normalizedInventoryName(name);
  if (!needle) return null;
  return inventoryMaterialItems().find((item) => normalizedInventoryName(item.name) === needle) || null;
}

function inventoryItemForReservation(reservation = {}) {
  const normalized = normalizeJobReservation(reservation);
  return pricebookItemById(normalized.pricebookItemId) || inventoryItemForPartName(normalized.name);
}

function activeInventoryReservations({ excludeJobId = "" } = {}) {
  return state.jobs
    .map(ensureJobDefaults)
    .filter((job) => job.id !== excludeJobId && !["paid", "closed"].includes(job.status))
    .flatMap((job) => job.reservations.map((reservation) => ({ job, reservation: normalizeJobReservation(reservation) })))
    .filter(({ reservation }) => reservation.status !== "picked" || reservation.qty > 0);
}

function reservedQuantityForItem(itemId = "", { excludeJobId = "" } = {}) {
  if (!itemId) return 0;
  return activeInventoryReservations({ excludeJobId })
    .filter(({ reservation }) => reservation.pricebookItemId === itemId)
    .reduce((total, { reservation }) => total + reservation.qty, 0);
}

function availableQuantityForReservation(item = {}, jobId = "") {
  const normalized = normalizePricebookItem(item);
  return Math.max(0, normalized.truckStock - reservedQuantityForItem(normalized.id, { excludeJobId: jobId }));
}

function jobReservationRows(job = {}) {
  ensureJobDefaults(job);
  return job.reservations.map((reservation, index) => {
    const normalized = normalizeJobReservation(reservation, index);
    const item = inventoryItemForReservation(normalized);
    const available = item ? availableQuantityForReservation(item, job.id) : 0;
    const shortageQty = item ? Math.max(0, normalized.qty - available) : normalized.qty;
    return {
      reservation: normalized,
      item,
      available,
      shortageQty,
      status: shortageQty > 0 ? "shortage" : normalized.status
    };
  });
}

function jobReservationShortages(job = {}) {
  return jobReservationRows(job).filter((row) => row.shortageQty > 0);
}

function jobPickListSummary(job = {}) {
  const rows = jobReservationRows(job);
  const picked = rows.filter((row) => row.reservation.status === "picked").length;
  const shortages = rows.filter((row) => row.shortageQty > 0).length;
  return {
    total: rows.length,
    picked,
    shortages,
    label: rows.length ? `${picked}/${rows.length} picked` : "No pick list"
  };
}

function jobNeedsApprovalBeforeDispatch(job = {}) {
  const latest = latestEstimateRevision(job);
  return Boolean(latest && latest.amount > 0 && latest.status === "sent");
}

function jobReadinessMeta(job = {}) {
  ensureJobDefaults(job);
  const pickSummary = jobPickListSummary(job);
  const shortageCount = jobReservationShortages(job).length;
  if (!isScheduled(job) || normalizeTechnician(job.technician) === "To Be Determined") {
    return {
      label: "Needs schedule",
      className: "needs-schedule",
      detail: !isScheduled(job) ? "Set appointment time before dispatch" : "Assign a technician before dispatch"
    };
  }
  if (jobNeedsApprovalBeforeDispatch(job)) {
    return {
      label: "Needs approval",
      className: "needs-approval",
      detail: `${formatMoney(estimateAmount(job))} estimate is still waiting on the customer`
    };
  }
  if (shortageCount > 0) {
    return {
      label: "Needs parts",
      className: "needs-parts",
      detail: `${shortageCount} reserved material${shortageCount === 1 ? "" : "s"} short before dispatch`
    };
  }
  if (pickSummary.total && pickSummary.picked < pickSummary.total) {
    return {
      label: "Needs pick",
      className: "needs-pick",
      detail: `${pickSummary.label} for truck loadout`
    };
  }
  return {
    label: "Ready",
    className: "ready",
    detail: pickSummary.total ? "Schedule, approval, and materials are ready" : "Schedule and assignment are ready"
  };
}

function scheduleReadinessSummary(jobs = []) {
  return jobs
    .map(ensureJobDefaults)
    .filter((job) => !["paid", "closed"].includes(job.status))
    .reduce((summary, job) => {
      const meta = jobReadinessMeta(job);
      summary.total += 1;
      summary[meta.className] = (summary[meta.className] || 0) + 1;
      return summary;
    }, { total: 0, ready: 0, "needs-schedule": 0, "needs-approval": 0, "needs-parts": 0, "needs-pick": 0 });
}

function loadoutMaterialKey(row = {}) {
  return row.item?.id || normalizedInventoryName(row.reservation?.name || "");
}

function dailyLoadoutRows(jobs = [], day = todayISO()) {
  const grouped = new Map();
  jobs
    .map(ensureJobDefaults)
    .filter((job) => job.scheduleDate === day && !["paid", "closed"].includes(job.status))
    .forEach((job) => {
      jobReservationRows(job).forEach((row) => {
        const key = loadoutMaterialKey(row);
        if (!key) return;
        const existing = grouped.get(key) || {
          key,
          name: row.reservation.name,
          unit: row.item?.unit || "each",
          qty: 0,
          pickedQty: 0,
          shortageQty: 0,
          jobs: [],
          technicians: new Set()
        };
        existing.name = existing.name || row.reservation.name;
        existing.qty += row.reservation.qty;
        existing.pickedQty += row.reservation.status === "picked" ? row.reservation.qty : 0;
        existing.shortageQty += row.shortageQty;
        existing.jobs.push({
          id: job.id,
          name: job.name,
          time: scheduleText(job),
          qty: row.reservation.qty,
          status: row.status
        });
        existing.technicians.add(normalizeTechnician(job.technician));
        grouped.set(key, existing);
      });
    });
  return [...grouped.values()]
    .map((row) => ({
      ...row,
      technicians: [...row.technicians].filter(Boolean),
      status: row.shortageQty > 0 ? "shortage" : row.pickedQty >= row.qty ? "picked" : "reserved"
    }))
    .sort((a, b) => (b.shortageQty - a.shortageQty) || a.name.localeCompare(b.name));
}

function loadoutSummary(rows = []) {
  const total = rows.length;
  const picked = rows.filter((row) => row.status === "picked").length;
  const shortages = rows.filter((row) => row.status === "shortage").length;
  return { total, picked, shortages };
}

function markLoadoutMaterialPicked(materialKey = "", day = todayISO()) {
  const scopedIds = new Set(roleScopedJobs().map((job) => job.id));
  const changed = [];
  state.jobs.forEach((candidate) => {
    const job = ensureJobDefaults(candidate);
    if (!scopedIds.has(job.id) || job.scheduleDate !== day || ["paid", "closed"].includes(job.status)) return;
    const matchingIds = jobReservationRows(job)
      .filter((row) => loadoutMaterialKey(row) === materialKey && row.reservation.status !== "picked")
      .map((row) => row.reservation.id);
    if (!matchingIds.length) return;
    updateJobById(job.id, (nextJob) => {
      let pickedCount = 0;
      matchingIds.forEach((reservationId) => {
        const picked = markReservationPicked(nextJob, reservationId);
        if (picked) pickedCount += 1;
      });
      if (pickedCount) {
        addJobMessage(nextJob, {
          direction: "note",
          body: `${pickedCount} loadout material${pickedCount === 1 ? "" : "s"} marked picked for ${formatDateLabel(day, { includeYear: true })}.`
        });
      }
      return nextJob;
    });
    changed.push(job.id);
  });
  return changed.length;
}

function recommendedReservationItems(job = {}) {
  ensureJobDefaults(job);
  const existingIds = new Set(job.reservations.map((reservation) => normalizeJobReservation(reservation).pricebookItemId).filter(Boolean));
  return templatePricebookMatches(job)
    .filter((item) => inventoryMaterialItems().some((material) => material.id === item.id))
    .filter((item) => !existingIds.has(item.id))
    .slice(0, 6);
}

function reservationMaterialOptions() {
  const names = inventoryMaterialItems().map((item) => item.name);
  return names.length ? names : ["No saved materials"];
}

function reservationItemByName(name = "") {
  const needle = normalizedInventoryName(name);
  return inventoryMaterialItems().find((item) => normalizedInventoryName(item.name) === needle) || null;
}

function updateInventoryUsage(part = {}, context = {}) {
  const match = inventoryItemForPartName(part.name);
  if (!match) return null;
  const qty = Math.max(0, Math.round(partQuantity(part)));
  const useTruckStock = String(part.source || "").toLowerCase() === "truck stock";
  state.pricebookItems = state.pricebookItems.map((item) => {
    const normalized = normalizePricebookItem(item);
    if (normalized.id !== match.id) return normalized;
    const nextStock = useTruckStock ? Math.max(0, normalized.truckStock - qty) : normalized.truckStock;
    const movement = useTruckStock && qty
      ? stockMovement("used", -qty, normalized.truckStock, nextStock, {
        jobId: context.job?.id || context.jobId || "",
        jobName: context.job?.name || context.jobName || "",
        note: `${qty} ${normalized.unit}${qty === 1 ? "" : "s"} used from on-hand inventory${context.job?.name ? ` on ${context.job.name}` : ""}`
      })
      : null;
    return {
      ...normalized,
      truckStock: nextStock,
      lastUsedAt: new Date().toISOString(),
      usageCount: normalized.usageCount + qty,
      movements: movement ? [movement, ...normalized.movements].slice(0, 80) : normalized.movements,
      updatedAt: new Date().toISOString()
    };
  });
  return match;
}

function loggedPartAggregates() {
  const groups = new Map();
  state.jobs.forEach((job) => {
    (job.parts || []).forEach((rawPart, index) => {
      const part = normalizeJobPart(rawPart, index);
      if (!part.name) return;
      const key = normalizedInventoryName(part.name);
      const current = groups.get(key) || {
        name: part.name,
        qty: 0,
        uses: 0,
        lastUsedAt: "",
        defaultCost: 0,
        source: part.source
      };
      current.qty += partQuantity(part);
      current.uses += 1;
      current.lastUsedAt = [current.lastUsedAt, part.updatedAt, part.createdAt].filter(Boolean).sort().pop() || current.lastUsedAt;
      current.defaultCost = current.defaultCost || partUnitCost(part);
      groups.set(key, current);
    });
  });
  return [...groups.values()].sort((a, b) => b.uses - a.uses || a.name.localeCompare(b.name));
}

function unsavedFrequentLoggedParts() {
  return loggedPartAggregates()
    .filter((part) => !inventoryItemForPartName(part.name) && part.uses >= 2)
    .slice(0, 8);
}

function inventoryWarnings(row = {}) {
  const warnings = [];
  if (row.kind === "pricebook" && row.reorderPoint > 0 && row.truckStock <= row.reorderPoint) warnings.push("low on hand");
  if (row.kind === "pricebook" && row.reservedQty > row.truckStock) warnings.push("reservation shortage");
  if (row.defaultCost <= 0) warnings.push("missing default cost");
  if (row.kind === "logged") warnings.push("frequently used, not saved");
  return warnings;
}

function inventoryRows() {
  const savedRows = inventoryMaterialItems().map((item) => ({
    kind: "pricebook",
    id: item.id,
    name: item.name,
    supplier: item.preferredSupplier || "Not set",
    defaultCost: item.defaultCost,
    billRate: item.unitPrice,
    truckStock: item.truckStock,
    reservedQty: reservedQuantityForItem(item.id),
    availableQty: Math.max(0, item.truckStock - reservedQuantityForItem(item.id)),
    reorderPoint: item.reorderPoint,
    usageCount: item.usageCount,
    lastUsedAt: item.lastUsedAt
  }));
  const loggedRows = unsavedFrequentLoggedParts().map((part) => ({
    kind: "logged",
    id: normalizedInventoryName(part.name),
    name: part.name,
    supplier: part.source || "Logged part",
    defaultCost: part.defaultCost,
    billRate: partSuggestedBillRate({ cost: part.defaultCost, qty: 1 }),
    truckStock: 0,
    reorderPoint: 0,
    usageCount: part.uses,
    lastUsedAt: part.lastUsedAt
  }));
  return [...savedRows, ...loggedRows];
}

function inventoryReorderRows() {
  return inventoryMaterialItems()
    .filter((item) => item.reorderPoint > 0 && item.truckStock <= item.reorderPoint)
    .map((item) => {
      const targetStock = Math.max(item.reorderPoint * 2, item.reorderPoint + 1);
      const suggestedQty = suggestedReorderQuantity(item);
      const estimatedCost = suggestedQty * Math.max(0, item.defaultCost);
      return {
        ...item,
        targetStock,
        suggestedQty,
        estimatedCost,
        supplierLabel: item.preferredSupplier || "Supplier not set",
        urgency: item.truckStock <= 0 ? "out" : "low"
      };
    })
    .sort((a, b) => {
      const urgencyDelta = (a.truckStock <= 0 ? 0 : 1) - (b.truckStock <= 0 ? 0 : 1);
      if (urgencyDelta) return urgencyDelta;
      return a.supplierLabel.localeCompare(b.supplierLabel) || a.name.localeCompare(b.name);
    });
}

function inventoryReorderTotal(rows = inventoryReorderRows()) {
  return rows.reduce((sum, row) => sum + row.estimatedCost, 0);
}

function normalizedSupplierName(value = "") {
  const supplier = String(value || "").trim();
  return supplier || "Supplier not set";
}

function inventorySupplierRows() {
  const suppliers = new Map();
  const reorderRows = inventoryReorderRows();
  const pendingOrders = inventoryPendingOrders();
  const reorderByItem = new Map(reorderRows.map((row) => [row.id, row]));
  const ordersByItem = pendingOrders.reduce((groups, row) => {
    if (!groups.has(row.item.id)) groups.set(row.item.id, []);
    groups.get(row.item.id).push(row);
    return groups;
  }, new Map());

  inventoryMaterialItems().forEach((item) => {
    const supplierName = normalizedSupplierName(item.preferredSupplier);
    const record = supplierRecordByName(supplierName);
    const current = suppliers.get(supplierName) || {
      id: normalizedInventoryName(supplierName),
      supplier: supplierName,
      record,
      items: [],
      itemCount: 0,
      reorderCount: 0,
      pendingCount: 0,
      reorderEstimate: 0,
      pendingEstimate: 0,
      lowStockNames: [],
      pendingNames: [],
      orderGroups: [],
      lastUsedAt: ""
    };
    current.record = record;
    const reorder = reorderByItem.get(item.id);
    const orders = ordersByItem.get(item.id) || [];
    current.items.push(item);
    current.itemCount += 1;
    current.lastUsedAt = [current.lastUsedAt, item.lastUsedAt].filter(Boolean).sort().pop() || current.lastUsedAt;
    if (reorder) {
      current.reorderCount += 1;
      current.reorderEstimate += reorder.estimatedCost || 0;
      current.lowStockNames.push(`${reorder.name} (${reorder.truckStock} left)`);
    }
    if (orders.length) {
      current.pendingCount += orders.length;
      current.pendingEstimate += orders.reduce((sum, orderRow) => sum + orderRow.estimatedCost, 0);
      current.pendingNames.push(...orders.map((orderRow) => `${orderRow.item.name} x ${orderRow.order.qty}`));
    }
    suppliers.set(supplierName, current);
  });

  supplierRecords().forEach((record) => {
    const supplierName = normalizedSupplierName(record.name);
    if (suppliers.has(supplierName)) return;
    suppliers.set(supplierName, {
      id: normalizedInventoryName(supplierName),
      supplier: supplierName,
      record,
      items: [],
      itemCount: 0,
      reorderCount: 0,
      pendingCount: 0,
      reorderEstimate: 0,
      pendingEstimate: 0,
      lowStockNames: [],
      pendingNames: [],
      orderGroups: [],
      lastUsedAt: ""
    });
  });

  suppliers.forEach((supplier) => {
    supplier.orderGroups = inventoryPurchaseOrderGroups(supplier.supplier).slice(0, 4);
  });

  return [...suppliers.values()]
    .sort((a, b) =>
      (b.reorderCount - a.reorderCount) ||
      (b.pendingCount - a.pendingCount) ||
      a.supplier.localeCompare(b.supplier)
    );
}

function inventorySupplierReorderText(supplierName = "") {
  const supplier = normalizedSupplierName(supplierName);
  const rows = inventoryReorderRows().filter((row) => normalizedSupplierName(row.preferredSupplier) === supplier);
  const company = companySettings();
  const lines = [
    `${company.companyName || "Backline"} reorder list - ${supplier}`,
    formatDateLabel(new Date().toISOString(), { includeYear: true }),
    ""
  ];
  rows.forEach((row) => {
    lines.push(`${row.name} - order ${row.suggestedQty} ${row.unit}${row.suggestedQty === 1 ? "" : "s"} - on hand ${row.truckStock}, reorder at ${row.reorderPoint}${row.estimatedCost ? ` - est. ${formatMoney(row.estimatedCost)}` : ""}`);
  });
  lines.push("", rows.length
    ? `Estimated material cost: ${formatMoney(inventoryReorderTotal(rows))}`
    : "No saved materials for this supplier are at or below reorder point.");
  return lines.join("\n");
}

function supplierRecordFromForm(form) {
  const data = new FormData(form);
  const id = String(data.get("id") || "").trim();
  const name = String(data.get("name") || "").trim();
  return normalizeSupplierRecord({
    id: id || supplierIdFromName(name),
    name,
    phone: data.get("phone"),
    email: data.get("email"),
    website: data.get("website"),
    accountNumber: data.get("accountNumber"),
    preferredContact: data.get("preferredContact"),
    deliveryNotes: data.get("deliveryNotes"),
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  });
}

function canManageSuppliers() {
  return can("invoice") || can("parts");
}

function canManageSuppliersOrRecord(detail = "") {
  if (canManageSuppliers()) return true;
  return denyAction("manage suppliers", detail);
}

function openSupplierModal(supplierName = "") {
  if (!canManageSuppliersOrRecord(supplierName ? "edit supplier" : "add supplier")) return;
  const supplier = supplierName ? supplierRecordByName(supplierName) : normalizeSupplierRecord({ name: "" });
  const form = elements.supplierForm;
  form.reset();
  if (elements.supplierFormStatus) elements.supplierFormStatus.textContent = "";
  elements.supplierModalTitle.textContent = supplierName ? "Edit supplier" : "Add supplier";
  form.elements.id.value = supplierName ? supplier.id : "";
  form.elements.name.value = supplierName === "Supplier not set" ? "" : supplier.name;
  renderSupplierPreferredContactPicker(supplier.preferredContact || "phone");
  form.elements.phone.value = supplier.phone || "";
  form.elements.email.value = supplier.email || "";
  form.elements.website.value = supplier.website || "";
  form.elements.accountNumber.value = supplier.accountNumber || "";
  form.elements.deliveryNotes.value = supplier.deliveryNotes || "";
  elements.supplierModal.showModal();
}

function saveSupplierRecord(record = {}) {
  const supplier = normalizeSupplierRecord(record);
  if (!supplier.name || supplier.name === "Supplier not set") return false;
  const existingIndex = state.suppliers.findIndex((item) =>
    normalizeSupplierName(item.name) === normalizeSupplierName(supplier.name) || item.id === supplier.id
  );
  if (existingIndex >= 0) {
    const existing = normalizeSupplierRecord(state.suppliers[existingIndex]);
    state.suppliers[existingIndex] = normalizeSupplierRecord({
      ...existing,
      ...supplier,
      id: existing.id || supplier.id,
      createdAt: existing.createdAt || supplier.createdAt,
      createdBy: existing.createdBy || supplier.createdBy
    });
  } else {
    state.suppliers.push(normalizeSupplierRecord({
      ...supplier,
      createdAt: supplier.createdAt || new Date().toISOString(),
      createdBy: supplier.createdBy || accountDisplayName()
    }));
  }
  recordActivity({
    type: "updated",
    label: existingIndex >= 0 ? "Supplier updated" : "Supplier added",
    detail: supplier.name
  });
  save();
  render();
  return true;
}

function submitSupplierForm(form = elements.supplierForm) {
  if (!form) return false;
  if (elements.supplierFormStatus) elements.supplierFormStatus.textContent = "";
  try {
    const supplier = supplierRecordFromForm(form);
    if (!supplier.name || supplier.name === "Supplier not set") {
      if (elements.supplierFormStatus) elements.supplierFormStatus.textContent = "Enter a supplier name before saving.";
      form.elements.name?.focus();
      return false;
    }
    if (!saveSupplierRecord(supplier)) {
      if (elements.supplierFormStatus) elements.supplierFormStatus.textContent = "Supplier could not be saved. Check the name and try again.";
      return false;
    }
    elements.supplierModal?.close("saved");
    showToast("Supplier saved", `${supplier.name} is updated in the supplier directory.`, "success");
    return true;
  } catch (error) {
    console.error("Supplier save failed", error);
    if (elements.supplierFormStatus) elements.supplierFormStatus.textContent = "Supplier could not be saved. Refresh Backline and try again.";
    return false;
  }
}

function inventoryReorderText(rows = inventoryReorderRows()) {
  const company = companySettings();
  const lines = [
    `${company.companyName || "Backline"} reorder list`,
    formatDateLabel(new Date().toISOString(), { includeYear: true }),
    ""
  ];
  rows.forEach((row) => {
    lines.push(`${row.name} - order ${row.suggestedQty} ${row.unit}${row.suggestedQty === 1 ? "" : "s"} - on hand ${row.truckStock}, reorder at ${row.reorderPoint} - ${row.supplierLabel}${row.estimatedCost ? ` - est. ${formatMoney(row.estimatedCost)}` : ""}`);
  });
  if (rows.length) {
    lines.push("", `Estimated material cost: ${formatMoney(inventoryReorderTotal(rows))}`);
  } else {
    lines.push("No saved materials are at or below reorder point.");
  }
  return lines.join("\n");
}

function openReorderCopyModal(text = "") {
  if (!elements.reorderCopyModal || !elements.reorderCopyText) return;
  elements.reorderCopyText.value = String(text || "");
  try {
    if (!elements.reorderCopyModal.open) {
      elements.reorderCopyModal.showModal();
    }
  } catch {
    elements.reorderCopyModal.setAttribute("open", "");
  }
  requestAnimationFrame(() => {
    elements.reorderCopyText.focus();
    elements.reorderCopyText.select();
  });
}

function inventoryPendingOrders() {
  return inventoryMaterialItems()
    .flatMap((item) => item.orders
      .filter((order) => order.status === "ordered" && inventoryOrderRemainingQty(order) > 0)
      .map((order) => ({
        item,
        order,
        estimatedCost: inventoryOrderRemainingQty(order) * order.unitCost
      })))
    .sort((a, b) => String(a.order.expectedDate || "9999-12-31").localeCompare(String(b.order.expectedDate || "9999-12-31")) || a.item.name.localeCompare(b.item.name));
}

function inventoryOrderById(itemId = "", orderId = "") {
  const item = pricebookItemById(itemId);
  const order = item?.orders.find((candidate) => candidate.id === orderId) || null;
  return { item, order };
}

function inventoryOrderRemainingQty(order = {}) {
  const normalized = normalizeInventoryOrder(order);
  return Math.max(0, normalized.qty - normalized.receivedQty);
}

function inventoryOrderStatusFromQty(order = {}) {
  const normalized = normalizeInventoryOrder(order);
  if (normalized.status === "cancelled") return "cancelled";
  return inventoryOrderRemainingQty(normalized) > 0 ? "ordered" : "received";
}

function purchaseOrderNumberFromId(id = createId()) {
  const suffix = String(id || createId()).replace(/\W/g, "").slice(-6).toUpperCase() || "000001";
  return `PO-${suffix}`;
}

function inventoryPurchaseOrderGroups(supplierName = "") {
  const supplier = normalizedSupplierName(supplierName);
  const groups = new Map();
  inventoryMaterialItems().forEach((item) => {
    item.orders.forEach((rawOrder) => {
      const order = normalizeInventoryOrder(rawOrder);
      if (normalizedSupplierName(order.supplier || item.preferredSupplier) !== supplier) return;
      const groupId = order.purchaseOrderId || order.id;
      const group = groups.get(groupId) || {
        id: groupId,
        number: order.purchaseOrderNumber || purchaseOrderNumberFromId(groupId),
        supplier,
        status: "received",
        createdAt: order.orderedAt,
        expectedDate: order.expectedDate,
        note: order.note,
        lines: [],
        total: 0,
        remainingQty: 0,
        receivedQty: 0
      };
      group.remainingQty += inventoryOrderRemainingQty(order);
      group.receivedQty += order.receivedQty;
      group.status = group.remainingQty > 0 ? "ordered" : "received";
      group.expectedDate = group.expectedDate || order.expectedDate;
      group.note = group.note || order.note;
      group.createdAt = [group.createdAt, order.orderedAt].filter(Boolean).sort()[0] || group.createdAt;
      group.lines.push({ item, order });
      group.total += order.qty * order.unitCost;
      groups.set(groupId, group);
    });
  });
  return [...groups.values()].sort((a, b) => {
    const statusDelta = (a.status === "ordered" ? 0 : 1) - (b.status === "ordered" ? 0 : 1);
    if (statusDelta) return statusDelta;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

function inventoryPurchaseOrders() {
  const groups = new Map();
  inventoryMaterialItems().forEach((item) => {
    item.orders.forEach((rawOrder) => {
      const order = normalizeInventoryOrder(rawOrder);
      const groupId = order.purchaseOrderId || order.id;
      const supplier = normalizedSupplierName(order.supplier || item.preferredSupplier);
      const group = groups.get(groupId) || {
        id: groupId,
        number: order.purchaseOrderNumber || purchaseOrderNumberFromId(groupId),
        supplier,
        createdAt: order.orderedAt,
        expectedDate: order.expectedDate,
        note: order.note,
        lines: [],
        orderedQty: 0,
        receivedQty: 0,
        remainingQty: 0,
        orderedTotal: 0,
        remainingTotal: 0
      };
      const remainingQty = order.status === "cancelled" ? 0 : inventoryOrderRemainingQty(order);
      group.expectedDate = group.expectedDate || order.expectedDate;
      group.note = group.note || order.note;
      group.createdAt = [group.createdAt, order.orderedAt].filter(Boolean).sort()[0] || group.createdAt;
      group.orderedQty += order.qty;
      group.receivedQty += order.receivedQty;
      group.remainingQty += remainingQty;
      group.orderedTotal += order.qty * order.unitCost;
      group.remainingTotal += remainingQty * order.unitCost;
      group.lines.push({ item, order, remainingQty });
      groups.set(groupId, group);
    });
  });
  return [...groups.values()]
    .map((group) => ({ ...group, status: inventoryPurchaseOrderStatus(group) }))
    .sort((a, b) => {
      const order = { late: 0, partial: 1, open: 2, received: 3, cancelled: 4 };
      const statusDelta = (order[a.status] ?? 9) - (order[b.status] ?? 9);
      if (statusDelta) return statusDelta;
      return String(a.expectedDate || "9999-12-31").localeCompare(String(b.expectedDate || "9999-12-31")) || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
}

function inventoryPurchaseOrderStatus(orderGroup = {}) {
  const lines = orderGroup.lines || [];
  if (lines.length && lines.every(({ order }) => normalizeInventoryOrder(order).status === "cancelled")) return "cancelled";
  if (orderGroup.remainingQty <= 0) return "received";
  if (orderGroup.expectedDate && orderGroup.expectedDate < todayISO()) return "late";
  if (orderGroup.receivedQty > 0) return "partial";
  return "open";
}

function inventoryPurchaseOrderById(purchaseOrderId = "") {
  const id = String(purchaseOrderId || "").trim();
  return inventoryPurchaseOrders().find((order) => order.id === id) || null;
}

function inventoryOrderFilterLabel(filter = "") {
  return {
    open: "Open",
    partial: "Partially received",
    late: "Late",
    received: "Received",
    cancelled: "Cancelled"
  }[filter] || "Open";
}

function inventoryPurchaseOrderLines(purchaseOrderId = "") {
  const id = String(purchaseOrderId || "").trim();
  if (!id) return [];
  return inventoryMaterialItems()
    .flatMap((item) => item.orders.map((rawOrder) => ({ item, order: normalizeInventoryOrder(rawOrder) })))
    .filter(({ order }) => (order.purchaseOrderId || order.id) === id && order.status === "ordered" && inventoryOrderRemainingQty(order) > 0)
    .sort((a, b) => a.item.name.localeCompare(b.item.name));
}

function suggestedReorderQuantity(item = {}) {
  const normalized = normalizePricebookItem(item);
  const targetStock = Math.max(normalized.reorderPoint * 2, normalized.reorderPoint + 1);
  return Math.max(1, targetStock - normalized.truckStock);
}

function recordInventoryOrderActivity(label = "", detail = "", changes = []) {
  recordActivity({
    type: "updated",
    label,
    detail,
    changes
  });
}

function inventoryUsageTarget(key = "") {
  const id = String(key || "").trim();
  const item = pricebookItemById(id);
  if (item) {
    return {
      key: item.id,
      name: item.name,
      label: item.name,
      normalizedName: normalizedInventoryName(item.name),
      item,
      saved: true
    };
  }
  const normalizedKey = normalizedInventoryName(id);
  const aggregate = loggedPartAggregates().find((part) => normalizedInventoryName(part.name) === normalizedKey);
  return {
    key: normalizedKey,
    name: aggregate?.name || key,
    label: aggregate?.name || key,
    normalizedName: normalizedKey,
    item: null,
    saved: false
  };
}

function inventoryUsageRows(key = "") {
  const target = inventoryUsageTarget(key);
  if (!target.normalizedName) return [];
  return roleScopedJobs()
    .flatMap((job) => {
      ensureJobDefaults(job);
      return (job.parts || []).map((rawPart, index) => {
      const part = normalizeJobPart(rawPart, index);
      const matchesLinkedItem = target.item && part.pricebookItemId === target.item.id;
      const matchesName = normalizedInventoryName(part.name) === target.normalizedName;
      if (!part.name || (!matchesLinkedItem && !matchesName)) return null;
      const invoice = invoiceRecord(job);
      return {
        job,
        part,
        partIndex: index,
        billed: isPartBilled(job, part),
        line: invoiceLineForPart(invoice, part),
        createdAt: part.updatedAt || part.createdAt || job.updatedAt || job.createdAt || ""
      };
    });
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function inventoryUsageTotals(rows = []) {
  return rows.reduce((totals, row) => {
    totals.quantity += partQuantity(row.part);
    totals.cost += partCostTotal(row.part);
    totals.billed += row.billed ? 1 : 0;
    totals.unbilled += row.billed ? 0 : 1;
    totals.missingCost += partUnitCost(row.part) > 0 ? 0 : 1;
    return totals;
  }, { quantity: 0, cost: 0, billed: 0, unbilled: 0, missingCost: 0 });
}

function inventoryStockMovementRows(target = {}) {
  if (!target.item) return [];
  return target.item.movements
    .map(normalizeStockMovement)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function stockMovementLabel(movement = {}) {
  const type = String(movement.type || "").toLowerCase();
  if (type === "received") return "Received";
  if (type === "used") return "Used";
  if (type === "ordered") return "Ordered";
  if (type === "adjustment") return "Adjusted";
  return type ? type.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Movement";
}

function renderInventoryUsageModal(key = "") {
  if (!elements.inventoryUsageContent) return;
  const target = inventoryUsageTarget(key);
  const rows = inventoryUsageRows(key);
  const totals = inventoryUsageTotals(rows);
  const movements = inventoryStockMovementRows(target);
  elements.inventoryUsageModal.dataset.inventoryUsageKey = key;
  elements.inventoryUsageContent.innerHTML = `
    <div class="activity-detail-header">
      <div>
        <p class="eyebrow">Inventory usage</p>
        <h2>${escapeHtml(target.label || "Part usage")}</h2>
        <p>${escapeHtml(rows.length ? `${rows.length} logged use${rows.length === 1 ? "" : "s"} across jobs.` : "No jobs have logged this part yet.")}</p>
      </div>
      <span class="pill ${escapeHtml(totals.unbilled ? "estimated" : "paid")}">${escapeHtml(totals.unbilled ? `${totals.unbilled} unbilled` : "All billed")}</span>
    </div>
    <div class="activity-detail-grid">
      ${activityDetailStat("Logged uses", rows.length)}
      ${activityDetailStat("Billed", totals.billed)}
      ${activityDetailStat("Unbilled", totals.unbilled)}
      ${activityDetailStat("Quantity used", totals.quantity)}
      ${activityDetailStat("Total cost", formatMoney(totals.cost))}
    </div>
    <section class="activity-detail-section">
      <div class="section-heading">
        <div>
          <h3>Job usage</h3>
          <p>Customer, date, technician, quantity, source, cost, and billing status.</p>
        </div>
      </div>
      <div class="inventory-usage-list">
        ${rows.length ? rows.map((row) => `
          <article class="inventory-usage-row ${row.billed ? "billed" : "unbilled"}">
            <span>
              <strong>${escapeHtml(row.job.name)}</strong>
              <small>${escapeHtml(row.job.issue || "No issue noted")}</small>
            </span>
            <span>
              <strong>${escapeHtml(formatDateLabel(row.createdAt || row.job.createdAt, { includeYear: true }))}</strong>
              <small>${escapeHtml(scheduleText(row.job, { includeYear: true }))}</small>
            </span>
            <span>
              <strong>${escapeHtml(technicianDisplayName(row.job.technician))}</strong>
              <small>${escapeHtml(`${row.part.qty || "1"} from ${row.part.source === "truck stock" ? "on hand" : row.part.source || "on hand"}`)}</small>
            </span>
            <span>
              <strong>${escapeHtml(partUnitCost(row.part) ? formatMoney(partUnitCost(row.part)) : "Missing cost")}</strong>
              <small>${escapeHtml(row.billed ? "Billed" : "Not billed")}</small>
            </span>
            <span class="inventory-row-actions">
              <button class="utility-button" type="button" data-inventory-open-job="${escapeHtml(row.job.id)}">Open job</button>
              ${!row.billed && can("invoice") && !isLockedBillingJob(row.job) ? `<button class="utility-button" type="button" data-inventory-add-part-line data-job-id="${escapeHtml(row.job.id)}" data-part-index="${escapeHtml(row.partIndex)}" data-usage-key="${escapeHtml(key)}">Add to invoice</button>` : ""}
            </span>
          </article>
        `).join("") : '<div class="empty-note">Usage will appear here when technicians log this part on jobs.</div>'}
      </div>
    </section>
    ${target.saved ? `
      <section class="activity-detail-section">
        <div class="section-heading">
          <div>
            <h3>On-hand history</h3>
            <p>Ordered, received, used, and adjusted inventory movements for this material.</p>
          </div>
        </div>
        <div class="stock-movement-list">
          ${movements.length ? movements.map((movement) => `
            <article class="stock-movement-row ${escapeHtml(movement.type)}">
              <span>
                <strong>${escapeHtml(stockMovementLabel(movement))}</strong>
                <small>${escapeHtml(movement.note || movement.purchaseOrderNumber || movement.jobName || "No note")}</small>
              </span>
              <span>
                <strong>${escapeHtml(movement.qty > 0 ? `+${movement.qty}` : String(movement.qty))}</strong>
                <small>${escapeHtml(`${movement.beforeQty} -> ${movement.afterQty} on hand`)}</small>
              </span>
              <span>
                <strong>${escapeHtml(formatDateLabel(movement.createdAt, { includeYear: true }))}</strong>
                <small>${escapeHtml(movement.createdBy || "Backline")}</small>
              </span>
            </article>
          `).join("") : '<div class="empty-note">On-hand changes will appear here when material is ordered, received, used, or adjusted.</div>'}
        </div>
      </section>
    ` : ""}
  `;
}

function openInventoryUsageModal(key = "") {
  if (!elements.inventoryUsageModal || !key) return;
  renderInventoryUsageModal(key);
  elements.inventoryUsageModal.classList.remove("fallback-open");
  try {
    if (!elements.inventoryUsageModal.open) {
      elements.inventoryUsageModal.showModal();
    }
  } catch {
    elements.inventoryUsageModal.setAttribute("open", "");
    elements.inventoryUsageModal.classList.add("fallback-open");
  }
}

function jobPartsCost(job = {}) {
  return (job.parts || []).reduce((sum, part) => sum + partCostTotal(part), 0);
}

function jobHasLaborWindow(job = {}) {
  return isScheduled(job) || ["in_progress", "completed", "estimated", "invoiced", "paid", "closed"].includes(job.status);
}

function jobLaborCost(job = {}) {
  if (!jobHasLaborWindow(job)) return 0;
  return (jobDurationMinutes(job) / 60) * companySettings().defaultLaborCostRate;
}

function jobRevenue(job = {}) {
  const invoice = invoiceRecord(job);
  return Math.max(0, invoice.amount || estimateAmount(job) || normalizeValue(job.value));
}

function jobCostingSummary(job = {}) {
  const revenue = jobRevenue(job);
  const invoice = invoiceRecord(job);
  const collected = invoiceCollectedAmount(invoice);
  const partsCost = jobPartsCost(job);
  const laborCost = jobLaborCost(job);
  const directCost = partsCost + laborCost;
  const grossMargin = revenue - directCost;
  const marginPercent = revenue > 0 ? Math.round((grossMargin / revenue) * 100) : 0;
  const targetMargin = companySettings().targetMarginPercent;
  const unpriced = revenue <= 0 && directCost > 0;
  const atRisk = revenue > 0 && marginPercent < targetMargin;
  return {
    revenue,
    collected,
    partsCost,
    laborCost,
    directCost,
    grossMargin,
    marginPercent,
    targetMargin,
    status: unpriced ? "unpriced" : atRisk ? "at-risk" : revenue > 0 ? "healthy" : "pending",
    label: unpriced ? "Needs price" : atRisk ? "Below target" : revenue > 0 ? "On target" : "Pending"
  };
}

function jobHasMissingPartCosts(job = {}) {
  return (job.parts || []).some((part) => partUnitCost(part) <= 0);
}

function unbilledJobParts(job = {}) {
  ensureJobDefaults(job);
  return (job.parts || [])
    .map((part, index) => ({ part: normalizeJobPart(part, index), index }))
    .filter(({ part }) => part.name && !isPartBilled(job, part));
}

function missingCostJobParts(job = {}) {
  ensureJobDefaults(job);
  return (job.parts || [])
    .map((part, index) => ({ part: normalizeJobPart(part, index), index }))
    .filter(({ part }) => part.name && partUnitCost(part) <= 0);
}

function billingReviewItems(job = {}) {
  ensureJobDefaults(job);
  const invoice = invoiceRecord(job);
  const costing = jobCostingSummary(job);
  const unbilledParts = unbilledJobParts(job);
  const missingCostParts = missingCostJobParts(job);
  const lowMargin = invoice.amount > 0 && costing.directCost > 0 && costing.marginPercent < costing.targetMargin;
  const hasLineItems = (invoice.lineItems || []).length > 0;
  const ready = hasLineItems && !unbilledParts.length && !missingCostParts.length && !lowMargin && invoice.status !== "paid";
  const items = [];

  if (unbilledParts.length) {
    items.push({
      type: "unbilled-parts",
      tone: "warning",
      title: `${unbilledParts.length} unbilled part${unbilledParts.length === 1 ? "" : "s"}`,
      detail: "Logged material is not on the invoice yet.",
      action: "Add all unbilled parts",
      actionAttribute: "data-add-parts-lines"
    });
  }

  if (missingCostParts.length) {
    items.push({
      type: "missing-costs",
      tone: "warning",
      title: `${missingCostParts.length} part${missingCostParts.length === 1 ? "" : "s"} missing cost`,
      detail: "Margin may be wrong until unit costs are filled in.",
      action: "Review missing costs",
      actionAttribute: 'data-action="parts"'
    });
  }

  if (lowMargin) {
    items.push({
      type: "low-margin",
      tone: "danger",
      title: "Below target margin",
      detail: `${costing.marginPercent}% margin vs ${costing.targetMargin}% target.`,
      action: "Review pricing",
      actionAttribute: 'data-action="invoice"'
    });
  }

  if (!hasLineItems) {
    items.push({
      type: "no-lines",
      tone: "neutral",
      title: "No invoice lines yet",
      detail: "Add an estimate, pricebook item, custom line, or logged part.",
      action: "Add line",
      actionAttribute: 'data-action="invoice"'
    });
  } else if (ready) {
    items.push({
      type: "ready",
      tone: "success",
      title: "Ready to send",
      detail: "Invoice has billable work and no obvious part or margin warnings.",
      action: "Send invoice",
      actionAttribute: 'data-action="invoice"'
    });
  } else if (invoice.status === "paid") {
    items.push({
      type: "paid",
      tone: "success",
      title: "Paid in full",
      detail: "Collected payments cover the current invoice total.",
      action: "",
      actionAttribute: ""
    });
  }

  return items;
}

function profitWatchItems(job = {}) {
  if (!canViewJobCosting()) return [];
  const costing = jobCostingSummary(job);
  const invoice = invoiceRecord(job);
  const active = !["closed"].includes(job.status);
  const items = [];

  if (active && costing.revenue > 0 && costing.directCost > 0 && costing.marginPercent < costing.targetMargin) {
    items.push({
      type: "below_margin",
      tone: "urgent",
      badge: "Below margin",
      title: `${job.name} is below target margin`,
      detail: `${costing.marginPercent}% margin vs ${costing.targetMargin}% target`,
      action: "Review pricing",
      actionType: "invoice"
    });
  }

  if (active && jobHasMissingPartCosts(job)) {
    items.push({
      type: "missing_part_cost",
      tone: "open",
      badge: "Missing part cost",
      title: `${job.name} has parts without cost`,
      detail: "One or more logged parts are missing unit cost",
      action: "Add cost",
      actionType: "parts"
    });
  }

  if (active && costing.laborCost > 0 && costing.revenue <= 0) {
    items.push({
      type: "unpriced_labor",
      tone: "estimated",
      badge: "Unpriced labor",
      title: `${job.name} has labor without revenue`,
      detail: `${formatMoney(costing.laborCost)} estimated labor cost is not billed yet`,
      action: "Add invoice line",
      actionType: "invoice"
    });
  }

  if (active && costing.collected > invoice.amount && costing.collected > 0) {
    items.push({
      type: "collected_over_billed",
      tone: "invoiced",
      badge: "Check billing",
      title: `${job.name} collected more than billed`,
      detail: `${formatMoney(costing.collected)} collected against ${formatMoney(invoice.amount)} billed`,
      action: "Review billing",
      actionType: "invoice"
    });
  }

  if (active && invoice.amount > 0 && invoiceBalance(job) <= 0 && costing.marginPercent >= costing.targetMargin && ["paid", "invoiced", "completed"].includes(job.status) && closeoutSummary(job).ready) {
    items.push({
      type: "ready_to_close",
      tone: "paid",
      badge: "Ready to close",
      title: `${job.name} is ready to close profitably`,
      detail: `${costing.marginPercent}% margin and no balance due`,
      action: "Close job",
      actionType: "close"
    });
  }

  return items;
}

function primaryProfitWatchItem(job = {}) {
  return profitWatchItems(job)[0] || null;
}

function renderProfitWatchBadges(job = {}) {
  const items = profitWatchItems(job).slice(0, 2);
  if (!items.length) return "";
  return `<span class="job-profit-badges">${items.map((item) => `<span class="pill profit ${escapeHtml(item.tone)}">${escapeHtml(item.badge)}</span>`).join("")}</span>`;
}

function jobCountLabel(count) {
  return `${count} ${count === 1 ? "job" : "jobs"}`;
}

function invoiceStatusLabel(status) {
  const labels = {
    draft: "Draft",
    sent: "Sent",
    partial: "Partial",
    paid: "Paid",
    overdue: "Overdue"
  };
  return labels[status] || statusLabel(status);
}

function isLockedBillingJob(job = {}) {
  return ["paid", "closed"].includes(job.status);
}

function canCloseJob(job = {}) {
  if (!can("close") || job.status === "closed") return false;
  const invoice = invoiceRecord(job);
  return invoice.amount > 0 && invoiceBalance(job) <= 0 && invoiceCollectedAmount(invoice) >= invoice.amount;
}

function closeoutMessageTimestamp(message = {}) {
  const date = new Date(normalizeJobMessage(message).createdAt || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function customerCompletionUpdateSent(job = {}) {
  ensureJobDefaults(job);
  const completedAt = new Date(job.completedAt || job.updatedAt || job.createdAt || 0).getTime() || 0;
  return job.messages
    .map(normalizeJobMessage)
    .some((message) => {
      const body = String(message.body || "").toLowerCase();
      const isCustomerFacing = message.customerVisible || ["out", "portal"].includes(message.direction);
      const isAdministrative = /approval link|payment request|review request|leave us a quick review|customer portal link/.test(body);
      const sentAt = closeoutMessageTimestamp(message);
      return isCustomerFacing && !isAdministrative && (!completedAt || !sentAt || sentAt >= completedAt);
    });
}

function closeoutChecklistItems(job = {}) {
  ensureJobDefaults(job);
  const invoice = invoiceRecord(job);
  const balance = invoiceBalance(job);
  const collected = invoiceCollectedAmount(invoice);
  const unbilledParts = unbilledJobParts(job);
  const missingCostParts = missingCostJobParts(job);
  const openTasks = visibleJobTasks(job).filter((task) => !task.done);
  const checklistValues = Object.values(job.fieldChecklist || {});
  const checklistComplete = checklistValues.length > 0 && checklistValues.every(Boolean);
  const hasCustomerProof = job.fieldChecklist.signature || job.approvalStatus === "approved" || (job.files || []).some((file) => String(file.source || "").includes("approval"));
  const hasInvoice = invoice.amount > 0;
  const paidInFull = hasInvoice && balance <= 0 && collected >= invoice.amount;
  const canCreateFromEstimate = canCreateInvoiceFromEstimate(job);
  const reviewQueued = (job.notifications || []).some((notification) => notification.type === "review_request");
  const reviewNeeded = state.automations.reviewRequest && paidInFull;
  const customerUpdated = customerCompletionUpdateSent(job);
  const equipmentDue = (job.equipment || []).map(normalizeEquipmentRecord).filter((record) => record.nextServiceDate && record.nextServiceDate <= addDaysISO(45));
  const items = [
    {
      key: "field",
      title: checklistComplete ? "Field checklist complete" : "Field checklist open",
      detail: checklistComplete ? fieldChecklistProgress(job) : `${fieldChecklistProgress(job)} complete before closeout`,
      status: checklistComplete ? "done" : "warning",
      action: checklistComplete ? "" : "complete",
      actionLabel: "Complete field"
    },
    {
      key: "tasks",
      title: openTasks.length ? `${openTasks.length} open task${openTasks.length === 1 ? "" : "s"}` : "Tasks clear",
      detail: openTasks.length ? openTasks.slice(0, 4).map((task) => task.title).join(" - ") : taskProgress(job),
      status: openTasks.length ? "blocked" : "done",
      action: openTasks.length ? "tasks" : "",
      actionLabel: "Review tasks"
    },
    {
      key: "parts",
      title: unbilledParts.length ? `${unbilledParts.length} unbilled part${unbilledParts.length === 1 ? "" : "s"}` : "Parts billed or clear",
      detail: unbilledParts.length ? "Logged material still needs to be added to the invoice." : "No unbilled logged material.",
      status: unbilledParts.length ? "blocked" : "done",
      action: unbilledParts.length ? "invoice" : "",
      actionLabel: "Add to invoice"
    },
    {
      key: "costs",
      title: missingCostParts.length ? `${missingCostParts.length} missing part cost${missingCostParts.length === 1 ? "" : "s"}` : "Costs reviewed",
      detail: missingCostParts.length ? "Fill missing costs before trusting margin." : "Logged parts have usable costs.",
      status: missingCostParts.length ? "warning" : "done",
      action: missingCostParts.length ? "parts" : "",
      actionLabel: "Add costs"
    },
    {
      key: "invoice",
      title: hasInvoice ? "Invoice exists" : "Invoice missing",
      detail: hasInvoice ? `${formatMoney(invoice.amount)} billed.` : canCreateFromEstimate ? "Approved estimate can become an invoice." : "Create an invoice before closing.",
      status: hasInvoice ? "done" : "blocked",
      action: hasInvoice ? "" : canCreateFromEstimate ? "create_invoice_from_estimate" : "invoice",
      actionLabel: canCreateFromEstimate ? "Create invoice" : "Create invoice"
    },
    {
      key: "payment",
      title: paidInFull ? "Paid in full" : "Balance remains",
      detail: hasInvoice ? `${formatMoney(collected)} collected / ${formatMoney(invoice.amount)} billed${balance > 0 ? ` - ${formatMoney(balance)} due` : ""}` : "No invoice balance can be calculated yet.",
      status: paidInFull ? "done" : "blocked",
      action: paidInFull ? "" : "paid",
      actionLabel: "Record payment"
    },
    {
      key: "proof",
      title: hasCustomerProof ? "Customer proof captured" : "Customer proof missing",
      detail: hasCustomerProof ? "Signature, approval, or approval PDF is attached." : "Capture signature or approval before closeout when possible.",
      status: hasCustomerProof ? "done" : "warning",
      action: hasCustomerProof ? "" : "check-signature",
      actionLabel: "Capture proof"
    },
    {
      key: "customer-update",
      title: customerUpdated ? "Customer update sent" : "Customer update not sent",
      detail: customerUpdated ? "Customer has a visible completion/status update." : "Send a short completion update so the customer knows where things stand.",
      status: customerUpdated ? "done" : "warning",
      action: customerUpdated ? "" : "portal-update",
      actionLabel: "Send update"
    },
    {
      key: "review",
      title: !state.automations.reviewRequest ? "Review automation off" : reviewQueued ? "Review request sent" : paidInFull ? "Review request ready" : "Review waits for payment",
      detail: !state.automations.reviewRequest
        ? "Workspace review automation is off."
        : reviewQueued
          ? "Customer review ask was sent or logged."
          : paidInFull
            ? "Queue the review ask now that payment is complete."
            : "Backline will ask for a review after the job is paid in full.",
      status: reviewQueued || !reviewNeeded ? "done" : "warning",
      action: reviewQueued || !reviewNeeded ? "" : "review_request",
      actionLabel: "Queue review"
    },
    {
      key: "maintenance",
      title: equipmentDue.length ? `${equipmentDue.length} equipment follow-up${equipmentDue.length === 1 ? "" : "s"}` : "No immediate maintenance follow-up",
      detail: equipmentDue.length ? "Review upcoming equipment service before archiving." : "No equipment service is due soon.",
      status: equipmentDue.length ? "warning" : "done",
      action: equipmentDue.length ? "equipment" : "",
      actionLabel: "Review equipment"
    }
  ];
  return items;
}

function closeoutSummary(job = {}) {
  const items = closeoutChecklistItems(job);
  const blocked = items.filter((item) => item.status === "blocked").length;
  const warnings = items.filter((item) => item.status === "warning").length;
  const done = items.filter((item) => item.status === "done").length;
  const closed = job.status === "closed";
  return {
    items,
    blocked,
    warnings,
    done,
    closed,
    ready: closed || (blocked === 0 && canCloseJob(job))
  };
}

function closeoutBlockedMessage(summary = {}) {
  if (summary.ready) return "";
  const blockers = (summary.items || []).filter((item) => item.status === "blocked").map((item) => item.title);
  if (blockers.length) {
    return `Closeout blocked: ${blockers.slice(0, 3).join(", ")}${blockers.length > 3 ? ` and ${blockers.length - 3} more` : ""}.`;
  }
  return "Closeout is not ready yet. Review the warnings before closing this job.";
}

function closeJobRecord(job = {}) {
  if (job.status === "closed") return job;
  job.status = "closed";
  job.closedAt = new Date().toISOString();
  job.closedBy = accountDisplayName();
  addJobMessage(job, {
    direction: "note",
    body: `Job closed by ${job.closedBy}. Invoice is paid in full and closeout checklist was reviewed.`
  });
  return job;
}

function paymentMethodLabel(method) {
  const labels = {
    card: "Card",
    ach: "ACH",
    cash: "Cash",
    check: "Check",
    financing: "Financing",
    other: "Other"
  };
  return labels[method] || "Not recorded";
}

function ensureJobDefaults(job) {
  ensureJobPortalToken(job);
  job.jobType ||= job.urgency === "urgent" ? "emergency" : "diagnostic";
  job.durationMinutes = job.durationMinutes ? normalizeDurationMinutes(job.durationMinutes) : inferDurationMinutes(job);
  job.siteContact ||= "";
  job.partsNote ||= "";
  job.approvalStatus ||= "not_sent";
  job.invoice = normalizeInvoiceRecord(job.invoice || {}, job);
  job.paymentRequests = paymentRequests(job);
  job.estimate = normalizeEstimateRecord(job.estimate || {}, job);
  job.estimateHistory = normalizeEstimateHistory(job.estimateHistory || [], job);
  syncEstimateHistoryWithApprovalStatus(job);
  const latestEstimate = latestEstimateRevision(job);
  if (latestEstimate) {
    job.estimate = normalizeEstimateRecord(latestEstimate, job);
    job.approvalStatus = latestEstimate.status === "draft" ? "not_sent" : latestEstimate.status;
  }
  repairInvoiceCarryforward(job);
  job.parts ||= [];
  job.parts = job.parts.map(normalizeJobPart).filter((part) => part.name);
  job.reservations ||= [];
  job.reservations = job.reservations.map(normalizeJobReservation).filter((reservation) => reservation.name || reservation.pricebookItemId);
  job.equipment ||= [];
  job.equipment = job.equipment.map(normalizeEquipmentRecord);
  job.files ||= [];
  job.messages ||= [];
  job.messages = job.messages.map(normalizeJobMessage);
  job.followupState ||= {};
  job.notifications ||= [];
  job.notifications = job.notifications.map((notification) => ({
    ...notification,
    completedBy: { ...(notification.completedBy || {}) }
  }));
  job.tasks ||= [];
  job.tasks = job.tasks.map(normalizeJobTask).filter((task) => task.title);
  job.templateKey ||= jobTemplateFor(job).key;
  job.assignmentSeenBy ||= {};
  job.scopeChanges ||= [];
  job.fieldChecklist = {
    diagnosis: false,
    photos: false,
    signature: false,
    ...(job.fieldChecklist || {})
  };
  return job;
}

function normalizeEquipmentRecord(record = {}) {
  const serviceIntervalDays = Math.max(0, Math.round(Number(record.serviceIntervalDays || record.maintenanceIntervalDays || 0) || 0));
  const lastServiceDate = record.lastServiceDate || "";
  const nextServiceDate = record.nextServiceDate || (lastServiceDate && serviceIntervalDays ? addDaysToISO(lastServiceDate, serviceIntervalDays) : "");
  return {
    id: record.id || createId(),
    type: record.type || "Equipment",
    name: record.name || "",
    model: record.model || "",
    serial: record.serial || "",
    installDate: record.installDate || "",
    warranty: record.warranty || "",
    location: record.location || "",
    condition: record.condition || "",
    serviceIntervalDays,
    lastServiceDate,
    nextServiceDate,
    notes: record.notes || "",
    createdAt: record.createdAt || new Date().toISOString(),
    createdBy: record.createdBy || accountDisplayName(),
    updatedAt: record.updatedAt || "",
    updatedBy: record.updatedBy || ""
  };
}

function equipmentRecordFromForm(form) {
  const data = new FormData(form);
  return normalizeEquipmentRecord({
    type: String(data.get("type") || "").trim() || "Equipment",
    name: String(data.get("name") || "").trim(),
    model: String(data.get("model") || "").trim(),
    serial: String(data.get("serial") || "").trim(),
    installDate: String(data.get("installDate") || ""),
    warranty: String(data.get("warranty") || "").trim(),
    location: String(data.get("location") || "").trim(),
    condition: String(data.get("condition") || "").trim(),
    serviceIntervalDays: normalizeValue(data.get("serviceIntervalDays")),
    lastServiceDate: String(data.get("lastServiceDate") || ""),
    nextServiceDate: String(data.get("nextServiceDate") || ""),
    notes: String(data.get("notes") || "").trim(),
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName()
  });
}

function normalizeJobMessage(message = {}) {
  return {
    id: message.id || `msg-${createId()}`,
    direction: message.direction || "note",
    body: message.body || "",
    createdAt: message.createdAt || new Date().toLocaleString(),
    createdBy: message.createdBy || (message.direction === "out" ? "Backline" : "Backline"),
    customerVisible: Boolean(message.customerVisible),
    seenBy: { ...(message.seenBy || {}) },
    reviewStatus: message.reviewStatus || "",
    reviewedAt: message.reviewedAt || "",
    reviewedBy: message.reviewedBy || ""
  };
}

function isCustomerPortalMessage(message = {}) {
  const normalized = normalizeJobMessage(message);
  if (normalized.customerVisible) return true;
  if (["in", "out"].includes(normalized.direction)) return true;
  return false;
}

function customerPortalMessages(job = {}) {
  return (job.messages || [])
    .map(normalizeJobMessage)
    .filter(isCustomerPortalMessage)
    .slice(-6);
}

function allCustomerPortalMessages(job = {}) {
  return (job.messages || [])
    .map(normalizeJobMessage)
    .filter(isCustomerPortalMessage);
}

function portalLastActivity(job = {}) {
  const messages = allCustomerPortalMessages(job);
  return messages.at(-1)?.createdAt || "";
}

function portalCreatedActivity(job = {}) {
  return (job.messages || [])
    .map(normalizeJobMessage)
    .find((message) => /Customer portal link (copied|created)/i.test(message.body || ""))?.createdAt || "";
}

async function submitCustomerPortalReply(token, jobId, reply) {
  const client = getSupabaseClient();
  if (client && token) {
    const { data, error } = await client.rpc("submit_customer_portal_reply", {
      input_token: token,
      input_reply: reply
    });
    if (!error && data) {
      const updatedJob = ensureJobDefaults(data);
      const index = state.jobs.findIndex((job) => job.id === updatedJob.id);
      if (index >= 0) {
        state.jobs[index] = updatedJob;
      }
      return updatedJob;
    }
    if (isPortalToken(token) || !jobId || !state.jobs.some((job) => job.id === jobId)) {
      throw error || new Error("Customer reply could not be sent.");
    }
  }

  const index = state.jobs.findIndex((job) => job.id === jobId);
  if (index < 0) throw new Error("Customer reply could not find this job.");
  const job = ensureJobDefaults(state.jobs[index]);
  addJobMessage(job, {
    direction: "in",
    body: reply,
    createdBy: job.name,
    customerVisible: true
  });
  state.jobs[index] = job;
  save();
  return job;
}

function customerPaymentResponseMessage(job = {}, data = {}) {
  const request = activePaymentRequest(job);
  const amount = normalizeValue(data.amount);
  const method = String(data.method || "").trim();
  const reference = String(data.reference || "").trim();
  const note = String(data.note || "").trim();
  return [
    `Customer submitted payment response${request ? ` for ${formatMoney(request.amount)} request` : ""}.`,
    amount ? `Amount: ${formatMoney(amount)}.` : "",
    method ? `Method: ${paymentMethodLabel(method)}.` : "",
    reference ? `Reference: ${reference}.` : "",
    note ? `Note: ${note}` : ""
  ].filter(Boolean).join(" ");
}

async function submitCustomerPortalPaymentResponse(token, jobId, data = {}) {
  const localJob = state.jobs.find((item) => item.portalToken === token || (!isPortalToken(token) && item.id === jobId));
  const message = customerPaymentResponseMessage(localJob || {}, data);
  const client = getSupabaseClient();
  if (client && token) {
    const { data: updated, error } = await client.rpc("submit_customer_portal_reply", {
      input_token: token,
      input_reply: message
    });
    if (!error && updated) {
      const updatedJob = ensureJobDefaults(updated);
      const index = state.jobs.findIndex((job) => job.id === updatedJob.id);
      if (index >= 0) state.jobs[index] = updatedJob;
      return updatedJob;
    }
    if (isPortalToken(token) || !localJob) {
      throw error || new Error("Payment response could not be sent.");
    }
  }

  const index = state.jobs.findIndex((job) => job.portalToken === token || (!isPortalToken(token) && job.id === jobId));
  if (index < 0) throw new Error("Payment response could not find this job.");
  const job = ensureJobDefaults(state.jobs[index]);
  const activeRequest = activePaymentRequest(job);
  if (activeRequest) {
    job.paymentRequests = paymentRequests(job).map((request) => request.id === activeRequest.id
      ? normalizePaymentRequest({
          ...request,
          status: "responded",
          response: message,
          responseAt: new Date().toISOString()
        }, job)
      : request);
  }
  addJobMessage(job, {
    direction: "in",
    body: message,
    createdBy: job.name,
    customerVisible: true
  });
  state.jobs[index] = job;
  save();
  return job;
}

function isPaymentReviewMessage(message = {}) {
  return normalizeJobMessage(message).body.startsWith("Customer submitted payment response");
}

function methodKeyFromLabel(value = "") {
  const normalized = String(value || "").trim().toLowerCase();
  const methods = ["card", "ach", "cash", "check", "financing", "other"];
  return methods.includes(normalized) ? normalized : "other";
}

function parsePaymentReviewMessage(message = {}) {
  const normalized = normalizeJobMessage(message);
  const body = normalized.body || "";
  const amountMatch = body.match(/Amount:\s*\$?([0-9,]+(?:\.\d{1,2})?)/i);
  const methodMatch = body.match(/Method:\s*([^.]+)\./i);
  const referenceMatch = body.match(/Reference:\s*([^.]+)\./i);
  const noteMatch = body.match(/Note:\s*([\s\S]+)$/i);
  return {
    id: normalized.id,
    amount: amountMatch ? normalizeValue(amountMatch[1].replaceAll(",", "")) : 0,
    method: methodKeyFromLabel(methodMatch?.[1]),
    methodLabel: methodMatch?.[1]?.trim() || "Not specified",
    reference: referenceMatch?.[1]?.trim() || "",
    note: noteMatch?.[1]?.trim() || "",
    createdAt: normalized.createdAt,
    createdBy: normalized.createdBy,
    reviewStatus: normalized.reviewStatus
  };
}

function paymentReviewItems() {
  return roleScopedJobs()
    .flatMap((job) => {
      ensureJobDefaults(job);
      return job.messages
        .map(normalizeJobMessage)
        .filter(isPaymentReviewMessage)
        .filter((message) => !message.reviewStatus)
        .map((message) => ({
          job,
          message,
          parsed: parsePaymentReviewMessage(message)
        }));
    })
    .sort((a, b) => new Date(b.message.createdAt || 0) - new Date(a.message.createdAt || 0));
}

function daysBetweenISO(fromISO = todayISO(), toISO = todayISO()) {
  const from = new Date(`${fromISO}T12:00:00`);
  const to = new Date(`${toISO}T12:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) return 0;
  return Math.round((to - from) / 86400000);
}

function receivableDueDate(job = {}) {
  const request = activePaymentRequest(job);
  if (request?.dueDate) return request.dueDate;
  const invoice = invoiceRecord(job);
  const base = String(invoice.updatedAt || job.completedAt || job.createdAt || todayISO()).slice(0, 10);
  return addDaysToISO(base, 14);
}

function receivableBucket(daysPastDue = 0) {
  if (daysPastDue <= 0) return "current";
  if (daysPastDue <= 7) return "oneToSeven";
  if (daysPastDue <= 30) return "eightToThirty";
  return "overThirty";
}

function receivableBucketLabel(bucket) {
  return {
    current: "Current",
    oneToSeven: "1-7 days",
    eightToThirty: "8-30 days",
    overThirty: "31+ days"
  }[bucket] || "Current";
}

function receivableItems() {
  return roleScopedJobs()
    .map((job) => {
      ensureJobDefaults(job);
      const invoice = invoiceRecord(job);
      const balance = invoiceBalance(job);
      if (!invoice.amount || balance <= 0) return null;
      const dueDate = receivableDueDate(job);
      const daysPastDue = Math.max(0, daysBetweenISO(dueDate, todayISO()));
      const request = activePaymentRequest(job);
      return {
        job,
        invoice,
        balance,
        collected: invoiceCollectedAmount(invoice),
        request,
        dueDate,
        daysPastDue,
        bucket: receivableBucket(daysPastDue)
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.daysPastDue - a.daysPastDue || b.balance - a.balance);
}

function receivableSummary(items = receivableItems()) {
  const buckets = ["current", "oneToSeven", "eightToThirty", "overThirty"];
  return buckets.map((bucket) => {
    const bucketItems = items.filter((item) => item.bucket === bucket);
    return {
      bucket,
      label: receivableBucketLabel(bucket),
      count: bucketItems.length,
      amount: bucketItems.reduce((sum, item) => sum + item.balance, 0)
    };
  });
}

function markPaymentReviewMessage(jobId, messageId, status) {
  return updateJobById(jobId, (job) => {
    job.messages = job.messages.map((message) => {
      const normalized = normalizeJobMessage(message);
      if (normalized.id !== messageId) return normalized;
      return {
        ...normalized,
        reviewStatus: status,
        reviewedAt: new Date().toISOString(),
        reviewedBy: accountDisplayName()
      };
    });
    job.paymentRequests = paymentRequests(job).map((request) => request.status === "requested"
      ? normalizePaymentRequest({
          ...request,
          status: status === "recorded" ? "responded" : "cancelled",
          responseAt: new Date().toISOString(),
          response: `Payment response ${status} by ${accountDisplayName()}`
        }, job)
      : request);
    addJobMessage(job, {
      direction: "note",
      body: `Payment response ${status === "recorded" ? "sent to record payment" : "dismissed"} by ${accountDisplayName()}.`
    });
    return job;
  });
}

function sendReceivableReminder(jobId) {
  return updateJobById(jobId, (job) => {
    const invoice = invoiceRecord(job);
    const balance = invoiceBalance(job);
    if (!invoice.amount || balance <= 0) return job;
    ensureJobPortalToken(job);
    let request = activePaymentRequest(job);
    if (!request) {
      request = normalizePaymentRequest({
        amount: balance,
        dueDate: addDaysISO(7),
        note: `Hi ${job.name}, this is a reminder that ${formatMoney(balance)} remains open on invoice ${invoice.number}.`,
        status: "requested",
        createdAt: new Date().toISOString(),
        createdBy: accountDisplayName()
      }, job);
      job.paymentRequests = [...paymentRequests(job).filter((item) => item.status !== "requested"), request];
    }
    const url = paymentRequestUrl(job);
    addJobMessage(job, {
      direction: "out",
      body: `Payment reminder: ${formatMoney(balance)} remains open on invoice ${invoice.number}. Please review the customer portal by ${formatDateLabel(request.dueDate, { includeYear: true })}: ${url}`,
      createdBy: accountDisplayName(),
      customerVisible: true
    });
    state.jobActionNotice = {
      jobId: job.id,
      message: "Payment reminder sent to the customer portal.",
      url
    };
    return job;
  });
}

function addJobMessage(job, message) {
  job.messages.push(normalizeJobMessage({
    createdBy: accountDisplayName(),
    createdAt: new Date().toLocaleString(),
    ...message
  }));
  if (job.id && job.id === state.selectedJobId) {
    state.messageThreadScrollToBottom = true;
  }
}

function cloneForActivity(value) {
  return JSON.parse(JSON.stringify(value || null));
}

function activityActor() {
  return {
    id: state.currentUser?.id || "local-user",
    name: accountDisplayName(),
    role: currentRole()
  };
}

function activityJobSummary(job = {}) {
  return {
    id: job.id || "",
    name: job.name || "Job",
    customerId: job.customerId || "",
    customerName: job.name || "",
    issue: job.issue || "",
    status: job.status || ""
  };
}

function parseActivityJsonValue(value) {
  if (!value || typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

function compactInvoiceActivityValue(value) {
  const invoice = parseActivityJsonValue(value);
  if (!invoice || typeof invoice !== "object" || Array.isArray(invoice)) return compactActivityValue(value);
  const amount = normalizeValue(invoice.amount);
  const depositCollected = normalizeValue(invoice.depositCollected);
  const paidAmount = normalizeValue(invoice.paidAmount);
  const balance = Math.max(0, amount - depositCollected - paidAmount);
  const parts = [
    invoice.number || "No invoice #",
    invoiceStatusLabel(invoice.status || "draft"),
    `${formatMoney(amount)} total`,
    balance ? `${formatMoney(balance)} due` : "No balance"
  ];
  if (invoice.paymentMethod) parts.push(paymentMethodLabel(invoice.paymentMethod));
  if (invoice.updatedBy) parts.push(`updated by ${invoice.updatedBy}`);
  return parts.join(" - ");
}

function compactActivityValue(value, field = "") {
  if (field === "invoice") return compactInvoiceActivityValue(value);
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  if (value && typeof value === "object") return JSON.stringify(value);
  if (value === undefined || value === null || value === "") return "Not set";
  return String(value);
}

function activityFieldLabel(field) {
  const labels = {
    status: "Status",
    scheduleDate: "Schedule date",
    startTime: "Start time",
    durationMinutes: "Duration",
    technician: "Technician",
    value: "Value",
    estimate: "Estimate",
    invoice: "Invoice",
    approvalStatus: "Approval",
    trade: "Trade",
    jobType: "Job type",
    urgency: "Urgency",
    siteContact: "Site contact",
    partsNote: "Parts/tools",
    messages: "Messages",
    notifications: "Communications",
    tasks: "Tasks",
    parts: "Parts",
    equipment: "Equipment",
    files: "Files",
    scopeChanges: "Change orders",
    fieldChecklist: "Field checklist"
  };
  return labels[field] || field;
}

function summarizeJobChanges(before = {}, after = {}) {
  const fields = ["status", "scheduleDate", "startTime", "durationMinutes", "technician", "value", "estimate", "invoice", "paymentRequests", "approvalStatus", "trade", "jobType", "urgency", "siteContact", "partsNote", "messages", "notifications", "tasks", "parts", "reservations", "equipment", "files", "scopeChanges", "fieldChecklist"];
  return fields
    .filter((field) => JSON.stringify(before[field] ?? null) !== JSON.stringify(after[field] ?? null))
    .map((field) => ({
      field,
      label: activityFieldLabel(field),
      before: compactActivityValue(before[field], field),
      after: compactActivityValue(after[field], field)
    }));
}

function activityTypeFromChanges(changes = []) {
  const fields = new Set(changes.map((change) => change.field));
  if ([...fields].some((field) => String(field).startsWith("role"))) return "role";
  if (fields.has("scheduleDate") || fields.has("startTime") || fields.has("durationMinutes") || fields.has("technician")) return "schedule";
  if (fields.has("invoice") || fields.has("value")) return "status";
  if (fields.has("status") || fields.has("approvalStatus")) return "status";
  return "updated";
}

function activityChange(changes = [], field) {
  return changes.find((change) => change.field === field) || null;
}

function activityAfter(changes = [], field) {
  return activityChange(changes, field)?.after || "";
}

function taskActivitySummary(before = {}, after = {}) {
  const beforeTasks = Array.isArray(before.tasks) ? before.tasks.map(normalizeJobTask) : [];
  const afterTasks = Array.isArray(after.tasks) ? after.tasks.map(normalizeJobTask) : [];
  const beforeById = new Map(beforeTasks.map((task) => [task.id, task]));
  const changedTask = afterTasks.find((task) => {
    const previous = beforeById.get(task.id);
    return previous && previous.done !== task.done;
  });
  if (changedTask) {
    return {
      label: changedTask.done ? "Task completed" : "Task reopened",
      detail: `${changedTask.title}${changedTask.doneBy ? ` by ${changedTask.doneBy}` : ""}`
    };
  }
  const addedTask = afterTasks.find((task) => !beforeById.has(task.id));
  if (addedTask) {
    return {
      label: "Task added",
      detail: `${addedTask.title} for ${taskRoleLabel(addedTask.role)}`
    };
  }
  return null;
}

function fieldChecklistActivitySummary(before = {}, after = {}) {
  const beforeChecklist = before.fieldChecklist || {};
  const afterChecklist = after.fieldChecklist || {};
  const changedKeys = ["diagnosis", "photos", "signature"].filter((key) => Boolean(beforeChecklist[key]) !== Boolean(afterChecklist[key]));
  if (!changedKeys.length) return null;
  const labels = {
    diagnosis: "Diagnosis checklist completed",
    photos: "Photo checklist completed",
    signature: "Signature checklist completed"
  };
  const detailLabels = {
    diagnosis: "Diagnosis",
    photos: "Photos",
    signature: "Signature"
  };
  const reopenedLabels = {
    diagnosis: "Diagnosis checklist reopened",
    photos: "Photo checklist reopened",
    signature: "Signature checklist reopened"
  };
  const firstKey = changedKeys[0];
  const completed = Boolean(afterChecklist[firstKey]);
  return {
    label: changedKeys.length === 1
      ? completed ? labels[firstKey] : reopenedLabels[firstKey]
      : "Field checklist updated",
    detail: changedKeys.map((key) => `${detailLabels[key]} ${afterChecklist[key] ? "completed" : "reopened"}`).join(" - ")
  };
}

function invoiceActivityLabel(invoiceText = "", statusText = "") {
  const text = `${invoiceText} ${statusText}`.toLowerCase();
  if (text.includes("paid")) return "Payment recorded";
  if (text.includes("partial")) return "Partial payment recorded";
  if (text.includes("sent") || text.includes("invoiced")) return "Invoice sent";
  if (text.includes("draft")) return "Invoice drafted";
  return "Invoice updated";
}

function simplifyActivityEvent(event = {}) {
  const changes = event.changes || [];
  if (!changes.length) return event;
  const fields = new Set(changes.map((change) => change.field));
  const statusAfter = activityAfter(changes, "status");
  const approvalAfter = activityAfter(changes, "approvalStatus");
  const fileNote = fields.has("files") ? " File added to job files." : "";
  const communicationNote = fields.has("notifications") ? " Customer/team communication queued." : "";

  if (fields.has("scheduleDate") || fields.has("startTime") || fields.has("durationMinutes") || fields.has("technician")) {
    return {
      ...event,
      type: "schedule",
      label: statusAfter === "booked" ? "Job scheduled" : "Schedule updated",
      detail: `${activityAfter(changes, "scheduleDate") || "Date unchanged"} ${activityAfter(changes, "startTime") || ""}${activityAfter(changes, "technician") ? ` with ${activityAfter(changes, "technician")}` : ""}`.trim(),
      changes: []
    };
  }

  if (statusAfter === "estimated" || fields.has("estimate")) {
    const value = activityAfter(changes, "value");
    return {
      ...event,
      type: "status",
      label: approvalAfter === "sent" ? "Estimate sent" : "Estimate updated",
      detail: `${value ? `${value} estimate` : "Estimate"}${approvalAfter ? ` marked ${approvalAfter}` : ""}.${communicationNote}`,
      changes: []
    };
  }

  if (fields.has("invoice")) {
    const invoiceText = activityAfter(changes, "invoice");
    return {
      ...event,
      type: "status",
      label: invoiceActivityLabel(invoiceText, statusAfter),
      detail: `${invoiceText || "Invoice details updated."}.${fileNote}`,
      changes: []
    };
  }

  if (statusAfter === "in_progress") {
    return { ...event, type: "status", label: "Job started", detail: event.job?.issue || "Technician started field work.", changes: [] };
  }

  if (statusAfter === "completed") {
    return { ...event, type: "status", label: "Job completed", detail: event.job?.issue || "Field work marked complete.", changes: [] };
  }

  if (fields.has("approvalStatus")) {
    const approvalLabels = {
      sent: "Approval link sent",
      approved: "Approval marked approved",
      declined: "Approval declined",
      not_sent: "Approval reset"
    };
    return {
      ...event,
      type: "status",
      label: approvalLabels[approvalAfter] || "Approval updated",
      detail: approvalAfter ? `Approval status changed to ${approvalAfter}.` : "Approval status updated.",
      changes: []
    };
  }

  if (fields.has("scopeChanges")) {
    return { ...event, type: "status", label: "Change order updated", detail: activityAfter(changes, "scopeChanges"), changes: [] };
  }

  if (fields.has("tasks") && event.taskSummary) {
    return { ...event, label: event.taskSummary.label, detail: event.taskSummary.detail, changes: [] };
  }

  if (fields.has("parts")) {
    return { ...event, label: "Parts updated", detail: activityAfter(changes, "parts"), changes: [] };
  }

  if (fields.has("equipment")) {
    return { ...event, label: "Equipment updated", detail: activityAfter(changes, "equipment"), changes: [] };
  }

  if (fields.has("files")) {
    return { ...event, label: "File added", detail: activityAfter(changes, "files"), changes: [] };
  }

  if (fields.has("fieldChecklist") && event.fieldChecklistSummary) {
    return { ...event, type: "status", label: event.fieldChecklistSummary.label, detail: event.fieldChecklistSummary.detail, changes: [] };
  }

  if (fields.has("messages") || fields.has("notifications")) {
    return { ...event, label: fields.has("notifications") ? "Communication updated" : "Message added", detail: event.job?.issue || "Job communication changed.", changes: [] };
  }

  return event;
}

function recordActivity({ type = "updated", label = "", detail = "", job = null, before = null, after = null, changes = [] } = {}) {
  const normalizedChanges = changes.length ? changes : before && after ? summarizeJobChanges(before, after) : [];
  const taskSummary = before && after ? taskActivitySummary(before, after) : null;
  const fieldChecklistSummary = before && after ? fieldChecklistActivitySummary(before, after) : null;
  if (!label && normalizedChanges.length) {
    label = normalizedChanges.length === 1 ? `${normalizedChanges[0].label} changed` : `${normalizedChanges.length} fields changed`;
  }
  const simplified = simplifyActivityEvent({
    type: normalizedChanges.length ? activityTypeFromChanges(normalizedChanges) : type,
    label: label || "Activity recorded",
    detail,
    job: activityJobSummary(job || after || before || {}),
    changes: normalizedChanges.slice(0, 8),
    taskSummary,
    fieldChecklistSummary
  });
  const event = {
    id: createId(),
    ...simplified,
    actor: activityActor(),
    createdAt: new Date().toISOString()
  };
  state.activityEvents = [event, ...state.activityEvents].slice(0, 1000);
  return event;
}

function activityToRemoteRow(event) {
  return {
    id: event.id,
    organization_id: state.organizationId,
    job_id: event.job?.id || null,
    activity_type: event.type,
    actor_id: state.currentUser?.id || null,
    actor_name: event.actor?.name || accountDisplayName(),
    payload: event,
    created_at: event.createdAt || new Date().toISOString()
  };
}

function ensureDeletedJobDefaults(record) {
  const job = ensureJobDefaults(record.job || {});
  return {
    id: record.id || `deleted-${job.id || createId()}`,
    job,
    deletedAt: record.deletedAt || new Date().toISOString(),
    deletedBy: usernameFromIdentity(record.deletedBy || accountDisplayName()),
    reason: record.reason || "Deleted from Backline"
  };
}

function jobTimingLabel(job) {
  if (["paid", "closed", "completed"].includes(job.status)) return "Past";
  if (isScheduled(job)) {
    if (job.scheduleDate > todayISO()) return "Future";
    if (job.scheduleDate < todayISO()) return "Past";
  }
  return "Present";
}

function jobDatabaseGroup(job) {
  if (["completed", "paid", "closed"].includes(job.status)) return "completed";
  if (isScheduled(job) && job.scheduleDate > todayISO()) return "upcoming";
  return "active";
}

function jobDatabaseGroupLabel(group) {
  const labels = {
    active: "Active",
    upcoming: "Upcoming",
    completed: "Completed",
    deleted: "Deleted"
  };
  return labels[group] || labels.active;
}

function normalizeSearchText(value = "") {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function searchTerm() {
  return normalizeSearchText(state.search);
}

function searchTokens(term = searchTerm()) {
  return normalizeSearchText(term).split(" ").filter(Boolean);
}

function nameSearchText(value = "") {
  const normalized = normalizeSearchText(value);
  const parts = normalized.split(" ").filter(Boolean);
  if (!parts.length) return "";
  const first = parts[0] || "";
  const last = parts[parts.length - 1] || "";
  return [
    normalized,
    parts.join(" "),
    parts.slice().reverse().join(" "),
    first,
    last,
    ...parts
  ].filter(Boolean).join(" ");
}

function nameSearchParts(value = "") {
  const full = normalizeSearchText(value);
  const parts = full.split(" ").filter(Boolean);
  return {
    full,
    first: parts[0] || "",
    last: parts[parts.length - 1] || "",
    reversed: parts.slice().reverse().join(" ")
  };
}

function clampMessageThreadHeight(height) {
  return Math.max(MESSAGE_THREAD_MIN_HEIGHT, Math.min(MESSAGE_THREAD_MAX_HEIGHT, Math.round(height)));
}

function jobSearchText(job) {
  ensureJobDefaults(job);
  const parts = job.parts.map((part) => [part.name, part.source, part.qty].join(" ")).join(" ");
  const tasks = job.tasks.map((task) => task.title).join(" ");
  return normalizeSearchText([
    nameSearchText(job.name),
    job.phone,
    phoneDigits(job.phone),
    job.address,
    job.trade,
    jobTypeLabel(job),
    job.issue,
    job.status,
    job.urgency,
    job.siteContact,
    job.partsNote,
    normalizeTechnician(job.technician),
    scheduleText(job, { includeYear: true }),
    parts,
    tasks
  ].join(" "));
}

function customerJobSearchText(customer) {
  const jobs = roleScopedJobs()
    .filter((job) => ensureJobDefaults(job).customerId === customer.id)
    .map((job) => jobSearchText(job))
    .join(" ");
  return jobs;
}

function customerSearchText(customer) {
  return normalizeSearchText([
    nameSearchText(customer.name),
    customer.phone,
    phoneDigits(customer.phone),
    customer.email,
    customer.address,
    customer.siteContact,
    nameSearchText(customer.siteContact),
    customer.customerType,
    customer.tags?.join(" "),
    customer.accountFlag,
    customer.notes,
    customer.preferredContact,
    customer.jobCount,
    formatMoney(customer.totalValue),
    formatMoney(customer.unpaidBalance || 0),
    customerJobSearchText(customer)
  ].join(" "));
}

function customerMatchesSearch(customer, term = searchTerm()) {
  if (!term) return true;
  const text = customerSearchText(customer);
  const tokens = searchTokens(term);
  return text.includes(term) || tokens.every((token) => text.includes(token));
}

function customerSearchScore(customer, term = searchTerm()) {
  if (!term) return 0;
  const tokens = searchTokens(term);
  const customerName = nameSearchParts(customer.name);
  const siteName = nameSearchParts(customer.siteContact);
  const phone = phoneDigits(customer.phone);
  const termDigits = phoneDigits(term);
  const email = normalizeSearchText(customer.email);
  const address = normalizeSearchText(customer.address);
  const jobText = customerJobSearchText(customer);
  const allText = customerSearchText(customer);

  if (customerName.full === term) return 1000;
  if (customerName.last === term) return 960;
  if (customerName.first === term) return 930;
  if (customerName.full.startsWith(`${term} `)) return 900;
  if (customerName.reversed.startsWith(term)) return 875;
  if (tokens.length && tokens.every((token) => customerName.full.includes(token) || customerName.reversed.includes(token))) return 850;
  if (siteName.last === term || siteName.first === term || siteName.full.includes(term)) return 800;
  if (termDigits.length >= 3 && phone.includes(termDigits)) return 760;
  if (email.includes(term)) return 720;
  if (address.includes(term)) return 680;
  if (jobText.includes(term)) return 620;
  if (tokens.length && tokens.every((token) => allText.includes(token))) return 580;
  return allText.includes(term) ? 520 : 0;
}

function customerNameMatchesSearch(customer, term = searchTerm()) {
  if (!term) return true;
  const tokens = searchTokens(term);
  const customerName = nameSearchParts(customer.name);
  const siteName = nameSearchParts(customer.siteContact);
  return [
    customerName.full,
    customerName.first,
    customerName.last,
    customerName.reversed,
    siteName.full,
    siteName.first,
    siteName.last,
    siteName.reversed
  ].some((value) => value === term || value.includes(term))
    || tokens.every((token) => customerName.full.includes(token) || customerName.reversed.includes(token) || siteName.full.includes(token));
}

function customerSearchRows() {
  const term = searchTerm();
  if (!term) return [];
  const customers = buildCustomersFromJobs(roleScopedJobs());
  const nameMatches = customers.filter((customer) => customerNameMatchesSearch(customer, term));
  const rows = nameMatches.length ? nameMatches : customers.filter((customer) => customerMatchesSearch(customer, term));
  return rows
    .sort((a, b) => customerSearchScore(b, term) - customerSearchScore(a, term) || b.jobCount - a.jobCount || a.name.localeCompare(b.name))
    .slice(0, 6);
}

function renderCustomerSearchResults() {
  if (!elements.customerSearchResults) return;
  const term = searchTerm();
  if (!term) {
    elements.customerSearchResults.hidden = true;
    elements.customerSearchResults.innerHTML = "";
    return;
  }

  const rows = customerSearchRows();
  elements.customerSearchResults.hidden = false;
  elements.customerSearchResults.innerHTML = rows.length
    ? rows.map((customer) => `
      <button class="customer-search-result" type="button" data-search-customer-id="${escapeHtml(customer.id)}">
        <span>
          <strong>${escapeHtml(customer.name)}</strong>
          <small>${escapeHtml(customer.phone || "No phone")} · ${escapeHtml(customer.address || "No address")}</small>
        </span>
        <em>${customer.jobCount} job${customer.jobCount === 1 ? "" : "s"}</em>
      </button>
    `).join("")
    : `<div class="customer-search-empty"><strong>No customers found</strong><span>Try a name, phone, address, or service type.</span></div>`;
}

function fieldChecklistProgress(job) {
  ensureJobDefaults(job);
  const values = Object.values(job.fieldChecklist);
  return `${values.filter(Boolean).length}/${values.length}`;
}

function visibleJobs() {
  return roleScopedJobs().filter((job) => {
    ensureJobDefaults(job);
    return (
      state.activeFilter === "all" ||
      (state.activeFilter === "urgent" && job.urgency === "urgent") ||
      job.status === state.activeFilter
    );
  });
}

function selectedJob() {
  const visible = visibleJobs();
  const scopedJobs = roleScopedJobs();
  const job = visible.find((item) => item.id === state.selectedJobId) || visible[0] || scopedJobs[0] || null;
  return job ? ensureJobDefaults(job) : null;
}

function updateRoleUI() {
  document.body.dataset.role = currentRole();
  document.querySelectorAll("[data-view]").forEach((button) => {
    const view = button.dataset.view;
    button.hidden = !isViewAllowed(view);
    button.setAttribute("aria-hidden", String(!isViewAllowed(view)));
  });
  document.querySelectorAll(".view").forEach((section) => {
    const view = section.id.replace(/^view-/, "");
    const allowed = isViewAllowed(view);
    section.hidden = !allowed;
    section.setAttribute("aria-hidden", String(!allowed));
    if (!allowed) {
      section.classList.remove("active");
    }
  });
  elements.newJobButton.hidden = !can("createJob");
  document.querySelector("#settingsExportButton")?.toggleAttribute("hidden", !can("exportData"));
  document.querySelector("#settingsConnectionButton")?.toggleAttribute("hidden", !can("exportData"));
  document.querySelector("#workspaceSettingsButton")?.toggleAttribute("hidden", !can("exportData"));
  document.querySelector("#confirmAllButton")?.toggleAttribute("hidden", !can("book"));
  document.querySelectorAll('label[for="importInput"]').forEach((label) => {
    label.hidden = !can("exportData");
  });
  const canManageTeam = can("manageTeam");
  document.querySelector("#view-team .team-layout")?.classList.toggle("readonly", !canManageTeam);
  const teamAdminPanel = document.querySelector("[data-team-admin-panel]");
  if (teamAdminPanel) {
    teamAdminPanel.hidden = !canManageTeam;
  }

  const activeView = document.querySelector(".view.active")?.id.replace(/^view-/, "");
  if (!activeView || !isViewAllowed(activeView)) {
    activateView(allowedViews()[0]);
  }
}

function renderNavBadges() {
  const scheduleBadge = document.querySelector('[data-nav-badge="schedule"]');
  const inboxBadge = document.querySelector('[data-nav-badge="inbox"]');
  const communicationsBadge = document.querySelector('[data-nav-badge="communications"]');
  const assignmentCount = newAssignmentJobs().length;
  const scheduleAttentionCount = technicianAttentionJobs().length;
  if (scheduleBadge) {
    scheduleBadge.hidden = scheduleAttentionCount === 0;
    scheduleBadge.textContent = String(scheduleAttentionCount);
    scheduleBadge.setAttribute("aria-label", `${scheduleAttentionCount} schedule item${scheduleAttentionCount === 1 ? "" : "s"} needing attention${assignmentCount ? `, including ${assignmentCount} new assignment${assignmentCount === 1 ? "" : "s"}` : ""}`);
  }
  const messageCount = unreadMessageJobs().reduce((count, job) => count + unreadInboundMessages(job).length, 0);
  if (inboxBadge) {
    inboxBadge.hidden = messageCount === 0;
    inboxBadge.textContent = String(messageCount);
    inboxBadge.setAttribute("aria-label", `${messageCount} unread customer message${messageCount === 1 ? "" : "s"}`);
  }
  if (communicationsBadge) {
    communicationsBadge.hidden = messageCount === 0;
    communicationsBadge.textContent = String(messageCount);
    communicationsBadge.setAttribute("aria-label", `${messageCount} unread customer message${messageCount === 1 ? "" : "s"}`);
  }
}

function renderStats() {
  const jobs = roleScopedJobs();
  const missed = jobs.length;
  const booked = jobs.filter((job) => ["booked", "in_progress", "completed", "estimated", "invoiced", "paid", "closed"].includes(job.status)).length;
  const urgent = jobs.filter((job) => job.urgency === "urgent" && !["paid", "closed"].includes(job.status)).length;
  const recovered = jobs.reduce((sum, job) => sum + estimateAmount(job), 0);

  const stats = [
    ["Requests", missed, "captured locally"],
    ["Booked", booked, `${missed ? Math.round((booked / missed) * 100) : 0}% conversion`],
    ["Urgent", urgent, "needs attention"],
    ["Pipeline", formatMoney(recovered), "estimated value"]
  ];

  elements.statsStrip.innerHTML = stats
    .map(([label, value, note]) => `
      <div class="stat">
        <span class="stat-label">${label}</span>
        <strong>${value}</strong>
        <span class="stat-note">${note}</span>
      </div>
    `)
    .join("");
}

function activeShopJobs(jobs = roleScopedJobs()) {
  return jobs.filter((job) => !["closed", "paid"].includes(job.status));
}

function topbarDataPoint() {
  const jobs = roleScopedJobs();
  const activeJobs = activeShopJobs(jobs);
  const attentionCount = attentionItems().length;
  const todayJobs = jobs.filter((job) => isScheduled(job) && job.scheduleDate === todayISO() && !["closed", "paid"].includes(job.status)).length;
  const unreadCount = unreadMessageJobs(jobs).reduce((count, job) => count + unreadInboundMessages(job).length, 0);
  const openBalance = jobs.reduce((sum, job) => sum + invoiceBalance(job), 0);

  if (attentionCount > 0) {
    return `${attentionCount} item${attentionCount === 1 ? "" : "s"} need attention across ${activeJobs.length} active job${activeJobs.length === 1 ? "" : "s"}.`;
  }
  if (unreadCount > 0) {
    return `${unreadCount} unread customer message${unreadCount === 1 ? "" : "s"} waiting for a reply.`;
  }
  if (todayJobs > 0) {
    return `${todayJobs} job${todayJobs === 1 ? "" : "s"} scheduled today${openBalance > 0 ? ` with ${formatMoney(openBalance)} open balance` : ""}.`;
  }
  if (openBalance > 0) {
    return `${formatMoney(openBalance)} open balance across customer accounts.`;
  }
  return "No urgent items right now. Your shop is up to date.";
}

function renderTopbar() {
  if (elements.topbarGreeting) {
    elements.topbarGreeting.textContent = `Welcome back, ${displayFirstName()}.`;
  }
  if (elements.topbarInsight) {
    elements.topbarInsight.textContent = topbarDataPoint();
  }
}

function attentionItems() {
  const jobs = roleScopedJobs();
  const open = jobs.filter((job) => job.status === "open");
  const active = jobs.filter((job) => job.status === "in_progress");
  const completed = jobs.filter((job) => job.status === "completed");
  const estimates = jobs.filter((job) => job.status === "estimated");
  const invoices = jobs.filter((job) => job.status === "invoiced");
  const urgent = jobs.filter((job) => job.urgency === "urgent" && !["paid", "closed"].includes(job.status));
  const unscheduled = jobs.filter((job) => !isScheduled(job) && !["paid", "closed"].includes(job.status));
  const tomorrow = addDaysISO(1);
  const materialShortages = jobs
    .filter((job) => isScheduled(job) && job.scheduleDate <= tomorrow && !["paid", "closed"].includes(job.status))
    .map((job) => ({ job, shortages: jobReservationShortages(job) }))
    .filter(({ shortages }) => shortages.length > 0);
  const profitItems = canViewJobCosting()
    ? jobs.flatMap((job) => profitWatchItems(job).slice(0, 1).map((item) => ({
      tone: "profit",
      title: item.title,
      detail: item.detail,
      action: item.action,
      jobId: job.id
    })))
    : [];

  const items = [
    ...urgent.map((job) => ({
      tone: "urgent",
      title: `${job.name} needs a fast response`,
      detail: job.issue,
      action: "Open job",
      jobId: job.id
    })),
    ...open.map((job) => ({
      tone: "open",
      title: `${job.name} is waiting to be booked`,
      detail: isScheduled(job) ? scheduleText(job) : "No appointment time set",
      action: "Book now",
      jobId: job.id
    })),
    ...active.map((job) => ({
      tone: "in_progress",
      title: `${job.name} is active in the field`,
      detail: `${fieldChecklistProgress(job)} field checklist complete`,
      action: "Finish job",
      jobId: job.id
    })),
    ...completed.map((job) => ({
      tone: "completed",
      title: `${job.name} is ready to invoice`,
      detail: "Field work is complete; collect before the trail goes cold",
      action: "Invoice",
      jobId: job.id
    })),
    ...estimates.map((job) => ({
      tone: "estimated",
      title: `${job.name} has an open estimate`,
      detail: `${formatMoney(estimateAmount(job))} estimate is waiting for approval`,
      action: "Follow up",
      jobId: job.id
    })),
    ...invoices.map((job) => ({
      tone: "invoiced",
      title: `${job.name} has an unpaid invoice`,
      detail: `${formatMoney(invoiceBalance(job) || invoiceRecord(job).amount)} still outstanding`,
      action: "Send reminder",
      jobId: job.id
    })),
    ...materialShortages.map(({ job, shortages }) => ({
      tone: "urgent",
      title: `${job.name} needs parts before dispatch`,
      detail: `${shortages.length} shortage${shortages.length === 1 ? "" : "s"} for ${scheduleText(job)}`,
      action: "Review pick list",
      jobId: job.id
    })),
    ...profitItems,
    ...unscheduled.slice(0, 3).map((job) => ({
      tone: "open",
      title: `${job.name} needs a scheduled time`,
      detail: job.issue,
      action: "Schedule",
      jobId: job.id
    }))
  ];
  const seenAttentionJobs = new Set();
  return items.filter((item) => {
    if (seenAttentionJobs.has(item.jobId)) return false;
    seenAttentionJobs.add(item.jobId);
    return true;
  });
}

function renderAttention() {
  const items = attentionItems().slice(0, 8);
  elements.attentionSummary.textContent = items.length
    ? `${items.length} item${items.length === 1 ? "" : "s"} need attention right now`
    : "Nothing is on fire. Backline is watching the queue.";

  elements.attentionList.innerHTML = items.length
    ? items.map((item) => `
      <button class="attention-item ${item.tone}" type="button" data-job-id="${item.jobId}">
        <span>
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.detail)}</small>
        </span>
        <em>${escapeHtml(item.action)}</em>
      </button>
    `).join("")
    : `
      <div class="empty-state compact-empty">
        <strong>No urgent work</strong>
        <span>New missed calls, stale estimates, and unpaid invoices will show up here.</span>
      </div>
    `;
}

function betaReadinessItems() {
  const setupItems = workspaceSetupItems(companySettings());
  const setupComplete = setupItems.filter((item) => item.complete).length;
  const activeJobs = activeShopJobs(state.jobs.map(ensureJobDefaults));
  const visibleFiles = state.jobs.some((job) => (job.files || []).some((file) => file.customerVisible));
  const portalReady = state.jobs.some((job) => job.portalToken || customerPortalMessages(job).length || visibleFiles);
  const billingReady = state.pricebookItems.length > 0 || state.jobs.some((job) => invoiceRecord(job).amount > 0 || estimateAmount(job) > 0);
  const teamReady = normalizedTeamMembers().length > 1 || state.teamInvites.length > 0 || !state.secureMode;
  const dataActivityReady = state.activityEvents.length > 0 && (state.secureMode ? state.databaseReady : true);
  const customerFacingReady = portalReady || state.jobs.some((job) => ["sent", "approved", "declined"].includes(job.approvalStatus));

  return [
    {
      key: "setup",
      status: setupComplete === setupItems.length ? "ready" : setupComplete >= Math.ceil(setupItems.length * 0.7) ? "check" : "setup",
      title: "Workspace setup",
      detail: `${setupComplete}/${setupItems.length} setup items complete`
    },
    {
      key: "data",
      status: dataActivityReady ? "ready" : state.secureMode ? "check" : "setup",
      title: "Data safety",
      detail: state.secureMode
        ? state.databaseReady ? "Secure database is connected and activity is being recorded" : "Secure mode is on, but database status needs attention"
        : "Local fallback is active. Use secure mode before inviting a real shop"
    },
    {
      key: "jobs",
      status: state.jobs.length && state.customers.length ? "ready" : activeJobs.length ? "check" : "setup",
      title: "Job tasks",
      detail: state.jobs.length
        ? "Proceed here for job tasks"
        : "Create a test job first"
    },
    {
      key: "team",
      status: teamReady ? "ready" : "check",
      title: "Team access",
      detail: normalizedTeamMembers().length > 1
        ? `${normalizedTeamMembers().length} team members available`
        : state.teamInvites.length
          ? `${state.teamInvites.length} invite${state.teamInvites.length === 1 ? "" : "s"} waiting`
          : "Solo testing is fine; invite a tech before multi-user beta"
    },
    {
      key: "billing",
      status: billingReady ? "ready" : "setup",
      title: "Billing flow",
      detail: state.pricebookItems.length
        ? `${state.pricebookItems.length} pricebook item${state.pricebookItems.length === 1 ? "" : "s"} ready`
        : "Add a pricebook item or send a test estimate/invoice"
    },
    {
      key: "customer-facing",
      status: customerFacingReady ? "ready" : "check",
      title: "Customer-facing flow",
      detail: customerFacingReady
        ? "Portal, files, messages, or approvals have been exercised"
        : "Send a portal link or approval link and review it on mobile"
    }
  ];
}

function renderBetaReadiness() {
  if (!elements.betaReadinessPanel) return;
  const items = betaReadinessItems();
  const readyCount = items.filter((item) => item.status === "ready").length;
  const checkCount = items.filter((item) => item.status === "check").length;
  const setupCount = items.filter((item) => item.status === "setup").length;
  const readinessText = setupCount
    ? `${readyCount}/${items.length} ready - ${setupCount} setup item${setupCount === 1 ? "" : "s"} left`
    : checkCount
      ? `${readyCount}/${items.length} ready - ${checkCount} item${checkCount === 1 ? "" : "s"} to double-check`
      : "Beta-ready for a controlled test run";

  if (elements.betaReadinessSummary) {
    elements.betaReadinessSummary.textContent = readinessText;
  }

  elements.betaReadinessPanel.innerHTML = items.map((item) => `
    <article class="beta-readiness-item ${escapeHtml(item.status)}">
      <span>${escapeHtml(item.status === "ready" ? "Ready" : item.status === "check" ? "Check" : "Setup")}</span>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.detail)}</small>
      </div>
    </article>
  `).join("");
}

function renderDashboardPanels() {
  const scopedJobs = roleScopedJobs();
  const booked = scopedJobs
    .filter((job) => isScheduled(job) && ["booked", "in_progress", "completed", "estimated", "invoiced", "paid"].includes(job.status))
    .sort(sortBySchedule);
  const money = scopedJobs.filter(dashboardMoneyNeedsAttention);
  const followups = recommendedFollowups();

  elements.todayPanel.innerHTML = booked.length
    ? booked.slice(0, 5).map((job) => compactJobRow(job, scheduleText(job), job.status)).join("")
    : `<div class="empty-state compact-empty"><strong>No jobs booked</strong><span>Book a request from the inbox to build the day.</span></div>`;

  elements.moneyPanel.innerHTML = money.length
    ? money.slice(0, 5).map((job) => compactJobRow(job, dashboardMoneyAmount(job), job.status, dashboardMoneyDetail(job))).join("")
    : `<div class="empty-state compact-empty"><strong>No money waiting</strong><span>Open estimates and invoices will appear here.</span></div>`;

  elements.followupPanel.innerHTML = followups.length
    ? followups.slice(0, 5).map((item) => compactActionRow(item)).join("")
    : `<div class="empty-state compact-empty"><strong>No follow-ups queued</strong><span>Backline will recommend nudges as jobs move forward.</span></div>`;
}

function dashboardMoneyAmount(job) {
  if (job.status === "estimated") return formatMoney(estimateAmount(job));
  const balance = invoiceBalance(job);
  const invoice = invoiceRecord(job);
  return formatMoney(balance || invoice.amount || estimateAmount(job));
}

function dashboardMoneyNeedsAttention(job) {
  ensureJobDefaults(job);
  const invoice = invoiceRecord(job);
  const balance = invoiceBalance(job);
  if (job.status === "completed" && invoice.amount <= 0) return true;
  if (job.status === "estimated") return estimateAmount(job) > 0;
  if (job.status === "invoiced") return invoice.amount > 0 && balance > 0;
  return false;
}

function dashboardMoneyDetail(job) {
  const estimate = normalizeEstimateRecord(job.estimate || {}, job);
  const invoice = invoiceRecord(job);
  const balance = invoiceBalance(job);
  const collected = invoiceCollectedAmount(invoice);

  if (job.status === "completed" && invoice.amount <= 0) {
    return "Field work is complete. Create and send the invoice.";
  }
  if (job.status === "estimated") {
    if (job.approvalStatus === "approved") return `${formatMoney(estimate.amount)} approved estimate is ready to invoice.`;
    if (job.approvalStatus === "sent") return `${formatMoney(estimate.amount)} estimate is waiting for customer approval.`;
    return `${formatMoney(estimate.amount)} estimate needs to be sent.`;
  }
  if (invoice.amount > 0 && balance > 0) {
    if (collected > 0) return `${formatMoney(collected)} collected. ${formatMoney(balance)} balance still due.`;
    if (invoice.depositRequested > 0) return `${formatMoney(invoice.depositRequested)} deposit requested. ${formatMoney(balance)} balance open.`;
    return `${formatMoney(balance)} unpaid on invoice ${invoice.number}.`;
  }
  if (invoice.amount > 0 && balance <= 0) {
    return `${formatMoney(collected || invoice.amount)} collected. Invoice is paid in full.`;
  }
  return job.issue;
}

function compactJobRow(job, meta, status, detail = job.issue) {
  return `
    <button class="compact-row" type="button" data-job-id="${job.id}">
      <span>
        <strong>${escapeHtml(job.name)}</strong>
        <small>${escapeHtml(detail)}</small>
      </span>
      <em class="pill ${escapeHtml(status)}">${escapeHtml(meta)}</em>
    </button>
  `;
}

function compactActionRow(item) {
  return `
    <button class="compact-row" type="button" data-job-id="${item.job.id}">
      <span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.detail)}</small>
      </span>
      <em>${escapeHtml(item.action)}</em>
    </button>
  `;
}

function materialSourceLabel(source = "") {
  return String(source || "truck stock").toLowerCase() === "truck stock"
    ? "On hand"
    : String(source || "").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderPartsList(job) {
  ensureJobDefaults(job);
  if (!job.parts.length && !job.partsNote) {
    return '<div class="empty-note">No parts logged yet.</div>';
  }

  const sourceOptions = ["truck stock", "supplier", "warehouse", "customer supplied"];
  const hasLoggedParts = job.parts.length > 0;
  return `
    <div class="parts-list">
      ${job.partsNote ? `
        <div class="parts-request-note">
          <strong>Request note</strong>
          <span>${escapeHtml(job.partsNote)}</span>
        </div>
      ` : ""}
      ${!hasLoggedParts ? '<div class="empty-note">No logged parts yet. Use Log parts when material is actually used or pulled.</div>' : ""}
      ${job.parts.map((part, index) => {
        const normalizedPart = normalizeJobPart(part, index);
        const source = normalizedPart.source || "truck stock";
        const options = sourceOptions.includes(source) ? sourceOptions : [source, ...sourceOptions];
        const billed = isPartBilled(job, normalizedPart);
        const saved = partSavedToPricebook(normalizedPart);
        const suggestedRate = partSuggestedBillRate(normalizedPart);
        return `
        <div class="part-card">
          <div class="part-row">
            <strong>${escapeHtml(normalizedPart.qty || "1")}</strong>
            <span>
              ${escapeHtml(normalizedPart.name)}
              <small>${escapeHtml(`${materialSourceLabel(source)}${normalizedPart.cost ? ` - cost ${formatMoney(normalizedPart.cost)}` : " - missing cost"}${suggestedRate ? ` - suggested ${formatMoney(suggestedRate)}` : ""}`)}</small>
            </span>
            <em>${billed ? "Billed" : saved ? "Saved" : materialSourceLabel(source)}</em>
            ${can("invoice") && !isLockedBillingJob(job) ? `
              ${billed
                ? '<span class="part-state-pill">Billed</span>'
                : `<button class="utility-button part-inline-button" type="button" data-add-part-line-index="${index}">Add to invoice</button>`}
              ${saved
                ? '<span class="part-state-pill">Pricebook</span>'
                : `<button class="utility-button part-inline-button" type="button" data-save-part-pricebook-index="${index}">Save to pricebook</button>`}
            ` : ""}
            ${can("parts") ? `
              <details class="part-editor" ${detailExpandedAttributes(`job:${job.id}:part:${normalizedPart.id || index}:edit`)}>
                <summary>Edit</summary>
                <div class="part-edit-heading">
                  <strong>Edit logged part</strong>
                  <small>Update the material, quantity, source, or unit cost.</small>
                </div>
                <form class="part-edit-form" data-edit-part-form="${index}">
                  <input name="name" value="${escapeHtml(normalizedPart.name || "")}" placeholder="Part or material" required>
                  <input name="qty" value="${escapeHtml(normalizedPart.qty || "1")}" placeholder="Qty" required>
                  ${backlineDropdown({
                    id: `part-source-${job.id}-${index}`,
                    name: "source",
                    value: source,
                    options: options.map((option) => ({ value: option, label: materialSourceLabel(option) })),
                    placeholder: "Part source",
                    direction: "up"
                  })}
                  <input name="cost" type="number" step="0.01" min="0" value="${escapeHtml(normalizedPart.cost || "")}" placeholder="Unit cost">
                  <button class="secondary-button" type="submit">Save</button>
                </form>
              </details>
              <button class="invoice-remove-button part-remove-button" type="button" data-delete-part-index="${index}" aria-label="Remove logged part">Remove</button>
            ` : ""}
          </div>
        </div>
      `;
      }).join("")}
    </div>
  `;
}

function renderReservationPickList(job = {}) {
  ensureJobDefaults(job);
  const rows = jobReservationRows(job);
  const summary = jobPickListSummary(job);
  const recommendations = recommendedReservationItems(job);
  const materialOptions = reservationMaterialOptions();
  const hasSavedMaterials = inventoryMaterialItems().length > 0;
  const canManage = can("parts");
  return `
    <section class="pick-list-panel ${summary.shortages ? "has-shortage" : ""}">
      <div class="pick-list-header">
        <span>
          <strong>Pick list</strong>
          <small>${escapeHtml(summary.total ? `${summary.label}${summary.shortages ? ` - ${summary.shortages} shortage${summary.shortages === 1 ? "" : "s"}` : ""}` : "Reserve likely materials before the truck rolls.")}</small>
        </span>
        <span class="pill ${escapeHtml(summary.shortages ? "urgent" : summary.total ? "booked" : "estimated")}">${escapeHtml(summary.shortages ? "Shortage" : summary.total ? summary.label : "Planning")}</span>
      </div>
      ${recommendations.length && canManage ? `
        <div class="reservation-recommendations">
          <span>
            <strong>Template suggestions</strong>
            <small>${escapeHtml(recommendations.map((item) => item.name).join(", "))}</small>
          </span>
          <button class="utility-button" type="button" data-add-template-reservations>Add suggestions</button>
        </div>
      ` : ""}
      ${canManage && hasSavedMaterials ? `
        <form class="reservation-form" data-reservation-form>
          <div class="backline-picker-field">
            ${backlineDropdown({
              id: `reservation-material-${job.id}`,
              name: "materialName",
              value: materialOptions[0],
              options: materialOptions,
              placeholder: "Material",
              direction: "down"
            })}
          </div>
          <input name="qty" type="number" min="1" step="1" value="1" aria-label="Reserved quantity">
          <input name="note" placeholder="Optional note">
          <button class="secondary-button" type="submit">Reserve</button>
        </form>
      ` : ""}
      <div class="reservation-list">
        ${rows.length ? rows.map(({ reservation, item, available, shortageQty, status }) => `
          <article class="reservation-row ${escapeHtml(status)}">
            <span>
              <strong>${escapeHtml(reservation.name || item?.name || "Material")}</strong>
              <small>${escapeHtml(item ? `${item.truckStock} on hand - ${available} available for this job` : "Not tied to saved inventory")}</small>
            </span>
            <span>
              <strong>${escapeHtml(`${reservation.qty} reserved`)}</strong>
              <small>${escapeHtml(shortageQty ? `${shortageQty} short` : reservation.status === "picked" ? `Picked by ${reservation.pickedBy || "Backline"}` : "Ready to pick")}</small>
            </span>
            ${canManage ? `
              <span class="reservation-actions">
                <button class="utility-button" type="button" data-mark-reservation-picked="${escapeHtml(reservation.id)}" ${reservation.status === "picked" ? "disabled" : ""}>Mark picked</button>
                <button class="invoice-remove-button part-remove-button" type="button" data-remove-reservation="${escapeHtml(reservation.id)}">Remove</button>
              </span>
            ` : ""}
          </article>
        `).join("") : '<div class="empty-note">No reserved materials yet. Add expected materials from the pricebook before the job starts.</div>'}
      </div>
    </section>
  `;
}

function addReservationToJob(job = {}, item = {}, qty = 1, note = "") {
  const material = normalizePricebookItem(item);
  if (!material.id || !material.name) return null;
  ensureJobDefaults(job);
  const existingIndex = job.reservations.findIndex((reservation) => normalizeJobReservation(reservation).pricebookItemId === material.id);
  if (existingIndex >= 0) {
    const existing = normalizeJobReservation(job.reservations[existingIndex]);
    const updated = normalizeJobReservation({
      ...existing,
      qty: existing.qty + Math.max(1, Math.round(Number(qty) || 1)),
      note: note || existing.note
    }, existingIndex);
    job.reservations = job.reservations.map((reservation, index) => index === existingIndex ? updated : normalizeJobReservation(reservation, index));
    return updated;
  }
  const reservation = normalizeJobReservation({
    pricebookItemId: material.id,
    name: material.name,
    qty,
    note,
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName()
  });
  job.reservations.push(reservation);
  return reservation;
}

function addTemplateReservationsToJob(job = {}) {
  const recommendations = recommendedReservationItems(job);
  recommendations.forEach((item) => addReservationToJob(job, item, 1, "Template suggestion"));
  return recommendations.length;
}

function markReservationPicked(job = {}, reservationId = "") {
  ensureJobDefaults(job);
  let picked = null;
  job.reservations = job.reservations.map((reservation, index) => {
    const normalized = normalizeJobReservation(reservation, index);
    if (normalized.id !== reservationId) return normalized;
    picked = normalizeJobReservation({
      ...normalized,
      status: "picked",
      pickedAt: new Date().toISOString(),
      pickedBy: accountDisplayName()
    }, index);
    return picked;
  });
  return picked;
}

function removeReservationFromJob(job = {}, reservationId = "") {
  ensureJobDefaults(job);
  const removed = job.reservations.find((reservation) => normalizeJobReservation(reservation).id === reservationId);
  job.reservations = job.reservations.filter((reservation) => normalizeJobReservation(reservation).id !== reservationId);
  return removed ? normalizeJobReservation(removed) : null;
}

function renderDailyLoadoutPanel(jobs = [], options = {}) {
  const day = options.day || todayISO();
  const rows = dailyLoadoutRows(jobs, day);
  const summary = loadoutSummary(rows);
  const canPick = options.canPick ?? can("parts");
  const title = options.title || "Today loadout";
  const subtitle = options.subtitle || "Materials reserved for scheduled jobs";
  return `
    <section class="daily-loadout-panel ${summary.shortages ? "has-shortage" : ""} ${options.compact ? "compact" : ""}">
      <div class="daily-loadout-header">
        <div>
          <strong>${escapeHtml(title)}</strong>
          <small>${escapeHtml(subtitle)} - ${escapeHtml(formatDateLabel(day, { includeYear: true }))}</small>
        </div>
        <span class="pill ${summary.shortages ? "urgent" : summary.total ? "estimated" : "quiet"}">
          ${summary.shortages ? `${summary.shortages} short` : summary.total ? `${summary.picked}/${summary.total} picked` : "No materials"}
        </span>
      </div>
      ${rows.length ? `
        <div class="daily-loadout-list">
          ${rows.map((row) => `
            <article class="daily-loadout-row ${escapeHtml(row.status)}">
              <div>
                <strong>${escapeHtml(row.name)}</strong>
                <small>${escapeHtml(`${row.qty} ${row.unit}${row.qty === 1 ? "" : "s"} needed${row.technicians.length ? ` - ${row.technicians.join(", ")}` : ""}`)}</small>
                <small>${escapeHtml(row.jobs.slice(0, 3).map((job) => `${job.name} (${job.qty})`).join(" - "))}${row.jobs.length > 3 ? escapeHtml(` - ${row.jobs.length - 3} more`) : ""}</small>
              </div>
              <div class="daily-loadout-actions">
                ${row.shortageQty ? `<span class="schedule-status-chip shortage">${escapeHtml(`${row.shortageQty} short`)}</span>` : row.status === "picked" ? '<span class="schedule-status-chip ready">Picked</span>' : `<button class="utility-button" type="button" data-pick-loadout-material="${escapeHtml(row.key)}" data-pick-loadout-day="${escapeHtml(day)}" ${canPick ? "" : "disabled"}>Mark picked</button>`}
              </div>
            </article>
          `).join("")}
        </div>
      ` : `
        <div class="empty-state compact-empty">
          <strong>No reserved materials</strong>
          <span>Reserve materials inside a job to build this daily pick list.</span>
        </div>
      `}
    </section>
  `;
}

function renderJobFiles(job) {
  ensureJobDefaults(job);
  if (!job.files.length) {
    return '<div class="empty-note">No photos or files uploaded yet.</div>';
  }

  const files = job.files.map((file, index) => ({ file, index }));
  const activeCategory = state.fileCategoryFilter || "all";
  const query = state.fileSearch.trim().toLowerCase();
  const filteredFiles = files.filter(({ file }) => {
    const category = fileCategory(file);
    const searchable = [
      file.name,
      file.note,
      file.source,
      file.type,
      fileCategoryLabel(category)
    ].join(" ").toLowerCase();
    return (activeCategory === "all" || category === activeCategory) && (!query || searchable.includes(query));
  });
  const grouped = groupFilesByCategory(filteredFiles);
  const categories = fileCategoryDefinitions();

  return `
    <div class="document-center" data-document-center>
      <div class="document-toolbar">
        <label class="document-search">
          <span>Search files</span>
          <input type="search" data-file-search placeholder="Find file, receipt, approval, photo" value="${escapeHtml(state.fileSearch)}">
        </label>
        <div class="document-filter-row" aria-label="Filter files">
          <button class="document-filter ${activeCategory === "all" ? "active" : ""}" type="button" data-file-filter="all">
            All <span>${files.length}</span>
          </button>
          ${categories.map((category) => {
            const count = files.filter(({ file }) => fileCategory(file) === category.id).length;
            return `
              <button class="document-filter ${activeCategory === category.id ? "active" : ""}" type="button" data-file-filter="${escapeHtml(category.id)}">
                ${escapeHtml(category.label)} <span>${count}</span>
              </button>
            `;
          }).join("")}
        </div>
      </div>
      <div class="file-list document-file-list">
        ${filteredFiles.length ? categories
          .filter((category) => grouped[category.id]?.length)
          .map((category) => renderFileGroup(category, grouped[category.id]))
          .join("") : '<div class="empty-note">No files match that search or filter.</div>'}
      </div>
    </div>
  `;
}

function fileCategoryDefinitions() {
  return [
    { id: "approvals", label: "Approvals", description: "Approved estimate PDFs and signature records" },
    { id: "billing", label: "Billing", description: "Invoices and payment receipts" },
    { id: "photos", label: "Photos", description: "Images from the field" },
    { id: "documents", label: "Documents", description: "PDFs and office files" },
    { id: "uploads", label: "Uploads", description: "General uploaded files" }
  ];
}

function fileCategoryLabel(categoryId) {
  return fileCategoryDefinitions().find((category) => category.id === categoryId)?.label || "Files";
}

function fileCategory(file = {}) {
  const source = String(file.source || "").toLowerCase();
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();
  if (source.includes("approval") || name.includes("approval")) return "approvals";
  if (source.includes("invoice") || source.includes("receipt") || name.includes("invoice") || name.includes("receipt")) return "billing";
  if (type.startsWith("image/")) return "photos";
  if (type.includes("pdf") || type.includes("document") || /\.(pdf|doc|docx)$/i.test(name)) return "documents";
  return "uploads";
}

function groupFilesByCategory(files = []) {
  return files.reduce((groups, item) => {
    const category = fileCategory(item.file);
    if (!groups[category]) groups[category] = [];
    groups[category].push(item);
    return groups;
  }, {});
}

function fileKindLabel(file = {}) {
  const type = String(file.type || "").toLowerCase();
  if (type.startsWith("image/")) return "Photo";
  if (type.includes("pdf")) return "PDF";
  if (type.includes("word") || /\.(doc|docx)$/i.test(file.name || "")) return "Doc";
  return "File";
}

function fileSizeLabel(size) {
  const bytes = Number(size) || 0;
  if (!bytes) return "Size unknown";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileCreatedLabel(value) {
  const date = new Date(value || 0);
  if (Number.isNaN(date.getTime())) return "No date";
  return date.toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function renderFileGroup(category, items = []) {
  return `
    <section class="file-group">
      <div class="file-group-header">
        <div>
          <h4>${escapeHtml(category.label)}</h4>
          <p>${escapeHtml(category.description)}</p>
        </div>
        <span>${items.length} file${items.length === 1 ? "" : "s"}</span>
      </div>
      ${items.map(({ file, index }) => `
        <div class="file-row document-file-row">
          <span class="file-icon">${escapeHtml(fileKindLabel(file))}</span>
          <span>
            <strong>${escapeHtml(file.name)}</strong>
            <small>${escapeHtml([file.note || file.source || "Job file", fileSizeLabel(file.size), fileCreatedLabel(file.createdAt)].filter(Boolean).join(" - "))}</small>
          </span>
          <span class="file-visibility ${file.customerVisible ? "visible" : "private"}">${file.customerVisible ? "Customer visible" : "Internal only"}</span>
          ${can("uploadFiles") ? `<button class="utility-button" type="button" data-file-visibility="${index}">${file.customerVisible ? "Hide from portal" : "Show in portal"}</button>` : ""}
          <button class="utility-button" type="button" data-view-file="${index}">View</button>
        </div>
      `).join("")}
    </section>
  `;
}

function refreshDocumentCenter(options = {}) {
  const job = selectedJob();
  const center = document.querySelector("[data-document-center]");
  if (!job || !center) {
    renderDetail();
    return;
  }
  const cursor = options.cursor ?? state.fileSearch.length;
  center.outerHTML = renderJobFiles(job);
  if (options.focusSearch) {
    requestAnimationFrame(() => {
      const input = document.querySelector("[data-file-search]");
      if (!input) return;
      input.focus();
      input.setSelectionRange?.(cursor, cursor);
    });
  }
}

function pricebookCategoryOptions() {
  return [...new Set(["Diagnostic", "Repair", "Install", "Maintenance", "Materials", "Discounts", ...state.pricebookItems.map((item) => normalizePricebookItem(item).category)])]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function pricebookUnitOptions() {
  return [...new Set(["each", "hour", "flat", "sq ft", "linear ft", "trip", ...state.pricebookItems.map((item) => normalizePricebookItem(item).unit)])]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

function backlineDropdown({ id, name, value = "", options = [], label = "", placeholder = "Select", direction = "up" }) {
  const normalizedOptions = options.map((option) => typeof option === "string"
    ? { value: option, label: option }
    : {
        value: String(option?.value || ""),
        label: String(option?.label || option?.value || "")
      }).filter((option) => option.value || option.label);
  const selected = String(value || normalizedOptions[0]?.value || "");
  const selectedOption = normalizedOptions.find((option) => option.value === selected) || normalizedOptions[0] || { value: selected, label: selected };
  return `
    <div class="backline-picker ${direction === "down" ? "opens-down" : ""}" data-backline-picker="${escapeHtml(id)}">
      ${label ? `<span class="backline-picker-label">${escapeHtml(label)}</span>` : ""}
      <input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(selectedOption.value)}">
      <button class="backline-picker-button" type="button" data-toggle-backline-picker="${escapeHtml(id)}" aria-expanded="false">
        <span>${escapeHtml(selectedOption.label || placeholder)}</span>
      </button>
      <div class="backline-picker-menu" hidden>
        ${normalizedOptions.map((option) => `
          <button type="button" data-backline-picker-option="${escapeHtml(option.value)}" data-backline-picker-label="${escapeHtml(option.label)}">${escapeHtml(option.label)}</button>
        `).join("")}
      </div>
    </div>
  `;
}

function themeOptionItems(selected = state.themePreference) {
  return [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" }
  ].map((option) => ({ ...option, selected: option.value === selected }));
}

function printRangeOptionItems(selected = "today") {
  return [
    { value: "today", label: "Today" },
    { value: "week", label: "This week" }
  ].map((option) => ({ ...option, selected: option.value === selected }));
}

function supplierContactOptionItems(selected = "phone") {
  return [
    { value: "phone", label: "Phone" },
    { value: "email", label: "Email" },
    { value: "website", label: "Website" },
    { value: "in person", label: "In person" }
  ].map((option) => ({ ...option, selected: option.value === selected }));
}

function paymentMethodOptionItems(selected = "card") {
  return [
    { value: "card", label: "Card" },
    { value: "ach", label: "ACH" },
    { value: "cash", label: "Cash" },
    { value: "check", label: "Check" },
    { value: "financing", label: "Financing" },
    { value: "other", label: "Other" }
  ].map((option) => ({ ...option, selected: option.value === selected }));
}

function customRoleTemplateOptionItems(selected = "preset:office-manager") {
  return [
    { value: "preset:office-manager", label: "Office manager" },
    { value: "preset:lead-tech", label: "Lead tech" },
    { value: "preset:sales-estimator", label: "Sales / estimator" },
    { value: "preset:bookkeeper", label: "Bookkeeper" },
    { value: "tech", label: "Technician" },
    { value: "dispatcher", label: "Dispatcher" },
    { value: "admin", label: "Admin" }
  ].map((option) => ({ ...option, selected: option.value === selected }));
}

function activityTypeOptionItems(selected = state.activityTypeFilter || "all") {
  return ["all", "created", "updated", "schedule", "status", "role", "deleted", "restored"]
    .map((value) => ({
      value,
      label: value === "all" ? "All activity" : activityTypeLabel(value),
      selected: value === selected
    }));
}

function roleChoiceOptionItems(selected = currentRole(), { includeOwner = false, assignableOnly = false } = {}) {
  const roles = assignableOnly ? allAssignableRoles() : allRoleChoices({ includeOwner });
  return roles.map((role) => ({
    value: role.slug,
    label: role.label || roleName(role.slug),
    selected: role.slug === selected
  }));
}

function renderThemePicker() {
  if (!elements.themeSelect) return;
  elements.themeSelect.innerHTML = backlineDropdown({
    id: "settings-theme",
    name: "theme",
    value: state.themePreference,
    options: themeOptionItems(state.themePreference),
    direction: "down"
  });
}

function renderPrintRangePicker(value = "today") {
  if (!elements.printScheduleRange) return;
  const currentValue = elements.printScheduleRange.querySelector("input[name='printScheduleRange']")?.value || value;
  elements.printScheduleRange.innerHTML = backlineDropdown({
    id: "settings-print-range",
    name: "printScheduleRange",
    value: currentValue,
    options: printRangeOptionItems(currentValue),
    direction: "down"
  });
}

function renderSettingsPickers() {
  renderThemePicker();
  renderPrintRangePicker();
}

function renderSupplierPreferredContactPicker(value = "phone") {
  if (!elements.supplierPreferredContactPicker) return;
  elements.supplierPreferredContactPicker.innerHTML = backlineDropdown({
    id: "supplier-preferred-contact",
    name: "preferredContact",
    value: value || "phone",
    options: supplierContactOptionItems(value || "phone"),
    direction: "up"
  });
}

function renderTeamInviteRolePicker(value = "tech") {
  if (!elements.teamInviteRolePicker) return;
  elements.teamInviteRolePicker.innerHTML = backlineDropdown({
    id: "team-invite-role",
    name: "role",
    value,
    options: roleChoiceOptionItems(value, { assignableOnly: true }),
    direction: "up"
  });
}

function renderCustomRoleTemplatePicker(value = "preset:office-manager", disabled = false) {
  if (!elements.customRoleTemplatePicker) return;
  const markup = backlineDropdown({
    id: "custom-role-template",
    name: "template",
    value,
    options: customRoleTemplateOptionItems(value),
    direction: "down"
  });
  elements.customRoleTemplatePicker.innerHTML = disabled
    ? `<div class="disabled-picker">${markup}</div>`
    : markup;
  elements.customRoleTemplatePicker.querySelector("button")?.toggleAttribute("disabled", disabled);
}

function renderRolePreviewPicker(value = state.rolePreviewSlug || currentRole()) {
  if (!elements.rolePreviewSelect) return;
  elements.rolePreviewSelect.innerHTML = backlineDropdown({
    id: "role-preview",
    name: "rolePreview",
    value,
    options: roleChoiceOptionItems(value, { includeOwner: true }),
    direction: "down"
  });
}

function renderActivityTypeFilterPicker() {
  if (!elements.activityTypeFilter) return;
  elements.activityTypeFilter.innerHTML = backlineDropdown({
    id: "activity-type-filter",
    name: "activityTypeFilter",
    value: state.activityTypeFilter || "all",
    options: activityTypeOptionItems(state.activityTypeFilter || "all"),
    direction: "down"
  });
}

function renderActivityDateFilterPicker(events = []) {
  if (!elements.activityDateFilter) return;
  const days = activityDayOptions(events);
  if (state.activityDateFilter !== "all" && !days.includes(state.activityDateFilter)) {
    state.activityDateFilter = "all";
  }
  const options = [
    { value: "all", label: "All days" },
    ...days.map((key) => ({ value: key, label: activityDayLabel(key) }))
  ];
  elements.activityDateFilter.innerHTML = backlineDropdown({
    id: "activity-date-filter",
    name: "activityDateFilter",
    value: state.activityDateFilter,
    options,
    direction: "down"
  });
}

function renderUnitPicker(id, value = "each", label = "") {
  return backlineDropdown({
    id,
    name: "unit",
    value: value || "each",
    options: pricebookUnitOptions(),
    label,
    placeholder: "Unit"
  });
}

function renderCategoryPicker(id, value = "Repair", label = "") {
  return backlineDropdown({
    id,
    name: "category",
    value: value || "Repair",
    options: pricebookCategoryOptions(),
    label,
    placeholder: "Category"
  });
}

function renderTimeZonePicker(id, value = defaultCompanySettings.timeZone, label = "") {
  const options = [...new Set([...timeZoneOptions, value].filter(Boolean))];
  return backlineDropdown({
    id,
    name: "timeZone",
    value: value || defaultCompanySettings.timeZone,
    options,
    label,
    placeholder: "Time zone",
    direction: "down"
  });
}

function renderEstimatePackagePicker(id, value = "Custom", label = "") {
  return backlineDropdown({
    id,
    name: "packageName",
    value: estimatePackageOptions.includes(value) ? value : "Custom",
    options: estimatePackageOptions,
    label,
    placeholder: "Package",
    direction: "down"
  });
}

function activePricebookItems() {
  return state.pricebookItems
    .map(normalizePricebookItem)
    .filter((item) => item.active && item.name)
    .sort((a, b) => `${a.category} ${a.name}`.localeCompare(`${b.category} ${b.name}`));
}

function renderPricebookSelect() {
  const items = activePricebookItems();
  return backlineDropdown({
    id: "invoice-line-pricebook",
    name: "pricebookItemId",
    value: "",
    options: [
      { value: "", label: "Custom line item" },
      ...items.map((item) => ({
        value: item.id,
        label: `${item.category} - ${item.name} (${formatMoney(item.unitPrice)}/${item.unit})`
      }))
    ],
    placeholder: "Line item",
    direction: "up"
  });
}

function applyInvoiceLinePricebookSelection(form, itemId) {
  const item = pricebookItemById(itemId);
  if (!form || !item) return;
  form.querySelector('[name="description"]').value = item.name;
  form.querySelector('[name="unitPrice"]').value = item.unitPrice;
  const unitInput = form.querySelector('[name="unit"]');
  if (unitInput) unitInput.value = item.unit;
  const unitPickerLabel = unitInput?.closest(".backline-picker")?.querySelector(".backline-picker-button span");
  if (unitPickerLabel) unitPickerLabel.textContent = item.unit;
  form.querySelector('[name="taxable"]').checked = item.taxable;
}

function pricebookLineFromItem(item = {}) {
  const pricebookItem = normalizePricebookItem(item);
  return normalizeInvoiceLineItem({
    pricebookItemId: pricebookItem.id,
    description: pricebookItem.name,
    category: pricebookItem.category,
    qty: 1,
    unitPrice: pricebookItem.unitPrice,
    unit: pricebookItem.unit,
    taxable: pricebookItem.taxable,
    source: "pricebook",
    sourceId: pricebookItem.id,
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName()
  });
}

function templatePricebookMatches(job = {}) {
  const template = jobTemplateFor(job);
  const terms = templateRecommendationsFromValue(template.recommendations)
    .map(normalizedTemplateText)
    .filter((term) => term.length >= 3);
  if (!terms.length) return [];
  return activePricebookItems()
    .filter((item) => {
      const itemText = normalizedTemplateText(`${item.category} ${item.name} ${item.description}`);
      return terms.some((term) => itemText.includes(term) || term.includes(normalizedTemplateText(item.name)));
    })
    .slice(0, 6);
}

function renderTemplatePricebookRecommendations(job) {
  if (!can("invoice") || isLockedBillingJob(job)) return "";
  const matches = templatePricebookMatches(job);
  if (!matches.length) return "";
  const invoice = invoiceRecord(job);
  const existingIds = new Set((invoice.lineItems || []).map((line) => normalizeInvoiceLineItem(line).pricebookItemId).filter(Boolean));
  return `
    <div class="template-pricebook-panel">
      <div class="template-pricebook-header">
        <span>Template pricebook suggestions</span>
        <small>${escapeHtml(jobTemplateFor(job).title)}</small>
      </div>
      <div class="template-pricebook-list">
        ${matches.map((item) => {
          const alreadyAdded = existingIds.has(item.id);
          return `
            <div class="template-pricebook-row">
              <span>
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(item.category)} - ${escapeHtml(formatMoney(item.unitPrice))}/${escapeHtml(item.unit)}</small>
              </span>
              <button class="utility-button" type="button" data-add-template-pricebook-line="${escapeHtml(item.id)}" ${alreadyAdded ? "disabled" : ""}>
                ${alreadyAdded ? "Added" : "Add"}
              </button>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;
}

function renderInvoiceLineItems(job) {
  const invoice = invoiceRecord(job);
  const lines = invoice.lineItems || [];
  return `
    <div class="invoice-line-items">
      <div class="invoice-line-header">
        <span>Line item</span>
        <span>Qty</span>
        <span>Rate</span>
        <span>Total</span>
        <span></span>
      </div>
      ${lines.length ? lines.map((line, index) => `
        <div class="invoice-line-row">
          <span>
            <strong>${escapeHtml(line.description)}</strong>
            <small>${escapeHtml(line.category)} - ${escapeHtml(line.unit)}${isEstimateInvoiceLine(line) ? " - from estimate" : ""}${line.taxable ? " - taxable" : ""}</small>
          </span>
          <span>${escapeHtml(line.qty)}</span>
          <span>${escapeHtml(formatMoney(line.unitPrice))}</span>
          <span>${escapeHtml(formatMoney(invoiceLineItemTotal(line)))}</span>
          ${can("invoice")
            ? isProtectedInvoiceLine(line)
              ? '<span class="invoice-locked-line">Locked</span>'
              : `<button class="invoice-remove-button" type="button" data-delete-line-index="${index}" aria-label="Remove line item">Remove</button>`
            : "<span></span>"}
        </div>
      `).join("") : '<div class="empty-note">No line items yet. Add custom items or pull from your pricebook.</div>'}
    </div>
  `;
}

function renderInvoiceLineItemForm(job) {
  if (!can("invoice")) return "";
  if (isLockedBillingJob(job)) {
    return `
      <div class="invoice-lock-note">
        <span>This invoice is locked because the job is ${escapeHtml(statusLabel(job.status))}.</span>
        ${can("reopen") ? '<button class="utility-button" type="button" data-action="reopen">Reopen job</button>' : ""}
      </div>
    `;
  }
  const hasUnbilledParts = unbilledJobParts(job).length > 0;
  return `
    <form class="invoice-line-form" data-invoice-line-form>
      ${renderPricebookSelect()}
      <input name="description" placeholder="Description or override">
      <input name="qty" type="number" step="0.01" min="0" value="1" aria-label="Quantity">
      <input name="unitPrice" type="number" step="0.01" placeholder="Unit price">
      ${renderUnitPicker(`invoice-line-unit-${job.id}`, "each")}
      <label class="checkbox-field">
        <input type="checkbox" name="taxable">
        Taxable
      </label>
      <button class="secondary-button" type="submit">Add line</button>
      <div class="invoice-line-status" data-invoice-line-status hidden></div>
    </form>
    ${hasUnbilledParts ? '<button class="utility-button" type="button" data-add-parts-lines>Add all unbilled parts</button>' : ""}
  `;
}

function paymentKindLabel(kind = "payment") {
  const labels = {
    deposit: "Deposit",
    payment: "Payment",
    refund: "Refund",
    credit: "Credit"
  };
  return labels[kind] || "Payment";
}

function billingTimelineDateLabel(value = "") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "Recently");
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function billingTimelineMessageEvent(message = {}) {
  const normalized = normalizeJobMessage(message);
  const body = String(normalized.body || "");
  const lower = body.toLowerCase();
  if (lower.includes("payment recorded") || lower.includes("receipt generated")) return null;
  if (![
    "invoice created from approved estimate",
    "invoice line item added",
    "invoice line item removed",
    "job reopened for invoice edits",
    "invoice ",
    "estimate revision"
  ].some((phrase) => lower.includes(phrase))) {
    return null;
  }
  let title = "Billing updated";
  if (lower.includes("invoice created from approved estimate")) title = "Invoice created";
  if (lower.includes("invoice line item added")) title = "Line item added";
  if (lower.includes("invoice line item removed")) title = "Line item removed";
  if (lower.includes("job reopened for invoice edits")) title = "Billing reopened";
  if (lower.includes("invoice ") && lower.includes("saved")) title = "Invoice saved";
  if (lower.includes("estimate revision")) title = "Estimate prepared";
  return {
    type: "note",
    title,
    detail: body,
    createdAt: normalized.createdAt,
    actor: normalized.createdBy || "Backline"
  };
}

function billingTimelineEvents(job = {}) {
  const invoice = invoiceRecord(job);
  const estimateEvents = normalizeEstimateHistory(job.estimateHistory || [], job).flatMap((estimate) => {
    const events = [{
      type: "estimate",
      title: `Estimate #${estimate.revisionNumber} prepared`,
      detail: `${estimate.packageName} for ${formatMoney(estimate.amount)}${estimate.depositRequested ? `, ${formatMoney(estimate.depositRequested)} deposit requested` : ""}`,
      createdAt: estimate.createdAt,
      actor: estimate.createdBy || "Backline"
    }];
    if (estimate.sentAt) {
      events.push({
        type: "estimate",
        title: `Estimate #${estimate.revisionNumber} sent`,
        detail: `${formatMoney(estimate.amount)} sent for customer approval`,
        createdAt: estimate.sentAt,
        actor: estimate.updatedBy || estimate.createdBy || "Backline"
      });
    }
    if (estimate.approvedAt) {
      events.push({
        type: "approved",
        title: `Estimate #${estimate.revisionNumber} approved`,
        detail: `${formatMoney(estimate.amount)} approved by customer`,
        createdAt: estimate.approvedAt,
        actor: estimate.updatedBy || "Customer"
      });
    }
    if (estimate.declinedAt) {
      events.push({
        type: "declined",
        title: `Estimate #${estimate.revisionNumber} declined`,
        detail: estimate.declineReason || "Customer declined the estimate",
        createdAt: estimate.declinedAt,
        actor: estimate.updatedBy || "Customer"
      });
    }
    return events;
  });
  const paymentEvents = paymentRecords(invoice).map((payment) => ({
    type: "payment",
    title: `${paymentKindLabel(payment.kind)} recorded`,
    detail: `${formatMoney(payment.amount)} by ${paymentMethodLabel(payment.method)}${payment.note ? ` - ${payment.note}` : ""}`,
    createdAt: payment.createdAt || payment.paidAt,
    actor: payment.createdBy || "Backline"
  }));
  const receiptEvents = (job.files || [])
    .filter((file) => String(file.source || "").toLowerCase() === "receipt pdf")
    .map((file) => ({
      type: "receipt",
      title: "Receipt generated",
      detail: file.name || "Payment receipt attached to job files",
      createdAt: file.createdAt,
      actor: "Backline"
    }));
  const messageEvents = (job.messages || [])
    .map(billingTimelineMessageEvent)
    .filter(Boolean);
  return [...estimateEvents, ...messageEvents, ...paymentEvents, ...receiptEvents]
    .filter((event) => event.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);
}

function renderBillingTimeline(job) {
  const events = billingTimelineEvents(job);
  return `
    <div class="billing-timeline">
      <div class="billing-timeline-header">
        <span>Billing timeline</span>
        <small>${escapeHtml(events.length ? `${events.length} recent event${events.length === 1 ? "" : "s"}` : "No billing activity yet")}</small>
      </div>
      ${events.length ? events.map((event) => `
        <div class="billing-timeline-row ${escapeHtml(event.type)}">
          <span class="billing-timeline-dot" aria-hidden="true"></span>
          <span>
            <strong>${escapeHtml(event.title)}</strong>
            <small>${escapeHtml(event.detail)}</small>
          </span>
          <time>${escapeHtml(billingTimelineDateLabel(event.createdAt))}</time>
        </div>
      `).join("") : '<div class="empty-note">Invoice, payment, and receipt events will appear here.</div>'}
    </div>
  `;
}

function paymentReceiptFile(job = {}, payment = {}) {
  const record = normalizePaymentRecord(payment);
  const files = Array.isArray(job.files) ? job.files : [];
  if (record.receiptFileId) {
    return files.find((file) => file.id === record.receiptFileId) || null;
  }
  if (record.receiptFileName) {
    return files.find((file) => file.name === record.receiptFileName) || null;
  }
  return null;
}

function attachReceiptToPayment(job = {}, paymentId = "") {
  const invoice = invoiceRecord(job);
  const payment = paymentRecords(invoice).find((record) => record.id === paymentId);
  if (!payment) {
    throw new Error("Payment record was not found.");
  }
  const existingReceipt = paymentReceiptFile(job, payment);
  if (existingReceipt) {
    return existingReceipt;
  }
  const receiptPdfFile = createReceiptPdfFile(job, payment);
  job.files = [...(job.files || []), receiptPdfFile];
  const payments = paymentRecords(invoice).map((record) => record.id === payment.id
    ? normalizePaymentRecord({
        ...record,
        receiptFileId: receiptPdfFile.id,
        receiptFileName: receiptPdfFile.name
      })
    : record);
  job.invoice = normalizeInvoiceRecord({
    ...invoice,
    payments,
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  }, job);
  return receiptPdfFile;
}

function renderPaymentLedger(job) {
  const invoice = invoiceRecord(job);
  const payments = paymentRecords(invoice);
  return `
    <div class="invoice-line-items payment-ledger-list">
      <div class="invoice-line-header">
        <span>Payment history</span>
        <span>Type</span>
        <span>Amount</span>
        <span>Method</span>
        <span>Recorded</span>
        <span>Receipt</span>
      </div>
      ${payments.length ? payments.slice().reverse().map((payment) => {
        const receipt = paymentReceiptFile(job, payment);
        const canGenerateReceipt = can("paid") || can("invoice");
        return `
        <div class="invoice-line-row">
          <span>
            <strong>${escapeHtml(formatDateLabel(payment.paidAt || payment.createdAt, { includeYear: true }))}</strong>
            <small>${escapeHtml(payment.note || "No note")}</small>
          </span>
          <span>${escapeHtml(paymentKindLabel(payment.kind))}</span>
          <span>${escapeHtml(formatMoney(payment.amount))}</span>
          <span>${escapeHtml(paymentMethodLabel(payment.method))}</span>
          <span>${escapeHtml(payment.createdBy || "Backline")}</span>
          <span>
            ${receipt
              ? `<button class="receipt-action-button" type="button" data-view-receipt-file="${escapeHtml(receipt.id)}">View receipt</button>`
              : canGenerateReceipt
                ? `<button class="receipt-action-button" type="button" data-generate-receipt-payment="${escapeHtml(payment.id)}">Generate</button>`
                : '<span class="invoice-locked-line">None</span>'}
          </span>
        </div>
      `;
      }).join("") : '<div class="empty-note">No payments recorded yet.</div>'}
    </div>
  `;
}

function renderBillingReview(job) {
  if (!can("invoice")) return "";
  const items = billingReviewItems(job);
  const issueCount = items.filter((item) => ["warning", "danger", "neutral"].includes(item.tone)).length;
  return `
    <div class="billing-review-panel">
      <div class="billing-review-header">
        <span>Billing review</span>
        <strong>${issueCount ? `${issueCount} item${issueCount === 1 ? "" : "s"} to check` : "Looks clean"}</strong>
      </div>
      <div class="billing-review-list">
        ${items.map((item) => `
          <div class="billing-review-item ${escapeHtml(item.tone)}">
            <span>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.detail)}</small>
            </span>
            ${item.action ? `<button class="utility-button" type="button" ${item.actionAttribute}>${escapeHtml(item.action)}</button>` : '<em>Logged</em>'}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function renderInvoicePanel(job) {
  ensureJobDefaults(job);
  const invoice = invoiceRecord(job);
  const balance = invoiceBalance(job);
  return `
    <section class="field-panel invoice-panel">
      <div class="section-heading">
        <div>
          <h3>Invoice and payment</h3>
          <p>Track what was billed, collected, and still owed on this job.</p>
        </div>
        <span class="pill ${escapeHtml(invoice.status === "sent" ? "invoiced" : invoice.status)}">${escapeHtml(invoiceStatusLabel(invoice.status))}</span>
      </div>
      <div class="invoice-summary-grid">
        <div class="invoice-summary-card">
          <span>Invoice</span>
          <strong>${escapeHtml(invoice.number)}</strong>
          <small>${escapeHtml(invoice.updatedAt ? `Updated by ${invoice.updatedBy || "Backline"}` : "Not sent yet")}</small>
        </div>
        <div class="invoice-summary-card">
          <span>Total billed</span>
          <strong>${escapeHtml(formatMoney(invoice.amount))}</strong>
          <small>All billable work</small>
        </div>
        <div class="invoice-summary-card">
          <span>Collected</span>
          <strong>${escapeHtml(formatMoney(invoice.depositCollected + invoice.paidAmount))}</strong>
          <small>${escapeHtml(invoice.depositCollected + invoice.paidAmount ? paymentMethodLabel(invoice.paymentMethod) : "No payments yet")}</small>
        </div>
        <div class="invoice-summary-card ${balance ? "due" : "paid"}">
          <span>Balance due</span>
          <strong>${escapeHtml(formatMoney(balance))}</strong>
          <small>${balance ? "Still owed" : "Paid in full"}</small>
        </div>
      </div>
      ${renderBillingReview(job)}
      ${renderInvoiceLineItems(job)}
      ${renderPaymentLedger(job)}
      ${renderBillingTimeline(job)}
      ${renderTemplatePricebookRecommendations(job)}
      ${renderInvoiceLineItemForm(job)}
      ${invoice.note ? `<div class="invoice-note">${escapeHtml(invoice.note)}</div>` : ""}
      ${can("invoice") || can("paid") ? `
        <div class="invoice-actions">
          ${can("invoice") ? '<button class="action-button" type="button" data-action="invoice">Edit invoice</button>' : ""}
          ${can("paid") ? '<button class="action-button accent" type="button" data-action="paid">Record payment</button>' : ""}
        </div>
      ` : ""}
    </section>
  `;
}

function renderJobCostingPanel(job) {
  if (!canViewJobCosting()) return "";
  const costing = jobCostingSummary(job);
  const laborHours = jobHasLaborWindow(job) ? (jobDurationMinutes(job) / 60).toFixed(1).replace(/\.0$/, "") : "0";
  const partCount = (job.parts || []).length;
  return `
    <section class="field-panel costing-panel">
      <div class="section-heading">
        <div>
          <h3>Job costing</h3>
          <p>Owner margin view from billed work, scheduled labor, and logged parts.</p>
        </div>
        <span class="pill ${escapeHtml(costing.status)}">${escapeHtml(costing.label)}</span>
      </div>
      <div class="costing-summary-grid">
        <div class="costing-card">
          <span>Revenue</span>
          <strong>${escapeHtml(formatMoney(costing.revenue))}</strong>
          <small>Billed, estimated, or job value</small>
        </div>
        <div class="costing-card">
          <span>Direct cost</span>
          <strong>${escapeHtml(formatMoney(costing.directCost))}</strong>
          <small>Labor plus parts</small>
        </div>
        <div class="costing-card ${costing.status === "at-risk" || costing.status === "unpriced" ? "warning" : "healthy"}">
          <span>Gross margin</span>
          <strong>${escapeHtml(formatMoney(costing.grossMargin))}</strong>
          <small>${escapeHtml(costing.revenue ? `${costing.marginPercent}% margin` : "No revenue set")}</small>
        </div>
        <div class="costing-card">
          <span>Collected</span>
          <strong>${escapeHtml(formatMoney(costing.collected))}</strong>
          <small>Payments recorded</small>
        </div>
      </div>
      <div class="costing-breakdown">
        <div>
          <span>Labor estimate</span>
          <strong>${escapeHtml(formatMoney(costing.laborCost))}</strong>
          <small>${escapeHtml(`${laborHours} hr at ${formatMoney(companySettings().defaultLaborCostRate)}/hr`)}</small>
        </div>
        <div>
          <span>Parts and materials</span>
          <strong>${escapeHtml(formatMoney(costing.partsCost))}</strong>
          <small>${escapeHtml(`${partCount} logged item${partCount === 1 ? "" : "s"}`)}</small>
        </div>
        <div>
          <span>Target margin</span>
          <strong>${escapeHtml(`${costing.targetMargin}%`)}</strong>
          <small>Workspace setting</small>
        </div>
      </div>
      ${costing.status === "at-risk" ? '<div class="costing-warning">This job is below the workspace margin target. Review pricing, parts cost, or labor time before closing it out.</div>' : ""}
      ${costing.status === "unpriced" ? '<div class="costing-warning">Costs are logged, but no revenue is attached yet. Add an estimate or invoice line before this job is considered priced.</div>' : ""}
    </section>
  `;
}

function estimateRevisionLabel(status = "draft") {
  const labels = {
    draft: "Draft",
    sent: "Sent",
    approved: "Approved",
    declined: "Declined"
  };
  return labels[estimateRevisionStatus(status)] || "Draft";
}

function renderEstimateHistory(job) {
  const history = normalizeEstimateHistory(job.estimateHistory || [], job);
  if (!history.length) return "";
  return `
    <div class="invoice-line-items estimate-history-list">
      <div class="invoice-line-header">
        <span>Revision</span>
        <span>Status</span>
        <span>Total</span>
        <span>Deposit</span>
        <span>Created</span>
      </div>
      ${history.slice().reverse().map((revision) => `
        <div class="invoice-line-row">
          <span>
            <strong>Estimate #${escapeHtml(revision.revisionNumber)}</strong>
            <small>${escapeHtml(revision.packageName)}${revision.revisionNumber === history.length ? " - current" : ""}</small>
          </span>
          <span>${escapeHtml(estimateRevisionLabel(revision.status))}</span>
          <span>${escapeHtml(formatMoney(revision.amount))}</span>
          <span>${escapeHtml(formatMoney(revision.depositRequested))}</span>
          <span>${escapeHtml(new Date(revision.createdAt).toLocaleDateString())}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEstimatePanel(job) {
  ensureJobDefaults(job);
  const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
  const expires = estimate.expiresAt ? new Date(`${estimate.expiresAt}T12:00:00`).toLocaleDateString() : "Not set";
  return `
    <section class="field-panel invoice-panel">
      <div class="section-heading">
        <div>
          <h3>Estimate</h3>
          <p>Customer-facing package, terms, and approval defaults.</p>
        </div>
        <span class="pill estimated">${escapeHtml(job.approvalStatus.replaceAll("_", " "))}</span>
      </div>
      <div class="invoice-summary-grid">
        <div class="invoice-summary-card">
          <span>Package</span>
          <strong>${escapeHtml(estimate.packageName)}</strong>
          <small>${escapeHtml(estimate.updatedAt ? `Updated by ${estimate.updatedBy || "Backline"}` : "Uses workspace defaults")}</small>
        </div>
        <div class="invoice-summary-card">
          <span>Estimate total</span>
          <strong>${escapeHtml(formatMoney(estimate.amount))}</strong>
          <small>${escapeHtml(`${companySettings().defaultTaxRate}% default tax setting`)}</small>
        </div>
        <div class="invoice-summary-card">
          <span>Deposit</span>
          <strong>${escapeHtml(formatMoney(estimate.depositRequested))}</strong>
          <small>${escapeHtml(`${Math.round(estimate.depositPercent)}% requested`)}</small>
        </div>
        <div class="invoice-summary-card">
          <span>Expires</span>
          <strong>${escapeHtml(expires)}</strong>
          <small>${escapeHtml(`${estimate.expirationDays} day window`)}</small>
        </div>
      </div>
      <div class="invoice-note">${escapeHtml(estimate.introText)}</div>
      <div class="invoice-note">${escapeHtml(estimate.warrantyText)}</div>
      ${renderEstimateHistory(job)}
      ${can("estimate") || canCreateInvoiceFromEstimate(job) ? `
        <div class="invoice-actions">
          ${can("estimate") ? '<button class="action-button" type="button" data-action="estimate">Edit estimate</button>' : ""}
          ${canCreateInvoiceFromEstimate(job) ? '<button class="action-button accent" type="button" data-create-invoice-from-estimate>Create invoice from approved estimate</button>' : ""}
        </div>
      ` : ""}
    </section>
  `;
}

function renderJobActions() {
  const job = selectedJob();
  const lockedBilling = job && isLockedBillingJob(job);
  const closeAction = job && canCloseJob(job)
    ? { action: "close", label: "Close job", tone: "accent", group: "primary" }
    : lockedBilling
      ? { action: "reopen", label: "Reopen job", tone: "accent", group: "primary" }
      : null;
  const actions = [
    closeAction,
    { action: "book", label: isScheduled(job || {}) ? "Reschedule" : "Book", tone: "accent", group: "primary" },
    { action: "start", label: "Start", tone: "", group: "primary" },
    { action: "complete", label: "Job completed", tone: "", group: "primary" },
    { action: "portal", label: "Portal link", tone: "", group: "Customer" },
    { action: "portal-update", label: "Send portal update", tone: "", group: "Customer" },
    { action: "estimate", label: "Estimate", tone: "", group: "Estimate" },
    { action: "approval", label: "Approval link", tone: "", group: "Estimate" },
    { action: "approve", label: "Mark approved", tone: "", group: "Estimate" },
    { action: "change", label: "Change order", tone: "", group: "Estimate" },
    { action: "payment-request", label: "Request payment", tone: "accent", group: "Billing" },
    { action: "invoice", label: "Invoice", tone: "", group: "Billing" },
    { action: "paid", label: "Mark paid", tone: "", group: "Billing" },
    { action: "parts", label: "Log parts", tone: "", group: "Field" },
    { action: "delete", label: "Delete", tone: "danger", group: "Admin" }
  ].filter(Boolean)
    .filter(({ action }) => can(action))
    .filter(({ action }) => !lockedBilling || ["reopen", "close", "delete"].includes(action));

  const actionButton = ({ action, label, tone }, extraClass = "") => `
    <button class="action-button ${tone} ${extraClass}" type="button" data-action="${action}">${label}</button>
  `;
  const primaryActions = actions.filter((item) => item.group === "primary").map((item) => actionButton(item)).join("");
  const secondaryGroups = ["Customer", "Estimate", "Billing", "Field", "Admin"]
    .map((group) => {
      const groupActions = actions.filter((item) => item.group === group);
      if (!groupActions.length) return "";
      return `
        <div class="job-action-menu-group">
          <span>${group}</span>
          <div>${groupActions.map((item) => actionButton(item)).join("")}</div>
        </div>
      `;
    })
    .join("");

  const desktopActions = `
    <div class="desktop-job-actions">
      ${primaryActions}
      ${secondaryGroups ? `
        <button class="action-button job-action-menu-trigger" type="button" data-toggle-job-action-menu aria-expanded="${state.jobActionMenuOpen}">
          More actions
        </button>
        ${state.jobActionMenuOpen ? `
          <div class="job-action-menu-panel">
            ${secondaryGroups}
          </div>
        ` : ""}
      ` : ""}
    </div>
  `;

  const mobileActions = `
    <div class="mobile-job-actions">
      <div class="mobile-primary-actions">
        ${actions.filter((item) => item.group === "primary").map((item) => actionButton(item, "mobile-action-button")).join("")}
      </div>
      ${secondaryGroups ? `
        <button class="action-button job-action-menu-trigger mobile-more-actions-trigger" type="button" data-toggle-job-action-menu aria-expanded="${state.jobActionMenuOpen}">
          More actions
        </button>
        ${state.jobActionMenuOpen ? `
          <div class="job-action-menu-panel mobile-job-action-panel">
            ${secondaryGroups}
          </div>
        ` : ""}
      ` : ""}
    </div>
  `;

  return `
    ${desktopActions}
    ${mobileActions}
  `;
}

function renderPortalAccessPanel(job) {
  ensureJobDefaults(job);
  const portalReady = Boolean(job.portalToken);
  const unreadCount = unreadInboundMessages(job).length;
  const customerMessageCount = allCustomerPortalMessages(job).length;
  const fileCount = customerPortalFiles(job).length;
  const request = activePaymentRequest(job);
  const createdAt = portalCreatedActivity(job);
  const lastActivity = portalLastActivity(job);
  return `
    <section class="field-panel portal-access-panel">
      <div class="section-heading">
        <div>
          <h3>Customer portal</h3>
          <p>Reusable customer link, visible updates, files, and replies.</p>
        </div>
        <span class="pill ${portalReady ? "scheduled" : "estimated"}">${portalReady ? "Ready" : "Not created"}</span>
      </div>
      <div class="portal-access-grid">
        <div class="portal-access-card">
          <span>Access</span>
          <strong>${portalReady ? "Secure link ready" : "Create link"}</strong>
          <small>${escapeHtml(createdAt ? `First shared ${createdAt}` : "No portal link has been copied yet")}</small>
        </div>
        <div class="portal-access-card">
          <span>Customer activity</span>
          <strong>${escapeHtml(lastActivity || "No activity yet")}</strong>
          <small>${escapeHtml(`${customerMessageCount} visible update${customerMessageCount === 1 ? "" : "s"}`)}</small>
        </div>
        <div class="portal-access-card ${unreadCount ? "needs-attention" : ""}">
          <span>Unread replies</span>
          <strong>${escapeHtml(unreadCount)}</strong>
          <small>${unreadCount ? "Needs team follow-up" : "All caught up"}</small>
        </div>
        <div class="portal-access-card">
          <span>Customer files</span>
          <strong>${escapeHtml(fileCount)}</strong>
          <small>Visible in the portal</small>
        </div>
        <div class="portal-access-card ${request ? "needs-attention" : ""}">
          <span>Payment request</span>
          <strong>${escapeHtml(request ? formatMoney(request.amount) : "None")}</strong>
          <small>${escapeHtml(request ? `Due ${formatDateLabel(request.dueDate, { includeYear: true })}` : "No active request")}</small>
        </div>
      </div>
      <div class="portal-access-actions">
        ${can("portal") ? '<button class="action-button" type="button" data-action="portal">Copy portal link</button>' : ""}
        ${can("portal") ? '<button class="action-button" type="button" data-portal-preview>Preview as customer</button>' : ""}
        ${can("portal-update") ? '<button class="action-button accent" type="button" data-action="portal-update">Send portal update</button>' : ""}
      </div>
    </section>
  `;
}

function renderCustomerUpdatesPanel(job) {
  ensureJobDefaults(job);
  const messages = allCustomerPortalMessages(job).slice(-8);
  const unreadCount = unreadInboundMessages(job).length;
  return `
    <section class="field-panel customer-updates-panel">
      <div class="section-heading">
        <div>
          <h3>Customer updates</h3>
          <p>Only messages and updates that belong in the customer portal.</p>
        </div>
        <span class="pill ${unreadCount ? "urgent" : "scheduled"}">${unreadCount ? `${unreadCount} unread` : "Current"}</span>
      </div>
      <div class="customer-update-list">
        ${messages.length ? messages.map((message) => {
          const normalized = normalizeJobMessage(message);
          const isInbound = normalized.direction === "in";
          return `
            <article class="customer-update-row ${isInbound ? "inbound" : "outbound"}">
              <div>
                <span>${isInbound ? "Customer reply" : "Shop update"}</span>
                <strong>${escapeHtml(normalized.body)}</strong>
                <small>${escapeHtml(normalized.createdBy || (isInbound ? job.name : "Backline"))} - ${escapeHtml(normalized.createdAt)}</small>
              </div>
              ${isInbound && !normalized.seenBy[assignmentSeenKey()] ? '<span class="pill urgent">Unread</span>' : ""}
            </article>
          `;
        }).join("") : '<div class="empty-note">No customer-facing updates yet.</div>'}
      </div>
    </section>
  `;
}

function renderChecklist(job) {
  ensureJobDefaults(job);
  const labels = templateChecklist(job);
  const checklist = [
    ["diagnosis", labels.diagnosis || "Diagnosis noted"],
    ["photos", labels.photos || "Photos captured"],
    ["signature", labels.signature || "Customer signature"]
  ];

  return `
    <div class="checklist-grid">
      ${checklist.map(([key, label]) => `
        <button class="check-item ${job.fieldChecklist[key] ? "done" : ""}" type="button" data-action="check-${key}" ${can(`check-${key}`) ? "" : "disabled"}>
          <span>${job.fieldChecklist[key] ? "Done" : "Open"}</span>
          <strong>${label}</strong>
        </button>
      `).join("")}
    </div>
  `;
}

function renderJobTemplateSummary(job) {
  ensureJobDefaults(job);
  const template = jobTemplateFor(job);
  const templateTaskCount = job.tasks.filter((task) => task.source === "template" && task.sourceKey?.startsWith(`${template.key}:`)).length;
  return `
    <section class="template-summary-card">
      <div>
        <span>Job template</span>
        <strong>${escapeHtml(template.title)}</strong>
        <small>${escapeHtml(template.description)}</small>
      </div>
      <div class="template-recommendations">
        ${template.recommendations.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}
      </div>
      <em>${templateTaskCount}/${template.tasks.length} template tasks added</em>
    </section>
  `;
}

function taskRoleLabel(role) {
  const labels = {
    any: "Any role",
    owner: "Owner/Admin",
    dispatcher: "Dispatcher",
    tech: "Technician"
  };
  return labels[role] || labels.any;
}

function taskPhaseLabel(phase) {
  const labels = {
    prep: "Before job",
    field: "During job",
    closeout: "Closeout",
    office: "Office"
  };
  return labels[phase] || labels.field;
}

function isTaskVisible(task) {
  const role = currentRole();
  if (["owner", "admin"].includes(role)) return true;
  if (task.role === "any") return true;
  if (role === "dispatcher") return ["dispatcher", "tech"].includes(task.role);
  return task.role === "tech";
}

function taskProgress(job) {
  ensureJobDefaults(job);
  const visible = job.tasks.filter(isTaskVisible);
  if (!visible.length) return "No tasks";
  const completed = visible.filter((task) => task.done).length;
  return `${completed}/${visible.length} done`;
}

function visibleJobTasks(job) {
  ensureJobDefaults(job);
  return job.tasks.filter(isTaskVisible);
}

function incompleteTaskCount(job) {
  return visibleJobTasks(job).filter((task) => !task.done).length;
}

function taskPhaseOptionItems(selected = "field") {
  return [
    { value: "prep", label: "Before job" },
    { value: "field", label: "During job" },
    { value: "closeout", label: "Closeout" },
    { value: "office", label: "Office" }
  ].map((option) => ({ ...option, selected: option.value === selected }));
}

function taskRoleOptionItems(selected = "tech") {
  const role = currentRole();
  const options = ["owner", "admin"].includes(role)
    ? [["any", "Any role"], ["owner", "Owner/Admin"], ["dispatcher", "Dispatcher"], ["tech", "Technician"]]
    : role === "dispatcher"
      ? [["dispatcher", "Dispatcher"], ["tech", "Technician"]]
      : [["tech", "Technician"]];
  return options.map(([value, label]) => ({ value, label, selected: value === selected }));
}

function renderJobTasks(job) {
  ensureJobDefaults(job);
  const tasks = job.tasks.filter(isTaskVisible);
  const template = jobTemplateFor(job);
  const missingTemplateTasks = template.tasks.length - job.tasks.filter((task) => task.source === "template" && task.sourceKey?.startsWith(`${template.key}:`)).length;
  return `
    <section class="field-panel task-panel">
      <div class="section-heading">
        <div>
          <h3>Job tasks</h3>
          <p>Role-based prep, field, and closeout work for this job.</p>
        </div>
        <div class="section-heading-actions">
          ${can("task") && missingTemplateTasks > 0 ? `<button class="utility-button" type="button" data-apply-job-template="${escapeHtml(job.id)}">Apply template</button>` : ""}
          <span class="pill ${tasks.every((task) => task.done) && tasks.length ? "paid" : "estimated"}">${escapeHtml(taskProgress(job))}</span>
        </div>
      </div>
      ${can("task") ? `
        <form class="task-form" data-task-form>
          <input name="title" placeholder="Add task, e.g. Confirm model number" required>
          ${backlineDropdown({
            id: `task-phase-${job.id}`,
            name: "phase",
            value: "field",
            options: taskPhaseOptionItems("field"),
            placeholder: "Task phase",
            direction: "up"
          })}
          ${backlineDropdown({
            id: `task-role-${job.id}`,
            name: "role",
            value: isFieldScopedRole() ? "tech" : "dispatcher",
            options: taskRoleOptionItems(isFieldScopedRole() ? "tech" : "dispatcher"),
            placeholder: "Assigned role",
            direction: "up"
          })}
          <button class="secondary-button" type="submit">Add task</button>
        </form>
      ` : ""}
      <div class="task-list">
        ${tasks.length ? tasks.map((task) => `
          <div class="task-row ${task.done ? "done" : ""}">
            <button class="task-check" type="button" data-task-toggle="${escapeHtml(task.id)}" ${can("task-toggle") ? "" : "disabled"} aria-label="${task.done ? "Mark task open" : "Mark task done"}">
              ${task.done ? "Reopen" : "Complete"}
            </button>
            <span>
              <strong>${escapeHtml(task.title)}</strong>
              <small>${escapeHtml(taskPhaseLabel(task.phase))} - ${escapeHtml(taskRoleLabel(task.role))}${task.doneBy ? ` - Completed by ${escapeHtml(task.doneBy)}` : ""}</small>
            </span>
          </div>
        `).join("") : '<div class="empty-note">No role tasks yet.</div>'}
      </div>
    </section>
  `;
}

function renderCustomerHistory(job) {
  const history = state.jobs
    .filter((item) => item.id !== job.id && item.phone === job.phone && isAssignedToCurrentUser(item))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (!history.length) {
    return '<div class="empty-note">No earlier jobs for this customer yet.</div>';
  }

  return `
    <div class="customer-history-list">
      ${history.map((item) => `
        <button class="customer-history-row" type="button" data-job-id="${item.id}">
          <span class="history-date">${escapeHtml(new Date(item.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }))}</span>
          <span class="history-main">
            <strong>${escapeHtml(item.issue)}</strong>
            <small>${escapeHtml(item.trade)} / ${escapeHtml(jobTypeLabel(item))} - ${escapeHtml(scheduleText(item))}</small>
          </span>
          <span class="history-meta">
            <b class="pill ${escapeHtml(item.status)}">${escapeHtml(statusLabel(item.status))}</b>
            <em>${escapeHtml(formatMoney(item.value))}</em>
          </span>
        </button>
      `).join("")}
    </div>
  `;
}

function equipmentLabel(record) {
  const equipment = normalizeEquipmentRecord(record);
  return [equipment.type, equipment.name].filter(Boolean).join(" - ") || "Equipment";
}

function equipmentMaintenanceStatus(record = {}) {
  const equipment = normalizeEquipmentRecord(record);
  const days = daysUntilISO(equipment.nextServiceDate);
  if (days === null) {
    return { tone: "neutral", label: "No reminder", detail: "Next service not set" };
  }
  if (days < 0) {
    return { tone: "due", label: "Past due", detail: `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue` };
  }
  if (days === 0) {
    return { tone: "due", label: "Due today", detail: "Maintenance due today" };
  }
  if (days <= 30) {
    return { tone: "upcoming", label: "Due soon", detail: `Due in ${days} day${days === 1 ? "" : "s"}` };
  }
  return { tone: "ok", label: "Scheduled", detail: `Due ${formatDateLabel(equipment.nextServiceDate, { includeYear: true })}` };
}

function equipmentMaintenanceBadge(record = {}) {
  const status = equipmentMaintenanceStatus(record);
  return `<span class="equipment-badge ${escapeHtml(status.tone)}" title="${escapeHtml(status.detail)}">${escapeHtml(status.label)}</span>`;
}

function equipmentServiceSummary(record = {}) {
  const equipment = normalizeEquipmentRecord(record);
  const parts = [
    equipment.condition ? `Condition: ${equipment.condition}` : "",
    equipment.serviceIntervalDays ? `Every ${equipment.serviceIntervalDays} days` : "",
    equipment.lastServiceDate ? `Last ${formatDateLabel(equipment.lastServiceDate, { includeYear: true })}` : "",
    equipment.nextServiceDate ? `Next ${formatDateLabel(equipment.nextServiceDate, { includeYear: true })}` : ""
  ].filter(Boolean);
  return parts.join(" - ") || "No maintenance cadence set";
}

function equipmentAssetKey(record = {}) {
  const equipment = normalizeEquipmentRecord(record);
  return equipment.id || [equipment.serial, equipment.model, equipment.name, equipment.location].map((value) => String(value || "").toLowerCase()).join(":");
}

function renderEquipmentList(job) {
  ensureJobDefaults(job);
  if (!job.equipment.length) {
    return `<div class="empty-note">No equipment or property records yet.</div>`;
  }
  const canEditEquipment = can("customer-profile");
  return `
    <div class="equipment-list">
      ${job.equipment.map((record) => {
        const equipment = normalizeEquipmentRecord(record);
        return `
          <article class="equipment-card ${escapeHtml(equipmentMaintenanceStatus(equipment).tone)}" data-equipment-record="${escapeHtml(equipment.id)}">
            <div class="equipment-card-header">
              <span>
                <strong>${escapeHtml(equipmentLabel(equipment))}</strong>
                <small>${escapeHtml([equipment.location, equipment.installDate ? `Installed ${formatDateLabel(equipment.installDate, { includeYear: true })}` : ""].filter(Boolean).join(" - ") || "No location or install date")}</small>
              </span>
              <span class="equipment-badges">${equipmentMaintenanceBadge(equipment)}</span>
            </div>
            <dl>
              <div><dt>Model</dt><dd>${escapeHtml(equipment.model || "Not set")}</dd></div>
              <div><dt>Serial</dt><dd>${escapeHtml(equipment.serial || "Not set")}</dd></div>
              <div><dt>Warranty</dt><dd>${escapeHtml(equipment.warranty || "Not set")}</dd></div>
              <div><dt>Next service</dt><dd>${escapeHtml(equipment.nextServiceDate ? formatDateLabel(equipment.nextServiceDate, { includeYear: true }) : "Not set")}</dd></div>
            </dl>
            <p>${escapeHtml(equipmentServiceSummary(equipment))}</p>
            ${equipment.notes ? `<p>${escapeHtml(equipment.notes)}</p>` : ""}
            <div class="equipment-card-actions">
              ${can("createJob") ? `<button class="utility-button" type="button" data-create-equipment-maintenance="${escapeHtml(equipment.id)}" data-source-job-id="${escapeHtml(job.id)}">Create maintenance job</button>` : ""}
            </div>
            ${canEditEquipment ? `<details class="equipment-editor" ${detailExpandedAttributes(`job:${job.id}:equipment:${equipment.id}:edit`)}>
              <summary>Edit equipment</summary>
              <form class="equipment-form" data-equipment-edit-form="${escapeHtml(equipment.id)}">
                <input name="type" value="${escapeHtml(equipment.type)}" placeholder="Type">
                <input name="name" value="${escapeHtml(equipment.name)}" placeholder="Name">
                <input name="model" value="${escapeHtml(equipment.model)}" placeholder="Model">
                <input name="serial" value="${escapeHtml(equipment.serial)}" placeholder="Serial">
                <input name="installDate" type="date" value="${escapeHtml(equipment.installDate)}" aria-label="Install date">
                <input name="warranty" value="${escapeHtml(equipment.warranty)}" placeholder="Warranty">
                <input name="location" value="${escapeHtml(equipment.location)}" placeholder="Location">
                <input name="condition" value="${escapeHtml(equipment.condition)}" placeholder="Condition">
                <input name="serviceIntervalDays" type="number" min="0" value="${escapeHtml(equipment.serviceIntervalDays || "")}" placeholder="Service every days">
                <input name="lastServiceDate" type="date" value="${escapeHtml(equipment.lastServiceDate)}" aria-label="Last service date">
                <input name="nextServiceDate" type="date" value="${escapeHtml(equipment.nextServiceDate)}" aria-label="Next service date">
                <input class="wide" name="notes" value="${escapeHtml(equipment.notes)}" placeholder="Notes">
                <button class="secondary-button" type="submit">Save</button>
              </form>
              <button class="utility-button danger-text" type="button" data-equipment-delete="${escapeHtml(equipment.id)}">Delete equipment</button>
            </details>` : ""}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function customerEquipmentRecords(customerId) {
  const records = customerJobs(customerId)
    .flatMap((job) => ensureJobDefaults(job).equipment.map((record) => ({
      ...normalizeEquipmentRecord(record),
      jobId: job.id,
      jobIssue: job.issue,
      jobDate: job.createdAt
    })))
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const unique = new Map();
  records.forEach((record) => {
    const key = equipmentAssetKey(record);
    if (!unique.has(key)) unique.set(key, record);
  });
  return [...unique.values()];
}

function renderCustomerEquipment(customerId) {
  const records = customerEquipmentRecords(customerId);
  if (!records.length) {
    return `<div class="empty-note">Equipment, fixtures, panels, water heaters, and system details will appear here once logged on a job.</div>`;
  }
  return `
    <div class="equipment-list customer-equipment-list">
      ${records.map((record) => `
        <article class="equipment-card customer-equipment-card ${escapeHtml(equipmentMaintenanceStatus(record).tone)}">
          <div class="equipment-card-header">
            <span>
              <strong>${escapeHtml(equipmentLabel(record))}</strong>
              <small>${escapeHtml([record.location, record.jobIssue].filter(Boolean).join(" - "))}</small>
            </span>
            <span class="equipment-badges">${equipmentMaintenanceBadge(record)}</span>
          </div>
          <dl>
            <div><dt>Model</dt><dd>${escapeHtml(record.model || "Not set")}</dd></div>
            <div><dt>Serial</dt><dd>${escapeHtml(record.serial || "Not set")}</dd></div>
            <div><dt>Warranty</dt><dd>${escapeHtml(record.warranty || "Not set")}</dd></div>
            <div><dt>Next service</dt><dd>${escapeHtml(record.nextServiceDate ? formatDateLabel(record.nextServiceDate, { includeYear: true }) : "Not set")}</dd></div>
          </dl>
          <p>${escapeHtml(equipmentServiceSummary(record))}</p>
          ${record.notes ? `<p>${escapeHtml(record.notes)}</p>` : ""}
          <div class="equipment-card-actions">
            <button class="utility-button" type="button" data-job-id="${escapeHtml(record.jobId)}">Open source job</button>
            ${can("createJob") ? `<button class="utility-button" type="button" data-create-equipment-maintenance="${escapeHtml(record.id)}" data-source-job-id="${escapeHtml(record.jobId)}">Create maintenance job</button>` : ""}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function notificationActionConfig(type, job, overrides = {}) {
  const tech = normalizeTechnician(job.technician);
  const company = companySettings();
  const estimate = normalizeEstimateRecord(job.estimate || {}, job);
  const reviewSuffix = company.reviewLink ? ` ${company.reviewLink}` : "";
  const configs = {
    customer_confirmation: {
      title: "Booking confirmation",
      channel: "SMS",
      audience: "customer",
      recipient: job.phone,
      body: `Hi ${job.name}, your ${job.trade} visit is booked for ${scheduleText(job)}. Reply here if anything changes.`
    },
    tech_assignment: {
      title: "Technician assignment",
      channel: "App",
      audience: "team",
      recipient: tech,
      body: `${job.name} is assigned to ${technicianDisplayName(tech)} for ${scheduleText(job)}. Job type: ${jobTypeLabel(job)}.`
    },
    approval_link: {
      title: "Approval link",
      channel: "SMS",
      audience: "customer",
      recipient: job.phone,
      body: `Hi ${job.name}, please review and approve your ${formatMoney(estimate.amount)} ${estimate.packageName.toLowerCase()} estimate: ${overrides.url || approvalUrl(job)}`
    },
    estimate_followup: {
      title: "Estimate follow-up",
      channel: "SMS",
      audience: "customer",
      recipient: job.phone,
      body: `Hi ${job.name}, checking in on the ${formatMoney(estimate.amount)} estimate for your ${job.trade} job. This estimate is valid through ${estimate.expiresAt ? new Date(`${estimate.expiresAt}T12:00:00`).toLocaleDateString() : "the date shown"}. Want us to get this on the schedule?`
    },
    invoice_reminder: {
      title: "Payment reminder",
      channel: "SMS",
      audience: "customer",
      recipient: job.phone,
      body: `Hi ${job.name}, your ${formatMoney(invoiceBalance(job) || invoiceRecord(job).amount || job.value)} invoice balance is ready. You can pay from the secure payment link we sent.`
    },
    review_request: {
      title: "Review request",
      channel: "SMS",
      audience: "customer",
      recipient: job.phone,
      body: `Thanks again, ${job.name}. If everything went well, would you leave us a quick review? It helps a small shop a lot.${reviewSuffix}`
    }
  };
  return { ...(configs[type] || configs.customer_confirmation), ...overrides };
}

function notificationPermission(type) {
  const permissions = {
    customer_confirmation: "book",
    tech_assignment: "book",
    approval_link: "approval",
    estimate_followup: "estimate",
    invoice_reminder: "invoice",
    review_request: "paid"
  };
  return permissions[type] || "book";
}

function canManageNotification(type) {
  return can(notificationPermission(type));
}

function notificationQuickActions(job) {
  const actions = [
    ["customer_confirmation", "Confirmation"],
    ["tech_assignment", "Notify tech"],
    ["estimate_followup", "Estimate follow-up"],
    ["invoice_reminder", "Payment reminder"],
    ["review_request", "Review request"]
  ];
  return actions
    .filter(([type]) => canManageNotification(type))
    .map(([type, label]) => `<button class="action-button" type="button" data-notification-action="${type}" data-job-id="${escapeHtml(job.id)}">${label}</button>`)
    .join("");
}

function queueJobNotification(job, type, overrides = {}) {
  ensureJobDefaults(job);
  const config = notificationActionConfig(type, job, overrides);
  const notification = {
    id: createId(),
    type,
    title: config.title,
    channel: config.channel,
    audience: config.audience,
    recipient: config.recipient || "Not set",
    body: config.body,
    status: overrides.status || "sent",
    requiresReview: Boolean(overrides.requiresReview),
    completedBy: {},
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName()
  };
  job.notifications.push(notification);
  const status = displayNotificationStatus(notification);
  addJobMessage(job, {
    direction: config.audience === "customer" && status === "sent" ? "out" : "note",
    body: config.audience === "customer" && status === "sent"
      ? config.body
      : `${config.title} ${notificationStatusLabel(notification)} for ${notification.recipient}: ${config.body}`,
    createdBy: config.audience === "customer" ? "Backline" : accountDisplayName()
  });
  return notification;
}

function displayNotificationStatus(notificationOrStatus) {
  if (!notificationOrStatus || typeof notificationOrStatus === "string") return notificationOrStatus || "sent";
  if (notificationOrStatus.status === "queued" && !notificationOrStatus.requiresReview) return "sent";
  return notificationOrStatus.status || "sent";
}

function notificationStatusLabel(status) {
  const normalizedStatus = displayNotificationStatus(status);
  const labels = {
    queued: "queued",
    sent: "sent",
    failed: "failed",
    urgent: "unread"
  };
  return labels[normalizedStatus] || normalizedStatus;
}

function isNotificationCompletedForCurrentUser(notification) {
  return Boolean(notification.completedBy?.[assignmentSeenKey()]);
}

function allNotifications() {
  return roleScopedJobs()
    .flatMap((job) => ensureJobDefaults(job).notifications.map((notification) => ({ job, notification })))
    .filter(({ notification }) => isActionableNotification(notification))
    .filter(({ notification }) => !isNotificationCompletedForCurrentUser(notification))
    .sort((a, b) => new Date(b.notification.createdAt) - new Date(a.notification.createdAt));
}

function isActionableNotification(notification) {
  const status = displayNotificationStatus(notification);
  return status === "failed" || (status === "queued" && notification.requiresReview);
}

function unreadReplyCommunicationItems(jobs = roleScopedJobs()) {
  return jobs.flatMap((job) => unreadInboundMessages(job).map((message) => {
    const normalized = normalizeJobMessage(message);
    return {
      job,
      message: normalized,
      notification: {
        id: normalized.id,
        type: "customer_reply",
        title: "Customer reply",
        channel: "SMS",
        audience: "customer",
        recipient: job.phone,
        body: normalized.body,
        status: "urgent",
        createdAt: normalized.createdAt,
        createdBy: normalized.createdBy || job.name,
        completedBy: {}
      }
    };
  }));
}

function allCommunicationItems() {
  return [...unreadReplyCommunicationItems(), ...allNotifications()]
    .sort((a, b) => new Date(b.notification.createdAt) - new Date(a.notification.createdAt));
}

function jobCommunicationItems(job) {
  ensureJobDefaults(job);
  return [
    ...unreadReplyCommunicationItems([job]),
    ...job.notifications
      .filter(isActionableNotification)
      .filter((notification) => !isNotificationCompletedForCurrentUser(notification))
      .map((notification) => ({ job, notification }))
  ].sort((a, b) => new Date(b.notification.createdAt) - new Date(a.notification.createdAt));
}

function renderCommunicationRows(items, options = {}) {
  if (!items.length) {
    return `<div class="empty-state compact-empty"><strong>No communication work waiting</strong><span>${options.empty || "Sent messages are logged in each job thread. Replies and failed sends will show here."}</span></div>`;
  }

  return items.map(({ job, notification }) => {
    const isReply = notification.type === "customer_reply";
    const status = displayNotificationStatus(notification);
    const canManage = canManageNotification(notification.type);
    const actionButtons = [
      options.allowComplete && isReply ? `<button class="utility-button" type="button" data-message-complete="${escapeHtml(job.id)}">Complete</button>` : "",
      options.allowComplete && !isReply ? `<button class="utility-button" type="button" data-notification-complete="${escapeHtml(notification.id)}" data-job-id="${escapeHtml(job.id)}">Complete</button>` : "",
      !isReply && canManage && status === "queued" ? `<button class="utility-button" type="button" data-notification-status="${escapeHtml(notification.id)}" data-job-id="${escapeHtml(job.id)}" data-status="sent">Mark sent</button>` : "",
      !isReply && canManage && status === "queued" ? `<button class="utility-button" type="button" data-notification-status="${escapeHtml(notification.id)}" data-job-id="${escapeHtml(job.id)}" data-status="failed">Fail</button>` : "",
      !isReply && canManage && status === "failed" ? `<button class="utility-button" type="button" data-notification-status="${escapeHtml(notification.id)}" data-job-id="${escapeHtml(job.id)}" data-status="sent">Retry sent</button>` : ""
    ].filter(Boolean).join("");
    return `
      <div class="communication-row">
        <button class="communication-main" type="button" data-job-id="${escapeHtml(job.id)}">
          <span class="pill ${escapeHtml(status)}">${escapeHtml(notificationStatusLabel(notification))}</span>
          <strong>${escapeHtml(notification.title)}</strong>
          <small>${escapeHtml(job.name)} - ${escapeHtml(notification.channel)} to ${escapeHtml(notification.recipient)} - ${escapeHtml(new Date(notification.createdAt).toLocaleString())}</small>
          <p>${escapeHtml(notification.body)}</p>
        </button>
        ${actionButtons ? `<div class="communication-actions">${actionButtons}</div>` : ""}
      </div>
    `;
  }).join("");
}

function renderJobCommunications(job) {
  ensureJobDefaults(job);
  const items = jobCommunicationItems(job);
  const quickActions = notificationQuickActions(job);
  const summary = jobCommunicationSummary(job);
  const unreadCount = unreadInboundMessages(job).length;
  return renderCollapsibleFieldPanel({
    title: "Communications",
    subtitle: "Customer contact, unread replies, and send exceptions.",
    open: unreadCount > 0,
    badge: `<span class="pill ${unreadCount ? "urgent" : "estimated"}">${escapeHtml(unreadCount ? `${unreadCount} unread` : `${items.length} item${items.length === 1 ? "" : "s"}`)}</span>`,
    content: `
      <div class="communication-status-grid">
        ${summary.map((item) => `
          <div class="communication-status-card ${escapeHtml(item.tone)}">
            <span>${escapeHtml(item.label)}</span>
            <strong>${escapeHtml(item.value)}</strong>
            <small>${escapeHtml(item.detail)}</small>
          </div>
        `).join("")}
      </div>
      ${quickActions ? `
        <div class="communication-quick-actions">
          ${quickActions}
        </div>
      ` : ""}
      ${renderCommunicationRows(items, { allowComplete: true, empty: "No replies or failed sends need attention. Sent messages are in the thread below." })}
    `
  });
}

function communicationTimestamp(value) {
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function latestItem(items, dateSelector) {
  return [...items].sort((a, b) => communicationTimestamp(dateSelector(b)) - communicationTimestamp(dateSelector(a)))[0] || null;
}

function latestNotification(job, types) {
  ensureJobDefaults(job);
  return latestItem(job.notifications.filter((notification) => types.includes(notification.type)), (notification) => notification.createdAt);
}

function latestCustomerMessage(job, direction) {
  ensureJobDefaults(job);
  return latestItem(job.messages.filter((message) => normalizeJobMessage(message).direction === direction), (message) => normalizeJobMessage(message).createdAt);
}

function formatCommunicationTime(value) {
  const date = new Date(value || 0);
  if (Number.isNaN(date.getTime())) return "No timestamp";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function notificationStatusText(notification) {
  if (!notification) return "Not sent";
  return `${notificationStatusLabel(notification)} ${formatCommunicationTime(notification.createdAt)}`;
}

function jobCommunicationSummary(job) {
  ensureJobDefaults(job);
  const lastOutbound = latestCustomerMessage(job, "out");
  const lastReply = latestCustomerMessage(job, "in");
  const unreadCount = unreadInboundMessages(job).length;
  const confirmation = latestNotification(job, ["customer_confirmation"]);
  const estimateOrApproval = latestNotification(job, ["approval_link", "estimate_followup"]);
  const payment = latestNotification(job, ["invoice_reminder"]);
  const nextMoneyTouch = payment || estimateOrApproval;

  return [
    {
      label: "Last contact",
      value: lastOutbound ? formatCommunicationTime(normalizeJobMessage(lastOutbound).createdAt) : "Not contacted",
      detail: lastOutbound ? normalizeJobMessage(lastOutbound).body : "Send a confirmation or follow-up from here.",
      tone: lastOutbound ? "sent" : "quiet"
    },
    {
      label: "Customer reply",
      value: unreadCount ? `${unreadCount} unread` : lastReply ? "Replied" : "No reply yet",
      detail: lastReply ? normalizeJobMessage(lastReply).body : "Inbound customer replies will show here.",
      tone: unreadCount ? "urgent" : lastReply ? "sent" : "quiet"
    },
    {
      label: "Confirmation",
      value: confirmation ? notificationStatusLabel(confirmation) : "Not sent",
      detail: notificationStatusText(confirmation),
      tone: confirmation ? displayNotificationStatus(confirmation) : "quiet"
    },
    {
      label: payment ? "Payment reminder" : "Estimate / approval",
      value: nextMoneyTouch ? notificationStatusLabel(nextMoneyTouch) : job.approvalStatus.replaceAll("_", " "),
      detail: nextMoneyTouch ? notificationStatusText(nextMoneyTouch) : "No estimate, approval, or payment follow-up sent.",
      tone: nextMoneyTouch ? displayNotificationStatus(nextMoneyTouch) : (job.approvalStatus === "approved" ? "sent" : "quiet")
    }
  ];
}

function scopeChangeTotal(job) {
  ensureJobDefaults(job);
  return job.scopeChanges.reduce((sum, change) => sum + normalizeValue(change.amount), 0);
}

function renderScopeChanges(job) {
  ensureJobDefaults(job);
  if (!job.scopeChanges.length) return "";

  return `
    <section class="approval-card">
      <h2>Approved Changes</h2>
      <div class="approval-line-items">
        ${job.scopeChanges.map((change) => `
          <div>
            <span>${escapeHtml(change.description)}</span>
            <strong>${escapeHtml(formatMoney(change.amount))}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function customerPortalFiles(job = {}) {
  ensureJobDefaults(job);
  return (job.files || [])
    .map((file, index) => ({ file, index, category: fileCategory(file) }))
    .filter(({ file }) => file.customerVisible === true);
}

function renderCustomerPortalFiles(job = {}, settings = null) {
  const company = customerFacingCompanySettings(settings);
  const files = customerPortalFiles(job);
  if (!files.length) {
    return '<div class="portal-empty">No customer-facing files are attached yet.</div>';
  }
  return `
    <div class="portal-file-note">
      <strong>Downloads are optional.</strong>
      <span>${escapeHtml(company.companyName || "The shop")} keeps these documents in the job record, so you can ask for another copy later.</span>
    </div>
    <div class="portal-file-list">
      ${files.map(({ file, index, category }) => `
        <article class="portal-file-row">
          <div>
            <span>${escapeHtml(fileCategoryLabel(category))}</span>
            <strong>${escapeHtml(file.name || "Job file")}</strong>
            <small>${escapeHtml(file.note || fileKindLabel(file))}</small>
          </div>
          ${jobFileUrl(file) ? `
            <div class="portal-file-actions">
              <button class="utility-button" type="button" data-portal-view-file="${escapeHtml(index)}">Open</button>
              <button class="utility-button" type="button" data-portal-download-file="${escapeHtml(index)}">Download copy</button>
            </div>
          ` : '<span class="pill estimated">Saved in Backline</span>'}
        </article>
      `).join("")}
    </div>
  `;
}

function customerPortalStatusCards(job = {}) {
  ensureJobDefaults(job);
  const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
  const invoice = invoiceRecord(job);
  const balance = invoiceBalance(job);
  return [
    {
      label: "Appointment",
      value: scheduleText(job, { includeYear: true }),
      detail: `${durationLabel(jobDurationMinutes(job))} window`
    },
    {
      label: "Status",
      value: statusLabel(job.status),
      detail: jobReadinessMeta(job).label
    },
    {
      label: "Estimate",
      value: estimate.amount ? formatMoney(estimate.amount) : "Not sent",
      detail: estimate.amount ? estimateRevisionStatus(estimate.status || job.approvalStatus).replaceAll("_", " ") : "No active estimate"
    },
    {
      label: "Invoice",
      value: invoice.amount ? formatMoney(invoice.amount) : "Not invoiced",
      detail: invoice.amount ? `${formatMoney(invoiceCollectedAmount(invoice))} collected / ${formatMoney(balance)} due` : "Invoice will appear here when ready"
    }
  ];
}

function customerPortalBillingStatus(job = {}) {
  ensureJobDefaults(job);
  const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
  const estimateStatus = estimateRevisionStatus(estimate.status || job.approvalStatus);
  const invoice = invoiceRecord(job);
  const collected = invoiceCollectedAmount(invoice);
  const balance = invoiceBalance(job);
  if (invoice.amount > 0) {
    if (balance <= 0 && collected > 0) {
      return {
        tone: "paid",
        title: "Paid in full",
        detail: `${formatMoney(collected)} collected on ${formatMoney(invoice.amount)} billed work.`
      };
    }
    if (collected > 0) {
      return {
        tone: "partial",
        title: "Partially paid",
        detail: `${formatMoney(collected)} collected. ${formatMoney(balance)} remains due.`
      };
    }
    return {
      tone: "due",
      title: "Invoice ready",
      detail: `${formatMoney(invoice.amount)} is billed. ${formatMoney(balance)} remains due.`
    };
  }
  if (estimate.amount > 0) {
    return {
      tone: estimateStatus === "approved" ? "approved" : estimateStatus === "declined" ? "declined" : "sent",
      title: estimateStatus === "approved" ? "Estimate approved" : estimateStatus === "declined" ? "Estimate declined" : "Estimate waiting for approval",
      detail: `${formatMoney(estimate.amount)} ${estimate.packageName || "estimate"}${estimate.depositRequested ? ` with ${formatMoney(estimate.depositRequested)} deposit requested` : ""}.`
    };
  }
  return {
    tone: "quiet",
    title: "No balance yet",
    detail: "Estimate and invoice details will appear here when the shop sends them."
  };
}

function renderCustomerPortalBillingStatus(job = {}) {
  const status = customerPortalBillingStatus(job);
  return `
    <div class="portal-billing-status ${escapeHtml(status.tone)}">
      <span>Account status</span>
      <strong>${escapeHtml(status.title)}</strong>
      <p>${escapeHtml(status.detail)}</p>
    </div>
  `;
}

function customerPortalNextStep(job = {}, settings = null) {
  const company = customerFacingCompanySettings(settings);
  ensureJobDefaults(job);
  const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
  const estimateStatus = estimateRevisionStatus(estimate.status || job.approvalStatus);
  const invoice = invoiceRecord(job);
  const balance = invoiceBalance(job);
  if (estimate.amount > 0 && estimateStatus === "sent") {
    return {
      title: "Review the estimate",
      detail: "Approve it if everything looks right, or reply with what needs to change.",
      action: "Review estimate"
    };
  }
  if (invoice.amount > 0 && balance > 0) {
    return {
      title: "Review the balance",
      detail: `${formatMoney(balance)} is still open. Send payment details or message the office with questions.`,
      action: "Payment details"
    };
  }
  if (isScheduled(job) && !["completed", "closed"].includes(job.status)) {
    return {
      title: "You're on the schedule",
      detail: `${company.companyName || "The shop"} has your appointment set for ${scheduleText(job, { includeYear: true })}.`,
      action: "Scheduled"
    };
  }
  if (job.status === "closed") {
    return {
      title: "Job record complete",
      detail: "Receipts, approvals, and visible documents will stay available from this portal.",
      action: "Complete"
    };
  }
  return {
    title: "The office has your request",
    detail: "Updates, messages, estimates, and documents will appear here as the job moves forward.",
    action: "Watching"
  };
}

function renderCustomerPortalNextStep(job = {}, settings = null) {
  const next = customerPortalNextStep(job, settings);
  return `
    <section class="approval-card portal-card portal-next-step">
      <div>
        <span>Next step</span>
        <strong>${escapeHtml(next.title)}</strong>
        <p>${escapeHtml(next.detail)}</p>
      </div>
      <span class="pill estimated">${escapeHtml(next.action)}</span>
    </section>
  `;
}

function renderCustomerPortalPaymentRequest(job = {}) {
  ensureJobDefaults(job);
  const invoice = invoiceRecord(job);
  const request = activePaymentRequest(job);
  const balance = invoiceBalance(job);
  if (!request && (!invoice.amount || balance <= 0)) return "";
  const requestedAmount = request?.amount || balance;
  const dueDate = request?.dueDate || addDaysISO(7);
  return `
    <section class="approval-card portal-card portal-payment-card">
      <div class="portal-section-header">
        <div>
          <h2>Payment request</h2>
          <p>${escapeHtml(request?.note || "Review the current balance and send payment details to the office.")}</p>
        </div>
        <span class="pill ${request ? "invoiced" : "estimated"}">${request ? "Requested" : "Balance due"}</span>
      </div>
      <div class="portal-payment-grid">
        <div><span>Total billed</span><strong>${escapeHtml(formatMoney(invoice.amount))}</strong></div>
        <div><span>Collected</span><strong>${escapeHtml(formatMoney(invoiceCollectedAmount(invoice)))}</strong></div>
        <div><span>Balance</span><strong>${escapeHtml(formatMoney(balance))}</strong></div>
        <div><span>Requested</span><strong>${escapeHtml(formatMoney(requestedAmount))}</strong><small>${escapeHtml(`Due ${formatDateLabel(dueDate, { includeYear: true })}`)}</small></div>
      </div>
      <form class="portal-payment-form" id="customerPortalPaymentForm" data-portal-job-id="${escapeHtml(job.id)}" data-portal-token="${escapeHtml(ensureJobPortalToken(job))}">
        <label>
          Amount paid or planned
          <input name="amount" type="number" step="0.01" min="0" value="${escapeHtml(requestedAmount)}" required>
        </label>
        <label>
          Payment method
          ${backlineDropdown({
            id: `portal-payment-method-${job.id}`,
            name: "method",
            value: "card",
            options: paymentMethodOptionItems("card"),
            direction: "up"
          })}
        </label>
        <label>
          Confirmation or reference
          <input name="reference" placeholder="Check number, transaction note, or paid date">
        </label>
        <label class="wide">
          Message for the office
          <textarea name="note" rows="3" placeholder="Tell the office anything they should know before recording this payment."></textarea>
        </label>
        <button class="primary-button" type="submit">Send payment details</button>
      </form>
    </section>
  `;
}

function customerPortalTimelineTime(value) {
  const date = customerTimelineDate(value);
  if (!date.getTime()) return "Recently";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function customerPortalPaymentTimelineLabel(payment = {}) {
  const record = normalizePaymentRecord(payment);
  const labels = {
    deposit: "deposit received",
    payment: "payment received",
    refund: "refund issued",
    credit: "credit applied"
  };
  return `${formatMoney(record.amount)} ${labels[record.kind] || "payment received"}`;
}

function customerPortalPaymentTimelineDetail(payment = {}, invoice = {}) {
  const record = normalizePaymentRecord(payment);
  const method = paymentMethodLabel(record.method || invoice.paymentMethod);
  const note = record.note && !/^legacy payment recorded|legacy deposit collected$/i.test(record.note)
    ? ` - ${record.note}`
    : "";
  return `${method}${note}`;
}

function invoicePaidInFullTimelinePayment(invoice = {}) {
  const record = normalizeInvoiceRecord(invoice);
  if (record.amount <= 0) return null;
  let collected = 0;
  return paymentRecords(record)
    .sort((a, b) => {
      const diff = customerTimelineDate(a.paidAt || a.createdAt) - customerTimelineDate(b.paidAt || b.createdAt);
      return diff || a.legacyOrder - b.legacyOrder;
    })
    .find((payment) => {
      collected += payment.kind === "refund" ? -payment.amount : payment.amount;
      return collected >= record.amount;
    }) || null;
}

function customerPortalTimelineEvents(job = {}) {
  ensureJobDefaults(job);
  const events = [];
  const addEvent = (event) => {
    if (!event.createdAt) return;
    events.push({
      id: `${event.type}-${event.createdAt}-${events.length}`,
      tone: event.tone || event.type,
      ...event
    });
  };

  if (isScheduled(job)) {
    addEvent({
      type: "schedule",
      tone: "booked",
      title: "Job scheduled",
      detail: scheduleText(job, { includeYear: true }),
      createdAt: `${job.scheduleDate}T${job.startTime || "09:00"}:00`
    });
  }

  normalizeEstimateHistory(job.estimateHistory || [], job).forEach((estimate) => {
    if (estimate.sentAt) {
      addEvent({
        type: "estimate",
        tone: "estimated",
        title: `Estimate #${estimate.revisionNumber} sent`,
        detail: `${formatMoney(estimate.amount)} ${estimate.packageName || "custom"} estimate`,
        createdAt: estimate.sentAt
      });
    }
    if (estimate.approvedAt) {
      addEvent({
        type: "approval",
        tone: "paid",
        title: `Estimate #${estimate.revisionNumber} approved`,
        detail: `${formatMoney(estimate.amount)} approved by customer`,
        createdAt: estimate.approvedAt
      });
    }
    if (estimate.declinedAt) {
      addEvent({
        type: "declined",
        tone: "invoiced",
        title: `Estimate #${estimate.revisionNumber} declined`,
        detail: estimate.declineReason || "Customer requested changes",
        createdAt: estimate.declinedAt
      });
    }
  });

  const invoice = invoiceRecord(job);
  if (invoice.amount > 0) {
    addEvent({
      type: "invoice",
      tone: "invoiced",
      title: "Invoice created",
      detail: `${invoice.number} for ${formatMoney(invoice.amount)}`,
      createdAt: invoice.updatedAt || job.createdAt
    });
  }

  paymentRequests(job).forEach((request) => {
    if (!["requested", "responded"].includes(request.status)) return;
    addEvent({
      type: "payment-request",
      tone: "invoiced",
      title: request.status === "responded" ? "Payment response sent" : "Payment requested",
      detail: `${formatMoney(request.amount)} due ${formatDateLabel(request.dueDate, { includeYear: true })}`,
      createdAt: request.responseAt || request.createdAt
    });
  });

  paymentRecords(invoice).forEach((payment) => {
    addEvent({
      type: "payment",
      tone: "paid",
      title: customerPortalPaymentTimelineLabel(payment),
      detail: customerPortalPaymentTimelineDetail(payment, invoice),
      createdAt: payment.paidAt || payment.createdAt
    });
  });

  const paidInFullPayment = invoicePaidInFullTimelinePayment(invoice);
  if (paidInFullPayment) {
    addEvent({
      type: "paid-in-full",
      tone: "paid",
      title: "Invoice paid in full",
      detail: `${formatMoney(invoice.amount)} total has been received.`,
      createdAt: paidInFullPayment.paidAt || paidInFullPayment.createdAt
    });
  }

  if (job.completedAt) {
    addEvent({
      type: "complete",
      tone: "paid",
      title: "Job completed",
      detail: "Field work was marked complete.",
      createdAt: job.completedAt
    });
  }

  if (job.closedAt) {
    addEvent({
      type: "closed",
      tone: "paid",
      title: "Job closed",
      detail: "The shop closed this job record.",
      createdAt: job.closedAt
    });
  }

  return events
    .sort((a, b) => customerTimelineDate(a.createdAt) - customerTimelineDate(b.createdAt))
    .slice(-10);
}

function renderCustomerPortalTimeline(job = {}) {
  const events = customerPortalTimelineEvents(job);
  return `
    <section class="approval-card portal-card">
      <div class="portal-section-header">
        <div>
          <h2>Job timeline</h2>
          <p>Key updates from the shop for this job.</p>
        </div>
      </div>
      <div class="portal-timeline">
        ${events.length ? events.map((event) => `
          <article class="portal-timeline-event ${escapeHtml(event.tone)}">
            <span></span>
            <div>
              <strong>${escapeHtml(event.title)}</strong>
              <p>${escapeHtml(event.detail)}</p>
              <small>${escapeHtml(customerPortalTimelineTime(event.createdAt))}</small>
            </div>
          </article>
        `).join("") : '<div class="portal-empty">Timeline updates will appear here after the shop schedules, estimates, invoices, or records payment.</div>'}
      </div>
    </section>
  `;
}

function renderCustomerPortalPage(jobOrId, options = {}) {
  const job = typeof jobOrId === "object"
    ? jobOrId
    : state.jobs.find((item) => item.portalToken === jobOrId || (!isPortalToken(jobOrId) && item.id === jobOrId));
  document.body.classList.add("approval-mode");
  document.body.classList.remove("auth-mode");
  elements.authGate.hidden = true;
  elements.approvalPage.hidden = false;

  if (!job) {
    elements.approvalPage.innerHTML = `
      <section class="approval-shell portal-shell">
        <div class="approval-card">
          <img class="approval-logo approval-logo-full compact" src="assets/backline-full-logo-transparent.png" alt="Backline">
          <p class="eyebrow">Backline portal</p>
          <h1>Job portal not found</h1>
          <p>This customer link may be old or the job may have been deleted.</p>
        </div>
      </section>
    `;
    return;
  }

  ensureJobDefaults(job);
  state.portalJob = job;
  state.selectedJobId = job.id || state.selectedJobId;
  const company = customerFacingCompanySettings(options.companySettings || state.portalCompanySettings);
  state.portalCompanySettings = company;
  const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
  const invoice = invoiceRecord(job);
  const balance = invoiceBalance(job);
  const officeContact = customerFacingContactLine(company);
  const canReviewEstimate = estimate.amount > 0 && estimateRevisionStatus(estimate.status || job.approvalStatus) === "sent";
  const secureApprovalUrl = canReviewEstimate ? secureApprovalUrlForJob(job) : "";
  const recentMessages = customerPortalMessages(job);

  elements.approvalPage.innerHTML = `
    <section class="approval-shell portal-shell">
      <div class="approval-hero portal-hero">
        ${customerFacingBrandMarkup("Customer job portal", company)}
        <p class="eyebrow">Secure job portal</p>
        <h1>${escapeHtml(job.trade)} service for ${escapeHtml(job.name)}</h1>
        <p>${escapeHtml(job.address)}</p>
        <span class="pill ${escapeHtml(job.status)}">${escapeHtml(statusLabel(job.status))}</span>
      </div>

      ${options.notice ? `<div class="approval-banner ${escapeHtml(options.noticeType || "info")}">${escapeHtml(options.notice)}</div>` : ""}

      ${renderCustomerPortalBillingStatus(job)}

      ${renderCustomerPortalNextStep(job, company)}

      ${renderCustomerPortalPaymentRequest(job)}

      ${renderCustomerPortalTimeline(job)}

      <section class="approval-card portal-card">
        <div class="portal-section-header">
          <div>
            <h2>Job summary</h2>
            <p>${escapeHtml(job.issue)}</p>
          </div>
          <a class="secondary-button" href="${escapeHtml(customerPortalUrl(job))}">Reusable link</a>
        </div>
        <div class="approval-meta-grid">
          ${customerPortalStatusCards(job).map((card) => `
            <div>
              <span>${escapeHtml(card.label)}</span>
              <strong>${escapeHtml(card.value)}</strong>
              <small>${escapeHtml(card.detail)}</small>
            </div>
          `).join("")}
        </div>
      </section>

      <section class="approval-card portal-card">
        <h2>Visit details</h2>
        <div class="approval-meta-grid">
          <div><span>Technician</span><strong>${escapeHtml(customerFacingTechnicianName(job.technician))}</strong></div>
          <div><span>Site contact</span><strong>${escapeHtml(job.siteContact || job.name)}</strong></div>
          <div><span>Office</span><strong>${escapeHtml(company.companyName)}</strong><small>${escapeHtml(officeContact)}</small></div>
          <div><span>Job type</span><strong>${escapeHtml(jobTypeLabel(job))}</strong></div>
        </div>
      </section>

      <section class="approval-card portal-card">
        <div class="portal-section-header">
          <div>
            <h2>Estimate and invoice</h2>
            <p>Review approvals, payments, and job documents here.</p>
          </div>
          ${secureApprovalUrl ? `<a class="primary-button" href="${escapeHtml(secureApprovalUrl)}">Review estimate</a>` : ""}
        </div>
        <div class="approval-line-items">
          <div><span>Estimate</span><strong>${escapeHtml(estimate.amount ? formatMoney(estimate.amount) : "Not sent")}</strong></div>
          <div><span>Approval</span><strong>${escapeHtml(job.approvalStatus.replaceAll("_", " "))}</strong></div>
          <div><span>Invoice total</span><strong>${escapeHtml(invoice.amount ? formatMoney(invoice.amount) : "Not invoiced")}</strong></div>
          <div><span>Balance</span><strong>${escapeHtml(invoice.amount ? formatMoney(balance) : "Not available")}</strong></div>
        </div>
        ${invoice.amount && balance <= 0 ? `<div class="approval-banner success">Payment is recorded as paid in full.</div>` : ""}
      </section>

      <section class="approval-card portal-card">
        <div class="portal-section-header">
          <div>
            <h2>Files and receipts</h2>
          <p>Open documents in the browser or download a copy only if you want one saved on this device.</p>
          </div>
        </div>
        ${renderCustomerPortalFiles(job, company)}
      </section>

      <section class="approval-card portal-card">
        <h2>Messages</h2>
        <div class="portal-message-list">
          ${recentMessages.length ? recentMessages.map((message) => `
            <article class="portal-message ${escapeHtml(message.direction)}">
              <strong>${escapeHtml(customerFacingMessageAuthor(message, company))}</strong>
              <p>${escapeHtml(message.body)}</p>
              <small>${escapeHtml(customerPortalTimelineTime(message.createdAt))}</small>
            </article>
          `).join("") : '<div class="portal-empty">No messages are visible yet.</div>'}
        </div>
        <form class="portal-reply-form" id="customerPortalReplyForm" data-portal-job-id="${escapeHtml(job.id)}" data-portal-token="${escapeHtml(ensureJobPortalToken(job))}">
          <label>
            Send a reply to ${escapeHtml(company.companyName)}
            <textarea name="reply" rows="4" placeholder="Type your message for the office..." required></textarea>
          </label>
          <button class="primary-button" type="submit">Send reply</button>
        </form>
      </section>

      ${job.status === "closed" && company.reviewLink ? `
        <section class="approval-card portal-card">
          <h2>How did we do?</h2>
          <p>Your feedback helps the shop improve and helps future customers know what to expect.</p>
          <a class="primary-button" href="${escapeHtml(company.reviewLink)}" target="_blank" rel="noopener">Leave a review</a>
        </section>
      ` : ""}

      <section class="approval-card portal-card">
        <h2>Support and policies</h2>
        ${customerFacingSupportMarkup(company)}
      </section>
    </section>
  `;
}

function renderApprovalPage(jobOrId, options = {}) {
  const job = typeof jobOrId === "object" ? jobOrId : state.jobs.find((item) => item.id === jobOrId);
  if (!job) {
    document.body.classList.add("approval-mode");
    document.body.classList.remove("auth-mode");
    elements.authGate.hidden = true;
    elements.approvalPage.hidden = false;
    elements.approvalPage.innerHTML = `
      <section class="approval-shell">
        <div class="approval-card">
          <img class="approval-logo approval-logo-full compact" src="assets/backline-full-logo-transparent.png" alt="Backline">
          <p class="eyebrow">Backline approval</p>
          <h1>Approval not found</h1>
          <p>This link may be old or the job may have been deleted.</p>
          <button class="primary-button" type="button" data-return-app>Return to Backline</button>
        </div>
      </section>
    `;
    return;
  }

  ensureJobDefaults(job);
  document.body.classList.add("approval-mode");
  document.body.classList.remove("auth-mode");
  elements.authGate.hidden = true;
  elements.approvalPage.hidden = false;

  const company = customerFacingCompanySettings(options.companySettings || state.portalCompanySettings);
  state.portalCompanySettings = company;
  const estimate = normalizeEstimateRecord(job.estimate || {}, job);
  const depositAmount = estimate.depositRequested || estimateDepositAmount(job.value, estimate.depositPercent);
  const submittedDecision = estimateRevisionStatus(options.decision || "");
  const decisionSent = ["approved", "declined"].includes(submittedDecision) || ["approved", "declined"].includes(job.approvalStatus) || options.linkStatus === "used";
  const decisionLabel = submittedDecision === "declined" || job.approvalStatus === "declined" ? "declined" : submittedDecision === "approved" || job.approvalStatus === "approved" ? "approved" : "sent";
  const approvalPdfFile = options.approvalPdfFile || latestApprovalPdfFile(job);
  state.approvalDownloadFile = approvalPdfFile || null;
  const decisionTitle = decisionLabel === "approved"
    ? "Thank you. Your approval has been sent."
    : decisionLabel === "declined"
      ? "Your requested changes have been sent."
      : `Your decision has been sent to ${company.companyName || "the office"}.`;
  const decisionBody = decisionLabel === "approved"
    ? "The office has received your approval and saved the signed approval record with this job."
    : decisionLabel === "declined"
      ? "The office has received your response and will review the reason you provided before following up."
      : "The office has received your response. You can close this page.";
  const officeContact = customerFacingContactLine(company);
  const approvalCopy = {
    not_sent: "Not sent",
    sent: "Waiting for approval",
    approved: "Approved",
    declined: "Declined"
  };

  elements.approvalPage.innerHTML = `
    <section class="approval-shell">
      <div class="approval-hero">
        ${customerFacingBrandMarkup("Customer approval", company)}
        <p class="eyebrow">Secure approval</p>
        <h1>${escapeHtml(job.trade)} service for ${escapeHtml(job.name)}</h1>
        <p>${escapeHtml(job.address)}</p>
        <span class="pill ${job.approvalStatus === "approved" ? "paid" : job.approvalStatus === "declined" ? "invoiced" : "estimated"}">${escapeHtml(approvalCopy[job.approvalStatus] || job.approvalStatus)}</span>
      </div>

      <section class="approval-card">
        <h2>Estimate Summary</h2>
        <p>${escapeHtml(estimate.introText)}</p>
        <div class="approval-line-items">
          <div>
            <span>Package</span>
            <strong>${escapeHtml(estimate.packageName)}</strong>
          </div>
          <div>
            <span>${escapeHtml(job.issue)}</span>
            <strong>${escapeHtml(formatMoney(estimate.amount - scopeChangeTotal(job)))}</strong>
          </div>
          ${job.scopeChanges.map((change) => `
            <div>
              <span>${escapeHtml(change.description)}</span>
              <strong>${escapeHtml(formatMoney(change.amount))}</strong>
            </div>
          `).join("")}
        </div>
        <div class="approval-total">
          <span>Total</span>
          <strong>${escapeHtml(formatMoney(estimate.amount))}</strong>
        </div>
        <div class="approval-line-items estimate-terms-list">
          <div>
            <span>Expires</span>
            <strong>${escapeHtml(estimate.expiresAt ? new Date(`${estimate.expiresAt}T12:00:00`).toLocaleDateString() : "Not set")}</strong>
          </div>
          <div>
            <span>Deposit requested</span>
            <strong>${escapeHtml(formatMoney(depositAmount))}</strong>
          </div>
        </div>
      </section>

      <section class="approval-card">
        <h2>Visit Details</h2>
        <div class="approval-meta-grid">
          <div><span>Scheduled</span><strong>${escapeHtml(scheduleText(job))}</strong></div>
          <div><span>Technician</span><strong>${escapeHtml(customerFacingTechnicianName(job.technician))}</strong></div>
          <div><span>Site contact</span><strong class="truncate-value" title="${escapeHtml(job.siteContact || job.name)}">${escapeHtml(job.siteContact || job.name)}</strong></div>
          <div><span>Job type</span><strong>${escapeHtml(jobTypeLabel(job))}</strong></div>
        </div>
      </section>

      ${renderScopeChanges(job)}

      <section class="approval-card">
        <h2>Terms</h2>
        <p>${escapeHtml(estimate.warrantyText)}</p>
        <p>${escapeHtml(estimate.disclaimer)}</p>
        <p>${escapeHtml(estimate.terms)}</p>
        <p>${escapeHtml(company.approvalDisclaimerText)}</p>
        ${company.servicePolicyText ? `<p>${escapeHtml(company.servicePolicyText)}</p>` : ""}
      </section>

      ${decisionSent ? `
        <section class="approval-card approval-confirmation">
          <div class="approval-decision-status ${escapeHtml(decisionLabel)}">
            <span>${decisionLabel === "approved" ? "Approved" : decisionLabel === "declined" ? "Changes requested" : "Decision sent"}</span>
          </div>
          <p class="eyebrow">Approval confirmation</p>
          <h2>${escapeHtml(decisionTitle)}</h2>
          <p>${escapeHtml(decisionBody)}</p>
          <div class="approval-document-summary">
            <div>
              <span>Customer</span>
              <strong>${escapeHtml(job.name)}</strong>
            </div>
            <div>
              <span>Estimate total</span>
              <strong>${escapeHtml(formatMoney(estimate.amount))}</strong>
            </div>
            <div>
              <span>Deposit requested</span>
              <strong>${escapeHtml(formatMoney(depositAmount))}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>${escapeHtml(decisionLabel === "approved" ? "Approved and saved" : decisionLabel === "declined" ? "Sent for office review" : "Sent")}</strong>
            </div>
          </div>
          ${job.declineReason ? `<div class="approval-banner danger">Reason sent: ${escapeHtml(job.declineReason)}</div>` : ""}
          ${decisionLabel === "approved" && approvalPdfFile ? `
            <div class="approval-download-choice">
              <div>
                <strong>Would you like a copy for your records?</strong>
                <p>${escapeHtml(company.companyName || "The shop")} already saved this signed approval in the job file. Downloading is optional; the office can send it again later.</p>
              </div>
              <button class="secondary-button" type="button" data-view-approval-file="${escapeHtml(approvalPdfFile.id)}">Download a copy</button>
            </div>
          ` : ""}
          <div class="approval-contact-card">
            <strong>${decisionLabel === "declined" ? "Need us to update the estimate?" : "Need anything else?"}</strong>
            <p>Contact ${escapeHtml(company.companyName)} at ${escapeHtml(officeContact)}.</p>
          </div>
          ${customerFacingSupportMarkup(company)}
        </section>
      ` : `
        <form class="approval-card approval-form" id="approvalForm" data-customer-name="${escapeHtml(job.name)}" data-job-payload="${escapeHtml(JSON.stringify(job))}" ${options.token ? `data-approval-token="${escapeHtml(options.token)}"` : ""}>
          <h2>Approve Work</h2>
          <p>${escapeHtml(company.approvalWording)}</p>
          <p class="settings-note">${escapeHtml(company.approvalDisclaimerText)}</p>
          <label>
            Typed legal name
            <input name="signature" autocomplete="name" placeholder="${escapeHtml(job.name)}">
            <small>Approval must be signed with the customer name on this job: ${escapeHtml(job.name)}.</small>
          </label>
          <div class="signature-pad-panel">
            <div>
              <strong>Customer signature</strong>
              <button class="utility-button" type="button" data-clear-signature>Clear</button>
            </div>
            <canvas width="620" height="160" tabindex="0" data-signature-pad aria-label="Customer signature pad"></canvas>
            <input type="hidden" name="signatureImage" data-signature-image>
            <small>Draw the customer signature before approving.</small>
          </div>
          <label class="approval-checkbox">
            <input type="checkbox" name="deposit">
            <span>Mark ${escapeHtml(formatMoney(depositAmount))} deposit as collected</span>
          </label>
          <div class="denial-reason" data-denial-reason hidden>
            <label>
              Why are you declining?
              <textarea name="declineReason" rows="4" placeholder="Tell the office what needs to change before you approve."></textarea>
            </label>
          </div>
          <div class="approval-actions">
            <button class="primary-button" type="submit" data-approval-decision="approved">Approve estimate</button>
            <button class="secondary-button" type="submit" data-approval-decision="declined">Decline</button>
          </div>
        </form>
      `}

      ${options.publicMode ? "" : '<button class="approval-return" type="button" data-return-app>Back to Backline</button>'}
    </section>
  `;
}

async function renderTokenApprovalPage(token) {
  const client = getSupabaseClient();
  if (!client) {
    renderApprovalPage(null);
    return;
  }

  document.body.classList.add("approval-mode");
  document.body.classList.remove("auth-mode");
  elements.authGate.hidden = true;
  elements.approvalPage.hidden = false;
  elements.approvalPage.innerHTML = `
    <section class="approval-shell">
      <div class="approval-card">
        <img class="approval-logo approval-logo-full compact" src="assets/backline-full-logo-transparent.png" alt="Backline">
        <p class="eyebrow">Backline approval</p>
        <h1>Loading approval</h1>
        <p>Checking the secure approval link.</p>
      </div>
    </section>
  `;

  let result;
  try {
    result = await client.rpc("get_approval_by_token", { input_token: token });
  } catch (caughtError) {
    elements.approvalPage.innerHTML = `
      <section class="approval-shell">
        <div class="approval-card">
          <img class="approval-logo approval-logo-full compact" src="assets/backline-full-logo-transparent.png" alt="Backline">
          <p class="eyebrow">Backline approval</p>
          <h1>Approval link could not load</h1>
          <p>${escapeHtml(friendlySupabaseError(caughtError, "Backline could not reach the secure approval database."))}</p>
        </div>
      </section>
    `;
    return;
  }
  const { data, error } = result;
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row?.job || row.link_status === "expired") {
    elements.approvalPage.innerHTML = `
      <section class="approval-shell">
        <div class="approval-card">
          <img class="approval-logo approval-logo-full compact" src="assets/backline-full-logo-transparent.png" alt="Backline">
          <p class="eyebrow">Backline approval</p>
          <h1>Approval link unavailable</h1>
          <p>${escapeHtml(error?.message || "This approval link is expired or no longer available.")}</p>
        </div>
      </section>
    `;
    return;
  }

  renderApprovalPage(row.job, { token, publicMode: true, linkStatus: row.link_status, companySettings: row.company_settings });
}

async function renderTokenCustomerPortalPage(token, options = {}) {
  const localJob = state.jobs.find((item) => item.portalToken === token);
  if (localJob && !options.forceRemote) {
    renderCustomerPortalPage(localJob, options);
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    renderCustomerPortalPage(localJob || null, options);
    return;
  }

  document.body.classList.add("approval-mode");
  document.body.classList.remove("auth-mode");
  elements.authGate.hidden = true;
  elements.approvalPage.hidden = false;
  elements.approvalPage.innerHTML = `
    <section class="approval-shell portal-shell">
      <div class="approval-card">
        <img class="approval-logo approval-logo-full compact" src="assets/backline-full-logo-transparent.png" alt="Backline">
        <p class="eyebrow">Backline portal</p>
        <h1>Loading customer portal</h1>
        <p>Checking the secure customer link.</p>
      </div>
    </section>
  `;

  let result;
  try {
    result = await client.rpc("get_customer_portal_by_token", { input_token: token });
  } catch (caughtError) {
    elements.approvalPage.innerHTML = `
      <section class="approval-shell portal-shell">
        <div class="approval-card">
          <img class="approval-logo approval-logo-full compact" src="assets/backline-full-logo-transparent.png" alt="Backline">
          <p class="eyebrow">Backline portal</p>
          <h1>Customer portal could not load</h1>
          <p>${escapeHtml(friendlySupabaseError(caughtError, "Backline could not reach the secure customer portal."))}</p>
        </div>
      </section>
    `;
    return;
  }
  const { data, error } = result;
  const row = Array.isArray(data) ? data[0] : data;
  if (error || !row?.job) {
    elements.approvalPage.innerHTML = `
      <section class="approval-shell portal-shell">
        <div class="approval-card">
          <img class="approval-logo approval-logo-full compact" src="assets/backline-full-logo-transparent.png" alt="Backline">
          <p class="eyebrow">Backline portal</p>
          <h1>Job portal not found</h1>
          <p>${escapeHtml(error?.message || "This customer portal link is not available.")}</p>
        </div>
      </section>
    `;
    return;
  }

  const remoteJob = ensureJobDefaults(row.job);
  const index = state.jobs.findIndex((item) => item.id === remoteJob.id);
  if (index >= 0) {
    state.jobs[index] = remoteJob;
  }
  renderCustomerPortalPage(remoteJob, { ...options, companySettings: row.company_settings });
}

async function routeFromHash() {
  const portalMatch = window.location.hash.match(/^#portal=(.+)$/);
  if (portalMatch) {
    await renderTokenCustomerPortalPage(decodeURIComponent(portalMatch[1]));
    return;
  }

  const tokenMatch = window.location.hash.match(/^#approval-token=(.+)$/);
  if (tokenMatch) {
    await renderTokenApprovalPage(decodeURIComponent(tokenMatch[1]));
    return;
  }

  const match = window.location.hash.match(/^#approve=(.+)$/);
  if (match) {
    renderApprovalPage(decodeURIComponent(match[1]));
    return;
  }

  document.body.classList.remove("approval-mode");
  state.portalJob = null;
  elements.approvalPage.hidden = true;
  elements.approvalPage.innerHTML = "";
  render();
}

function renderJobs() {
  const jobs = visibleJobs();
  elements.workGrid?.classList.toggle("inbox-collapsed", state.inboxCollapsed);
  if (elements.collapseInboxButton) {
    elements.collapseInboxButton.textContent = state.inboxCollapsed ? "Open Inbox" : "Hide Inbox";
    elements.collapseInboxButton.setAttribute("aria-expanded", String(!state.inboxCollapsed));
  }

  if (jobs.length === 0) {
    elements.jobList.innerHTML = `
      <div class="empty-state">
        <strong>No jobs ${isFieldScopedRole() ? "assigned" : "yet"}</strong>
        <span>${isFieldScopedRole() ? "Assigned work will appear here when dispatch puts you on the schedule." : "Create your first recovered call to start using Backline."}</span>
        ${can("createJob") ? '<button class="primary-button" type="button" data-open-job-modal>Add first job</button>' : ""}
      </div>
    `;
    return;
  }

  elements.jobList.innerHTML = jobs
    .map((job) => {
      const isActive = job.id === state.selectedJobId ? "active" : "";
      const urgent = job.urgency === "urgent" ? '<span class="pill urgent">Urgent</span>' : "";
      const unread = hasUnreadInboundMessages(job) ? '<span class="pill urgent">New message</span>' : "";
      const profitBadges = renderProfitWatchBadges(job);
      return `
        <button class="job-row ${isActive}" type="button" data-job-id="${job.id}">
          <span class="job-row-top">
            <span class="customer-name">${escapeHtml(job.name)}</span>
            <span class="pill ${escapeHtml(job.status)}">${statusLabel(job.status)}</span>
          </span>
          <span class="job-summary">${escapeHtml(job.issue)}</span>
          <span class="job-row-bottom">
            <span class="pill trade">${escapeHtml(job.trade)}</span>
            ${urgent}
            ${unread}
            ${profitBadges}
            <span>${escapeHtml(scheduleText(job))}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function nextBestAction(job = {}) {
  ensureJobDefaults(job);
  if (isLockedBillingJob(job) && can("reopen")) {
    return {
      label: "Reopen job",
      detail: "Unlock billing or field changes",
      action: "reopen",
      tone: "accent"
    };
  }

  if (!isScheduled(job) && can("book")) {
    return {
      label: "Book job",
      detail: "Set the appointment and technician",
      action: "book",
      tone: "accent"
    };
  }

  if (canCreateInvoiceFromEstimate(job)) {
    return {
      label: "Create invoice",
      detail: "Approved estimate is ready to bill",
      createInvoiceFromEstimate: true,
      tone: "accent"
    };
  }

  const balance = invoiceBalance(job);
  if (balance > 0 && can("paid")) {
    return {
      label: "Record payment",
      detail: `${formatMoney(balance)} balance due`,
      action: "paid",
      tone: "accent"
    };
  }

  if (job.status === "booked" && can("start")) {
    return {
      label: "Start job",
      detail: "Begin field workflow",
      action: "start",
      tone: ""
    };
  }

  if (job.status === "in_progress" && can("complete")) {
    return {
      label: "Complete job",
      detail: `${fieldChecklistProgress(job)} checklist complete`,
      action: "complete",
      tone: "accent"
    };
  }

  if (!estimateAmount(job) && can("estimate")) {
    return {
      label: "Send estimate",
      detail: "Create a customer-facing estimate",
      action: "estimate",
      tone: ""
    };
  }

  if (can("invoice")) {
    return {
      label: "Edit invoice",
      detail: "Review billed work and line items",
      action: "invoice",
      tone: ""
    };
  }

  return null;
}

function renderNextBestActionButton(nextAction) {
  if (!nextAction) {
    return '<span class="job-summary-none">No action needed</span>';
  }

  const tone = nextAction.tone ? ` ${nextAction.tone}` : "";
  const attr = nextAction.createInvoiceFromEstimate
    ? "data-create-invoice-from-estimate"
    : `data-action="${escapeHtml(nextAction.action)}"`;
  return `
    <button class="action-button job-summary-button${tone}" type="button" ${attr}>
      ${escapeHtml(nextAction.label)}
    </button>
  `;
}

function renderJobSummaryBar(job) {
  ensureJobDefaults(job);
  const invoice = invoiceRecord(job);
  const balance = invoiceBalance(job);
  const nextAction = nextBestAction(job);
  const scheduleValue = scheduleText(job, { includeYear: true });
  const technician = isFieldScopedRole() ? "Assigned to you" : technicianDisplayName(job.technician);
  return `
    <section class="job-summary-bar" aria-label="Job summary">
      <div class="job-summary-card">
        <span>Status</span>
        <strong>${escapeHtml(statusLabel(job.status))}</strong>
      </div>
      <div class="job-summary-card">
        <span>Schedule</span>
        ${can("book")
          ? `<button class="summary-value-button" type="button" data-reschedule-job="${escapeHtml(job.id)}">${escapeHtml(scheduleValue)}</button>`
          : `<strong>${escapeHtml(scheduleValue)}</strong>`}
      </div>
      <div class="job-summary-card">
        <span>Technician</span>
        <strong>${escapeHtml(technician)}</strong>
      </div>
      <div class="job-summary-card ${balance ? "due" : "paid"}">
        <span>Balance</span>
        <strong>${escapeHtml(formatMoney(balance))}</strong>
        <small>${escapeHtml(balance ? `${formatMoney(invoice.amount)} total` : "Paid in full")}</small>
      </div>
      <div class="job-summary-card job-summary-action">
        <span>Next action</span>
        ${renderNextBestActionButton(nextAction)}
        ${nextAction?.detail ? `<small>${escapeHtml(nextAction.detail)}</small>` : ""}
      </div>
    </section>
  `;
}

function dispatchBriefRows(job = {}) {
  ensureJobDefaults(job);
  const readiness = jobReadinessMeta(job);
  const reservationRows = jobReservationRows(job);
  const openTasks = (job.tasks || []).map(normalizeJobTask).filter((task) => !task.done);
  const balance = invoiceBalance(job);
  const latestEstimate = latestEstimateRevision(job);
  return [
    {
      label: "Readiness",
      value: readiness.label,
      detail: readiness.detail,
      tone: readiness.className
    },
    {
      label: "Appointment",
      value: scheduleText(job, { includeYear: true }),
      detail: `${durationLabel(jobDurationMinutes(job))} window`
    },
    {
      label: "Technician",
      value: isFieldScopedRole() ? "Assigned to you" : technicianDisplayName(job.technician),
      detail: normalizeTechnician(job.technician) === "To Be Determined" ? "Needs assignment" : "Confirmed assignment",
      tone: normalizeTechnician(job.technician) === "To Be Determined" ? "needs-schedule" : "ready"
    },
    {
      label: "Site contact",
      value: job.siteContact || job.name,
      detail: job.phone
    },
    {
      label: "Materials",
      value: reservationRows.length ? jobPickListSummary(job).label : "No pick list",
      detail: reservationRows.length
        ? reservationRows.map(({ reservation, shortageQty }) => `${reservation.qty} ${reservation.name}${shortageQty ? ` (${shortageQty} short)` : ""}`).join(" - ")
        : (job.partsNote || "No reserved materials yet"),
      tone: jobReservationShortages(job).length ? "needs-parts" : reservationRows.length ? "needs-pick" : ""
    },
    {
      label: "Open tasks",
      value: openTasks.length ? `${openTasks.length} open` : "Clear",
      detail: openTasks.length ? openTasks.slice(0, 4).map((task) => task.title).join(" - ") : fieldChecklistProgress(job),
      tone: openTasks.length ? "needs-pick" : "ready"
    },
    {
      label: "Approval",
      value: job.approvalStatus.replaceAll("_", " "),
      detail: latestEstimate ? `${formatMoney(latestEstimate.amount)} estimate #${latestEstimate.revisionNumber}` : "No estimate sent",
      tone: jobNeedsApprovalBeforeDispatch(job) ? "needs-approval" : ""
    },
    {
      label: "Money",
      value: balance ? `${formatMoney(balance)} due` : "No balance due",
      detail: invoiceRecord(job).amount ? `${formatMoney(invoiceRecord(job).amount)} total billed` : `${formatMoney(estimateAmount(job) || job.value)} expected value`,
      tone: balance ? "needs-approval" : "ready"
    }
  ];
}

function dispatchBriefText(job = {}) {
  ensureJobDefaults(job);
  const rows = dispatchBriefRows(job);
  return [
    `Backline dispatch brief: ${job.name}`,
    `Issue: ${job.issue}`,
    `Address: ${job.address}`,
    "",
    ...rows.map((row) => `${row.label}: ${row.value}${row.detail ? ` - ${row.detail}` : ""}`),
    "",
    "Use Backline for notes, photos, signatures, parts, and job completion."
  ].join("\n");
}

function renderDispatchBrief(job = {}) {
  const readiness = jobReadinessMeta(job);
  const rows = dispatchBriefRows(job);
  return `
    <section class="dispatch-brief ${escapeHtml(readiness.className)}">
      <div class="dispatch-brief-header">
        <div>
          <span class="eyebrow">Dispatch brief</span>
          <h3>${escapeHtml(readiness.label)}</h3>
          <p>${escapeHtml(readiness.detail)}</p>
        </div>
        <button class="utility-button" type="button" data-copy-dispatch-brief="${escapeHtml(job.id)}">Copy brief</button>
      </div>
      <div class="dispatch-brief-grid">
        ${rows.map((row) => `
          <div class="dispatch-brief-card ${escapeHtml(row.tone || "")}">
            <span>${escapeHtml(row.label)}</span>
            <strong>${escapeHtml(row.value)}</strong>
            <small>${escapeHtml(row.detail || "")}</small>
          </div>
        `).join("")}
      </div>
      <p class="settings-note" data-dispatch-brief-status></p>
    </section>
  `;
}

function closeoutActionButton(item = {}) {
  if (!item.action) return "";
  if (item.action === "create_invoice_from_estimate") {
    return `<button class="utility-button" type="button" data-create-invoice-from-estimate>${escapeHtml(item.actionLabel || "Create invoice")}</button>`;
  }
  if (item.action === "review_request") {
    return `<button class="utility-button" type="button" data-closeout-action="review_request">${escapeHtml(item.actionLabel || "Queue review")}</button>`;
  }
  if (["tasks", "equipment"].includes(item.action)) {
    return `<button class="utility-button" type="button" data-closeout-action="${escapeHtml(item.action)}">${escapeHtml(item.actionLabel || "Review")}</button>`;
  }
  return `<button class="utility-button" type="button" data-action="${escapeHtml(item.action)}">${escapeHtml(item.actionLabel || "Fix")}</button>`;
}

function renderCloseoutChecklist(job = {}) {
  const summary = closeoutSummary(job);
  const statusLabel = summary.closed
    ? "Job closed"
    : summary.ready
      ? summary.warnings
        ? `Ready with ${summary.warnings} warning${summary.warnings === 1 ? "" : "s"}`
        : "Ready to close"
    : summary.blocked
      ? `${summary.blocked} blocker${summary.blocked === 1 ? "" : "s"}`
      : `${summary.warnings} warning${summary.warnings === 1 ? "" : "s"}`;
  const detail = summary.closed
    ? "This job has been archived as complete."
    : summary.ready
      ? summary.warnings
        ? "The job can be closed, but review the warnings if your shop requires them."
        : "This job can be archived cleanly."
      : summary.blocked
        ? "Resolve hard blockers before closing the job."
        : "No hard blockers remain, but review these warnings before closing.";
  return `
    <section class="closeout-panel ${summary.ready ? "ready" : summary.blocked ? "blocked" : "warning"}">
      <div class="closeout-header">
        <div>
          <span class="eyebrow">Closeout checklist</span>
          <h3>${escapeHtml(statusLabel)}</h3>
          <p>${escapeHtml(detail)}</p>
        </div>
        ${summary.closed
          ? '<span class="pill paid">Closed</span>'
          : summary.ready
          ? '<button class="action-button accent" type="button" data-action="close">Close job</button>'
          : `<span class="pill ${summary.blocked ? "urgent" : "estimated"}">${escapeHtml(`${summary.done}/${summary.items.length} clear`)}</span>`}
      </div>
      <div class="closeout-list">
        ${summary.items.map((item) => `
          <article class="closeout-item ${escapeHtml(item.status)}">
            <span class="closeout-state">${escapeHtml(item.status === "done" ? "Done" : item.status === "blocked" ? "Blocker" : "Warning")}</span>
            <div>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.detail)}</small>
            </div>
            <div class="closeout-actions">
              ${closeoutActionButton(item)}
            </div>
          </article>
        `).join("")}
      </div>
      <p class="settings-note" data-closeout-status></p>
    </section>
  `;
}

function renderCollapsibleFieldPanel({ title, subtitle, content, badge = "", open = false, className = "", key = "" }) {
  return `
    <details class="field-panel collapsible-field-panel ${escapeHtml(className)}" ${detailExpandedAttributes(key || `panel:${title}`, open)}>
      <summary class="collapsible-field-summary">
        <span>
          <strong>${escapeHtml(title)}</strong>
          ${subtitle ? `<small>${escapeHtml(subtitle)}</small>` : ""}
        </span>
        <span class="collapsible-summary-right">
          ${badge}
          <em>Open</em>
        </span>
      </summary>
      <div class="collapsible-field-body">
        ${content}
      </div>
    </details>
  `;
}

function messageComposeDraft(jobId = state.selectedJobId) {
  const key = String(jobId || "");
  const draft = key ? state.messageDrafts[key] : null;
  return {
    body: String(draft?.body || ""),
    direction: ["note", "out", "portal", "in"].includes(draft?.direction) ? draft.direction : "note"
  };
}

function updateMessageComposeDraft(form = document.querySelector("[data-message-form]"), jobId = state.selectedJobId) {
  const key = String(jobId || "");
  if (!key || !form) return;
  state.messageDrafts[key] = {
    body: String(form.elements.body?.value || ""),
    direction: String(form.elements.direction?.value || "note")
  };
}

function clearMessageComposeDraft(jobId = state.selectedJobId) {
  const key = String(jobId || "");
  if (!key) return;
  delete state.messageDrafts[key];
}

function captureActiveMessageCompose() {
  const form = document.activeElement?.closest?.("[data-message-form]");
  if (!form || !state.selectedJobId) return null;
  updateMessageComposeDraft(form, state.selectedJobId);
  const field = document.activeElement;
  return {
    jobId: state.selectedJobId,
    name: field?.name || "",
    selectionStart: typeof field?.selectionStart === "number" ? field.selectionStart : null,
    selectionEnd: typeof field?.selectionEnd === "number" ? field.selectionEnd : null
  };
}

function restoreActiveMessageCompose(snapshot) {
  if (!snapshot || snapshot.jobId !== state.selectedJobId || !snapshot.name) return;
  requestAnimationFrame(() => {
    const field = elements.jobDetail.querySelector(`[data-message-form] [name="${CSS.escape(snapshot.name)}"]`);
    if (!field) return;
    field.focus();
    if (typeof field.setSelectionRange === "function" && snapshot.selectionStart !== null && snapshot.selectionEnd !== null) {
      field.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
    }
  });
}

function captureDetailScrollPosition() {
  const detailPanel = elements.jobDetail?.closest?.(".detail-panel");
  return {
    pageX: window.scrollX,
    pageY: window.scrollY,
    detailPanel,
    detailPanelTop: detailPanel?.scrollTop || 0,
    jobDetailTop: elements.jobDetail?.scrollTop || 0
  };
}

function restoreDetailScrollPosition(snapshot) {
  if (!snapshot) return;
  const restore = () => {
    if (snapshot.detailPanel?.isConnected) {
      snapshot.detailPanel.scrollTop = snapshot.detailPanelTop;
    }
    if (elements.jobDetail) {
      elements.jobDetail.scrollTop = snapshot.jobDetailTop;
    }
    window.scrollTo(snapshot.pageX || 0, snapshot.pageY || 0);
  };

  restore();
  requestAnimationFrame(restore);
}

function renderDetail() {
  const interruptedCompose = captureActiveMessageCompose();
  const job = selectedJob();
  state.selectedJobId = job?.id || null;

  if (!job) {
    elements.jobDetail.innerHTML = `
      <div class="empty-state detail-empty">
        <strong>Backline is ready</strong>
        <span>${can("createJob") ? "Add a recovered call, then book it, send estimates, track invoices, and keep notes." : "Assigned jobs will appear here with field notes, checklists, photos, and parts."}</span>
        ${can("createJob") ? '<button class="primary-button" type="button" data-open-job-modal>Create job</button>' : ""}
      </div>
    `;
    return;
  }

  const messages = job.messages.length
    ? job.messages.map((message) => renderMessage(job, message)).join("")
    : '<div class="empty-note">No messages or notes yet.</div>';
  const messageDraft = messageComposeDraft(job.id);
  const conflictText = scheduleConflictText(job);
  const reservationShortages = jobReservationShortages(job);

  elements.jobDetail.innerHTML = `
    <div class="detail">
      <div class="job-sticky-header">
        <div class="detail-title">
          <div>
            <h2>${escapeHtml(job.name)}</h2>
            <p class="address">${escapeHtml(job.address)} - ${escapeHtml(job.phone)}</p>
          </div>
          <span class="pill ${escapeHtml(job.status)}">${statusLabel(job.status)}</span>
        </div>

        <div class="detail-actions">
          ${renderJobActions()}
        </div>
        ${renderJobSummaryBar(job)}
      </div>
      ${state.jobActionNotice?.jobId === job.id ? `
        <div class="job-action-notice">
          <span>${escapeHtml(state.jobActionNotice.message)}</span>
          ${state.jobActionNotice.url ? `<a href="${escapeHtml(state.jobActionNotice.url)}" target="_blank" rel="noopener">Open portal</a>` : ""}
        </div>
      ` : ""}

      ${renderPortalAccessPanel(job)}

      ${renderCustomerUpdatesPanel(job)}

      ${renderDispatchBrief(job)}

      ${renderCloseoutChecklist(job)}

      ${conflictText ? `
        <div class="schedule-warning detail-warning">
          <strong>Schedule conflict</strong>
          <span>${escapeHtml(conflictText)} Adjust the time or technician before dispatch if needed.</span>
        </div>
      ` : ""}

      ${reservationShortages.length ? `
        <div class="schedule-warning detail-warning inventory-shortage-warning">
          <strong>Material shortage</strong>
          <span>${escapeHtml(reservationShortages.map(({ reservation, shortageQty }) => `${reservation.name}: ${shortageQty} short`).join(" - "))}</span>
        </div>
      ` : ""}

      <div class="meta-grid ${isFieldScopedRole() ? "tech-meta-grid" : ""}">
        <div class="meta">
          <span>Trade</span>
          <strong>${escapeHtml(job.trade)} / ${escapeHtml(jobTypeLabel(job))}</strong>
        </div>
        <div class="meta">
          <span>Window</span>
          <strong>${escapeHtml(scheduleText(job))}</strong>
        </div>
        <div class="meta">
          <span>Duration</span>
          <strong>${escapeHtml(durationLabel(jobDurationMinutes(job)))}</strong>
        </div>
        ${isFieldScopedRole() ? "" : `
          <div class="meta ${can("book") ? "editable-meta" : ""}">
            <span>Technician</span>
            ${can("book")
              ? technicianPicker(job)
              : `<strong>${escapeHtml(technicianDisplayName(job.technician))}</strong>`}
          </div>
        `}
        <div class="meta">
          <span>Site contact</span>
          <strong class="truncate-value" title="${escapeHtml(job.siteContact || "Not set")}">${escapeHtml(job.siteContact || "Not set")}</strong>
        </div>
        <div class="meta">
          <span>Approval</span>
          <strong>${escapeHtml(job.approvalStatus.replaceAll("_", " "))}</strong>
        </div>
        <div class="meta">
          <span>Field checklist</span>
          <strong>${fieldChecklistProgress(job)}</strong>
        </div>
        <div class="meta">
          <span>Tasks</span>
          <strong>${escapeHtml(taskProgress(job))}</strong>
        </div>
      </div>

      <div class="meta">
        <span>Issue</span>
        <strong>${escapeHtml(job.issue)}</strong>
      </div>

      <section class="field-panel">
        <div class="section-heading">
          <div>
            <h3>Field workflow</h3>
            <p>Designed for the tech: notes, proof, signature, parts, then invoice.</p>
          </div>
          <span class="pill ${escapeHtml(job.status)}">${escapeHtml(statusLabel(job.status))}</span>
        </div>
        ${renderJobTemplateSummary(job)}
        ${renderChecklist(job)}
      </section>

      ${renderJobTasks(job)}

      ${renderCollapsibleFieldPanel({
        key: `job:${job.id}:equipment`,
        title: "Equipment and property",
        subtitle: "HVAC units, water heaters, panels, fixtures, warranty notes, and site details.",
        badge: `<span class="pill estimated">${escapeHtml(job.equipment.length)} record${job.equipment.length === 1 ? "" : "s"}</span>`,
        content: `
        ${can("customer-profile") ? `<form class="equipment-form" data-equipment-form>
          <input name="type" placeholder="Type, e.g. AC unit">
          <input name="name" placeholder="Name, e.g. Upstairs condenser">
          <input name="model" placeholder="Model">
          <input name="serial" placeholder="Serial">
          <input name="installDate" type="date" aria-label="Install date">
          <input name="warranty" placeholder="Warranty">
          <input name="location" placeholder="Location">
          <input name="condition" placeholder="Condition, e.g. Good / aging">
          <input name="serviceIntervalDays" type="number" min="0" placeholder="Service every days">
          <input name="lastServiceDate" type="date" aria-label="Last service date">
          <input name="nextServiceDate" type="date" aria-label="Next service date">
          <input class="wide" name="notes" placeholder="Notes, filter size, refrigerant, capacity, condition">
          <button class="secondary-button" type="submit">Add record</button>
        </form>` : ""}
        ${renderEquipmentList(job)}
        `
      })}

      ${renderCollapsibleFieldPanel({
        key: `job:${job.id}:files`,
        title: "Photos and files",
        subtitle: "Before/after photos, equipment labels, permits, and signed documents.",
        badge: `<span class="pill estimated">${escapeHtml(job.files.length)} file${job.files.length === 1 ? "" : "s"}</span>`,
        content: `
        ${can("uploadFiles") ? `
          <form class="file-upload-form" data-file-upload-form>
            <input type="file" name="files" multiple accept="image/*,.pdf,.doc,.docx">
            <input name="note" placeholder="Optional note">
            <button class="secondary-button" type="submit">Upload</button>
          </form>
        ` : ""}
        ${renderJobFiles(job)}
        `
      })}

      ${renderCollapsibleFieldPanel({
        key: `job:${job.id}:parts`,
        title: "Parts and tools",
        subtitle: "Lightweight on-hand material tracking before full inventory.",
        badge: `<span class="pill estimated">${escapeHtml(job.parts.length)} logged</span>`,
        content: `
        ${renderReservationPickList(job)}
        ${can("parts") ? '<div class="collapsible-inline-actions"><button class="action-button" type="button" data-action="parts">Log parts</button></div>' : ""}
        ${renderPartsList(job)}
        `
      })}

      ${renderEstimatePanel(job)}
      ${renderInvoicePanel(job)}
      ${renderJobCostingPanel(job)}

      ${renderCollapsibleFieldPanel({
        key: `job:${job.id}:customer-history`,
        title: "Customer history",
        subtitle: "Quickly find what happened last time.",
        content: `
        ${renderCustomerHistory(job)}
        `
      })}

      ${renderJobCommunications(job)}

      <form class="message-compose" data-message-form>
        <input name="body" placeholder="Add a note or customer message" autocomplete="off" value="${escapeHtml(messageDraft.body)}" required>
        ${backlineDropdown({
          id: `message-type-${job.id}`,
          name: "direction",
          value: messageDraft.direction || "note",
          options: [
            { value: "note", label: "Internal note" },
            ...(can("portal-update") ? [
              { value: "out", label: "SMS / customer message" },
              { value: "portal", label: "Portal update" },
              { value: "in", label: "Customer reply" }
            ] : [])
          ],
          placeholder: "Message type",
          direction: "up"
        })}
        <button class="secondary-button" type="submit">Add</button>
      </form>

      <section class="message-thread-panel" aria-label="Job messages" style="--message-thread-height: ${clampMessageThreadHeight(state.messageThreadHeight)}px">
        <div class="message-thread-resize" role="button" tabindex="0" data-message-resize-handle aria-label="Drag up or down to resize message history">
          <span></span>
        </div>
        <div class="message-thread">${messages}</div>
      </section>
    </div>
  `;
  keepMessageThreadAtBottom();
  restoreActiveMessageCompose(interruptedCompose);
}

function keepMessageThreadAtBottom() {
  const thread = elements.jobDetail.querySelector(".message-thread");
  if (!thread) return;
  thread.scrollTop = thread.scrollHeight;
  requestAnimationFrame(() => {
    thread.scrollTop = thread.scrollHeight;
  });
  state.messageThreadScrollToBottom = false;
}

function renderMessage(job, message) {
  const normalized = normalizeJobMessage(message);
  const isOutbound = normalized.direction === "out";
  const isNote = normalized.direction === "note";
  const className = isNote ? "message-line note" : isOutbound ? "message-line outbound" : "message-line";
  const actor = internalActorDisplayName(normalized.createdBy || "Backline");
  const label = isNote ? actor.slice(0, 1).toUpperCase() : isOutbound ? "SMS" : job.name.slice(0, 1).toUpperCase();
  return `
    <div class="${className}">
      ${!isOutbound ? `<span class="avatar">${label}</span>` : ""}
      <div class="message-bubble">
        <span>${escapeHtml(normalized.body)}</span>
        <small>
          <b>${escapeHtml(actor)}</b>
          <em>${escapeHtml(normalized.createdAt)}</em>
        </small>
      </div>
      ${isOutbound ? `<span class="avatar">${label}</span>` : ""}
    </div>
  `;
}

function renderScheduleCard(job, options = {}) {
  ensureJobDefaults(job);
  const isScheduleEditable = can("book");
  const displayTime = isScheduled(job)
    ? `${formatTime(job.startTime)}-${formatTime(effectiveEndTime(job))}`
    : "Unscheduled";
  const isNew = isNewAssignment(job);
  const conflictText = scheduleConflictText(job);
  const balance = invoiceBalance(job);
  const statusMeta = scheduleStatusMeta(job, conflictText);
  const quickSlots = !isScheduled(job) && isScheduleEditable ? quickScheduleSlots(job) : [];
  const pickSummary = jobPickListSummary(job);
  const readinessMeta = jobReadinessMeta(job);
  const unreadCount = unreadInboundMessages(job).length;
  return `
    <article class="appointment ${escapeHtml(job.status)} ${isNew ? "new-assignment" : ""} ${conflictText ? "schedule-conflict" : ""}" draggable="${isScheduleEditable}" data-schedule-job-id="${escapeHtml(job.id)}">
      <div class="appointment-main">
        <div class="appointment-status-row">
          <span class="schedule-status-chip ${escapeHtml(statusMeta.className)}">${escapeHtml(statusMeta.label)}</span>
          <span class="schedule-status-chip readiness ${escapeHtml(readinessMeta.className)}">${escapeHtml(readinessMeta.label)}</span>
          ${normalizeTechnician(job.technician) === "To Be Determined" ? '<span class="schedule-status-chip unassigned">Tech TBD</span>' : ""}
          ${unreadCount ? `<span class="schedule-status-chip unread">${escapeHtml(`${unreadCount} new message${unreadCount === 1 ? "" : "s"}`)}</span>` : ""}
          ${pickSummary.shortages ? `<span class="schedule-status-chip shortage">${escapeHtml(`${pickSummary.shortages} shortage${pickSummary.shortages === 1 ? "" : "s"}`)}</span>` : pickSummary.total ? `<span class="schedule-status-chip pick-list">${escapeHtml(pickSummary.label)}</span>` : ""}
        </div>
        ${isScheduleEditable ? `
          <button class="appointment-time appointment-time-button" type="button" data-reschedule-job="${escapeHtml(job.id)}" aria-label="Edit appointment time">
            ${escapeHtml(options.fullDate ? scheduleText(job, { includeYear: true }) : displayTime)}
          </button>
        ` : `<span class="appointment-time">${escapeHtml(options.fullDate ? scheduleText(job, { includeYear: true }) : displayTime)}</span>`}
        ${isNew ? '<span class="assignment-badge">New assignment</span>' : ""}
        ${conflictText ? '<span class="conflict-badge">Conflict</span>' : ""}
        <button class="appointment-open" type="button" data-job-id="${escapeHtml(job.id)}">
          <strong>${escapeHtml(job.name)}</strong>
          <small>${escapeHtml(job.issue)}</small>
        </button>
        <div class="appointment-meta-strip">
          <span>${escapeHtml(job.trade)} / ${escapeHtml(jobTypeLabel(job))}</span>
          <span>${escapeHtml(technicianDisplayName(job.technician))}</span>
          <span>${escapeHtml(balance ? `${formatMoney(balance)} due` : formatMoney(jobReportingValue(job)))}</span>
        </div>
        <small class="schedule-card-note ${escapeHtml(readinessMeta.className)}">${escapeHtml(readinessMeta.detail)}</small>
        ${quickSlots.length ? `
          <div class="quick-schedule-actions">
            ${quickSlots.map((slot) => `
              <button class="utility-button" type="button" data-quick-schedule-job="${escapeHtml(job.id)}" data-quick-schedule-date="${escapeHtml(slot.date)}" data-quick-schedule-time="${escapeHtml(slot.time)}">
                ${escapeHtml(slot.label)}
              </button>
            `).join("")}
            <button class="secondary-button" type="button" data-reschedule-job="${escapeHtml(job.id)}">Pick time</button>
          </div>
        ` : ""}
      </div>
      ${isScheduleEditable ? `
        <details class="dispatch-editor" ${detailExpandedAttributes(`schedule:${job.id}:dispatch`)}>
          <summary>
            <span>${escapeHtml(isScheduled(job) ? scheduleText(job, { includeYear: true }) : "Set appointment time")}</span>
            <em>Edit date/time</em>
          </summary>
          <form class="dispatch-controls" data-schedule-form="${escapeHtml(job.id)}">
            <label>
              Date
              <input name="scheduleDate" type="date" value="${escapeHtml(job.scheduleDate || todayISO())}" aria-label="Schedule date">
            </label>
            <label>
              Start
              <input name="startTime" type="time" value="${escapeHtml(job.startTime || "09:00")}" aria-label="Start time">
            </label>
            <label>
              Duration
              ${backlineDropdown({
                id: `schedule-duration-${job.id}`,
                name: "durationMinutes",
                value: String(jobDurationMinutes(job)),
                options: durationOptionItems(jobDurationMinutes(job)),
                placeholder: "Duration",
                direction: "up"
              })}
            </label>
            <label class="wide">
              Technician
              ${backlineDropdown({
                id: `schedule-technician-${job.id}`,
                name: "technician",
                value: normalizeTechnician(job.technician),
                options: technicianOptionItems(job.technician),
                placeholder: "Technician",
                direction: "up"
              })}
            </label>
            ${conflictText ? `<div class="schedule-warning wide">${escapeHtml(conflictText)}</div>` : ""}
            <button class="secondary-button wide" type="button" data-reschedule-job="${escapeHtml(job.id)}">Reschedule</button>
            <button class="utility-button" type="submit">Update schedule</button>
          </form>
        </details>
      ` : ""}
    </article>
  `;
}

function technicianWorkJobs() {
  if (!isFieldScopedRole()) return [];
  const jobs = roleScopedJobs()
    .filter((job) => !["closed", "paid"].includes(job.status))
    .map(ensureJobDefaults);
  const todayJobs = jobs.filter((job) => job.scheduleDate === todayISO()).sort(sortBySchedule);
  const extraNew = newAssignmentJobs()
    .filter((job) => job.scheduleDate !== todayISO())
    .sort(sortBySchedule);
  return [...todayJobs, ...extraNew].slice(0, 8);
}

function renderTechnicianWorkPanel() {
  if (!elements.techWorkPanel) return;
  if (!isFieldScopedRole()) {
    elements.techWorkPanel.hidden = true;
    elements.techWorkPanel.innerHTML = "";
    return;
  }

  const jobs = technicianWorkJobs();
  const newCount = newAssignmentJobs().length;
  const openTaskJobs = technicianOpenTaskJobs();
  const todayTaskJobs = openTaskJobs.filter((job) => job.scheduleDate === todayISO() || job.status === "in_progress");
  const openTaskCount = openTaskJobs.reduce((count, job) => count + incompleteTaskCount(job), 0);
  const loadoutJobs = jobs.filter((job) => job.scheduleDate === todayISO());
  elements.techWorkPanel.hidden = false;
  elements.techWorkPanel.innerHTML = `
    <div class="tech-work-header">
      <div>
        <h3>My work today</h3>
        <p>${jobs.length ? `${jobs.length} assigned job${jobs.length === 1 ? "" : "s"} to keep moving` : "No assigned work is due today."}</p>
        <div class="tech-work-summary" aria-label="Technician work summary">
          <span class="tech-work-chip ${newCount ? "urgent" : ""}">${escapeHtml(newCount ? `${newCount} new assignment${newCount === 1 ? "" : "s"}` : "No new assignments")}</span>
          <span class="tech-work-chip ${todayTaskJobs.length ? "active" : ""}">${escapeHtml(todayTaskJobs.length ? `${todayTaskJobs.length} job${todayTaskJobs.length === 1 ? "" : "s"} with tasks today` : "No task blockers today")}</span>
          <span class="tech-work-chip">${escapeHtml(openTaskCount ? `${openTaskCount} open task${openTaskCount === 1 ? "" : "s"}` : "All assigned tasks clear")}</span>
        </div>
      </div>
      <span class="pill ${newCount ? "urgent" : "estimated"}">${newCount ? `${newCount} new` : "Caught up"}</span>
    </div>
    ${renderDailyLoadoutPanel(loadoutJobs, {
      title: "Truck loadout",
      subtitle: "Reserved materials for your assigned jobs",
      day: todayISO(),
      compact: true,
      canPick: can("parts")
    })}
    <div class="tech-work-list">
      ${jobs.length ? jobs.map((job) => {
        const taskCount = incompleteTaskCount(job);
        const pickSummary = jobPickListSummary(job);
        const readinessMeta = jobReadinessMeta(job);
        const action = job.status === "booked"
          ? `<button class="utility-button" type="button" data-tech-job-action="start" data-job-id="${escapeHtml(job.id)}">Start job</button>`
          : job.status === "in_progress"
            ? `<button class="utility-button" type="button" data-tech-job-action="complete" data-job-id="${escapeHtml(job.id)}">Finish job</button>`
            : `<button class="utility-button" type="button" data-tech-job-action="open" data-job-id="${escapeHtml(job.id)}">Open job</button>`;
        return `
          <article class="tech-work-card ${isNewAssignment(job) ? "new-assignment" : ""}">
            <button class="tech-work-main" type="button" data-tech-job-action="open" data-job-id="${escapeHtml(job.id)}">
              <span>
                <span class="tech-work-flags">
                  ${isNewAssignment(job) ? '<em class="assignment-badge">New assignment</em>' : ""}
                  ${job.scheduleDate === todayISO() ? '<em class="assignment-badge due">Due today</em>' : ""}
                  ${taskCount ? `<em class="assignment-badge tasks">${escapeHtml(`${taskCount} task${taskCount === 1 ? "" : "s"}`)}</em>` : ""}
                </span>
                <strong>${escapeHtml(job.name)}</strong>
                <small>${escapeHtml(scheduleText(job))} - ${escapeHtml(job.trade)} / ${escapeHtml(jobTypeLabel(job))}</small>
              </span>
              <span class="tech-work-meta">
                <b>${taskCount ? `${taskCount} task${taskCount === 1 ? "" : "s"} left` : "Tasks clear"}</b>
                <small>${escapeHtml(`${readinessMeta.label} - ${pickSummary.shortages ? `${pickSummary.shortages} material shortage${pickSummary.shortages === 1 ? "" : "s"}` : pickSummary.total ? pickSummary.label : `${fieldChecklistProgress(job)} checklist`}`)}</small>
              </span>
            </button>
            <div class="tech-work-actions">
              ${action}
            </div>
          </article>
        `;
      }).join("") : `
        <div class="empty-state compact-empty">
          <strong>No field work due today</strong>
          <span>New assignments and today's scheduled jobs will show up here.</span>
        </div>
      `}
    </div>
  `;
}

function renderSchedule() {
  renderTechnicianWorkPanel();
  const scheduleJobs = roleScopedJobs()
    .filter((job) => !["closed", "paid"].includes(job.status))
    .map(ensureJobDefaults);
  const scheduleFilter = state.scheduleFilter || "week";
  const bookedJobs = scheduleJobs
    .filter((job) => isScheduled(job) && ["booked", "in_progress", "completed", "estimated", "invoiced"].includes(job.status))
    .sort(sortBySchedule);
  const unscheduledJobs = scheduleJobs
    .filter((job) => !isScheduled(job) || job.status === "open")
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const days = scheduleFilter === "today"
    ? [todayISO()]
    : scheduleFilter === "unscheduled"
      ? []
      : Array.from({ length: 7 }, (_, index) => addDaysISO(index));
  const jobsByDay = new Map(days.map((day) => [day, []]));
  bookedJobs.forEach((job) => {
    if (!jobsByDay.has(job.scheduleDate)) {
      return;
    }
    jobsByDay.get(job.scheduleDate).push(job);
  });

  const visibleDays = days.map((day) => [day, jobsByDay.get(day) || []]);
  const todayCount = bookedJobs.filter((job) => job.scheduleDate === todayISO()).length;
  const weekCount = bookedJobs.filter((job) => days.includes(job.scheduleDate)).length;
  const conflictCount = bookedJobs.filter((job) => scheduleConflictsForJob(job).length > 0).length;
  const tbdCount = scheduleJobs.filter((job) => normalizeTechnician(job.technician) === "To Be Determined" && !["closed", "paid"].includes(job.status)).length;
  const scheduledMinutesToday = bookedJobs
    .filter((job) => job.scheduleDate === todayISO())
    .reduce((total, job) => total + jobDurationMinutes(job), 0);
  const showUnscheduled = scheduleFilter === "week" || scheduleFilter === "unscheduled";
  const showGrid = scheduleFilter !== "unscheduled";
  const visibleReadinessJobs = scheduleFilter === "unscheduled"
    ? unscheduledJobs
    : scheduleJobs.filter((job) => days.includes(job.scheduleDate) || (showUnscheduled && (!isScheduled(job) || job.status === "open")));
  const readinessSummary = scheduleReadinessSummary(visibleReadinessJobs);
  const tomorrowShortageCount = scheduleJobs.filter((job) =>
    job.scheduleDate === addDaysISO(1) &&
    !["paid", "closed"].includes(job.status) &&
    jobReservationShortages(job).length > 0
  ).length;

  elements.timeline.innerHTML = `
    ${can("book") ? renderTechnicianWorkload(scheduleJobs) : ""}
    <div class="schedule-toolbar">
      <div>
        <strong>${scheduleFilter === "today" ? "Today" : scheduleFilter === "unscheduled" ? "Unscheduled jobs" : "This week"}</strong>
        <span>${todayCount} today - ${scheduleFilter === "unscheduled" ? unscheduledJobs.length : weekCount} in view - ${unscheduledJobs.length} need scheduling</span>
      </div>
      <div class="schedule-filters" role="group" aria-label="Schedule filter">
        <button class="schedule-filter-button ${scheduleFilter === "today" ? "active" : ""}" type="button" data-schedule-filter="today">Today</button>
        <button class="schedule-filter-button ${scheduleFilter === "week" ? "active" : ""}" type="button" data-schedule-filter="week">This week</button>
        <button class="schedule-filter-button ${scheduleFilter === "unscheduled" ? "active" : ""}" type="button" data-schedule-filter="unscheduled">Unscheduled</button>
      </div>
    </div>
    <div class="schedule-health-grid">
      <div>
        <span>Unscheduled</span>
        <strong>${unscheduledJobs.length}</strong>
        <small>Needs booking</small>
      </div>
      <div class="${conflictCount ? "attention" : ""}">
        <span>Conflicts</span>
        <strong>${conflictCount}</strong>
        <small>${conflictCount ? "Needs review" : "Clear"}</small>
      </div>
      <div class="${tbdCount ? "attention" : ""}">
        <span>Tech TBD</span>
        <strong>${tbdCount}</strong>
        <small>Needs assignment</small>
      </div>
      <div>
        <span>Today booked</span>
        <strong>${escapeHtml(durationLabel(scheduledMinutesToday))}</strong>
        <small>${todayCount} job${todayCount === 1 ? "" : "s"}</small>
      </div>
      <div class="${readinessSummary["needs-parts"] ? "attention" : ""}">
        <span>Needs parts</span>
        <strong>${readinessSummary["needs-parts"]}</strong>
        <small>${tomorrowShortageCount ? `${tomorrowShortageCount} tomorrow` : "Shortage watch"}</small>
      </div>
      <div class="${readinessSummary.ready ? "" : "attention"}">
        <span>Ready</span>
        <strong>${readinessSummary.ready}</strong>
        <small>${readinessSummary.total} in readiness view</small>
      </div>
    </div>
    ${scheduleFilter !== "unscheduled" ? renderDailyLoadoutPanel(scheduleJobs, {
      title: "Today loadout",
      subtitle: "Reserved materials before trucks roll",
      day: todayISO(),
      canPick: can("parts")
    }) : ""}
    <div class="dispatch-board ${!showUnscheduled ? "schedule-only" : ""} ${!showGrid ? "unscheduled-only" : ""}">
      ${showUnscheduled ? `
        <section class="unscheduled-column" data-schedule-drop-day="unscheduled">
          <div class="day-header">
            <strong>Needs scheduling</strong>
            <span>${unscheduledJobs.length} job${unscheduledJobs.length === 1 ? "" : "s"}</span>
          </div>
          <div class="day-jobs">
            ${unscheduledJobs.length
              ? unscheduledJobs.map((job) => renderScheduleCard(job)).join("")
              : '<div class="open-slot">No unscheduled work</div>'}
          </div>
        </section>
      ` : ""}
      ${showGrid ? `
        <div class="schedule-grid ${scheduleFilter === "today" ? "today-grid" : ""}">
          ${visibleDays
            .map(([day, jobs]) => `
              <section class="day-column" data-schedule-drop-day="${escapeHtml(day)}">
                <div class="day-header">
                  <strong>${formatDateLabel(day, { includeYear: true })}</strong>
                  <span>${jobs.length} job${jobs.length === 1 ? "" : "s"}</span>
                </div>
                <div class="day-jobs">
                  ${jobs.length
                    ? jobs.map((job) => renderScheduleCard(job)).join("")
                    : '<div class="open-slot">Open capacity</div>'}
                </div>
              </section>
            `)
            .join("")}
        </div>
      ` : ""}
    </div>
  `;
  const laterStart = addDaysISO(7);
  const laterEnd = addDaysISO(SCHEDULE_LATER_WINDOW_DAYS);
  const outsideRange = bookedJobs.filter((job) =>
    job.scheduleDate >= laterStart &&
    job.scheduleDate <= laterEnd
  );
  if (scheduleFilter === "week" && outsideRange.length > 0) {
    elements.timeline.insertAdjacentHTML("beforeend", `
      <div class="later-section">
        <h3>Later</h3>
        ${outsideRange.map((job) => renderScheduleCard(job, { fullDate: true })).join("")}
      </div>
    `);
  }
}

function scheduledJobsForPrint(range = "today") {
  const days = range === "week"
    ? calendarWeekDaysISO()
    : [todayISO()];

  return state.jobs
    .filter((job) => isAssignedToCurrentUser(job))
    .filter((job) => isScheduled(job) && days.includes(job.scheduleDate) && !["closed"].includes(job.status))
    .map(ensureJobDefaults)
    .sort(sortBySchedule);
}

function renderPrintSchedule(range = "today") {
  const jobs = scheduledJobsForPrint(range);
  const weekDays = calendarWeekDaysISO();
  const title = range === "week" ? "Weekly Schedule" : "Today's Schedule";
  const rangeLabel = range === "week"
    ? `${formatDateLabel(weekDays[0])} - ${formatDateLabel(weekDays[6])}`
    : formatDateLabel(todayISO());
  const generatedAt = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());

  const rows = jobs.length
    ? jobs.map((job) => `
      <tr>
        <td>
          <strong>${escapeHtml(formatDateLabel(job.scheduleDate))}</strong>
          <span>${escapeHtml(formatTime(job.startTime))}-${escapeHtml(formatTime(effectiveEndTime(job)))}</span>
        </td>
        <td>
          <strong>${escapeHtml(job.name)}</strong>
          <span>${escapeHtml(job.phone)}</span>
        </td>
        <td>
          <strong>${escapeHtml(job.address)}</strong>
          <span>${escapeHtml(job.issue)}</span>
        </td>
        <td>
          <strong>${escapeHtml(technicianDisplayName(job.technician))}</strong>
          <span>${escapeHtml(job.trade)} / ${escapeHtml(jobTypeLabel(job))}</span>
        </td>
        <td>
          <strong>${escapeHtml(statusLabel(job.status))}</strong>
          <span>${escapeHtml(job.partsNote || "No parts note")}</span>
        </td>
      </tr>
    `).join("")
    : `
      <tr>
        <td colspan="5">
          <strong>No scheduled jobs</strong>
          <span>Book jobs before printing a schedule.</span>
        </td>
      </tr>
    `;

  elements.printSchedule.innerHTML = `
    <div class="print-header">
      <div>
        <img class="print-logo" src="assets/backline-banner-transparent.png" alt="Backline">
        <h1>${escapeHtml(title)}</h1>
        <span>${escapeHtml(rangeLabel)}</span>
      </div>
      <div>
        <strong>${jobs.length} job${jobs.length === 1 ? "" : "s"}</strong>
        <span>Printed ${escapeHtml(generatedAt)}</span>
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Customer</th>
          <th>Job</th>
          <th>Tech</th>
          <th>Status / parts</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function recommendedFollowups() {
  return roleScopedJobs()
    .filter((job) => !["paid", "closed"].includes(job.status))
    .map((job) => {
      ensureJobDefaults(job);
      if (job.status === "open") {
        return { job, title: `Book ${job.name}`, detail: job.issue, action: "Book job" };
      }
      if (job.status === "in_progress") {
        return { job, title: `Finish ${job.name}`, detail: `${fieldChecklistProgress(job)} checklist complete`, action: "Complete" };
      }
      if (job.status === "completed") {
        return { job, title: `Invoice ${job.name}`, detail: "Field work is done and ready to collect", action: "Invoice" };
      }
      if (job.status === "estimated") {
        const approval = job.approvalStatus === "approved" ? "approved and ready to invoice" : "not approved yet";
        return { job, title: `Follow up on ${formatMoney(estimateAmount(job))} estimate`, detail: `${job.name} has ${approval}`, action: job.approvalStatus === "approved" ? "Invoice" : "Nudge" };
      }
      if (job.status === "invoiced") {
        const balance = invoiceBalance(job) || invoiceRecord(job).amount;
        return { job, title: `Collect ${formatMoney(balance)}`, detail: `${job.name} has an unpaid invoice`, action: "Remind" };
      }
      return { job, title: `Confirm ${job.name}`, detail: isScheduled(job) ? scheduleText(job) : "No arrival window", action: "Confirm" };
    });
}

function followupReasonLabel(reason = "") {
  const normalizedReason = baseFollowupReason(reason);
  const labels = {
    customer_reply: "Customer replies",
    scheduling: "Scheduling",
    ready_to_invoice: "Ready to invoice",
    stale_estimate: "Stale estimates",
    approved_estimate: "Approved estimates",
    unpaid_invoice: "Unpaid invoices",
    field_work: "Field work",
    upcoming_visit: "Upcoming visits",
    equipment_maintenance: "Maintenance due"
  };
  return labels[normalizedReason] || "Follow-ups";
}

function followupPriorityLabel(priority = "") {
  const labels = {
    urgent: "Urgent",
    money: "Money",
    scheduling: "Scheduling",
    customer: "Customer",
    field: "Field",
    routine: "Routine"
  };
  return labels[priority] || "Follow-up";
}

function followupStateFor(job = {}, reason = "") {
  ensureJobDefaults(job);
  job.followupState[reason] ||= { completedBy: {}, snoozedBy: {} };
  job.followupState[reason].completedBy ||= {};
  job.followupState[reason].snoozedBy ||= {};
  return job.followupState[reason];
}

function followupItemKey(job = {}, reason = "") {
  return `${job.id}:${reason}`;
}

function baseFollowupReason(reason = "") {
  return String(reason || "").split(":")[0];
}

function isFollowupCompletedForCurrentUser(job = {}, reason = "") {
  return Boolean(followupStateFor(job, reason).completedBy?.[assignmentSeenKey()]);
}

function followupSnoozedUntil(job = {}, reason = "") {
  return followupStateFor(job, reason).snoozedBy?.[assignmentSeenKey()] || "";
}

function isFollowupSnoozed(job = {}, reason = "") {
  const until = followupSnoozedUntil(job, reason);
  return Boolean(until && until > new Date().toISOString());
}

function makeFollowupItem(job, reason, priority, title, detail, action, actionType, meta = {}) {
  return {
    id: followupItemKey(job, reason),
    job,
    reason,
    reasonGroup: baseFollowupReason(reason),
    priority,
    title,
    detail,
    action,
    actionType,
    snoozedUntil: followupSnoozedUntil(job, reason),
    ...meta
  };
}

function openMaintenanceJobForEquipment(sourceJob = {}, equipmentId = "") {
  return Boolean(findOpenMaintenanceJobForEquipment(sourceJob, equipmentId));
}

function findOpenMaintenanceJobForEquipment(sourceJob = {}, equipmentId = "") {
  const customerId = sourceJob.customerId || customerIdFromPhone(sourceJob.phone, sourceJob.id);
  return roleScopedJobs().find((job) => {
    ensureJobDefaults(job);
    if (job.id === sourceJob.id || job.customerId !== customerId || ["paid", "closed"].includes(job.status)) return false;
    return (job.equipment || []).some((record) => normalizeEquipmentRecord(record).id === equipmentId) && job.jobType === "maintenance";
  }) || null;
}

function followupQueueItems() {
  const items = [];
  roleScopedJobs()
    .filter((job) => !["paid", "closed"].includes(job.status))
    .forEach((job) => {
      ensureJobDefaults(job);
      const replies = unreadInboundMessages(job);
      if (replies.length) {
        items.push(makeFollowupItem(
          job,
          "customer_reply",
          "urgent",
          `${job.name} replied`,
          replies[0].body || "Customer reply needs review",
          "Open reply",
          "open"
        ));
      }
      if (!isScheduled(job) && !["in_progress", "completed", "estimated", "invoiced"].includes(job.status)) {
        items.push(makeFollowupItem(
          job,
          "scheduling",
          "scheduling",
          `${job.name} needs a scheduled time`,
          job.issue,
          "Book job",
          "book"
        ));
      }
      if (job.status === "in_progress") {
        items.push(makeFollowupItem(
          job,
          "field_work",
          "field",
          `${job.name} is active in the field`,
          `${fieldChecklistProgress(job)} checklist complete`,
          "Complete",
          "complete"
        ));
      }
      if (job.status === "completed") {
        items.push(makeFollowupItem(
          job,
          "ready_to_invoice",
          "money",
          `${job.name} is ready to invoice`,
          "Field work is complete and ready for billing",
          "Create invoice",
          "invoice"
        ));
      }
      if (job.status === "estimated") {
        if (job.approvalStatus === "approved") {
          items.push(makeFollowupItem(
            job,
            "approved_estimate",
            "money",
            `${job.name} approved the estimate`,
            `${formatMoney(estimateAmount(job))} approved and ready to invoice`,
            "Create invoice",
            canCreateInvoiceFromEstimate(job) ? "create_invoice_from_estimate" : "invoice"
          ));
        } else {
          items.push(makeFollowupItem(
            job,
            "stale_estimate",
            "customer",
            `${job.name} has an open estimate`,
            `${formatMoney(estimateAmount(job))} estimate has not been approved`,
            "Send follow-up",
            "estimate_followup"
          ));
        }
      }
      if (job.status === "invoiced") {
        const balance = invoiceBalance(job) || invoiceRecord(job).amount;
        items.push(makeFollowupItem(
          job,
          "unpaid_invoice",
          "money",
          `${job.name} has an unpaid invoice`,
          `${formatMoney(balance)} still outstanding`,
          "Record payment",
          "paid"
        ));
      }
      if (isScheduled(job) && job.scheduleDate >= todayISO() && job.scheduleDate <= addDaysISO(2) && job.status === "booked") {
        items.push(makeFollowupItem(
          job,
          "upcoming_visit",
          "routine",
          `${job.name} has an upcoming visit`,
          scheduleText(job, { includeYear: true }),
          "Confirm",
          "customer_confirmation"
        ));
      }
      if (job.jobType !== "maintenance") {
        job.equipment
          .map(normalizeEquipmentRecord)
          .filter((equipment) => equipment.nextServiceDate && daysUntilISO(equipment.nextServiceDate) <= 30)
          .filter((equipment) => !openMaintenanceJobForEquipment(job, equipment.id))
          .forEach((equipment) => {
            const status = equipmentMaintenanceStatus(equipment);
            items.push(makeFollowupItem(
              job,
              `equipment_maintenance:${equipment.id}`,
              status.tone === "due" ? "scheduling" : "routine",
              `${equipmentLabel(equipment)} needs maintenance`,
              `${job.name} - ${status.detail}`,
              "Create job",
              "create_maintenance_job",
              { equipmentId: equipment.id }
            ));
          });
      }
    });

  return items
    .filter((item) => !isFollowupCompletedForCurrentUser(item.job, item.reason))
    .filter((item) => !isFollowupSnoozed(item.job, item.reason))
    .sort((a, b) => followupPriorityRank(a.priority) - followupPriorityRank(b.priority));
}

function followupPriorityRank(priority = "") {
  const ranks = { urgent: 0, money: 1, scheduling: 2, customer: 3, field: 4, routine: 5 };
  return ranks[priority] ?? 9;
}

function groupFollowupsByReason(items = []) {
  return items.reduce((groups, item) => {
    const reason = item.reasonGroup || baseFollowupReason(item.reason);
    if (!groups[reason]) groups[reason] = [];
    groups[reason].push(item);
    return groups;
  }, {});
}

function followupNotificationType(actionType = "") {
  const map = {
    estimate_followup: "estimate_followup",
    customer_confirmation: "customer_confirmation",
    invoice_reminder: "invoice_reminder"
  };
  return map[actionType] || "";
}

function renderFollowupRow(item) {
  return `
    <article class="followup-row ${escapeHtml(item.priority)}">
      <div class="followup-main">
        <span class="pill ${escapeHtml(item.priority)}">${escapeHtml(followupPriorityLabel(item.priority))}</span>
        <strong>${escapeHtml(item.title)}</strong>
        <small>${escapeHtml(item.detail)}</small>
      </div>
      <div class="followup-actions">
        <button class="utility-button" type="button" data-job-id="${escapeHtml(item.job.id)}">Open job</button>
        <button class="utility-button" type="button" data-followup-action="${escapeHtml(item.actionType)}" data-job-id="${escapeHtml(item.job.id)}" ${item.equipmentId ? `data-equipment-id="${escapeHtml(item.equipmentId)}"` : ""}>${escapeHtml(item.action)}</button>
        <button class="utility-button" type="button" data-followup-snooze="${escapeHtml(item.reason)}" data-job-id="${escapeHtml(item.job.id)}">Snooze</button>
        <button class="utility-button" type="button" data-followup-complete="${escapeHtml(item.reason)}" data-job-id="${escapeHtml(item.job.id)}">Complete</button>
      </div>
    </article>
  `;
}

function renderAutomations() {
  if (!elements.automationList) return;
  state.automations = { ...defaultAutomations, ...(state.automations || {}) };
  const canManageAutomations = can("exportData");
  const rows = [
    ["missedCall", "Missed-call text-back", "Prepare an instant reply for new recovered calls"],
    ["appointmentReminder", "Appointment reminder", "Add reminder messages to booked jobs"],
    ["estimateFollowUp", "Estimate follow-up", "Queue follow-up after an estimate is sent"],
    ["invoiceFollowUp", "Invoice follow-up", "Queue a payment reminder after invoicing"],
    ["reviewRequest", "Review request", "Queue a review ask when a job is paid"]
  ];

  elements.automationList.innerHTML = rows
    .map(([key, title, description]) => `
      <label class="toggle-row">
        <span>
          <strong>${title}</strong>
          <small>${description}</small>
        </span>
        <input type="checkbox" data-automation="${key}" ${state.automations[key] ? "checked" : ""} ${canManageAutomations ? "" : "disabled"}>
      </label>
    `)
    .join("");
}

function renderProfitWatch() {
  if (!elements.profitWatch) return;
  if (!canViewJobCosting()) {
    elements.profitWatch.innerHTML = "";
    return;
  }

  const watchItems = roleScopedJobs()
    .flatMap((job) => profitWatchItems(job).map((item) => ({ ...item, job })))
    .sort((a, b) => {
      const order = { urgent: 0, invoiced: 1, open: 2, estimated: 3, paid: 4 };
      return (order[a.tone] ?? 9) - (order[b.tone] ?? 9);
    });

  const counts = watchItems.reduce((totals, item) => {
    totals[item.type] = (totals[item.type] || 0) + 1;
    return totals;
  }, {});

  elements.profitWatch.innerHTML = `
    <section class="profit-watch-panel">
      <div class="section-heading">
        <div>
          <h3>Profit Watch</h3>
          <p>Margin leaks, missing costs, and closeout-ready jobs.</p>
        </div>
        <span class="pill ${watchItems.length ? "estimated" : "paid"}">${escapeHtml(watchItems.length ? `${watchItems.length} alerts` : "Clear")}</span>
      </div>
      <div class="profit-watch-summary">
        <div><span>Below margin</span><strong>${escapeHtml(counts.below_margin || 0)}</strong></div>
        <div><span>Missing cost</span><strong>${escapeHtml(counts.missing_part_cost || 0)}</strong></div>
        <div><span>Unpriced labor</span><strong>${escapeHtml(counts.unpriced_labor || 0)}</strong></div>
        <div><span>Billing checks</span><strong>${escapeHtml(counts.collected_over_billed || 0)}</strong></div>
        <div><span>Ready to close</span><strong>${escapeHtml(counts.ready_to_close || 0)}</strong></div>
      </div>
      <div class="profit-watch-list">
        ${watchItems.length ? watchItems.slice(0, 12).map((item) => `
          <article class="profit-watch-row ${escapeHtml(item.tone)}">
            <div>
              <span class="pill profit ${escapeHtml(item.tone)}">${escapeHtml(item.badge)}</span>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.detail)}</small>
            </div>
            <div class="profit-watch-actions">
              <button class="utility-button" type="button" data-job-id="${escapeHtml(item.job.id)}">Open job</button>
              <button class="utility-button" type="button" data-profit-action="${escapeHtml(item.actionType)}" data-job-id="${escapeHtml(item.job.id)}">${escapeHtml(item.action)}</button>
            </div>
          </article>
        `).join("") : '<div class="empty-note">No profit leaks are showing right now. Jobs with margin risk, missing costs, or billing mismatches will appear here.</div>'}
      </div>
    </section>
  `;
}

function renderMetrics() {
  const jobs = roleScopedJobs();
  const revenue = jobs.reduce((sum, job) => sum + jobReportingValue(job), 0);
  const paid = jobs.filter((job) => job.status === "paid").reduce((sum, job) => {
    const invoice = invoiceRecord(job);
    return sum + Math.max(invoiceCollectedAmount(invoice), invoice.amount, estimateAmount(job), normalizeValue(job.value));
  }, 0);
  const costingJobs = canViewJobCosting() ? jobs.map(jobCostingSummary) : [];
  const directCost = costingJobs.reduce((sum, costing) => sum + costing.directCost, 0);
  const grossMargin = costingJobs.reduce((sum, costing) => sum + costing.grossMargin, 0);
  const marginPercent = revenue > 0 ? Math.round((grossMargin / revenue) * 100) : 0;
  const open = jobs.filter((job) => job.status === "open").length;
  const readyToInvoice = jobs.filter((job) => job.status === "completed").length;
  const closeRate = jobs.length ? Math.round((jobs.filter((job) => job.status === "paid").length / jobs.length) * 100) : 0;

  elements.metricsGrid.innerHTML = [
    ["Pipeline", formatMoney(revenue)],
    ["Collected", formatMoney(paid)],
    ...(canViewJobCosting() ? [["Direct cost", formatMoney(directCost)], ["Gross margin", `${formatMoney(grossMargin)} (${marginPercent}%)`]] : []),
    ["Open requests", open],
    ["Ready to invoice", readyToInvoice],
    ["Paid close rate", `${closeRate}%`]
  ]
    .map(([label, value]) => `
      <div class="metric-block">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join("");

  renderProfitWatch();

  const statuses = ["open", "booked", "in_progress", "completed", "estimated", "invoiced", "paid", "closed"];
  elements.pipelineTable.innerHTML = statuses
    .map((status) => {
      const statusJobs = jobs.filter((job) => job.status === status);
      const value = statusJobs.reduce((sum, job) => sum + jobReportingValue(job), 0);
      return `
        <div class="pipeline-row">
          <span>${statusLabel(status)}</span>
          <strong>${jobCountLabel(statusJobs.length)}</strong>
          <em>${formatMoney(value)}</em>
        </div>
      `;
    })
    .join("");
}

function renderMoney() {
  const jobs = roleScopedJobs().filter((job) => ["completed", "estimated", "invoiced", "paid"].includes(job.status));
  elements.moneyList.innerHTML = jobs.length
    ? jobs.map((job) => {
      const invoice = invoiceRecord(job);
      const balance = invoiceBalance(job);
      return `
      <div class="pipeline-row money-row action-row" data-job-id="${job.id}">
        <span>
          ${escapeHtml(job.name)}
          <small>${escapeHtml(invoice.number)} - ${escapeHtml(paymentMethodLabel(invoice.paymentMethod))}</small>
        </span>
        <strong>
          ${escapeHtml(invoiceStatusLabel(invoice.status))}
          <small>${escapeHtml(statusLabel(job.status))}</small>
        </strong>
        <em>
          ${formatMoney(invoice.amount)}
          <small>${balance ? `${formatMoney(balance)} due` : "No balance"}</small>
        </em>
      </div>
    `;
    }).join("")
    : `<div class="empty-state compact-empty"><strong>No estimate or invoice activity yet</strong><span>Send an estimate or invoice from a job page.</span></div>`;
  renderReceivablesAging();
  renderPaymentReviewQueue();
}

function renderReceivablesAging() {
  if (!elements.receivablesList) return;
  const items = receivableItems();
  const summary = receivableSummary(items);
  elements.receivablesList.innerHTML = `
    <div class="receivables-summary">
      ${summary.map((item) => `
        <div class="receivables-summary-card ${escapeHtml(item.bucket)}">
          <span>${escapeHtml(item.label)}</span>
          <strong>${escapeHtml(formatMoney(item.amount))}</strong>
          <small>${escapeHtml(jobCountLabel(item.count))}</small>
        </div>
      `).join("")}
    </div>
    <div class="receivable-row-list">
      ${items.length ? items.map((item) => {
        const dueText = item.daysPastDue
          ? `${item.daysPastDue} day${item.daysPastDue === 1 ? "" : "s"} overdue`
          : `Due ${formatDateLabel(item.dueDate, { includeYear: true })}`;
        return `
          <article class="receivable-row ${escapeHtml(item.bucket)}">
            <div class="receivable-main">
              <span>${escapeHtml(receivableBucketLabel(item.bucket))}</span>
              <strong>${escapeHtml(item.job.name)}</strong>
              <small>${escapeHtml(`${item.invoice.number} - ${item.job.issue}`)}</small>
            </div>
            <div class="receivable-amounts">
              <div><span>Billed</span><strong>${escapeHtml(formatMoney(item.invoice.amount))}</strong></div>
              <div><span>Collected</span><strong>${escapeHtml(formatMoney(item.collected))}</strong></div>
              <div><span>Balance</span><strong>${escapeHtml(formatMoney(item.balance))}</strong></div>
              <div><span>${item.request ? "Request" : "Due"}</span><strong>${escapeHtml(item.request ? formatMoney(item.request.amount) : dueText)}</strong><small>${escapeHtml(item.request ? dueText : "")}</small></div>
            </div>
            <div class="receivable-actions">
              ${can("payment-request") ? `<button class="utility-button accent" type="button" data-receivable-reminder="${escapeHtml(item.job.id)}">${item.request ? "Send reminder" : "Request payment"}</button>` : ""}
              <button class="utility-button" type="button" data-job-id="${escapeHtml(item.job.id)}">Open job</button>
            </div>
          </article>
        `;
      }).join("") : `<div class="empty-state compact-empty"><strong>No open receivables</strong><span>Invoices with unpaid balances will appear here.</span></div>`}
    </div>
  `;
}

function renderPaymentReviewQueue() {
  if (!elements.paymentReviewList) return;
  const items = paymentReviewItems();
  elements.paymentReviewList.innerHTML = items.length
    ? items.map(({ job, message, parsed }) => {
      const invoice = invoiceRecord(job);
      const balance = invoiceBalance(job);
      return `
        <article class="payment-review-card">
          <div class="payment-review-main">
            <span>Customer payment response</span>
            <strong>${escapeHtml(job.name)}</strong>
            <small>${escapeHtml(`${job.issue} - ${invoice.number} - ${formatMoney(balance)} balance`)}</small>
            <p>${escapeHtml(message.body)}</p>
          </div>
          <div class="payment-review-facts">
            <div><span>Claimed</span><strong>${escapeHtml(parsed.amount ? formatMoney(parsed.amount) : "Not set")}</strong></div>
            <div><span>Method</span><strong>${escapeHtml(parsed.methodLabel)}</strong></div>
            <div><span>Reference</span><strong>${escapeHtml(parsed.reference || "None")}</strong></div>
            <div><span>Received</span><strong>${escapeHtml(formatCommunicationTime(message.createdAt))}</strong></div>
          </div>
          <div class="payment-review-actions">
            ${can("paid") ? `<button class="utility-button accent" type="button" data-payment-review-record="${escapeHtml(message.id)}" data-job-id="${escapeHtml(job.id)}">Record payment</button>` : ""}
            <button class="utility-button" type="button" data-payment-review-dismiss="${escapeHtml(message.id)}" data-job-id="${escapeHtml(job.id)}">Dismiss</button>
            <button class="utility-button" type="button" data-job-id="${escapeHtml(job.id)}">Open job</button>
          </div>
        </article>
      `;
    }).join("")
    : `<div class="empty-state compact-empty"><strong>No payment responses waiting</strong><span>Customer portal payment replies will appear here for review.</span></div>`;
}

function renderPricebook() {
  if (!elements.pricebookList) return;
  if (elements.pricebookCategoryPicker) {
    const selectedCategory = elements.pricebookForm?.elements.category?.value || "Repair";
    elements.pricebookCategoryPicker.innerHTML = renderCategoryPicker("pricebook-category", selectedCategory);
  }
  if (elements.pricebookUnitPicker) {
    const selectedUnit = elements.pricebookForm?.elements.unit?.value || "each";
    elements.pricebookUnitPicker.innerHTML = renderUnitPicker("pricebook-unit", selectedUnit);
  }
  const items = state.pricebookItems.map(normalizePricebookItem).sort((a, b) => `${a.active ? "0" : "1"} ${a.category} ${a.name}`.localeCompare(`${b.active ? "0" : "1"} ${b.category} ${b.name}`));
  elements.pricebookList.innerHTML = items.length
    ? items.map((item) => `
      <div class="pricebook-row ${item.active ? "" : "inactive"}">
        <span>
          <strong>${escapeHtml(item.name)}</strong>
          <small>${escapeHtml(item.category)} - ${escapeHtml(item.description || "No description")}${item.defaultCost ? ` - cost ${formatMoney(item.defaultCost)}` : ""}</small>
        </span>
        <span>${escapeHtml(item.unit)}</span>
        <strong>${escapeHtml(formatMoney(item.unitPrice))}</strong>
        <em>${item.taxable ? "Taxable" : "Non-taxable"}</em>
        <span class="pricebook-row-actions">
          <button class="utility-button" type="button" data-edit-pricebook-item="${escapeHtml(item.id)}">Edit</button>
          <button class="utility-button" type="button" data-pricebook-toggle="${escapeHtml(item.id)}">${item.active ? "Deactivate" : "Activate"}</button>
        </span>
      </div>
    `).join("")
    : `<div class="empty-state compact-empty"><strong>No pricebook items yet</strong><span>Add your own services, materials, rates, and discounts. Nothing is hardcoded.</span></div>`;
}

function renderInventoryOrders() {
  if (!elements.inventoryOrdersList) return;
  const orders = inventoryPurchaseOrders().filter((order) => order.status !== "cancelled");
  const counts = {
    open: orders.filter((order) => order.status === "open").length,
    partial: orders.filter((order) => order.status === "partial").length,
    late: orders.filter((order) => order.status === "late").length,
    received: orders.filter((order) => order.status === "received").length
  };
  const filter = counts[state.inventoryOrderFilter] !== undefined ? state.inventoryOrderFilter : "open";
  const visible = orders.filter((order) => order.status === filter);
  elements.inventoryOrdersList.innerHTML = `
    <div class="inventory-orders-header">
      <span>
        <strong>Inventory orders</strong>
        <small>${escapeHtml(`${orders.length} purchase order${orders.length === 1 ? "" : "s"} tracked from supplier ordering and receiving.`)}</small>
      </span>
      <div class="inventory-order-filters" aria-label="Filter inventory orders">
        ${["open", "partial", "late", "received"].map((status) => `
          <button class="schedule-filter-button ${filter === status ? "active" : ""}" type="button" data-inventory-order-filter="${escapeHtml(status)}">
            ${escapeHtml(inventoryOrderFilterLabel(status))} <span>${escapeHtml(counts[status])}</span>
          </button>
        `).join("")}
      </div>
    </div>
    <div class="inventory-order-board">
      ${visible.length ? visible.map((order) => `
        <article class="inventory-order-card-row ${escapeHtml(order.status)}">
          <span>
            <strong>${escapeHtml(order.number)}</strong>
            <small>${escapeHtml(`${order.supplier || "Supplier not set"} - ${order.lines.length} line${order.lines.length === 1 ? "" : "s"}`)}</small>
          </span>
          <span>
            <strong>${escapeHtml(order.status === "received" ? "Received" : `${order.remainingQty} pending`)}</strong>
            <small>${escapeHtml(`${order.receivedQty} received of ${order.orderedQty} ordered`)}</small>
          </span>
          <span>
            <strong>${escapeHtml(order.remainingTotal ? formatMoney(order.remainingTotal) : formatMoney(order.orderedTotal))}</strong>
            <small>${escapeHtml(order.expectedDate ? `Expected ${formatDateLabel(order.expectedDate, { includeYear: true })}` : "No expected date")}</small>
          </span>
          <span class="inventory-row-actions">
            <button class="utility-button" type="button" data-view-inventory-order="${escapeHtml(order.id)}">Details</button>
            ${order.remainingQty > 0 ? `<button class="utility-button" type="button" data-receive-supplier-po="${escapeHtml(order.id)}">Receive</button>` : ""}
          </span>
        </article>
      `).join("") : `<div class="empty-state compact-empty"><strong>No ${escapeHtml(inventoryOrderFilterLabel(filter).toLowerCase())} orders</strong><span>Purchase orders will appear here when materials are ordered from suppliers.</span></div>`}
    </div>
  `;
}

function renderInventoryOrderDetail(purchaseOrderId = "") {
  if (!elements.inventoryOrderDetailContent) return;
  const order = inventoryPurchaseOrderById(purchaseOrderId);
  if (!order) {
    elements.inventoryOrderDetailContent.innerHTML = `<div class="empty-state compact-empty"><strong>Order not found</strong><span>This purchase order may have been removed.</span></div>`;
    return;
  }
  elements.inventoryOrderDetailContent.innerHTML = `
    <div class="activity-detail-header">
      <div>
        <p class="eyebrow">Inventory order</p>
        <h2>${escapeHtml(order.number)}</h2>
        <p>${escapeHtml(`${order.supplier || "Supplier not set"} - ${inventoryOrderFilterLabel(order.status)}`)}</p>
      </div>
      <span class="pill ${escapeHtml(order.status === "received" ? "paid" : order.status === "late" ? "urgent" : "booked")}">${escapeHtml(inventoryOrderFilterLabel(order.status))}</span>
    </div>
    <div class="activity-detail-grid">
      ${activityDetailStat("Ordered", order.orderedQty)}
      ${activityDetailStat("Received", order.receivedQty)}
      ${activityDetailStat("Pending", order.remainingQty)}
      ${activityDetailStat("Order total", formatMoney(order.orderedTotal))}
      ${activityDetailStat("Pending value", formatMoney(order.remainingTotal))}
      ${activityDetailStat("Expected", order.expectedDate ? formatDateLabel(order.expectedDate, { includeYear: true }) : "Not set")}
    </div>
    <section class="activity-detail-section">
      <div class="section-heading">
        <div>
          <h3>Lines</h3>
          <p>Material, ordered quantity, received quantity, pending quantity, unit cost, and line total.</p>
        </div>
      </div>
      <div class="inventory-order-detail-list">
        ${order.lines.map(({ item, order: lineOrder, remainingQty }) => `
          <article class="inventory-order-detail-row ${escapeHtml(remainingQty ? "pending" : "received")}">
            <span>
              <strong>${escapeHtml(item.name)}</strong>
              <small>${escapeHtml(item.category)} - ${escapeHtml(item.unit)}</small>
            </span>
            <span>
              <strong>${escapeHtml(`${lineOrder.receivedQty} / ${lineOrder.qty}`)}</strong>
              <small>${escapeHtml(`${remainingQty} pending`)}</small>
            </span>
            <span>
              <strong>${escapeHtml(lineOrder.unitCost ? formatMoney(lineOrder.unitCost) : "Cost missing")}</strong>
              <small>${escapeHtml(`Line ${formatMoney(lineOrder.qty * lineOrder.unitCost)}`)}</small>
            </span>
            <span class="inventory-row-actions">
              <button class="utility-button" type="button" data-view-inventory-usage="${escapeHtml(item.id)}">Usage</button>
              ${remainingQty > 0 ? `<button class="utility-button" type="button" data-receive-inventory-order="${escapeHtml(lineOrder.id)}" data-item-id="${escapeHtml(item.id)}">Receive line</button>` : ""}
            </span>
          </article>
        `).join("")}
      </div>
    </section>
    ${order.note ? `
      <section class="activity-detail-section">
        <h3>Note</h3>
        <p>${escapeHtml(order.note)}</p>
      </section>
    ` : ""}
    ${order.remainingQty > 0 ? `
      <section class="activity-detail-section">
        <div class="inventory-detail-actions">
          <button class="secondary-button" type="button" data-receive-supplier-po="${escapeHtml(order.id)}">Receive selected lines</button>
          <button class="secondary-button danger-button" type="button" data-cancel-inventory-order="${escapeHtml(order.id)}">Cancel remaining</button>
        </div>
      </section>
    ` : ""}
  `;
}

function openInventoryOrderDetail(purchaseOrderId = "") {
  if (!elements.inventoryOrderDetailModal || !purchaseOrderId) return;
  renderInventoryOrderDetail(purchaseOrderId);
  try {
    if (!elements.inventoryOrderDetailModal.open) {
      elements.inventoryOrderDetailModal.showModal();
    }
  } catch {
    elements.inventoryOrderDetailModal.setAttribute("open", "");
  }
}

function cancelRemainingPurchaseOrder(purchaseOrderId = "") {
  const id = String(purchaseOrderId || "").trim();
  if (!id) return false;
  const order = inventoryPurchaseOrderById(id);
  if (!order || order.remainingQty <= 0) return false;
  let cancelledQty = 0;
  state.pricebookItems = state.pricebookItems.map((rawItem) => {
    const item = normalizePricebookItem(rawItem);
    const orders = item.orders.map((rawOrder) => {
      const lineOrder = normalizeInventoryOrder(rawOrder);
      if ((lineOrder.purchaseOrderId || lineOrder.id) !== id || lineOrder.status !== "ordered") return lineOrder;
      const remainingQty = inventoryOrderRemainingQty(lineOrder);
      if (!remainingQty) return lineOrder;
      cancelledQty += remainingQty;
      return normalizeInventoryOrder({
        ...lineOrder,
        qty: lineOrder.receivedQty,
        status: lineOrder.receivedQty > 0 ? "received" : "cancelled",
        note: [lineOrder.note, `Remaining ${remainingQty} cancelled by ${accountDisplayName()}`].filter(Boolean).join(" - ")
      });
    });
    return normalizePricebookItem({ ...item, orders, updatedAt: new Date().toISOString() });
  });
  recordInventoryOrderActivity(
    "Purchase order remaining quantity cancelled",
    `${order.number}: ${cancelledQty} pending unit${cancelledQty === 1 ? "" : "s"} cancelled.`,
    [
      { field: "purchaseOrder", label: "Purchase order", before: `${order.remainingQty} pending`, after: "0 pending" }
    ]
  );
  save();
  renderPricebook();
  renderInventoryLite();
  if (elements.inventoryOrderDetailModal?.open) renderInventoryOrderDetail(id);
  renderActivity();
  return true;
}

function renderInventoryLite() {
  if (!elements.inventoryList || !elements.inventorySummary) return;
  const rows = inventoryRows();
  const reorderRows = inventoryReorderRows();
  const pendingOrders = inventoryPendingOrders();
  const supplierRows = inventorySupplierRows();
  const lowStock = rows.filter((row) => inventoryWarnings(row).includes("low on hand")).length;
  const missingCost = rows.filter((row) => inventoryWarnings(row).includes("missing default cost")).length;
  const frequentUnsaved = rows.filter((row) => row.kind === "logged").length;
  elements.inventorySummary.innerHTML = `
    <div><span>Saved materials</span><strong>${escapeHtml(inventoryMaterialItems().length)}</strong></div>
    <div><span>Low on hand</span><strong>${escapeHtml(lowStock)}</strong></div>
    <div><span>Missing cost</span><strong>${escapeHtml(missingCost)}</strong></div>
    <div><span>Pending orders</span><strong>${escapeHtml(pendingOrders.length)}</strong></div>
  `;
  renderInventoryOrders();
  if (elements.inventorySupplierList) {
    elements.inventorySupplierList.innerHTML = supplierRows.length
      ? `
        <div class="inventory-supplier-header">
          <div>
            <h3>Supplier directory</h3>
            <p>${escapeHtml(`${supplierRows.length} supplier${supplierRows.length === 1 ? "" : "s"} tied to saved materials, reorder needs, and pending orders.`)}</p>
          </div>
          <button class="utility-button" type="button" data-add-supplier>Add supplier</button>
        </div>
        <div class="inventory-supplier-grid">
          ${supplierRows.map((supplier) => `
            <article class="inventory-supplier-card ${escapeHtml(supplier.reorderCount ? "needs-order" : supplier.pendingCount ? "pending" : "ready")}">
              <div class="inventory-supplier-card-header">
                <span>
                  <strong>${escapeHtml(supplier.supplier)}</strong>
                  <small>${escapeHtml(`${supplier.itemCount} material${supplier.itemCount === 1 ? "" : "s"}${supplier.lastUsedAt ? ` - last used ${formatDateLabel(supplier.lastUsedAt, { includeYear: true })}` : ""}`)}</small>
                </span>
                <span class="pill ${escapeHtml(supplier.reorderCount ? "estimated" : supplier.pendingCount ? "booked" : "paid")}">${escapeHtml(supplier.reorderCount ? `${supplier.reorderCount} reorder` : supplier.pendingCount ? `${supplier.pendingCount} pending` : "Ready")}</span>
              </div>
              <div class="supplier-contact-grid">
                <div><span>Phone</span><strong>${escapeHtml(supplier.record.phone || "Not set")}</strong></div>
                <div><span>Email</span><strong>${escapeHtml(supplier.record.email || "Not set")}</strong></div>
                <div><span>Account</span><strong>${escapeHtml(supplier.record.accountNumber || "Not set")}</strong></div>
                <div><span>Contact</span><strong>${escapeHtml(supplier.record.preferredContact || "phone")}</strong></div>
              </div>
              <div class="inventory-supplier-stats">
                <div><span>Reorder est.</span><strong>${escapeHtml(formatMoney(supplier.reorderEstimate))}</strong></div>
                <div><span>Pending est.</span><strong>${escapeHtml(formatMoney(supplier.pendingEstimate))}</strong></div>
              </div>
              <p>${escapeHtml(supplier.lowStockNames.slice(0, 3).join(", ") || supplier.pendingNames.slice(0, 3).join(", ") || "No immediate material action.")}</p>
              ${supplier.record.deliveryNotes ? `<p class="supplier-notes">${escapeHtml(supplier.record.deliveryNotes)}</p>` : ""}
              ${supplier.orderGroups.length ? `
                <div class="supplier-order-history">
                  ${supplier.orderGroups.map((orderGroup) => `
                    <article class="supplier-order-row ${escapeHtml(orderGroup.status)}">
                      <span>
                        <strong>${escapeHtml(orderGroup.number)}</strong>
                        <small>${escapeHtml(`${orderGroup.lines.length} line${orderGroup.lines.length === 1 ? "" : "s"} - ${orderGroup.remainingQty} still pending${orderGroup.expectedDate ? ` - expected ${formatDateLabel(orderGroup.expectedDate, { includeYear: true })}` : ""}`)}</small>
                      </span>
                      <span>
                        <strong>${escapeHtml(formatMoney(orderGroup.total))}</strong>
                        <small>${escapeHtml(orderGroup.status === "ordered" ? "Pending" : "Received")}</small>
                      </span>
                      ${orderGroup.status === "ordered" ? `<button class="utility-button" type="button" data-receive-supplier-po="${escapeHtml(orderGroup.id)}">Receive PO</button>` : ""}
                    </article>
                  `).join("")}
                </div>
              ` : ""}
              <div class="inventory-row-actions">
                <button class="utility-button" type="button" data-edit-supplier="${escapeHtml(supplier.supplier)}">Edit supplier</button>
                <button class="utility-button" type="button" data-order-supplier-po="${escapeHtml(supplier.supplier)}" ${supplier.reorderCount ? "" : "disabled"}>Create PO</button>
                <button class="utility-button" type="button" data-copy-supplier-reorder="${escapeHtml(supplier.supplier)}" ${supplier.reorderCount ? "" : "disabled"}>Copy order list</button>
              </div>
            </article>
          `).join("")}
        </div>
      `
      : `
        <div class="inventory-supplier-header">
          <div>
            <h3>Supplier directory</h3>
            <p>Add supplier contacts before tying materials to them.</p>
          </div>
          <button class="utility-button" type="button" data-add-supplier>Add supplier</button>
        </div>
        <div class="empty-state compact-empty"><strong>No suppliers yet</strong><span>Add a supplier or save a material with a preferred supplier.</span></div>
      `;
  }
  if (elements.inventoryReorderList) {
    elements.inventoryReorderList.innerHTML = `
      ${pendingOrders.length ? `
        <div class="inventory-reorder-header orders">
          <div>
            <h3>Pending orders</h3>
            <p>${escapeHtml(`${pendingOrders.length} order${pendingOrders.length === 1 ? "" : "s"} waiting to be received.`)}</p>
          </div>
        </div>
        <div class="inventory-reorder-rows">
          ${pendingOrders.map(({ item, order, estimatedCost }) => `
            <article class="inventory-reorder-row ordered">
              <span>
                <strong>${escapeHtml(item.name)}</strong>
                <small>${escapeHtml(order.supplier || "Supplier not set")}</small>
              </span>
              <span>
                <strong>${escapeHtml(`${inventoryOrderRemainingQty(order)} of ${order.qty} ${item.unit}${order.qty === 1 ? "" : "s"} pending`)}</strong>
                <small>${escapeHtml(`${order.receivedQty ? `${order.receivedQty} received - ` : ""}${order.expectedDate ? `Expected ${formatDateLabel(order.expectedDate, { includeYear: true })}` : "No expected date"}`)}</small>
              </span>
              <span>
                <strong>${escapeHtml(estimatedCost ? formatMoney(estimatedCost) : "Cost missing")}</strong>
                <small>${escapeHtml(`Ordered by ${order.orderedBy || "Backline"}`)}</small>
              </span>
              <span class="inventory-row-actions">
                <button class="utility-button" type="button" data-view-inventory-usage="${escapeHtml(item.id)}">Usage</button>
                <button class="utility-button" type="button" data-receive-inventory-order="${escapeHtml(order.id)}" data-item-id="${escapeHtml(item.id)}">Receive</button>
              </span>
            </article>
          `).join("")}
        </div>
      ` : ""}
      ${reorderRows.length
      ? `
        <div class="inventory-reorder-header">
          <div>
            <h3>Reorder list</h3>
            <p>${escapeHtml(`${reorderRows.length} material${reorderRows.length === 1 ? "" : "s"} at or below reorder point - estimated ${formatMoney(inventoryReorderTotal(reorderRows))}.`)}</p>
          </div>
          <button class="utility-button" type="button" data-copy-reorder-list>Copy list</button>
        </div>
        <div class="inventory-reorder-rows">
          ${reorderRows.map((row) => `
            <article class="inventory-reorder-row ${escapeHtml(row.urgency)}">
              <span>
                <strong>${escapeHtml(row.name)}</strong>
                <small>${escapeHtml(row.supplierLabel)}</small>
              </span>
              <span>
                <strong>${escapeHtml(`Order ${row.suggestedQty} ${row.unit}${row.suggestedQty === 1 ? "" : "s"}`)}</strong>
                <small>${escapeHtml(`On hand ${row.truckStock} - reorder at ${row.reorderPoint} - target ${row.targetStock}`)}</small>
              </span>
              <span>
                <strong>${escapeHtml(row.estimatedCost ? formatMoney(row.estimatedCost) : "Cost missing")}</strong>
                <small>${escapeHtml(row.defaultCost ? `${formatMoney(row.defaultCost)} each` : "Add default cost")}</small>
              </span>
              <span class="inventory-row-actions">
                <button class="utility-button" type="button" data-view-inventory-usage="${escapeHtml(row.id)}">Usage</button>
                <button class="utility-button" type="button" data-order-inventory-item="${escapeHtml(row.id)}">Mark ordered</button>
                <button class="utility-button" type="button" data-edit-pricebook-item="${escapeHtml(row.id)}">Edit on hand</button>
              </span>
            </article>
          `).join("")}
        </div>
        <p class="inventory-reorder-status" data-inventory-reorder-status></p>
      `
      : ""}
    `;
  }
  elements.inventoryList.innerHTML = rows.length
    ? `
      <div class="inventory-list-title">
        <span>
          <strong>Material list</strong>
          <small>Saved pricebook materials and frequently logged parts.</small>
        </span>
      </div>
      <div class="inventory-row inventory-header">
        <span>Part</span>
        <span>Supplier</span>
        <span>Cost</span>
        <span>Bill rate</span>
        <span>Stock</span>
        <span>Status</span>
        <span></span>
      </div>
      ${rows.map((row) => {
        const warnings = inventoryWarnings(row);
        return `
          <div class="inventory-row ${escapeHtml(warnings.length ? "warning" : "ready")}">
            <span>
              <strong>${escapeHtml(row.name)}</strong>
              <small>${escapeHtml(row.kind === "pricebook" ? `${row.usageCount || 0} used${row.lastUsedAt ? ` - last ${formatDateLabel(row.lastUsedAt, { includeYear: true })}` : ""}` : `${row.usageCount} logged uses`)}</small>
            </span>
            <span>${escapeHtml(row.supplier)}</span>
            <span>${escapeHtml(row.defaultCost ? formatMoney(row.defaultCost) : "Missing")}</span>
            <span>${escapeHtml(row.billRate ? formatMoney(row.billRate) : "Not set")}</span>
            <span>${escapeHtml(row.kind === "pricebook" ? `${row.availableQty} available / ${row.truckStock} on hand${row.reservedQty ? ` / ${row.reservedQty} reserved` : ""}` : "Not saved")}</span>
            <span>${warnings.length ? warnings.map((warning) => `<em>${escapeHtml(warning)}</em>`).join("") : "<em>ready</em>"}</span>
            <span class="inventory-row-actions">
              <button class="utility-button" type="button" data-view-inventory-usage="${escapeHtml(row.id)}">View usage</button>
              ${row.kind === "logged"
                ? `<button class="utility-button" type="button" data-save-inventory-part="${escapeHtml(row.id)}">Save</button>`
                : `<button class="utility-button" type="button" data-edit-pricebook-item="${escapeHtml(row.id)}">Edit</button>`}
            </span>
          </div>
        `;
      }).join("")}
    `
    : `<div class="empty-state compact-empty"><strong>No inventory yet</strong><span>Save logged parts to the pricebook or add material items with cost, supplier, and on-hand details.</span></div>`;
}

function renderFollowups() {
  const items = followupQueueItems();
  const groups = groupFollowupsByReason(items);
  const reasonOrder = ["customer_reply", "unpaid_invoice", "approved_estimate", "ready_to_invoice", "equipment_maintenance", "scheduling", "stale_estimate", "field_work", "upcoming_visit"];
  const urgent = items.filter((item) => item.priority === "urgent").length;
  const money = items.filter((item) => item.priority === "money").length;
  const scheduling = items.filter((item) => item.priority === "scheduling").length;
  elements.followupList.innerHTML = items.length
    ? `
      <div class="followup-summary">
        <div><span>Queue</span><strong>${items.length}</strong></div>
        <div><span>Urgent</span><strong>${urgent}</strong></div>
        <div><span>Money</span><strong>${money}</strong></div>
        <div><span>Scheduling</span><strong>${scheduling}</strong></div>
      </div>
      ${reasonOrder.filter((reason) => groups[reason]?.length).map((reason) => `
        <section class="followup-group">
          <div class="followup-group-header">
            <h3>${escapeHtml(followupReasonLabel(reason))}</h3>
            <span>${groups[reason].length} item${groups[reason].length === 1 ? "" : "s"}</span>
          </div>
          ${groups[reason].map(renderFollowupRow).join("")}
        </section>
      `).join("")}
    `
    : `<div class="empty-state"><strong>No follow-ups waiting</strong><span>Backline will surface estimates, invoices, bookings, replies, and payment work that need a nudge.</span></div>`;
}

function renderCommunications() {
  const items = allCommunicationItems();
  const replies = items.filter(({ notification }) => notification.type === "customer_reply").length;
  const queued = items.filter(({ notification }) => displayNotificationStatus(notification) === "queued").length;
  const failed = items.filter(({ notification }) => displayNotificationStatus(notification) === "failed").length;
  elements.communicationSummary.textContent = replies || queued || failed
    ? `${replies} unread replies, ${queued} queued reviews, ${failed} failed sends`
    : "No communication work waiting. Sent messages are logged inside each job.";
  elements.communicationList.innerHTML = renderCommunicationRows(items, { allowComplete: true });
}

function renderJobsDatabase() {
  if (!elements.jobsDatabaseList) return;
  const jobs = roleScopedJobs().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  const deleted = can("delete") ? state.deletedJobs.map(ensureDeletedJobDefaults) : [];
  const groups = {
    active: jobs.filter((job) => jobDatabaseGroup(job) === "active"),
    upcoming: jobs.filter((job) => jobDatabaseGroup(job) === "upcoming"),
    completed: jobs.filter((job) => jobDatabaseGroup(job) === "completed"),
    deleted
  };
  const activeFilter = groups[state.jobsDatabaseFilter] ? state.jobsDatabaseFilter : "active";
  const visibleJobs = groups[activeFilter] || [];
  const showingDeleted = activeFilter === "deleted";

  elements.jobsDatabaseSummary.innerHTML = [
    ["active", "Active", groups.active.length],
    ["upcoming", "Upcoming", groups.upcoming.length],
    ["completed", "Completed", groups.completed.length],
    ...(can("delete") ? [["deleted", "Deleted", groups.deleted.length]] : [])
  ].map(([filter, label, value]) => `
    <button class="metric-block jobs-filter-card ${activeFilter === filter ? "active" : ""}" type="button" data-jobs-filter="${filter}">
      <span>${label}</span>
      <strong>${value}</strong>
    </button>
  `).join("");

  elements.jobsDatabaseList.closest(".database-section").querySelector("h3").textContent = `${jobDatabaseGroupLabel(activeFilter)} jobs`;
  elements.deletedJobsList.closest(".database-section").hidden = !showingDeleted;

  elements.jobsDatabaseList.innerHTML = !showingDeleted && visibleJobs.length
    ? visibleJobs.map((job) => `
      <button class="database-row" type="button" data-db-job-id="${escapeHtml(job.id)}">
        <span>
          <strong>${escapeHtml(job.name)}</strong>
          <small>${escapeHtml(job.issue)}</small>
        </span>
        <span class="pill ${escapeHtml(job.status)}">${escapeHtml(statusLabel(job.status))}</span>
        <span>${escapeHtml(jobDatabaseGroupLabel(jobDatabaseGroup(job)))}</span>
        <span>${escapeHtml(scheduleText(job))}</span>
        <em>${escapeHtml(technicianDisplayName(job.technician))}</em>
      </button>
    `).join("")
    : showingDeleted
      ? ""
      : `<div class="empty-state compact-empty"><strong>No ${jobDatabaseGroupLabel(activeFilter).toLowerCase()} jobs</strong><span>Jobs in this group will appear here.</span></div>`;

  elements.deletedJobsList.innerHTML = deleted.length
    ? deleted.map((record) => `
      <div class="database-row deleted">
        <span>
          <strong>${escapeHtml(record.job.name || "Deleted job")}</strong>
          <small>${escapeHtml(record.job.issue || "No issue recorded")}</small>
        </span>
        <span class="pill invoiced">Deleted</span>
        <span>${escapeHtml(new Date(record.deletedAt).toLocaleDateString())}</span>
        <span>${escapeHtml(usernameFromIdentity(record.deletedBy))}</span>
        ${can("delete") ? `<button class="utility-button" type="button" data-restore-job="${escapeHtml(record.id)}">Restore</button>` : ""}
      </div>
    `).join("")
    : `<div class="empty-state compact-empty"><strong>No deleted jobs</strong><span>Deleted jobs will be archived here from now on.</span></div>`;
}

function activityTypeLabel(type) {
  const labels = {
    created: "Created",
    updated: "Updated",
    schedule: "Schedule",
    status: "Status",
    role: "Permissions",
    deleted: "Deleted",
    restored: "Restored"
  };
  return labels[type] || "Activity";
}

function activityEventType(event = {}) {
  return simplifyActivityEvent(event).type;
}

function isPermissionAuditEvent(event = {}) {
  if (activityEventType(event) === "role") return true;
  return (event.changes || []).some((change) => String(change.field || "").startsWith("role"));
}

function renderPermissionAuditPanel(events = []) {
  if (!elements.permissionAuditPanel) return;
  const canAudit = canManageTeamRole();
  elements.permissionAuditPanel.hidden = !canAudit;
  if (!canAudit) {
    elements.permissionAuditPanel.innerHTML = "";
    return;
  }
  const auditEvents = events.filter(isPermissionAuditEvent);
  const latest = auditEvents[0] ? simplifyActivityEvent(auditEvents[0]) : null;
  elements.permissionAuditPanel.innerHTML = `
    <div>
      <span>Permission audit</span>
      <strong>${escapeHtml(`${auditEvents.length} role change${auditEvents.length === 1 ? "" : "s"}`)}</strong>
      <small>${escapeHtml(latest ? `Latest: ${latest.label} by ${latest.actor?.name || "Backline user"}` : "Role edits and assignments will appear here.")}</small>
    </div>
    <button class="utility-button" type="button" data-activity-filter-role>${state.activityTypeFilter === "role" ? "Showing permissions" : "Show permissions"}</button>
  `;
}

function activityTimeLabel(value) {
  if (!value) return "Unknown time";
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}

function activityDateKey(value) {
  const date = new Date(value || 0);
  if (Number.isNaN(date.getTime())) return "unknown";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function activityDayLabel(key) {
  if (key === "unknown") return "Unknown day";
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function activityDayOptions(events = []) {
  const keys = [...new Set(events.map((event) => activityDateKey(event.createdAt)))];
  return keys.sort((a, b) => {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return b.localeCompare(a);
  });
}

function updateActivityDateFilterOptions(events = []) {
  renderActivityDateFilterPicker(events);
}

function groupActivityEventsByDay(events = []) {
  return events.reduce((groups, event) => {
    const key = activityDateKey(event.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
    return groups;
  }, {});
}

function activityEventById(id) {
  return state.activityEvents.find((event) => event.id === id) || null;
}

function activityRelatedJob(event = {}) {
  const jobId = event.job?.id || "";
  return state.jobs.find((job) => job.id === jobId) || state.deletedJobs.find((job) => job.id === jobId) || null;
}

function activityDetailStat(label, value) {
  const displayValue = value === null || value === undefined || value === "" ? "Not set" : value;
  return `
    <div class="activity-detail-stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(displayValue)}</strong>
    </div>
  `;
}

function renderActivityChangeDetail(change, renderChangeValue) {
  return `
    <div class="activity-detail-change">
      <span>${escapeHtml(change.label)}</span>
      <div>
        <small>Before</small>
        <strong>${escapeHtml(renderChangeValue(change, "before"))}</strong>
      </div>
      <div>
        <small>After</small>
        <strong>${escapeHtml(renderChangeValue(change, "after"))}</strong>
      </div>
    </div>
  `;
}

function renderActivityDetail(eventId) {
  if (!elements.activityDetailContent) return;
  const rawEvent = activityEventById(eventId);
  if (!rawEvent) {
    elements.activityDetailContent.innerHTML = `
      <div class="activity-detail-empty">
        <strong>Activity not found</strong>
        <span>This event may have been cleared or synced from another session.</span>
      </div>
    `;
    return;
  }

  const event = simplifyActivityEvent(rawEvent);
  const job = activityRelatedJob(event);
  const invoice = job ? invoiceRecord(job) : null;
  const balance = job ? invoiceBalance(job) : 0;
  const estimate = job ? latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job) : null;
  const detailChanges = rawEvent.changes || [];
  const permissionAudit = isPermissionAuditEvent(rawEvent) || event.type === "role";
  const renderChangeValue = (change, side) => change.field === "invoice"
    ? compactInvoiceActivityValue(change[side])
    : change[side];

  elements.activityDetailContent.innerHTML = `
    <div class="activity-detail-header">
      <div>
        <p class="eyebrow">Activity detail</p>
        <h2>${escapeHtml(event.label)}</h2>
        <p>${escapeHtml(event.detail || event.job?.issue || "No extra detail recorded")}</p>
      </div>
      <span class="pill ${escapeHtml(event.type)}">${escapeHtml(activityTypeLabel(event.type))}</span>
    </div>

    <div class="activity-detail-grid">
      ${activityDetailStat("Changed by", event.actor?.name || "Backline user")}
      ${activityDetailStat("Role", event.actor?.role ? roleName(event.actor.role) : "Team member")}
      ${activityDetailStat("Timestamp", activityTimeLabel(event.createdAt))}
      ${activityDetailStat("Day", activityDayLabel(activityDateKey(event.createdAt)))}
    </div>

    ${permissionAudit ? `
      <section class="activity-detail-section permission-detail-section">
        <div class="section-heading">
          <div>
            <h3>Permission audit</h3>
            <p>This event changed role access, role details, or a team member assignment.</p>
          </div>
        </div>
        <div class="activity-detail-grid">
          ${activityDetailStat("Event", activityTypeLabel(event.type))}
          ${activityDetailStat("Changed by", event.actor?.name || "Backline user")}
          ${activityDetailStat("Actor role", event.actor?.role ? roleName(event.actor.role) : "Team member")}
          ${activityDetailStat("Recorded", activityTimeLabel(event.createdAt))}
        </div>
      </section>
    ` : `
    <section class="activity-detail-section">
      <div class="section-heading">
        <div>
          <h3>Job affected</h3>
          <p>${escapeHtml(job ? "Current job context from Backline." : "The related job is not active or was not attached.")}</p>
        </div>
        ${job?.id && state.jobs.some((item) => item.id === job.id)
          ? `<button class="utility-button" type="button" data-activity-job-id="${escapeHtml(job.id)}">Open job</button>`
          : ""}
      </div>
      <div class="activity-detail-grid">
        ${activityDetailStat("Customer", event.job?.customerName || job?.name || "Not recorded")}
        ${activityDetailStat("Job status", job ? statusLabel(job.status) : event.job?.status || "Not recorded")}
        ${activityDetailStat("Issue", event.job?.issue || job?.issue || "Not recorded")}
        ${activityDetailStat("Schedule", job ? scheduleText(job, { includeYear: true }) : "Not recorded")}
      </div>
    </section>
    `}

    ${job && !permissionAudit ? `
      <section class="activity-detail-section">
        <div class="section-heading">
          <div>
            <h3>Money context</h3>
            <p>Useful billing state at the time you are reviewing this event.</p>
          </div>
        </div>
        <div class="activity-detail-grid">
          ${activityDetailStat("Invoice total", formatMoney(invoice.amount))}
          ${activityDetailStat("Collected", formatMoney(invoiceCollectedAmount(invoice)))}
          ${activityDetailStat("Balance", formatMoney(balance))}
          ${activityDetailStat("Latest estimate", estimate?.amount ? formatMoney(estimate.amount) : "No estimate")}
        </div>
      </section>
    ` : ""}

    <section class="activity-detail-section">
      <div class="section-heading">
        <div>
          <h3>What changed</h3>
          <p>${escapeHtml(detailChanges.length ? `${detailChanges.length} tracked field${detailChanges.length === 1 ? "" : "s"}` : "No field-level changes were stored for this event.")}</p>
        </div>
      </div>
      <div class="activity-detail-changes">
        ${detailChanges.length
          ? detailChanges.map((change) => renderActivityChangeDetail(change, renderChangeValue)).join("")
          : `<div class="empty-note">${permissionAudit ? "This older permission event was recorded before field-level role details were stored." : "This activity was recorded as a single action, not a before/after field change."}</div>`}
      </div>
    </section>
  `;
}

function openActivityDetail(eventId) {
  if (!elements.activityDetailModal) return;
  state.selectedActivityId = eventId;
  renderActivityDetail(eventId);
  elements.activityDetailModal.showModal();
}

function renderActivityRow(rawEvent, renderChangeValue) {
  const event = simplifyActivityEvent(rawEvent);
  return `
    <article class="activity-row" role="button" tabindex="0" data-activity-id="${escapeHtml(event.id)}" aria-label="View activity detail for ${escapeHtml(event.label)}">
      <div>
        <span class="pill ${escapeHtml(event.type)}">${escapeHtml(activityTypeLabel(event.type))}</span>
        <strong>${escapeHtml(event.label)}</strong>
        <small>${escapeHtml(event.detail || event.job?.issue || "No extra detail recorded")}</small>
        ${event.changes?.length ? `
          <div class="activity-changes">
            ${event.changes.slice(0, 4).map((change) => `
              <span><b>${escapeHtml(change.label)}</b>: ${escapeHtml(renderChangeValue(change, "before"))} -> ${escapeHtml(renderChangeValue(change, "after"))}</span>
            `).join("")}
          </div>
        ` : ""}
      </div>
      <div class="activity-meta">
        <b>${escapeHtml(event.actor?.name || "Backline user")}</b>
        <span>${escapeHtml(event.actor?.role ? roleName(event.actor.role) : "Team member")}</span>
        <time>${escapeHtml(activityTimeLabel(event.createdAt))}</time>
        ${event.job?.id && state.jobs.some((job) => job.id === event.job.id)
          ? `<button class="utility-button" type="button" data-activity-job-id="${escapeHtml(event.job.id)}">Open job</button>`
          : ""}
      </div>
    </article>
  `;
}

function renderActivity() {
  if (!elements.activityList) return;
  const typeFilter = elements.activityTypeFilter?.querySelector("input[name='activityTypeFilter']")?.value || state.activityTypeFilter || "all";
  const dateFilter = elements.activityDateFilter?.querySelector("input[name='activityDateFilter']")?.value || state.activityDateFilter || "all";
  state.activityTypeFilter = typeFilter;
  state.activityDateFilter = dateFilter;
  const sortedEvents = [...state.activityEvents]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  updateActivityDateFilterOptions(sortedEvents);
  renderActivityTypeFilterPicker();
  renderPermissionAuditPanel(sortedEvents);
  const events = sortedEvents
    .filter((event) => typeFilter === "all" || activityEventType(event) === typeFilter)
    .filter((event) => state.activityDateFilter === "all" || activityDateKey(event.createdAt) === state.activityDateFilter)
    .slice(0, 200);
  const total = state.activityEvents.length;
  const dayText = state.activityDateFilter === "all" ? "all days" : activityDayLabel(state.activityDateFilter);
  const filteredText = typeFilter === "all" && state.activityDateFilter === "all"
    ? `${total} total change${total === 1 ? "" : "s"}`
    : `${events.length} ${typeFilter === "all" ? "" : `${activityTypeLabel(typeFilter).toLowerCase()} `}change${events.length === 1 ? "" : "s"} on ${dayText}`;
  elements.activitySummary.textContent = `${filteredText} recorded across Backline`;
  const renderChangeValue = (change, side) => change.field === "invoice"
    ? compactInvoiceActivityValue(change[side])
    : change[side];
  const grouped = groupActivityEventsByDay(events);
  const dayKeys = Object.keys(grouped).sort((a, b) => {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return b.localeCompare(a);
  });
  elements.activityList.innerHTML = events.length
    ? dayKeys.map((key) => `
      <section class="activity-day-group">
        <div class="activity-day-header">
          <h3>${escapeHtml(activityDayLabel(key))}</h3>
          <span>${grouped[key].length} change${grouped[key].length === 1 ? "" : "s"}</span>
        </div>
        ${grouped[key].map((event) => renderActivityRow(event, renderChangeValue)).join("")}
      </section>
    `).join("")
    : `<div class="empty-state compact-empty"><strong>No activity found</strong><span>Changes will appear here as your team works in Backline.</span></div>`;
}

function creatorDiagnosticCard(label, value, detail = "", tone = "ready") {
  return `
    <article class="creator-card ${tone}">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
      ${detail ? `<p>${escapeHtml(detail)}</p>` : ""}
    </article>
  `;
}

function creatorHealthSection(title, subtitle, content) {
  return `
    <section class="creator-health-section">
      <div class="creator-health-heading">
        <h3>${escapeHtml(title)}</h3>
        ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
      </div>
      ${content}
    </section>
  `;
}

function creatorReadinessRow(label, status, detail = "", tone = "ready") {
  return `
    <article class="creator-readiness-row ${tone}">
      <div>
        <strong>${escapeHtml(label)}</strong>
        ${detail ? `<span>${escapeHtml(detail)}</span>` : ""}
      </div>
      <em>${escapeHtml(status)}</em>
    </article>
  `;
}

function creatorLatestActivityLabel() {
  const latest = [...state.activityEvents]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];
  return latest?.createdAt ? activityTimeLabel(latest.createdAt) : "No activity yet";
}

function creatorReleaseNote(label, detail, tone = "") {
  return `
    <article class="creator-release-note ${tone}">
      <strong>${escapeHtml(label)}</strong>
      <span>${escapeHtml(detail)}</span>
    </article>
  `;
}

function betaReadinessStatusLabel(status = "open") {
  return betaReadinessStatuses[status] || betaReadinessStatuses.open;
}

function betaReadinessCounts(readiness = companySettings().betaReadiness) {
  return betaReadinessChecklist.reduce((counts, item) => {
    const status = readiness?.[item.key]?.status || "open";
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, { open: 0, passed: 0, needs_work: 0 });
}

function betaReadinessProgress(counts = betaReadinessCounts()) {
  const total = betaReadinessChecklist.length || 1;
  return Math.round(((counts.passed || 0) / total) * 100);
}

function betaReadinessSortRank(status = "open") {
  return { needs_work: 0, open: 1, passed: 2 }[status] ?? 1;
}

function betaReadinessMeta(record = {}) {
  if (!record.updatedAt) return "Not updated yet";
  const actor = record.updatedBy || "Backline";
  return `${actor} - ${activityTimeLabel(record.updatedAt)}`;
}

function productionReadinessStatusLabel(status = "open") {
  return productionReadinessStatuses[status] || productionReadinessStatuses.open;
}

function productionReadinessCounts(readiness = companySettings().productionReadiness) {
  return productionReadinessChecklist.reduce((counts, item) => {
    const status = readiness?.[item.key]?.status || "open";
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, { open: 0, ready: 0, needs_work: 0 });
}

function productionReadinessProgress(counts = productionReadinessCounts()) {
  const total = productionReadinessChecklist.length || 1;
  return Math.round(((counts.ready || 0) / total) * 100);
}

function productionReadinessSortRank(status = "open") {
  return { needs_work: 0, open: 1, ready: 2 }[status] ?? 1;
}

function productionReadinessMeta(record = {}) {
  if (!record.updatedAt) return "Not updated yet";
  const actor = record.updatedBy || "Backline";
  return `${actor} - ${activityTimeLabel(record.updatedAt)}`;
}

function supabaseProductionSetupCounts(readiness = companySettings().supabaseProductionSetup) {
  return supabaseProductionSetupChecklist.reduce((counts, item) => {
    const status = readiness?.[item.key]?.status || "open";
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, { open: 0, ready: 0, needs_work: 0 });
}

function supabaseProductionSetupProgress(counts = supabaseProductionSetupCounts()) {
  const total = supabaseProductionSetupChecklist.length || 1;
  return Math.round(((counts.ready || 0) / total) * 100);
}

function supabaseProductionSetupText() {
  const setup = normalizeSupabaseProductionSetup(companySettings().supabaseProductionSetup);
  const counts = supabaseProductionSetupCounts(setup);
  const progress = supabaseProductionSetupProgress(counts);
  const line = (item) => {
    const record = setup[item.key] || { status: "open", note: "" };
    return `- ${item.label}: ${productionReadinessStatusLabel(record.status)}${record.note ? ` - ${record.note}` : ""}`;
  };
  return [
    "Backline Supabase Production Setup",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    `Environment: ${deploymentEnvironmentLabel()}`,
    `Origin: ${location.protocol}//${location.host || "local file"}`,
    `Setup progress: ${progress}% (${counts.ready} ready, ${counts.needs_work} needs work, ${counts.open} open)`,
    "",
    "Checklist:",
    ...supabaseProductionSetupChecklist.map(line),
    "",
    "Run order:",
    "1. Create fresh production Supabase project.",
    "2. Run supabase-schema.sql, or split files through supabase-schema-19-platform-admins.sql.",
    "3. If team schema step 07 fails, run 07a, 07b, and 07c instead.",
    "4. Add Foundry operator to platform_admins after their auth account exists.",
    "5. Configure Auth Site URL and Redirect URLs to the hosted Backline HTTPS URL.",
    "6. Deploy send-team-invite and set RESEND_API_KEY plus INVITE_FROM_EMAIL.",
    "7. Set BACKLINE_SUPABASE_URL and BACKLINE_SUPABASE_ANON_KEY for GitHub Pages.",
    "8. Open hosted Backline and run Settings -> Test secure connection."
  ].join("\n");
}

function foundryBetaTestStatusLabel(status = "not_run") {
  return foundryBetaTestStatuses[status] || foundryBetaTestStatuses.not_run;
}

function foundryBetaTestCounts(results = companySettings().foundryTestResults) {
  return foundryBetaTestScripts.reduce((counts, script) => {
    const status = results[script.key]?.status || "not_run";
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, { not_run: 0, passed: 0, needs_work: 0 });
}

function foundryBetaTestProgress(counts = foundryBetaTestCounts()) {
  const total = foundryBetaTestScripts.length || 1;
  return Math.round(((counts.passed || 0) / total) * 100);
}

function foundryBetaTestMeta(record = {}) {
  if (!record.updatedAt) return "Not run yet";
  const actor = record.updatedBy || "Backline";
  return `${actor} - ${activityTimeLabel(record.updatedAt)}`;
}

function foundryLaunchDecision() {
  const settings = companySettings();
  const betaReadiness = normalizeBetaReadiness(settings.betaReadiness);
  const productionReadiness = normalizeProductionReadiness(settings.productionReadiness);
  const supabaseSetup = normalizeSupabaseProductionSetup(settings.supabaseProductionSetup);
  const testResults = normalizeFoundryTestResults(settings.foundryTestResults);
  const betaCounts = betaReadinessCounts(betaReadiness);
  const productionCounts = productionReadinessCounts(productionReadiness);
  const setupCounts = supabaseProductionSetupCounts(supabaseSetup);
  const testCounts = foundryBetaTestCounts(testResults);
  const healthCounts = foundryLiveHealthCounts();
  const blockers = [];
  const warnings = [];

  if (setupCounts.needs_work) blockers.push(`${setupCounts.needs_work} Supabase setup check${setupCounts.needs_work === 1 ? "" : "s"} need work`);
  if (productionCounts.needs_work) blockers.push(`${productionCounts.needs_work} production launch check${productionCounts.needs_work === 1 ? "" : "s"} need work`);
  if (betaCounts.needs_work) blockers.push(`${betaCounts.needs_work} beta readiness check${betaCounts.needs_work === 1 ? "" : "s"} need work`);
  if (testCounts.needs_work) blockers.push(`${testCounts.needs_work} persona script${testCounts.needs_work === 1 ? "" : "s"} need work`);
  if (healthCounts.warning) blockers.push(`${healthCounts.warning} live health check${healthCounts.warning === 1 ? "" : "s"} need review`);
  if (setupCounts.open) warnings.push(`${setupCounts.open} Supabase setup check${setupCounts.open === 1 ? "" : "s"} still open`);
  if (productionCounts.open) warnings.push(`${productionCounts.open} production launch check${productionCounts.open === 1 ? "" : "s"} still open`);
  if (betaCounts.open) warnings.push(`${betaCounts.open} beta readiness check${betaCounts.open === 1 ? "" : "s"} still open`);
  if (testCounts.not_run) warnings.push(`${testCounts.not_run} persona script${testCounts.not_run === 1 ? "" : "s"} not run`);

  if (blockers.length) {
    return {
      status: "blocked",
      label: "Blocked",
      headline: "Do not invite outside beta users yet",
      detail: "Critical launch or beta checks still need attention.",
      blockers,
      warnings
    };
  }
  if (warnings.length) {
    return {
      status: "hold",
      label: "Hold",
      headline: "Close the remaining checks before a wider beta",
      detail: "Nothing is marked as failing, but the launch record is not complete.",
      blockers,
      warnings
    };
  }
  return {
    status: "go",
    label: "Go",
    headline: "Ready for a controlled beta invite",
    detail: "Supabase setup, production readiness, beta checklist, persona scripts, and live health checks are all clear.",
    blockers,
    warnings
  };
}

function foundryLaunchDecisionText() {
  const decision = foundryLaunchDecision();
  return [
    "Backline Foundry Go/No-Go Summary",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    `Decision: ${decision.label}`,
    `Headline: ${decision.headline}`,
    `Detail: ${decision.detail}`,
    `Environment: ${deploymentEnvironmentLabel()}`,
    `Workspace: ${state.organizationId || "No workspace loaded"}`,
    "",
    "Blockers:",
    ...(decision.blockers.length ? decision.blockers.map((item) => `- ${item}`) : ["- None"]),
    "",
    "Open warnings:",
    ...(decision.warnings.length ? decision.warnings.map((item) => `- ${item}`) : ["- None"]),
    "",
    "Next step:",
    decision.status === "go"
      ? "- Invite a small controlled beta group and save a fresh Foundry snapshot."
      : decision.status === "hold"
        ? "- Finish open checks, rerun scripts, then copy a fresh Go/No-Go summary."
        : "- Fix blockers first, then rerun health checks and affected scripts."
  ].join("\n");
}

async function copyFoundryLaunchDecision() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryLaunchDecisionText(), "Go/No-Go copied", "Foundry launch decision is on your clipboard.", "foundry-go-no-go");
}

function foundryPilotInviteText() {
  const decision = foundryLaunchDecision();
  return [
    "Subject: Early Backline beta invite",
    "",
    "Hi there,",
    "",
    "We are opening a small early beta for Backline, an AI-assisted back office for small trade businesses.",
    "",
    "Backline is built to help shops recover missed calls, book jobs, send estimates, collect payments, manage field work, and keep customer updates in one place.",
    "",
    "What we are looking for:",
    "- A small HVAC, plumbing, electrical, roofing, junk removal, or field-service shop",
    "- Someone willing to run real jobs through the product and tell us what feels useful, confusing, or missing",
    "- Feedback on mobile use, scheduling, customer messaging, estimates, invoices, and team permissions",
    "",
    "What to expect:",
    "- We will help you set up the workspace",
    "- You can test with sample jobs or real jobs",
    "- We want honest feedback more than perfect usage",
    "- Early beta features may still change as we polish the product",
    "",
    "If you want to try it, reply with your shop name, trade, number of technicians, and the biggest admin problem you want Backline to solve.",
    "",
    "Thanks,",
    "Backline",
    "",
    "Internal Foundry note:",
    `Current Go/No-Go decision: ${decision.label} - ${decision.headline}`
  ].join("\n");
}

function foundryPilotOnboardingText() {
  return [
    "Backline Pilot Onboarding Checklist",
    "",
    "Before the first session:",
    "1. Confirm the shop owner email and business name.",
    "2. Confirm trade, service area, timezone, shop phone, and support email.",
    "3. Ask whether they want to test with sample jobs or real jobs.",
    "4. Confirm at least one technician or dispatcher account if they have a team.",
    "",
    "During setup:",
    "1. Create the owner account and send the first invite.",
    "2. Complete Workspace settings, including slogan, support contact, invoice terms, approval wording, and default deposit.",
    "3. Add one job template that matches their common service call.",
    "4. Add one pricebook item and one supplier or material if relevant.",
    "5. Create one test job and walk through schedule, portal update, estimate, approval, invoice, and payment recording.",
    "",
    "Pilot success signals:",
    "- Owner understands what needs attention from Home",
    "- Technician can find and complete assigned work on phone",
    "- Customer portal link opens and replies reach Backline",
    "- Estimate approval works once and creates a clean invoice path",
    "- Activity log explains who changed what",
    "- The shop can name at least one admin task Backline clearly reduced",
    "",
    "Feedback questions:",
    "- What felt immediately useful?",
    "- What felt confusing or too much?",
    "- What would stop you from using this on real jobs?",
    "- What should Backline do automatically that it does not do yet?",
    "- What would make this worth paying for?"
  ].join("\n");
}

function foundryPilotFeedbackRecapText() {
  return [
    "Backline Pilot Feedback Recap",
    `Date: ${new Date().toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}`,
    `Workspace: ${state.organizationId || "No workspace loaded"}`,
    `Operator: ${accountDisplayName()}`,
    "",
    "Pilot shop:",
    "- Shop name:",
    "- Trade:",
    "- Team size:",
    "- Region:",
    "- Tested with sample jobs or real jobs:",
    "",
    "What happened:",
    "- Workflows tested:",
    "- Device/browser used:",
    "- Roles tested:",
    "- Customer portal tested:",
    "- Approval/payment flow tested:",
    "",
    "Feedback:",
    "- What felt immediately useful:",
    "- What felt confusing:",
    "- What felt missing:",
    "- What slowed them down:",
    "- What they expected Backline to do automatically:",
    "",
    "Signals:",
    "- Would they use this again next week:",
    "- Would they invite a technician or dispatcher:",
    "- Would they pay for it eventually:",
    "- Biggest reason they would not continue:",
    "",
    "Next action:",
    "- Follow-up owner:",
    "- Product change needed:",
    "- Bug to file:",
    "- Date to check back:"
  ].join("\n");
}

function foundryPilotBugReportText() {
  return [
    "Backline Pilot Bug Report",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    `Build: ${currentAppVersionLabel()}`,
    `Environment: ${deploymentEnvironmentLabel()}`,
    `Workspace: ${state.organizationId || "No workspace loaded"}`,
    "",
    "Bug title:",
    "",
    "Severity:",
    "- Blocker / High / Medium / Low",
    "",
    "Who hit it:",
    "- Role:",
    "- Account:",
    "- Device/browser:",
    "",
    "Steps to reproduce:",
    "1.",
    "2.",
    "3.",
    "",
    "Expected result:",
    "",
    "Actual result:",
    "",
    "Business impact:",
    "- Lost job risk:",
    "- Billing risk:",
    "- Customer confusion:",
    "- Internal workflow delay:",
    "",
    "Evidence:",
    "- Screenshot/video:",
    "- Job/customer:",
    "- Activity event:",
    "- Console error:"
  ].join("\n");
}

function foundryPilotFeatureRequestText() {
  return [
    "Backline Pilot Feature Request",
    `Generated: ${new Date().toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}`,
    `Workspace: ${state.organizationId || "No workspace loaded"}`,
    "",
    "Request:",
    "",
    "Who asked:",
    "- Shop:",
    "- Role:",
    "- Trade:",
    "",
    "Problem behind the request:",
    "",
    "Current workaround:",
    "",
    "How often this happens:",
    "- Daily / Weekly / Monthly / Rare",
    "",
    "Value if solved:",
    "- Saves admin time",
    "- Books more work",
    "- Collects money faster",
    "- Reduces mistakes",
    "- Improves customer experience",
    "- Helps manage technicians",
    "",
    "Priority score:",
    "- Frequency 1-5:",
    "- Pain 1-5:",
    "- Revenue impact 1-5:",
    "- Build complexity 1-5:",
    "",
    "Decision:",
    "- Now / Later / No / Needs more evidence",
    "",
    "Notes:"
  ].join("\n");
}

function foundryPilotOutcomeScorecardText() {
  return [
    "Backline Pilot Outcome Scorecard",
    `Generated: ${new Date().toLocaleDateString([], { month: "long", day: "numeric", year: "numeric" })}`,
    `Workspace: ${state.organizationId || "No workspace loaded"}`,
    `Build: ${currentAppVersionLabel()}`,
    "",
    "Pilot shop:",
    "- Shop name:",
    "- Trade:",
    "- Team size:",
    "- Tested period:",
    "- Primary tester:",
    "",
    "Score each area 1-5:",
    "- Clear pain fit:",
    "- Setup completed without heavy support:",
    "- Owner understood daily value:",
    "- Technician/mobile workflow worked:",
    "- Customer-facing portal/approval made sense:",
    "- Estimate/invoice/payment flow matched real work:",
    "- Role permissions matched team needs:",
    "- Willingness to keep using Backline:",
    "- Willingness to pay later:",
    "- Referral/reference potential:",
    "",
    "Evidence:",
    "- Jobs created:",
    "- Customer messages/replies:",
    "- Estimates sent/approved:",
    "- Payments recorded:",
    "- Files/photos uploaded:",
    "- Bugs found:",
    "- Feature requests:",
    "",
    "Decision:",
    "- Graduate to active beta",
    "- Continue pilot with follow-up",
    "- Fix blockers before continuing",
    "- Not a fit right now",
    "",
    "Reason for decision:",
    "",
    "Next step:",
    "- Owner:",
    "- Due date:",
    "- Follow-up message:"
  ].join("\n");
}

function foundryPilotPricingInterviewText() {
  return [
    "Backline Pilot Pricing Interview",
    "",
    "Context:",
    "- Shop name:",
    "- Trade:",
    "- Team size:",
    "- Current tools/software:",
    "- Current monthly software spend:",
    "",
    "Value questions:",
    "1. What admin work did Backline clearly reduce?",
    "2. Did it help you respond faster to customers?",
    "3. Did it help you send estimates or collect money faster?",
    "4. Would you trust your technician or dispatcher to use it without you watching?",
    "5. What would make this a must-have instead of nice-to-have?",
    "",
    "Pricing questions:",
    "1. If Backline saved you a few hours per week, what would feel fair monthly?",
    "2. Would you prefer simple monthly pricing or per-user pricing?",
    "3. Which add-ons would you pay extra for: AI receptionist, SMS, payments, financing, inventory, reporting?",
    "4. What price would make you say yes immediately?",
    "5. What price would make you pause?",
    "6. What would make you cancel after the first month?",
    "",
    "Packaging notes:",
    "- Solo:",
    "- Crew:",
    "- Growth:",
    "- Usage-based add-ons:",
    "",
    "Takeaway:"
  ].join("\n");
}

async function copyFoundryPilotInvite() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotInviteText(), "Pilot invite copied", "Early beta invite text is on your clipboard.", "foundry-pilot-invite");
}

async function copyFoundryPilotOnboarding() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotOnboardingText(), "Pilot checklist copied", "Pilot onboarding checklist is on your clipboard.", "foundry-pilot-onboarding");
}

async function copyFoundryPilotFeedbackRecap() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotFeedbackRecapText(), "Feedback recap copied", "Pilot feedback recap template is on your clipboard.", "foundry-pilot-feedback");
}

async function copyFoundryPilotBugReport() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotBugReportText(), "Bug report copied", "Pilot bug report template is on your clipboard.", "foundry-pilot-bug");
}

async function copyFoundryPilotFeatureRequest() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotFeatureRequestText(), "Feature request copied", "Pilot feature request template is on your clipboard.", "foundry-pilot-feature");
}

async function copyFoundryPilotOutcomeScorecard() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotOutcomeScorecardText(), "Pilot scorecard copied", "Pilot outcome scorecard is on your clipboard.", "foundry-pilot-scorecard");
}

async function copyFoundryPilotPricingInterview() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotPricingInterviewText(), "Pricing interview copied", "Pilot pricing interview is on your clipboard.", "foundry-pilot-pricing");
}

function foundryPilotStatusLabel(status = "prospect") {
  return foundryPilotStatuses[status] || foundryPilotStatuses.prospect;
}

function foundryPilotOutcomeLabel(outcome = "undecided") {
  return foundryPilotOutcomes[outcome] || foundryPilotOutcomes.undecided;
}

function foundryPilotStatusRank(status = "prospect") {
  return {
    testing: 0,
    follow_up: 1,
    onboarding: 2,
    invited: 3,
    prospect: 4,
    graduated: 5,
    not_fit: 6
  }[status] ?? 4;
}

function foundryPilotCounts(records = state.foundryPilotRecords) {
  return records.reduce((counts, record) => {
    counts.total += 1;
    counts[record.status] = (counts[record.status] || 0) + 1;
    counts.outcomes[record.outcome] = (counts.outcomes[record.outcome] || 0) + 1;
    if (record.fitScore >= 70 && !["graduated", "not_fit"].includes(record.status)) counts.strongFit += 1;
    if (foundryPilotDueSoon(record)) {
      counts.due += 1;
    }
    return counts;
  }, {
    total: 0,
    prospect: 0,
    invited: 0,
    onboarding: 0,
    testing: 0,
    follow_up: 0,
    graduated: 0,
    not_fit: 0,
    strongFit: 0,
    due: 0,
    outcomes: { undecided: 0, retained: 0, blocked: 0, churned: 0, willing_to_pay: 0, reference_ready: 0 }
  });
}

function foundryPilotIsActive(record = {}) {
  return !["graduated", "not_fit"].includes(record.status);
}

function foundryPilotDueSoon(record = {}) {
  if (!record.nextFollowUp || !foundryPilotIsActive(record)) return false;
  const tomorrowEnd = new Date();
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);
  tomorrowEnd.setHours(23, 59, 59, 999);
  return new Date(`${record.nextFollowUp}T12:00:00`) <= tomorrowEnd;
}

function foundryPilotSearchText(record = {}) {
  return [
    record.shopName,
    record.trade,
    record.contactName,
    record.contactEmail,
    record.contactPhone,
    record.source,
    record.notes,
    foundryPilotStatusLabel(record.status),
    foundryPilotOutcomeLabel(record.outcome)
  ].join(" ").toLowerCase();
}

function foundryPilotMatchesFilter(record = {}, filter = state.foundryPilotFilter) {
  if (filter === "all") return true;
  if (filter === "active") return foundryPilotIsActive(record);
  if (filter === "due") return foundryPilotDueSoon(record);
  if (filter === "strong") return record.fitScore >= 70 && foundryPilotIsActive(record);
  return record.status === filter;
}

function foundryPilotFilteredRecords(records = state.foundryPilotRecords) {
  const search = String(state.foundryPilotSearch || "").trim().toLowerCase();
  return normalizeFoundryPilotRecords(records)
    .filter((record) => foundryPilotMatchesFilter(record))
    .filter((record) => !search || foundryPilotSearchText(record).includes(search))
    .sort((a, b) => {
      const statusRank = foundryPilotStatusRank(a.status) - foundryPilotStatusRank(b.status);
      if (statusRank) return statusRank;
      const aDue = a.nextFollowUp ? new Date(`${a.nextFollowUp}T12:00:00`).getTime() : Infinity;
      const bDue = b.nextFollowUp ? new Date(`${b.nextFollowUp}T12:00:00`).getTime() : Infinity;
      if (aDue !== bDue) return aDue - bDue;
      return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
    });
}

function foundryPilotDueRecords(records = state.foundryPilotRecords) {
  return normalizeFoundryPilotRecords(records)
    .filter(foundryPilotDueSoon)
    .sort((a, b) => {
      const aDue = a.nextFollowUp ? new Date(`${a.nextFollowUp}T12:00:00`).getTime() : Infinity;
      const bDue = b.nextFollowUp ? new Date(`${b.nextFollowUp}T12:00:00`).getTime() : Infinity;
      if (aDue !== bDue) return aDue - bDue;
      return b.fitScore - a.fitScore;
    });
}

function foundryPilotDecision(records = state.foundryPilotRecords) {
  const normalized = normalizeFoundryPilotRecords(records);
  const counts = foundryPilotCounts(normalized);
  const outcomes = counts.outcomes;
  const buyerSignal = outcomes.willing_to_pay + outcomes.reference_ready;
  const positiveSignal = outcomes.retained + buyerSignal;
  const negativeSignal = outcomes.blocked + outcomes.churned;
  const testedCount = normalized.filter((record) => ["testing", "graduated"].includes(record.status) || record.outcome !== "undecided").length;
  if (counts.total < 3) {
    return {
      status: "build",
      label: "Build pipeline",
      headline: "Add more pilot prospects before deciding.",
      detail: "The signal set is still too small. Recruit enough real shops that one outlier does not steer the product.",
      buyerSignal,
      positiveSignal,
      negativeSignal,
      testedCount
    };
  }
  if (buyerSignal >= 2 || outcomes.reference_ready >= 1) {
    return {
      status: "package",
      label: "Package paid beta",
      headline: "Pilot signal is strong enough to shape an offer.",
      detail: "There is buyer or reference signal. Start testing paid-beta packaging while continuing close support.",
      buyerSignal,
      positiveSignal,
      negativeSignal,
      testedCount
    };
  }
  if (negativeSignal > positiveSignal && negativeSignal >= 2) {
    return {
      status: "diagnose",
      label: "Diagnose blockers",
      headline: "Blockers are outpacing positive signal.",
      detail: "Do not widen the beta yet. Review blocked and churned shops for setup, workflow, or expectation gaps.",
      buyerSignal,
      positiveSignal,
      negativeSignal,
      testedCount
    };
  }
  if (testedCount < 3) {
    return {
      status: "test",
      label: "Keep testing",
      headline: "Move more shops through a real workflow.",
      detail: "The pipeline exists, but not enough shops have produced outcome signal yet. Focus on one complete job cycle.",
      buyerSignal,
      positiveSignal,
      negativeSignal,
      testedCount
    };
  }
  return {
    status: "learn",
    label: "Keep learning",
    headline: "Signal is mixed but useful.",
    detail: "Continue working strong-fit shops and compare retained versus blocked patterns before broadening launch.",
    buyerSignal,
    positiveSignal,
    negativeSignal,
    testedCount
  };
}

function foundryPilotSummaryLine(record = {}) {
  const details = [
    record.trade || "Trade not set",
    record.teamSize ? `${record.teamSize} team member${record.teamSize === 1 ? "" : "s"}` : "Team size not set",
    record.contactName || record.contactEmail || record.contactPhone || "Contact not set"
  ];
  return details.join(" - ");
}

function foundryPilotFollowUpLabel(date = "") {
  if (!date) return "No follow-up date";
  return new Date(`${date}T12:00:00`).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function foundryPilotOutreachText(id = "") {
  const record = state.foundryPilotRecords.find((item) => item.id === id);
  if (!record) return "";
  const firstName = String(record.contactName || "").trim().split(/\s+/)[0] || "there";
  const shop = record.shopName || "your shop";
  const status = record.status;
  const statusLine = status === "testing"
    ? "wanted to check what felt useful, what got in the way, and what would make Backline worth opening again this week"
    : status === "onboarding"
      ? "wanted to help finish setup and get one real job through Backline without slowing your team down"
      : status === "invited"
        ? "wanted to see if you are still open to trying Backline with one real job or customer follow-up"
        : "wanted to follow up on whether Backline could help with missed calls, scheduling, estimates, or payments";
  return [
    `Hi ${firstName}, this is ${accountDisplayName()} with Backline.`,
    "",
    `I was checking in on ${shop} and ${statusLine}.`,
    "",
    "If it helps, we can keep this simple: one job, one customer message, and one quick note on what worked or felt clunky.",
    "",
    record.notes ? `Context from our side: ${record.notes}` : "No pressure if now is not the right week - I just wanted to close the loop cleanly."
  ].join("\n");
}

function foundryPilotBriefText(id = "") {
  const record = state.foundryPilotRecords.find((item) => item.id === id);
  if (!record) return "";
  return [
    "Backline Pilot CRM Brief",
    `Shop: ${record.shopName}`,
    `Status: ${foundryPilotStatusLabel(record.status)}`,
    `Outcome: ${foundryPilotOutcomeLabel(record.outcome)}`,
    `Fit score: ${record.fitScore}/100`,
    `Trade: ${record.trade || "Not set"}`,
    `Team size: ${record.teamSize || "Not set"}`,
    `Contact: ${[record.contactName, record.contactEmail, record.contactPhone].filter(Boolean).join(" / ") || "Not set"}`,
    `Source: ${record.source || "Not set"}`,
    `Next follow-up: ${foundryPilotFollowUpLabel(record.nextFollowUp)}`,
    `Updated: ${record.updatedAt ? activityTimeLabel(record.updatedAt) : "Not updated"}`,
    "",
    "Notes:",
    record.notes || "No notes yet.",
    "",
    "Next action:",
    record.status === "graduated"
      ? "- Move toward paid beta packaging or reference conversation."
      : record.status === "not_fit"
        ? "- Keep notes for segmentation; do not prioritize follow-up unless something changes."
        : record.fitScore >= 70
          ? "- Prioritize follow-up; this looks like a strong beta fit."
          : "- Continue discovery before committing more build time."
  ].join("\n");
}

async function copyFoundryPilotBrief(id = "") {
  if (!state.isCreator) return;
  const text = foundryPilotBriefText(id);
  if (!text) return;
  await copyFoundryText(text, "Pilot brief copied", "Pilot CRM brief is on your clipboard.", "foundry-pilot-brief");
}

async function copyFoundryPilotOutreach(id = "") {
  if (!state.isCreator) return;
  const text = foundryPilotOutreachText(id);
  if (!text) return;
  await copyFoundryText(text, "Pilot outreach copied", "Follow-up message is on your clipboard.", "foundry-pilot-outreach");
}

function markFoundryPilotContacted(id = "") {
  if (!state.isCreator || !id) return;
  const record = state.foundryPilotRecords.find((item) => item.id === id);
  if (!record) return;
  updateFoundryPilotRecord(id, {
    status: ["prospect", "invited"].includes(record.status) ? "follow_up" : record.status,
    lastContactedAt: new Date().toISOString(),
    nextFollowUp: addDaysISO(7)
  });
  showToast("Pilot contacted", `${record.shopName} follow-up moved out one week.`, "success", {
    id: "foundry-pilot-contacted",
    timeout: 2400
  });
}

function foundryPilotPipelineReportText() {
  const records = normalizeFoundryPilotRecords(state.foundryPilotRecords);
  const counts = foundryPilotCounts(records);
  const grouped = Object.keys(foundryPilotStatuses).reduce((groups, status) => {
    groups[status] = records.filter((record) => record.status === status);
    return groups;
  }, {});
  const recordLine = (record) => `- ${record.shopName} (${record.trade || "trade not set"}, ${record.fitScore}/100 fit, ${foundryPilotOutcomeLabel(record.outcome)}, follow-up ${foundryPilotFollowUpLabel(record.nextFollowUp)})`;
  return [
    "Backline Pilot CRM Pipeline Report",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    `Operator: ${accountDisplayName()}`,
    `Workspace context: ${state.organizationId || "Foundry local"}`,
    "",
    `Summary: ${counts.total} tracked, ${counts.testing} testing, ${counts.due} due soon, ${counts.strongFit} strong fit`,
    `Outcomes: ${counts.outcomes.retained} retained, ${counts.outcomes.willing_to_pay} willing to pay, ${counts.outcomes.reference_ready} reference-ready, ${counts.outcomes.blocked} blocked, ${counts.outcomes.churned} churned`,
    "",
    ...Object.entries(foundryPilotStatuses).flatMap(([status, label]) => [
      `${label}: ${grouped[status].length}`,
      ...(grouped[status].length ? grouped[status].map(recordLine) : ["- None"]),
      ""
    ]),
    "Recommended focus:",
    counts.due
      ? "- Work the due follow-ups first."
      : counts.strongFit
        ? "- Move strong-fit shops toward testing, pricing discovery, or graduation."
        : "- Add more qualified pilot prospects before widening beta."
  ].join("\n");
}

function foundryPilotFollowUpQueueText() {
  const activeStatuses = new Set(["prospect", "invited", "onboarding", "testing", "follow_up"]);
  const records = normalizeFoundryPilotRecords(state.foundryPilotRecords)
    .filter((record) => activeStatuses.has(record.status))
    .sort((a, b) => {
      const aDue = a.nextFollowUp ? new Date(`${a.nextFollowUp}T12:00:00`).getTime() : Infinity;
      const bDue = b.nextFollowUp ? new Date(`${b.nextFollowUp}T12:00:00`).getTime() : Infinity;
      if (aDue !== bDue) return aDue - bDue;
      return b.fitScore - a.fitScore;
    });
  return [
    "Backline Pilot Follow-up Queue",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    "",
    ...(records.length ? records.map((record, index) => [
      `${index + 1}. ${record.shopName}`,
      `   Status: ${foundryPilotStatusLabel(record.status)}`,
      `   Outcome: ${foundryPilotOutcomeLabel(record.outcome)}`,
      `   Fit: ${record.fitScore}/100`,
      `   Follow-up: ${foundryPilotFollowUpLabel(record.nextFollowUp)}`,
      `   Contact: ${[record.contactName, record.contactEmail, record.contactPhone].filter(Boolean).join(" / ") || "Not set"}`,
      `   Note: ${record.notes || "No notes yet."}`
    ].join("\n")) : ["No active pilot follow-ups are currently tracked."]),
    "",
    "Follow-up prompt:",
    "Ask what they tried since the last touch, what slowed them down, what felt valuable, and what would make Backline worth using again next week."
  ].join("\n\n");
}

async function copyFoundryPilotPipelineReport() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotPipelineReportText(), "Pipeline report copied", "Pilot CRM pipeline report is on your clipboard.", "foundry-pilot-report");
}

async function copyFoundryPilotFollowUpQueue() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotFollowUpQueueText(), "Follow-up queue copied", "Pilot follow-up queue is on your clipboard.", "foundry-pilot-followups");
}

function foundryPilotDecisionText() {
  const records = normalizeFoundryPilotRecords(state.foundryPilotRecords);
  const counts = foundryPilotCounts(records);
  const decision = foundryPilotDecision(records);
  return [
    "Backline Pilot Decision Readout",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    `Operator: ${accountDisplayName()}`,
    "",
    `Recommendation: ${decision.label}`,
    decision.headline,
    decision.detail,
    "",
    "Signal:",
    `- ${counts.total} shops tracked`,
    `- ${decision.testedCount} shops with test/outcome signal`,
    `- ${decision.buyerSignal} buyer-signal outcomes`,
    `- ${decision.positiveSignal} positive outcomes`,
    `- ${decision.negativeSignal} blocker/churn outcomes`,
    "",
    "Outcome mix:",
    `- Retained: ${counts.outcomes.retained}`,
    `- Willing to pay: ${counts.outcomes.willing_to_pay}`,
    `- Reference-ready: ${counts.outcomes.reference_ready}`,
    `- Blocked: ${counts.outcomes.blocked}`,
    `- Churned: ${counts.outcomes.churned}`,
    `- Undecided: ${counts.outcomes.undecided}`,
    "",
    "Next operating move:",
    decision.status === "package"
      ? "- Draft the paid-beta offer and test price sensitivity with strongest pilot shops."
      : decision.status === "diagnose"
        ? "- Review blocked/churned notes and fix the highest-friction workflow before recruiting more shops."
        : decision.status === "build"
          ? "- Add more qualified shops before making product or pricing decisions."
          : "- Move active shops through one complete job, estimate, payment, and customer-message cycle."
  ].join("\n");
}

async function copyFoundryPilotDecision() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryPilotDecisionText(), "Pilot decision copied", "Pilot decision readout is on your clipboard.", "foundry-pilot-decision");
}

function createFoundryPilotRecord(form) {
  if (!state.isCreator || !form) return;
  const data = new FormData(form);
  const record = normalizeFoundryPilotRecord({
    shopName: data.get("shopName"),
    trade: data.get("trade"),
    teamSize: data.get("teamSize"),
    contactName: data.get("contactName"),
    contactEmail: data.get("contactEmail"),
    contactPhone: data.get("contactPhone"),
    source: data.get("source"),
    notes: data.get("notes"),
    status: "prospect",
    fitScore: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  });
  if (!record) {
    showToast("Shop name required", "Add a shop name before saving a pilot record.", "warning", {
      id: "foundry-pilot-required",
      timeout: 3200
    });
    return;
  }
  state.foundryPilotRecords = normalizeFoundryPilotRecords([record, ...state.foundryPilotRecords]);
  saveFoundryPilotRecords();
  form.reset();
  showToast("Pilot shop added", `${record.shopName} is now in Foundry Pilot CRM.`, "success", {
    id: "foundry-pilot-added",
    timeout: 2800
  });
  render();
}

function updateFoundryPilotRecord(id = "", patch = {}) {
  if (!state.isCreator || !id) return;
  state.foundryPilotRecords = normalizeFoundryPilotRecords(state.foundryPilotRecords.map((record) => (
    record.id === id
      ? {
          ...record,
          ...patch,
          updatedAt: new Date().toISOString(),
          updatedBy: accountDisplayName()
        }
      : record
  )));
  saveFoundryPilotRecords();
  render();
}

function renderFoundryPilotFollowUpPanel(records = state.foundryPilotRecords) {
  const dueRecords = foundryPilotDueRecords(records).slice(0, 4);
  return `
    <section class="creator-pilot-followups" aria-label="Pilot follow-up workspace">
      <div>
        <span>Today</span>
        <strong>${dueRecords.length ? `${dueRecords.length} pilot follow-up${dueRecords.length === 1 ? "" : "s"} due` : "No pilot follow-ups due"}</strong>
        <p>${dueRecords.length ? "Work these before adding more prospects." : "The pilot queue is clear for today."}</p>
      </div>
      <div class="creator-pilot-followup-list">
        ${dueRecords.length ? dueRecords.map((record) => `
          <article class="creator-pilot-followup-card">
            <div>
              <strong>${escapeHtml(record.shopName)}</strong>
              <span>${escapeHtml(`${foundryPilotStatusLabel(record.status)} - ${record.fitScore}/100 fit - ${foundryPilotFollowUpLabel(record.nextFollowUp)}`)}</span>
            </div>
            <button class="secondary-button" type="button" data-foundry-pilot-outreach="${escapeHtml(record.id)}">Copy outreach</button>
            <button class="secondary-button" type="button" data-foundry-pilot-contacted="${escapeHtml(record.id)}">Mark contacted</button>
          </article>
        `).join("") : `<article class="creator-pilot-followup-card empty"><strong>Queue clear</strong><span>No due active pilots. Strong-fit shops still show in the CRM below.</span></article>`}
      </div>
    </section>
  `;
}

function renderFoundryPilotDecisionPanel(records = state.foundryPilotRecords) {
  const decision = foundryPilotDecision(records);
  return `
    <section class="creator-pilot-decision ${escapeHtml(decision.status)}" aria-label="Pilot decision readout">
      <div>
        <span>${escapeHtml(decision.label)}</span>
        <strong>${escapeHtml(decision.headline)}</strong>
        <p>${escapeHtml(decision.detail)}</p>
      </div>
      <div class="creator-pilot-decision-metrics">
        <span><strong>${decision.buyerSignal}</strong> buyer signal</span>
        <span><strong>${decision.positiveSignal}</strong> positive</span>
        <span><strong>${decision.negativeSignal}</strong> blocked/churn</span>
        <span><strong>${decision.testedCount}</strong> tested</span>
      </div>
      <button class="secondary-button" type="button" data-foundry-pilot-decision>Copy decision</button>
    </section>
  `;
}

function renderFoundryPilotCrmPanel() {
  const allRecords = normalizeFoundryPilotRecords(state.foundryPilotRecords);
  const records = foundryPilotFilteredRecords(allRecords);
  const counts = foundryPilotCounts(allRecords);
  const activeFilter = ["all", "active", "due", "strong", ...Object.keys(foundryPilotStatuses)].includes(state.foundryPilotFilter) ? state.foundryPilotFilter : "active";
  const filterButton = (value, label, count) => `
    <button class="${activeFilter === value ? "active" : ""}" type="button" data-foundry-pilot-filter="${escapeHtml(value)}">
      <strong>${count}</strong> ${escapeHtml(label)}
    </button>
  `;
  return `
    <div class="creator-pilot-crm">
      <div class="creator-pilot-crm-summary">
        <span><strong>${counts.total}</strong> shops tracked</span>
        <span><strong>${counts.testing}</strong> testing</span>
        <span><strong>${counts.due}</strong> due soon</span>
        <span><strong>${counts.strongFit}</strong> strong fit</span>
        <span><strong>${counts.outcomes.willing_to_pay + counts.outcomes.reference_ready}</strong> buyer signal</span>
      </div>
      <div class="creator-pilot-crm-actions">
        <button class="secondary-button" type="button" data-foundry-pilot-report>Copy pipeline report</button>
        <button class="secondary-button" type="button" data-foundry-pilot-followups>Copy follow-up queue</button>
      </div>
      <div class="creator-pilot-crm-controls">
        <label>
          <span>Find pilot shop</span>
          <input data-foundry-pilot-search value="${escapeHtml(state.foundryPilotSearch)}" placeholder="Search shop, trade, contact, source, or notes" autocomplete="off">
        </label>
        <div class="creator-pilot-filters" role="group" aria-label="Pilot CRM filters">
          ${filterButton("active", "active", allRecords.filter(foundryPilotIsActive).length)}
          ${filterButton("due", "due soon", allRecords.filter(foundryPilotDueSoon).length)}
          ${filterButton("strong", "strong fit", allRecords.filter((record) => record.fitScore >= 70 && foundryPilotIsActive(record)).length)}
          ${filterButton("testing", "testing", counts.testing)}
          ${filterButton("graduated", "graduated", counts.graduated)}
          ${filterButton("not_fit", "not fit", counts.not_fit)}
          ${filterButton("all", "all", counts.total)}
        </div>
        <em>${records.length} shown</em>
      </div>
      ${renderFoundryPilotDecisionPanel(allRecords)}
      ${renderFoundryPilotFollowUpPanel(allRecords)}
      <form class="creator-pilot-form" data-foundry-pilot-form>
        <input name="shopName" placeholder="Shop name" autocomplete="off">
        <input name="trade" placeholder="Trade" autocomplete="off">
        <input name="teamSize" type="number" min="0" step="1" placeholder="Team size">
        <input name="contactName" placeholder="Contact" autocomplete="off">
        <input name="contactEmail" type="email" placeholder="Email" autocomplete="off">
        <input name="contactPhone" data-phone-input placeholder="Phone" autocomplete="off">
        <input name="source" placeholder="Source" autocomplete="off">
        <textarea name="notes" rows="2" placeholder="Pilot notes"></textarea>
        <button class="primary-button" type="submit">Add pilot shop</button>
      </form>
      <div class="creator-pilot-list">
        ${records.length ? records.map((record) => `
          <article class="creator-pilot-card ${escapeHtml(record.status)}">
            <div class="creator-pilot-card-main">
              <div>
                <span>${escapeHtml(foundryPilotStatusLabel(record.status))}</span>
                <strong>${escapeHtml(record.shopName)}</strong>
                <p>${escapeHtml(foundryPilotSummaryLine(record))}</p>
              </div>
              <em>${record.fitScore}/100 fit</em>
            </div>
            <div class="creator-pilot-statuses" role="group" aria-label="${escapeHtml(`${record.shopName} pilot status`)}">
              ${Object.entries(foundryPilotStatuses).map(([value, label]) => `
                <button class="${record.status === value ? "active" : ""}" type="button" data-foundry-pilot-status="${escapeHtml(record.id)}" data-status="${escapeHtml(value)}">${escapeHtml(label)}</button>
              `).join("")}
            </div>
            <div class="creator-pilot-outcomes" role="group" aria-label="${escapeHtml(`${record.shopName} pilot outcome`)}">
              <span>Outcome</span>
              ${Object.entries(foundryPilotOutcomes).map(([value, label]) => `
                <button class="${record.outcome === value ? "active" : ""}" type="button" data-foundry-pilot-outcome="${escapeHtml(record.id)}" data-outcome="${escapeHtml(value)}">${escapeHtml(label)}</button>
              `).join("")}
            </div>
            <div class="creator-pilot-fields">
              <label>
                <span>Score</span>
                <input data-foundry-pilot-score="${escapeHtml(record.id)}" type="number" min="0" max="100" step="5" value="${record.fitScore}">
              </label>
              <label>
                <span>Next follow-up</span>
                <input data-foundry-pilot-follow-up="${escapeHtml(record.id)}" type="date" value="${escapeHtml(record.nextFollowUp)}">
              </label>
            </div>
            <textarea data-foundry-pilot-notes="${escapeHtml(record.id)}" rows="2" placeholder="Pilot notes">${escapeHtml(record.notes)}</textarea>
            <div class="creator-pilot-card-actions">
              <span>${escapeHtml(`Updated ${record.updatedAt ? activityTimeLabel(record.updatedAt) : "just now"}${record.updatedBy ? ` by ${record.updatedBy}` : ""}`)}</span>
              <button class="secondary-button" type="button" data-foundry-pilot-brief="${escapeHtml(record.id)}">Copy brief</button>
            </div>
          </article>
        `).join("") : `<div class="empty-state compact-empty"><strong>No pilot shops here</strong><span>${allRecords.length ? "Adjust the search or filter to see more pilot records." : "Add the first beta prospect above."}</span></div>`}
      </div>
    </div>
  `;
}

function renderFoundryPilotPackPanel() {
  const decision = foundryLaunchDecision();
  return `
    <div class="creator-pilot-pack">
      <article>
        <span>Invite</span>
        <strong>Early beta shop invite</strong>
        <p>Plain-language outreach for a small shop owner, with expectations and the reply details we need.</p>
        <button class="secondary-button" type="button" data-foundry-pilot-invite>Copy invite</button>
      </article>
      <article>
        <span>Onboarding</span>
        <strong>First-session checklist</strong>
        <p>Setup steps, pilot success signals, and feedback questions for a controlled beta walkthrough.</p>
        <button class="secondary-button" type="button" data-foundry-pilot-onboarding>Copy checklist</button>
      </article>
      <article class="${escapeHtml(decision.status)}">
        <span>Launch posture</span>
        <strong>${escapeHtml(decision.label)}</strong>
        <p>${escapeHtml(decision.headline)}</p>
      </article>
    </div>
  `;
}

function renderFoundryPilotFeedbackKitPanel() {
  return `
    <div class="creator-feedback-kit">
      <article>
        <span>Session recap</span>
        <strong>Pilot feedback recap</strong>
        <p>Structured notes for what the shop tested, what mattered, and whether they would keep using Backline.</p>
        <button class="secondary-button" type="button" data-foundry-pilot-feedback>Copy recap</button>
      </article>
      <article>
        <span>Bug</span>
        <strong>Pilot bug report</strong>
        <p>Repro steps, severity, business impact, environment, and evidence for issues found during beta use.</p>
        <button class="secondary-button" type="button" data-foundry-pilot-bug>Copy bug report</button>
      </article>
      <article>
        <span>Feature</span>
        <strong>Feature request rubric</strong>
        <p>Captures the real problem, frequency, value, and priority before we decide what to build.</p>
        <button class="secondary-button" type="button" data-foundry-pilot-feature>Copy request</button>
      </article>
    </div>
  `;
}

function renderFoundryPilotOutcomePanel() {
  return `
    <div class="creator-pilot-scorecard">
      <article>
        <span>Decision</span>
        <strong>Pilot outcome scorecard</strong>
        <p>Scores product fit, real workflow value, support burden, willingness to pay, and next action after a pilot.</p>
        <button class="secondary-button" type="button" data-foundry-pilot-scorecard>Copy scorecard</button>
      </article>
      <article>
        <span>Pricing</span>
        <strong>Pilot pricing interview</strong>
        <p>Questions to learn what shops would pay for, what feels fair, and what would make them cancel.</p>
        <button class="secondary-button" type="button" data-foundry-pilot-pricing>Copy interview</button>
      </article>
    </div>
  `;
}

function renderFoundryGoNoGoPanel() {
  const decision = foundryLaunchDecision();
  const betaCounts = betaReadinessCounts(companySettings().betaReadiness);
  const productionCounts = productionReadinessCounts(companySettings().productionReadiness);
  const setupCounts = supabaseProductionSetupCounts(companySettings().supabaseProductionSetup);
  const testCounts = foundryBetaTestCounts(companySettings().foundryTestResults);
  const healthCounts = foundryLiveHealthCounts();
  return `
    <div class="creator-go-panel ${escapeHtml(decision.status)}">
      <div class="creator-go-main">
        <span>${escapeHtml(decision.label)}</span>
        <strong>${escapeHtml(decision.headline)}</strong>
        <p>${escapeHtml(decision.detail)}</p>
      </div>
      <div class="creator-go-metrics">
        <span><strong>${setupCounts.ready}</strong> setup ready</span>
        <span><strong>${productionCounts.ready}</strong> production ready</span>
        <span><strong>${betaCounts.passed}</strong> beta passed</span>
        <span><strong>${testCounts.passed}</strong> scripts passed</span>
        <span><strong>${healthCounts.ready}</strong> health ready</span>
      </div>
      <div class="creator-go-list">
        <strong>${decision.blockers.length ? "Blockers" : decision.warnings.length ? "Open warnings" : "Clear"}</strong>
        <span>${escapeHtml((decision.blockers.length ? decision.blockers : decision.warnings).slice(0, 4).join(", ") || "No blockers or warnings recorded.")}</span>
      </div>
      <button class="primary-button" type="button" data-foundry-go-no-go>Copy Go/No-Go</button>
    </div>
  `;
}

function updateFoundryBetaTestResult(key, patch = {}) {
  if (!state.isCreator) return;
  const script = foundryBetaTestScripts.find((item) => item.key === key);
  if (!script) return;
  const settings = companySettings();
  const results = normalizeFoundryTestResults(settings.foundryTestResults);
  const current = results[key] || { status: "not_run", note: "" };
  results[key] = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  };
  state.companySettings = markCompanySettingsChanged({
    ...settings,
    foundryTestResults: results
  });
  save();
}

function foundryHealthCheckStatus(ok, readyLabel = "Ready", issueLabel = "Check") {
  return ok ? { status: readyLabel, tone: "ready" } : { status: issueLabel, tone: "warning" };
}

function foundryLiveHealthChecks() {
  const config = supabaseConfig();
  const environment = deploymentEnvironment();
  const productionOrigin = location.protocol === "https:" && !isLocalOrigin();
  const projectConfigured = isSupabaseConfigured();
  const hasRealProject = projectConfigured && !/YOUR-|example/i.test(config.url) && !/YOUR-|example/i.test(config.anonKey);
  const productionEnvOnHostedOrigin = environment !== "production" || productionOrigin;
  const checks = [
    {
      key: "environment",
      label: "Environment label",
      detail: deploymentEnvironmentDetail(environment),
      ...foundryHealthCheckStatus(environment !== "undeclared", deploymentEnvironmentLabel(environment), "Missing")
    },
    {
      key: "origin",
      label: "Runtime origin",
      detail: `${location.protocol}//${location.host || "local file"}`,
      ...foundryHealthCheckStatus(environment !== "production" ? true : productionOrigin, productionOrigin ? "Hosted" : "Local", "Review")
    },
    {
      key: "supabase",
      label: "Supabase client",
      detail: projectConfigured ? "URL, publishable key, and client library are loaded." : "Supabase URL, key, or client library is missing.",
      ...foundryHealthCheckStatus(projectConfigured, "Configured", "Missing")
    },
    {
      key: "project",
      label: "Project values",
      detail: hasRealProject ? "Active project values are present." : "Config appears to contain placeholders or missing values.",
      ...foundryHealthCheckStatus(hasRealProject, "Loaded", "Review")
    },
    {
      key: "workspace",
      label: "Workspace scope",
      detail: state.secureMode && state.organizationId ? `Secure workspace ${state.organizationId.slice(0, 8)}...${state.organizationId.slice(-6)} is active.` : "No secure workspace is loaded.",
      ...foundryHealthCheckStatus(state.secureMode && state.organizationId, "Loaded", "Needs login")
    },
    {
      key: "foundry-access",
      label: "Foundry access",
      detail: state.isCreator ? "Platform admin RPC granted this account Foundry access." : "Foundry is hidden from this account.",
      ...foundryHealthCheckStatus(state.isCreator, "Verified", "Blocked")
    },
    {
      key: "bundle",
      label: "App bundle",
      detail: `Current cache tag: ${currentAppVersionLabel()}.`,
      ...foundryHealthCheckStatus(currentAppVersionLabel() !== "not pinned", "Tagged", "Not pinned")
    },
    {
      key: "production-safe",
      label: "Production safety",
      detail: productionEnvOnHostedOrigin ? "Environment and origin combination is acceptable." : "Production environment is running from a local origin.",
      ...foundryHealthCheckStatus(productionEnvOnHostedOrigin, "Aligned", "Review")
    }
  ];
  return checks;
}

function foundryLiveHealthCounts(checks = foundryLiveHealthChecks()) {
  return checks.reduce((counts, check) => {
    counts[check.tone === "ready" ? "ready" : "warning"] += 1;
    return counts;
  }, { ready: 0, warning: 0 });
}

function foundryLiveHealthText() {
  const checks = foundryLiveHealthChecks();
  const counts = foundryLiveHealthCounts(checks);
  return [
    "Backline Foundry Live Health",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    `Environment: ${deploymentEnvironmentLabel()}`,
    `Origin: ${location.protocol}//${location.host || "local file"}`,
    `Summary: ${counts.ready} ready, ${counts.warning} need review`,
    "",
    ...checks.map((check) => `- ${check.label}: ${check.status} - ${check.detail}`)
  ].join("\n");
}

async function copyFoundryLiveHealth() {
  if (!state.isCreator) return;
  await copyFoundryText(foundryLiveHealthText(), "Health check copied", "Live Foundry health summary is on your clipboard.", "foundry-live-health");
}

function foundryBetaTestScriptText(key = "") {
  const script = foundryBetaTestScripts.find((item) => item.key === key);
  if (!script) return "";
  return [
    `Backline Beta Test Script: ${script.label}`,
    `Persona: ${script.persona}`,
    `Goal: ${script.goal}`,
    "",
    "Steps:",
    ...script.steps.map((step, index) => `${index + 1}. ${step}`),
    "",
    `Expected result: ${script.expected}`,
    "",
    "Tester notes:",
    "- Pass/fail:",
    "- Browser/device:",
    "- Account used:",
    "- Issues found:"
  ].join("\n");
}

async function copyFoundryBetaTestScript(key = "") {
  if (!state.isCreator) return;
  const script = foundryBetaTestScripts.find((item) => item.key === key);
  const text = foundryBetaTestScriptText(key);
  if (!script || !text) return;
  await copyFoundryText(text, "Test script copied", `${script.label} is on your clipboard.`, "foundry-test-script");
}

function renderFoundryBetaTestScriptsPanel() {
  const results = companySettings().foundryTestResults;
  const counts = foundryBetaTestCounts(results);
  const progress = foundryBetaTestProgress(counts);
  return `
    <div class="creator-test-script-progress">
      <div>
        <strong>${progress}% script pass rate</strong>
        <span>${counts.passed} passed, ${counts.needs_work} needs work, ${counts.not_run} not run</span>
      </div>
      <div class="creator-test-script-progress-bar" aria-hidden="true"><span style="width: ${progress}%"></span></div>
    </div>
    <div class="creator-test-script-grid">
      ${foundryBetaTestScripts.map((script) => {
        const result = results[script.key] || { status: "not_run", note: "" };
        return `
        <article class="creator-test-script-card ${escapeHtml(result.status)}">
          <div class="creator-test-script-main">
            <span>${escapeHtml(script.persona)}</span>
            <strong>${escapeHtml(script.label)}</strong>
            <p>${escapeHtml(script.goal)}</p>
          </div>
          <ul>
            ${script.steps.slice(0, 3).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ul>
          <div class="creator-test-script-controls" role="group" aria-label="${escapeHtml(`${script.label} test result`)}">
            ${Object.entries(foundryBetaTestStatuses).map(([value, label]) => `
              <button class="${result.status === value ? "active" : ""}" type="button" data-foundry-test-status="${escapeHtml(script.key)}" data-status="${escapeHtml(value)}">
                ${escapeHtml(label)}
              </button>
            `).join("")}
          </div>
          <textarea data-foundry-test-note="${escapeHtml(script.key)}" rows="2" placeholder="Add tester notes, device, account, or issue link">${escapeHtml(result.note || "")}</textarea>
          <div class="creator-test-script-meta">
            <span>${script.steps.length} steps - ${escapeHtml(foundryBetaTestMeta(result))}</span>
            <button class="secondary-button" type="button" data-foundry-test-script="${escapeHtml(script.key)}">Copy script</button>
          </div>
        </article>
      `;
      }).join("")}
    </div>
  `;
}

function renderFoundryLiveHealthPanel() {
  const checks = foundryLiveHealthChecks();
  const counts = foundryLiveHealthCounts(checks);
  return `
    <div class="creator-live-health-summary">
      <div>
        <strong>${counts.ready} ready</strong>
        <span>${counts.warning} need review right now</span>
      </div>
      <button class="primary-button" type="button" data-foundry-live-health>Copy health check</button>
    </div>
    <div class="creator-live-health-list">
      ${checks.map((check) => creatorReadinessRow(check.label, check.status, check.detail, check.tone)).join("")}
    </div>
  `;
}

function updateProductionReadinessItem(key, patch = {}) {
  if (!state.isCreator) return;
  const item = productionReadinessChecklist.find((entry) => entry.key === key);
  if (!item) return;
  const settings = companySettings();
  const readiness = normalizeProductionReadiness(settings.productionReadiness);
  const current = readiness[key] || { status: "open", note: "" };
  readiness[key] = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  };
  state.companySettings = markCompanySettingsChanged({
    ...settings,
    productionReadiness: readiness
  });
  save();
}

function updateSupabaseProductionSetupItem(key, patch = {}) {
  if (!state.isCreator) return;
  const item = supabaseProductionSetupChecklist.find((entry) => entry.key === key);
  if (!item) return;
  const settings = companySettings();
  const setup = normalizeSupabaseProductionSetup(settings.supabaseProductionSetup);
  const current = setup[key] || { status: "open", note: "" };
  setup[key] = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  };
  state.companySettings = markCompanySettingsChanged({
    ...settings,
    supabaseProductionSetup: setup
  });
  save();
}

async function copySupabaseProductionSetup() {
  if (!state.isCreator) return;
  await copyFoundryText(supabaseProductionSetupText(), "Supabase setup copied", "Production Supabase setup checklist is on your clipboard.", "foundry-supabase-setup");
}

function renderSupabaseProductionSetupPanel() {
  const setup = companySettings().supabaseProductionSetup;
  const counts = supabaseProductionSetupCounts(setup);
  const progress = supabaseProductionSetupProgress(counts);
  const activeFilter = ["all", "open", "ready", "needs_work"].includes(state.foundrySetupFilter) ? state.foundrySetupFilter : "all";
  const filteredItems = supabaseProductionSetupChecklist
    .filter((item) => activeFilter === "all" || (setup[item.key]?.status || "open") === activeFilter)
    .sort((a, b) => {
      const aStatus = setup[a.key]?.status || "open";
      const bStatus = setup[b.key]?.status || "open";
      return productionReadinessSortRank(aStatus) - productionReadinessSortRank(bStatus) || a.label.localeCompare(b.label);
    });
  const rows = filteredItems.map((item) => {
    const record = setup[item.key] || { status: "open", note: "" };
    return `
      <article class="creator-setup-row ${escapeHtml(record.status)}">
        <div class="creator-setup-main">
          <div>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.detail)}</span>
          </div>
          <em>${escapeHtml(productionReadinessMeta(record))}</em>
        </div>
        <div class="creator-setup-controls" role="group" aria-label="${escapeHtml(`${item.label} setup status`)}">
          ${Object.entries(productionReadinessStatuses).map(([value, label]) => `
            <button class="${record.status === value ? "active" : ""}" type="button" data-setup-status="${escapeHtml(item.key)}" data-status="${escapeHtml(value)}">
              ${escapeHtml(label)}
            </button>
          `).join("")}
        </div>
        <textarea data-setup-note="${escapeHtml(item.key)}" rows="2" placeholder="Add Supabase setup note, project name, or blocker">${escapeHtml(record.note || "")}</textarea>
      </article>
    `;
  }).join("");
  return `
    <div class="creator-setup-progress">
      <div>
        <strong>${progress}% Supabase setup ready</strong>
        <span>${counts.ready} of ${supabaseProductionSetupChecklist.length} setup checks ready</span>
      </div>
      <div class="creator-setup-progress-bar" aria-hidden="true"><span style="width: ${progress}%"></span></div>
    </div>
    <div class="creator-setup-summary">
      <button class="${activeFilter === "all" ? "active" : ""}" type="button" data-setup-filter="all"><strong>${supabaseProductionSetupChecklist.length}</strong> all</button>
      <button class="${activeFilter === "needs_work" ? "active" : ""}" type="button" data-setup-filter="needs_work"><strong>${counts.needs_work}</strong> needs work</button>
      <button class="${activeFilter === "open" ? "active" : ""}" type="button" data-setup-filter="open"><strong>${counts.open}</strong> open</button>
      <button class="${activeFilter === "ready" ? "active" : ""}" type="button" data-setup-filter="ready"><strong>${counts.ready}</strong> ready</button>
      <button class="primary-button" type="button" data-foundry-supabase-setup>Copy setup brief</button>
    </div>
    <div class="creator-setup-list">${rows || `<div class="empty-state compact-empty"><strong>No setup checks here</strong><span>Choose another setup filter.</span></div>`}</div>
  `;
}

function renderProductionReadinessPanel() {
  const readiness = companySettings().productionReadiness;
  const counts = productionReadinessCounts(readiness);
  const progress = productionReadinessProgress(counts);
  const activeFilter = ["all", "open", "ready", "needs_work"].includes(state.foundryProductionFilter) ? state.foundryProductionFilter : "all";
  const filteredItems = productionReadinessChecklist
    .filter((item) => activeFilter === "all" || (readiness[item.key]?.status || "open") === activeFilter)
    .sort((a, b) => {
      const aStatus = readiness[a.key]?.status || "open";
      const bStatus = readiness[b.key]?.status || "open";
      return productionReadinessSortRank(aStatus) - productionReadinessSortRank(bStatus) || a.label.localeCompare(b.label);
    });
  const rows = filteredItems.map((item) => {
    const record = readiness[item.key] || { status: "open", note: "" };
    return `
      <article class="creator-production-row ${record.status}">
        <div class="creator-production-main">
          <div>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.detail)}</span>
          </div>
          <em>${escapeHtml(productionReadinessMeta(record))}</em>
        </div>
        <div class="creator-production-controls" role="group" aria-label="${escapeHtml(`${item.label} production status`)}">
          ${Object.entries(productionReadinessStatuses).map(([value, label]) => `
            <button class="${record.status === value ? "active" : ""}" type="button" data-production-status="${escapeHtml(item.key)}" data-status="${escapeHtml(value)}">
              ${escapeHtml(label)}
            </button>
          `).join("")}
        </div>
        <textarea data-production-note="${escapeHtml(item.key)}" rows="2" placeholder="Add a production launch note">${escapeHtml(record.note || "")}</textarea>
      </article>
    `;
  }).join("");
  return `
    <div class="creator-production-progress">
      <div>
        <strong>${progress}% production ready</strong>
        <span>${counts.ready} of ${productionReadinessChecklist.length} launch checks ready</span>
      </div>
      <div class="creator-production-progress-bar" aria-hidden="true"><span style="width: ${progress}%"></span></div>
    </div>
    <div class="creator-production-summary">
      <button class="${activeFilter === "all" ? "active" : ""}" type="button" data-production-filter="all"><strong>${productionReadinessChecklist.length}</strong> all</button>
      <button class="${activeFilter === "needs_work" ? "active" : ""}" type="button" data-production-filter="needs_work"><strong>${counts.needs_work}</strong> needs work</button>
      <button class="${activeFilter === "open" ? "active" : ""}" type="button" data-production-filter="open"><strong>${counts.open}</strong> open</button>
      <button class="${activeFilter === "ready" ? "active" : ""}" type="button" data-production-filter="ready"><strong>${counts.ready}</strong> ready</button>
      <button class="primary-button" type="button" data-foundry-production-brief>Copy launch brief</button>
    </div>
    <div class="creator-production-list">${rows || `<div class="empty-state compact-empty"><strong>No checks here</strong><span>Choose another production filter.</span></div>`}</div>
  `;
}

function renderBetaReadinessChecklist() {
  const readiness = companySettings().betaReadiness;
  const counts = betaReadinessCounts(readiness);
  const activeFilter = ["all", "open", "passed", "needs_work"].includes(state.foundryBetaFilter) ? state.foundryBetaFilter : "all";
  const filteredItems = betaReadinessChecklist
    .filter((item) => activeFilter === "all" || (readiness[item.key]?.status || "open") === activeFilter)
    .sort((a, b) => {
      const aStatus = readiness[a.key]?.status || "open";
      const bStatus = readiness[b.key]?.status || "open";
      return betaReadinessSortRank(aStatus) - betaReadinessSortRank(bStatus) || a.label.localeCompare(b.label);
    });
  const rows = filteredItems.map((item) => {
    const record = readiness[item.key] || { status: "open", note: "" };
    return `
      <article class="creator-beta-row ${record.status}">
        <div class="creator-beta-main">
          <div>
            <strong>${escapeHtml(item.label)}</strong>
            <span>${escapeHtml(item.detail)}</span>
          </div>
          <em>${escapeHtml(betaReadinessMeta(record))}</em>
        </div>
        <div class="creator-beta-controls" role="group" aria-label="${escapeHtml(`${item.label} status`)}">
          ${Object.entries(betaReadinessStatuses).map(([value, label]) => `
            <button class="${record.status === value ? "active" : ""}" type="button" data-beta-status="${escapeHtml(item.key)}" data-status="${escapeHtml(value)}">
              ${escapeHtml(label)}
            </button>
          `).join("")}
        </div>
        <textarea data-beta-note="${escapeHtml(item.key)}" rows="2" placeholder="Add a note for this beta check">${escapeHtml(record.note || "")}</textarea>
      </article>
    `;
  }).join("");
  const progress = betaReadinessProgress(counts);
  return `
    <div class="creator-beta-progress">
      <div>
        <strong>${progress}% beta ready</strong>
        <span>${counts.passed} of ${betaReadinessChecklist.length} checks passed</span>
      </div>
      <div class="creator-beta-progress-bar" aria-hidden="true"><span style="width: ${progress}%"></span></div>
    </div>
    <div class="creator-beta-summary">
      <button class="${activeFilter === "all" ? "active" : ""}" type="button" data-beta-filter="all"><strong>${betaReadinessChecklist.length}</strong> all</button>
      <button class="${activeFilter === "needs_work" ? "active" : ""}" type="button" data-beta-filter="needs_work"><strong>${counts.needs_work}</strong> needs work</button>
      <button class="${activeFilter === "open" ? "active" : ""}" type="button" data-beta-filter="open"><strong>${counts.open}</strong> open</button>
      <button class="${activeFilter === "passed" ? "active" : ""}" type="button" data-beta-filter="passed"><strong>${counts.passed}</strong> passed</button>
    </div>
    <div class="creator-beta-list">${rows || `<div class="empty-state compact-empty"><strong>No checks here</strong><span>Choose another readiness filter.</span></div>`}</div>
  `;
}

function updateBetaReadinessItem(key, patch = {}) {
  if (!state.isCreator) return;
  const item = betaReadinessChecklist.find((entry) => entry.key === key);
  if (!item) return;
  const settings = companySettings();
  const readiness = normalizeBetaReadiness(settings.betaReadiness);
  const current = readiness[key] || { status: "open", note: "" };
  readiness[key] = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  };
  state.companySettings = markCompanySettingsChanged({
    ...settings,
    betaReadiness: readiness
  });
  save();
}

function creatorWorkspaceStats() {
  const customers = buildCustomersFromJobs(state.jobs);
  const activeJobs = state.jobs.filter((job) => job.status !== "closed");
  const completedJobs = state.jobs.filter((job) => ["completed", "closed"].includes(job.status));
  const openBalance = state.jobs.reduce((sum, job) => sum + Math.max(0, invoiceRecord(job).amount - invoiceRecord(job).paidAmount), 0);
  return {
    jobs: state.jobs.length,
    activeJobs: activeJobs.length,
    completedJobs: completedJobs.length,
    customers: customers.length,
    team: state.teamMembers.length,
    pricebook: state.pricebookItems.length,
    suppliers: state.suppliers.length,
    activity: state.activityEvents.length,
    openBalance
  };
}

function foundrySnapshotItemLine(item, record = {}) {
  const note = String(record.note || "").trim();
  return `- ${item.label}${note ? ` - ${note}` : ""}`;
}

function foundryTestResultLine(script, record = {}) {
  const note = String(record.note || "").trim();
  return `- ${script.label}: ${foundryBetaTestStatusLabel(record.status)}${note ? ` - ${note}` : ""}`;
}

function currentAppVersionLabel() {
  const scriptSrc = document.querySelector('script[src^="app.js"]')?.getAttribute("src") || "app.js";
  return scriptSrc.includes("?") ? scriptSrc.split("?").pop() : "not pinned";
}

function creatorSnapshotPayload(text = "") {
  const appVersion = currentAppVersionLabel();
  const environment = deploymentEnvironment();
  const settings = companySettings();
  const readiness = normalizeBetaReadiness(settings.betaReadiness);
  const testResults = normalizeFoundryTestResults(settings.foundryTestResults);
  const counts = betaReadinessCounts(readiness);
  const progress = betaReadinessProgress(counts);
  const testCounts = foundryBetaTestCounts(testResults);
  const testProgress = foundryBetaTestProgress(testCounts);
  const stats = creatorWorkspaceStats();
  const needsWork = betaReadinessChecklist.filter((item) => readiness[item.key]?.status === "needs_work");
  const openItems = betaReadinessChecklist.filter((item) => (readiness[item.key]?.status || "open") === "open");
  const testNeedsWork = foundryBetaTestScripts.filter((script) => testResults[script.key]?.status === "needs_work");
  const testNotRun = foundryBetaTestScripts.filter((script) => (testResults[script.key]?.status || "not_run") === "not_run");
  return {
    id: createId(),
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName(),
    workspaceId: state.organizationId || "",
    appVersion,
    environment: deploymentEnvironmentLabel(environment),
    progress,
    counts,
    testProgress,
    testCounts,
    stats: {
      jobs: stats.jobs,
      customers: stats.customers,
      team: stats.team,
      openBalance: stats.openBalance
    },
    needsWorkLabels: needsWork.map((item) => item.label),
    openLabels: openItems.map((item) => item.label),
    testNeedsWorkLabels: testNeedsWork.map((script) => script.label),
    testNotRunLabels: testNotRun.map((script) => script.label),
    snapshotText: text
  };
}

function creatorSnapshotText() {
  const payload = creatorSnapshotPayload();
  const settings = companySettings();
  const readiness = normalizeBetaReadiness(settings.betaReadiness);
  const testResults = normalizeFoundryTestResults(settings.foundryTestResults);
  const stats = creatorWorkspaceStats();
  const needsWork = betaReadinessChecklist.filter((item) => readiness[item.key]?.status === "needs_work");
  const openItems = betaReadinessChecklist.filter((item) => (readiness[item.key]?.status || "open") === "open");
  const testNeedsWork = foundryBetaTestScripts.filter((script) => testResults[script.key]?.status === "needs_work");
  const testNotRun = foundryBetaTestScripts.filter((script) => (testResults[script.key]?.status || "not_run") === "not_run");
  const generatedAt = new Date().toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
  const lines = [
    "Backline Foundry Snapshot",
    `Generated: ${generatedAt}`,
    `Build: ${payload.appVersion}`,
    `Environment: ${payload.environment}`,
    `Workspace: ${payload.workspaceId || "No workspace loaded"}`,
    `Operator: ${payload.createdBy} (${roleLabel()})`,
    "",
    `Beta readiness: ${payload.progress}% (${payload.counts.passed} passed, ${payload.counts.needs_work} needs work, ${payload.counts.open} open)`,
    `Beta scripts: ${payload.testProgress}% (${payload.testCounts.passed} passed, ${payload.testCounts.needs_work} needs work, ${payload.testCounts.not_run} not run)`,
    `Last activity: ${creatorLatestActivityLabel()}`,
    `Jobs: ${stats.jobs} total, ${stats.activeJobs} active, ${stats.completedJobs} completed`,
    `Customers: ${stats.customers}`,
    `Team members: ${stats.team}`,
    `Pricebook items: ${stats.pricebook}`,
    `Suppliers: ${stats.suppliers}`,
    `Open balance: ${formatMoney(stats.openBalance)}`,
    "",
    "Needs work:",
    ...(needsWork.length ? needsWork.map((item) => foundrySnapshotItemLine(item, readiness[item.key])) : ["- None marked"]),
    "",
    "Open checks:",
    ...(openItems.length ? openItems.map((item) => foundrySnapshotItemLine(item, readiness[item.key])) : ["- None open"]),
    "",
    "Script issues:",
    ...(testNeedsWork.length ? testNeedsWork.map((script) => foundryTestResultLine(script, testResults[script.key])) : ["- None marked"]),
    "",
    "Scripts not run:",
    ...(testNotRun.length ? testNotRun.map((script) => foundryTestResultLine(script, testResults[script.key])) : ["- None pending"]),
    "",
    "Recommended next step:",
    payload.counts.needs_work
      ? "- Fix needs-work items first, then rerun the beta checklist."
      : payload.counts.open
        ? "- Complete open checks and copy a fresh snapshot before beta."
        : payload.testCounts.needs_work
          ? "- Fix failed persona scripts and rerun the affected test."
          : payload.testCounts.not_run
            ? "- Run the remaining persona scripts before public beta."
            : "- Ready for a final live beta pass."
  ];
  return lines.join("\n");
}

function recordFoundrySnapshot(text = "") {
  const settings = companySettings();
  const record = normalizeFoundrySnapshots([{
    ...creatorSnapshotPayload(text),
    snapshotText: text
  }])[0];
  if (!record) return null;
  state.companySettings = markCompanySettingsChanged({
    ...settings,
    foundrySnapshots: normalizeFoundrySnapshots([record, ...(settings.foundrySnapshots || [])])
  });
  save();
  return record;
}

async function copyFoundryText(text = "", successTitle = "Copied", successBody = "Foundry text is on your clipboard.", toastId = "foundry-copy") {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    state.foundrySnapshotText = "";
    showToast(successTitle, successBody, "success", {
      id: toastId,
      timeout: 3200
    });
  } catch {
    state.foundrySnapshotText = text;
    showToast("Copy ready", "Clipboard access was blocked. Copy it from the Foundry text box.", "warning", {
      id: toastId,
      timeout: 5200
    });
  }
  render();
}

async function copyFoundrySnapshot() {
  if (!state.isCreator) return;
  const text = creatorSnapshotText();
  recordFoundrySnapshot(text);
  await copyFoundryText(text, "Foundry snapshot copied", "Beta status summary is on your clipboard.", "foundry-snapshot");
}

async function copyFoundrySnapshotRecord(id = "") {
  if (!state.isCreator) return;
  const record = companySettings().foundrySnapshots.find((snapshot) => snapshot.id === id);
  if (!record?.snapshotText) return;
  await copyFoundryText(record.snapshotText, "Beta run copied", "That saved Foundry snapshot is on your clipboard.", "foundry-snapshot-run");
}

function renderFoundrySnapshotHistory() {
  const snapshots = companySettings().foundrySnapshots;
  if (!snapshots.length) {
    return `<div class="empty-state compact-empty"><strong>No beta runs yet</strong><span>Copy a Foundry snapshot to save the first run.</span></div>`;
  }
  return `
    <div class="creator-run-history">
      ${snapshots.map((snapshot, index) => {
        const previous = snapshots[index + 1];
        const delta = previous ? snapshot.progress - previous.progress : 0;
        const deltaLabel = previous
          ? `${delta >= 0 ? "+" : ""}${delta}% from previous`
          : "First saved run";
        const blockers = snapshot.needsWorkLabels.slice(0, 3);
        return `
          <article class="creator-run-card">
            <div class="creator-run-main">
              <div>
                <strong>${escapeHtml(activityTimeLabel(snapshot.createdAt))}</strong>
                <span>${escapeHtml(`${snapshot.createdBy} - ${snapshot.environment || "Not declared"}`)}</span>
              </div>
              <em>${snapshot.progress}% ready</em>
            </div>
            <div class="creator-run-stats">
              <span><strong>${snapshot.counts.passed}</strong> passed</span>
              <span><strong>${snapshot.counts.needs_work}</strong> needs work</span>
              <span><strong>${snapshot.counts.open}</strong> open</span>
              <span><strong>${snapshot.testProgress}%</strong> scripts</span>
              <span><strong>${escapeHtml(formatMoney(snapshot.stats.openBalance))}</strong> open balance</span>
            </div>
            <p>${escapeHtml(deltaLabel)}</p>
            <div class="creator-run-blockers">
              <strong>${blockers.length ? "Top blockers" : "Blockers"}</strong>
              <span>${escapeHtml(blockers.length ? blockers.join(", ") : "None marked")}</span>
            </div>
            <div class="creator-run-blockers">
              <strong>${snapshot.testNeedsWorkLabels.length ? "Script issues" : "Script results"}</strong>
              <span>${escapeHtml(snapshot.testNeedsWorkLabels.length ? snapshot.testNeedsWorkLabels.join(", ") : `${snapshot.testCounts.passed} passed, ${snapshot.testCounts.not_run} not run`)}</span>
            </div>
            <button class="secondary-button" type="button" data-foundry-copy-run="${escapeHtml(snapshot.id)}">Copy this run</button>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderFoundrySnapshotPanel() {
  return `
    <div class="creator-snapshot-panel">
      <div class="creator-snapshot-actions">
        <button class="primary-button" type="button" data-foundry-snapshot>Copy Foundry snapshot</button>
        <span>Copies build, workspace, readiness, blockers, open checks, and loaded workspace totals.</span>
      </div>
      ${renderFoundrySnapshotHistory()}
      ${state.foundrySnapshotText ? `
        <label class="creator-snapshot-output">
          <span>Manual copy</span>
          <textarea readonly rows="10">${escapeHtml(state.foundrySnapshotText)}</textarea>
        </label>
      ` : ""}
    </div>
  `;
}

function foundryIssueQueueItems() {
  const readiness = companySettings().betaReadiness;
  return betaReadinessChecklist
    .map((item) => ({
      ...item,
      record: readiness[item.key] || { status: "open", note: "" },
      status: readiness[item.key]?.status || "open"
    }))
    .filter((item) => item.status !== "passed")
    .sort((a, b) => betaReadinessSortRank(a.status) - betaReadinessSortRank(b.status) || a.label.localeCompare(b.label));
}

function foundryIssueBriefText(key = "") {
  const item = foundryIssueQueueItems().find((candidate) => candidate.key === key);
  if (!item) return "";
  const record = item.record || {};
  return [
    "Backline Foundry Issue",
    `Issue: ${item.label}`,
    `Status: ${betaReadinessStatusLabel(item.status)}`,
    `Detail: ${item.detail}`,
    `Workspace: ${state.organizationId || "No workspace loaded"}`,
    `Build: ${currentAppVersionLabel()}`,
    `Last updated: ${betaReadinessMeta(record)}`,
    "",
    "Current note:",
    record.note || "No note added.",
    "",
    "Suggested next step:",
    item.status === "needs_work"
      ? "Fix and retest this blocker before public beta."
      : "Run this check and mark it passed or needs work."
  ].join("\n");
}

async function copyFoundryIssueBrief(key = "") {
  if (!state.isCreator) return;
  const text = foundryIssueBriefText(key);
  if (!text) return;
  await copyFoundryText(text, "Issue brief copied", "Foundry issue details are on your clipboard.", "foundry-issue");
}

function renderFoundryIssueQueue() {
  const items = foundryIssueQueueItems();
  if (!items.length) {
    return `<div class="empty-state compact-empty"><strong>No open beta issues</strong><span>All readiness checks are marked passed.</span></div>`;
  }
  return `
    <div class="creator-issue-list">
      ${items.map((item) => {
        const record = item.record || {};
        return `
          <article class="creator-issue-card ${escapeHtml(item.status)}">
            <div class="creator-issue-main">
              <div>
                <strong>${escapeHtml(item.label)}</strong>
                <span>${escapeHtml(item.detail)}</span>
              </div>
              <em>${escapeHtml(betaReadinessStatusLabel(item.status))}</em>
            </div>
            <p>${escapeHtml(record.note || "No note added yet.")}</p>
            <small>${escapeHtml(betaReadinessMeta(record))}</small>
            <button class="secondary-button" type="button" data-foundry-copy-issue="${escapeHtml(item.key)}">Copy issue brief</button>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function creatorReleaseNotesText() {
  const settings = companySettings();
  const readiness = normalizeBetaReadiness(settings.betaReadiness);
  const testResults = normalizeFoundryTestResults(settings.foundryTestResults);
  const counts = betaReadinessCounts(readiness);
  const progress = betaReadinessProgress(counts);
  const testCounts = foundryBetaTestCounts(testResults);
  const testProgress = foundryBetaTestProgress(testCounts);
  const latestRun = settings.foundrySnapshots?.[0] || null;
  const passed = betaReadinessChecklist.filter((item) => readiness[item.key]?.status === "passed");
  const needsWork = betaReadinessChecklist.filter((item) => readiness[item.key]?.status === "needs_work");
  const openItems = betaReadinessChecklist.filter((item) => (readiness[item.key]?.status || "open") === "open");
  const testPassed = foundryBetaTestScripts.filter((script) => testResults[script.key]?.status === "passed");
  const testNeedsWork = foundryBetaTestScripts.filter((script) => testResults[script.key]?.status === "needs_work");
  const testNotRun = foundryBetaTestScripts.filter((script) => (testResults[script.key]?.status || "not_run") === "not_run");
  return [
    "Backline Beta Release Notes",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    `Build: ${currentAppVersionLabel()}`,
    `Environment: ${deploymentEnvironmentLabel()}`,
    `Workspace: ${state.organizationId || "No workspace loaded"}`,
    `Readiness: ${progress}% (${counts.passed} passed, ${counts.needs_work} needs work, ${counts.open} open)`,
    `Beta scripts: ${testProgress}% (${testCounts.passed} passed, ${testCounts.needs_work} needs work, ${testCounts.not_run} not run)`,
    latestRun ? `Latest beta run: ${activityTimeLabel(latestRun.createdAt)} by ${latestRun.createdBy}` : "Latest beta run: none saved yet",
    "",
    "Ready areas:",
    ...(passed.length ? passed.map((item) => `- ${item.label}`) : ["- No checks are marked passed yet."]),
    "",
    "Needs work before wider rollout:",
    ...(needsWork.length ? needsWork.map((item) => foundrySnapshotItemLine(item, readiness[item.key])) : ["- None marked"]),
    "",
    "Still open:",
    ...(openItems.length ? openItems.map((item) => `- ${item.label}`) : ["- None open"]),
    "",
    "Persona scripts passed:",
    ...(testPassed.length ? testPassed.map((script) => `- ${script.label}`) : ["- No persona scripts are marked passed yet."]),
    "",
    "Persona scripts needing work:",
    ...(testNeedsWork.length ? testNeedsWork.map((script) => foundryTestResultLine(script, testResults[script.key])) : ["- None marked"]),
    "",
    "Persona scripts not run:",
    ...(testNotRun.length ? testNotRun.map((script) => `- ${script.label}`) : ["- None pending"]),
    "",
    "Operator note:",
    "Localhost phone, SMS, email, and domain-dependent flows should be rechecked after production deployment."
  ].join("\n");
}

async function copyFoundryReleaseNotes() {
  if (!state.isCreator) return;
  await copyFoundryText(creatorReleaseNotesText(), "Release notes copied", "Beta release notes are on your clipboard.", "foundry-release-notes");
}

function productionLaunchBriefText() {
  const settings = companySettings();
  const readiness = normalizeProductionReadiness(settings.productionReadiness);
  const setup = normalizeSupabaseProductionSetup(settings.supabaseProductionSetup);
  const testResults = normalizeFoundryTestResults(settings.foundryTestResults);
  const counts = productionReadinessCounts(readiness);
  const progress = productionReadinessProgress(counts);
  const setupCounts = supabaseProductionSetupCounts(setup);
  const setupProgress = supabaseProductionSetupProgress(setupCounts);
  const testCounts = foundryBetaTestCounts(testResults);
  const testProgress = foundryBetaTestProgress(testCounts);
  const ready = productionReadinessChecklist.filter((item) => readiness[item.key]?.status === "ready");
  const needsWork = productionReadinessChecklist.filter((item) => readiness[item.key]?.status === "needs_work");
  const openItems = productionReadinessChecklist.filter((item) => (readiness[item.key]?.status || "open") === "open");
  const setupReady = supabaseProductionSetupChecklist.filter((item) => setup[item.key]?.status === "ready");
  const setupNeedsWork = supabaseProductionSetupChecklist.filter((item) => setup[item.key]?.status === "needs_work");
  const setupOpen = supabaseProductionSetupChecklist.filter((item) => (setup[item.key]?.status || "open") === "open");
  const testNeedsWork = foundryBetaTestScripts.filter((script) => testResults[script.key]?.status === "needs_work");
  const testNotRun = foundryBetaTestScripts.filter((script) => (testResults[script.key]?.status || "not_run") === "not_run");
  const line = (item) => foundrySnapshotItemLine(item, readiness[item.key]);
  const setupLine = (item) => foundrySnapshotItemLine(item, setup[item.key]);
  return [
    "Backline Production Launch Brief",
    `Generated: ${new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}`,
    `Build: ${currentAppVersionLabel()}`,
    `Workspace: ${state.organizationId || "No workspace loaded"}`,
    `Origin: ${location.protocol}//${location.host || "local file"}`,
    `Environment: ${deploymentEnvironmentLabel()}`,
    `Supabase setup: ${setupProgress}% (${setupCounts.ready} ready, ${setupCounts.needs_work} needs work, ${setupCounts.open} open)`,
    `Production readiness: ${progress}% (${counts.ready} ready, ${counts.needs_work} needs work, ${counts.open} open)`,
    `Beta scripts: ${testProgress}% (${testCounts.passed} passed, ${testCounts.needs_work} needs work, ${testCounts.not_run} not run)`,
    "",
    "Ready for launch:",
    ...(ready.length ? ready.map((item) => `- ${item.label}`) : ["- No production checks are marked ready yet."]),
    "",
    "Supabase setup ready:",
    ...(setupReady.length ? setupReady.map((item) => `- ${item.label}`) : ["- No Supabase setup checks are marked ready yet."]),
    "",
    "Supabase setup blockers:",
    ...(setupNeedsWork.length ? setupNeedsWork.map(setupLine) : ["- None marked"]),
    "",
    "Supabase setup still open:",
    ...(setupOpen.length ? setupOpen.map(setupLine) : ["- None open"]),
    "",
    "Must fix before launch:",
    ...(needsWork.length ? needsWork.map(line) : ["- None marked"]),
    "",
    "Still open:",
    ...(openItems.length ? openItems.map(line) : ["- None open"]),
    "",
    "Beta script blockers:",
    ...(testNeedsWork.length ? testNeedsWork.map((script) => foundryTestResultLine(script, testResults[script.key])) : ["- None marked"]),
    "",
    "Beta scripts still not run:",
    ...(testNotRun.length ? testNotRun.map((script) => `- ${script.label}`) : ["- None pending"]),
    "",
    "Launch note:",
    "Do not treat localhost beta checks as production-ready until hosted URL, email domain, SMS beta mode, portal, approvals, files, receipts, and mobile checks pass."
  ].join("\n");
}

async function copyProductionLaunchBrief() {
  if (!state.isCreator) return;
  await copyFoundryText(productionLaunchBriefText(), "Launch brief copied", "Production readiness brief is on your clipboard.", "foundry-production-brief");
}

function renderFoundryReleaseNotesGenerator() {
  const counts = betaReadinessCounts(companySettings().betaReadiness);
  const testCounts = foundryBetaTestCounts(companySettings().foundryTestResults);
  const testProgress = foundryBetaTestProgress(testCounts);
  const latestRun = companySettings().foundrySnapshots?.[0] || null;
  return `
    <div class="creator-release-generator">
      <div>
        <strong>${counts.passed} checks passed</strong>
        <span>${counts.needs_work} needs work, ${counts.open} open - scripts ${testProgress}% passed${latestRun ? ` - latest run ${activityTimeLabel(latestRun.createdAt)}` : ""}</span>
      </div>
      <button class="primary-button" type="button" data-foundry-release-notes>Copy beta release notes</button>
    </div>
  `;
}

function renderCreatorConsole() {
  if (!elements.creatorDiagnostics) return;
  if (!state.isCreator) {
    elements.creatorDiagnostics.innerHTML = "";
    return;
  }
  const config = supabaseConfig();
  const appVersion = currentAppVersionLabel();
  const environment = deploymentEnvironment();
  const workspaceLabel = state.organizationId ? `${state.organizationId.slice(0, 8)}...${state.organizationId.slice(-6)}` : "No workspace loaded";
  const isSecureOrigin = location.protocol === "https:" || isLocalOrigin();
  const stats = creatorWorkspaceStats();
  const readinessRows = [
    creatorReadinessRow("Supabase project", isSupabaseConfigured() ? "Configured" : "Missing", "URL and publishable key are loaded in this browser.", isSupabaseConfigured() ? "ready" : "warning"),
    creatorReadinessRow("Secure workspace", state.secureMode && state.organizationId ? "Loaded" : "Needs check", workspaceLabel, state.secureMode && state.organizationId ? "ready" : "warning"),
    creatorReadinessRow("Customer portal", "App ready", "Portal token flow is present; verify with a live customer link before beta.", "ready"),
    creatorReadinessRow("Files and photos", "App ready", "Job file records and customer-visible file controls are present.", "ready"),
    creatorReadinessRow("Roles and permissions", "App ready", `${state.teamMembers.length} member${state.teamMembers.length === 1 ? "" : "s"} loaded; custom roles are shop-scoped.`, "ready"),
    creatorReadinessRow("Activity log", stats.activity ? "Recording" : "Waiting", `${stats.activity} event${stats.activity === 1 ? "" : "s"} loaded. Latest: ${creatorLatestActivityLabel()}`, stats.activity ? "ready" : "warning"),
    creatorReadinessRow("Platform admin RPC", state.isCreator ? "Verified" : "Blocked", "Foundry visibility is backed by is_platform_admin().", state.isCreator ? "ready" : "warning"),
    creatorReadinessRow("Runtime origin", isSecureOrigin ? "Allowed" : "Review", `${location.protocol}//${location.host || "local file"}`, isSecureOrigin ? "ready" : "warning")
  ].join("");
  elements.creatorDiagnostics.innerHTML = [
    creatorHealthSection("Access", "Who is operating Foundry right now.", `
      <div class="creator-grid">
        ${creatorDiagnosticCard("Foundry access", "Enabled", "Verified by the is_platform_admin RPC.", "ready")}
        ${creatorDiagnosticCard("Signed-in account", accountDisplayName(), state.currentUser?.email || "No email recorded", "ready")}
        ${creatorDiagnosticCard("Shop role / mode", `${roleLabel()} - Read-only`, "Shop permissions stay separate from Foundry access.", "ready")}
      </div>
    `),
    creatorHealthSection("Workspace Footprint", "What this shop has loaded in the current session.", `
      <div class="creator-grid compact">
        ${creatorDiagnosticCard("Jobs", String(stats.jobs), `${stats.activeJobs} active, ${stats.completedJobs} completed.`, "ready")}
        ${creatorDiagnosticCard("Customers", String(stats.customers), "Derived from current and historical job records.", "ready")}
        ${creatorDiagnosticCard("Team", String(stats.team), "Members visible to this workspace.", stats.team ? "ready" : "warning")}
        ${creatorDiagnosticCard("Pricebook", String(stats.pricebook), "Custom billable items loaded.", stats.pricebook ? "ready" : "warning")}
        ${creatorDiagnosticCard("Suppliers", String(stats.suppliers), "Inventory supplier records loaded.", stats.suppliers ? "ready" : "warning")}
        ${creatorDiagnosticCard("Open balance", formatMoney(stats.openBalance), "Calculated from loaded invoice state.", stats.openBalance ? "warning" : "ready")}
      </div>
    `),
    creatorHealthSection("Platform Health", "Read-only checks before beta or production testing.", `
      <div class="creator-grid compact">
        ${creatorDiagnosticCard("Workspace", workspaceLabel, state.secureMode ? "Secure database workspace is active." : "Browser-only workspace.", state.secureMode ? "ready" : "warning")}
        ${creatorDiagnosticCard("Environment", deploymentEnvironmentLabel(environment), deploymentEnvironmentDetail(environment), deploymentEnvironmentTone(environment))}
        ${creatorDiagnosticCard("Supabase", isSupabaseConfigured() ? "Configured" : "Not configured", "Uses the configured URL and publishable key only.", isSupabaseConfigured() ? "ready" : "warning")}
        ${creatorDiagnosticCard("App bundle", appVersion, "Cache tag loaded by the current page.", "ready")}
      </div>
      <div class="creator-readiness-list">${readinessRows}</div>
    `),
    creatorHealthSection("Go/No-Go Summary", "One launch decision from readiness, scripts, live health, and production checks.", renderFoundryGoNoGoPanel()),
    creatorHealthSection("Pilot CRM", "Backline-only beta shop pipeline for prospects, active pilots, follow-ups, outcomes, and paid-fit signals.", renderFoundryPilotCrmPanel()),
    creatorHealthSection("Pilot Pack", "Copy controlled-beta invite and onboarding text for the first real shops.", renderFoundryPilotPackPanel()),
    creatorHealthSection("Pilot Feedback Kit", "Capture session recaps, beta bugs, and feature requests in a consistent format.", renderFoundryPilotFeedbackKitPanel()),
    creatorHealthSection("Pilot Outcome", "Score product fit, willingness to pay, and the next decision after a pilot.", renderFoundryPilotOutcomePanel()),
    creatorHealthSection("Live Health Checks", "Automatic environment and configuration checks from the current browser session.", renderFoundryLiveHealthPanel()),
    creatorHealthSection("Beta Tester Scripts", "Copy repeatable role-based scripts for manual owner, dispatcher, technician, customer, and mobile checks.", renderFoundryBetaTestScriptsPanel()),
    creatorHealthSection("Beta Readiness Checklist", "Mark what has passed, what is open, and what needs work before rollout.", renderBetaReadinessChecklist()),
    creatorHealthSection("Supabase Production Setup", "Track database, Auth, storage, Foundry, email, and hosted config steps before public beta.", renderSupabaseProductionSetupPanel()),
    creatorHealthSection("Production Readiness", "Separate localhost beta confidence from real public launch requirements.", renderProductionReadinessPanel()),
    creatorHealthSection("Beta Issue Queue", "Open readiness checks become copyable issue briefs for follow-up.", renderFoundryIssueQueue()),
    creatorHealthSection("Foundry Snapshot", "Copy a clean beta status summary for handoff, debugging, or release notes.", renderFoundrySnapshotPanel()),
    creatorHealthSection("Release Notes Generator", "Create a clean beta handoff note from the current readiness state.", renderFoundryReleaseNotesGenerator()),
    creatorHealthSection("Release Notes", "Internal build notes for beta readiness.", `
      <div class="creator-release-list">
        ${creatorReleaseNote("Build tag", appVersion, "highlight")}
        ${creatorReleaseNote("Schema level", "Expected through supabase-schema-19-platform-admins.sql")}
        ${creatorReleaseNote("Recent product areas", "Foundry access, platform health, workspace isolation, role permissions, mobile layout, customer portal, invoices, inventory.")}
        ${creatorReleaseNote("Manual beta checks", "Owner signup, workspace settings save, invite email, technician role, approval link, portal reply, file view, payment recording.")}
        ${creatorReleaseNote("Local limitations", "Localhost phone/SMS/email flows are simulated or provider-limited until production services and domains are verified.", "warning")}
        ${creatorReleaseNote("Next recommended step", "Run a full beta pass, copy a Foundry snapshot, then fix any needs-work items.", "next")}
      </div>
    `)
  ].join("");
}

function renderCustomersLegacy() {
  const rows = buildCustomersFromJobs(roleScopedJobs())
    .sort((a, b) => b.jobCount - a.jobCount);
  if (!rows.length) {
    state.selectedCustomerId = null;
    elements.customerList.innerHTML = "";
    elements.customerProfile.innerHTML = `<div class="empty-state"><strong>No customers yet</strong><span>Create a job to start building customer history.</span></div>`;
    return;
  }

  if (!rows.some((customer) => customer.id === state.selectedCustomerId)) {
    state.selectedCustomerId = rows[0].id;
  }

  elements.customerList.innerHTML = rows.map((customer) => `
    <button class="customer-card ${customer.id === state.selectedCustomerId ? "active" : ""}" type="button" data-customer-id="${escapeHtml(customer.id)}">
      <span>
        <strong>${escapeHtml(customer.name)}</strong>
        <small>${escapeHtml(customer.phone || "No phone")} · ${escapeHtml(customer.address || "No address")}</small>
      </span>
      <em>${customer.jobCount} job${customer.jobCount === 1 ? "" : "s"}</em>
    </button>
  `).join("");

  renderCustomerProfile(rows.find((customer) => customer.id === state.selectedCustomerId) || rows[0]);
}

function renderCustomers() {
  const rows = buildCustomersFromJobs(roleScopedJobs())
    .sort((a, b) => b.jobCount - a.jobCount);
  if (!rows.length) {
    state.selectedCustomerId = null;
    elements.customerList.innerHTML = "";
    elements.customerProfile.innerHTML = `<div class="empty-state"><strong>No customers yet</strong><span>Create a job to start building customer history.</span></div>`;
    return;
  }

  if (!rows.some((customer) => customer.id === state.selectedCustomerId)) {
    state.selectedCustomerId = rows[0].id;
  }

  elements.customerList.innerHTML = rows.map((customer) => `
    <button class="customer-card ${customer.id === state.selectedCustomerId ? "active" : ""}" type="button" data-customer-id="${escapeHtml(customer.id)}">
      <span>
        <strong>${escapeHtml(customer.name)}</strong>
        <small>${escapeHtml(customer.phone || "No phone")} - ${escapeHtml(customer.address || "No address")}</small>
      </span>
      <em>${customer.jobCount} job${customer.jobCount === 1 ? "" : "s"}${customer.unpaidBalance ? ` - ${formatMoney(customer.unpaidBalance)} due` : ""}</em>
    </button>
  `).join("");

  renderCustomerProfile(rows.find((customer) => customer.id === state.selectedCustomerId) || rows[0]);
}

function customerJobs(customerId) {
  return roleScopedJobs()
    .filter((job) => ensureJobDefaults(job).customerId === customerId)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
}

function customerMoneySummary(jobs = []) {
  return jobs.reduce((summary, job) => {
    const invoice = invoiceRecord(job);
    const collected = invoiceCollectedAmount(invoice);
    summary.totalBilled += jobReportingValue(job);
    summary.collected += collected;
    summary.balance += Math.max(0, invoice.amount - collected);
    summary.estimated += estimateAmount(job);
    return summary;
  }, { totalBilled: 0, collected: 0, balance: 0, estimated: 0 });
}

function customerAccountFlags(customer = {}, jobs = []) {
  const flags = [];
  const normalized = normalizeCustomerRecord(customer);
  if (normalized.accountFlag) flags.push(normalized.accountFlag);
  if (normalized.tags.includes("VIP")) flags.push("VIP");
  if (normalized.customerType === "commercial") flags.push("Commercial");
  if (jobs.some((job) => invoiceBalance(job) > 0)) flags.push("Open balance");
  if (jobs.some((job) => job.urgency === "urgent" || job.jobType === "emergency")) flags.push("Emergency history");
  if (customerServiceReminders(jobs).some((item) => item.status.tone === "due")) flags.push("Maintenance due");
  return [...new Set(flags)].slice(0, 6);
}

function customerActionJob(jobs = [], mode = "latest") {
  const sorted = [...jobs].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  if (mode === "balance") {
    return sorted.find((job) => invoiceBalance(job) > 0) || sorted[0] || null;
  }
  if (mode === "portal") {
    return sorted.find((job) => !["closed"].includes(job.status)) || sorted[0] || null;
  }
  return sorted[0] || null;
}

function customerCurrentJob(jobs = []) {
  const active = jobs.filter((job) => !["paid", "closed"].includes(job.status));
  if (!active.length) return null;
  const today = todayISO();
  const scheduledToday = active
    .filter((job) => isScheduled(job) && job.scheduleDate === today)
    .sort(sortBySchedule);
  const upcoming = active
    .filter((job) => isScheduled(job) && job.scheduleDate >= today)
    .sort(sortBySchedule);
  return active.find((job) => job.status === "in_progress")
    || scheduledToday[0]
    || active.find((job) => ["booked", "open"].includes(job.status) && !isScheduled(job))
    || upcoming[0]
    || active.find((job) => ["completed", "estimated", "invoiced"].includes(job.status))
    || active[0];
}

function customerServiceReminders(jobs = []) {
  return jobs
    .flatMap((job) => ensureJobDefaults(job).equipment.map((record) => {
      const equipment = normalizeEquipmentRecord(record);
      return {
        job,
        equipment,
        status: equipmentMaintenanceStatus(equipment),
        days: daysUntilISO(equipment.nextServiceDate)
      };
    }))
    .filter(({ equipment }) => equipment.nextServiceDate)
    .sort((a, b) => (a.days ?? 99999) - (b.days ?? 99999))
    .slice(0, 6);
}

function renderCustomerAccountForm(customer = {}) {
  const normalized = normalizeCustomerRecord(customer);
  return `
    <form class="customer-account-form" data-customer-profile-form="${escapeHtml(normalized.id)}">
      <label>
        Email
        <input name="email" type="email" value="${escapeHtml(normalized.email)}" placeholder="customer@example.com">
      </label>
      <label>
        Type
        ${backlineDropdown({
          id: `customer-type-${normalized.id}`,
          name: "customerType",
          value: normalized.customerType || "residential",
          options: [
            { value: "residential", label: "Residential" },
            { value: "commercial", label: "Commercial" },
            { value: "property manager", label: "Property manager" }
          ],
          placeholder: "Customer type",
          direction: "up"
        })}
      </label>
      <label>
        Preferred contact
        ${backlineDropdown({
          id: `customer-contact-${normalized.id}`,
          name: "preferredContact",
          value: normalized.preferredContact || "",
          options: [
            { value: "", label: "Not set" },
            { value: "phone", label: "Phone" },
            { value: "text", label: "Text" },
            { value: "email", label: "Email" }
          ],
          placeholder: "Preferred contact",
          direction: "up"
        })}
      </label>
      <label>
        Account flag
        <input name="accountFlag" value="${escapeHtml(normalized.accountFlag)}" placeholder="VIP, warranty, do-not-service">
      </label>
      <label class="wide">
        Tags
        <input name="tags" value="${escapeHtml(normalized.tags.join(", "))}" placeholder="VIP, maintenance plan, warranty">
      </label>
      <label class="wide">
        Account notes
        <textarea name="notes" rows="3" placeholder="Gate code, billing preference, pets, warranty notes...">${escapeHtml(normalized.notes)}</textarea>
      </label>
      <button class="secondary-button" type="submit">Save customer</button>
      ${state.customerProfileNotice?.customerId === normalized.id ? `<p class="customer-profile-notice">${escapeHtml(state.customerProfileNotice.message)}</p>` : ""}
    </form>
  `;
}

function renderCustomerServiceReminders(jobs = []) {
  const reminders = customerServiceReminders(jobs);
  if (!reminders.length) {
    return '<div class="empty-note">No service reminders yet. Add equipment with a next service date to build a maintenance pipeline.</div>';
  }
  return `
    <div class="customer-reminder-list">
      ${reminders.map(({ job, equipment, status }) => `
        <article class="customer-reminder-card ${escapeHtml(status.tone)}">
          <div>
            <span>${escapeHtml(status.label)}</span>
            <strong>${escapeHtml(equipmentLabel(equipment))}</strong>
            <small>${escapeHtml([equipment.location, status.detail].filter(Boolean).join(" - "))}</small>
          </div>
          ${can("createJob") ? `<button class="utility-button" type="button" data-create-equipment-maintenance="${escapeHtml(equipment.id)}" data-source-job-id="${escapeHtml(job.id)}">Create maintenance</button>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function customerTimelineDate(value) {
  const date = new Date(value || 0);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function customerTimelineDayKey(value) {
  const date = customerTimelineDate(value);
  if (!date.getTime()) return "unknown";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function customerTimelineTimeLabel(value) {
  const date = customerTimelineDate(value);
  if (!date.getTime()) return "No timestamp";
  return date.toLocaleString([], { hour: "numeric", minute: "2-digit" });
}

function pushCustomerTimelineEvent(events, job, event) {
  events.push({
    id: `${job.id}-${event.type}-${event.createdAt || createId()}`,
    jobId: job.id,
    jobName: job.name,
    issue: job.issue,
    ...event
  });
}

function customerActivityTimelineEvents(jobs = []) {
  const jobIds = new Set(jobs.map((job) => ensureJobDefaults(job).id));
  const hiddenLabels = new Set(["Message added", "Communication updated", "File added"]);
  return state.activityEvents
    .filter((event) => event.job?.id && jobIds.has(event.job.id))
    .map((event) => simplifyActivityEvent(event))
    .filter((event) => !hiddenLabels.has(event.label))
    .map((event) => ({
      id: `activity-${event.id}`,
      jobId: event.job.id,
      jobName: event.job.customerName || "",
      issue: event.job.issue || "",
      type: event.type || "updated",
      label: event.label || "Activity recorded",
      detail: [
        event.detail || event.job.issue || "Customer record updated",
        event.actor?.name ? `Changed by ${event.actor.name}` : ""
      ].filter(Boolean).join(" - "),
      createdAt: event.createdAt
    }));
}

function customerTimelineEvents(jobs = [], options = {}) {
  const events = [];
  jobs.forEach((job) => {
    ensureJobDefaults(job);
    pushCustomerTimelineEvent(events, job, {
      type: "job",
      label: "Job created",
      detail: `${job.trade} / ${jobTypeLabel(job)} - ${job.issue}`,
      createdAt: job.createdAt
    });
    if (isScheduled(job)) {
      pushCustomerTimelineEvent(events, job, {
        type: "schedule",
        label: "Scheduled visit",
        detail: scheduleText(job, { includeYear: true }),
        createdAt: `${job.scheduleDate}T${job.startTime || "09:00"}:00`
      });
    }
    normalizeEstimateHistory(job.estimateHistory || [], job).forEach((estimate) => {
      pushCustomerTimelineEvent(events, job, {
        type: "estimate",
        label: `Estimate ${estimateRevisionLabel(estimate.status)}`,
        detail: `${formatMoney(estimate.amount)} ${estimate.packageName}${estimate.depositRequested ? `, ${formatMoney(estimate.depositRequested)} deposit` : ""}`,
        createdAt: estimate.updatedAt || estimate.createdAt
      });
    });
    const invoice = invoiceRecord(job);
    if (invoice.amount > 0 || invoice.updatedAt) {
      pushCustomerTimelineEvent(events, job, {
        type: "invoice",
        label: `Invoice ${invoiceStatusLabel(invoice.status)}`,
        detail: `${invoice.number} - ${formatMoney(invoice.amount)} total, ${formatMoney(invoiceBalance(job))} due`,
        createdAt: invoice.updatedAt || job.createdAt
      });
    }
    paymentRecords(invoice).forEach((payment) => {
      pushCustomerTimelineEvent(events, job, {
        type: "payment",
        label: `${paymentKindLabel(payment.kind)} recorded`,
        detail: `${formatMoney(payment.amount)} by ${paymentMethodLabel(payment.method || invoice.paymentMethod)}`,
        createdAt: payment.paidAt || payment.createdAt
      });
    });
    const paidInFullPayment = invoicePaidInFullTimelinePayment(invoice);
    if (paidInFullPayment) {
      pushCustomerTimelineEvent(events, job, {
        type: "paid",
        label: "Invoice paid in full",
        detail: `${invoice.number} - ${formatMoney(invoice.amount)} total received`,
        createdAt: paidInFullPayment.paidAt || paidInFullPayment.createdAt
      });
    }
    (job.files || []).forEach((file) => {
      const category = fileCategory(file);
      pushCustomerTimelineEvent(events, job, {
        type: category,
        label: `${fileCategoryLabel(category)} file added`,
        detail: file.name || file.note || "Job file",
        createdAt: file.createdAt
      });
    });
    job.messages.map(normalizeJobMessage).forEach((message) => {
      pushCustomerTimelineEvent(events, job, {
        type: message.direction === "in" || message.direction === "out" ? "message" : "note",
        label: message.direction === "in" ? "Customer reply" : message.direction === "out" ? "Outbound message" : "Note added",
        detail: message.body,
        createdAt: message.createdAt
      });
    });
  });
  events.push(...customerActivityTimelineEvents(jobs));
  const sort = options.sort || state.customerTimelineSort || "newest";
  return events.sort((a, b) => {
    const diff = customerTimelineDate(a.createdAt) - customerTimelineDate(b.createdAt);
    return sort === "oldest" ? diff : -diff;
  });
}

function groupCustomerTimelineEvents(events = []) {
  return events.reduce((groups, event) => {
    const key = customerTimelineDayKey(event.createdAt);
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
    return groups;
  }, {});
}

function customerTimelineTone(type = "") {
  if (["payment", "approvals", "paid"].includes(type)) return "paid";
  if (["invoice", "billing", "estimate"].includes(type)) return "estimated";
  if (["message", "note"].includes(type)) return "booked";
  if (["schedule", "job", "created", "updated", "status"].includes(type)) return "open";
  return "updated";
}

function customerTimelineSummary(events = [], jobs = []) {
  const jobText = `${jobs.length} job${jobs.length === 1 ? "" : "s"}`;
  const eventText = `${events.length} event${events.length === 1 ? "" : "s"}`;
  const sorted = [...events].sort((a, b) => customerTimelineDate(b.createdAt) - customerTimelineDate(a.createdAt));
  const latest = sorted[0]?.createdAt ? `Latest ${activityDayLabel(customerTimelineDayKey(sorted[0].createdAt))}` : "No recent activity";
  return `${eventText} across ${jobText} - ${latest}`;
}

function renderCustomerTimeline(jobs = []) {
  const sort = state.customerTimelineSort === "oldest" ? "oldest" : "newest";
  const events = customerTimelineEvents(jobs, { sort }).slice(0, 80);
  if (!events.length) {
    return '<div class="empty-note">Customer activity will appear as jobs, files, payments, and messages are added.</div>';
  }
  const grouped = groupCustomerTimelineEvents(events);
  const keys = Object.keys(grouped).sort((a, b) => {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return sort === "oldest" ? a.localeCompare(b) : b.localeCompare(a);
  });
  const timelineOwnerKey = state.selectedCustomerId || jobs.map((job) => job.id).join(":") || "customer";
  return `
    <div class="customer-timeline">
      <div class="customer-timeline-summary">
        <span>${escapeHtml(customerTimelineSummary(events, jobs))}</span>
        <div class="customer-timeline-controls" role="group" aria-label="Customer timeline sort">
          <button class="${sort === "newest" ? "active" : ""}" type="button" data-customer-timeline-sort="newest">Newest first</button>
          <button class="${sort === "oldest" ? "active" : ""}" type="button" data-customer-timeline-sort="oldest">Oldest first</button>
        </div>
      </div>
      ${keys.map((key, index) => `
        <details class="customer-timeline-day" ${detailExpandedAttributes(`customer:${timelineOwnerKey}:timeline:${key}`, index === 0)}>
          <summary class="customer-timeline-day-header">
            <h4>${escapeHtml(activityDayLabel(key))}</h4>
            <span>
              ${grouped[key].length} event${grouped[key].length === 1 ? "" : "s"}
              <b aria-hidden="true">+</b>
            </span>
          </summary>
          <div class="customer-timeline-events">
            ${grouped[key].map((event) => `
              <button class="customer-timeline-event" type="button" data-job-id="${escapeHtml(event.jobId)}">
                <span class="timeline-dot ${escapeHtml(customerTimelineTone(event.type))}"></span>
                <span>
                  <strong>${escapeHtml(event.label)}</strong>
                  <small>${escapeHtml(event.detail || event.issue || "No detail recorded")}</small>
                  <small class="timeline-job-label">${escapeHtml(event.issue || event.jobName || "Customer record")}</small>
                </span>
                <em>${escapeHtml(customerTimelineTimeLabel(event.createdAt))}</em>
              </button>
            `).join("")}
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function renderCustomerProfileLegacy(customer) {
  const jobs = customerJobs(customer.id);
  const currentJob = customerCurrentJob(jobs);
  const lastJob = jobs[0];
  const preferredTrade = jobs.reduce((counts, job) => {
    counts[job.trade] = (counts[job.trade] || 0) + 1;
    return counts;
  }, {});
  const topTrade = Object.entries(preferredTrade).sort((a, b) => b[1] - a[1])[0]?.[0] || "Not enough history";
  const money = customerMoneySummary(jobs);
  const fileCount = jobs.reduce((sum, job) => sum + (job.files?.length || 0), 0);

  elements.customerProfile.innerHTML = `
    <div class="customer-profile-header">
      <div>
        <h3>${escapeHtml(customer.name)}</h3>
        <p>${escapeHtml(customer.address || "No address on file")}</p>
      </div>
      <div class="customer-quick-actions">
        ${can("createJob") ? `<button class="primary-button" type="button" data-create-customer-job="${escapeHtml(customer.id)}">Create job</button>` : ""}
        ${currentJob ? `<button class="secondary-button" type="button" data-job-id="${escapeHtml(currentJob.id)}" aria-label="Open current job for ${escapeHtml(customer.name)}">Open current job</button>` : ""}
      </div>
    </div>
    <div class="customer-demographics">
      <div><span>Phone</span><strong>${escapeHtml(customer.phone || "Not set")}</strong></div>
      <div><span>Site contact</span><strong>${escapeHtml(customer.siteContact || customer.name || "Not set")}</strong></div>
      <div><span>Preferred trade</span><strong>${escapeHtml(topTrade)}</strong></div>
      <div><span>First seen</span><strong>${escapeHtml(customer.firstJobAt ? new Date(customer.firstJobAt).toLocaleDateString() : "Not set")}</strong></div>
      <div><span>Last job</span><strong>${escapeHtml(lastJob ? `${statusLabel(lastJob.status)} · ${new Date(lastJob.createdAt).toLocaleDateString()}` : "None")}</strong></div>
      <div><span>Next visit</span><strong>${escapeHtml(nextJob ? scheduleText(nextJob, { includeYear: true }) : "None scheduled")}</strong></div>
    </div>
    <div class="customer-stats">
      <div><span>Total billed</span><strong>${escapeHtml(formatMoney(money.totalBilled))}</strong></div>
      <div><span>Collected</span><strong>${escapeHtml(formatMoney(money.collected))}</strong></div>
      <div><span>Open balance</span><strong>${escapeHtml(formatMoney(money.balance))}</strong></div>
      <div><span>Estimated</span><strong>${escapeHtml(formatMoney(money.estimated))}</strong></div>
      <div><span>Jobs</span><strong>${customer.jobCount}</strong></div>
      <div><span>Files</span><strong>${fileCount}</strong></div>
    </div>
    <div class="customer-profile-section">
      <h4>Customer timeline</h4>
      ${renderCustomerTimeline(jobs)}
    </div>
    <div class="customer-profile-section">
      <h4>Equipment and property</h4>
      ${renderCustomerEquipment(customer.id)}
    </div>
    <div class="customer-profile-section">
      <h4>Job history</h4>
      <div class="customer-history-list">
        ${jobs.map((job) => `
          <button class="customer-history-row" type="button" data-job-id="${escapeHtml(job.id)}">
            <span class="history-date">${escapeHtml(new Date(job.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }))}</span>
            <span class="history-main">
              <strong>${escapeHtml(job.issue)}</strong>
              <small>${escapeHtml(job.trade)} / ${escapeHtml(jobTypeLabel(job))} · ${escapeHtml(scheduleText(job))}</small>
            </span>
            <span class="history-meta">
              <b class="pill ${escapeHtml(job.status)}">${escapeHtml(statusLabel(job.status))}</b>
              <em>${escapeHtml(formatMoney(job.status === "estimated" ? estimateAmount(job) : invoiceRecord(job).amount || estimateAmount(job)))}</em>
            </span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function renderCustomerProfile(customer) {
  const normalizedCustomer = normalizeCustomerRecord(customer);
  const jobs = customerJobs(normalizedCustomer.id);
  const nextJob = jobs
    .filter((job) => isScheduled(job) && job.scheduleDate >= todayISO() && !["closed", "paid"].includes(job.status))
    .sort(sortBySchedule)[0];
  const lastJob = jobs[0];
  const preferredTrade = jobs.reduce((counts, job) => {
    counts[job.trade] = (counts[job.trade] || 0) + 1;
    return counts;
  }, {});
  const topTrade = Object.entries(preferredTrade).sort((a, b) => b[1] - a[1])[0]?.[0] || "Not enough history";
  const money = customerMoneySummary(jobs);
  const fileCount = jobs.reduce((sum, job) => sum + (job.files?.length || 0), 0);
  const flags = customerAccountFlags(normalizedCustomer, jobs);
  const portalJob = customerActionJob(jobs, "portal");
  const balanceJob = customerActionJob(jobs, "balance");
  const messageJob = customerActionJob(jobs, "latest");
  const currentJob = customerCurrentJob(jobs);

  elements.customerProfile.innerHTML = `
    <div class="customer-profile-header">
      <div>
        <h3>${escapeHtml(normalizedCustomer.name)}</h3>
        <p>${escapeHtml(normalizedCustomer.address || "No address on file")}</p>
        <div class="customer-flag-list">
          ${flags.length ? flags.map((flag) => `<span>${escapeHtml(flag)}</span>`).join("") : '<span>No account flags</span>'}
        </div>
      </div>
      <div class="customer-quick-actions">
        ${can("createJob") ? `<button class="primary-button" type="button" data-create-customer-job="${escapeHtml(normalizedCustomer.id)}">Create job</button>` : ""}
        ${portalJob && can("portal") ? `<button class="secondary-button" type="button" data-customer-portal="${escapeHtml(normalizedCustomer.id)}">Portal link</button>` : ""}
        ${messageJob && can("portal-update") ? `<button class="secondary-button" type="button" data-customer-message="${escapeHtml(normalizedCustomer.id)}">Send update</button>` : ""}
        ${balanceJob && invoiceBalance(balanceJob) > 0 && can("payment-request") ? `<button class="secondary-button" type="button" data-customer-payment="${escapeHtml(normalizedCustomer.id)}">Request payment</button>` : ""}
        ${currentJob ? `<button class="secondary-button" type="button" data-job-id="${escapeHtml(currentJob.id)}" aria-label="Open current job for ${escapeHtml(normalizedCustomer.name)}">Open current job</button>` : ""}
      </div>
    </div>
    <div class="customer-demographics">
      <div><span>Phone</span><strong>${escapeHtml(normalizedCustomer.phone || "Not set")}</strong></div>
      <div><span>Email</span><strong>${escapeHtml(normalizedCustomer.email || "Not set")}</strong></div>
      <div><span>Site contact</span><strong>${escapeHtml(normalizedCustomer.siteContact || normalizedCustomer.name || "Not set")}</strong></div>
      <div><span>Type</span><strong>${escapeHtml(normalizedCustomer.customerType)}</strong></div>
      <div><span>Preferred contact</span><strong>${escapeHtml(normalizedCustomer.preferredContact || "Not set")}</strong></div>
      <div><span>Preferred trade</span><strong>${escapeHtml(topTrade)}</strong></div>
      <div><span>First seen</span><strong>${escapeHtml(normalizedCustomer.firstJobAt ? new Date(normalizedCustomer.firstJobAt).toLocaleDateString() : "Not set")}</strong></div>
      <div><span>Last job</span><strong>${escapeHtml(lastJob ? `${statusLabel(lastJob.status)} - ${new Date(lastJob.createdAt).toLocaleDateString()}` : "None")}</strong></div>
      <div><span>Next visit</span><strong>${escapeHtml(nextJob ? scheduleText(nextJob, { includeYear: true }) : "None scheduled")}</strong></div>
    </div>
    <div class="customer-stats">
      <div><span>Total billed</span><strong>${escapeHtml(formatMoney(money.totalBilled))}</strong></div>
      <div><span>Collected</span><strong>${escapeHtml(formatMoney(money.collected))}</strong></div>
      <div><span>Open balance</span><strong>${escapeHtml(formatMoney(money.balance))}</strong></div>
      <div><span>Estimated</span><strong>${escapeHtml(formatMoney(money.estimated))}</strong></div>
      <div><span>Jobs</span><strong>${normalizedCustomer.jobCount}</strong></div>
      <div><span>Files</span><strong>${fileCount}</strong></div>
    </div>
    <div class="customer-profile-section">
      <div class="section-heading">
        <div>
          <h4>Account profile</h4>
          <p>Customer-level details that stay with the account across jobs.</p>
        </div>
      </div>
      ${renderCustomerAccountForm(normalizedCustomer)}
    </div>
    <div class="customer-profile-section">
      <div class="section-heading">
        <div>
          <h4>Service reminders</h4>
          <p>Upcoming equipment work and maintenance opportunities.</p>
        </div>
      </div>
      ${renderCustomerServiceReminders(jobs)}
    </div>
    <div class="customer-profile-section">
      <h4>Customer timeline</h4>
      ${renderCustomerTimeline(jobs)}
    </div>
    <div class="customer-profile-section">
      <h4>Equipment and property</h4>
      ${renderCustomerEquipment(normalizedCustomer.id)}
    </div>
    <div class="customer-profile-section">
      <h4>Job history</h4>
      <div class="customer-history-list">
        ${jobs.map((job) => `
          <button class="customer-history-row" type="button" data-job-id="${escapeHtml(job.id)}">
            <span class="history-date">${escapeHtml(new Date(job.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }))}</span>
            <span class="history-main">
              <strong>${escapeHtml(job.issue)}</strong>
              <small>${escapeHtml(job.trade)} / ${escapeHtml(jobTypeLabel(job))} - ${escapeHtml(scheduleText(job))}</small>
            </span>
            <span class="history-meta">
              <b class="pill ${escapeHtml(job.status)}">${escapeHtml(statusLabel(job.status))}</b>
              <em>${escapeHtml(formatMoney(job.status === "estimated" ? estimateAmount(job) : invoiceRecord(job).amount || estimateAmount(job)))}</em>
            </span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function openCustomerJobModal(customerId) {
  const customer = buildCustomersFromJobs(roleScopedJobs()).find((item) => item.id === customerId);
  if (!customer || !can("createJob")) return;
  elements.jobForm.reset();
  elements.jobForm.elements.name.value = customer.name || "";
  elements.jobForm.elements.phone.value = customer.phone || "";
  elements.jobForm.elements.address.value = customer.address || "";
  elements.jobForm.elements.siteContact.value = customer.siteContact || customer.name || "";
  renderNewJobPickers();
  renderJobTemplatePicker(suggestedJobTemplateKeyFromForm(elements.jobForm));
  elements.jobModal.showModal();
}

function saveCustomerProfile(customerId, data) {
  const current = buildCustomersFromJobs(roleScopedJobs()).find((customer) => customer.id === customerId);
  if (!current) return;
  const updated = normalizeCustomerRecord({
    ...current,
    email: data.get("email"),
    customerType: data.get("customerType"),
    preferredContact: data.get("preferredContact"),
    accountFlag: data.get("accountFlag"),
    tags: data.get("tags"),
    notes: data.get("notes"),
    updatedAt: new Date().toISOString()
  });
  state.customers = buildCustomersFromJobs(state.jobs).map((customer) => customer.id === customerId
    ? mergeCustomerRecords(customer, updated)
    : customer);
  state.selectedCustomerId = customerId;
  state.customerProfileNotice = {
    customerId,
    message: `Customer details saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}.`
  };
  save();
  renderCustomers();
}

function openCustomerAction(customerId, action, mode = "latest") {
  const jobs = customerJobs(customerId);
  const job = customerActionJob(jobs, mode);
  if (!job) return false;
  state.selectedJobId = job.id;
  return openActionModal(action);
}

async function copyCustomerPortalLink(customerId) {
  const job = customerActionJob(customerJobs(customerId), "portal");
  if (!job) return;
  let url = "";
  updateJobById(job.id, (nextJob) => {
    ensureJobPortalToken(nextJob);
    url = customerPortalUrl(nextJob);
    addJobMessage(nextJob, {
      direction: "note",
      body: `Customer portal link prepared from customer account: ${url}`
    });
    return nextJob;
  });
  try {
    await navigator.clipboard.writeText(url);
    state.jobActionNotice = { jobId: job.id, message: "Customer portal link copied.", url };
  } catch {
    state.jobActionNotice = { jobId: job.id, message: "Customer portal link is ready. Copying was blocked by the browser.", url };
    showToast("Portal link ready", "Copying was blocked. The link is shown in the selected job notice.", "warning");
  }
  state.selectedCustomerId = customerId;
  render();
}

function renderTechnicianOptions(selectedValue = "") {
  if (!elements.technicianOptions) return;
  const currentInput = elements.technicianOptions.querySelector('input[name="technician"]');
  const selected = normalizeTechnician(selectedValue || currentInput?.value || "To Be Determined");
  elements.technicianOptions.innerHTML = backlineDropdown({
    id: "new-job-technician",
    name: "technician",
    value: selected,
    options: technicianOptionItems(selected),
    placeholder: "Technician",
    direction: "up"
  });
}

function technicianInitials(name) {
  const value = normalizeTechnician(name);
  if (value === "To Be Determined") return "TBD";
  const [first = "", rest = ""] = value.split(".");
  const firstInitial = first.trim().charAt(0);
  const secondInitial = rest.trim().charAt(0);
  return `${firstInitial}${secondInitial || ""}`.toUpperCase() || "TBD";
}

function technicianPicker(job) {
  const selected = normalizeTechnician(job.technician);
  const isOpen = state.openTechnicianPicker === job.id;
  const options = new Set(technicianSuggestions());
  options.add(selected);
  return `
    <div class="technician-picker ${isOpen ? "open" : ""}">
      <button class="technician-picker-button" type="button" data-toggle-technician-picker="${escapeHtml(job.id)}" aria-expanded="${isOpen}">
        <span title="${escapeHtml(selected)}">${escapeHtml(technicianInitials(selected))}</span>
      </button>
      ${isOpen ? `
        <div class="technician-picker-menu">
          ${[...options].filter(Boolean).sort((a, b) => a.localeCompare(b)).map((name) => `
            <button type="button" data-technician-option="${escapeHtml(name)}">${escapeHtml(name)}</button>
          `).join("")}
        </div>
      ` : ""}
    </div>
  `;
}

function renderRoleGuide() {
  const roles = [
    { slug: "owner", editable: false, removable: false },
    { slug: "admin", editable: true, removable: false },
    { slug: "dispatcher", editable: true, removable: false },
    { slug: "tech", editable: true, removable: false },
    ...companySettings().customRoles.map((role) => ({ slug: role.slug, editable: true, removable: true }))
  ];
  elements.roleGuide.innerHTML = roles
    .map((role) => `
      <div class="role-card">
        <div>
          <strong>${escapeHtml(roleName(role.slug))}</strong>
          <span>${escapeHtml(roleSummary(role.slug))}</span>
        </div>
        ${role.editable ? `
          <div class="role-card-actions">
            <button class="utility-button" type="button" data-edit-custom-role="${escapeHtml(role.slug)}">Edit</button>
            ${role.removable ? `<button class="invoice-remove-button" type="button" data-remove-custom-role="${escapeHtml(role.slug)}">Remove</button>` : ""}
          </div>
        ` : ""}
      </div>
    `)
    .join("");
}

function renderTeamAccessSummary() {
  if (!elements.teamAccessSummary) return;
  elements.teamAccessSummary.innerHTML = roleAccessSummaryMarkup(currentRole(), {
    title: "Your access",
    note: state.currentUser?.email ? `Signed in as ${accountDisplayName()}` : roleSummary(currentRole())
  });
}

function renderRolePreview() {
  if (!elements.rolePreviewSelect || !elements.rolePreviewPanel) return;
  const roles = allRoleChoices({ includeOwner: true });
  const selected = roles.some((role) => role.slug === state.rolePreviewSlug)
    ? state.rolePreviewSlug
    : currentRole();
  state.rolePreviewSlug = selected;
  renderRolePreviewPicker(selected);
  elements.rolePreviewPanel.innerHTML = roleOperationalPreviewMarkup(selected);
}

function renderTeam() {
  if (!elements.teamList) return;
  const members = normalizedTeamMembers();
  const invites = state.teamInvites || [];
  const roleChoices = allAssignableRoles();
  const canManage = can("manageTeam");
  if (elements.teamHeaderSubtitle) {
    elements.teamHeaderSubtitle.textContent = canManage
      ? "Invite teammates, set roles, and assign field work"
      : "Team directory and role visibility";
  }
  renderTeamAccessSummary();

  elements.teamList.innerHTML = `
    <div class="team-section">
      <h3>Members</h3>
      ${members.map((member) => `
        <div class="team-row ${canManage ? "" : "readonly"}">
          <span>
            <strong>${escapeHtml(teamMemberDisplayLabel(member))}</strong>
            <small>${escapeHtml(member.isCurrentUser ? "Signed in now" : roleSummary(member.role))}</small>
          </span>
          ${canManage ? `
            <div class="member-role-picker ${member.role === "owner" ? "disabled-picker" : ""}" data-member-role-picker="${escapeHtml(member.userId)}">
              ${backlineDropdown({
                id: `member-role-${member.userId}`,
                name: "memberRole",
                value: member.role,
                options: (member.role === "owner" ? [{ slug: "owner", label: "Owner" }] : roleChoices).map((role) => ({ value: role.slug, label: role.label })),
                direction: "up"
              })}
            </div>
            ${member.role === "owner" ? "" : `<button class="utility-button" type="button" data-remove-member="${escapeHtml(member.userId)}" ${member.isCurrentUser ? "disabled" : ""}>Remove</button>`}
          ` : `
            <span class="team-role-badge">${escapeHtml(roleName(member.role))}</span>
          `}
        </div>
      `).join("")}
    </div>
    ${canManage ? `<div class="team-section">
      <h3>Pending invites</h3>
      ${invites.length ? invites.map((invite) => `
        <div class="team-row pending">
          <span>
            <strong>${escapeHtml(displayPersonName(invite.email))}</strong>
            <small>${escapeHtml(roleName(invite.role))} invite waiting for signup. Backline saves the invite; use Send email or Copy instructions.</small>
          </span>
          <span class="pill estimated">Pending</span>
          <div class="team-actions">
            <button class="utility-button invite-send-button" type="button" data-send-invite-email="${escapeHtml(invite.id)}">Send email</button>
            <button class="utility-button" type="button" data-copy-invite="${escapeHtml(invite.id)}">Copy instructions</button>
            <button class="utility-button" type="button" data-revoke-invite="${escapeHtml(invite.id)}">Revoke</button>
          </div>
        </div>
      `).join("") : '<div class="empty-state compact-empty"><strong>No pending invites</strong><span>Create an invite when you are ready to add someone.</span></div>'}
    </div>` : ""}
  `;

  document.querySelector("#view-team .team-layout")?.classList.toggle("readonly", !canManage);
  const teamAdminPanel = document.querySelector("[data-team-admin-panel]");
  if (teamAdminPanel) {
    teamAdminPanel.hidden = !canManage;
  }

  const selectedInviteRole = elements.teamInviteForm?.elements.role?.value;
  renderTeamInviteRolePicker(roleDefinition(selectedInviteRole) && selectedInviteRole !== "owner" ? selectedInviteRole : "tech");
  elements.teamInviteForm.querySelectorAll("input, button").forEach((field) => {
    field.disabled = !canManage || !state.secureMode;
  });
  elements.teamInviteStatus.textContent = "";
  elements.teamInviteStatus.hidden = true;
  renderRoleGuide();
  renderRolePreview();
  renderCustomRoleForm();
}

function render() {
  if (document.body.classList.contains("approval-mode")) return;
  updateRoleUI();
  renderTopbar();
  renderNavBadges();
  renderNewJobPickers();
  renderAutomations();
  renderAttention();
  renderBetaReadiness();
  renderDashboardPanels();
  renderStats();
  renderJobs();
  renderDetail();
  renderSchedule();
  renderMetrics();
  renderMoney();
  renderPricebook();
  renderInventoryLite();
  renderFollowups();
  renderCommunications();
  renderJobsDatabase();
  renderCustomers();
  renderCustomerSearchResults();
  renderTeam();
  renderActivity();
  renderCreatorConsole();
}

function createJob(formData) {
  const now = new Date();
  const job = {
    id: createId(),
    name: formData.get("name").trim(),
    phone: formatPhoneNumber(formData.get("phone")),
    address: formData.get("address").trim(),
    trade: formData.get("trade"),
    jobType: formData.get("jobType"),
    urgency: formData.get("urgency"),
    issue: formData.get("issue").trim(),
    scheduleDate: formData.get("scheduleDate"),
    startTime: formData.get("startTime"),
    durationMinutes: normalizeDurationMinutes(formData.get("durationMinutes")),
    endTime: formData.get("endTime") || "",
    technician: normalizeTechnician(formData.get("technician")),
    siteContact: formData.get("siteContact").trim(),
    partsNote: formData.get("partsNote").trim(),
    parts: [],
    equipment: [],
    files: [],
    notifications: [],
    tasks: [],
    templateKey: String(formData.get("jobTemplateKey") || "").trim() === "__auto"
      ? ""
      : String(formData.get("jobTemplateKey") || "").trim(),
    assignmentSeenBy: {},
    approvalStatus: "not_sent",
    estimateHistory: [],
    scopeChanges: [],
    fieldChecklist: {
      diagnosis: false,
      photos: false,
      signature: false
    },
    window: "",
    value: normalizeValue(formData.get("value")),
    status: formData.get("scheduleDate") && formData.get("startTime") ? "booked" : "open",
    createdAt: now.toISOString(),
    messages: []
  };
  job.customerId = customerIdFromPhone(job.phone, job.id);
  const appliedTemplate = applyJobTemplate(job, { forceMetadata: true });
  recordAssignmentUpdate(job);

  if (state.automations.missedCall) {
    job.messages.push({
      direction: "out",
      body: "Thanks for contacting us. Your request is in our system and the team will follow up shortly.",
      createdAt: now.toLocaleString()
    });
  }
  if (appliedTemplate.added) {
    job.messages.push({
      direction: "note",
      body: `${appliedTemplate.template.title} template applied with ${appliedTemplate.added} default task${appliedTemplate.added === 1 ? "" : "s"}.`,
      createdAt: now.toLocaleString(),
      createdBy: "Backline"
    });
  }

  state.jobs.unshift(job);
  state.selectedJobId = job.id;
  recordActivity({
    type: "created",
    label: "Job created",
    detail: job.issue,
    job,
    after: cloneForActivity(job)
  });
  save();
  render();
}

function createMaintenanceJobFromEquipment(sourceJobId, equipmentId) {
  if (!can("createJob")) return false;
  const sourceJob = ensureJobDefaults(state.jobs.find((job) => job.id === sourceJobId) || {});
  const equipment = sourceJob.equipment?.map(normalizeEquipmentRecord).find((record) => record.id === equipmentId);
  if (!sourceJob.id || !equipment) return false;
  const existing = findOpenMaintenanceJobForEquipment(sourceJob, equipment.id);
  if (existing) {
    state.selectedJobId = existing.id;
    activateView("inbox");
    render();
    return true;
  }
  const now = new Date();
  const job = ensureJobDefaults({
    id: createId(),
    name: sourceJob.name,
    phone: sourceJob.phone,
    address: sourceJob.address,
    trade: sourceJob.trade || "HVAC",
    jobType: "maintenance",
    urgency: daysUntilISO(equipment.nextServiceDate) !== null && daysUntilISO(equipment.nextServiceDate) <= 0 ? "urgent" : "normal",
    issue: `Maintenance service for ${equipmentLabel(equipment)}${equipment.location ? ` at ${equipment.location}` : ""}`,
    scheduleDate: "",
    startTime: "",
    durationMinutes: normalizeDurationMinutes(sourceJob.durationMinutes || DEFAULT_JOB_DURATION_MINUTES),
    endTime: "",
    technician: "To Be Determined",
    siteContact: sourceJob.siteContact || sourceJob.name,
    partsNote: [equipment.model ? `Model ${equipment.model}` : "", equipment.serial ? `Serial ${equipment.serial}` : ""].filter(Boolean).join(" - "),
    parts: [],
    equipment: [{
      ...equipment,
      sourceJobId: sourceJob.id,
      updatedAt: new Date().toISOString(),
      updatedBy: accountDisplayName()
    }],
    files: [],
    notifications: [],
    tasks: [],
    assignmentSeenBy: {},
    approvalStatus: "not_sent",
    estimateHistory: [],
    scopeChanges: [],
    fieldChecklist: {
      diagnosis: false,
      photos: false,
      signature: false
    },
    window: "",
    value: 0,
    status: "open",
    createdAt: now.toISOString(),
    messages: [{
      direction: "note",
      body: `Maintenance job created from ${equipmentLabel(equipment)}. ${equipmentServiceSummary(equipment)}.`,
      createdAt: now.toLocaleString(),
      createdBy: accountDisplayName()
    }],
    sourceEquipmentId: equipment.id
  });
  job.customerId = sourceJob.customerId || customerIdFromPhone(job.phone, job.id);
  const appliedTemplate = applyJobTemplate(job, { forceMetadata: true });
  if (appliedTemplate.added) {
    job.messages.push({
      direction: "note",
      body: `${appliedTemplate.template.title} template applied with ${appliedTemplate.added} default task${appliedTemplate.added === 1 ? "" : "s"}.`,
      createdAt: now.toLocaleString(),
      createdBy: "Backline"
    });
  }
  state.jobs.unshift(job);
  state.selectedJobId = job.id;
  recordActivity({
    type: "created",
    label: "Maintenance job created",
    detail: `${job.name} - ${equipmentLabel(equipment)}`,
    job,
    after: cloneForActivity(job)
  });
  save();
  activateView("inbox");
  render();
  return true;
}

function updateSelectedJob(updater) {
  const index = state.jobs.findIndex((job) => job.id === state.selectedJobId);
  if (index < 0) return;
  const detailScrollPosition = captureDetailScrollPosition();
  const before = cloneForActivity(ensureJobDefaults(state.jobs[index]));
  const nextJob = updater(ensureJobDefaults({
    ...state.jobs[index],
    messages: [...state.jobs[index].messages].map(normalizeJobMessage),
    estimate: { ...(state.jobs[index].estimate || {}) },
    estimateHistory: [...(state.jobs[index].estimateHistory || [])].map((record) => ({ ...record })),
    invoice: { ...(state.jobs[index].invoice || {}), lineItems: [...(state.jobs[index].invoice?.lineItems || [])], payments: [...(state.jobs[index].invoice?.payments || [])] },
    paymentRequests: [...(state.jobs[index].paymentRequests || [])],
    parts: [...(state.jobs[index].parts || [])],
    reservations: [...(state.jobs[index].reservations || [])],
    equipment: [...(state.jobs[index].equipment || [])].map(normalizeEquipmentRecord),
    files: [...(state.jobs[index].files || [])],
    notifications: [...(state.jobs[index].notifications || [])],
    tasks: cloneJobTasks(state.jobs[index].tasks),
    assignmentSeenBy: { ...(state.jobs[index].assignmentSeenBy || {}) },
    scopeChanges: [...(state.jobs[index].scopeChanges || [])],
    fieldChecklist: { ...(state.jobs[index].fieldChecklist || {}) }
  })) || state.jobs[index];
  state.jobs[index] = nextJob;
  const after = cloneForActivity(ensureJobDefaults(nextJob));
  const changes = summarizeJobChanges(before, after);
  if (changes.length) {
    recordActivity({ before, after, job: after, changes });
  }
  save();
  render();
  restoreDetailScrollPosition(detailScrollPosition);
}

function updateJobById(jobId, updater) {
  const index = state.jobs.findIndex((job) => job.id === jobId);
  if (index < 0) return false;
  const before = cloneForActivity(ensureJobDefaults(state.jobs[index]));
  const job = ensureJobDefaults({
    ...state.jobs[index],
    messages: [...(state.jobs[index].messages || [])].map(normalizeJobMessage),
    estimate: { ...(state.jobs[index].estimate || {}) },
    estimateHistory: [...(state.jobs[index].estimateHistory || [])].map((record) => ({ ...record })),
    invoice: { ...(state.jobs[index].invoice || {}), lineItems: [...(state.jobs[index].invoice?.lineItems || [])], payments: [...(state.jobs[index].invoice?.payments || [])] },
    paymentRequests: [...(state.jobs[index].paymentRequests || [])],
    parts: [...(state.jobs[index].parts || [])],
    reservations: [...(state.jobs[index].reservations || [])],
    equipment: [...(state.jobs[index].equipment || [])].map(normalizeEquipmentRecord),
    files: [...(state.jobs[index].files || [])],
    notifications: [...(state.jobs[index].notifications || [])],
    tasks: cloneJobTasks(state.jobs[index].tasks),
    assignmentSeenBy: { ...(state.jobs[index].assignmentSeenBy || {}) },
    scopeChanges: [...(state.jobs[index].scopeChanges || [])],
    fieldChecklist: { ...(state.jobs[index].fieldChecklist || {}) }
  });
  const nextJob = updater(job) || job;
  state.jobs[index] = nextJob;
  const after = cloneForActivity(ensureJobDefaults(nextJob));
  const changes = summarizeJobChanges(before, after);
  if (changes.length) {
    recordActivity({ before, after, job: after, changes });
  }
  save();
  render();
  return true;
}

function updateJobSchedule(jobId, { scheduleDate, startTime, durationMinutes = "", endTime = "", technician = "" }) {
  return updateJobById(jobId, (job) => {
    const previousSchedule = scheduleText(job);
    const previousTechnician = normalizeTechnician(job.technician);
    const wasScheduled = isScheduled(job);
    job.scheduleDate = scheduleDate || "";
    job.startTime = startTime || "";
    job.durationMinutes = normalizeDurationMinutes(durationMinutes, jobDurationMinutes(job));
    job.endTime = endTime || "";
    if (technician) {
      const nextTechnician = normalizeTechnician(technician);
      if (nextTechnician !== previousTechnician) {
        recordAssignmentUpdate(job, nextTechnician);
      } else {
        job.technician = nextTechnician;
      }
    }
    job.window = "";
    job.status = job.scheduleDate && job.startTime && job.status === "open" ? "booked" : job.status;
    if (!job.scheduleDate || !job.startTime) {
      job.status = job.status === "booked" ? "open" : job.status;
    }
    if (!wasScheduled && isScheduled(job)) {
      const appliedTemplate = applyJobTemplate(job, { forceMetadata: true });
      if (appliedTemplate.added) {
        addJobMessage(job, {
          direction: "note",
          body: `${appliedTemplate.template.title} template applied with ${appliedTemplate.added} default task${appliedTemplate.added === 1 ? "" : "s"}.`
        });
      }
    }
    const nextSchedule = scheduleText(job);
    addJobMessage(job, {
      direction: "note",
      body: `Schedule updated from ${previousSchedule} to ${nextSchedule}.`
    });
    return job;
  });
}

function addPricebookItem(formData) {
  if (!can("invoice")) return;
  const item = normalizePricebookItem({
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || "General").trim(),
    unit: String(formData.get("unit") || "each").trim(),
    unitPrice: normalizeValue(formData.get("unitPrice")),
    taxable: formData.get("taxable") === "on",
    preferredSupplier: String(formData.get("preferredSupplier") || "").trim(),
    defaultCost: normalizeValue(formData.get("defaultCost")),
    truckStock: formData.get("truckStock"),
    reorderPoint: formData.get("reorderPoint"),
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  if (!item.name) return;
  state.pricebookItems = [item, ...state.pricebookItems.map(normalizePricebookItem)];
  save();
  renderPricebook();
  renderInventoryLite();
  renderDetail();
}

function pricebookItemById(id) {
  return state.pricebookItems.map(normalizePricebookItem).find((item) => item.id === id) || null;
}

function pricebookFormItem(formData, existing = {}) {
  return normalizePricebookItem({
    ...existing,
    id: existing.id || String(formData.get("id") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    category: String(formData.get("category") || existing.category || "General").trim(),
    unit: String(formData.get("unit") || existing.unit || "each").trim(),
    unitPrice: normalizeValue(formData.get("unitPrice")),
    defaultCost: normalizeValue(formData.get("defaultCost")),
    preferredSupplier: String(formData.get("preferredSupplier") || "").trim(),
    truckStock: formData.get("truckStock"),
    reorderPoint: formData.get("reorderPoint"),
    taxable: formData.get("taxable") === "on",
    active: formData.get("active") === "on",
    updatedAt: new Date().toISOString()
  });
}

function pricebookChangeSummary(before = {}, after = {}) {
  const fields = [
    ["name", "Name"],
    ["description", "Description"],
    ["category", "Category"],
    ["unit", "Unit"],
    ["unitPrice", "Bill rate"],
    ["defaultCost", "Default cost"],
    ["preferredSupplier", "Supplier"],
    ["truckStock", "On hand"],
    ["reorderPoint", "Reorder point"],
    ["taxable", "Taxable"],
    ["active", "Active"]
  ];
  return fields
    .map(([field, label]) => {
      const previous = before[field];
      const next = after[field];
      return previous === next ? null : {
        field,
        label,
        before: typeof previous === "number" && ["unitPrice", "defaultCost"].includes(field) ? formatMoney(previous) : String(previous ?? ""),
        after: typeof next === "number" && ["unitPrice", "defaultCost"].includes(field) ? formatMoney(next) : String(next ?? "")
      };
    })
    .filter(Boolean);
}

function recordPricebookActivity(before = {}, after = {}) {
  const changes = pricebookChangeSummary(before, after);
  if (!changes.length) return;
  recordActivity({
    type: "updated",
    label: "Pricebook item updated",
    detail: `${after.name || before.name || "Item"}: ${changes.map((change) => change.label).join(", ")}`,
    changes
  });
}

function openInventoryOrderModal(itemId = "", orderId = "") {
  if (!elements.inventoryOrderModal || !elements.inventoryOrderForm) return;
  const item = pricebookItemById(itemId);
  if (!item) return;
  const order = orderId ? item.orders.find((candidate) => candidate.id === orderId) : null;
  const form = elements.inventoryOrderForm;
  const mode = order ? "receive" : "order";
  form.reset();
  form.elements.mode.value = mode;
  form.elements.itemId.value = item.id;
  form.elements.orderId.value = order?.id || "";
  form.elements.purchaseOrderId.value = order?.purchaseOrderId || "";
  form.elements.supplier.value = order?.supplier || item.preferredSupplier || "";
  form.elements.qty.value = order ? Math.max(1, inventoryOrderRemainingQty(order)) : suggestedReorderQuantity(item);
  if (order) {
    form.elements.qty.max = String(Math.max(1, inventoryOrderRemainingQty(order)));
  } else {
    form.elements.qty.removeAttribute("max");
  }
  form.elements.unitCost.value = order?.unitCost || item.defaultCost || "";
  form.elements.expectedDate.value = order?.expectedDate || "";
  form.elements.note.value = order?.note || "";
  form.querySelectorAll("[data-order-single]").forEach((field) => {
    field.hidden = false;
    field.querySelectorAll("input").forEach((input) => {
      input.required = input.name === "qty";
    });
  });
  if (elements.inventoryOrderLines) {
    elements.inventoryOrderLines.hidden = true;
    elements.inventoryOrderLines.innerHTML = "";
  }
  if (elements.inventoryOrderTitle) {
    elements.inventoryOrderTitle.textContent = order ? "Receive inventory" : "Mark material ordered";
  }
  if (elements.inventoryOrderSubtitle) {
    elements.inventoryOrderSubtitle.textContent = order
      ? `${item.name} from ${order.supplier || "supplier"}`
      : `${item.name} has ${item.truckStock} on hand and reorders at ${item.reorderPoint}.`;
  }
  if (elements.inventoryOrderSubmit) {
    elements.inventoryOrderSubmit.textContent = order ? "Receive on hand" : "Mark ordered";
  }
  elements.inventoryOrderModal.showModal();
}

function openSupplierPurchaseOrderModal(supplierName = "") {
  if (!elements.inventoryOrderModal || !elements.inventoryOrderForm) return;
  const supplier = normalizedSupplierName(supplierName);
  const rows = inventoryReorderRows().filter((row) => normalizedSupplierName(row.preferredSupplier) === supplier);
  if (!rows.length) return;
  const form = elements.inventoryOrderForm;
  const purchaseOrderId = createId();
  form.reset();
  form.elements.mode.value = "supplier-order";
  form.elements.itemId.value = "";
  form.elements.orderId.value = "";
  form.elements.purchaseOrderId.value = purchaseOrderId;
  form.elements.supplier.value = supplier === "Supplier not set" ? "" : supplier;
  form.elements.expectedDate.value = "";
  form.elements.note.value = "";
  form.querySelectorAll("[data-order-single]").forEach((field) => {
    field.hidden = true;
    field.querySelectorAll("input").forEach((input) => {
      input.required = false;
      input.value = "";
      input.removeAttribute("max");
    });
  });
  if (elements.inventoryOrderLines) {
    elements.inventoryOrderLines.hidden = false;
    elements.inventoryOrderLines.innerHTML = `
      <div class="inventory-order-line-header">
        <strong>${escapeHtml(purchaseOrderNumberFromId(purchaseOrderId))}</strong>
        <span>${escapeHtml(`${rows.length} low-stock material${rows.length === 1 ? "" : "s"}`)}</span>
      </div>
      ${rows.map((row) => `
        <div class="inventory-order-line">
          <label class="inventory-order-check">
            <input type="checkbox" name="orderItemIds" value="${escapeHtml(row.id)}" checked>
            <span>Select</span>
          </label>
          <span>
            <strong>${escapeHtml(row.name)}</strong>
            <small>${escapeHtml(`On hand ${row.truckStock}, reorder ${row.reorderPoint}, target ${row.targetStock}`)}</small>
          </span>
          <input name="qty-${escapeHtml(row.id)}" type="number" min="1" step="1" value="${escapeHtml(row.suggestedQty)}" aria-label="Quantity for ${escapeHtml(row.name)}">
          <input name="unitCost-${escapeHtml(row.id)}" type="number" min="0" step="0.01" value="${escapeHtml(row.defaultCost || "")}" placeholder="Unit cost" aria-label="Unit cost for ${escapeHtml(row.name)}">
        </div>
      `).join("")}
    `;
  }
  if (elements.inventoryOrderTitle) elements.inventoryOrderTitle.textContent = "Create purchase order";
  if (elements.inventoryOrderSubtitle) elements.inventoryOrderSubtitle.textContent = `${supplier} - choose materials, quantities, expected date, and note.`;
  if (elements.inventoryOrderSubmit) elements.inventoryOrderSubmit.textContent = "Create PO";
  elements.inventoryOrderModal.showModal();
}

function openSupplierReceiveOrderModal(purchaseOrderId = "") {
  if (!elements.inventoryOrderModal || !elements.inventoryOrderForm) return;
  const lines = inventoryPurchaseOrderLines(purchaseOrderId);
  if (!lines.length) return;
  const form = elements.inventoryOrderForm;
  const poNumber = lines[0].order.purchaseOrderNumber || purchaseOrderNumberFromId(purchaseOrderId);
  const supplier = lines[0].order.supplier || "";
  form.reset();
  form.elements.mode.value = "supplier-receive";
  form.elements.itemId.value = "";
  form.elements.orderId.value = "";
  form.elements.purchaseOrderId.value = purchaseOrderId;
  form.elements.supplier.value = supplier;
  form.elements.expectedDate.value = todayISO();
  form.elements.note.value = "";
  form.querySelectorAll("[data-order-single]").forEach((field) => {
    field.hidden = true;
    field.querySelectorAll("input").forEach((input) => {
      input.required = false;
      input.value = "";
      input.removeAttribute("max");
    });
  });
  if (elements.inventoryOrderLines) {
    elements.inventoryOrderLines.hidden = false;
    elements.inventoryOrderLines.innerHTML = `
      <div class="inventory-order-line-header">
        <strong>${escapeHtml(poNumber)}</strong>
        <span>${escapeHtml(`${lines.length} pending line${lines.length === 1 ? "" : "s"}`)}</span>
      </div>
      ${lines.map(({ item, order }) => {
        const remaining = inventoryOrderRemainingQty(order);
        return `
          <div class="inventory-order-line">
            <label class="inventory-order-check">
              <input type="checkbox" name="receiveOrderIds" value="${escapeHtml(`${item.id}::${order.id}`)}" checked>
              <span>Receive</span>
            </label>
            <span>
              <strong>${escapeHtml(item.name)}</strong>
              <small>${escapeHtml(`${order.receivedQty} received, ${remaining} pending of ${order.qty}`)}</small>
            </span>
            <input name="receiveQty-${escapeHtml(order.id)}" type="number" min="1" max="${escapeHtml(remaining)}" step="1" value="${escapeHtml(remaining)}" aria-label="Receive quantity for ${escapeHtml(item.name)}">
            <input name="unitCost-${escapeHtml(order.id)}" type="number" min="0" step="0.01" value="${escapeHtml(order.unitCost || item.defaultCost || "")}" placeholder="Unit cost" aria-label="Unit cost for ${escapeHtml(item.name)}">
          </div>
        `;
      }).join("")}
    `;
  }
  if (elements.inventoryOrderTitle) elements.inventoryOrderTitle.textContent = "Receive purchase order";
  if (elements.inventoryOrderSubtitle) elements.inventoryOrderSubtitle.textContent = `${poNumber}${supplier ? ` from ${supplier}` : ""} - receive full or partial quantities.`;
  if (elements.inventoryOrderSubmit) elements.inventoryOrderSubmit.textContent = "Receive selected";
  elements.inventoryOrderModal.showModal();
}

function placeInventoryOrder(formData) {
  const itemId = String(formData.get("itemId") || "").trim();
  const before = pricebookItemById(itemId);
  if (!before) return false;
  const qty = Math.max(1, Math.round(Number(formData.get("qty")) || 0));
  const supplier = String(formData.get("supplier") || "").trim() || before.preferredSupplier || "Supplier not set";
  const order = normalizeInventoryOrder({
    supplier,
    qty,
    unitCost: formData.get("unitCost"),
    expectedDate: formData.get("expectedDate"),
    note: formData.get("note"),
    orderedAt: new Date().toISOString(),
    orderedBy: accountDisplayName(),
    status: "ordered"
  });
  const after = normalizePricebookItem({
    ...before,
    preferredSupplier: before.preferredSupplier || supplier,
    orders: [order, ...before.orders],
    movements: [
      stockMovement("ordered", order.qty, before.truckStock, before.truckStock, {
        orderId: order.id,
        purchaseOrderId: order.purchaseOrderId,
        purchaseOrderNumber: order.purchaseOrderNumber,
        note: `${order.qty} ${before.unit}${order.qty === 1 ? "" : "s"} ordered from ${order.supplier}`
      }),
      ...before.movements
    ].slice(0, 80),
    updatedAt: new Date().toISOString()
  });
  state.pricebookItems = state.pricebookItems.map((item) => normalizePricebookItem(item).id === before.id ? after : normalizePricebookItem(item));
  recordInventoryOrderActivity(
    "Inventory order placed",
    `${after.name}: ordered ${order.qty} ${after.unit}${order.qty === 1 ? "" : "s"} from ${order.supplier}.`,
    [
      { field: "inventoryOrder", label: "Order", before: "", after: `${order.qty} ${after.unit} ordered` },
      { field: "supplier", label: "Supplier", before: before.preferredSupplier || "", after: order.supplier }
    ]
  );
  save();
  renderPricebook();
  renderInventoryLite();
  renderActivity();
  return true;
}

function placeSupplierPurchaseOrder(formData) {
  const supplier = String(formData.get("supplier") || "").trim() || "Supplier not set";
  const purchaseOrderId = String(formData.get("purchaseOrderId") || "").trim() || createId();
  const purchaseOrderNumber = purchaseOrderNumberFromId(purchaseOrderId);
  const selectedIds = formData.getAll("orderItemIds").map((value) => String(value || "").trim()).filter(Boolean);
  if (!selectedIds.length) return false;
  let orderCount = 0;
  let estimatedTotal = 0;
  state.pricebookItems = state.pricebookItems.map((rawItem) => {
    const item = normalizePricebookItem(rawItem);
    if (!selectedIds.includes(item.id)) return item;
    const qty = Math.max(1, Math.round(Number(formData.get(`qty-${item.id}`)) || suggestedReorderQuantity(item)));
    const unitCost = normalizeValue(formData.get(`unitCost-${item.id}`)) || item.defaultCost;
    const order = normalizeInventoryOrder({
      purchaseOrderId,
      purchaseOrderNumber,
      supplier,
      qty,
      unitCost,
      expectedDate: formData.get("expectedDate"),
      note: formData.get("note"),
      orderedAt: new Date().toISOString(),
      orderedBy: accountDisplayName(),
      status: "ordered"
    });
    orderCount += 1;
    estimatedTotal += qty * unitCost;
    return normalizePricebookItem({
      ...item,
      preferredSupplier: item.preferredSupplier || supplier,
      orders: [order, ...item.orders],
      movements: [
        stockMovement("ordered", qty, item.truckStock, item.truckStock, {
          orderId: order.id,
          purchaseOrderId,
          purchaseOrderNumber,
          note: `${qty} ${item.unit}${qty === 1 ? "" : "s"} ordered from ${supplier}`
        }),
        ...item.movements
      ].slice(0, 80),
      updatedAt: new Date().toISOString()
    });
  });
  if (!orderCount) return false;
  recordInventoryOrderActivity(
    "Purchase order created",
    `${purchaseOrderNumber}: ${orderCount} line${orderCount === 1 ? "" : "s"} ordered from ${supplier} (${formatMoney(estimatedTotal)} est.).`,
    [
      { field: "purchaseOrder", label: "Purchase order", before: "", after: purchaseOrderNumber },
      { field: "supplier", label: "Supplier", before: "", after: supplier }
    ]
  );
  save();
  renderPricebook();
  renderInventoryLite();
  renderActivity();
  return true;
}

function receiveInventoryOrder(formData) {
  const itemId = String(formData.get("itemId") || "").trim();
  const orderId = String(formData.get("orderId") || "").trim();
  const { item: before, order } = inventoryOrderById(itemId, orderId);
  if (!before || !order) return false;
  const remainingQty = inventoryOrderRemainingQty(order);
  if (!remainingQty) return false;
  const receivedNow = Math.min(remainingQty, Math.max(1, Math.round(Number(formData.get("qty")) || 0)));
  const nextReceivedQty = order.receivedQty + receivedNow;
  const unitCost = normalizeValue(formData.get("unitCost")) || order.unitCost;
  const receivedOrder = normalizeInventoryOrder({
    ...order,
    supplier: String(formData.get("supplier") || "").trim() || order.supplier,
    unitCost,
    expectedDate: formData.get("expectedDate") || order.expectedDate,
    note: formData.get("note") || order.note,
    status: nextReceivedQty >= order.qty ? "received" : "ordered",
    receivedQty: nextReceivedQty,
    receivedAt: nextReceivedQty >= order.qty ? new Date().toISOString() : order.receivedAt,
    receivedBy: accountDisplayName()
  });
  const afterStock = before.truckStock + receivedNow;
  const after = normalizePricebookItem({
    ...before,
    truckStock: afterStock,
    defaultCost: before.defaultCost || unitCost,
    orders: before.orders.map((candidate) => candidate.id === order.id ? receivedOrder : candidate),
    movements: [
      stockMovement("received", receivedNow, before.truckStock, afterStock, {
        orderId: order.id,
        purchaseOrderId: order.purchaseOrderId,
        purchaseOrderNumber: order.purchaseOrderNumber,
        note: `${receivedNow} ${before.unit}${receivedNow === 1 ? "" : "s"} received from ${receivedOrder.supplier || "supplier"}`
      }),
      ...before.movements
    ].slice(0, 80),
    updatedAt: new Date().toISOString()
  });
  state.pricebookItems = state.pricebookItems.map((item) => normalizePricebookItem(item).id === before.id ? after : normalizePricebookItem(item));
  recordInventoryOrderActivity(
    "Inventory received",
    `${after.name}: received ${receivedNow} ${after.unit}${receivedNow === 1 ? "" : "s"} into on-hand inventory${inventoryOrderRemainingQty(receivedOrder) ? ` (${inventoryOrderRemainingQty(receivedOrder)} still pending)` : ""}.`,
    [
      { field: "truckStock", label: "On hand", before: String(before.truckStock), after: String(after.truckStock) },
      { field: "inventoryOrder", label: "Order", before: `${remainingQty} pending`, after: `${inventoryOrderRemainingQty(receivedOrder)} pending` }
    ]
  );
  save();
  renderPricebook();
  renderInventoryLite();
  renderDetail();
  renderActivity();
  return true;
}

function receiveSupplierPurchaseOrder(input = "") {
  const isFormData = input && typeof input.get === "function";
  const id = String(isFormData ? input.get("purchaseOrderId") : input || "").trim();
  if (!id) return false;
  let receivedLines = 0;
  let receivedUnits = 0;
  let supplier = "";
  let poNumber = purchaseOrderNumberFromId(id);
  const selected = isFormData
    ? new Set(input.getAll("receiveOrderIds").map((value) => String(value || "").trim()).filter(Boolean))
    : new Set(inventoryPurchaseOrderLines(id).map(({ item, order }) => `${item.id}::${order.id}`));
  if (!selected.size) return false;
  state.pricebookItems = state.pricebookItems.map((rawItem) => {
    const item = normalizePricebookItem(rawItem);
    let addedStock = 0;
    const movements = [];
    const orders = item.orders.map((rawOrder) => {
      const order = normalizeInventoryOrder(rawOrder);
      const lineKey = `${item.id}::${order.id}`;
      if ((order.purchaseOrderId || order.id) !== id || order.status !== "ordered" || !selected.has(lineKey)) return order;
      const remainingQty = Math.max(0, order.qty - order.receivedQty);
      if (!remainingQty) return order;
      const receiveQty = isFormData
        ? Math.min(remainingQty, Math.max(1, Math.round(Number(input.get(`receiveQty-${order.id}`)) || 0)))
        : remainingQty;
      const unitCost = isFormData ? normalizeValue(input.get(`unitCost-${order.id}`)) || order.unitCost : order.unitCost;
      const nextReceivedQty = order.receivedQty + receiveQty;
      addedStock += receiveQty;
      receivedLines += 1;
      receivedUnits += receiveQty;
      supplier = order.supplier || supplier;
      poNumber = order.purchaseOrderNumber || poNumber;
      movements.push(stockMovement("received", receiveQty, item.truckStock + addedStock - receiveQty, item.truckStock + addedStock, {
        orderId: order.id,
        purchaseOrderId: order.purchaseOrderId || id,
        purchaseOrderNumber: order.purchaseOrderNumber || poNumber,
        note: `${receiveQty} ${item.unit}${receiveQty === 1 ? "" : "s"} received from ${order.supplier || "supplier"}`
      }));
      return normalizeInventoryOrder({
        ...order,
        unitCost,
        status: nextReceivedQty >= order.qty ? "received" : "ordered",
        receivedQty: nextReceivedQty,
        receivedAt: nextReceivedQty >= order.qty ? new Date().toISOString() : order.receivedAt,
        receivedBy: accountDisplayName()
      });
    });
    if (!addedStock) return item;
    return normalizePricebookItem({
      ...item,
      truckStock: item.truckStock + addedStock,
      orders,
      movements: [...movements, ...item.movements].slice(0, 80),
      updatedAt: new Date().toISOString()
    });
  });
  if (!receivedLines) return false;
  recordInventoryOrderActivity(
    "Purchase order received",
    `${poNumber}: ${receivedUnits} unit${receivedUnits === 1 ? "" : "s"} received across ${receivedLines} line${receivedLines === 1 ? "" : "s"}${supplier ? ` from ${supplier}` : ""}.`,
    [
      { field: "purchaseOrder", label: "Purchase order", before: "Pending", after: `${receivedUnits} received` }
    ]
  );
  save();
  renderPricebook();
  renderInventoryLite();
  renderDetail();
  renderActivity();
  return true;
}

function openPricebookEditModal(itemId) {
  const item = pricebookItemById(itemId);
  if (!item || !elements.pricebookEditModal || !elements.pricebookEditForm) return;
  const form = elements.pricebookEditForm;
  form.elements.id.value = item.id;
  form.elements.name.value = item.name;
  form.elements.description.value = item.description;
  form.elements.unitPrice.value = item.unitPrice || "";
  form.elements.defaultCost.value = item.defaultCost || "";
  form.elements.preferredSupplier.value = item.preferredSupplier || "";
  form.elements.truckStock.value = item.truckStock || "";
  form.elements.reorderPoint.value = item.reorderPoint || "";
  form.elements.taxable.checked = Boolean(item.taxable);
  form.elements.active.checked = item.active !== false;
  if (elements.pricebookEditCategoryPicker) {
    elements.pricebookEditCategoryPicker.innerHTML = renderCategoryPicker("pricebook-edit-category", item.category);
  }
  if (elements.pricebookEditUnitPicker) {
    elements.pricebookEditUnitPicker.innerHTML = renderUnitPicker("pricebook-edit-unit", item.unit);
  }
  elements.pricebookEditModal.showModal();
}

function updatePricebookItemFromForm(formData) {
  const id = String(formData.get("id") || "").trim();
  const before = pricebookItemById(id);
  if (!before) return false;
  let after = pricebookFormItem(formData, before);
  if (!after.name) return false;
  if (before.truckStock !== after.truckStock) {
    after = normalizePricebookItem({
      ...after,
      movements: [
        stockMovement("adjustment", after.truckStock - before.truckStock, before.truckStock, after.truckStock, {
          note: `On hand adjusted from ${before.truckStock} to ${after.truckStock}`
        }),
        ...before.movements
      ].slice(0, 80)
    });
  }
  state.pricebookItems = state.pricebookItems.map((item) => {
    const normalized = normalizePricebookItem(item);
    return normalized.id === id ? after : normalized;
  });
  recordPricebookActivity(before, after);
  save();
  renderPricebook();
  renderInventoryLite();
  renderDetail();
  renderActivity();
  return true;
}

function savePartToPricebook(job, partIndex) {
  const part = normalizeJobPart(job.parts?.[partIndex], partIndex);
  if (!part.name || partSavedToPricebook(part)) return null;
  const item = normalizePricebookItem({
    name: part.name,
    description: `Saved from ${job.name || "job"} logged parts`,
    category: "Materials",
    unit: "each",
    unitPrice: partSuggestedBillRate(part) || partUnitCost(part),
    defaultCost: partUnitCost(part),
    preferredSupplier: part.source === "supplier" ? "Supplier" : "",
    truckStock: 0,
    reorderPoint: 0,
    taxable: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  state.pricebookItems = [item, ...state.pricebookItems.map(normalizePricebookItem)];
  job.parts = (job.parts || []).map((candidate, index) => index === partIndex
    ? normalizeJobPart({ ...candidate, pricebookItemId: item.id, updatedAt: new Date().toISOString(), updatedBy: accountDisplayName() }, index)
    : normalizeJobPart(candidate, index));
  return item;
}

function addPartToInvoice(job, partIndex) {
  const part = normalizeJobPart(job.parts?.[partIndex], partIndex);
  if (!part.name || isPartBilled(job, part)) return null;
  const invoice = invoiceRecord(job);
  const line = partInvoiceLine(part);
  invoice.lineItems = invoiceLineItemsWithBaseline(invoice, [line]);
  job.invoice = normalizeInvoiceRecord(invoice, job);
  updateInvoiceFromLineItems(job);
  job.parts = (job.parts || []).map((candidate, index) => index === partIndex
    ? normalizeJobPart({
      ...candidate,
      invoiceLineItemId: line.id,
      billedAt: new Date().toISOString(),
      billedBy: accountDisplayName(),
      updatedAt: new Date().toISOString(),
      updatedBy: accountDisplayName()
    }, index)
    : normalizeJobPart(candidate, index));
  return line;
}

function lineItemFromForm(data) {
  const pricebookItem = pricebookItemById(String(data.get("pricebookItemId") || ""));
  const description = String(data.get("description") || "").trim() || pricebookItem?.name || "";
  const unitPriceInput = String(data.get("unitPrice") || "").trim();
  const unitInput = String(data.get("unit") || "").trim();
  return normalizeInvoiceLineItem({
    pricebookItemId: pricebookItem?.id || "",
    description,
    category: pricebookItem?.category || "Custom",
    qty: data.get("qty") || 1,
    unitPrice: unitPriceInput ? unitPriceInput : pricebookItem?.unitPrice || 0,
    unit: unitInput || pricebookItem?.unit || "each",
    taxable: data.get("taxable") === "on" || Boolean(pricebookItem?.taxable),
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName()
  });
}

function invoiceNeedsBaselineLine(invoice = {}) {
  return false;
}

function invoiceBaselineLine(invoice = {}) {
  return normalizeInvoiceLineItem({
    id: INVOICE_BASELINE_LINE_ID,
    description: INVOICE_BASELINE_DESCRIPTION,
    category: "Prior billing",
    qty: 1,
    unit: "flat",
    unitPrice: Math.max(normalizeValue(invoice.amount), invoiceCollectedAmount(invoice)),
    taxable: false,
    createdAt: new Date().toISOString(),
    createdBy: "Backline"
  });
}

function invoiceLineItemsWithBaseline(invoice = {}, addedLines = []) {
  const existingLines = invoice.lineItems || [];
  return [...existingLines, ...addedLines];
}

function isCarryforwardInvoiceLine(line = {}) {
  const normalized = normalizeInvoiceLineItem(line);
  return normalized.id === INVOICE_CARRYFORWARD_LINE_ID
    || normalized.source === INVOICE_CARRYFORWARD_SOURCE
    || normalized.sourceId === INVOICE_CARRYFORWARD_LINE_ID;
}

function isProtectedInvoiceLine(line = {}) {
  return isCarryforwardInvoiceLine(line);
}

function carryforwardInvoiceLine(amount = 0) {
  return normalizeInvoiceLineItem({
    id: INVOICE_CARRYFORWARD_LINE_ID,
    description: "Prior paid work",
    category: "Prior billing",
    qty: 1,
    unit: "flat",
    unitPrice: amount,
    taxable: false,
    source: INVOICE_CARRYFORWARD_SOURCE,
    sourceId: INVOICE_CARRYFORWARD_LINE_ID,
    createdAt: new Date().toISOString(),
    createdBy: "Backline"
  });
}

function estimateInvoiceLineRevisionNumber(line = {}) {
  const normalized = normalizeInvoiceLineItem(line);
  const sourceMatch = String(normalized.sourceId || "").match(/estimate-revision-(\d+)/);
  const descriptionMatch = String(normalized.description || "").match(/estimate #(\d+)/i);
  return Math.max(1, Math.round(Number(sourceMatch?.[1] || descriptionMatch?.[1] || 1)));
}

function latestEstimateInvoiceLine(lines = []) {
  return [...lines].sort((a, b) => estimateInvoiceLineRevisionNumber(b) - estimateInvoiceLineRevisionNumber(a))[0] || null;
}

function reconcileCarryforwardTotal(lines = [], collected = 0) {
  const normalizedLines = lines.map(normalizeInvoiceLineItem);
  const total = normalizedLines.reduce((sum, item) => sum + invoiceLineItemTotal(item), 0);
  const shortfall = Math.max(0, collected - total);
  if (shortfall <= 0) return normalizedLines;
  const carryforwardIndex = normalizedLines.findIndex(isCarryforwardInvoiceLine);
  if (carryforwardIndex >= 0) {
    return normalizedLines.map((item, index) => index === carryforwardIndex
      ? normalizeInvoiceLineItem({ ...item, unitPrice: item.unitPrice + shortfall })
      : item);
  }
  return [carryforwardInvoiceLine(shortfall), ...normalizedLines];
}

function invoiceLinesMatch(left = [], right = []) {
  if (left.length !== right.length) return false;
  return left.every((line, index) => {
    const current = normalizeInvoiceLineItem(line);
    const next = normalizeInvoiceLineItem(right[index]);
    return current.id === next.id
      && current.description === next.description
      && current.source === next.source
      && current.sourceId === next.sourceId
      && invoiceLineItemTotal(current) === invoiceLineItemTotal(next);
  });
}

function invoiceLineItemsWithPaymentCarryforward(record = {}) {
  const allLines = invoiceLineItems(record);
  const carryforwardLine = allLines.find(isCarryforwardInvoiceLine);
  const visibleLines = allLines.filter((line) => !isCarryforwardInvoiceLine(line));
  const visibleAmount = visibleLines.reduce((sum, item) => sum + invoiceLineItemTotal(item), 0);
  const collected = invoiceCollectedAmount(record);
  const estimateLines = visibleLines.filter(isEstimateInvoiceLine);
  const nonEstimateLines = visibleLines.filter((line) => !isEstimateInvoiceLine(line));
  const latestEstimateLine = latestEstimateInvoiceLine(estimateLines);
  if (carryforwardLine) {
    return reconcileCarryforwardTotal([carryforwardLine, ...nonEstimateLines, ...(latestEstimateLine ? [latestEstimateLine] : [])], collected);
  }
  if (collected > 0 && estimateLines.length > 1) {
    return reconcileCarryforwardTotal([carryforwardInvoiceLine(collected), ...nonEstimateLines, ...(latestEstimateLine ? [latestEstimateLine] : [])], collected);
  }
  if (collected >= visibleAmount && visibleAmount > 0 && estimateLines.length === 1) {
    return reconcileCarryforwardTotal([carryforwardInvoiceLine(collected), ...nonEstimateLines], collected);
  }
  const nextLines = estimateLines.length > 1
    ? [...nonEstimateLines, ...(latestEstimateLine ? [latestEstimateLine] : [])]
    : visibleLines;
  return reconcileCarryforwardTotal(nextLines, collected);
}

function invoiceLinesForNewApprovedEstimate(invoice = {}, estimate = {}, job = {}) {
  const collected = invoiceCollectedAmount(invoice);
  const nonEstimateLines = invoice.lineItems.filter((line) => !isEstimateInvoiceLine(line) && !isCarryforwardInvoiceLine(line));
  const priorLines = collected > 0 ? [carryforwardInvoiceLine(collected)] : [];
  return [
    ...priorLines,
    ...nonEstimateLines,
    estimateInvoiceLine(estimate, job)
  ];
}

function repairInvoiceCarryforward(job = {}) {
  const invoice = normalizeInvoiceRecord(job.invoice || {}, job);
  const lineItems = invoiceLineItemsWithPaymentCarryforward(invoice);
  if (invoiceLinesMatch(lineItems, invoice.lineItems)) {
    job.invoice = invoice;
    return job;
  }
  job.invoice = normalizeInvoiceRecord({
    ...invoice,
    lineItems,
    amount: lineItems.reduce((sum, item) => sum + invoiceLineItemTotal(item), 0)
  }, job);
  return job;
}

function estimateRevisionSourceId(estimate = {}) {
  return `estimate-revision-${Math.max(1, Math.round(Number(estimate.revisionNumber) || 1))}`;
}

function estimateInvoiceLine(estimate = {}, job = {}) {
  const revisionNumber = Math.max(1, Math.round(Number(estimate.revisionNumber) || 1));
  return normalizeInvoiceLineItem({
    id: estimateRevisionSourceId(estimate),
    description: `${estimate.packageName || "Custom"} estimate #${revisionNumber} - ${job.issue || "recommended work"}`,
    category: "Estimate",
    qty: 1,
    unit: "flat",
    unitPrice: normalizeValue(estimate.amount),
    taxable: false,
    source: INVOICE_ESTIMATE_LINE_SOURCE,
    sourceId: estimateRevisionSourceId(estimate),
    createdAt: new Date().toISOString(),
    createdBy: accountDisplayName()
  });
}

function isEstimateInvoiceLine(line = {}) {
  const normalized = normalizeInvoiceLineItem(line);
  const description = normalized.description.toLowerCase();
  return normalized.source === INVOICE_ESTIMATE_LINE_SOURCE
    || normalized.sourceId === "current-estimate"
    || normalized.id === "estimate-line"
    || (normalized.category.toLowerCase() === "estimate" && description.includes("estimate"))
    || /^.+ estimate - /.test(description);
}

function upsertEstimateInvoiceLine(job) {
  return createInvoiceFromApprovedEstimate(job);
}

function canCreateInvoiceFromEstimate(job = {}) {
  const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
  const invoice = invoiceRecord(job);
  const latestSourceId = estimateRevisionSourceId(estimate);
  return can("invoice")
    && estimate.amount > 0
    && estimateRevisionStatus(estimate.status || job.approvalStatus) === "approved"
    && !isLockedBillingJob(job)
    && !invoice.lineItems.some((line) => isEstimateInvoiceLine(line) && normalizeInvoiceLineItem(line).sourceId === latestSourceId);
}

function createInvoiceFromApprovedEstimate(job) {
  const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
  if (!estimate.amount) return job;
  const invoice = invoiceRecord(job);
  const nextLines = invoiceLinesForNewApprovedEstimate(invoice, estimate, job).map((line) => normalizeInvoiceLineItem(line));
  job.invoice = normalizeInvoiceRecord({
    ...invoice,
    lineItems: nextLines,
    amount: nextLines.reduce((sum, item) => sum + invoiceLineItemTotal(item), 0),
    depositRequested: Math.min((invoice.depositRequested || 0) + estimate.depositRequested, nextLines.reduce((sum, item) => sum + invoiceLineItemTotal(item), 0)),
    status: invoice.status === "draft" ? "sent" : invoice.status,
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  }, job);
  return updateInvoiceFromLineItems(job);
}

function setInvoiceLineFormStatus(form, message = "") {
  const status = form?.querySelector("[data-invoice-line-status]");
  if (!status) return;
  status.textContent = message;
  status.hidden = !message;
}

function updateInvoiceFromLineItems(job) {
  const sourceInvoice = job.invoice || {};
  const invoice = normalizeInvoiceRecord(sourceInvoice, job);
  const lineItems = invoiceLineItemsWithPaymentCarryforward(sourceInvoice);
  const amount = lineItems.reduce((sum, item) => sum + invoiceLineItemTotal(item), 0);
  const collected = invoiceCollectedAmount(invoice);
  const status = amount <= 0
    ? "draft"
    : collected >= amount
      ? "paid"
      : collected > 0
        ? "partial"
        : invoice.status === "draft"
          ? "sent"
          : invoice.status === "paid"
            ? "sent"
            : invoice.status;
  job.invoice = normalizeInvoiceRecord({
    ...invoice,
    lineItems,
    amount,
    depositRequested: Math.min(invoice.depositRequested, amount),
    status,
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  }, { ...job, value: amount });
  job.value = job.invoice.amount;
  return job;
}

function clearInvoiceBaseline(job) {
  const invoice = invoiceRecord(job);
  job.invoice = normalizeInvoiceRecord({
    ...invoice,
    lineItems: invoice.lineItems.filter((item) => !isInvoiceBaselineLine(item)),
    payments: [],
    amount: 0,
    depositRequested: 0,
    depositCollected: 0,
    paidAmount: 0,
    paymentMethod: "",
    status: "draft",
    paidAt: "",
    updatedAt: new Date().toISOString(),
    updatedBy: accountDisplayName()
  }, { ...job, value: 0, status: "invoiced" });
  job.value = 0;
  if (isLockedBillingJob(job)) {
    job.status = job.estimate?.amount ? "estimated" : job.completedAt ? "completed" : "open";
  }
  return job;
}

async function softDeleteJob(jobId) {
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return;
  const deletedRecord = ensureDeletedJobDefaults({
    id: `deleted-${job.id}-${Date.now()}`,
    job: {
      ...ensureJobDefaults(job),
      messages: [...(job.messages || [])],
      parts: [...(job.parts || [])],
      files: [...(job.files || [])],
      notifications: [...(job.notifications || [])],
      tasks: cloneJobTasks(job.tasks),
      assignmentSeenBy: { ...(job.assignmentSeenBy || {}) },
      scopeChanges: [...(job.scopeChanges || [])],
      fieldChecklist: { ...(job.fieldChecklist || {}) }
    },
    deletedAt: new Date().toISOString(),
    deletedBy: accountDisplayName()
  });

  state.deletedJobs.unshift(deletedRecord);
  state.jobs = state.jobs.filter((item) => item.id !== jobId);
  state.selectedJobId = visibleJobs()[0]?.id || state.jobs[0]?.id || null;
  recordActivity({
    type: "deleted",
    label: "Job deleted",
    detail: deletedRecord.reason,
    job,
    before: cloneForActivity(job)
  });
  save();
  await deleteRemoteActiveJob(job.id);
  render();
}

async function restoreDeletedJob(recordId) {
  if (!can("delete")) {
    denyAction("restore deleted job", recordId);
    return;
  }
  const record = state.deletedJobs.find((item) => item.id === recordId);
  if (!record) return;
  const restored = ensureJobDefaults({
    ...record.job,
    restoredAt: new Date().toISOString(),
    messages: [
      ...(record.job.messages || []),
      {
        direction: "note",
        body: `Job restored from deleted archive by ${accountDisplayName()}.`,
        createdAt: new Date().toLocaleString()
      }
    ]
  });

  state.deletedJobs = state.deletedJobs.filter((item) => item.id !== recordId);
  state.jobs.unshift(restored);
  state.selectedJobId = restored.id;
  recordActivity({
    type: "restored",
    label: "Job restored",
    detail: restored.issue,
    job: restored,
    after: cloneForActivity(restored)
  });
  save();
  await deleteRemoteArchivedJob(recordId);
  activateView("inbox");
  render();
}

function pickerIdFrom(name = "field", label = "") {
  return `${name}-${label || "picker"}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "backline-picker";
}

function inputField({ label, name, type = "text", value = "", placeholder = "", wide = false, required = false, rows = 0, options = null, list = "", attrs = "" }) {
  const className = wide ? ' class="wide"' : "";
  const requiredAttr = required ? " required" : "";
  const listAttr = list ? ` list="${escapeHtml(list)}"` : "";
  if (options) {
    return `
      <label${className}>
        ${label}
        ${backlineDropdown({
          id: `${pickerIdFrom(name, label)}-${createId().slice(0, 6)}`,
          name,
          value,
          options,
          placeholder: label,
          direction: "up"
        })}
      </label>
    `;
  }
  if (rows) {
    return `
      <label${className}>
        ${label}
        <textarea name="${name}" rows="${rows}" placeholder="${escapeHtml(placeholder)}"${requiredAttr}>${escapeHtml(value)}</textarea>
      </label>
    `;
  }
  return `
    <label${className}>
      ${label}
      <input name="${name}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}"${listAttr}${requiredAttr}${attrs ? ` ${attrs}` : ""}>
    </label>
  `;
}

function actionModalConfig(action, job) {
  const isReschedule = action === "book" && isScheduled(job);
  const estimate = normalizeEstimateRecord(job.estimate || {}, job);
  const company = companySettings();
  const actionDraft = state.actionDraft?.action === action && state.actionDraft?.jobId === job.id
    ? state.actionDraft.values || {}
    : {};
  const estimateDraftAmount = actionDraft.value ?? (estimate.amount || 650);
  const estimateDraftDeposit = actionDraft.depositRequested ?? (estimate.depositRequested || estimateDepositAmount(estimateDraftAmount));
  const invoice = invoiceRecord(job);
  const paymentDraftAmount = actionDraft.paidAmount ?? (invoiceBalance(job) || invoice.amount || estimate.amount || "");
  const configs = {
    book: {
      eyebrow: "Schedule",
      title: isReschedule ? "Reschedule job" : "Book job",
      subtitle: isReschedule ? "Move the appointment and notify the right people." : "Set the appointment window and assigned technician.",
      submit: isReschedule ? "Save reschedule" : "Book job",
      fields: [
        isReschedule ? `<div class="schedule-context wide"><span>Current appointment</span><strong>${escapeHtml(scheduleText(job, { includeYear: true }))}</strong></div>` : "",
        inputField({ label: "Schedule date", name: "scheduleDate", type: "date", value: actionDraft.scheduleDate ?? (job.scheduleDate || todayISO()), required: true }),
        inputField({ label: "Start time", name: "startTime", type: "time", value: actionDraft.startTime ?? (job.startTime || "09:00"), required: true }),
        inputField({ label: "Duration", name: "durationMinutes", value: actionDraft.durationMinutes ?? String(jobDurationMinutes(job)), options: durationOptionItems(actionDraft.durationMinutes ?? jobDurationMinutes(job)) }),
        inputField({ label: "Technician", name: "technician", value: actionDraft.technician ?? normalizeTechnician(job.technician), options: technicianOptionItems(actionDraft.technician ?? job.technician) }),
        renderScheduleImpactWarning(job),
        inputField({ label: "Customer message", name: "message", value: actionDraft.message ?? (isReschedule ? `Hi ${job.name}, your appointment has been updated. We will send a confirmation shortly.` : `Booked for ${job.name}. We will send a confirmation shortly.`), wide: true })
      ].filter(Boolean)
    },
    estimate: {
      eyebrow: "Sell",
      title: "Send estimate",
      subtitle: "Choose the package, customer-facing terms, and follow-up behavior.",
      submit: "Send estimate",
      fields: [
        inputField({ label: "Estimate amount", name: "value", type: "number", value: estimateDraftAmount, required: true, attrs: 'data-estimate-amount-input step="0.01" min="0"' }),
        `<label>Package<div class="backline-picker-field">${renderEstimatePackagePicker("estimate-package", actionDraft.packageName || estimate.packageName)}</div></label>`,
        inputField({ label: "Expires after days", name: "expirationDays", type: "number", value: actionDraft.expirationDays ?? (estimate.expirationDays || company.estimateExpirationDays), required: true }),
        inputField({ label: "Deposit requested", name: "depositRequested", type: "number", value: estimateDraftDeposit, attrs: `data-estimate-deposit-input step="0.01" min="0"${state.actionDraft?.touchedDeposit ? ' data-touched="true"' : ""}` }),
        inputField({
          label: "Approval status",
          name: "approvalStatus",
          value: actionDraft.approvalStatus || "sent",
          options: [
            { value: "sent", label: "Send for approval" },
            { value: "approved", label: "Already approved" },
            { value: "not_sent", label: "Draft only" }
          ]
        }),
        inputField({ label: "Customer intro", name: "introText", value: actionDraft.introText ?? estimate.introText, rows: 3, wide: true }),
        inputField({ label: "Warranty / guarantee", name: "warrantyText", value: actionDraft.warrantyText ?? estimate.warrantyText, rows: 2, wide: true }),
        inputField({ label: "Estimate disclaimer", name: "disclaimer", value: actionDraft.disclaimer ?? estimate.disclaimer, rows: 3, wide: true }),
        inputField({ label: "Internal note", name: "note", value: actionDraft.note || "", placeholder: "Good/better/best option, warranty, or financing note", wide: true })
      ]
    },
    invoice: {
      eyebrow: "Money",
      title: "Create invoice",
      subtitle: "Record billing details. Line items control the invoice total.",
      submit: "Save invoice",
      fields: [
        inputField({ label: "Invoice number", name: "invoiceNumber", value: actionDraft.invoiceNumber ?? invoice.number, required: true }),
        `<div class="schedule-context wide"><span>Line-item total</span><strong>${escapeHtml(formatMoney(invoice.amount))} from ${invoice.lineItems.length} item${invoice.lineItems.length === 1 ? "" : "s"}</strong></div>`,
        inputField({ label: "Deposit requested", name: "depositRequested", type: "number", value: actionDraft.depositRequested ?? (invoice.depositRequested || estimateDepositAmount(invoice.amount || estimate.amount) || "") }),
        inputField({ label: "Deposit collected", name: "depositCollected", type: "number", value: actionDraft.depositCollected ?? (invoice.depositCollected || "") }),
        inputField({ label: "Payment method", name: "paymentMethod", value: actionDraft.paymentMethod ?? (invoice.paymentMethod || ""), options: [
          { value: "", label: "Not recorded" },
          { value: "card", label: "Card" },
          { value: "ach", label: "ACH" },
          { value: "cash", label: "Cash" },
          { value: "check", label: "Check" },
          { value: "financing", label: "Financing" },
          { value: "other", label: "Other" }
        ] }),
        inputField({ label: "Invoice note", name: "note", value: actionDraft.note ?? (invoice.note || ""), placeholder: "Payment terms, deposit notes, or billing context", wide: true })
      ]
    },
    paid: {
      eyebrow: "Collect",
      title: "Record payment",
      subtitle: "Record the amount received and keep the remaining balance visible.",
      submit: "Record payment",
      fields: [
        `<div class="schedule-context wide"><span>Invoice balance</span><strong>${escapeHtml(formatMoney(invoiceBalance(job)))} due on ${escapeHtml(formatMoney(invoice.amount))} invoice</strong></div>`,
        inputField({ label: "Amount received", name: "paidAmount", type: "number", value: paymentDraftAmount, required: true, attrs: 'data-payment-amount-input step="0.01" min="0"' }),
        inputField({ label: "Payment method", name: "paymentMethod", value: actionDraft.paymentMethod ?? (invoice.paymentMethod || "card"), options: [
          { value: "card", label: "Card" },
          { value: "ach", label: "ACH" },
          { value: "cash", label: "Cash" },
          { value: "check", label: "Check" },
          { value: "financing", label: "Financing" },
          { value: "other", label: "Other" }
        ] }),
        inputField({ label: "Paid date", name: "paidAt", type: "date", value: String(actionDraft.paidAt ?? (invoice.paidAt || todayISO())).slice(0, 10), required: true }),
        inputField({ label: "Payment note", name: "note", value: actionDraft.note ?? "", placeholder: "Receipt, check number, or financing note", wide: true })
      ]
    },
    "payment-request": {
      eyebrow: "Collect",
      title: "Request payment",
      subtitle: "Create a customer portal payment request for the current invoice balance.",
      submit: "Send request",
      fields: [
        `<div class="schedule-context wide"><span>Current balance</span><strong>${escapeHtml(formatMoney(invoiceBalance(job)))} due on ${escapeHtml(formatMoney(invoice.amount))} invoice</strong></div>`,
        inputField({ label: "Requested amount", name: "amount", type: "number", value: actionDraft.amount ?? (invoiceBalance(job) || invoice.amount || ""), required: true, attrs: 'step="0.01" min="0"' }),
        inputField({ label: "Due date", name: "dueDate", type: "date", value: actionDraft.dueDate ?? addDaysISO(7), required: true }),
        inputField({ label: "Customer note", name: "note", value: actionDraft.note ?? `Hi ${job.name}, your balance is ready for review. Please use this portal to confirm payment details with the office.`, rows: 4, wide: true })
      ]
    },
    change: {
      eyebrow: "Scope",
      title: "Create change order",
      subtitle: "Capture added work before it turns into margin leakage.",
      submit: "Send change order",
      fields: [
        inputField({ label: "Description", name: "description", value: actionDraft.description ?? "Additional work approved on site", required: true, wide: true }),
        inputField({ label: "Amount", name: "amount", type: "number", value: actionDraft.amount ?? 150, required: true }),
        inputField({ label: "Approval required", name: "approvalRequired", value: actionDraft.approvalRequired ?? "yes", options: [
          { value: "yes", label: "Send approval" },
          { value: "no", label: "Already approved" }
        ] })
      ]
    },
    parts: {
      eyebrow: "Field",
      title: "Log parts",
      subtitle: "Track what came from on-hand inventory, a supplier, or job materials.",
      submit: "Log parts",
      fields: [
        inputField({ label: "Part or material", name: "name", value: actionDraft.name ?? "", placeholder: job.partsNote || "Capacitor, disposal, water heater", required: true, wide: true }),
        inputField({ label: "Quantity", name: "qty", value: actionDraft.qty ?? "1", required: true }),
        inputField({ label: "Source", name: "source", value: actionDraft.source || "truck stock", options: [
          { value: "truck stock", label: "On hand" },
          { value: "supplier", label: "Supplier" },
          { value: "warehouse", label: "Warehouse" },
          { value: "customer supplied", label: "Customer supplied" }
        ] }),
        inputField({ label: "Unit cost", name: "cost", type: "number", value: actionDraft.cost ?? "", placeholder: "Optional" })
      ]
    },
    "portal-update": {
      eyebrow: "Portal",
      title: "Send portal update",
      subtitle: "Add a clean customer-facing update without exposing internal notes.",
      submit: "Send update",
      fields: [
        inputField({
          label: "Customer update",
          name: "message",
          value: actionDraft.message ?? "",
          placeholder: `Hi ${job.name}, here is an update on your ${job.trade} job...`,
          rows: 5,
          wide: true,
          required: true
        })
      ]
    },
    complete: {
      eyebrow: "Field",
      title: "Complete job",
      subtitle: "Close the field loop before invoicing.",
      submit: "Complete job",
      fields: [
        inputField({ label: "Diagnosis", name: "diagnosis", value: actionDraft.diagnosis ?? job.issue, rows: 4, wide: true, required: true }),
        inputField({ label: "Photos captured", name: "photos", value: actionDraft.photos ?? (job.fieldChecklist.photos ? "yes" : "no"), options: [
          { value: "yes", label: "Yes" },
          { value: "no", label: "No" }
        ] }),
        inputField({ label: "Customer signature", name: "signature", value: actionDraft.signature ?? (job.fieldChecklist.signature ? "yes" : "no"), options: [
          { value: "yes", label: "Captured" },
          { value: "no", label: "Not yet" }
        ] }),
        inputField({ label: "Next step", name: "nextStep", value: actionDraft.nextStep ?? "invoice", options: [
          { value: "invoice", label: "Ready to invoice" },
          { value: "estimate", label: "Needs estimate" },
          { value: "followup", label: "Needs follow-up" }
        ] })
      ]
    },
    "check-diagnosis": {
      eyebrow: "Field",
      title: "Add diagnosis",
      subtitle: "Save what the tech found on site.",
      submit: "Save diagnosis",
      fields: [
        inputField({ label: "Diagnosis note", name: "diagnosis", value: actionDraft.diagnosis ?? job.issue, rows: 4, wide: true, required: true })
      ]
    }
  };
  return configs[action] || null;
}

function openActionModal(action) {
  if (!can(action)) return false;
  const job = selectedJob();
  const hasMatchingDraft = state.actionDraft?.action === action && state.actionDraft?.jobId === job?.id;
  if (!hasMatchingDraft && (!elements.actionModal.open || state.actionDraft?.action !== action || state.actionDraft?.jobId !== job?.id)) {
    state.actionDraft = null;
  }
  const config = job ? actionModalConfig(action, job) : null;
  if (!config) return false;
  elements.actionForm.dataset.action = action;
  elements.actionModalEyebrow.textContent = config.eyebrow;
  elements.actionModalTitle.textContent = config.title;
  elements.actionModalSubtitle.textContent = config.subtitle;
  elements.actionModalSubmit.textContent = config.submit;
  elements.actionModalFields.innerHTML = config.fields.join("");
  refreshActionScheduleWarning();
  elements.actionModal.showModal();
  return true;
}

function hasOpenModalForm() {
  return Boolean(
    elements.actionModal?.open ||
    elements.jobModal?.open ||
    elements.deleteModal?.open ||
    elements.teamRemoveModal?.open ||
    elements.importConfirmModal?.open ||
    elements.pricebookEditModal?.open ||
    elements.inventoryUsageModal?.open ||
    elements.inventoryOrderModal?.open ||
    elements.supplierModal?.open ||
    elements.reorderCopyModal?.open ||
    elements.companySettingsModal?.open
  );
}

function captureActionFormDraft(form = elements.actionForm) {
  if (!form?.dataset.action || !elements.actionModal?.open) return;
  state.actionDraft = {
    action: form.dataset.action,
    jobId: state.selectedJobId,
    values: Object.fromEntries(new FormData(form).entries()),
    touchedDeposit: form.querySelector("[data-estimate-deposit-input]")?.dataset.touched === "true"
  };
}

function clearActionFormDraft() {
  state.actionDraft = null;
}

function actionScheduleOverrides(form = elements.actionForm) {
  const data = new FormData(form);
  return {
    scheduleDate: data.get("scheduleDate") || "",
    startTime: data.get("startTime") || "",
    durationMinutes: normalizeDurationMinutes(data.get("durationMinutes")),
    technician: normalizeTechnician(data.get("technician"))
  };
}

function refreshActionScheduleWarning() {
  if (elements.actionForm.dataset.action !== "book") return;
  const job = selectedJob();
  const warning = elements.actionModalFields.querySelector("[data-schedule-warning]");
  if (!job || !warning) return;
  const messages = scheduleImpactMessages(job, actionScheduleOverrides());
  warning.className = messages.length ? "schedule-warning wide" : "schedule-ok wide";
  warning.innerHTML = messages.length ? messages.map(escapeHtml).join("<br>") : "Schedule looks clear.";
}

function refreshEstimateDepositDefault(form = elements.actionForm, options = {}) {
  if (form?.dataset.action !== "estimate") return;
  const amountInput = form.querySelector("[data-estimate-amount-input]");
  const depositInput = form.querySelector("[data-estimate-deposit-input]");
  if (!amountInput || !depositInput) return;
  const amount = normalizeValue(amountInput.value);
  if (depositInput.dataset.touched === "true" && !options.force) {
    const deposit = normalizeValue(depositInput.value);
    if (amount > 0 && deposit > amount) {
      depositInput.value = String(amount);
    }
    return;
  }
  const nextDeposit = estimateDepositAmount(amount);
  depositInput.value = nextDeposit ? String(nextDeposit) : "";
}

function openDeleteModal() {
  const job = selectedJob();
  if (!job || !can("delete")) return false;
  elements.deleteForm.dataset.jobId = job.id;
  elements.deleteModalSummary.textContent = `${job.name} - ${job.issue}`;
  elements.deleteModal.showModal();
  return true;
}

function applyActionForm(action, data) {
  if (!can(action)) return;
  updateSelectedJob((job) => {
    if (action === "book") {
      const wasScheduled = isScheduled(job);
      const previousSchedule = scheduleText(job, { includeYear: true });
      const previousTechnician = normalizeTechnician(job.technician);
      job.scheduleDate = data.get("scheduleDate");
      job.startTime = data.get("startTime");
      job.durationMinutes = normalizeDurationMinutes(data.get("durationMinutes"), jobDurationMinutes(job));
      job.endTime = "";
      const nextTechnician = normalizeTechnician(data.get("technician"));
      if (nextTechnician !== previousTechnician) {
        recordAssignmentUpdate(job, nextTechnician);
      } else {
        job.technician = nextTechnician;
      }
      job.window = "";
      job.status = "booked";
      const nextSchedule = scheduleText(job, { includeYear: true });
      addJobMessage(job, {
        direction: "note",
        body: wasScheduled
          ? `Rescheduled from ${previousSchedule} to ${nextSchedule}.`
          : `Booked for ${nextSchedule}.`
      });
      const message = String(data.get("message") || "").trim();
      if (message) addAutomationMessage(job, message);
      if (state.automations.appointmentReminder) {
        queueJobNotification(job, "customer_confirmation");
        if (job.technician !== "To Be Determined") {
          queueJobNotification(job, "tech_assignment");
        }
      }
    }

    if (action === "estimate") {
      const estimateAmount = normalizeValue(data.get("value"));
      job.value = estimateAmount;
      job.status = "estimated";
      const estimateStatus = data.get("approvalStatus") || "sent";
      const expirationDays = Math.max(1, Math.round(Number(data.get("expirationDays")) || companySettings().estimateExpirationDays));
      const nextEstimate = normalizeEstimateRecord({
        amount: estimateAmount,
        packageName: data.get("packageName"),
        introText: data.get("introText"),
        warrantyText: data.get("warrantyText"),
        disclaimer: data.get("disclaimer"),
        expirationDays,
        expiresAt: estimateExpiresAt(expirationDays),
        depositRequested: data.get("depositRequested"),
        depositPercent: estimateAmount ? (normalizeValue(data.get("depositRequested")) / estimateAmount) * 100 : companySettings().defaultDepositPercent,
        terms: companySettings().defaultDepositWording,
        updatedAt: new Date().toISOString(),
        updatedBy: accountDisplayName()
      }, job);
      const revision = appendEstimateRevision(job, nextEstimate, estimateStatus);
      const note = String(data.get("note") || "").trim();
      if (note) {
        addJobMessage(job, { direction: "note", body: note });
      }
      addJobMessage(job, {
        direction: "note",
        body: `Estimate revision ${revision.revisionNumber} prepared: ${job.estimate.packageName} for ${formatMoney(job.estimate.amount)}. Expires ${new Date(`${job.estimate.expiresAt}T12:00:00`).toLocaleDateString()}.`
      });
      if (state.automations.estimateFollowUp && job.approvalStatus === "sent") {
        queueJobNotification(job, "estimate_followup");
      }
    }

    if (action === "invoice") {
      const currentInvoice = invoiceRecord(job);
      const amount = currentInvoice.lineItems.reduce((sum, item) => sum + invoiceLineItemTotal(item), 0);
      const depositRequested = normalizeValue(data.get("depositRequested"));
      const depositCollected = normalizeValue(data.get("depositCollected"));
      const existingPayments = paymentRecords(currentInvoice).filter((payment) => payment.id !== "invoice-deposit");
      const payments = depositCollected > 0
        ? [...existingPayments, normalizePaymentRecord({
            id: "invoice-deposit",
            amount: depositCollected,
            kind: "deposit",
            method: String(data.get("paymentMethod") || "").trim(),
            paidAt: todayISO(),
            note: "Deposit collected on invoice",
            createdAt: new Date().toISOString(),
            createdBy: accountDisplayName()
          })]
        : existingPayments;
      const collected = payments.reduce((sum, payment) => sum + (payment.kind === "refund" ? -payment.amount : payment.amount), 0);
      const nextStatus = collected >= amount && amount > 0 ? "paid" : collected > 0 ? "partial" : "sent";
      job.value = amount;
      job.status = nextStatus === "paid" ? "paid" : "invoiced";
      job.invoice = normalizeInvoiceRecord({
        ...currentInvoice,
        number: String(data.get("invoiceNumber") || currentInvoice.number).trim(),
        amount,
        payments,
        depositRequested: Math.min(depositRequested, amount),
        paymentMethod: String(data.get("paymentMethod") || "").trim(),
        status: nextStatus,
        note: String(data.get("note") || "").trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: accountDisplayName()
      }, job);
      let pdfMessage = "Invoice PDF attached to job files.";
      try {
        const invoicePdfFile = createInvoicePdfFile(job);
        job.files = [...(job.files || []), invoicePdfFile];
      } catch (error) {
        pdfMessage = `Invoice PDF was not attached: ${error.message}`;
      }
      addJobMessage(job, {
        direction: "note",
        body: `Invoice ${job.invoice.number} saved for ${formatMoney(job.invoice.amount)}${depositCollected ? ` with ${formatMoney(depositCollected)} collected` : ""}. ${pdfMessage}`
      });
      if (state.automations.invoiceFollowUp) {
        queueJobNotification(job, "invoice_reminder");
      }
    }

    if (action === "paid") {
      const currentInvoice = invoiceRecord(job);
      const paymentAmount = normalizeValue(data.get("paidAmount"));
      if (paymentAmount <= 0) {
        showToast("Payment amount needed", "Enter the amount received before recording payment.", "warning");
        return job;
      }
      const paymentMethod = String(data.get("paymentMethod") || currentInvoice.paymentMethod || "").trim();
      const paidAt = String(data.get("paidAt") || todayISO());
      const invoiceTotal = currentInvoice.amount || estimateAmount(job) || normalizeValue(job.value) || paymentAmount;
      job.value = invoiceTotal;
      const payment = normalizePaymentRecord({
        amount: paymentAmount,
        kind: "payment",
        method: paymentMethod,
        paidAt,
        note: String(data.get("note") || "").trim(),
        createdAt: new Date().toISOString(),
        createdBy: accountDisplayName()
      });
      const payments = [...paymentRecords(currentInvoice), payment];
      const collected = payments.reduce((sum, item) => sum + (item.kind === "refund" ? -item.amount : item.amount), 0);
      const isPaidInFull = invoiceTotal > 0 && collected >= invoiceTotal;
      job.status = isPaidInFull ? "paid" : "invoiced";
      job.invoice = normalizeInvoiceRecord({
        ...currentInvoice,
        amount: invoiceTotal,
        payments,
        paymentMethod,
        status: isPaidInFull ? "paid" : "partial",
        paidAt,
        note: String(data.get("note") || currentInvoice.note || "").trim(),
        updatedAt: new Date().toISOString(),
        updatedBy: accountDisplayName()
      }, job);
      let receiptMessage = "Receipt PDF attached to job files.";
      try {
        attachReceiptToPayment(job, payment.id);
      } catch (error) {
        receiptMessage = `Receipt PDF was not attached: ${error.message}`;
      }
      addJobMessage(job, {
        direction: "note",
        body: `Payment recorded: ${formatMoney(paymentAmount)} by ${paymentMethodLabel(paymentMethod)}. ${isPaidInFull ? "Invoice paid in full." : `${formatMoney(invoiceBalance(job))} still due.`} ${receiptMessage}`
      });
      if (state.automations.reviewRequest && isPaidInFull) {
        queueJobNotification(job, "review_request");
      }
    }

    if (action === "payment-request") {
      const amount = normalizeValue(data.get("amount"));
      if (amount <= 0) return job;
      const dueDate = String(data.get("dueDate") || addDaysISO(7));
      const note = String(data.get("note") || "").trim();
      ensureJobPortalToken(job);
      const request = normalizePaymentRequest({
        amount,
        dueDate,
        note,
        status: "requested",
        createdAt: new Date().toISOString(),
        createdBy: accountDisplayName()
      }, job);
      job.paymentRequests = [...paymentRequests(job).filter((item) => item.status !== "requested"), request];
      const url = paymentRequestUrl(job);
      addJobMessage(job, {
        direction: "out",
        body: `${note || "Payment request ready."} Requested amount: ${formatMoney(request.amount)} due ${formatDateLabel(request.dueDate, { includeYear: true })}. ${url}`,
        createdBy: accountDisplayName(),
        customerVisible: true
      });
      state.jobActionNotice = {
        jobId: job.id,
        message: "Payment request created and added to the customer portal.",
        url
      };
    }

    if (action === "change") {
      const description = String(data.get("description") || "").trim();
      const amount = normalizeValue(data.get("amount"));
      job.scopeChanges.push({ description, amount, createdAt: new Date().toISOString() });
      job.value = normalizeValue(job.value) + amount;
      if (!isLockedBillingJob(job) && amount > 0) {
        const invoice = invoiceRecord(job);
        invoice.lineItems = invoiceLineItemsWithBaseline(invoice, [normalizeInvoiceLineItem({
          description,
          category: "Change order",
          qty: 1,
          unit: "flat",
          unitPrice: amount,
          taxable: false,
          createdAt: new Date().toISOString(),
          createdBy: accountDisplayName()
        })]);
        job.invoice = normalizeInvoiceRecord(invoice, job);
        updateInvoiceFromLineItems(job);
      }
      job.approvalStatus = data.get("approvalRequired") === "yes" ? "sent" : "approved";
      addAutomationMessage(job, `Change order ${job.approvalStatus === "sent" ? "sent" : "recorded"}: ${description} (${formatMoney(amount)}). Updated total is ${formatMoney(job.value)}.`);
    }

    if (action === "parts") {
      const name = String(data.get("name") || "").trim();
      const qty = String(data.get("qty") || "1").trim();
      const source = String(data.get("source") || "truck stock").trim();
      const inventoryMatch = inventoryItemForPartName(name);
      const enteredCost = normalizeValue(data.get("cost"));
      const cost = enteredCost || inventoryMatch?.defaultCost || 0;
      const loggedPart = normalizeJobPart({
        name,
        qty,
        source,
        cost,
        pricebookItemId: inventoryMatch?.id || "",
        createdAt: new Date().toISOString(),
        createdBy: accountDisplayName()
      });
      job.parts.push(loggedPart);
      updateInventoryUsage(loggedPart, { job });
      addJobMessage(job, { direction: "note", body: `Parts logged: ${qty} x ${name} from ${source}${cost ? ` at ${formatMoney(cost)} each` : ""}${!enteredCost && inventoryMatch?.defaultCost ? " using inventory default cost" : ""}.` });
    }

    if (action === "portal-update") {
      const message = String(data.get("message") || "").trim();
      if (!message) return job;
      ensureJobPortalToken(job);
      addJobMessage(job, {
        direction: "out",
        body: message,
        createdBy: accountDisplayName(),
        customerVisible: true
      });
      state.jobActionNotice = {
        jobId: job.id,
        message: "Customer portal update sent.",
        url: customerPortalUrl(job)
      };
    }

    if (action === "complete") {
      const diagnosis = String(data.get("diagnosis") || "").trim();
      job.status = data.get("nextStep") === "estimate" ? "estimated" : "completed";
      job.completedAt = new Date().toISOString();
      job.fieldChecklist.diagnosis = true;
      job.fieldChecklist.photos = data.get("photos") === "yes";
      job.fieldChecklist.signature = data.get("signature") === "yes";
      addJobMessage(job, { direction: "note", body: `Diagnosis: ${diagnosis}` });
      addJobMessage(job, { direction: "note", body: "Field work marked complete." });
    }

    if (action === "check-diagnosis") {
      const diagnosis = String(data.get("diagnosis") || "").trim();
      job.fieldChecklist.diagnosis = true;
      addJobMessage(job, { direction: "note", body: `Diagnosis: ${diagnosis}` });
    }

    return job;
  });
}

async function uploadJobFiles(fileList, note = "") {
  if (!can("uploadFiles")) return;
  const job = selectedJob();
  if (!job || !fileList?.length) return;
  const files = [...fileList];
  const uploaded = [];

  for (const file of files) {
    if (state.secureMode && state.organizationId && state.currentUser) {
      const client = getSupabaseClient();
      const safeName = file.name.replace(/[^\w.\-]+/g, "-");
      const storagePath = `${state.organizationId}/${job.id}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await client.storage.from("job-files").upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false
      });
      if (uploadError) throw uploadError;
      const { data: signed, error: signedError } = await client.storage.from("job-files").createSignedUrl(storagePath, 60 * 60);
      if (signedError) throw signedError;
      const record = {
        organization_id: state.organizationId,
        job_id: job.id,
        customer_id: job.customerId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        storage_path: storagePath,
        note,
        created_by: state.currentUser.id
      };
      const { data: row, error: rowError } = await client.from("job_files").insert(record).select("id, created_at").single();
      if (rowError) throw rowError;
      uploaded.push({
        id: row.id,
        name: file.name,
        type: file.type,
        size: file.size,
        storagePath,
        url: signed.signedUrl,
        note,
        source: "secure storage",
        createdAt: row.created_at
      });
    } else {
      const dataUrl = await fileToDataUrl(file);
      uploaded.push({
        id: createId(),
        name: file.name,
        type: file.type,
        size: file.size,
        url: dataUrl,
        dataUrl,
        note,
        source: "local browser",
        createdAt: new Date().toISOString()
      });
    }
  }

  updateSelectedJob((nextJob) => {
    nextJob.files.push(...uploaded);
    nextJob.fieldChecklist.photos = nextJob.fieldChecklist.photos || uploaded.some((file) => String(file.type || "").startsWith("image/"));
    addJobMessage(nextJob, {
      direction: "note",
      body: `${uploaded.length} file${uploaded.length === 1 ? "" : "s"} uploaded${note ? `: ${note}` : ""}.`
    });
    return nextJob;
  });
}

function addAutomationMessage(job, body) {
  addJobMessage(job, {
    direction: "out",
    body,
    createdBy: "Backline"
  });
}

document.addEventListener("toggle", (event) => {
  const panel = event.target.closest?.("[data-expanded-key]");
  if (!panel || panel !== event.target) return;
  const key = panel.dataset.expandedKey;
  if (!key) return;
  state.expandedPanels[key] = panel.open;
}, true);

document.addEventListener("click", async (event) => {
  if (event.target.closest(".toast-close")) {
    return;
  }

  if (elements.toastRegion?.querySelector('[data-toast-id="role-included-access"]') && !event.target.closest(".toast")) {
    dismissToast("role-included-access");
  }

  if (event.target.closest("[data-return-app]")) {
    window.location.hash = "";
    routeFromHash();
    return;
  }

  if (event.target.closest("[data-foundry-snapshot]")) {
    copyFoundrySnapshot();
    return;
  }

  const foundryRunButton = event.target.closest("[data-foundry-copy-run]");
  if (foundryRunButton) {
    copyFoundrySnapshotRecord(foundryRunButton.dataset.foundryCopyRun);
    return;
  }

  const foundryIssueButton = event.target.closest("[data-foundry-copy-issue]");
  if (foundryIssueButton) {
    copyFoundryIssueBrief(foundryIssueButton.dataset.foundryCopyIssue);
    return;
  }

  if (event.target.closest("[data-foundry-release-notes]")) {
    copyFoundryReleaseNotes();
    return;
  }

  if (event.target.closest("[data-foundry-production-brief]")) {
    copyProductionLaunchBrief();
    return;
  }

  if (event.target.closest("[data-foundry-live-health]")) {
    copyFoundryLiveHealth();
    return;
  }

  if (event.target.closest("[data-foundry-go-no-go]")) {
    copyFoundryLaunchDecision();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-invite]")) {
    copyFoundryPilotInvite();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-onboarding]")) {
    copyFoundryPilotOnboarding();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-feedback]")) {
    copyFoundryPilotFeedbackRecap();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-bug]")) {
    copyFoundryPilotBugReport();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-feature]")) {
    copyFoundryPilotFeatureRequest();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-scorecard]")) {
    copyFoundryPilotOutcomeScorecard();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-pricing]")) {
    copyFoundryPilotPricingInterview();
    return;
  }

  const foundryPilotBriefButton = event.target.closest("[data-foundry-pilot-brief]");
  if (foundryPilotBriefButton) {
    copyFoundryPilotBrief(foundryPilotBriefButton.dataset.foundryPilotBrief);
    return;
  }

  const foundryPilotOutreachButton = event.target.closest("[data-foundry-pilot-outreach]");
  if (foundryPilotOutreachButton) {
    copyFoundryPilotOutreach(foundryPilotOutreachButton.dataset.foundryPilotOutreach);
    return;
  }

  const foundryPilotContactedButton = event.target.closest("[data-foundry-pilot-contacted]");
  if (foundryPilotContactedButton) {
    markFoundryPilotContacted(foundryPilotContactedButton.dataset.foundryPilotContacted);
    return;
  }

  if (event.target.closest("[data-foundry-pilot-report]")) {
    copyFoundryPilotPipelineReport();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-followups]")) {
    copyFoundryPilotFollowUpQueue();
    return;
  }

  if (event.target.closest("[data-foundry-pilot-decision]")) {
    copyFoundryPilotDecision();
    return;
  }

  const foundryPilotFilterButton = event.target.closest("[data-foundry-pilot-filter]");
  if (foundryPilotFilterButton) {
    state.foundryPilotFilter = foundryPilotFilterButton.dataset.foundryPilotFilter || "active";
    render();
    return;
  }

  const foundryPilotStatusButton = event.target.closest("[data-foundry-pilot-status]");
  if (foundryPilotStatusButton) {
    updateFoundryPilotRecord(foundryPilotStatusButton.dataset.foundryPilotStatus, {
      status: foundryPilotStatusButton.dataset.status || "prospect"
    });
    showToast("Pilot status updated", `${foundryPilotStatusLabel(foundryPilotStatusButton.dataset.status)} saved.`, "success", {
      id: "foundry-pilot-status",
      timeout: 2200
    });
    return;
  }

  const foundryPilotOutcomeButton = event.target.closest("[data-foundry-pilot-outcome]");
  if (foundryPilotOutcomeButton) {
    updateFoundryPilotRecord(foundryPilotOutcomeButton.dataset.foundryPilotOutcome, {
      outcome: foundryPilotOutcomeButton.dataset.outcome || "undecided"
    });
    showToast("Pilot outcome updated", `${foundryPilotOutcomeLabel(foundryPilotOutcomeButton.dataset.outcome)} saved.`, "success", {
      id: "foundry-pilot-outcome",
      timeout: 2200
    });
    return;
  }

  const foundryTestScriptButton = event.target.closest("[data-foundry-test-script]");
  if (foundryTestScriptButton) {
    copyFoundryBetaTestScript(foundryTestScriptButton.dataset.foundryTestScript);
    return;
  }

  const foundryTestStatusButton = event.target.closest("[data-foundry-test-status]");
  if (foundryTestStatusButton) {
    updateFoundryBetaTestResult(foundryTestStatusButton.dataset.foundryTestStatus, {
      status: foundryTestStatusButton.dataset.status || "not_run"
    });
    showToast("Beta script result updated", `${foundryBetaTestStatusLabel(foundryTestStatusButton.dataset.status)} saved.`, "success", {
      id: "foundry-test-result-update",
      timeout: 2400
    });
    render();
    return;
  }

  const productionStatusButton = event.target.closest("[data-production-status]");
  if (productionStatusButton) {
    updateProductionReadinessItem(productionStatusButton.dataset.productionStatus, {
      status: productionStatusButton.dataset.status || "open"
    });
    showToast("Production checklist updated", `${productionReadinessStatusLabel(productionStatusButton.dataset.status)} saved.`, "success", {
      id: "production-readiness-update",
      timeout: 2400
    });
    render();
    return;
  }

  const productionFilterButton = event.target.closest("[data-production-filter]");
  if (productionFilterButton) {
    state.foundryProductionFilter = productionFilterButton.dataset.productionFilter || "all";
    render();
    return;
  }

  const setupStatusButton = event.target.closest("[data-setup-status]");
  if (setupStatusButton) {
    updateSupabaseProductionSetupItem(setupStatusButton.dataset.setupStatus, {
      status: setupStatusButton.dataset.status || "open"
    });
    showToast("Supabase setup updated", `${productionReadinessStatusLabel(setupStatusButton.dataset.status)} saved.`, "success", {
      id: "supabase-setup-update",
      timeout: 2400
    });
    render();
    return;
  }

  const setupFilterButton = event.target.closest("[data-setup-filter]");
  if (setupFilterButton) {
    state.foundrySetupFilter = setupFilterButton.dataset.setupFilter || "all";
    render();
    return;
  }

  if (event.target.closest("[data-foundry-supabase-setup]")) {
    await copySupabaseProductionSetup();
    return;
  }

  const betaStatusButton = event.target.closest("[data-beta-status]");
  if (betaStatusButton) {
    updateBetaReadinessItem(betaStatusButton.dataset.betaStatus, {
      status: betaStatusButton.dataset.status || "open"
    });
    showToast("Beta checklist updated", `${betaReadinessStatusLabel(betaStatusButton.dataset.status)} saved.`, "success", {
      id: "beta-readiness-update",
      timeout: 2400
    });
    render();
    return;
  }

  const betaFilterButton = event.target.closest("[data-beta-filter]");
  if (betaFilterButton) {
    state.foundryBetaFilter = betaFilterButton.dataset.betaFilter || "all";
    render();
    return;
  }

  const settingsButton = event.target.closest("#settingsButton");
  if (settingsButton) {
    toggleSettingsMenu();
    return;
  }

  if (!event.target.closest(".settings-menu")) {
    closeSettingsMenu();
  }

  if (event.target.closest("#workspaceSettingsButton")) {
    closeSettingsMenu();
    openCompanySettingsModal();
    return;
  }

  if (event.target.closest("[data-add-template-card]")) {
    const template = newCustomTemplateDefinition();
    elements.templateSettingsList?.insertAdjacentHTML("beforeend", renderTemplateSettingsCard(template, templateSettings()));
    return;
  }

  if (event.target.closest("[data-portal-preview]")) {
    if (!canOrRecord("portal", "preview customer portal")) return;
    let url = "";
    updateSelectedJob((job) => {
      url = customerPortalUrl(job);
      state.jobActionNotice = {
        jobId: job.id,
        message: "Customer portal preview opened.",
        url
      };
      return job;
    });
    if (url) window.open(url, "_blank", "noopener");
    return;
  }

  const fileVisibilityButton = event.target.closest("[data-file-visibility]");
  if (fileVisibilityButton) {
    if (!canOrRecord("uploadFiles", "change customer file visibility")) return;
    const fileIndex = Number(fileVisibilityButton.dataset.fileVisibility);
    updateSelectedJob((job) => {
      const file = job.files[fileIndex];
      if (!file) return job;
      file.customerVisible = !file.customerVisible;
      addJobMessage(job, {
        direction: "note",
        body: `${file.name || "Job file"} is now ${file.customerVisible ? "visible in" : "hidden from"} the customer portal.`
      });
      return job;
    });
    return;
  }

  const removeTemplateCard = event.target.closest("[data-remove-template-card]");
  if (removeTemplateCard) {
    removeTemplateCard.closest("[data-template-settings-card]")?.remove();
    return;
  }

  const addTemplateTask = event.target.closest("[data-add-template-task]");
  if (addTemplateTask) {
    const templateKey = addTemplateTask.dataset.addTemplateTask;
    const list = document.querySelector(`[data-template-task-list="${CSS.escape(templateKey)}"]`);
    if (!list) return;
    list.insertAdjacentHTML("beforeend", renderTemplateSettingsTaskRow(templateKey, {
      title: "",
      phase: "field",
      role: "tech"
    }, list.querySelectorAll("[data-template-task]").length));
    return;
  }

  const removeTemplateTask = event.target.closest("[data-remove-template-task]");
  if (removeTemplateTask) {
    removeTemplateTask.closest("[data-template-task]")?.remove();
    return;
  }

  if (!event.target.closest(".customer-search")) {
    elements.customerSearchResults.hidden = true;
  }

  const searchCustomerId = event.target.closest("[data-search-customer-id]")?.dataset.searchCustomerId;
  if (searchCustomerId) {
    state.selectedCustomerId = searchCustomerId;
    state.search = "";
    elements.searchInput.value = "";
    elements.customerSearchResults.hidden = true;
    activateView("customers");
    render();
    return;
  }

  if (event.target.closest("[data-auth-back-login]")) {
    resetAuthCreateAccountState();
    elements.authGateStatus.textContent = "Sign in to load your secure Backline workspace.";
    elements.authForm.elements.email?.focus();
    return;
  }

  const authButton = event.target.closest("[data-auth-mode]");
  if (authButton && elements.authForm?.contains(authButton)) {
    const usernameField = elements.authForm.querySelector("[data-username-field]");
    const confirmPasswordField = elements.authForm.querySelector("[data-confirm-password-field]");
    const signInButton = elements.authForm.querySelector("[data-auth-signin-button]");
    const backButton = elements.authForm.querySelector("[data-auth-back-login]");
    const signupButton = elements.authForm.querySelector("[data-auth-signup-button]");
    if (authButton.dataset.authMode === "signup" && (usernameField?.hidden || confirmPasswordField?.hidden)) {
      event.preventDefault();
      elements.authForm.classList.add("signup-mode");
      if (usernameField) usernameField.hidden = false;
      if (confirmPasswordField) confirmPasswordField.hidden = false;
      if (signInButton) signInButton.hidden = true;
      if (backButton) backButton.hidden = false;
      if (signupButton) {
        signupButton.classList.remove("secondary-button");
        signupButton.classList.add("primary-button");
      }
      elements.authGateStatus.textContent = "Choose a username like first.last, then create the account.";
      elements.authForm.elements.displayName?.focus();
      return;
    }
    if (authButton.dataset.authMode === "signin" && usernameField && !elements.authForm.elements.displayName?.value.trim()) {
      resetAuthCreateAccountState();
    }
  }

  const technicianToggle = event.target.closest("[data-toggle-technician-picker]");
  if (technicianToggle) {
    state.openTechnicianPicker = state.openTechnicianPicker === technicianToggle.dataset.toggleTechnicianPicker
      ? ""
      : technicianToggle.dataset.toggleTechnicianPicker;
    renderDetail();
    return;
  }

  const backlinePickerToggle = event.target.closest("[data-toggle-backline-picker]");
  if (backlinePickerToggle) {
    const picker = backlinePickerToggle.closest("[data-backline-picker]");
    const menu = picker?.querySelector(".backline-picker-menu");
    const shouldOpen = Boolean(menu?.hidden);
    document.querySelectorAll(".backline-picker-menu").forEach((openMenu) => {
      openMenu.hidden = true;
      openMenu.closest(".backline-picker")?.querySelector("[data-toggle-backline-picker]")?.setAttribute("aria-expanded", "false");
    });
    if (menu) {
      menu.hidden = !shouldOpen;
      backlinePickerToggle.setAttribute("aria-expanded", String(shouldOpen));
    }
    return;
  }

  const backlinePickerOption = event.target.closest("[data-backline-picker-option]");
  if (backlinePickerOption) {
    const picker = backlinePickerOption.closest("[data-backline-picker]");
    const value = backlinePickerOption.dataset.backlinePickerOption || "";
    const optionLabel = backlinePickerOption.dataset.backlinePickerLabel || value;
    const input = picker?.querySelector("input[type='hidden']");
    const label = picker?.querySelector(".backline-picker-button span");
    const menu = picker?.querySelector(".backline-picker-menu");
    if (input) input.value = value;
    if (label) label.textContent = optionLabel;
    if (menu) menu.hidden = true;
    picker?.querySelector("[data-toggle-backline-picker]")?.setAttribute("aria-expanded", "false");
    state.openBacklinePicker = "";
    if (picker?.closest("#actionForm")) {
      captureActionFormDraft();
    }
    if (picker?.closest("#themePicker") && input?.name === "theme") {
      setThemePreference(value);
      renderThemePicker();
    }
    if (picker?.closest("#activityTypeFilter") && input?.name === "activityTypeFilter") {
      state.activityTypeFilter = value || "all";
      renderActivity();
    }
    if (picker?.closest("#activityDateFilter") && input?.name === "activityDateFilter") {
      state.activityDateFilter = value || "all";
      renderActivity();
    }
    if (picker?.closest("#rolePreviewSelect") && input?.name === "rolePreview") {
      state.rolePreviewSlug = value || currentRole();
      renderRolePreview();
    }
    const memberRolePicker = picker?.closest("[data-member-role-picker]");
    if (memberRolePicker && input?.name === "memberRole") {
      updateTeamMemberRole(memberRolePicker.dataset.memberRolePicker, value);
    }
    if (picker?.closest("[data-message-form]")) {
      updateMessageComposeDraft(picker.closest("[data-message-form]"));
    }
    if (picker?.closest("#jobForm") && ["trade", "jobType"].includes(input?.name)) {
      renderJobTemplatePicker(suggestedJobTemplateKeyFromForm(elements.jobForm));
    }
    if (picker?.closest("#customRoleForm") && input?.name === "template") {
      applyCustomRoleTemplate(value);
    }
    if (picker?.closest("[data-invoice-line-form]") && input?.name === "pricebookItemId") {
      applyInvoiceLinePricebookSelection(picker.closest("[data-invoice-line-form]"), value);
    }
    return;
  }

  if (event.target.closest("#collapseInboxButton")) {
    state.inboxCollapsed = !state.inboxCollapsed;
    renderJobs();
    return;
  }

  if (event.target.closest("[data-toggle-job-action-menu]")) {
    state.jobActionMenuOpen = !state.jobActionMenuOpen;
    renderDetail();
    return;
  }

  const fileFilter = event.target.closest("[data-file-filter]")?.dataset.fileFilter;
  if (fileFilter) {
    state.fileCategoryFilter = fileFilter;
    refreshDocumentCenter();
    return;
  }

  const technicianOption = event.target.closest("[data-technician-option]");
  if (technicianOption) {
    const technician = normalizeTechnician(technicianOption.dataset.technicianOption);
    state.openTechnicianPicker = "";
    updateSelectedJob((job) => {
      const previousTechnician = normalizeTechnician(job.technician);
      if (technician !== previousTechnician) {
        recordAssignmentUpdate(job, technician);
      } else {
        job.technician = technician;
      }
      addJobMessage(job, {
        direction: "note",
        body: `Technician assigned: ${technician}.`
      });
      return job;
    });
    return;
  }

  if (!event.target.closest(".technician-picker")) {
    state.openTechnicianPicker = "";
  }

  if (!event.target.closest(".backline-picker")) {
    state.openBacklinePicker = "";
    document.querySelectorAll(".backline-picker-menu").forEach((menu) => {
      menu.hidden = true;
      menu.closest(".backline-picker")?.querySelector("[data-toggle-backline-picker]")?.setAttribute("aria-expanded", "false");
    });
  }

  if (event.target.closest("input, select, textarea, option, .backline-picker")) {
    return;
  }

  const removeMember = event.target.closest("[data-remove-member]")?.dataset.removeMember;
  if (removeMember) {
    await removeTeamMember(removeMember);
    return;
  }

  const revokeInvite = event.target.closest("[data-revoke-invite]")?.dataset.revokeInvite;
  if (revokeInvite) {
    await revokeTeamInvite(revokeInvite);
    return;
  }

  const sendInviteEmail = event.target.closest("[data-send-invite-email]")?.dataset.sendInviteEmail;
  if (sendInviteEmail) {
    await sendTeamInviteEmail(sendInviteEmail);
    return;
  }

  const copyInvite = event.target.closest("[data-copy-invite]")?.dataset.copyInvite;
  if (copyInvite) {
    await copyTeamInvite(copyInvite);
    return;
  }

  const removeRole = event.target.closest("[data-remove-custom-role]")?.dataset.removeCustomRole;
  if (removeRole) {
    await removeCustomRole(removeRole);
    return;
  }

  const editRole = event.target.closest("[data-edit-custom-role]")?.dataset.editCustomRole;
  if (editRole) {
    editCustomRole(editRole);
    return;
  }

  const rescheduleJobId = event.target.closest("[data-reschedule-job]")?.dataset.rescheduleJob;
  if (rescheduleJobId) {
    if (!can("book") || !roleScopedJobs().some((job) => job.id === rescheduleJobId)) return;
    state.selectedJobId = rescheduleJobId;
    openActionModal("book");
    return;
  }

  const customerId = event.target.closest("[data-customer-id]")?.dataset.customerId;
  if (customerId) {
    state.selectedCustomerId = customerId;
    renderCustomers();
    return;
  }

  const createCustomerJob = event.target.closest("[data-create-customer-job]")?.dataset.createCustomerJob;
  if (createCustomerJob) {
    openCustomerJobModal(createCustomerJob);
    return;
  }

  const customerPortal = event.target.closest("[data-customer-portal]")?.dataset.customerPortal;
  if (customerPortal) {
    if (!canOrRecord("portal", "prepare customer portal link")) return;
    await copyCustomerPortalLink(customerPortal);
    return;
  }

  const customerMessage = event.target.closest("[data-customer-message]")?.dataset.customerMessage;
  if (customerMessage) {
    if (!canOrRecord("portal-update", "send customer update")) return;
    openCustomerAction(customerMessage, "portal-update", "latest");
    return;
  }

  const customerPayment = event.target.closest("[data-customer-payment]")?.dataset.customerPayment;
  if (customerPayment) {
    if (!canOrRecord("payment-request", "request customer payment")) return;
    openCustomerAction(customerPayment, "payment-request", "balance");
    return;
  }

  const customerTimelineSort = event.target.closest("[data-customer-timeline-sort]")?.dataset.customerTimelineSort;
  if (customerTimelineSort) {
    state.customerTimelineSort = customerTimelineSort === "oldest" ? "oldest" : "newest";
    renderCustomers();
    return;
  }

  const restoreJobId = event.target.closest("[data-restore-job]")?.dataset.restoreJob;
  if (restoreJobId) {
    await restoreDeletedJob(restoreJobId);
    return;
  }

  const databaseJobId = event.target.closest("[data-db-job-id]")?.dataset.dbJobId;
  if (databaseJobId) {
    if (!roleScopedJobs().some((job) => job.id === databaseJobId)) return;
    markAssignmentSeen(databaseJobId);
    markJobMessagesSeen(databaseJobId);
    state.selectedJobId = databaseJobId;
    activateView("inbox");
    render();
    return;
  }

  const activityJobId = event.target.closest("[data-activity-job-id]")?.dataset.activityJobId;
  if (activityJobId) {
    if (!roleScopedJobs().some((job) => job.id === activityJobId)) return;
    state.selectedJobId = activityJobId;
    elements.activityDetailModal?.close("open-job");
    activateView("inbox");
    render();
    return;
  }

  if (event.target.closest("[data-activity-filter-role]")) {
    state.activityTypeFilter = "role";
    renderActivityTypeFilterPicker();
    activateView("activity");
    render();
    return;
  }

  const activityRow = event.target.closest("[data-activity-id]");
  if (activityRow) {
    openActivityDetail(activityRow.dataset.activityId);
    return;
  }

  const jobsFilter = event.target.closest("[data-jobs-filter]")?.dataset.jobsFilter;
  if (jobsFilter) {
    state.jobsDatabaseFilter = jobsFilter;
    renderJobsDatabase();
    return;
  }

  const pricebookToggle = event.target.closest("[data-pricebook-toggle]")?.dataset.pricebookToggle;
  if (pricebookToggle) {
    if (!canOrRecord("invoice", "manage pricebook")) return;
    const before = pricebookItemById(pricebookToggle);
    let after = null;
    state.pricebookItems = state.pricebookItems.map((item) => {
      const normalized = normalizePricebookItem(item);
      if (normalized.id !== pricebookToggle) return normalized;
      after = { ...normalized, active: !normalized.active, updatedAt: new Date().toISOString() };
      return after;
    });
    if (before && after) recordPricebookActivity(before, after);
    save();
    renderPricebook();
    renderDetail();
    renderInventoryLite();
    renderActivity();
    return;
  }

  const editPricebookItem = event.target.closest("[data-edit-pricebook-item]")?.dataset.editPricebookItem;
  if (editPricebookItem) {
    if (!canOrRecord("invoice", "edit pricebook item")) return;
    openPricebookEditModal(editPricebookItem);
    return;
  }

  const inventoryUsageKey = event.target.closest("[data-view-inventory-usage]")?.dataset.viewInventoryUsage;
  if (inventoryUsageKey) {
    if (elements.inventoryOrderDetailModal?.open) elements.inventoryOrderDetailModal.close("usage");
    openInventoryUsageModal(inventoryUsageKey);
    return;
  }

  const copyReorderList = event.target.closest("[data-copy-reorder-list]");
  if (copyReorderList) {
    const rows = inventoryReorderRows();
    const text = inventoryReorderText(rows);
    const status = elements.inventoryReorderList?.querySelector("[data-inventory-reorder-status]");
    const copied = await copyTextToClipboard(text);
    if (copied) {
      if (status) status.textContent = `Copied ${rows.length} reorder item${rows.length === 1 ? "" : "s"}.`;
    } else {
      if (status) status.textContent = "Copy blocked by the browser. The reorder list is open for manual copy.";
      openReorderCopyModal(text);
    }
    return;
  }

  const copySupplierReorder = event.target.closest("[data-copy-supplier-reorder]")?.dataset.copySupplierReorder;
  if (copySupplierReorder) {
    const text = inventorySupplierReorderText(copySupplierReorder);
    const copied = await copyTextToClipboard(text);
    if (!copied) openReorderCopyModal(text);
    return;
  }

  const copyDispatchBrief = event.target.closest("[data-copy-dispatch-brief]")?.dataset.copyDispatchBrief;
  if (copyDispatchBrief) {
    const job = roleScopedJobs().find((item) => item.id === copyDispatchBrief);
    if (!job) return;
    const copied = await copyTextToClipboard(dispatchBriefText(job));
    const status = elements.jobDetail?.querySelector("[data-dispatch-brief-status]");
    if (status) {
      status.textContent = copied
        ? "Dispatch brief copied."
        : "Copy blocked by the browser. Open the job details and select the brief text manually if needed.";
    }
    return;
  }

  const addSupplier = event.target.closest("[data-add-supplier]");
  if (addSupplier) {
    if (!canManageSuppliersOrRecord("add supplier")) return;
    openSupplierModal("");
    return;
  }

  const editSupplier = event.target.closest("[data-edit-supplier]")?.dataset.editSupplier;
  if (editSupplier) {
    if (!canManageSuppliersOrRecord("edit supplier")) return;
    openSupplierModal(editSupplier);
    return;
  }

  if (event.target.closest("[data-save-supplier]")) {
    event.preventDefault();
    if (!canManageSuppliersOrRecord("save supplier")) return;
    submitSupplierForm(elements.supplierForm);
    return;
  }

  const pickLoadoutMaterial = event.target.closest("[data-pick-loadout-material]");
  if (pickLoadoutMaterial) {
    if (!canOrRecord("parts", "mark daily loadout picked")) return;
    const picked = markLoadoutMaterialPicked(
      pickLoadoutMaterial.dataset.pickLoadoutMaterial,
      pickLoadoutMaterial.dataset.pickLoadoutDay || todayISO()
    );
    if (!picked) {
      renderSchedule();
      renderDetail();
    }
    return;
  }

  const addTemplateReservations = event.target.closest("[data-add-template-reservations]");
  if (addTemplateReservations) {
    if (!canOrRecord("parts", "add template pick list")) return;
    updateSelectedJob((job) => {
      const added = addTemplateReservationsToJob(job);
      if (added) {
        addJobMessage(job, {
          direction: "note",
          body: `Pick list updated: ${added} template material${added === 1 ? "" : "s"} reserved.`
        });
      }
      return job;
    });
    return;
  }

  const pickedReservation = event.target.closest("[data-mark-reservation-picked]")?.dataset.markReservationPicked;
  if (pickedReservation) {
    if (!canOrRecord("parts", "mark material picked")) return;
    updateSelectedJob((job) => {
      const picked = markReservationPicked(job, pickedReservation);
      if (picked) {
        addJobMessage(job, {
          direction: "note",
          body: `Pick list item loaded: ${picked.qty} x ${picked.name}.`
        });
      }
      return job;
    });
    return;
  }

  const removeReservation = event.target.closest("[data-remove-reservation]")?.dataset.removeReservation;
  if (removeReservation) {
    if (!canOrRecord("parts", "remove reserved material")) return;
    updateSelectedJob((job) => {
      const removed = removeReservationFromJob(job, removeReservation);
      if (removed) {
        addJobMessage(job, {
          direction: "note",
          body: `Pick list item removed: ${removed.qty} x ${removed.name}.`
        });
      }
      return job;
    });
    return;
  }

  const inventoryOrderFilter = event.target.closest("[data-inventory-order-filter]")?.dataset.inventoryOrderFilter;
  if (inventoryOrderFilter) {
    state.inventoryOrderFilter = inventoryOrderFilter;
    renderInventoryLite();
    return;
  }

  const viewInventoryOrder = event.target.closest("[data-view-inventory-order]")?.dataset.viewInventoryOrder;
  if (viewInventoryOrder) {
    openInventoryOrderDetail(viewInventoryOrder);
    return;
  }

  const cancelInventoryOrder = event.target.closest("[data-cancel-inventory-order]")?.dataset.cancelInventoryOrder;
  if (cancelInventoryOrder) {
    if (!canOrRecord("invoice", "cancel remaining inventory order")) return;
    cancelRemainingPurchaseOrder(cancelInventoryOrder);
    return;
  }

  const orderSupplierPo = event.target.closest("[data-order-supplier-po]")?.dataset.orderSupplierPo;
  if (orderSupplierPo) {
    if (!canOrRecord("invoice", "create supplier purchase order")) return;
    openSupplierPurchaseOrderModal(orderSupplierPo);
    return;
  }

  const receiveSupplierPo = event.target.closest("[data-receive-supplier-po]")?.dataset.receiveSupplierPo;
  if (receiveSupplierPo) {
    if (!canOrRecord("invoice", "receive supplier purchase order")) return;
    if (elements.inventoryOrderDetailModal?.open) elements.inventoryOrderDetailModal.close("receive");
    openSupplierReceiveOrderModal(receiveSupplierPo);
    return;
  }

  const orderInventoryItem = event.target.closest("[data-order-inventory-item]")?.dataset.orderInventoryItem;
  if (orderInventoryItem) {
    if (!canOrRecord("invoice", "order inventory")) return;
    openInventoryOrderModal(orderInventoryItem);
    return;
  }

  const receiveInventoryOrderButton = event.target.closest("[data-receive-inventory-order]");
  if (receiveInventoryOrderButton) {
    if (!canOrRecord("invoice", "receive inventory")) return;
    if (elements.inventoryOrderDetailModal?.open) elements.inventoryOrderDetailModal.close("receive-line");
    openInventoryOrderModal(receiveInventoryOrderButton.dataset.itemId, receiveInventoryOrderButton.dataset.receiveInventoryOrder);
    return;
  }

  const inventoryOpenJob = event.target.closest("[data-inventory-open-job]")?.dataset.inventoryOpenJob;
  if (inventoryOpenJob) {
    if (!roleScopedJobs().some((job) => job.id === inventoryOpenJob)) return;
    state.selectedJobId = inventoryOpenJob;
    elements.inventoryUsageModal?.close("open-job");
    activateView("inbox");
    render();
    return;
  }

  const inventoryAddPartLine = event.target.closest("[data-inventory-add-part-line]");
  if (inventoryAddPartLine) {
    if (!canOrRecord("invoice", "add inventory usage to invoice")) return;
    const jobId = inventoryAddPartLine.dataset.jobId;
    const partIndex = Number(inventoryAddPartLine.dataset.partIndex);
    const usageKey = inventoryAddPartLine.dataset.usageKey || elements.inventoryUsageModal?.dataset.inventoryUsageKey || "";
    updateJobById(jobId, (job) => {
      const line = addPartToInvoice(job, partIndex);
      if (line) {
        addJobMessage(job, {
          direction: "note",
          body: `Inventory usage added to invoice: ${line.description} for ${formatMoney(invoiceLineItemTotal(line))}.`
        });
      }
      return job;
    });
    if (elements.inventoryUsageModal?.open) {
      renderInventoryUsageModal(usageKey);
    }
    return;
  }

  const inventoryPartKey = event.target.closest("[data-save-inventory-part]")?.dataset.saveInventoryPart;
  if (inventoryPartKey) {
    if (!canOrRecord("invoice", "save frequent part to inventory")) return;
    const aggregate = unsavedFrequentLoggedParts().find((part) => normalizedInventoryName(part.name) === inventoryPartKey);
    if (!aggregate) return;
    const item = normalizePricebookItem({
      name: aggregate.name,
      description: "Saved from frequently logged parts",
      category: "Materials",
      unit: "each",
      unitPrice: partSuggestedBillRate({ cost: aggregate.defaultCost, qty: 1 }) || aggregate.defaultCost,
      defaultCost: aggregate.defaultCost,
      preferredSupplier: aggregate.source === "supplier" ? "Supplier" : "",
      truckStock: 0,
      reorderPoint: 0,
      taxable: false,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    state.pricebookItems = [item, ...state.pricebookItems.map(normalizePricebookItem)];
    save();
    renderPricebook();
    renderInventoryLite();
    renderDetail();
    return;
  }

  const deleteLineItemButton = event.target.closest("[data-delete-line-index], [data-delete-line-item]");
  if (deleteLineItemButton) {
    if (!canOrRecord("invoice", "remove invoice line item")) return;
    updateSelectedJob((job) => {
      const invoice = invoiceRecord(job);
      const lineIndex = Number(deleteLineItemButton.dataset.deleteLineIndex);
      const removed = Number.isInteger(lineIndex)
        ? invoice.lineItems[lineIndex]
        : invoice.lineItems.find((item) => item.id === deleteLineItemButton.dataset.deleteLineItem);
      if (!removed) return job;
      if (isProtectedInvoiceLine(removed)) {
        showToast("Line item locked", "Collected work cannot be removed from the invoice total.", "warning");
        return job;
      }
      invoice.lineItems = Number.isInteger(lineIndex)
        ? invoice.lineItems.filter((_, index) => index !== lineIndex)
        : invoice.lineItems.filter((item) => item.id !== deleteLineItemButton.dataset.deleteLineItem);
      job.invoice = normalizeInvoiceRecord(invoice, job);
      updateInvoiceFromLineItems(job);
      if (normalizeInvoiceLineItem(removed).source === INVOICE_PART_LINE_SOURCE) {
        job.parts = (job.parts || []).map((part, index) => {
          const normalized = normalizeJobPart(part, index);
          return normalized.invoiceLineItemId === normalizeInvoiceLineItem(removed).id || partInvoiceSourceId(normalized) === normalizeInvoiceLineItem(removed).sourceId
            ? { ...normalized, invoiceLineItemId: "", billedAt: "", billedBy: "", updatedAt: new Date().toISOString(), updatedBy: accountDisplayName() }
            : normalized;
        });
      }
      addJobMessage(job, { direction: "note", body: `Invoice line item removed: ${removed.description}.` });
      return job;
    });
    return;
  }

  const deletePartButton = event.target.closest("[data-delete-part-index]");
  if (deletePartButton) {
    if (!canOrRecord("parts", "remove logged part")) return;
    updateSelectedJob((job) => {
      const partIndex = Number(deletePartButton.dataset.deletePartIndex);
      if (!Number.isInteger(partIndex) || partIndex < 0 || partIndex >= (job.parts || []).length) return job;
      const removed = job.parts[partIndex];
      job.parts = job.parts.filter((_, index) => index !== partIndex);
      addJobMessage(job, {
        direction: "note",
        body: `Logged part removed: ${removed.qty || "1"} x ${removed.name || "part"}${removed.source ? ` from ${removed.source}` : ""}.`
      });
      return job;
    });
    return;
  }

  const addPartLineButton = event.target.closest("[data-add-part-line-index]");
  if (addPartLineButton) {
    if (!canOrRecord("invoice", "add logged part to invoice")) return;
    updateSelectedJob((job) => {
      const partIndex = Number(addPartLineButton.dataset.addPartLineIndex);
      if (!Number.isInteger(partIndex) || partIndex < 0 || partIndex >= (job.parts || []).length) return job;
      const line = addPartToInvoice(job, partIndex);
      if (!line) return job;
      addJobMessage(job, {
        direction: "note",
        body: `Logged part added to invoice: ${line.description} for ${formatMoney(invoiceLineItemTotal(line))}.`
      });
      return job;
    });
    return;
  }

  const savePartPricebookButton = event.target.closest("[data-save-part-pricebook-index]");
  if (savePartPricebookButton) {
    if (!canOrRecord("invoice", "save logged part to pricebook")) return;
    updateSelectedJob((job) => {
      const partIndex = Number(savePartPricebookButton.dataset.savePartPricebookIndex);
      if (!Number.isInteger(partIndex) || partIndex < 0 || partIndex >= (job.parts || []).length) return job;
      const item = savePartToPricebook(job, partIndex);
      if (!item) return job;
      addJobMessage(job, {
        direction: "note",
        body: `Logged part saved to pricebook: ${item.name} at ${formatMoney(item.unitPrice)}.`
      });
      return job;
    });
    return;
  }

  if (event.target.closest("[data-create-invoice-from-estimate]")) {
    if (!canOrRecord("invoice", "create invoice from approved estimate")) return;
    updateSelectedJob((job) => {
      if (!canCreateInvoiceFromEstimate(job)) return job;
      const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
      createInvoiceFromApprovedEstimate(job);
      job.status = invoiceBalance(job) ? "invoiced" : "paid";
      addJobMessage(job, {
        direction: "note",
        body: `Invoice created from approved estimate #${estimate.revisionNumber || 1} for ${formatMoney(estimate.amount)}.`
      });
      return job;
    });
    return;
  }

  if (event.target.closest("[data-add-parts-lines]")) {
    if (!canOrRecord("invoice", "add parts to invoice")) return;
    updateSelectedJob((job) => {
      const partLines = [];
      (job.parts || []).forEach((part, index) => {
        const line = addPartToInvoice(job, index);
        if (line) partLines.push(line);
      });
      if (!partLines.length) return job;
      addJobMessage(job, {
        direction: "note",
        body: `${partLines.length} logged part${partLines.length === 1 ? "" : "s"} added to the invoice.`
      });
      return job;
    });
    return;
  }

  const templatePricebookLine = event.target.closest("[data-add-template-pricebook-line]");
  if (templatePricebookLine) {
    if (!canOrRecord("invoice", "add template pricebook line")) return;
    const item = pricebookItemById(templatePricebookLine.dataset.addTemplatePricebookLine);
    if (!item) return;
    updateSelectedJob((job) => {
      const invoice = invoiceRecord(job);
      invoice.lineItems = invoiceLineItemsWithBaseline(invoice, [pricebookLineFromItem(item)]);
      job.invoice = normalizeInvoiceRecord(invoice, job);
      updateInvoiceFromLineItems(job);
      addJobMessage(job, {
        direction: "note",
        body: `Template pricebook item added: ${item.name} (${formatMoney(item.unitPrice)}).`
      });
      return job;
    });
    return;
  }

  const fileIndex = event.target.closest("[data-view-file]")?.dataset.viewFile;
  if (fileIndex !== undefined) {
    const job = selectedJob();
    const file = job?.files?.[Number(fileIndex)];
    viewJobFile(file);
    return;
  }

  const portalViewFileIndex = event.target.closest("[data-portal-view-file]")?.dataset.portalViewFile;
  if (portalViewFileIndex !== undefined) {
    const job = state.portalJob;
    const file = job?.files?.[Number(portalViewFileIndex)];
    viewJobFile(file);
    return;
  }

  const portalDownloadFileIndex = event.target.closest("[data-portal-download-file]")?.dataset.portalDownloadFile;
  if (portalDownloadFileIndex !== undefined) {
    const job = state.portalJob;
    const file = job?.files?.[Number(portalDownloadFileIndex)];
    downloadJobFile(file);
    return;
  }

  const receiptFileId = event.target.closest("[data-view-receipt-file]")?.dataset.viewReceiptFile;
  if (receiptFileId) {
    const job = selectedJob();
    const file = job?.files?.find((item) => item.id === receiptFileId);
    viewJobFile(file);
    return;
  }

  const approvalFileId = event.target.closest("[data-view-approval-file]")?.dataset.viewApprovalFile;
  if (approvalFileId) {
    const job = selectedJob() || state.jobs.find((item) => latestApprovalPdfFile(item)?.id === approvalFileId);
    const pageFile = state.approvalDownloadFile?.id === approvalFileId ? state.approvalDownloadFile : null;
    const file = job?.files?.find((item) => item.id === approvalFileId);
    viewJobFile(pageFile || file);
    return;
  }

  const equipmentMaintenanceButton = event.target.closest("[data-create-equipment-maintenance]");
  if (equipmentMaintenanceButton) {
    if (!canOrRecord("createJob", "create equipment maintenance job")) return;
    createMaintenanceJobFromEquipment(
      equipmentMaintenanceButton.dataset.sourceJobId || state.selectedJobId,
      equipmentMaintenanceButton.dataset.createEquipmentMaintenance
    );
    return;
  }

  const receiptPaymentId = event.target.closest("[data-generate-receipt-payment]")?.dataset.generateReceiptPayment;
  if (receiptPaymentId) {
    if (!canOrRecord("paid", "generate payment receipt")) return;
    updateSelectedJob((job) => {
      try {
        const receiptFile = attachReceiptToPayment(job, receiptPaymentId);
        const payment = paymentRecords(invoiceRecord(job)).find((record) => record.id === receiptPaymentId);
        addJobMessage(job, {
          direction: "note",
          body: `Receipt generated for ${formatMoney(payment?.amount || 0)} payment. ${receiptFile.name} attached to job files.`
        });
      } catch (error) {
        showToast("Receipt not generated", error.message || "Could not generate that receipt.", "danger");
      }
      return job;
    });
    return;
  }

  const approvalDecisionButton = event.target.closest("[data-approval-decision]");
  if (approvalDecisionButton) {
    const approvalForm = approvalDecisionButton.closest("#approvalForm");
    if (approvalForm) {
      const denialPanel = approvalForm.querySelector("[data-denial-reason]");
      const denialText = approvalForm.querySelector('textarea[name="declineReason"]');
      if (approvalDecisionButton.dataset.approvalDecision === "declined" && denialPanel?.hidden) {
        event.preventDefault();
        denialPanel.hidden = false;
        denialText.required = true;
        approvalDecisionButton.textContent = "Send decline";
        denialText.focus();
        return;
      }
      if (approvalDecisionButton.dataset.approvalDecision === "approved") {
        if (denialPanel) denialPanel.hidden = true;
        if (denialText) denialText.required = false;
      }
    }
  }

  const clearSignature = event.target.closest("[data-clear-signature]");
  if (clearSignature) {
    clearApprovalSignature(clearSignature.closest("#approvalForm"));
    return;
  }

  const deleteEquipmentId = event.target.closest("[data-equipment-delete]")?.dataset.equipmentDelete;
  if (deleteEquipmentId) {
    if (!canOrRecord("customer-profile", "delete equipment record")) return;
    updateSelectedJob((job) => {
      const equipment = job.equipment.find((record) => record.id === deleteEquipmentId);
      job.equipment = job.equipment.filter((record) => record.id !== deleteEquipmentId);
      if (equipment) {
        addJobMessage(job, {
          direction: "note",
          body: `Equipment record deleted: ${equipmentLabel(equipment)}.`
        });
      }
      return job;
    });
    return;
  }

  const openModal = event.target.closest("[data-open-job-modal], #newJobButton");
  if (openModal) {
    if (!canOrRecord("createJob", "open new job form")) return;
    elements.jobForm.reset();
    renderNewJobPickers({
      trade: "HVAC",
      jobType: "tbd",
      urgency: "normal",
      durationMinutes: String(DEFAULT_JOB_DURATION_MINUTES),
      technician: "To Be Determined"
    });
    renderJobTemplatePicker(suggestedJobTemplateKeyFromForm(elements.jobForm));
    elements.jobModal.showModal();
    return;
  }

  const cancelModal = event.target.closest("[data-cancel-modal]")?.dataset.cancelModal;
  if (cancelModal === "job") {
    elements.jobModal.close("cancel");
    return;
  }
  if (cancelModal === "action") {
    clearActionFormDraft();
    state.pendingPaymentReview = null;
    elements.actionModal.close("cancel");
    return;
  }
  if (cancelModal === "delete") {
    elements.deleteModal.close("cancel");
    return;
  }
  if (cancelModal === "team-remove") {
    elements.teamRemoveForm.dataset.userId = "";
    elements.teamRemoveModal.close("cancel");
    return;
  }
  if (cancelModal === "import-confirm") {
    elements.importConfirmModal.close("cancel");
    return;
  }
  if (cancelModal === "company-settings") {
    elements.companySettingsModal.close("cancel");
    return;
  }
  if (cancelModal === "activity-detail") {
    elements.activityDetailModal.close("cancel");
    return;
  }
  if (cancelModal === "custom-role") {
    cancelCustomRoleEdit();
    return;
  }
  if (cancelModal === "pricebook-edit") {
    elements.pricebookEditModal.close("cancel");
    return;
  }
  if (cancelModal === "inventory-usage") {
    elements.inventoryUsageModal.classList.remove("fallback-open");
    elements.inventoryUsageModal.close("cancel");
    return;
  }
  if (cancelModal === "inventory-order-detail") {
    elements.inventoryOrderDetailModal.close("cancel");
    return;
  }
  if (cancelModal === "inventory-order") {
    elements.inventoryOrderModal.close("cancel");
    return;
  }
  if (cancelModal === "supplier") {
    elements.supplierModal.close("cancel");
    return;
  }
  if (cancelModal === "reorder-copy") {
    elements.reorderCopyModal.close("cancel");
    return;
  }

  const taskToggle = event.target.closest("[data-task-toggle]");
  if (taskToggle) {
    if (!canOrRecord("task-toggle", "toggle task")) return;
    const taskId = taskToggle.dataset.taskToggle;
    updateSelectedJob((job) => {
      const task = job.tasks.find((item) => item.id === taskId);
      if (!task) return job;
      task.done = !task.done;
      task.doneAt = task.done ? new Date().toISOString() : "";
      task.doneBy = task.done ? accountDisplayName() : "";
      addJobMessage(job, {
        direction: "note",
        body: `Task ${task.done ? "completed" : "reopened"}: ${task.title}`
      });
      return job;
    });
    return;
  }

  const applyTemplateButton = event.target.closest("[data-apply-job-template]");
  if (applyTemplateButton) {
    if (!canOrRecord("task", "apply job template")) return;
    const jobId = applyTemplateButton.dataset.applyJobTemplate;
    state.selectedJobId = jobId;
    updateSelectedJob((job) => {
      const appliedTemplate = applyJobTemplate(job, { forceMetadata: true });
      addJobMessage(job, {
        direction: "note",
        body: appliedTemplate.added
          ? `${appliedTemplate.template.title} template applied with ${appliedTemplate.added} default task${appliedTemplate.added === 1 ? "" : "s"}.`
          : `${appliedTemplate.template.title} template already had all default tasks.`
      });
      return job;
    });
    return;
  }

  const notificationStatus = event.target.closest("[data-notification-status]");
  if (notificationStatus) {
    const notificationId = notificationStatus.dataset.notificationStatus;
    const jobId = notificationStatus.dataset.jobId;
    const status = notificationStatus.dataset.status;
    const existingJob = roleScopedJobs().find((job) => job.id === jobId);
    const existingNotification = ensureJobDefaults(existingJob || {}).notifications.find((item) => item.id === notificationId);
    if (!existingNotification) return;
    if (!canManageNotification(existingNotification.type)) {
      denyAction(notificationPermission(existingNotification.type), `${existingNotification.title} ${status}`);
      return;
    }
    updateJobById(jobId, (job) => {
      const notification = job.notifications.find((item) => item.id === notificationId);
      if (notification) {
        notification.status = status;
        notification.requiresReview = status === "queued";
        notification.updatedAt = new Date().toISOString();
        addJobMessage(job, {
          direction: "note",
          body: `${notification.title} marked ${notificationStatusLabel(status)}.`
        });
      }
      return job;
    });
    return;
  }

  const notificationComplete = event.target.closest("[data-notification-complete]");
  if (notificationComplete) {
    const notificationId = notificationComplete.dataset.notificationComplete;
    const jobId = notificationComplete.dataset.jobId;
    updateJobById(jobId, (job) => {
      const notification = job.notifications.find((item) => item.id === notificationId);
      if (notification) {
        notification.completedBy ||= {};
        notification.completedBy[assignmentSeenKey()] = new Date().toISOString();
      }
      return job;
    });
    return;
  }

  const messageComplete = event.target.closest("[data-message-complete]");
  if (messageComplete) {
    markJobMessagesSeen(messageComplete.dataset.messageComplete);
    render();
    return;
  }

  const paymentReviewRecord = event.target.closest("[data-payment-review-record]");
  if (paymentReviewRecord) {
    if (!canOrRecord("paid", "record reviewed payment")) return;
    const jobId = paymentReviewRecord.dataset.jobId;
    const messageId = paymentReviewRecord.dataset.paymentReviewRecord;
    const job = roleScopedJobs().find((item) => item.id === jobId);
    const message = ensureJobDefaults(job || {}).messages.find((item) => normalizeJobMessage(item).id === messageId);
    if (!job || !message) return;
    const parsed = parsePaymentReviewMessage(message);
    state.selectedJobId = jobId;
    state.pendingPaymentReview = { jobId, messageId };
    state.actionDraft = {
      action: "paid",
      jobId,
      values: {
        paidAmount: parsed.amount || invoiceBalance(job) || invoiceRecord(job).amount || "",
        paymentMethod: parsed.method || "other",
        paidAt: todayISO(),
        note: [parsed.reference ? `Reference: ${parsed.reference}` : "", parsed.note].filter(Boolean).join(" - ")
      }
    };
    openActionModal("paid");
    return;
  }

  const paymentReviewDismiss = event.target.closest("[data-payment-review-dismiss]");
  if (paymentReviewDismiss) {
    const jobId = paymentReviewDismiss.dataset.jobId;
    const messageId = paymentReviewDismiss.dataset.paymentReviewDismiss;
    markPaymentReviewMessage(jobId, messageId, "dismissed");
    return;
  }

  const notificationAction = event.target.closest("[data-notification-action]");
  if (notificationAction) {
    const jobId = notificationAction.dataset.jobId || state.selectedJobId;
    const type = notificationAction.dataset.notificationAction;
    if (!canManageNotification(type)) {
      denyAction(notificationPermission(type), type);
      return;
    }
    updateJobById(jobId, (job) => {
      queueJobNotification(job, type);
      return job;
    });
    return;
  }

  const followupComplete = event.target.closest("[data-followup-complete]");
  if (followupComplete) {
    const jobId = followupComplete.dataset.jobId;
    const reason = followupComplete.dataset.followupComplete;
    updateJobById(jobId, (job) => {
      followupStateFor(job, reason).completedBy[assignmentSeenKey()] = new Date().toISOString();
      return job;
    });
    return;
  }

  const followupSnooze = event.target.closest("[data-followup-snooze]");
  if (followupSnooze) {
    const jobId = followupSnooze.dataset.jobId;
    const reason = followupSnooze.dataset.followupSnooze;
    const until = new Date();
    until.setDate(until.getDate() + 1);
    updateJobById(jobId, (job) => {
      followupStateFor(job, reason).snoozedBy[assignmentSeenKey()] = until.toISOString();
      return job;
    });
    return;
  }

  const followupAction = event.target.closest("[data-followup-action]");
  if (followupAction) {
    const jobId = followupAction.dataset.jobId;
    const actionType = followupAction.dataset.followupAction;
    if (!roleScopedJobs().some((job) => job.id === jobId)) return;
    state.selectedJobId = jobId;
    const notificationType = followupNotificationType(actionType);
    if (notificationType) {
      if (!canManageNotification(notificationType)) {
        denyAction(notificationPermission(notificationType), notificationType);
        return;
      }
      updateSelectedJob((job) => {
        queueJobNotification(job, notificationType);
        return job;
      });
      return;
    }
    if (actionType === "create_invoice_from_estimate") {
      if (!canOrRecord("invoice", "create invoice from approved estimate")) return;
      updateSelectedJob((job) => {
        if (!canCreateInvoiceFromEstimate(job)) return job;
        const estimate = latestEstimateRevision(job) || normalizeEstimateRecord(job.estimate || {}, job);
        createInvoiceFromApprovedEstimate(job);
        job.status = invoiceBalance(job) ? "invoiced" : "paid";
        addJobMessage(job, {
          direction: "note",
          body: `Invoice created from approved estimate #${estimate.revisionNumber || 1} for ${formatMoney(estimate.amount)}.`
        });
        return job;
      });
      return;
    }
    if (actionType === "create_maintenance_job") {
      if (!canOrRecord("createJob", "create maintenance follow-up job")) return;
      createMaintenanceJobFromEquipment(jobId, followupAction.dataset.equipmentId || "");
      return;
    }
    if (["book", "complete", "invoice", "paid"].includes(actionType)) {
      if (!canOrRecord(actionType, `follow-up ${actionType}`)) return;
      renderDetail();
      openActionModal(actionType);
      return;
    }
    activateView("inbox");
    render();
    return;
  }

  const techJobAction = event.target.closest("[data-tech-job-action]");
  if (techJobAction) {
    const jobId = techJobAction.dataset.jobId;
    const action = techJobAction.dataset.techJobAction;
    if (!roleScopedJobs().some((job) => job.id === jobId)) return;
    markAssignmentSeen(jobId);
    markJobMessagesSeen(jobId);
    state.selectedJobId = jobId;
    if (action === "start" && can("start")) {
      updateJobById(jobId, (job) => {
        job.status = "in_progress";
        job.startedAt = new Date().toISOString();
        addJobMessage(job, {
          direction: "note",
          body: "Technician started the job from My work today."
        });
        return job;
      });
      return;
    }
    if (action === "complete" && can("complete")) {
      activateView("inbox");
      render();
      openActionModal("complete");
      return;
    }
    activateView("inbox");
    render();
    return;
  }

  const profitAction = event.target.closest("[data-profit-action]");
  if (profitAction) {
    const jobId = profitAction.dataset.jobId;
    const actionType = profitAction.dataset.profitAction;
    if (!roleScopedJobs().some((job) => job.id === jobId)) return;
    state.selectedJobId = jobId;
    markAssignmentSeen(jobId);
    markJobMessagesSeen(jobId);
    if (actionType === "close") {
      if (!canOrRecord("close", "profit watch close job")) return;
      updateSelectedJob((job) => {
        const summary = closeoutSummary(job);
        if (summary.ready) return closeJobRecord(job);
        state.jobActionNotice = {
          jobId: job.id,
          message: closeoutBlockedMessage(summary)
        };
        return job;
      });
      return;
    }
    activateView("inbox");
    render();
    if (["parts", "invoice", "paid"].includes(actionType)) {
      if (!canOrRecord(actionType, `profit watch ${actionType}`)) return;
      openActionModal(actionType);
    }
    return;
  }

  const receivableReminder = event.target.closest("[data-receivable-reminder]");
  if (receivableReminder) {
    if (!canOrRecord("payment-request", "send receivable reminder")) return;
    sendReceivableReminder(receivableReminder.dataset.receivableReminder);
    return;
  }

  const jobButton = event.target.closest("[data-job-id]");
  if (jobButton) {
    if (!roleScopedJobs().some((job) => job.id === jobButton.dataset.jobId)) return;
    markAssignmentSeen(jobButton.dataset.jobId);
    markJobMessagesSeen(jobButton.dataset.jobId);
    if (state.selectedJobId !== jobButton.dataset.jobId) {
      state.jobActionMenuOpen = false;
    }
    state.selectedJobId = jobButton.dataset.jobId;
    document.querySelector('[data-view="inbox"]').click();
    render();
    return;
  }

  const segment = event.target.closest("[data-filter]");
  if (segment) {
    state.activeFilter = segment.dataset.filter;
    document.querySelectorAll(".segment").forEach((button) => button.classList.remove("active"));
    segment.classList.add("active");
    state.jobActionMenuOpen = false;
    state.selectedJobId = visibleJobs()[0]?.id || null;
    render();
  }

  const scheduleFilter = event.target.closest("[data-schedule-filter]");
  if (scheduleFilter) {
    state.scheduleFilter = scheduleFilter.dataset.scheduleFilter || "week";
    renderSchedule();
    return;
  }

  const quickSchedule = event.target.closest("[data-quick-schedule-job]");
  if (quickSchedule) {
    if (!canOrRecord("book", "quick schedule")) return;
    const job = state.jobs.find((item) => item.id === quickSchedule.dataset.quickScheduleJob);
    if (!job) return;
    updateJobSchedule(job.id, {
      scheduleDate: quickSchedule.dataset.quickScheduleDate || todayISO(),
      startTime: quickSchedule.dataset.quickScheduleTime || job.startTime || "09:00",
      durationMinutes: job.durationMinutes,
      endTime: job.endTime || "",
      technician: job.technician
    });
    return;
  }

  const navItem = event.target.closest("[data-view]");
  if (navItem) {
    const view = navItem.dataset.view;
    activateView(view);
    return;
  }

  const closeoutAction = event.target.closest("[data-closeout-action]")?.dataset.closeoutAction;
  if (closeoutAction) {
    const status = elements.jobDetail?.querySelector("[data-closeout-status]");
    if (closeoutAction === "review_request") {
      if (!canOrRecord("paid", "queue closeout review request")) return;
      updateSelectedJob((job) => {
        queueJobNotification(job, "review_request");
        addJobMessage(job, {
          direction: "note",
          body: "Review request queued from closeout checklist."
        });
        return job;
      });
      return;
    }
    if (status) {
      status.textContent = closeoutAction === "tasks"
        ? "Open tasks are listed in the Tasks panel below."
        : "Equipment records and maintenance follow-ups are in Equipment and property below.";
    }
    return;
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;
  if (!canOrRecord(action, "job action")) return;

  if (["book", "estimate", "invoice", "paid", "payment-request", "change", "parts", "portal-update", "complete", "check-diagnosis"].includes(action)) {
    openActionModal(action);
    return;
  }

  if (action === "reopen") {
    updateSelectedJob((job) => {
      const invoice = invoiceRecord(job);
      const balance = invoiceBalance(job);
      job.status = "invoiced";
      job.invoice = normalizeInvoiceRecord({
        ...invoice,
        status: balance > 0 ? "partial" : "sent",
        updatedAt: new Date().toISOString(),
        updatedBy: accountDisplayName()
      }, { ...job, status: "invoiced" });
      addJobMessage(job, {
        direction: "note",
        body: `Job reopened for invoice edits by ${accountDisplayName()}. Existing payment history was kept.`
      });
      return job;
    });
    return;
  }

  if (action === "close") {
    updateSelectedJob((job) => {
      const summary = closeoutSummary(job);
      if (summary.ready) return closeJobRecord(job);
      state.jobActionNotice = {
        jobId: job.id,
        message: closeoutBlockedMessage(summary)
      };
      return job;
    });
    return;
  }

  if (action === "portal") {
    const job = selectedJob();
    if (!job) return;
    const url = customerPortalUrl(job);
    const copied = await copyTextToClipboard(url);
    state.jobActionNotice = {
      jobId: job.id,
      message: copied ? "Customer portal link copied." : "Customer portal link is ready. Copying was blocked by the browser.",
      url
    };
    updateSelectedJob((nextJob) => {
      addJobMessage(nextJob, {
        direction: "note",
        body: `Customer portal link ${copied ? "copied" : "created"}: ${url}`
      });
      return nextJob;
    });
    if (!copied) {
      showToast("Portal link ready", "Copying was blocked. The link is shown in the job notice.", "warning");
    } else {
      showToast("Portal link copied", "The reusable customer portal link is on your clipboard.", "success");
    }
    return;
  }

  if (action === "approval") {
    if (!selectedJob()) return;
    updateSelectedJob((job) => {
      job.approvalStatus = "sent";
      return job;
    });
    const job = selectedJob();
    if (!job) return;
    try {
      const url = await createApprovalLink(job);
      const copied = await copyTextToClipboard(url);
      updateSelectedJob((nextJob) => {
        queueJobNotification(nextJob, "approval_link", { url });
        state.jobActionNotice = {
          jobId: nextJob.id,
          message: copied ? "Approval link copied." : "Approval link is ready. Copying was blocked by the browser.",
          url
        };
        return nextJob;
      });
      showToast(copied ? "Approval link copied" : "Approval link ready", copied ? "The customer approval link is on your clipboard." : "Copying was blocked. The link is shown in the job notice.", copied ? "success" : "warning");
    } catch (error) {
      showToast("Approval link failed", error?.message || "Could not create approval link.", "danger");
    }
    return;
  }

  if (action === "delete") {
    openDeleteModal();
    return;
  }

  updateSelectedJob((job) => {
    if (action === "start") {
      job.status = "in_progress";
      job.startedAt = new Date().toISOString();
      addJobMessage(job, {
        direction: "note",
        body: "Technician started the job in the field."
      });
    }

    if (action === "approve") {
      job.approvalStatus = "approved";
      addJobMessage(job, {
        direction: "note",
        body: "Customer approval recorded."
      });
    }

    if (action === "check-photos") {
      job.fieldChecklist.photos = true;
      addJobMessage(job, { direction: "note", body: "Job photos marked captured." });
    }

    if (action === "check-signature") {
      job.fieldChecklist.signature = true;
      job.approvalStatus = job.approvalStatus === "not_sent" ? "approved" : job.approvalStatus;
      addJobMessage(job, { direction: "note", body: "Customer signature captured." });
    }

    return job;
  });
});

elements.jobForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canOrRecord("createJob", "create job")) return;
  createJob(new FormData(elements.jobForm));
  elements.jobModal.close();
});

elements.pricebookForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!canOrRecord("invoice", "manage pricebook")) return;
  addPricebookItem(new FormData(elements.pricebookForm));
  elements.pricebookForm.reset();
  const categoryInput = elements.pricebookForm.querySelector('[name="category"]');
  const categoryLabel = elements.pricebookCategoryPicker?.querySelector(".backline-picker-button span");
  const unitInput = elements.pricebookForm.querySelector('[name="unit"]');
  const unitLabel = elements.pricebookUnitPicker?.querySelector(".backline-picker-button span");
  if (categoryInput) categoryInput.value = "Repair";
  if (categoryLabel) categoryLabel.textContent = "Repair";
  if (unitInput) unitInput.value = "each";
  if (unitLabel) unitLabel.textContent = "each";
});

elements.companySettingsForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!can("exportData")) return;
  state.companySettings = companySettingsFromForm(elements.companySettingsForm);
  save();
  elements.companySettingsModal.close("saved");
  render();
});

elements.companySettingsForm?.addEventListener("input", () => {
  renderWorkspaceSetupProgress(companySettingsDraftFromForm(elements.companySettingsForm));
});

elements.companySettingsForm?.addEventListener("change", () => {
  renderWorkspaceSetupProgress(companySettingsDraftFromForm(elements.companySettingsForm));
});

elements.customRoleForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveCustomRole(elements.customRoleForm);
});

elements.cancelCustomRoleEdit?.addEventListener("click", () => {
  cancelCustomRoleEdit();
});

elements.createCustomRoleButton?.addEventListener("click", () => {
  openCustomRoleEditor("");
});

elements.customRoleForm?.addEventListener("input", (event) => {
  if (!event.target.closest("#customRoleForm")) return;
  renderCustomRoleLivePreview();
});

document.addEventListener("submit", async (event) => {
  const foundryPilotForm = event.target.closest("[data-foundry-pilot-form]");
  if (foundryPilotForm) {
    event.preventDefault();
    createFoundryPilotRecord(foundryPilotForm);
    return;
  }

  if (event.target.closest("#pricebookEditForm")) {
    event.preventDefault();
    if (!canOrRecord("invoice", "edit pricebook item")) return;
    if (updatePricebookItemFromForm(new FormData(elements.pricebookEditForm))) {
      elements.pricebookEditModal?.close("saved");
    }
    return;
  }

  if (event.target.closest("#inventoryOrderForm")) {
    event.preventDefault();
    if (!canOrRecord("invoice", "manage inventory orders")) return;
    const formData = new FormData(elements.inventoryOrderForm);
    const mode = String(formData.get("mode") || "order");
    const saved = mode === "receive"
      ? receiveInventoryOrder(formData)
      : mode === "supplier-receive"
        ? receiveSupplierPurchaseOrder(formData)
      : mode === "supplier-order"
        ? placeSupplierPurchaseOrder(formData)
        : placeInventoryOrder(formData);
    if (saved) {
      elements.inventoryOrderModal?.close(mode === "receive" || mode === "supplier-receive" ? "received" : "ordered");
    }
    return;
  }

  const supplierForm = event.target.closest("#supplierForm");
  if (supplierForm) {
    event.preventDefault();
    if (!canManageSuppliersOrRecord("save supplier")) return;
    submitSupplierForm(supplierForm);
    return;
  }

  const invoiceLineForm = event.target.closest("[data-invoice-line-form]");
  if (invoiceLineForm) {
    event.preventDefault();
    if (!canOrRecord("invoice", "add invoice line item")) return;
    setInvoiceLineFormStatus(invoiceLineForm, "");
    const lineItem = lineItemFromForm(new FormData(invoiceLineForm));
    if (!lineItem.description) {
      setInvoiceLineFormStatus(invoiceLineForm, "Choose a pricebook item or enter a line item description.");
      invoiceLineForm.querySelector('[name="description"]')?.focus();
      return;
    }
    if (!lineItem.unitPrice) {
      setInvoiceLineFormStatus(invoiceLineForm, "Enter a unit price before adding this line.");
      invoiceLineForm.querySelector('[name="unitPrice"]')?.focus();
      return;
    }
    updateSelectedJob((job) => {
      const invoice = invoiceRecord(job);
      invoice.lineItems = invoiceLineItemsWithBaseline(invoice, [lineItem]);
      job.invoice = normalizeInvoiceRecord(invoice, job);
      updateInvoiceFromLineItems(job);
      addJobMessage(job, {
        direction: "note",
        body: `Invoice line item added: ${lineItem.description} (${lineItem.qty} x ${formatMoney(lineItem.unitPrice)}).`
      });
      return job;
    });
    invoiceLineForm.reset();
    return;
  }

  const taskForm = event.target.closest("[data-task-form]");
  if (taskForm) {
    event.preventDefault();
    if (!canOrRecord("task", "create task")) return;
    const data = new FormData(taskForm);
    const title = String(data.get("title") || "").trim();
    if (!title) return;
    updateSelectedJob((job) => {
      const task = {
        id: createId(),
        title,
        phase: String(data.get("phase") || "field"),
        role: String(data.get("role") || "tech"),
        done: false,
        createdAt: new Date().toISOString(),
        createdBy: accountDisplayName()
      };
      job.tasks.push(task);
      addJobMessage(job, {
        direction: "note",
        body: `Task added for ${taskRoleLabel(task.role)} (${taskPhaseLabel(task.phase)}): ${task.title}`
      });
      return job;
    });
    return;
  }

  const partEditForm = event.target.closest("[data-edit-part-form]");
  if (partEditForm) {
    event.preventDefault();
    if (!canOrRecord("parts", "edit logged part")) return;
    const data = new FormData(partEditForm);
    const partIndex = Number(partEditForm.dataset.editPartForm);
    const name = String(data.get("name") || "").trim();
    if (!name) {
      partEditForm.querySelector('[name="name"]')?.focus();
      return;
    }
    updateSelectedJob((job) => {
      if (!Number.isInteger(partIndex) || partIndex < 0 || partIndex >= (job.parts || []).length) return job;
      const existing = job.parts[partIndex] || {};
      const updated = {
        ...existing,
        name,
        qty: String(data.get("qty") || "1").trim() || "1",
        source: String(data.get("source") || "truck stock").trim() || "truck stock",
        cost: normalizeValue(data.get("cost")),
        updatedAt: new Date().toISOString(),
        updatedBy: accountDisplayName()
      };
      job.parts = job.parts.map((part, index) => index === partIndex ? updated : part);
      addJobMessage(job, {
        direction: "note",
        body: `Logged part updated: ${updated.qty} x ${updated.name} from ${updated.source}${updated.cost ? ` at ${formatMoney(updated.cost)} each` : ""}.`
      });
      return job;
    });
    return;
  }

  const reservationForm = event.target.closest("[data-reservation-form]");
  if (reservationForm) {
    event.preventDefault();
    if (!canOrRecord("parts", "reserve material")) return;
    const data = new FormData(reservationForm);
    const item = reservationItemByName(data.get("materialName"));
    if (!item) return;
    const qty = Math.max(1, Math.round(Number(data.get("qty")) || 1));
    const note = String(data.get("note") || "").trim();
    updateSelectedJob((job) => {
      const reservation = addReservationToJob(job, item, qty, note);
      if (reservation) {
        addJobMessage(job, {
          direction: "note",
          body: `Material reserved for pick list: ${reservation.qty} x ${reservation.name}.`
        });
      }
      return job;
    });
    return;
  }

  const scheduleForm = event.target.closest("[data-schedule-form]");
  if (scheduleForm) {
    event.preventDefault();
    if (!canOrRecord("book", "update schedule")) return;
    const data = new FormData(scheduleForm);
    updateJobSchedule(scheduleForm.dataset.scheduleForm, {
      scheduleDate: data.get("scheduleDate"),
      startTime: data.get("startTime"),
      durationMinutes: data.get("durationMinutes"),
      technician: data.get("technician")
    });
    return;
  }

  const customerProfileForm = event.target.closest("[data-customer-profile-form]");
  if (customerProfileForm) {
    event.preventDefault();
    if (!canOrRecord("customer-profile", "update customer profile")) return;
    saveCustomerProfile(customerProfileForm.dataset.customerProfileForm, new FormData(customerProfileForm));
    return;
  }

  const equipmentForm = event.target.closest("[data-equipment-form]");
  if (equipmentForm) {
    event.preventDefault();
    if (!canOrRecord("customer-profile", "add equipment record")) return;
    const record = equipmentRecordFromForm(equipmentForm);
    updateSelectedJob((job) => {
      job.equipment.push(record);
      addJobMessage(job, {
        direction: "note",
        body: `Equipment record added: ${equipmentLabel(record)}${record.serial ? `, serial ${record.serial}` : ""}.`
      });
      return job;
    });
    equipmentForm.reset();
    return;
  }

  const equipmentEditForm = event.target.closest("[data-equipment-edit-form]");
  if (equipmentEditForm) {
    event.preventDefault();
    if (!canOrRecord("customer-profile", "edit equipment record")) return;
    const equipmentId = equipmentEditForm.dataset.equipmentEditForm;
    const edited = {
      ...equipmentRecordFromForm(equipmentEditForm),
      id: equipmentId
    };
    updateSelectedJob((job) => {
      const existing = job.equipment.find((record) => record.id === equipmentId);
      job.equipment = job.equipment.map((record) => record.id === equipmentId
        ? normalizeEquipmentRecord({
            ...existing,
            ...edited,
            createdAt: existing?.createdAt || edited.createdAt,
            createdBy: existing?.createdBy || edited.createdBy,
            updatedAt: new Date().toISOString(),
            updatedBy: accountDisplayName()
          })
        : record);
      addJobMessage(job, {
        direction: "note",
        body: `Equipment record updated: ${equipmentLabel(edited)}.`
      });
      return job;
    });
    return;
  }

  const actionForm = event.target.closest("#actionForm");
  if (actionForm) {
    event.preventDefault();
    const action = actionForm.dataset.action;
    if (!canOrRecord(action, "submit action form")) return;
    const data = new FormData(actionForm);
    if (action === "paid" && normalizeValue(data.get("paidAmount")) <= 0) {
      showToast("Payment amount needed", "Enter the amount received before recording payment.", "warning");
      return;
    }
    if (action === "payment-request" && normalizeValue(data.get("amount")) <= 0) {
      showToast("Request amount needed", "Enter the amount to request before sending.", "warning");
      return;
    }
    applyActionForm(action, data);
    if (action === "paid" && state.pendingPaymentReview?.jobId === state.selectedJobId) {
      markPaymentReviewMessage(state.pendingPaymentReview.jobId, state.pendingPaymentReview.messageId, "recorded");
      state.pendingPaymentReview = null;
    }
    clearActionFormDraft();
    elements.actionModal.close();
    return;
  }

  const deleteForm = event.target.closest("#deleteForm");
  if (deleteForm) {
    event.preventDefault();
    if (!canOrRecord("delete", "delete job")) return;
    const jobId = deleteForm.dataset.jobId || state.selectedJobId;
    elements.deleteModal.close("delete");
    await softDeleteJob(jobId);
    deleteForm.dataset.jobId = "";
    return;
  }

  const teamRemoveForm = event.target.closest("#teamRemoveForm");
  if (teamRemoveForm) {
    event.preventDefault();
    if (!requireTeamManagement("remove team member")) return;
    const userId = teamRemoveForm.dataset.userId || "";
    elements.teamRemoveModal.close("remove");
    await confirmRemoveTeamMember(userId);
    teamRemoveForm.dataset.userId = "";
    return;
  }

  const fileUploadForm = event.target.closest("[data-file-upload-form]");
  if (fileUploadForm) {
    event.preventDefault();
    if (!canOrRecord("uploadFiles", "upload job file")) return;
    const data = new FormData(fileUploadForm);
    const files = fileUploadForm.elements.files.files;
    if (!files.length) return;
    const submit = fileUploadForm.querySelector("button[type='submit']");
    submit.disabled = true;
    submit.textContent = "Uploading...";
    try {
      await uploadJobFiles(files, String(data.get("note") || "").trim());
      fileUploadForm.reset();
    } catch (error) {
      showToast("Upload failed", error?.message || "File upload failed.", "danger");
    } finally {
      submit.disabled = false;
      submit.textContent = "Upload";
    }
    return;
  }

  const authForm = event.target.closest("#authForm");
  if (authForm) {
    event.preventDefault();
    const client = getSupabaseClient();
    const submitter = event.submitter;
    const mode = submitter?.dataset.authMode || "signin";
    const data = new FormData(authForm);
    const displayName = formatDisplayName(data.get("displayName"));
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    if (!client) {
      elements.authGateStatus.textContent = "Supabase is not configured yet.";
      return;
    }
    if (mode === "signup" && !displayName) {
      elements.authGateStatus.textContent = "Enter a username like first.last before creating the account.";
      authForm.elements.displayName?.focus();
      return;
    }
    if (mode === "signup" && password !== confirmPassword) {
      elements.authGateStatus.textContent = "Passwords do not match. Re-enter the same password to create the account.";
      authForm.elements.confirmPassword?.focus();
      return;
    }

    setAccountSwitching(true, mode === "signup" ? "Creating account..." : "Signing in...");
    const result = mode === "signup"
      ? await client.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${window.location.pathname}`,
            data: {
              display_name: displayName,
              full_name: displayName
            }
          }
        })
      : await client.auth.signInWithPassword({ email, password });

    if (result.error) {
      setAccountSwitching(false);
      elements.authGateStatus.textContent = friendlyAuthError(result.error);
      return;
    }

    if (mode === "signup" && isExistingSignup(result)) {
      setAccountSwitching(false);
      elements.authGateStatus.textContent = "An account already exists for that email. Use Sign in instead.";
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setAccountSwitching(false);
      setPendingOwnerOnboarding(email);
      elements.authGateStatus.textContent = "Account created. Check your email to confirm it, then come back and sign in.";
      return;
    }

    resetSecureWorkspaceState();
    state.currentUser = result.data.session?.user || null;
    if (!state.currentUser) {
      setAccountSwitching(false);
      elements.authGateStatus.textContent = "Check your email to confirm the account, then sign in.";
      return;
    }

    if (mode === "signin" && displayName) {
      const { data: updatedUser } = await client.auth.updateUser({
        data: {
          display_name: displayName,
          full_name: displayName
        }
      });
      state.currentUser = updatedUser?.user || state.currentUser;
    }

    try {
      updateAuthStatus();
      await loadCreatorAccess();
      const createdOwnerWorkspace = await ensureRemoteOrganization();
      queueOwnerWorkspaceSettingsOnboarding(mode === "signup" && createdOwnerWorkspace);
      await loadRemoteData();
      state.selectedJobId = state.jobs[0]?.id || null;
      elements.storageStatus.textContent = "Secure database ready";
      setAuthGate(false);
      routeFromHash();
      openQueuedWorkspaceSettings();
      setAccountSwitching(false);
    } catch (error) {
      setAccountSwitching(false);
      setAuthGate(true, error?.message || "Signed in, but secure database setup failed.");
    }
    return;
  }

  const teamInviteForm = event.target.closest("#teamInviteForm");
  if (teamInviteForm) {
    event.preventDefault();
    await createTeamInvite(new FormData(teamInviteForm));
    return;
  }

  const customerPortalPaymentForm = event.target.closest("#customerPortalPaymentForm");
  if (customerPortalPaymentForm) {
    event.preventDefault();
    const jobId = customerPortalPaymentForm.dataset.portalJobId || "";
    const token = customerPortalPaymentForm.dataset.portalToken || "";
    const data = Object.fromEntries(new FormData(customerPortalPaymentForm).entries());
    if (normalizeValue(data.amount) <= 0) return;
    try {
      const job = await submitCustomerPortalPaymentResponse(token, jobId, data);
      renderCustomerPortalPage(job, { notice: "Your payment details have been sent to the office.", noticeType: "success" });
    } catch (error) {
      await renderTokenCustomerPortalPage(token || jobId, {
        forceRemote: Boolean(token),
        notice: error?.message || "Your payment details could not be sent. Please contact the office directly.",
        noticeType: "danger"
      });
    }
    return;
  }

  const customerPortalReplyForm = event.target.closest("#customerPortalReplyForm");
  if (customerPortalReplyForm) {
    event.preventDefault();
    const jobId = customerPortalReplyForm.dataset.portalJobId || "";
    const token = customerPortalReplyForm.dataset.portalToken || "";
    const reply = String(new FormData(customerPortalReplyForm).get("reply") || "").trim();
    if (!reply) return;
    try {
      const job = await submitCustomerPortalReply(token, jobId, reply);
      renderCustomerPortalPage(job, { notice: "Your message has been sent to the office.", noticeType: "success" });
    } catch (error) {
      await renderTokenCustomerPortalPage(token || jobId, {
        forceRemote: Boolean(token),
        notice: error?.message || "Your message could not be sent. Please contact the office directly.",
        noticeType: "danger"
      });
    }
    return;
  }

  const approvalForm = event.target.closest("#approvalForm");
  if (approvalForm) {
    event.preventDefault();
    const token = approvalForm.dataset.approvalToken || "";
    const match = window.location.hash.match(/^#approve=(.+)$/);
    const jobId = match ? decodeURIComponent(match[1]) : "";
    const submitter = event.submitter;
    const decision = submitter?.dataset.approvalDecision || "approved";
    const data = new FormData(approvalForm);
    const signature = String(data.get("signature") || "").trim();
    const expectedCustomerName = approvalForm.dataset.customerName || "";
    const signatureImage = approvalSignatureImage(approvalForm);
    const declineReason = String(data.get("declineReason") || "").trim();
    const depositCollected = data.get("deposit") === "on";
    const showApprovalError = (message) => {
      const existing = elements.approvalPage.querySelector(".approval-banner");
      existing?.remove();
      approvalForm.insertAdjacentHTML("afterbegin", `<div class="approval-banner danger">${escapeHtml(message)}</div>`);
    };

    if (decision === "approved" && !signature) {
      showApprovalError(`Please type the customer name on this job before approving: ${expectedCustomerName}.`);
      approvalForm.querySelector('input[name="signature"]')?.focus();
      return;
    }

    if (decision === "approved" && !approvalSignatureMatches(signature, expectedCustomerName)) {
      showApprovalError(`Signature must match the customer name on this job: ${expectedCustomerName}.`);
      approvalForm.querySelector('input[name="signature"]')?.focus();
      return;
    }

    if (decision === "approved" && !signatureImage) {
      showApprovalError("Please draw the customer signature before approving the estimate.");
      approvalForm.querySelector("[data-signature-pad]")?.focus();
      return;
    }

    if (decision === "declined" && !declineReason) {
      const denialPanel = approvalForm.querySelector("[data-denial-reason]");
      const denialText = approvalForm.querySelector('textarea[name="declineReason"]');
      denialPanel.hidden = false;
      denialText.required = true;
      showApprovalError("Please explain why you are declining so Backline can follow up correctly.");
      denialText.focus();
      return;
    }

    let approvalPdfFile = null;
    if (decision === "approved") {
      const pdfJob = approvalJobFromForm(approvalForm, {
        approvalStatus: "approved",
        approvedAt: new Date().toISOString(),
        customerSignature: signature,
        customerSignatureImage: signatureImage,
        depositCollected,
        declineReason: ""
      });
      try {
        approvalPdfFile = await createApprovalPdfFile(pdfJob, { companySettings: state.portalCompanySettings });
      } catch (error) {
        showApprovalError(error.message);
        return;
      }
    }

    if (token) {
      const client = getSupabaseClient();
      if (!client) return;
      elements.approvalPage.querySelector(".approval-form h2").textContent = "Submitting...";
      approvalForm.querySelectorAll("button").forEach((button) => {
        button.disabled = true;
      });
      let submitResult;
      try {
        submitResult = await client.rpc("submit_approval_by_token", {
          input_token: token,
          input_decision: decision,
          input_signature: signature,
          input_deposit_collected: depositCollected,
          input_decline_reason: declineReason,
          input_signature_image: signatureImage,
          input_approval_pdf_file: approvalPdfFile
        });
      } catch (caughtError) {
        submitResult = { data: null, error: caughtError };
      }
      const { data: updatedJob, error } = submitResult;
      if (error) {
        elements.approvalPage.querySelector(".approval-form h2").textContent = "Approve Work";
        approvalForm.querySelectorAll("button").forEach((button) => {
          button.disabled = false;
        });
        showApprovalError(friendlyApprovalError(error));
        return;
      }
      const returnedJob = Array.isArray(updatedJob) ? updatedJob[0] : updatedJob;
      const submittedJob = ensureJobDefaults(returnedJob || approvalJobFromForm(approvalForm, {
        approvalStatus: decision,
        approvedAt: decision === "approved" ? new Date().toISOString() : "",
        declinedAt: decision === "declined" ? new Date().toISOString() : "",
        customerSignature: signature,
        customerSignatureImage: decision === "approved" ? signatureImage : "",
        depositCollected,
        declineReason
      }));
      if (approvalPdfFile && !submittedJob.files.some((file) => file.id === approvalPdfFile.id)) {
        submittedJob.files = [...(submittedJob.files || []), approvalPdfFile];
      }
      submittedJob.approvalStatus = decision;
      updateLatestEstimateRevisionStatus(submittedJob, decision, {
        approvedAt: decision === "approved" ? new Date().toISOString() : "",
        declinedAt: decision === "declined" ? new Date().toISOString() : "",
        declineReason,
        updatedBy: "Customer"
      });
      renderApprovalPage(submittedJob, { token, publicMode: true, linkStatus: "used", decision, approvalPdfFile, companySettings: state.portalCompanySettings });
      return;
    }

    const index = state.jobs.findIndex((job) => job.id === jobId);
    if (index < 0) return;

    const job = ensureJobDefaults(state.jobs[index]);
    job.approvalStatus = decision;
    job.approvedAt = decision === "approved" ? new Date().toISOString() : job.approvedAt || "";
    job.declinedAt = decision === "declined" ? new Date().toISOString() : job.declinedAt || "";
    updateLatestEstimateRevisionStatus(job, decision, {
      approvedAt: job.approvedAt,
      declinedAt: job.declinedAt,
      declineReason,
      updatedBy: "Customer"
    });
    job.customerSignature = signature;
    job.customerSignatureImage = decision === "approved" ? signatureImage : "";
    job.declineReason = decision === "declined" ? declineReason : "";
    job.depositCollected = depositCollected;
    if (decision === "approved") {
      const estimate = normalizeEstimateRecord(job.estimate || {}, job);
      job.fieldChecklist.signature = Boolean(signature) || job.fieldChecklist.signature;
      if (approvalPdfFile) {
        job.files = [...(job.files || []), approvalPdfFile];
      }
      job.messages.push({
        direction: "note",
        body: `${signature || job.name} approved ${formatMoney(estimate.amount)}${job.depositCollected ? " and marked deposit collected" : ""}. Approval PDF attached to job files.`,
        createdAt: new Date().toLocaleString()
      });
    } else {
      job.messages.push({
        direction: "note",
        body: `${signature || job.name} declined the estimate. Reason: ${declineReason}`,
        createdAt: new Date().toLocaleString()
      });
    }

    state.jobs[index] = job;
    save();
    renderApprovalPage(job, { decision, approvalPdfFile });
    return;
  }

  const form = event.target.closest("[data-message-form]");
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  const messageType = String(data.get("direction") || "note");
  if (messageType !== "note" && !canOrRecord("portal-update", "send customer-facing message")) return;
  const direction = messageType === "portal" ? "out" : messageType;
  state.messageThreadScrollToBottom = true;
  clearMessageComposeDraft(state.selectedJobId);
  updateSelectedJob((job) => {
    if (messageType === "portal") ensureJobPortalToken(job);
    addJobMessage(job, {
      direction,
      body: data.get("body").trim(),
      createdBy: direction === "in" ? job.name : accountDisplayName(),
      customerVisible: messageType !== "note",
      seenBy: {}
    });
    if (messageType === "portal") {
      state.jobActionNotice = {
        jobId: job.id,
        message: "Customer portal update sent.",
        url: customerPortalUrl(job)
      };
    }
    return job;
  });
  form.reset();
});

document.addEventListener("change", (event) => {
  const pilotScore = event.target.closest("[data-foundry-pilot-score]");
  if (pilotScore) {
    updateFoundryPilotRecord(pilotScore.dataset.foundryPilotScore, {
      fitScore: Math.min(100, Math.max(0, Math.round(Number(pilotScore.value) || 0)))
    });
    showToast("Pilot score saved", "Foundry pilot fit score updated.", "success", {
      id: "foundry-pilot-score",
      timeout: 1800
    });
    return;
  }

  const pilotFollowUp = event.target.closest("[data-foundry-pilot-follow-up]");
  if (pilotFollowUp) {
    updateFoundryPilotRecord(pilotFollowUp.dataset.foundryPilotFollowUp, {
      nextFollowUp: pilotFollowUp.value
    });
    showToast("Follow-up saved", "Pilot follow-up date updated.", "success", {
      id: "foundry-pilot-follow-up",
      timeout: 1800
    });
    return;
  }

  const pilotNotes = event.target.closest("[data-foundry-pilot-notes]");
  if (pilotNotes) {
    updateFoundryPilotRecord(pilotNotes.dataset.foundryPilotNotes, {
      notes: pilotNotes.value
    });
    showToast("Pilot notes saved", "Foundry pilot notes updated.", "success", {
      id: "foundry-pilot-notes",
      timeout: 1800
    });
    return;
  }

  const foundryTestNote = event.target.closest("[data-foundry-test-note]");
  if (foundryTestNote) {
    updateFoundryBetaTestResult(foundryTestNote.dataset.foundryTestNote, {
      note: foundryTestNote.value
    });
    showToast("Beta script note saved", "Foundry tester note updated.", "success", {
      id: "foundry-test-note",
      timeout: 2200
    });
    render();
    return;
  }

  const betaNote = event.target.closest("[data-beta-note]");
  if (betaNote) {
    updateBetaReadinessItem(betaNote.dataset.betaNote, {
      note: betaNote.value
    });
    showToast("Beta note saved", "Foundry checklist note updated.", "success", {
      id: "beta-readiness-note",
      timeout: 2200
    });
    render();
    return;
  }

  const productionNote = event.target.closest("[data-production-note]");
  if (productionNote) {
    updateProductionReadinessItem(productionNote.dataset.productionNote, {
      note: productionNote.value
    });
    showToast("Production note saved", "Launch checklist note updated.", "success", {
      id: "production-readiness-note",
      timeout: 2200
    });
    render();
    return;
  }

  const setupNote = event.target.closest("[data-setup-note]");
  if (setupNote) {
    updateSupabaseProductionSetupItem(setupNote.dataset.setupNote, {
      note: setupNote.value
    });
    showToast("Supabase setup note saved", "Foundry setup note updated.", "success", {
      id: "supabase-setup-note",
      timeout: 2200
    });
    render();
    return;
  }

  const messageForm = event.target.closest("[data-message-form]");
  if (messageForm) {
    updateMessageComposeDraft(messageForm);
    return;
  }

  if (event.target.closest("#jobForm") && ["trade", "jobType"].includes(event.target.name)) {
    renderJobTemplatePicker(suggestedJobTemplateKeyFromForm(elements.jobForm));
    return;
  }

  if (event.target.closest("#actionForm")) {
    refreshActionScheduleWarning();
    captureActionFormDraft(event.target.form);
  }

  if (event.target.closest("#customRoleForm [name='template']")) {
    applyCustomRoleTemplate(event.target.value);
    return;
  }

  if (event.target.closest("#customRolePermissions [name='permissionKeys']")) {
    syncCustomRolePermissionDependencies();
    return;
  }

  if (event.target.closest("#rolePreviewSelect")) {
    state.rolePreviewSlug = elements.rolePreviewSelect?.querySelector("input[name='rolePreview']")?.value || currentRole();
    renderRolePreview();
    return;
  }

  if (event.target.closest("#activityTypeFilter")) {
    state.activityTypeFilter = elements.activityTypeFilter?.querySelector("input[name='activityTypeFilter']")?.value || "all";
    renderActivity();
    return;
  }

  if (event.target.closest("#activityDateFilter")) {
    state.activityDateFilter = elements.activityDateFilter?.querySelector("input[name='activityDateFilter']")?.value || "all";
    renderActivity();
    return;
  }

  const automation = event.target.closest("[data-automation]");
  if (!automation) return;
  if (!canOrRecord("exportData", "change AI admin automation")) {
    automation.checked = !automation.checked;
    return;
  }
  state.automations[automation.dataset.automation] = automation.checked;
  save();
  render();
});

document.addEventListener("dragstart", (event) => {
  const card = event.target.closest("[data-schedule-job-id]");
  if (!card || !can("book")) return;
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", card.dataset.scheduleJobId);
  card.classList.add("dragging");
});

document.addEventListener("dragend", (event) => {
  event.target.closest("[data-schedule-job-id]")?.classList.remove("dragging");
  document.querySelectorAll("[data-schedule-drop-day].drag-over").forEach((column) => {
    column.classList.remove("drag-over");
  });
});

document.addEventListener("dragover", (event) => {
  const column = event.target.closest("[data-schedule-drop-day]");
  if (!column || !can("book")) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  document.querySelectorAll("[data-schedule-drop-day].drag-over").forEach((item) => {
    if (item !== column) item.classList.remove("drag-over");
  });
  column.classList.add("drag-over");
});

document.addEventListener("dragleave", (event) => {
  const column = event.target.closest("[data-schedule-drop-day]");
  if (column && !column.contains(event.relatedTarget)) {
    column.classList.remove("drag-over");
  }
});

document.addEventListener("input", (event) => {
  const foundryPilotSearch = event.target.closest("[data-foundry-pilot-search]");
  if (foundryPilotSearch) {
    const cursor = foundryPilotSearch.selectionStart || foundryPilotSearch.value.length;
    state.foundryPilotSearch = foundryPilotSearch.value;
    render();
    requestAnimationFrame(() => {
      const input = document.querySelector("[data-foundry-pilot-search]");
      if (input) {
        input.focus();
        input.setSelectionRange?.(cursor, cursor);
      }
    });
    return;
  }

  const messageForm = event.target.closest("[data-message-form]");
  if (messageForm) {
    updateMessageComposeDraft(messageForm);
    return;
  }

  if (event.target.closest("#actionForm")) {
    refreshActionScheduleWarning();
    if (event.target.matches("[data-estimate-deposit-input]")) {
      event.target.dataset.touched = "true";
      refreshEstimateDepositDefault(event.target.form);
    }
    if (event.target.matches("[data-estimate-amount-input]")) {
      refreshEstimateDepositDefault(event.target.form);
    }
    captureActionFormDraft(event.target.form);
  }
});

document.addEventListener("drop", (event) => {
  const column = event.target.closest("[data-schedule-drop-day]");
  if (!column || !can("book")) return;
  event.preventDefault();
  column.classList.remove("drag-over");
  const jobId = event.dataTransfer.getData("text/plain");
  const job = state.jobs.find((item) => item.id === jobId);
  if (!job) return;
  if (column.dataset.scheduleDropDay === "unscheduled") {
    updateJobSchedule(jobId, { scheduleDate: "", startTime: "", durationMinutes: job.durationMinutes, endTime: "", technician: job.technician });
    return;
  }
  updateJobSchedule(jobId, {
    scheduleDate: column.dataset.scheduleDropDay,
    startTime: job.startTime || "09:00",
    durationMinutes: job.durationMinutes,
    endTime: job.endTime || "",
    technician: job.technician
  });
});

document.addEventListener("pointerdown", (event) => {
  const resizeHandle = event.target.closest("[data-message-resize-handle]");
  if (resizeHandle) {
    event.preventDefault();
    messageThreadResize = {
      pointerId: event.pointerId,
      startY: event.clientY,
      startHeight: clampMessageThreadHeight(state.messageThreadHeight)
    };
    resizeHandle.setPointerCapture?.(event.pointerId);
    document.body.classList.add("resizing-message-thread");
    return;
  }

  const canvas = event.target.closest("[data-signature-pad]");
  if (!canvas) return;
  event.preventDefault();
  const context = signatureCanvasContext(canvas);
  const point = signatureCanvasPoint(canvas, event);
  canvas.dataset.drawing = "true";
  canvas.dataset.signed = "true";
  canvas.setPointerCapture?.(event.pointerId);
  context.beginPath();
  context.moveTo(point.x, point.y);
});

document.addEventListener("pointermove", (event) => {
  if (messageThreadResize) {
    event.preventDefault();
    const nextHeight = clampMessageThreadHeight(messageThreadResize.startHeight - (event.clientY - messageThreadResize.startY));
    state.messageThreadHeight = nextHeight;
    document.querySelector(".message-thread-panel")?.style.setProperty("--message-thread-height", `${nextHeight}px`);
    return;
  }

  const canvas = event.target.closest("[data-signature-pad]");
  if (!canvas || canvas.dataset.drawing !== "true") return;
  event.preventDefault();
  const point = signatureCanvasPoint(canvas, event);
  const context = signatureCanvasContext(canvas);
  context.lineTo(point.x, point.y);
  context.stroke();
});

document.addEventListener("pointerup", (event) => {
  if (messageThreadResize) {
    event.target.releasePointerCapture?.(messageThreadResize.pointerId);
    messageThreadResize = null;
    document.body.classList.remove("resizing-message-thread");
    return;
  }

  const canvas = event.target.closest("[data-signature-pad]");
  if (!canvas) return;
  canvas.dataset.drawing = "";
  canvas.releasePointerCapture?.(event.pointerId);
});

document.addEventListener("pointercancel", () => {
  messageThreadResize = null;
  document.body.classList.remove("resizing-message-thread");
});

document.addEventListener("keydown", (event) => {
  const activityRow = event.target.closest("[data-activity-id]");
  if (activityRow && ["Enter", " "].includes(event.key)) {
    event.preventDefault();
    openActivityDetail(activityRow.dataset.activityId);
    return;
  }

  const resizeHandle = event.target.closest("[data-message-resize-handle]");
  if (resizeHandle && ["ArrowUp", "ArrowDown"].includes(event.key)) {
    event.preventDefault();
    const delta = event.key === "ArrowUp" ? 24 : -24;
    state.messageThreadHeight = clampMessageThreadHeight(state.messageThreadHeight + delta);
    document.querySelector(".message-thread-panel")?.style.setProperty("--message-thread-height", `${state.messageThreadHeight}px`);
    return;
  }

  const phoneInput = event.target.closest("[data-phone-input]");
  if (!phoneInput) return;
  const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Tab", "Enter"];
  if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) return;
  if (!/^\d$/.test(event.key)) {
    event.preventDefault();
  }
});

document.addEventListener("input", (event) => {
  const fileSearch = event.target.closest("[data-file-search]");
  if (fileSearch) {
    const cursor = fileSearch.selectionStart || fileSearch.value.length;
    state.fileSearch = fileSearch.value;
    refreshDocumentCenter({ focusSearch: true, cursor });
    return;
  }

  const phoneInput = event.target.closest("[data-phone-input]");
  if (!phoneInput) return;
  phoneInput.value = formatPhoneNumber(phoneInput.value);
});

elements.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  renderCustomerSearchResults();
});

elements.searchInput.addEventListener("focus", () => {
  renderCustomerSearchResults();
});

document.querySelector("#confirmAllButton").addEventListener("click", () => {
  if (!can("book")) return;
  const jobs = roleScopedJobs().filter((job) => job.status === "booked" && isScheduled(job));
  jobs.forEach((job) => {
    updateJobById(job.id, (nextJob) => {
      queueJobNotification(nextJob, "customer_confirmation");
      return nextJob;
    });
  });
  const count = jobs.length;
  showToast("Confirmations queued", `${count} confirmation${count === 1 ? "" : "s"} sent.`, "success");
});

document.querySelector("#settingsExportButton")?.addEventListener("click", exportData);
document.querySelector("#settingsConnectionButton")?.addEventListener("click", testSecureConnection);

elements.signOutButton.addEventListener("click", async () => {
  setAccountSwitching(true, "Signing out...");
  const client = getSupabaseClient();
  if (client) {
    await client.auth.signOut({ scope: "local" });
  }
  state.currentUser = null;
  resetSecureWorkspaceState();
  closeSettingsMenu();
  updateAuthStatus();
  if (isSupabaseConfigured()) {
    window.location.hash = "";
    setAuthGate(true, "Signed out. Sign in to load the secure Backline database.");
    elements.storageStatus.textContent = "Signed out";
    setAccountSwitching(false);
    return;
  }
  await loadDatabaseData();
  routeFromHash();
  setAccountSwitching(false);
});

document.querySelector("#settingsPrintButton").addEventListener("click", () => {
  closeSettingsMenu();
  renderPrintSchedule(elements.printScheduleRange?.querySelector("input[name='printScheduleRange']")?.value || "today");
  window.print();
});

document.querySelector("#importInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (!can("exportData")) return;
  try {
    const data = importPayloadData(JSON.parse(await file.text()));
    if (!(await validateImportForWorkspace(data))) return;
    state.jobs = Array.isArray(data.jobs) ? data.jobs.map(ensureJobDefaults) : [];
    state.deletedJobs = Array.isArray(data.deletedJobs) ? data.deletedJobs.map(ensureDeletedJobDefaults) : [];
    state.activityEvents = Array.isArray(data.activityEvents) ? data.activityEvents : [];
    state.customers = Array.isArray(data.customers) ? data.customers.map(normalizeCustomerRecord) : [];
    state.pricebookItems = Array.isArray(data.pricebookItems) ? data.pricebookItems.map(normalizePricebookItem) : [];
    state.suppliers = Array.isArray(data.suppliers) ? data.suppliers.map(normalizeSupplierRecord) : [];
    state.companySettings = markCompanySettingsChanged(data.companySettings || {});
    state.automations = { ...defaultAutomations, ...(data.automations || {}) };
    if (state.customers.length === 0) {
      syncCustomersFromJobs();
    }
    if (["light", "dark"].includes(data.themePreference)) {
      setThemePreference(data.themePreference);
      renderThemePicker();
    }
    state.selectedJobId = visibleJobs()[0]?.id || null;
    state.selectedCustomerId = null;
    save();
    render();
    showToast("Import complete", "Backline data was imported into this workspace.", "success");
  } catch (error) {
    showToast("Import failed", error?.message || "Choose a valid Backline JSON export.", "danger");
  } finally {
    event.target.value = "";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSettingsMenu();
    state.search = "";
    elements.searchInput.value = "";
    renderCustomerSearchResults();
  }
});

window.addEventListener("hashchange", routeFromHash);
window.addEventListener("focus", () => refreshRemoteDataIfNeeded({ force: true }));
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    refreshRemoteDataIfNeeded({ force: true });
  }
});
setInterval(() => {
  if (!document.hidden) {
    refreshRemoteDataIfNeeded();
  }
}, 15000);

async function initApp() {
  try {
    if (window.location.hash.startsWith("#approval-token=") || window.location.hash.startsWith("#portal=")) {
      updateAuthStatus();
      await routeFromHash();
      return;
    }

    elements.storageStatus.textContent = "Checking secure database";
    let secureConfigured = false;
    try {
      secureConfigured = await setupSecureBackend();
    } catch (caughtError) {
      if (isSupabaseConfigured()) {
        resetSecureWorkspaceState();
        setAuthGate(true, friendlySupabaseError(caughtError, "Secure database unavailable."));
        notifySupabaseIssue(caughtError, {
          fallback: "Backline could not reach the secure database.",
          important: true
        });
        secureConfigured = true;
      }
      elements.storageStatus.textContent = "Secure database unavailable";
    }

    if (!secureConfigured || !state.currentUser) {
      elements.storageStatus.textContent = secureConfigured ? "Sign in required" : "Loading browser database";
      if (!secureConfigured && !isSupabaseConfigured()) {
        await loadDatabaseData();
      }
    }

    state.selectedJobId = state.selectedJobId && state.jobs.some((job) => job.id === state.selectedJobId)
      ? state.selectedJobId
      : state.jobs[0]?.id || null;
    if (!secureConfigured || state.currentUser) {
      elements.storageStatus.textContent = state.secureMode
        ? "Secure database ready"
        : state.databaseReady ? "Database ready" : "Fallback storage active";
    }
    try {
      const refreshedApprovalPdfs = await refreshCurrentApprovalPdfs();
      if (refreshedApprovalPdfs) {
        showToast(
          "Approval PDFs refreshed",
          `${refreshedApprovalPdfs} existing approved job${refreshedApprovalPdfs === 1 ? "" : "s"} updated with the new approval letter layout.`,
          "success"
        );
      }
    } catch (error) {
      showToast("Approval PDF refresh skipped", error?.message || "Existing approval PDFs will refresh the next time Backline opens.", "warning");
    }
    routeFromHash();
    openQueuedWorkspaceSettings();
  } finally {
    document.body.classList.remove("app-loading");
  }
}

initApp();
