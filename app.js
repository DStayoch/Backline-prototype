const STORAGE_KEY = "backline.jobs.v2";
const AUTOMATION_KEY = "backline.automations.v1";

const defaultAutomations = {
  missedCall: true,
  appointmentReminder: true,
  estimateFollowUp: true,
  invoiceFollowUp: false,
  reviewRequest: true
};

let state = {
  jobs: loadJobs(),
  automations: loadAutomations(),
  selectedJobId: null,
  activeFilter: "all",
  search: ""
};

const elements = {
  statsStrip: document.querySelector("#statsStrip"),
  jobList: document.querySelector("#jobList"),
  jobDetail: document.querySelector("#jobDetail"),
  timeline: document.querySelector("#timeline"),
  automationList: document.querySelector("#automationList"),
  metricsGrid: document.querySelector("#metricsGrid"),
  pipelineTable: document.querySelector("#pipelineTable"),
  searchInput: document.querySelector("#searchInput"),
  jobModal: document.querySelector("#jobModal"),
  jobForm: document.querySelector("#jobForm"),
  todayLabel: document.querySelector("#todayLabel"),
  storageStatus: document.querySelector("#storageStatus")
};

elements.todayLabel.textContent = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric"
}).format(new Date());

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

function loadAutomations() {
  try {
    return { ...defaultAutomations, ...JSON.parse(localStorage.getItem(AUTOMATION_KEY)) };
  } catch {
    return { ...defaultAutomations };
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.jobs));
  localStorage.setItem(AUTOMATION_KEY, JSON.stringify(state.automations));
  elements.storageStatus.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
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

function normalizeValue(value) {
  return Number(String(value || "0").replace(/[$,]/g, "")) || 0;
}

function createId() {
  return crypto.randomUUID?.() || `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function statusLabel(status) {
  const labels = {
    open: "open",
    booked: "booked",
    estimated: "estimated",
    invoiced: "invoiced",
    paid: "paid",
    closed: "closed"
  };
  return labels[status] || status;
}

function visibleJobs() {
  const term = state.search.trim().toLowerCase();
  return state.jobs.filter((job) => {
    const matchesFilter =
      state.activeFilter === "all" ||
      (state.activeFilter === "urgent" && job.urgency === "urgent") ||
      job.status === state.activeFilter;

    const haystack = [job.name, job.phone, job.address, job.trade, job.issue, job.status]
      .join(" ")
      .toLowerCase();

    return matchesFilter && (!term || haystack.includes(term));
  });
}

function selectedJob() {
  return state.jobs.find((job) => job.id === state.selectedJobId) || visibleJobs()[0] || null;
}

function renderStats() {
  const missed = state.jobs.length;
  const booked = state.jobs.filter((job) => ["booked", "estimated", "invoiced", "paid", "closed"].includes(job.status)).length;
  const urgent = state.jobs.filter((job) => job.urgency === "urgent" && !["paid", "closed"].includes(job.status)).length;
  const recovered = state.jobs.reduce((sum, job) => sum + normalizeValue(job.value), 0);

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

function renderJobs() {
  const jobs = visibleJobs();

  if (jobs.length === 0) {
    elements.jobList.innerHTML = `
      <div class="empty-state">
        <strong>No jobs yet</strong>
        <span>Create your first recovered call to start using Backline.</span>
        <button class="primary-button" type="button" data-open-job-modal>Add first job</button>
      </div>
    `;
    return;
  }

  elements.jobList.innerHTML = jobs
    .map((job) => {
      const isActive = job.id === state.selectedJobId ? "active" : "";
      const urgent = job.urgency === "urgent" ? '<span class="pill urgent">Urgent</span>' : "";
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
            <span>${escapeHtml(job.window || "No window")}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderDetail() {
  const job = selectedJob();
  state.selectedJobId = job?.id || null;

  if (!job) {
    elements.jobDetail.innerHTML = `
      <div class="empty-state detail-empty">
        <strong>Backline is ready</strong>
        <span>Add a recovered call, then book it, send estimates, track invoices, and keep notes.</span>
        <button class="primary-button" type="button" data-open-job-modal>Create job</button>
      </div>
    `;
    return;
  }

  const messages = job.messages.length
    ? job.messages.map((message) => renderMessage(job, message)).join("")
    : '<div class="empty-note">No messages or notes yet.</div>';

  elements.jobDetail.innerHTML = `
    <div class="detail">
      <div class="detail-title">
        <div>
          <h2>${escapeHtml(job.name)}</h2>
          <p class="address">${escapeHtml(job.address)} - ${escapeHtml(job.phone)}</p>
        </div>
        <span class="pill ${escapeHtml(job.status)}">${statusLabel(job.status)}</span>
      </div>

      <div class="detail-actions">
        <button class="action-button accent" type="button" data-action="book">Book</button>
        <button class="action-button" type="button" data-action="estimate">Estimate</button>
        <button class="action-button" type="button" data-action="invoice">Invoice</button>
        <button class="action-button" type="button" data-action="paid">Mark paid</button>
        <button class="action-button danger" type="button" data-action="delete">Delete</button>
      </div>

      <div class="meta-grid">
        <div class="meta">
          <span>Trade</span>
          <strong>${escapeHtml(job.trade)}</strong>
        </div>
        <div class="meta">
          <span>Window</span>
          <strong>${escapeHtml(job.window || "Unscheduled")}</strong>
        </div>
        <div class="meta">
          <span>Value</span>
          <strong>${formatMoney(job.value)}</strong>
        </div>
      </div>

      <div class="meta">
        <span>Issue</span>
        <strong>${escapeHtml(job.issue)}</strong>
      </div>

      <form class="message-compose" data-message-form>
        <input name="body" placeholder="Add a note or customer message" autocomplete="off" required>
        <select name="direction" aria-label="Message type">
          <option value="note">Note</option>
          <option value="out">Outbound SMS</option>
          <option value="in">Customer reply</option>
        </select>
        <button class="secondary-button" type="submit">Add</button>
      </form>

      <div class="message-thread">${messages}</div>
    </div>
  `;
}

function renderMessage(job, message) {
  const isOutbound = message.direction === "out";
  const isNote = message.direction === "note";
  const className = isNote ? "message-line note" : isOutbound ? "message-line outbound" : "message-line";
  const label = isNote ? "N" : isOutbound ? "SMS" : job.name.slice(0, 1).toUpperCase();
  return `
    <div class="${className}">
      ${!isOutbound ? `<span class="avatar">${label}</span>` : ""}
      <div class="message-bubble">
        <span>${escapeHtml(message.body)}</span>
        <small>${escapeHtml(message.createdAt)}</small>
      </div>
      ${isOutbound ? `<span class="avatar">${label}</span>` : ""}
    </div>
  `;
}

function renderSchedule() {
  const bookedJobs = state.jobs
    .filter((job) => job.window && ["booked", "estimated", "invoiced", "paid"].includes(job.status))
    .sort((a, b) => a.window.localeCompare(b.window));

  if (bookedJobs.length === 0) {
    elements.timeline.innerHTML = '<div class="empty-state"><strong>No booked jobs</strong><span>Book a request from the inbox to build your schedule.</span></div>';
    return;
  }

  elements.timeline.innerHTML = bookedJobs
    .map((job) => `
      <div class="time-row">
        <span>${escapeHtml(job.window)}</span>
        <button class="appointment ${escapeHtml(job.status)}" type="button" data-job-id="${job.id}">
          ${escapeHtml(job.issue)} - ${escapeHtml(job.name)}
        </button>
      </div>
    `)
    .join("");
}

function renderAutomations() {
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
        <input type="checkbox" data-automation="${key}" ${state.automations[key] ? "checked" : ""}>
      </label>
    `)
    .join("");
}

function renderMetrics() {
  const revenue = state.jobs.reduce((sum, job) => sum + normalizeValue(job.value), 0);
  const paid = state.jobs.filter((job) => job.status === "paid").reduce((sum, job) => sum + normalizeValue(job.value), 0);
  const open = state.jobs.filter((job) => job.status === "open").length;
  const closeRate = state.jobs.length ? Math.round((state.jobs.filter((job) => job.status === "paid").length / state.jobs.length) * 100) : 0;

  elements.metricsGrid.innerHTML = [
    ["Pipeline", formatMoney(revenue)],
    ["Collected", formatMoney(paid)],
    ["Open requests", open],
    ["Paid close rate", `${closeRate}%`]
  ]
    .map(([label, value]) => `
      <div class="metric-block">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join("");

  const statuses = ["open", "booked", "estimated", "invoiced", "paid", "closed"];
  elements.pipelineTable.innerHTML = statuses
    .map((status) => {
      const jobs = state.jobs.filter((job) => job.status === status);
      const value = jobs.reduce((sum, job) => sum + normalizeValue(job.value), 0);
      return `
        <div class="pipeline-row">
          <span>${statusLabel(status)}</span>
          <strong>${jobs.length} jobs</strong>
          <em>${formatMoney(value)}</em>
        </div>
      `;
    })
    .join("");
}

function render() {
  renderStats();
  renderJobs();
  renderDetail();
  renderSchedule();
  renderAutomations();
  renderMetrics();
}

function createJob(formData) {
  const now = new Date();
  const job = {
    id: createId(),
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    address: formData.get("address").trim(),
    trade: formData.get("trade"),
    urgency: formData.get("urgency"),
    issue: formData.get("issue").trim(),
    window: formData.get("window").trim(),
    value: normalizeValue(formData.get("value")),
    status: formData.get("window").trim() ? "booked" : "open",
    createdAt: now.toISOString(),
    messages: []
  };

  if (state.automations.missedCall) {
    job.messages.push({
      direction: "out",
      body: "Sorry we missed you. Backline captured this request so the team can follow up.",
      createdAt: now.toLocaleString()
    });
  }

  state.jobs.unshift(job);
  state.selectedJobId = job.id;
  save();
  render();
}

function updateSelectedJob(updater) {
  const index = state.jobs.findIndex((job) => job.id === state.selectedJobId);
  if (index < 0) return;
  state.jobs[index] = updater({ ...state.jobs[index], messages: [...state.jobs[index].messages] });
  save();
  render();
}

function addAutomationMessage(job, body) {
  job.messages.push({
    direction: "out",
    body,
    createdAt: new Date().toLocaleString()
  });
}

document.addEventListener("click", (event) => {
  const openModal = event.target.closest("[data-open-job-modal], #newJobButton");
  if (openModal) {
    elements.jobForm.reset();
    elements.jobModal.showModal();
  }

  if (event.target.closest("[data-close-modal]")) {
    elements.jobModal.close();
  }

  const jobButton = event.target.closest("[data-job-id]");
  if (jobButton) {
    state.selectedJobId = jobButton.dataset.jobId;
    document.querySelector('[data-view="inbox"]').click();
    render();
  }

  const segment = event.target.closest("[data-filter]");
  if (segment) {
    state.activeFilter = segment.dataset.filter;
    document.querySelectorAll(".segment").forEach((button) => button.classList.remove("active"));
    segment.classList.add("active");
    state.selectedJobId = visibleJobs()[0]?.id || null;
    render();
  }

  const navItem = event.target.closest("[data-view]");
  if (navItem) {
    const view = navItem.dataset.view;
    document.querySelectorAll(".nav-item").forEach((button) => button.classList.remove("active"));
    document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
    navItem.classList.add("active");
    document.querySelector(`#view-${view}`).classList.add("active");
  }

  const action = event.target.closest("[data-action]")?.dataset.action;
  if (!action) return;

  if (action === "delete") {
    if (!confirm("Delete this job?")) return;
    state.jobs = state.jobs.filter((job) => job.id !== state.selectedJobId);
    state.selectedJobId = visibleJobs()[0]?.id || state.jobs[0]?.id || null;
    save();
    render();
    return;
  }

  updateSelectedJob((job) => {
    if (action === "book") {
      const windowValue = prompt("Appointment window", job.window || "Today 2:00 PM");
      if (!windowValue) return job;
      job.window = windowValue;
      job.status = "booked";
      if (state.automations.appointmentReminder) {
        addAutomationMessage(job, `Booked for ${windowValue}. A confirmation reminder is queued.`);
      }
    }

    if (action === "estimate") {
      const value = prompt("Estimate amount", job.value || "650");
      if (!value) return job;
      job.value = normalizeValue(value);
      job.status = "estimated";
      if (state.automations.estimateFollowUp) {
        addAutomationMessage(job, `Estimate sent for ${formatMoney(job.value)}. Follow-up is queued.`);
      }
    }

    if (action === "invoice") {
      job.status = "invoiced";
      if (state.automations.invoiceFollowUp) {
        addAutomationMessage(job, `Invoice sent for ${formatMoney(job.value)}. Payment reminder is queued.`);
      }
    }

    if (action === "paid") {
      job.status = "paid";
      if (state.automations.reviewRequest) {
        addAutomationMessage(job, "Payment marked paid. Review request is queued.");
      }
    }

    return job;
  });
});

elements.jobForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createJob(new FormData(elements.jobForm));
  elements.jobModal.close();
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("[data-message-form]");
  if (!form) return;
  event.preventDefault();
  const data = new FormData(form);
  updateSelectedJob((job) => {
    job.messages.push({
      direction: data.get("direction"),
      body: data.get("body").trim(),
      createdAt: new Date().toLocaleString()
    });
    return job;
  });
});

document.addEventListener("change", (event) => {
  const automation = event.target.closest("[data-automation]");
  if (!automation) return;
  state.automations[automation.dataset.automation] = automation.checked;
  save();
  render();
});

elements.searchInput.addEventListener("input", (event) => {
  state.search = event.target.value;
  state.selectedJobId = visibleJobs()[0]?.id || null;
  render();
});

document.querySelector("#confirmAllButton").addEventListener("click", () => {
  const count = state.jobs.filter((job) => job.status === "booked").length;
  alert(`${count} confirmation${count === 1 ? "" : "s"} queued.`);
});

document.querySelector("#exportButton").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ jobs: state.jobs, automations: state.automations }, null, 2)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "backline-data.json";
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector("#importInput").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const data = JSON.parse(await file.text());
  state.jobs = Array.isArray(data.jobs) ? data.jobs : [];
  state.automations = { ...defaultAutomations, ...(data.automations || {}) };
  state.selectedJobId = state.jobs[0]?.id || null;
  save();
  render();
});

render();
