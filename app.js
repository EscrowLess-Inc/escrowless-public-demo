const properties = [
  {
    id: 1,
    price: 598000,
    address: "4216 Grove Avenue",
    city: "Richmond, VA 23221",
    beds: 3,
    baths: 2.5,
    sqft: "2,184",
    days: 4,
    style: "home-a",
    tag: "Verified facts",
    description:
      "A renovated brick home with generous natural light, an open kitchen, and a landscaped rear garden near the Museum District.",
    facts: [
      ["Roof", "2021 · Verified"],
      ["HVAC", "2022 · Verified"],
      ["Windows", "2019 · Seller reported"],
      ["Appliances", "Included"],
    ],
  },
  {
    id: 2,
    price: 725000,
    address: "18 West Marshall Street",
    city: "Richmond, VA 23220",
    beds: 4,
    baths: 3,
    sqft: "2,740",
    days: 8,
    style: "home-b",
    tag: "New listing",
    description:
      "Historic character meets modern systems in this spacious Jackson Ward residence with off-street parking and a flexible studio.",
    facts: [
      ["Roof", "2020 · Verified"],
      ["HVAC", "2023 · Verified"],
      ["Parking", "2 spaces"],
      ["Studio", "Permitted"],
    ],
  },
  {
    id: 3,
    price: 459000,
    address: "3107 Stratford Road",
    city: "Richmond, VA 23225",
    beds: 3,
    baths: 2,
    sqft: "1,876",
    days: 2,
    style: "home-c",
    tag: "Open Sunday",
    description:
      "A calm, updated home with a first-floor primary suite, mature trees, and quick access to the James River trail system.",
    facts: [
      ["Roof", "2018 · Seller reported"],
      ["HVAC", "2021 · Verified"],
      ["Water heater", "2024 · Verified"],
      ["Flood zone", "Outside"],
    ],
  },
];

const demoState = {
  selectedPropertyId: 1,
  currentStep: 1,
  role: "buyer",
  stage: "draft",
  offer: {
    price: 612000,
    financing: "Conventional loan",
    downPayment: "20",
    earnestMoney: 6000,
    closingDate: "",
    responseDate: "",
    includedItems: "Kitchen refrigerator, washer, and dryer",
    note: "We love the natural light and the care you have put into the home.",
  },
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatDate(value) {
  if (!value) return "Not selected";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function getProperty() {
  return properties.find((property) => property.id === demoState.selectedPropertyId) || properties[0];
}

function setDefaultDates() {
  const today = new Date();
  const closing = new Date(today);
  const response = new Date(today);
  closing.setDate(closing.getDate() + 35);
  response.setDate(response.getDate() + 1);
  demoState.offer.closingDate = closing.toISOString().slice(0, 10);
  demoState.offer.responseDate = response.toISOString().slice(0, 10);
}

function renderProperties() {
  $("#propertyGrid").innerHTML = properties
    .map(
      (property) => `
        <article class="property-card">
          <div class="property-image ${property.style}">
            <div class="image-badges">
              <span class="image-badge ${property.tag === "Verified facts" ? "verified" : ""}">${property.tag}</span>
            </div>
            <button class="heart-button" data-action="favorite" aria-label="Save ${property.address}">♡</button>
          </div>
          <div class="property-body">
            <div class="price-row">
              <span class="property-price">${money(property.price)}</span>
              <span class="digital-offer-pill">Digital offer</span>
            </div>
            <p class="property-address">${property.address}, ${property.city}</p>
            <div class="property-meta">
              <span><strong>${property.beds}</strong> beds</span>
              <span><strong>${property.baths}</strong> baths</span>
              <span><strong>${property.sqft}</strong> sq ft</span>
            </div>
            <div class="property-footer">
              <span>${property.days} days on EscrowLess</span>
              <button data-action="view-property" data-property-id="${property.id}">View home →</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderPropertyDetail() {
  const property = getProperty();
  $("#propertyDetail").innerHTML = `
    <div class="detail-grid">
      <div class="detail-image ${property.style}">
        <div class="image-badges">
          <span class="image-badge verified">Digital offer ready</span>
          <span class="image-badge">Sample listing</span>
        </div>
      </div>
      <div class="detail-copy">
        <p class="eyebrow">Richmond demo market</p>
        <h1>${money(property.price)}</h1>
        <p class="detail-address">${property.address}, ${property.city}</p>
        <div class="detail-meta">
          <span><strong>${property.beds}</strong> beds</span>
          <span><strong>${property.baths}</strong> baths</span>
          <span><strong>${property.sqft}</strong> sq ft</span>
          <span><strong>${property.days}</strong> days listed</span>
        </div>
        <p>${property.description}</p>
        <div class="facts-card">
          <h3>Verified Home Facts</h3>
          <div class="facts-list">
            ${property.facts
              .map(
                ([label, value]) => `
                  <div class="fact">
                    <span>${label}</span>
                    <strong>${value}</strong>
                  </div>
                `,
              )
              .join("")}
          </div>
        </div>
        <div class="detail-actions">
          <button class="primary-button" data-action="start-offer">Create a digital offer</button>
          <button class="secondary-button" data-action="tour">Schedule a tour</button>
        </div>
      </div>
    </div>
  `;
}

function renderOfferProperty() {
  const property = getProperty();
  $("#offerPropertyLabel").textContent = `${property.address}, ${property.city}`;
  $("#asideProperty").innerHTML = `
    <div class="aside-image ${property.style}"></div>
    <div class="aside-property-copy">
      <strong>${money(property.price)}</strong>
      <span>${property.address}, ${property.city}</span>
    </div>
  `;
  $("#offerPrice").value = demoState.offer.price || property.price;
  $("#financingType").value = demoState.offer.financing;
  $("#downPayment").value = demoState.offer.downPayment;
  $("#earnestMoney").value = demoState.offer.earnestMoney;
  $("#closingDate").value = demoState.offer.closingDate;
  $("#responseDate").value = demoState.offer.responseDate;
  $("#includedItems").value = demoState.offer.includedItems;
  $("#buyerNote").value = demoState.offer.note;
  updateFeeEstimate();
}

function updateOfferFromForm() {
  demoState.offer.price = Number($("#offerPrice").value);
  demoState.offer.financing = $("#financingType").value;
  demoState.offer.downPayment = $("#downPayment").value;
  demoState.offer.earnestMoney = Number($("#earnestMoney").value);
  demoState.offer.closingDate = $("#closingDate").value;
  demoState.offer.responseDate = $("#responseDate").value;
  demoState.offer.includedItems = $("#includedItems").value;
  demoState.offer.note = $("#buyerNote").value;
}

function updateFeeEstimate() {
  const price = Number($("#offerPrice")?.value || demoState.offer.price);
  const first = Math.min(price, 400000) * 0.018;
  const second = Math.max(0, Math.min(price, 800000) - 400000) * 0.015;
  const third = Math.max(0, price - 800000) * 0.01;
  const representationFee = first + second + third;
  const illustrativeTotal = representationFee + 1750;
  $("#feeEstimate").textContent = money(illustrativeTotal);
}

function renderReviewSummary() {
  updateOfferFromForm();
  const selectedContingencies = $$(".choice-card input:checked").map((input) =>
    input.closest(".choice-card").querySelector("strong").textContent,
  );
  $("#reviewSummary").innerHTML = `
    <div class="summary-row"><span>Property</span><strong>${getProperty().address}</strong></div>
    <div class="summary-row"><span>Offer price</span><strong>${money(demoState.offer.price)}</strong></div>
    <div class="summary-row"><span>Financing</span><strong>${demoState.offer.financing} · ${demoState.offer.downPayment}% down</strong></div>
    <div class="summary-row"><span>Earnest money</span><strong>${money(demoState.offer.earnestMoney)}</strong></div>
    <div class="summary-row"><span>Contingencies</span><strong>${selectedContingencies.join(", ") || "None selected"}</strong></div>
    <div class="summary-row"><span>Closing</span><strong>${formatDate(demoState.offer.closingDate)}</strong></div>
    <div class="summary-row"><span>Seller response</span><strong>${formatDate(demoState.offer.responseDate)}</strong></div>
  `;
}

function renderStep() {
  $$(".form-step").forEach((step) => {
    step.classList.toggle("active", Number(step.dataset.step) === demoState.currentStep);
  });
  $("#stepNumber").textContent = demoState.currentStep;
  $$(".step-meter i").forEach((bar, index) => {
    bar.classList.toggle("complete", index + 1 < demoState.currentStep);
    bar.classList.toggle("current", index + 1 === demoState.currentStep);
  });
  $("#previousStep").style.visibility = demoState.currentStep === 1 ? "hidden" : "visible";
  $("#nextStep").textContent = demoState.currentStep === 4 ? "Submit demo offer" : "Continue";
  if (demoState.currentStep === 4) renderReviewSummary();
}

function goToView(name) {
  const view = $(`#${name}View`);
  if (!view) return;
  $$(".view").forEach((item) => item.classList.remove("active"));
  view.classList.add("active");
  $$(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.viewLink === name);
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  if (name === "review") renderReviewDesk();
  if (name === "workspace") renderWorkspace();
}

function renderReviewDesk() {
  const property = getProperty();
  const isAttorney = demoState.role === "attorney" || demoState.stage === "accepted";
  $("#reviewRoleLabel").textContent = isAttorney ? "Attorney review queue" : "Seller offer desk";
  $("#reviewHeading").textContent = isAttorney
    ? demoState.stage === "approved"
      ? "Contract package approved."
      : "One package needs legal review."
    : "One new offer, ready to compare.";
  $("#reviewSubheading").textContent = `${property.address} · ${property.city}`;

  if (isAttorney) {
    $("#reviewDesk").innerHTML = `
      <div class="review-grid">
        <section class="review-panel">
          <div class="review-panel-header">
            <div>
              <p class="eyebrow">Generated package · Demo only</p>
              <h2>Residential purchase agreement</h2>
              <p>Built from structured offer facts and approved sample clauses.</p>
            </div>
            ${demoState.stage === "approved" ? '<span class="status-approved">Approved</span>' : '<span class="digital-offer-pill">Needs review</span>'}
          </div>
          <div class="compare-grid">
            <div class="compare-item"><span>Purchase price</span><strong>${money(demoState.offer.price)}</strong></div>
            <div class="compare-item"><span>Closing</span><strong>${formatDate(demoState.offer.closingDate)}</strong></div>
            <div class="compare-item"><span>Financing</span><strong>${demoState.offer.financing}</strong></div>
            <div class="compare-item"><span>Earnest money</span><strong>${money(demoState.offer.earnestMoney)}</strong></div>
          </div>
          <div class="attorney-flag">
            <span>!</span>
            <div><strong>Human review required</strong>Prototype policy routes the included personal-property term for confirmation before signature.</div>
          </div>
          <div class="contingency-tags">
            <span>Inspection · 7 days</span>
            <span>Appraisal · 14 days</span>
            <span>Financing · 21 days</span>
            <span>Virginia demo rules</span>
          </div>
          <div class="review-actions">
            <button class="secondary-button" data-action="return-correction">Return for correction</button>
            <button class="primary-button" data-action="approve-contract" ${demoState.stage === "approved" ? "disabled" : ""}>
              ${demoState.stage === "approved" ? "Package approved" : "Approve demo package"}
            </button>
          </div>
        </section>
        <aside class="review-panel document-preview">
          <span>Preview · Not a legal form</span>
          <h3>Residential Purchase Agreement</h3>
          <p>Offer EL-1048 · Version 1.0</p>
          <div class="document-line"></div>
          <div class="document-line medium"></div>
          <div class="document-line"></div>
          <div class="document-line short"></div>
          <div class="document-highlight">
            <strong>${money(demoState.offer.price)} purchase price</strong>
            <small>${demoState.offer.financing}, ${demoState.offer.downPayment}% down, closing ${formatDate(demoState.offer.closingDate)}.</small>
          </div>
          <div class="document-line"></div>
          <div class="document-line"></div>
          <div class="document-line medium"></div>
          <div class="document-line short"></div>
          <div class="document-line"></div>
          <div class="document-line medium"></div>
        </aside>
      </div>
    `;
    return;
  }

  $("#reviewDesk").innerHTML = `
    <div class="review-grid">
      <section class="review-panel">
        <div class="review-panel-header">
          <div>
            <p class="eyebrow">Offer EL-1048</p>
            <h2>${money(demoState.offer.price)}</h2>
            <p>Submitted by a verified buyer · Pre-approval attached</p>
          </div>
          <div class="offer-number">102.3%</div>
        </div>
        <div class="compare-grid">
          <div class="compare-item"><span>Compared with list</span><strong>${money(property.price)} list price</strong></div>
          <div class="compare-item"><span>Financing</span><strong>${demoState.offer.financing}</strong></div>
          <div class="compare-item"><span>Earnest money</span><strong>${money(demoState.offer.earnestMoney)}</strong></div>
          <div class="compare-item"><span>Closing</span><strong>${formatDate(demoState.offer.closingDate)}</strong></div>
        </div>
        <div class="contingency-tags">
          <span>Inspection · 7 days</span>
          <span>Appraisal · 14 days</span>
          <span>Financing · 21 days</span>
        </div>
        <div class="review-actions">
          <button class="secondary-button" data-action="counter-offer">Create counter</button>
          <button class="primary-button" data-action="accept-offer">Accept and route for review</button>
        </div>
      </section>
      <aside class="review-panel document-preview">
        <span>Structured offer summary</span>
        <h3>What matters at a glance</h3>
        <p>The original submission and every change remain in the audit history.</p>
        <div class="document-highlight">
          <strong>Well-positioned offer</strong>
          <small>Above list price, verified financing, standard contingencies, and a practical 35-day closing.</small>
        </div>
        <div class="document-line"></div>
        <div class="document-line medium"></div>
        <div class="document-line"></div>
        <div class="document-line short"></div>
        <div class="document-highlight">
          <strong>Included personal property</strong>
          <small>${demoState.offer.includedItems}</small>
        </div>
        <div class="document-line"></div>
        <div class="document-line medium"></div>
      </aside>
    </div>
  `;
}

function timelineForStage() {
  const stages = [
    ["Offer submitted", "Offer EL-1048 added to the shared audit history.", "Today"],
    ["Seller response", "Review, accept, or counter in one structured workspace.", "Today"],
    ["Professional review", "Attorney or broker reviews generated documents and exceptions.", "Next"],
    ["Earnest money", "Secure payment instructions become available after approval.", "Pending"],
    ["Inspection & appraisal", "Appointments and contingency deadlines stay synchronized.", "Pending"],
    ["Title & financing", "Partner milestones appear without exposing unnecessary personal data.", "Pending"],
    ["Closing & recording", "Final package, notarization, disbursement, and archive.", "Pending"],
  ];
  const completedCount = demoState.stage === "approved" ? 3 : demoState.stage === "accepted" ? 2 : demoState.stage === "submitted" ? 1 : 0;
  const currentIndex = Math.min(completedCount, stages.length - 1);
  return { stages, completedCount, currentIndex };
}

function renderWorkspace() {
  const property = getProperty();
  const { stages, completedCount, currentIndex } = timelineForStage();
  const progress = demoState.stage === "approved" ? 42 : demoState.stage === "accepted" ? 28 : demoState.stage === "submitted" ? 18 : 8;
  $("#workspaceAddress").textContent = `${property.address}`;
  $("#workspaceStatus").textContent =
    demoState.stage === "approved"
      ? "Documents approved"
      : demoState.stage === "accepted"
        ? "Professional review"
        : demoState.stage === "submitted"
          ? "Seller review"
          : "Offer draft";
  $("#timelineTitle").textContent =
    demoState.stage === "approved"
      ? "Ready for signatures and deposits."
      : demoState.stage === "accepted"
        ? "The offer is accepted."
        : "The next move is visible.";
  $("#progressNumber").textContent = `${progress}%`;
  $("#progressBar").style.width = `${progress}%`;
  $("#timelineList").innerHTML = stages
    .map((stage, index) => {
      const stateClass = index < completedCount ? "complete" : index === currentIndex ? "current" : "";
      const marker = index < completedCount ? "✓" : index + 1;
      return `
        <div class="timeline-item ${stateClass}">
          <span class="timeline-marker">${marker}</span>
          <div class="timeline-copy"><strong>${stage[0]}</strong><small>${stage[1]}</small></div>
          <span class="timeline-date">${stage[2]}</span>
        </div>
      `;
    })
    .join("");

  const nextAction =
    demoState.stage === "approved"
      ? ["Documents are approved", "The production platform would now open secure signatures and earnest-money instructions.", "Preview next steps"]
      : demoState.stage === "accepted"
        ? ["Review the contract package", "One personal-property term is flagged for professional confirmation.", "Open review desk"]
        : demoState.stage === "submitted"
          ? ["Seller response is next", "The seller has a clear summary and a two-hour response target.", "Open seller view"]
          : ["Complete the offer", "Finish the guided questionnaire to start this transaction.", "Continue offer"];
  $("#nextActionCard").innerHTML = `
    <p class="eyebrow">Next action</p>
    <h3>${nextAction[0]}</h3>
    <p>${nextAction[1]}</p>
    <button class="primary-button" data-action="workspace-next">${nextAction[2]}</button>
  `;

  const activities = [
    ["Profile and identity demo completed", "Buyer · Earlier today"],
    ...(demoState.stage !== "draft" ? [["Offer EL-1048 submitted", "System · Just now"]] : []),
    ...(["accepted", "approved"].includes(demoState.stage) ? [["Seller accepted the offer", "Seller · Just now"]] : []),
    ...(demoState.stage === "approved" ? [["Contract package approved", "Attorney · Just now"]] : []),
  ];
  $("#activityList").innerHTML = activities
    .reverse()
    .map(
      ([title, meta]) => `
        <div class="activity"><i></i><div><strong>${title}</strong><small>${meta}</small></div></div>
      `,
    )
    .join("");
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => toast.classList.remove("show"), 2600);
}

function resetDemo() {
  demoState.currentStep = 1;
  demoState.role = "buyer";
  demoState.stage = "draft";
  demoState.selectedPropertyId = 1;
  demoState.offer.price = 612000;
  demoState.offer.financing = "Conventional loan";
  demoState.offer.downPayment = "20";
  demoState.offer.earnestMoney = 6000;
  setDefaultDates();
  $("#roleSelect").value = "buyer";
  renderOfferProperty();
  renderStep();
  renderWorkspace();
  goToView("discover");
  showToast("The investor demo has been reset.");
}

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const viewButton = event.target.closest("[data-view-link]");

  if (viewButton) {
    goToView(viewButton.dataset.viewLink);
    return;
  }

  if (!actionButton) return;
  const action = actionButton.dataset.action;

  if (action === "home" || action === "back-to-homes") goToView("discover");
  if (action === "back-to-property") goToView("property");
  if (action === "search") showToast("Showing sample Richmond listings.");
  if (action === "explain") showToast("Choose a home, answer guided questions, and route the offer for review.");
  if (action === "favorite") {
    actionButton.textContent = actionButton.textContent === "♡" ? "♥" : "♡";
    showToast(actionButton.textContent === "♥" ? "Saved to your demo profile." : "Removed from saved homes.");
  }
  if (action === "view-property") {
    demoState.selectedPropertyId = Number(actionButton.dataset.propertyId);
    demoState.offer.price = getProperty().price + 14000;
    renderPropertyDetail();
    renderOfferProperty();
    goToView("property");
  }
  if (action === "start-offer") {
    demoState.currentStep = 1;
    renderOfferProperty();
    renderStep();
    goToView("offer");
  }
  if (action === "tour") showToast("Tour scheduling is simulated in this prototype.");
  if (action === "seller-review") {
    demoState.role = "seller";
    $("#roleSelect").value = "seller";
    goToView("review");
  }
  if (action === "counter-offer") showToast("Counteroffer drafting is represented but not expanded in this first slice.");
  if (action === "accept-offer") {
    demoState.stage = "accepted";
    demoState.role = "attorney";
    $("#roleSelect").value = "attorney";
    renderReviewDesk();
    showToast("Offer accepted. The generated package is now in professional review.");
  }
  if (action === "return-correction") showToast("The issue was returned with a visible audit note.");
  if (action === "approve-contract") {
    demoState.stage = "approved";
    renderReviewDesk();
    renderWorkspace();
    showToast("Demo contract package approved. The timeline is ready for the next milestone.");
  }
  if (action === "workspace-next") {
    if (demoState.stage === "approved") showToast("E-signature and earnest-money rails are simulated in the prototype.");
    else if (demoState.stage === "accepted") goToView("review");
    else if (demoState.stage === "submitted") {
      demoState.role = "seller";
      $("#roleSelect").value = "seller";
      goToView("review");
    } else {
      renderOfferProperty();
      goToView("offer");
    }
  }
  if (action === "reset-demo") resetDemo();
});

$("#roleSelect").addEventListener("change", (event) => {
  demoState.role = event.target.value;
  if (demoState.role === "buyer") goToView("workspace");
  else goToView("review");
});

$("#offerForm").addEventListener("input", (event) => {
  if (event.target.closest(".choice-card")) {
    event.target.closest(".choice-card").classList.toggle("selected", event.target.checked);
  }
  updateOfferFromForm();
  updateFeeEstimate();
});

$("#nextStep").addEventListener("click", () => {
  if (demoState.currentStep < 4) {
    demoState.currentStep += 1;
    renderStep();
    return;
  }
  if (!$("#reviewConsent").checked) {
    showToast("Please acknowledge the prototype disclosure before submitting.");
    return;
  }
  updateOfferFromForm();
  demoState.stage = "submitted";
  goToView("submitted");
});

$("#previousStep").addEventListener("click", () => {
  demoState.currentStep = Math.max(1, demoState.currentStep - 1);
  renderStep();
});

setDefaultDates();
renderProperties();
renderPropertyDetail();
renderOfferProperty();
renderStep();
renderWorkspace();
