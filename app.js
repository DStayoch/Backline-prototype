const jobs = [
  {
    id: "job-1",
    name: "Maria Lopez",
    phone: "(513) 555-0194",
    address: "418 Cedar Ridge Dr",
    trade: "HVAC",
    issue: "AC not cooling upstairs, baby sleeping in the hottest room.",
    urgency: "urgent",
    status: "booked",
    window: "Today 9:00 AM",
    value: "$650",
    confidence: "High",
    messages: [
      ["out", "Sorry we missed you. What can we help with today?"],
      ["in", "Our upstairs AC is blowing warm air. Can someone come today?"],
      ["out", "Yes. We have 9:00 AM or 2:00 PM. What address should we use?"],
      ["in", "418 Cedar Ridge Dr. 9 works."]
    ]
  },
  {
    id: "job-2",
    name: "Ethan Park",
    phone: "(614) 555-0122",
    address: "72 Millstone Ave",
    trade: "Plumbing",
    issue: "Water heater leaking from base, customer shut off supply valve.",
    urgency: "urgent",
    status: "open",
    window: "Needs slot",
    value: "$1,250",
    confidence: "Medium",
    messages: [
      ["out", "We missed your call. Is this about a plumbing issue?"],
      ["in", "Water heater is leaking. I turned the water off."],
      ["out", "Got it. Is there active flooding right now?"],
      ["in", "No flooding now, but need help today."]
    ]
  },
  {
    id: "job-3",
    name: "Sam Reed",
    phone: "(937) 555-0148",
    address: "905 Bishop Lane",
    trade: "Electrical",
    issue: "Breaker trips when EV charger runs for more than 10 minutes.",
    urgency: "normal",
    status: "booked",
    window: "Today 2:00 PM",
    value: "$480",
    confidence: "High",
    messages: [
      ["out", "Sorry we missed you. What electrical issue are you having?"],
      ["in", "New EV charger keeps tripping breaker."],
      ["out", "We can inspect the panel today at 2:00 PM or tomorrow morning."],
      ["in", "Today at 2 please."]
    ]
  },
  {
    id: "job-4",
    name: "Nina Patel",
    phone: "(440) 555-0160",
    address: "1339 Fulton St",
    trade: "HVAC",
    issue: "Estimate follow-up for furnace replacement, customer asked about financing.",
    urgency: "normal",
    status: "open",
    window: "Awaiting reply",
    value: "$7,900",
    confidence: "High",
    messages: [
      ["out", "Following up on your furnace replacement estimate. Want us to send financing options?"],
      ["in", "Yes, please send monthly payment options."]
    ]
  }
];

let selectedJobId = jobs[0].id;
let activeFilter = "all";

const jobList = document.querySelector("#jobList");
const jobDetail = document.querySelector("#jobDetail");

function visibleJobs() {
  if (activeFilter === "urgent") {
    return jobs.filter((job) => job.urgency === "urgent");
  }

  if (activeFilter === "unbooked") {
    return jobs.filter((job) => job.status === "open");
  }

  return jobs;
}

function renderJobs() {
  jobList.innerHTML = visibleJobs()
    .map((job) => {
      const isActive = job.id === selectedJobId ? "active" : "";
      const urgency = job.urgency === "urgent" ? '<span class="pill urgent">Urgent</span>' : "";

      return `
        <button class="job-row ${isActive}" type="button" data-job-id="${job.id}">
          <span class="job-row-top">
            <span class="customer-name">${job.name}</span>
            <span class="pill ${job.status}">${job.status}</span>
          </span>
          <span class="job-summary">${job.issue}</span>
          <span class="job-row-bottom">
            <span class="pill trade">${job.trade}</span>
            ${urgency}
            <span>${job.window}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderDetail() {
  const job = jobs.find((item) => item.id === selectedJobId) || visibleJobs()[0] || jobs[0];
  selectedJobId = job.id;

  jobDetail.innerHTML = `
    <div class="detail">
      <div class="detail-title">
        <div>
          <h2>${job.name}</h2>
          <p class="address">${job.address} - ${job.phone}</p>
        </div>
        <span class="pill ${job.status}">${job.status}</span>
      </div>

      <div class="detail-actions">
        <button class="action-button accent" type="button">Book</button>
        <button class="action-button" type="button">Text</button>
        <button class="action-button" type="button">Call</button>
        <button class="action-button" type="button">Estimate</button>
        <button class="action-button" type="button">Invoice</button>
      </div>

      <div class="meta-grid">
        <div class="meta">
          <span>Trade</span>
          <strong>${job.trade}</strong>
        </div>
        <div class="meta">
          <span>Window</span>
          <strong>${job.window}</strong>
        </div>
        <div class="meta">
          <span>Value</span>
          <strong>${job.value}</strong>
        </div>
      </div>

      <div class="meta">
        <span>AI summary</span>
        <strong>${job.issue}</strong>
      </div>

      <div class="message-thread">
        ${job.messages
          .map(([direction, body]) => {
            const className = direction === "out" ? "message-line outbound" : "message-line";
            const label = direction === "out" ? "AI" : job.name.slice(0, 1);
            return `
              <div class="${className}">
                ${direction === "in" ? `<span class="avatar">${label}</span>` : ""}
                <div class="message-bubble">${body}</div>
                ${direction === "out" ? `<span class="avatar">${label}</span>` : ""}
              </div>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

document.addEventListener("click", (event) => {
  const jobButton = event.target.closest("[data-job-id]");
  if (jobButton) {
    selectedJobId = jobButton.dataset.jobId;
    renderJobs();
    renderDetail();
  }

  const segment = event.target.closest("[data-filter]");
  if (segment) {
    activeFilter = segment.dataset.filter;
    document.querySelectorAll(".segment").forEach((button) => button.classList.remove("active"));
    segment.classList.add("active");
    const first = visibleJobs()[0];
    selectedJobId = first ? first.id : selectedJobId;
    renderJobs();
    renderDetail();
  }

  const navItem = event.target.closest("[data-view]");
  if (navItem) {
    const view = navItem.dataset.view;
    document.querySelectorAll(".nav-item").forEach((button) => button.classList.remove("active"));
    document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
    navItem.classList.add("active");
    document.querySelector(`#view-${view}`).classList.add("active");
  }

  if (event.target.matches("#newJobButton")) {
    selectedJobId = jobs[1].id;
    document.querySelector('[data-view="inbox"]').click();
    activeFilter = "all";
    document.querySelectorAll(".segment").forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === "all");
    });
    renderJobs();
    renderDetail();
  }
});

renderJobs();
renderDetail();
