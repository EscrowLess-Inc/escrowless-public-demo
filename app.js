"use strict";

const config = window.ESCROWLESS_CONFIG;
const sandbox = window.EscrowLessSandbox;
const agreements = window.ESCROWLESS_AGREEMENTS;

if (
  config?.environment !== "public-demo" ||
  config?.publicDemoOnly !== true ||
  config?.realWorldEffectsDisabled !== true ||
  config?.demoOnly !== true ||
  config?.mockDataOnly !== true ||
  !sandbox ||
  !agreements
) {
  throw new Error("EscrowLess public demo configuration is required.");
}

const properties = [
  {
    id: 1,
    price: 598000,
    address: "4216 Grove Avenue",
    city: "Richmond, VA 23221",
    beds: 3,
    baths: 2.5,
    sqft: "2,184",
    yearBuilt: 1926,
    condition: "Updated",
    neighborhood: "Museum District",
    marketTemperature: "Hot",
    marketFactor: 1.05,
    days: 4,
    style: "home-a",
    tag: "Sample facts",
    description:
      "A renovated brick home with generous natural light, an open kitchen, and a landscaped rear garden near the Museum District.",
    facts: [
      ["Roof", "2021 · Mock verified"],
      ["HVAC", "2022 · Mock verified"],
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
    yearBuilt: 1907,
    condition: "Excellent",
    neighborhood: "Jackson Ward",
    marketTemperature: "Warm",
    marketFactor: 1.02,
    days: 8,
    style: "home-b",
    tag: "New listing",
    description:
      "Historic character meets modern systems in this spacious Jackson Ward residence with off-street parking and a flexible studio.",
    facts: [
      ["Roof", "2020 · Mock verified"],
      ["HVAC", "2023 · Mock verified"],
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
    yearBuilt: 1954,
    condition: "Good",
    neighborhood: "Stratford Hills",
    marketTemperature: "Balanced",
    marketFactor: 0.99,
    days: 2,
    style: "home-c",
    tag: "Open Sunday",
    description:
      "A calm, updated home with a first-floor primary suite, mature trees, and quick access to the James River trail system.",
    facts: [
      ["Roof", "2018 · Seller reported"],
      ["HVAC", "2021 · Mock verified"],
      ["Water heater", "2024 · Mock verified"],
      ["Flood zone", "Outside"],
    ],
  },
];

const feeSchedule = Object.freeze({
  platformFee: 1750,
  sellerMinimumFee: 4000,
  buyer: Object.freeze([
    Object.freeze({ label: "First $400k", upTo: 400000, rate: 0.018 }),
    Object.freeze({ label: "$400k-$800k", upTo: 800000, rate: 0.015 }),
    Object.freeze({ label: "$800k-$1.75M", upTo: 1750000, rate: 0.01 }),
    Object.freeze({ label: "$1.75M-$4M", upTo: 4000000, rate: 0.0075 }),
    Object.freeze({ label: "Above $4M", upTo: Infinity, rate: 0.005 }),
  ]),
  seller: Object.freeze([
    Object.freeze({ label: "First $500k", upTo: 500000, rate: 0.02 }),
    Object.freeze({ label: "$500k-$1.5M", upTo: 1500000, rate: 0.0125 }),
    Object.freeze({ label: "$1.5M-$5M", upTo: 5000000, rate: 0.0075 }),
    Object.freeze({ label: "Above $5M", upTo: Infinity, rate: 0.005 }),
  ]),
});

const conditionFactors = Object.freeze({
  "Needs work": 0.91,
  Fair: 0.96,
  Good: 1,
  Updated: 1.045,
  Excellent: 1.075,
});

const marketProfiles = Object.freeze({
  "Museum District": Object.freeze({ pricePerSqft: 276, heat: 1.025, confidence: "Medium-high" }),
  "Jackson Ward": Object.freeze({ pricePerSqft: 258, heat: 1.012, confidence: "Medium" }),
  "Stratford Hills": Object.freeze({ pricePerSqft: 239, heat: 0.996, confidence: "Medium" }),
  Richmond: Object.freeze({ pricePerSqft: 252, heat: 1.004, confidence: "Medium" }),
});

const featureCatalog = [
  {
    id: "profiles",
    category: "platform",
    title: "Profiles & permissions",
    status: "Explorable",
    summary: "Role-specific onboarding, identity status, preferences, disclosures, and least-privilege access.",
    roles: ["Buyer", "Seller", "Reviewer", "Lender", "Vendors", "Admin"],
    workflow: ["Choose a role", "Complete only relevant details", "Verify required items", "Unlock permitted workspace"],
    production: "A production version would authenticate users, verify identity where required, record consent, and enforce role-based access.",
    safety: "This public demo version creates no account, verifies no identity, and stores nothing after the page closes.",
  },
  {
    id: "listings",
    category: "transaction",
    title: "Listings & seller intake",
    status: "Explorable",
    summary: "Guided listing setup, property facts, seller disclosures, showing preferences, and offer-readiness checks.",
    roles: ["Seller", "Buyer", "Admin"],
    workflow: ["Enter property facts", "Review disclosure checklist", "Set showing rules", "Publish after approval"],
    production: "A production version could connect approved listing data, required disclosures, photography, and market distribution.",
    safety: "All homes and facts shown here are simulated and are not offered for sale.",
  },
  {
    id: "search",
    category: "transaction",
    title: "Search, filters & saved homes",
    status: "Explorable",
    summary: "Property discovery with detailed filters, comparison, saved searches, favorites, and recommendation concepts.",
    roles: ["Buyer"],
    workflow: ["Set search area", "Apply filters", "Compare homes", "Save criteria or a home"],
    production: "A production version could query licensed listing feeds and notify users when matching homes change.",
    safety: "The public demo catalog contains three fixed fictional listings and sends no alerts.",
  },
  {
    id: "tours",
    category: "transaction",
    title: "Tour scheduling",
    status: "Explorable",
    summary: "Request in-person or virtual tours, coordinate availability, confirm access, and collect post-tour feedback.",
    roles: ["Buyer", "Seller", "Showing partner"],
    workflow: ["Choose tour type", "Select available times", "Coordinate access", "Confirm and collect feedback"],
    production: "A production version could coordinate calendars, showing instructions, licensed participants, and reminders.",
    safety: "No calendar event, message, access instruction, or appointment is created here.",
  },
  {
    id: "offers",
    category: "transaction",
    title: "Guided offer builder",
    status: "Interactive",
    summary: "Plain-language offer terms, deadlines, contingencies, fee preview, completeness checks, and review summary.",
    roles: ["Buyer", "Reviewer"],
    workflow: ["Set financial terms", "Choose protections", "Set deadlines", "Review and route"],
    production: "A production version would use jurisdiction-appropriate workflows and approved document logic.",
    safety: "The public demo offer is non-binding, remains in memory only, and cannot be transmitted.",
  },
  {
    id: "counteroffers",
    category: "transaction",
    title: "Counteroffers & negotiation",
    status: "Explorable",
    summary: "Side-by-side term changes, version history, expiration controls, structured comments, and acceptance routing.",
    roles: ["Buyer", "Seller", "Reviewer"],
    workflow: ["Compare versions", "Change selected terms", "Explain changes", "Route for review or response"],
    production: "A production version would preserve immutable versions, timestamps, authorizations, and legally sufficient acceptance.",
    safety: "No negotiation, communication, or acceptance leaves this browser.",
  },
  {
    id: "documents",
    category: "documents",
    title: "Modular document generator",
    status: "Interactive",
    summary: "Clause modules assembled from transaction facts, jurisdiction, deal type, contingencies, and approved templates.",
    roles: ["Buyer", "Seller", "Reviewer", "Admin"],
    workflow: ["Collect structured facts", "Select approved modules", "Run consistency checks", "Create review package"],
    production: "Templates, clause logic, versioning, approvals, and jurisdiction rules would be controlled and audited.",
    safety: "This lab shows previews only and cannot create a valid or binding legal instrument.",
  },
  {
    id: "review",
    category: "documents",
    title: "Professional review desk",
    status: "Interactive",
    summary: "Exception flags, clause context, correction requests, approval states, and a complete audit trail.",
    roles: ["Reviewer / Attorney", "Admin"],
    workflow: ["Open package", "Review exceptions", "Return corrections or approve", "Record decision history"],
    production: "Access would be limited to properly authorized and qualified professionals under an approved operating model.",
    safety: "The public demo workflow does not provide legal review or create an attorney-client relationship.",
  },
  {
    id: "signatures",
    category: "documents",
    title: "Signatures & acknowledgments",
    status: "Interactive",
    summary: "Signer order, identity steps, consent, required acknowledgments, completion tracking, and executed-copy delivery.",
    roles: ["Buyer", "Seller", "Reviewer", "Title / Closing"],
    workflow: ["Confirm approved package", "Authenticate signer", "Present disclosures", "Sign, seal, and distribute"],
    production: "An approved e-signature vendor would handle identity, consent, evidence, retention, and tamper protection.",
    safety: "No signature can be drawn, adopted, captured, or applied in this public demo.",
  },
  {
    id: "deposits",
    category: "vendors",
    title: "Earnest money & escrow status",
    status: "Interactive",
    summary: "Deposit instructions, anti-fraud confirmation, receipt status, deadlines, exceptions, and release authorization.",
    roles: ["Buyer", "Seller", "Escrow / Title", "Admin"],
    workflow: ["Confirm authorized holder", "Deliver secure instructions", "Track receipt", "Reconcile or escalate"],
    production: "Only approved licensed vendors would hold funds, deliver instructions, and confirm settlement status.",
    safety: "This lab provides no wiring instructions, bank details, payment link, custody, or escrow service.",
  },
  {
    id: "inspections",
    category: "vendors",
    title: "Inspection & repair workflow",
    status: "Interactive",
    summary: "Scheduling, scope, report status, issue triage, repair requests, credits, responses, and deadline tracking.",
    roles: ["Buyer", "Seller", "Inspector", "Reviewer"],
    workflow: ["Select inspection scope", "Schedule", "Review findings", "Resolve requests before deadline"],
    production: "Approved providers could update status while parties control which findings and requests are shared.",
    safety: "No inspector is hired and no property condition is represented in this simulation.",
  },
  {
    id: "appraisal",
    category: "vendors",
    title: "Appraisal workflow",
    status: "Interactive",
    summary: "Order status, access coordination, valuation milestone, reconsideration workflow, and contingency countdown.",
    roles: ["Buyer", "Seller", "Lender", "Appraiser"],
    workflow: ["Lender orders appraisal", "Coordinate property access", "Receive valuation status", "Resolve exceptions"],
    production: "The lender and independent appraiser would retain control of ordering, independence, and report delivery.",
    safety: "No valuation is performed or represented by the public demo.",
  },
  {
    id: "mortgage",
    category: "vendors",
    title: "Mortgage application hub",
    status: "Interactive",
    summary: "Pre-approval status, application checklist, secure document requests, conditions, underwriting, and clear-to-close.",
    roles: ["Buyer", "Lender", "Admin"],
    workflow: ["Choose lender path", "Complete application", "Satisfy conditions", "Track underwriting and closing readiness"],
    production: "A licensed lender or approved integration would own the application, disclosures, decisions, and sensitive data.",
    safety: "This lab collects no financial information, uploads no documents, and makes no credit or lending decision.",
  },
  {
    id: "title",
    category: "vendors",
    title: "Title, settlement & recording",
    status: "Interactive",
    summary: "Title search, exceptions, payoff status, settlement statement, signing appointment, funding, and recording.",
    roles: ["Buyer", "Seller", "Title / Closing", "Lender", "Reviewer"],
    workflow: ["Open title order", "Clear requirements", "Prepare settlement", "Fund, record, and archive"],
    production: "Licensed or approved title and settlement providers would control regulated services and funds.",
    safety: "No title search, settlement, notarization, disbursement, or recording occurs here.",
  },
  {
    id: "insurance",
    category: "vendors",
    title: "Insurance readiness",
    status: "Interactive",
    summary: "Quote comparison, property questions, coverage selection, evidence of insurance, and closing-date coordination.",
    roles: ["Buyer", "Insurance", "Lender"],
    workflow: ["Request approved quotes", "Compare coverage", "Select policy", "Deliver evidence for closing"],
    production: "Licensed insurance providers would quote, advise, bind coverage, and issue documents.",
    safety: "The lab provides no quote, recommendation, binder, policy, or insurance service.",
  },
  {
    id: "closing",
    category: "transaction",
    title: "Closing command center",
    status: "Interactive",
    summary: "Unified milestone timeline, responsibilities, due dates, issue escalation, final walkthrough, keys, and archive.",
    roles: ["All transaction roles"],
    workflow: ["Track every dependency", "Resolve exceptions", "Confirm closing readiness", "Record completion and archive"],
    production: "The command center would display authoritative status from approved participants without replacing them.",
    safety: "All milestones here are illustrative and cannot complete a real closing.",
  },
  {
    id: "communications",
    category: "platform",
    title: "Messages, notices & reminders",
    status: "Planned detail",
    summary: "Transaction-scoped messages, templated notices, delivery status, reminders, escalation, and audit history.",
    roles: ["All transaction roles"],
    workflow: ["Choose permitted recipient", "Select or write message", "Review sensitive content", "Send and record delivery"],
    production: "A production system would enforce permissions, retention, consent, delivery controls, and support escalation.",
    safety: "No transaction email, text, push notification, or in-platform message can be sent from this lab. The public contact form is the only narrow email exception.",
  },
  {
    id: "admin",
    category: "platform",
    title: "Administration, compliance & audit",
    status: "Private console",
    summary: "Read-only environment flags, approval gates, provider modes, adapter contracts, mock tests, and redacted session audit.",
    roles: ["Platform Admin", "Compliance", "Broker leadership"],
    workflow: ["Configure approved rules", "Manage role access", "Monitor exceptions", "Audit changes and incidents"],
    production: "High-risk changes would require server-side controls, authentication, least privilege, separation of duties, documented approvals, monitoring, and rollback.",
    safety: "The separate public demo admin page changes no system, permission, credential, template, vendor, or persistent record and must be omitted from public deployments.",
  },
];

const roleDefinitions = {
  buyer: {
    label: "Buyer",
    description: "Search, tour, prepare an offer, coordinate financing and inspections, review documents, and follow every closing milestone.",
    visibility: ["Selected homes and comparisons", "Own offer and document versions", "Financing and contingency status", "Closing tasks assigned to the buyer"],
    handoffs: ["Seller receives the structured offer", "Reviewer handles flagged document terms", "Lender, inspector, title, and insurance update their milestones"],
    capabilities: [
      ["Find and compare homes", "Search, filter, save, and compare candidate properties.", "search"],
      ["Schedule tours", "Coordinate an in-person or virtual visit.", "tours"],
      ["Build an offer", "Set terms through the guided offer workflow.", "offers"],
      ["Track closing", "See tasks, deadlines, documents, and vendor status.", "closing"],
    ],
    next: ["Continue the buyer journey", "Open the property catalog and build a detailed sample offer.", "Browse homes", "discover"],
  },
  seller: {
    label: "Seller",
    description: "Prepare a listing, manage disclosures and showings, compare offers, negotiate terms, and complete seller-side closing tasks.",
    visibility: ["Listing and disclosure status", "Offers and version comparisons", "Seller deadlines and required documents", "Shared closing milestones"],
    handoffs: ["Buyer receives accepted or countered terms", "Reviewer receives the selected package", "Title and closing participants receive approved seller items"],
    capabilities: [
      ["Prepare the listing", "Review facts, disclosures, access rules, and readiness.", "listings"],
      ["Manage showings", "Control availability and showing instructions.", "tours"],
      ["Compare and counter", "Review price, risk, timing, and term changes.", "counteroffers"],
      ["Complete closing tasks", "Track payoff, title, signing, and move-out items.", "closing"],
    ],
    next: ["Review the current offer", "Open the seller offer desk for the active simulated transaction.", "Open offer desk", "review"],
  },
  attorney: {
    label: "Reviewer / Attorney",
    description: "Review approved document templates and transaction-specific exceptions, request corrections, and record a decision trail.",
    visibility: ["Structured transaction facts", "Current document version and changes", "Flagged clauses and exceptions", "Review history and authorization state"],
    handoffs: ["Buyer or seller corrects returned items", "Approved packages move to signature readiness", "Admin handles template or policy exceptions"],
    capabilities: [
      ["Review document package", "Inspect transaction facts and generated sections.", "review"],
      ["Examine clause modules", "See why each approved clause was selected.", "documents"],
      ["Request corrections", "Return precise issues without rewriting unrelated terms.", "review"],
      ["Approve for next step", "Mark the simulation ready for signature preparation.", "signatures"],
    ],
    next: ["Open the review desk", "Inspect the current simulated purchase package and its flagged term.", "Review package", "review"],
  },
  lender: {
    label: "Lender",
    description: "Own the lending workflow: application, disclosures, documentation, conditions, underwriting, appraisal, and clear-to-close status.",
    visibility: ["Borrower-authorized loan information", "Purchase terms needed for underwriting", "Appraisal and condition status", "Closing and funding milestones"],
    handoffs: ["Buyer satisfies requested conditions", "Appraiser updates valuation status", "Title receives lender closing requirements"],
    capabilities: [
      ["Manage application", "Track the application and required disclosures.", "mortgage"],
      ["Request conditions", "Show secure document-request and condition concepts.", "mortgage"],
      ["Coordinate appraisal", "Order and monitor the independent valuation workflow.", "appraisal"],
      ["Issue closing readiness", "Share milestone status without exposing underwriting detail.", "closing"],
    ],
    next: ["Explore the mortgage hub", "See the proposed application, underwriting, and condition workflow.", "Open mortgage hub", "mortgage"],
  },
  inspector: {
    label: "Inspector",
    description: "Receive an authorized inspection request, coordinate access, define scope, deliver status, and support issue categorization.",
    visibility: ["Property and authorized access details", "Requested inspection scope", "Appointment and deadline", "Report-delivery status"],
    handoffs: ["Buyer reviews findings", "Seller receives only authorized requests", "Reviewer sees negotiated repair terms when relevant"],
    capabilities: [
      ["Accept assignment", "Review scope, timing, and access requirements.", "inspections"],
      ["Coordinate access", "Choose an approved time without exposing unrelated transaction data.", "tours"],
      ["Update report status", "Mark scheduled, inspected, report ready, or follow-up needed.", "inspections"],
      ["Support resolution", "Categorize findings for buyer review and negotiation.", "inspections"],
    ],
    next: ["Explore inspection workflow", "Open the inspection and repair-resolution feature specification.", "Open inspection module", "inspections"],
  },
  appraiser: {
    label: "Appraiser",
    description: "Receive a lender-authorized assignment, coordinate access independently, and update valuation-delivery milestones.",
    visibility: ["Authorized property information", "Assignment scope and due date", "Access contact channel", "Own report-delivery status"],
    handoffs: ["Lender receives the appraisal result", "Buyer and seller see permitted milestone status", "Exceptions return through the lender"],
    capabilities: [
      ["Review assignment", "Confirm scope, independence, and due date.", "appraisal"],
      ["Coordinate property access", "Arrange access through an authorized channel.", "appraisal"],
      ["Update milestone", "Show scheduled, visited, in review, and delivered states.", "appraisal"],
      ["Handle exception status", "Flag access or completion issues without negotiating the deal.", "appraisal"],
    ],
    next: ["Explore appraisal workflow", "Review the independent appraisal milestone and exception design.", "Open appraisal module", "appraisal"],
  },
  title: {
    label: "Title / Closing",
    description: "Manage title search, requirements, settlement preparation, signing logistics, funding status, recording, and final archive.",
    visibility: ["Approved contract facts", "Party and lender closing requirements", "Title exceptions and payoff status", "Settlement, funding, and recording milestones"],
    handoffs: ["Parties resolve title requirements", "Lender delivers funding authorization", "Recorded completion updates the transaction archive"],
    capabilities: [
      ["Open title order", "Create the title and settlement workflow from approved facts.", "title"],
      ["Clear requirements", "Track exceptions, payoffs, and required documents.", "title"],
      ["Prepare settlement", "Coordinate figures, signing readiness, and appointments.", "title"],
      ["Record and archive", "Show funding, recording, keys, and final-document delivery.", "closing"],
    ],
    next: ["Explore title and settlement", "See how title, closing, funding, and recording milestones fit together.", "Open title module", "title"],
  },
  insurance: {
    label: "Insurance",
    description: "Receive an authorized quote request, gather property questions, present coverage choices, and provide evidence for closing.",
    visibility: ["Authorized property details", "Buyer-provided application answers", "Requested effective date", "Lender evidence requirements"],
    handoffs: ["Buyer selects coverage", "Lender receives permitted evidence", "Closing timeline reflects insurance readiness"],
    capabilities: [
      ["Prepare quote request", "Gather only the information required for an approved provider.", "insurance"],
      ["Compare coverage", "Explain premium, deductible, limits, and exclusions.", "insurance"],
      ["Bind through provider", "Show where licensed provider confirmation would occur.", "insurance"],
      ["Deliver evidence", "Update the lender and closing milestone when authorized.", "closing"],
    ],
    next: ["Explore insurance readiness", "Review the proposed quote-to-evidence workflow.", "Open insurance module", "insurance"],
  },
  admin: {
    label: "Platform Admin",
    description: "Configure approved workflows, permissions, templates, vendors, support processes, monitoring, and audit controls.",
    visibility: ["System configuration and approval state", "Role and vendor permissions", "Operational exceptions and incidents", "Audit history without unnecessary transaction content"],
    handoffs: ["Compliance approves controlled changes", "Authorized teams resolve incidents", "Production releases follow documented gates"],
    capabilities: [
      ["Configure workflows", "Manage approved states, deadlines, and routing rules.", "admin"],
      ["Control permissions", "Define least-privilege access by role and transaction.", "profiles"],
      ["Manage vendors", "Track approval, licensing, insurance, and integration status.", "admin"],
      ["Audit operations", "Review changes, incidents, access, and exception handling.", "admin"],
    ],
    next: ["Explore administration", "Open the compliance, configuration, and audit design.", "Open admin module", "admin"],
  },
};

const transactionFlow = [
  ["draft", "Offer draft", "Buyer is preparing terms.", "Buyer"],
  ["submitted", "Offer submitted", "The simulated offer is ready for seller review.", "Buyer"],
  ["accepted", "Offer accepted", "The selected terms are routed for professional review.", "Seller"],
  ["approved", "Document review approved", "A populated, view-only contract preview is ready.", "Reviewer / Attorney"],
  ["contract_reviewed", "Contract preview reviewed", "The parties can inspect the deal terms before the signature handoff.", "Buyer and seller"],
  ["signatures", "E-sign handoff simulated", "The demo proceeds as though an approved signature provider completed its workflow.", "Buyer and seller"],
  ["earnest", "Earnest money status confirmed", "The deposit milestone is recorded without moving funds.", "Title / Closing"],
  ["inspection", "Inspection resolved", "Inspection findings and the repair-resolution period are complete.", "Inspector"],
  ["appraisal", "Appraisal milestone complete", "The independent valuation status is available to the lender.", "Appraiser"],
  ["financing", "Clear to close simulated", "Loan conditions are satisfied in the public demo scenario.", "Lender"],
  ["title", "Title clear simulated", "Title requirements and settlement preparation are complete.", "Title / Closing"],
  ["insurance", "Insurance evidence ready", "The simulated lender requirement is satisfied.", "Insurance"],
  ["closing_ready", "Closing package ready", "Final documents, figures, walkthrough, and appointment are ready.", "Title / Closing"],
  ["closed", "Closed, recorded, and archived", "The complete simulated transaction is finished.", "All roles"],
];

const milestoneDefinitions = {
  signatures: {
    owner: "Buyer, seller, and approved e-sign provider",
    eyebrow: "Contract execution handoff",
    heading: "Preview the signature workflow.",
    description:
      "The contract has been reviewed. This screen demonstrates signer order, identity and consent checks, required acknowledgments, and completion tracking without capturing a signature.",
    steps: [
      ["Confirm the approved version", "Every signer sees the same locked document version and a plain-language summary of material terms.", "Reviewer / Attorney"],
      ["Authenticate and obtain consent", "An approved provider would handle identity, electronic-record consent, and evidence requirements.", "E-sign provider and each signer"],
      ["Present required acknowledgments", "Initials, disclosures, and signatures would be presented in the approved order.", "E-sign provider"],
      ["Seal and distribute", "The provider would create tamper evidence and deliver permitted copies to the transaction file.", "E-sign provider"],
    ],
    visibility: ["Approved document version", "Signer order and completion status", "Required disclosure checklist", "Audit evidence status"],
    handoffTitle: "Title or escrow receives the accepted package",
    handoffBody: "The simulation next opens the earnest-money and title-order milestone.",
    safety: "No signature, initials, consent evidence, identity data, or executed contract is captured.",
    completionLabel: "Simulate completed e-sign handoff",
    nextStage: "signatures",
  },
  earnest: {
    owner: "Buyer and authorized title / escrow provider",
    eyebrow: "Earnest-money milestone",
    heading: "Confirm deposit status without moving money.",
    description:
      "This stage demonstrates secure instruction delivery, anti-fraud confirmation, due-date tracking, receipt status, and exception escalation.",
    steps: [
      ["Identify the authorized holder", "The transaction shows which approved title, escrow, or attorney participant is permitted to hold the deposit.", "Broker and title / closing"],
      ["Confirm instructions through a trusted channel", "Production would require anti-fraud controls and independent verification before payment.", "Buyer and title / closing"],
      ["Track the deadline", "Buyer, seller, and authorized participants see the due date and permitted status.", "Buyer and broker"],
      ["Record receipt or exception", "The holder confirms receipt, shortage, return, or an unresolved issue.", "Authorized deposit holder"],
    ],
    visibility: ["Deposit amount and due date", "Authorized holder identity", "Received or exception status", "Audit timestamp"],
    handoffTitle: "Inspection and appraisal scheduling begins",
    handoffBody: "After the deposit status is confirmed, the buyer-side contingency work becomes the next guided task.",
    safety: "No bank details, payment link, wiring instructions, custody, transfer, or escrow service is provided.",
    completionLabel: "Simulate earnest money received",
    nextStage: "earnest",
  },
  inspection: {
    owner: "Buyer and inspector",
    eyebrow: "Inspection contingency",
    heading: "Move from appointment to resolution.",
    description:
      "The inspection module coordinates scope, access, report status, issue triage, repair requests, credits, seller response, and deadline completion.",
    steps: [
      ["Choose inspection scope", "The buyer selects permitted inspection categories and confirms the contingency deadline.", "Buyer"],
      ["Coordinate access", "The inspector and seller-side participant agree on an available appointment window.", "Inspector and seller"],
      ["Review findings", "The buyer categorizes material findings and decides which items require a response.", "Buyer and inspector"],
      ["Resolve the contingency", "The parties simulate repairs, credits, acceptance, or another approved outcome.", "Buyer and seller"],
    ],
    visibility: ["Inspection scope and appointment", "Report availability status", "Buyer-selected issue summary", "Resolution and deadline status"],
    handoffTitle: "The lender monitors appraisal and financing",
    handoffBody: "The transaction next advances to the independent valuation milestone.",
    safety: "No inspector is hired, no report is uploaded, and no property condition is represented.",
    completionLabel: "Simulate inspection resolution",
    nextStage: "inspection",
  },
  appraisal: {
    owner: "Lender and independent appraiser",
    eyebrow: "Appraisal contingency",
    heading: "Track the independent valuation milestone.",
    description:
      "The lender controls the order while the platform coordinates permitted status, property access, due dates, and exception visibility.",
    steps: [
      ["Create the lender-authorized assignment", "The assignment identifies scope and timing without allowing parties to influence value.", "Lender"],
      ["Coordinate access", "The appraiser receives only authorized property and scheduling information.", "Appraiser and seller"],
      ["Track delivery", "Participants see scheduled, visited, in review, and delivered milestones as permitted.", "Lender and appraiser"],
      ["Resolve an exception", "Low-value, access, or completion issues return through the lender-controlled process.", "Lender"],
    ],
    visibility: ["Order and access status", "Due date", "Permitted valuation milestone", "Contingency deadline"],
    handoffTitle: "Underwriting finishes outstanding conditions",
    handoffBody: "The lender role becomes primary for the clear-to-close simulation.",
    safety: "No appraisal is ordered, no value is calculated, and no appraisal opinion is provided.",
    completionLabel: "Simulate appraisal delivered",
    nextStage: "appraisal",
  },
  financing: {
    owner: "Buyer and licensed lender",
    eyebrow: "Mortgage and underwriting",
    heading: "Satisfy conditions and reach clear to close.",
    description:
      "The mortgage hub demonstrates application status, disclosures, secure condition requests, underwriting milestones, and closing-readiness status.",
    steps: [
      ["Confirm application and disclosures", "A licensed lender would own the application and all required lending disclosures.", "Licensed lender"],
      ["Satisfy document conditions", "The buyer sees requested items, purpose, due date, and secure delivery path.", "Buyer"],
      ["Complete underwriting", "Only permitted milestone status is shared outside the lender workspace.", "Licensed lender"],
      ["Issue clear-to-close status", "The lender confirms that the simulated file can proceed to final settlement preparation.", "Licensed lender"],
    ],
    visibility: ["Application milestone", "Buyer condition checklist", "Appraisal status", "Clear-to-close status"],
    handoffTitle: "Title completes settlement requirements",
    handoffBody: "The title and closing role now resolves title, payoff, and settlement items.",
    safety: "No financial data, credit report, application, underwriting, or lending decision is created.",
    completionLabel: "Simulate clear to close",
    nextStage: "financing",
  },
  title: {
    owner: "Title / closing provider",
    eyebrow: "Title and settlement",
    heading: "Clear requirements and prepare settlement.",
    description:
      "This stage demonstrates title search status, exceptions, payoff tracking, settlement figures, document readiness, and approved participant coordination.",
    steps: [
      ["Open the title order", "Approved contract facts populate the provider's permitted transaction packet.", "Title / closing provider"],
      ["Review title requirements", "Exceptions, ownership, liens, payoffs, and curative work are tracked by status.", "Title / closing and attorney"],
      ["Prepare settlement figures", "The provider coordinates permitted fees, credits, payoffs, and lender requirements.", "Title / closing provider"],
      ["Mark title clear", "The transaction shows that title and settlement requirements are ready for closing.", "Title / closing provider"],
    ],
    visibility: ["Title-order status", "Requirement and exception status", "Payoff status", "Settlement-readiness milestone"],
    handoffTitle: "Insurance evidence completes a lender requirement",
    handoffBody: "The buyer and licensed insurance provider next complete the evidence-of-insurance simulation.",
    safety: "No title search, legal opinion, settlement statement, payoff, or title service is performed.",
    completionLabel: "Simulate title clear",
    nextStage: "title",
  },
  insurance: {
    owner: "Buyer and licensed insurance provider",
    eyebrow: "Insurance readiness",
    heading: "Complete the quote-to-evidence workflow.",
    description:
      "The insurance module demonstrates authorized property questions, coverage comparison, buyer selection, effective date, and evidence delivery.",
    steps: [
      ["Request approved quotes", "Production would route the buyer to licensed providers under approved consent and data-sharing rules.", "Buyer"],
      ["Compare coverage", "Premium, deductible, limits, exclusions, and provider details are presented consistently.", "Buyer and licensed provider"],
      ["Select through the provider", "Only the licensed provider can advise, bind coverage, and issue a policy.", "Buyer and licensed provider"],
      ["Deliver evidence", "Permitted evidence updates the lender and closing timeline.", "Licensed insurance provider"],
    ],
    visibility: ["Quote-request status", "Coverage-comparison fields", "Selected effective date", "Evidence-delivery status"],
    handoffTitle: "The closing package is assembled",
    handoffBody: "With financing, title, appraisal, and insurance ready, the transaction moves to final closing preparation.",
    safety: "No quote, recommendation, binder, policy, premium, or insurance service is provided.",
    completionLabel: "Simulate insurance evidence ready",
    nextStage: "insurance",
  },
  closing_ready: {
    owner: "Title / closing, lender, buyer, and seller",
    eyebrow: "Closing preparation",
    heading: "Assemble the final package and appointment.",
    description:
      "The command center now coordinates final figures, required document review, walkthrough, identity and notarization readiness, funding authorization, and key delivery.",
    steps: [
      ["Review final figures", "The parties receive the permitted settlement or closing disclosure review milestone.", "Buyer, seller, lender, and title / closing"],
      ["Complete final walkthrough", "The buyer confirms the walkthrough status and raises any authorized exception.", "Buyer"],
      ["Prepare signing and notarization", "The approved provider confirms appointment, identity requirements, and eligible remote or in-person process.", "Title / closing and notary"],
      ["Confirm funding and recording readiness", "Lender and settlement participants show that all prerequisites are satisfied.", "Lender and title / closing"],
    ],
    visibility: ["Final-figure review status", "Walkthrough status", "Signing appointment", "Funding and recording readiness"],
    handoffTitle: "The transaction can simulate closing",
    handoffBody: "The final step records funding, disbursement, recording, keys, archive, and completion.",
    safety: "No closing disclosure, notarization, funding authorization, appointment, or final document is created.",
    completionLabel: "Simulate closing package ready",
    nextStage: "closing_ready",
  },
  closed: {
    owner: "Title / closing and all transaction roles",
    eyebrow: "Closing, recording, and archive",
    heading: "Complete the simulated transaction.",
    description:
      "The final stage demonstrates settlement completion, authorized disbursement status, recording confirmation, key delivery, final copies, retention, and satisfaction feedback.",
    steps: [
      ["Confirm settlement completion", "The closing provider marks the approved signing and funding prerequisites complete.", "Title / closing provider"],
      ["Record and disburse", "Production providers would control recording and authorized disbursement.", "Title / closing provider"],
      ["Deliver keys and final copies", "Parties see permitted completion status and receive approved final documents.", "Seller, title / closing, and broker"],
      ["Archive and measure", "The transaction file closes with retention status, audit package, analytics, and satisfaction feedback.", "Platform administrator"],
    ],
    visibility: ["Closing completion", "Recording and disbursement status", "Final-copy delivery", "Archive and audit status"],
    handoffTitle: "The transaction is complete",
    handoffBody: "The public demo will mark every milestone complete and preserve the path until reset or refresh.",
    safety: "No deed is recorded, no money is disbursed, no keys are delivered, and no legal closing occurs.",
    completionLabel: "Simulate close, recording, and archive",
    nextStage: "closed",
  },
};

const milestoneLeadRoles = {
  signatures: "buyer",
  earnest: "title",
  inspection: "inspector",
  appraisal: "appraiser",
  financing: "lender",
  title: "title",
  insurance: "insurance",
  closing_ready: "title",
  closed: "title",
};

const milestoneProviderCalls = {
  signatures: [["eSignature", "getEnvelopeStatus"]],
  earnest: [["earnestMoney", "getDepositStatus"]],
  title: [["titleSettlement", "getTitleStatus"]],
  closing_ready: [
    ["remoteNotary", "scheduleNotarization"],
    ["eClosing", "prepareClosing"],
  ],
  closed: [["eRecording", "submitForRecording"]],
};

const milestoneTaskProviderCalls = {
  signatures: [
    [["documentVault", "listDocuments"]],
    [["eSignature", "createEnvelope"]],
    [["eSignature", "getEnvelopeStatus"]],
    [["documentVault", "storeDocument"]],
  ],
  earnest: [
    [["titleSettlement", "getTitleStatus"]],
    [["earnestMoney", "createDepositIntent"]],
    [["earnestMoney", "getDepositStatus"]],
    [["earnestMoney", "getDepositStatus"]],
  ],
  title: [
    [["titleSettlement", "openTitleOrder"]],
    [["titleSettlement", "getTitleStatus"]],
    [["titleSettlement", "prepareSettlement"]],
    [["titleSettlement", "getTitleStatus"]],
  ],
  closing_ready: [
    [["eClosing", "prepareClosing"]],
    [["eClosing", "getClosingStatus"]],
    [["remoteNotary", "checkEligibility"], ["remoteNotary", "scheduleNotarization"]],
    [["eClosing", "getClosingStatus"]],
  ],
  closed: [
    [["eClosing", "getClosingStatus"]],
    [["eRecording", "validatePackage"], ["eRecording", "submitForRecording"]],
    [["documentVault", "grantDocumentAccess"]],
    [["documentVault", "storeDocument"]],
  ],
};

const milestoneTaskOutputs = {
  signatures: [
    "Locked version confirmed in the mock document vault.",
    "Signer identity and e-record consent marked ready.",
    "Required acknowledgment checklist marked complete.",
    "Tamper-evidence and copy-distribution status marked complete.",
  ],
  earnest: [
    "Authorized holder identified for this sample transaction.",
    "Portal-only instruction workflow displayed without bank details.",
    "Deposit deadline and participant visibility marked ready.",
    "Mock receipt status recorded; no money moved.",
  ],
  inspection: [
    "Inspection scope selected for the sample contingency.",
    "Access window coordinated in the mock provider desk.",
    "Findings categorized for buyer review without uploading a report.",
    "Inspection contingency resolved in the public demo timeline.",
  ],
  appraisal: [
    "Lender-authorized appraisal assignment marked created.",
    "Property access coordination marked ready.",
    "Valuation delivery status marked delivered without a value opinion.",
    "Appraisal exception workflow marked resolved.",
  ],
  financing: [
    "Application and disclosure status marked active.",
    "Buyer condition checklist marked satisfied without collecting documents.",
    "Underwriting milestone marked complete.",
    "Clear-to-close status marked issued.",
  ],
  title: [
    "Title order marked opened from approved contract facts.",
    "Title requirements and exception status marked reviewed.",
    "Settlement-figure preparation marked ready without figures.",
    "Title clear status marked complete.",
  ],
  insurance: [
    "Approved quote request workflow marked ready.",
    "Coverage comparison fields marked reviewed without quotes.",
    "Provider selection step marked complete without binding coverage.",
    "Evidence-of-insurance status marked delivered to the mock lender path.",
  ],
  closing_ready: [
    "Final figure review milestone marked ready without creating a CD or ALTA.",
    "Final walkthrough status marked complete.",
    "Signing and notarization readiness marked scheduled without an appointment.",
    "Funding and recording readiness marked ready.",
  ],
  closed: [
    "Settlement completion marked complete.",
    "Recording and disbursement status marked complete without filing or moving money.",
    "Final-copy delivery marked complete.",
    "Archive, audit pack, and satisfaction status marked complete.",
  ],
};

const demoState = {
  selectedPropertyId: 1,
  savedPropertyIds: new Set(),
  currentStep: 1,
  role: "buyer",
  featureFilter: "all",
  stage: "draft",
  activeMilestone: "signatures",
  validationFocusId: "",
  pendingBuyerAction: "",
  buyerAgreementAcknowledged: false,
  sellerAgreementAcknowledged: false,
  providerTaskCompletions: {},
  agreementContext: {
    type: "buyer",
    mode: "view",
  },
  sellerIntakeCompleted: false,
  buyerIntake: {
    legalName: "",
    email: "",
    phone: "",
    authority: "",
    address: "",
    coBuyers: "",
  },
  sellerIntake: {
    propertyAddress: "",
    legalName: "",
    email: "",
    phone: "",
    authority: "",
    coOwners: "",
    targetPrice: "",
    sqft: "",
    yearBuilt: "",
    condition: "Updated",
    visitTime: "",
    currentlyListed: "",
  },
  negotiation: {
    turn: "seller",
    mode: "edit",
    version: 1,
    history: [],
    draft: null,
  },
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

const contactCategories = Object.freeze([
  "General",
  "Partnerships",
  "Investors",
  "Press",
  "Careers",
  "Billing",
  "Support",
  "Legal",
  "Compliance",
]);
const CONTACT_MESSAGE_MAX_LENGTH = 10000;
const TURNSTILE_ACTION = "contact_form";
const PRODUCTION_HOSTS = new Set(["escrowless.net", "www.escrowless.net"]);
const turnstileState = {
  widgetId: null,
  token: "",
  renderAttempts: 0,
  renderedSiteKey: "",
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function audit(action, metadata = {}, outcome = "simulated") {
  return sandbox.audit.record(action, {
    actor: demoState.role,
    outcome,
    metadata,
  });
}

function getFieldValue(id) {
  return $(`#${id}`)?.value.trim() || "";
}

function isLikelyEmail(value) {
  return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value);
}

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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function numericSquareFeet(value) {
  return Number(String(value || "").replace(/[^\d.]/g, "")) || 0;
}

function roundToIncrement(value, increment = 1000) {
  return Math.round((Number(value) || 0) / increment) * increment;
}

function hashString(value) {
  return String(value)
    .split("")
    .reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 2166136261);
}

function seededUnit(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function seededRange(seed, min, max) {
  return min + seededUnit(seed) * (max - min);
}

function conditionFactor(condition) {
  return conditionFactors[condition] || conditionFactors.Good;
}

function propertyAge(yearBuilt) {
  const year = Number(yearBuilt) || 1978;
  return clamp(2026 - year, 0, 225);
}

function ageFactor(yearBuilt) {
  const age = propertyAge(yearBuilt);
  return clamp(1.045 - age * 0.00125, 0.84, 1.045);
}

function profileForSubject(subject) {
  return marketProfiles[subject.neighborhood] || marketProfiles.Richmond;
}

function generateMockComparableSales(subject) {
  const sqft = numericSquareFeet(subject.sqft) || 2200;
  const profile = profileForSubject(subject);
  const seedBase = hashString(`${subject.id || subject.address || "seller"}-${sqft}-${subject.yearBuilt}`);
  return [0, 1, 2, 3, 4].map((index) => {
    const seed = seedBase + index * 97;
    const compSqft = roundToIncrement(sqft * seededRange(seed, 0.88, 1.14), 25);
    const compAge = clamp(Math.round(propertyAge(subject.yearBuilt) + seededRange(seed + 11, -18, 16)), 1, 170);
    const compPpsf = profile.pricePerSqft * seededRange(seed + 23, 0.91, 1.1);
    const compCondition = seededUnit(seed + 31) > 0.7 ? "Excellent" : seededUnit(seed + 37) > 0.42 ? "Updated" : "Good";
    const rawSalePrice = compSqft * compPpsf * conditionFactor(compCondition) * profile.heat;
    const sqftAdjustment = (sqft - compSqft) * profile.pricePerSqft * 0.42;
    const ageAdjustment = (compAge - propertyAge(subject.yearBuilt)) * profile.pricePerSqft * sqft * 0.0016;
    const conditionAdjustment = (conditionFactor(subject.condition) - conditionFactor(compCondition)) * rawSalePrice * 0.72;
    const adjustedPrice = roundToIncrement(rawSalePrice + sqftAdjustment + ageAdjustment + conditionAdjustment, 1000);
    return {
      label: `Mock comp ${index + 1}`,
      sqft: compSqft,
      age: compAge,
      condition: compCondition,
      soldPrice: roundToIncrement(rawSalePrice, 1000),
      adjustedPrice,
      weight: Number((1 - index * 0.11).toFixed(2)),
    };
  });
}

function estimateSubjectValue(subject) {
  const sqft = numericSquareFeet(subject.sqft) || 2200;
  const profile = profileForSubject(subject);
  const comps = generateMockComparableSales(subject);
  const weightedTotal = comps.reduce((sum, comp) => sum + comp.adjustedPrice * comp.weight, 0);
  const weightTotal = comps.reduce((sum, comp) => sum + comp.weight, 0);
  const compEstimate = weightedTotal / weightTotal;
  const subjectAdjustment = conditionFactor(subject.condition) * ageFactor(subject.yearBuilt) * (subject.marketFactor || profile.heat);
  const estimate = roundToIncrement(compEstimate * subjectAdjustment, 1000);
  const listPremium =
    subject.marketTemperature === "Hot" ? 0.018 : subject.marketTemperature === "Warm" ? 0.01 : 0.002;
  const recommendedListPrice = roundToIncrement(estimate * (1 + listPremium), 1000);
  return {
    comps,
    estimate,
    recommendedListPrice,
    pricePerSqft: Math.round(estimate / sqft),
    confidence: profile.confidence,
  };
}

function getOfferInputs() {
  return {
    price: Number($("#offerPrice")?.value || demoState.offer.price),
    financing: $("#financingType")?.value || demoState.offer.financing,
    downPayment: Number($("#downPayment")?.value || demoState.offer.downPayment),
    earnestMoney: Number($("#earnestMoney")?.value || demoState.offer.earnestMoney),
    closingDate: $("#closingDate")?.value || demoState.offer.closingDate,
    responseDate: $("#responseDate")?.value || demoState.offer.responseDate,
    contingencies: {
      inspection: Boolean($("#inspectionContingency")?.checked),
      financing: Boolean($("#financingContingency")?.checked),
      appraisal: Boolean($("#appraisalContingency")?.checked),
      homeSale: Boolean($("#homeSaleContingency")?.checked),
    },
  };
}

function getRecommendedBid(valuation, inputs = getOfferInputs()) {
  const property = getProperty();
  const financingLift =
    inputs.financing === "Cash" ? 0.012 : inputs.financing === "Conventional loan" && inputs.downPayment >= 20 ? 0.004 : -0.007;
  const contingencyDrag =
    (inputs.contingencies.inspection ? 0.003 : -0.002) +
    (inputs.contingencies.financing ? 0.006 : -0.004) +
    (inputs.contingencies.appraisal ? 0.004 : -0.003) +
    (inputs.contingencies.homeSale ? 0.018 : 0);
  const heatPremium = property.marketTemperature === "Hot" ? 0.012 : property.marketTemperature === "Warm" ? 0.006 : 0;
  const target = valuation.estimate * (0.992 + heatPremium + financingLift - contingencyDrag);
  return roundToIncrement(clamp(target, valuation.estimate * 0.94, property.price * 1.055), 1000);
}

function calculateTrancheFee(amount, tranches) {
  let previousCap = 0;
  return tranches.reduce((sum, tranche) => {
    const cap = tranche.upTo;
    const taxable = Math.max(0, Math.min(amount, cap) - previousCap);
    previousCap = cap;
    return sum + taxable * tranche.rate;
  }, 0);
}

function calculateEscrowLessFee(amount, side = "buyer") {
  const price = Number(amount) || 0;
  const commission = calculateTrancheFee(price, feeSchedule[side]);
  const representationFee = side === "seller" ? Math.max(commission, feeSchedule.sellerMinimumFee) : commission;
  const total = representationFee + feeSchedule.platformFee;
  return {
    side,
    representationFee,
    platformFee: feeSchedule.platformFee,
    total,
    effectiveRate: price ? (total / price) * 100 : 0,
  };
}

function daysBetween(startValue, endValue) {
  if (!startValue || !endValue) return 0;
  const start = new Date(`${startValue}T00:00:00Z`).getTime();
  const end = new Date(`${endValue}T00:00:00Z`).getTime();
  return Math.round((end - start) / 86400000);
}

function calculateOfferStrength() {
  const property = getProperty();
  const valuation = estimateSubjectValue(property);
  const inputs = getOfferInputs();
  const recommendedBid = getRecommendedBid(valuation, inputs);
  const listRatio = property.price ? inputs.price / property.price : 1;
  const bidRatio = recommendedBid ? inputs.price / recommendedBid : 1;
  const earnestRatio = inputs.price ? inputs.earnestMoney / inputs.price : 0;
  const closingDays = daysBetween(new Date().toISOString().slice(0, 10), inputs.closingDate);
  const responseDays = daysBetween(new Date().toISOString().slice(0, 10), inputs.responseDate);

  const priceScore = clamp(26 + (bidRatio - 1) * 110 + (listRatio - 1) * 38, 4, 35);
  const financingScore =
    inputs.financing === "Cash"
      ? 20
      : inputs.financing === "Conventional loan"
        ? clamp(12 + inputs.downPayment * 0.25, 12, 18)
        : inputs.financing === "VA loan"
          ? 13
          : 12;
  const earnestScore = earnestRatio >= 0.03 ? 15 : earnestRatio >= 0.02 ? 12 : earnestRatio >= 0.01 ? 9 : 5;
  const contingencyScore = clamp(
    20 -
      (inputs.contingencies.inspection ? 3 : 0) -
      (inputs.contingencies.financing ? 5 : 0) -
      (inputs.contingencies.appraisal ? 4 : 0) -
      (inputs.contingencies.homeSale ? 10 : 0),
    4,
    20,
  );
  const closingScore = closingDays > 0 ? (closingDays <= 30 ? 10 : closingDays <= 45 ? 9 : closingDays <= 60 ? 7 : 5) : 4;
  const responseScore = responseDays > 0 ? (responseDays <= 2 ? 5 : responseDays <= 5 ? 3 : 1) : 1;
  const score = Math.round(clamp(priceScore + financingScore + earnestScore + contingencyScore + closingScore + responseScore, 0, 100));
  const label = score >= 86 ? "Very strong" : score >= 72 ? "Well positioned" : score >= 58 ? "Competitive but review" : "Needs strengthening";

  return {
    score,
    label,
    recommendedBid,
    valuation,
    factors: [
      `Price ${Math.round(listRatio * 100)}% of list`,
      `${inputs.financing}${inputs.financing === "Cash" ? "" : ` · ${inputs.downPayment}% down`}`,
      `${(earnestRatio * 100).toFixed(1)}% earnest money`,
      `${Object.values(inputs.contingencies).filter(Boolean).length} protections selected`,
    ],
  };
}

function getProperty() {
  return properties.find((property) => property.id === demoState.selectedPropertyId) || properties[0];
}

function getStageIndex(stage = demoState.stage) {
  const index = transactionFlow.findIndex(([id]) => id === stage);
  return index < 0 ? 0 : index;
}

function getStageDefinition(stage = demoState.stage) {
  return transactionFlow[getStageIndex(stage)];
}

function setDemoRole(role) {
  if (!roleDefinitions[role]) return;
  demoState.role = role;
  $("#roleSelect").value = role;
}

function offerToListPercentage() {
  const listPrice = Number(getProperty().price);
  const offerPrice = Number(demoState.offer.price);
  if (!listPrice || !offerPrice) return "0.0%";
  return `${((offerPrice / listPrice) * 100).toFixed(1)}%`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function offerTerms() {
  return {
    price: Number(demoState.offer.price),
    earnestMoney: Number(demoState.offer.earnestMoney),
    closingDate: demoState.offer.closingDate,
    responseDate: demoState.offer.responseDate,
    includedItems: demoState.offer.includedItems,
    note: demoState.offer.note,
  };
}

function initializeNegotiation() {
  demoState.negotiation.turn = "seller";
  demoState.negotiation.mode = "edit";
  demoState.negotiation.version = 1;
  demoState.negotiation.draft = null;
  demoState.negotiation.history = [
    {
      version: 1,
      actor: "buyer",
      label: "Original buyer offer",
      terms: offerTerms(),
    },
  ];
}

function applyNegotiatedTerms(terms) {
  demoState.offer.price = Number(terms.price);
  demoState.offer.earnestMoney = Number(terms.earnestMoney);
  demoState.offer.closingDate = terms.closingDate;
  demoState.offer.responseDate = terms.responseDate;
  demoState.offer.includedItems = terms.includedItems;
  demoState.offer.note = terms.note;
}

function beginCounter(actor) {
  if (!demoState.negotiation.history.length) initializeNegotiation();
  demoState.negotiation.turn = actor;
  demoState.negotiation.mode = "edit";
  demoState.negotiation.draft = offerTerms();
  setDemoRole(actor);
  goToView("negotiation");
}

function negotiationDifference(current, previous, key) {
  if (!previous || String(current[key]) === String(previous[key])) return "";
  return '<span class="term-change">Changed</span>';
}

function hasMaterialTermChange(current, previous) {
  return ["price", "earnestMoney", "closingDate", "responseDate", "includedItems"].some(
    (key) => String(current[key]) !== String(previous[key]),
  );
}

function renderNegotiation() {
  if (!demoState.negotiation.history.length) initializeNegotiation();
  const negotiation = demoState.negotiation;
  const actor = negotiation.turn;
  const actorLabel = actor === "buyer" ? "Buyer" : "Seller";
  const otherLabel = actor === "buyer" ? "seller" : "buyer";
  const latest = negotiation.history.at(-1);
  const previous = negotiation.history.at(-2);
  const terms = latest.terms;
  const isEditing = negotiation.mode === "edit";

  $("#negotiationRoleLabel").textContent = `${actorLabel} negotiation desk`;
  $("#negotiationHeading").textContent = isEditing
    ? `Prepare the ${actorLabel.toLowerCase()}'s next counteroffer.`
    : `${actorLabel}, review the ${otherLabel}'s counteroffer.`;
  $("#negotiationSubheading").textContent =
    "The parties can continue revising terms for as many rounds as needed, or accept and advance to review.";
  $("#negotiationRound").textContent =
    `Version ${isEditing ? negotiation.version + 1 : negotiation.version}${isEditing ? " in preparation" : ""} · ${actorLabel}'s turn`;
  $("#negotiationProposalTitle").textContent = isEditing
    ? `Version ${negotiation.version + 1} in preparation`
    : `Version ${latest.version} received from the ${otherLabel}`;

  $("#negotiationSummary").innerHTML = `
    <div><span>Purchase price ${negotiationDifference(terms, previous?.terms, "price")}</span><strong>${money(terms.price)}</strong></div>
    <div><span>Earnest money ${negotiationDifference(terms, previous?.terms, "earnestMoney")}</span><strong>${money(terms.earnestMoney)}</strong></div>
    <div><span>Closing date ${negotiationDifference(terms, previous?.terms, "closingDate")}</span><strong>${formatDate(terms.closingDate)}</strong></div>
    <div><span>Response deadline ${negotiationDifference(terms, previous?.terms, "responseDate")}</span><strong>${formatDate(terms.responseDate)}</strong></div>
    <div class="wide"><span>Included property ${negotiationDifference(terms, previous?.terms, "includedItems")}</span><strong>${escapeHTML(terms.includedItems || "None stated")}</strong></div>
  `;

  $("#counterEditor").hidden = !isEditing;
  if (isEditing) {
    const draft = negotiation.draft || offerTerms();
    $("#counterPrice").value = draft.price;
    $("#counterEarnest").value = draft.earnestMoney;
    $("#counterClosing").value = draft.closingDate;
    $("#counterResponse").value = draft.responseDate;
    $("#counterIncluded").value = draft.includedItems;
    $("#counterNote").value = draft.note;
  }

  $("#negotiationActions").innerHTML = isEditing
    ? `
      <button class="secondary-button" data-view-link="workspace">Save nothing and leave</button>
      <button class="primary-button" data-action="submit-counter">Send simulated counter to ${otherLabel}</button>
    `
    : `
      <button class="secondary-button" data-action="counter-back">Prepare a counter-counteroffer</button>
      <button class="secondary-button" data-action="view-contract">View contract with these terms</button>
      <button class="primary-button" data-action="accept-counter">Accept and route for review</button>
    `;

  $("#negotiationHistory").innerHTML = negotiation.history
    .slice()
    .reverse()
    .map(
      (entry) => `
        <article>
          <span>V${entry.version}</span>
          <div>
            <strong>${escapeHTML(entry.label)}</strong>
            <small>${money(entry.terms.price)} · ${formatDate(entry.terms.closingDate)}</small>
          </div>
        </article>
      `,
    )
    .join("");
}

function submitCounter() {
  const terms = {
    price: Number($("#counterPrice").value),
    earnestMoney: Number($("#counterEarnest").value),
    closingDate: $("#counterClosing").value,
    responseDate: $("#counterResponse").value,
    includedItems: $("#counterIncluded").value.trim(),
    note: $("#counterNote").value.trim(),
  };
  const messages = [];
  let focusId = "";
  if (!terms.price || terms.price < 100000) {
    messages.push("Enter a counteroffer price of at least $100,000.");
    focusId ||= "counterPrice";
  }
  if (!terms.earnestMoney || terms.earnestMoney <= 0) {
    messages.push("Enter an earnest-money amount greater than $0.");
    focusId ||= "counterEarnest";
  }
  if (!terms.closingDate) {
    messages.push("Choose a proposed closing date.");
    focusId ||= "counterClosing";
  }
  if (!terms.responseDate) {
    messages.push("Choose a response deadline.");
    focusId ||= "counterResponse";
  }
  if (terms.closingDate && terms.responseDate && terms.responseDate >= terms.closingDate) {
    messages.push("The response deadline must occur before the proposed closing date.");
    focusId ||= "counterResponse";
  }
  if (!hasMaterialTermChange(terms, demoState.negotiation.history.at(-1).terms)) {
    messages.push("Change at least one deal term before sending a new counteroffer version.");
    focusId ||= "counterPrice";
  }
  if (messages.length) {
    showValidation("Complete the counteroffer terms.", messages, focusId);
    return;
  }

  const sender = demoState.negotiation.turn;
  const recipient = sender === "buyer" ? "seller" : "buyer";
  demoState.negotiation.version += 1;
  demoState.negotiation.history.push({
    version: demoState.negotiation.version,
    actor: sender,
    label: `${sender === "buyer" ? "Buyer" : "Seller"} counteroffer`,
    terms,
  });
  applyNegotiatedTerms(terms);
  demoState.negotiation.turn = recipient;
  demoState.negotiation.mode = "review";
  demoState.negotiation.draft = null;
  setDemoRole(recipient);
  renderNegotiation();
  renderWorkspace();
  showToast(`Version ${demoState.negotiation.version} returned to the ${recipient} role. Nothing was transmitted.`);
}

function selectedContingencies() {
  return $$(".choice-card input:checked").map((input) =>
    input.closest(".choice-card").querySelector("strong").textContent,
  );
}

function showValidation(title, messages, focusId = "") {
  demoState.validationFocusId = focusId;
  $("#validationDialogTitle").textContent = title;
  $("#validationMessages").innerHTML = messages.map((message) => `<p>${message}</p>`).join("");
  $("#validationDialog").showModal();
}

function validateCurrentOfferStep() {
  const messages = [];
  let focusId = "";

  if (demoState.currentStep === 1) {
    const price = Number($("#offerPrice").value);
    const earnest = Number($("#earnestMoney").value);
    if (!price || price < 100000) {
      messages.push("Enter an offer price of at least $100,000 for this simulation.");
      focusId ||= "offerPrice";
    }
    if (!$("#financingType").value) {
      messages.push("Choose a financing method.");
      focusId ||= "financingType";
    }
    if ($("#financingType").value !== "Cash" && !$("#downPayment").value) {
      messages.push("Choose a down-payment amount.");
      focusId ||= "downPayment";
    }
    if (!earnest || earnest <= 0) {
      messages.push("Enter an earnest-money amount greater than $0.");
      focusId ||= "earnestMoney";
    }
  }

  if (demoState.currentStep === 3) {
    const closingDate = $("#closingDate").value;
    const responseDate = $("#responseDate").value;
    if (!closingDate) {
      messages.push("Choose a preferred closing date.");
      focusId ||= "closingDate";
    }
    if (!responseDate) {
      messages.push("Choose a seller-response deadline.");
      focusId ||= "responseDate";
    }
    if (closingDate && responseDate && responseDate >= closingDate) {
      messages.push("The seller-response deadline must occur before the closing date.");
      focusId ||= "responseDate";
    }
  }

  if (demoState.currentStep === 4 && !$("#reviewConsent").checked) {
    messages.push("Acknowledge that the offer is a non-binding simulation before advancing.");
    focusId = "reviewConsent";
  }

  if (!messages.length) return true;
  showValidation("Please complete the required information.", messages, focusId);
  return false;
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
          <div
            class="property-image property-image-link ${property.style}"
          >
            <button
              class="property-image-open"
              data-action="view-property"
              data-property-id="${property.id}"
              aria-label="View ${property.address}"
            ></button>
            <div class="image-badges">
              <span class="image-badge ${property.tag === "Sample facts" ? "verified" : ""}">${property.tag}</span>
            </div>
            <span class="readonly-image-badge" aria-label="Mock listing">Demo</span>
            <button
              class="property-save-button ${demoState.savedPropertyIds.has(property.id) ? "saved" : ""}"
              data-action="favorite"
              data-property-id="${property.id}"
              aria-label="${demoState.savedPropertyIds.has(property.id) ? "Remove from" : "Add to"} saved properties"
            >${demoState.savedPropertyIds.has(property.id) ? "♥" : "♡"}</button>
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
          <span class="image-badge verified">Demo offer workflow</span>
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
          <h3>Sample Home Facts</h3>
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
        <div class="detail-actions-stack">
          <div class="detail-actions">
            <button class="primary-button" data-action="start-offer">Create a digital offer</button>
            <button class="secondary-button" data-action="tour">Schedule a tour</button>
          </div>
          <button class="secondary-button detail-save-button" data-action="favorite" data-property-id="${property.id}">
            ${demoState.savedPropertyIds.has(property.id) ? "Remove from saved properties" : "Save this property"}
          </button>
          <button class="text-button" data-action="list-property">Selling instead? List a property <span>→</span></button>
        </div>
      </div>
    </div>
  `;
}

function updateSavedCount() {
  $("#savedCount").textContent = demoState.savedPropertyIds.size;
}

function toggleSavedProperty(propertyId) {
  const id = Number(propertyId || demoState.selectedPropertyId);
  if (demoState.savedPropertyIds.has(id)) {
    demoState.savedPropertyIds.delete(id);
    audit("buyer.saved-property.removed", { propertyId: id });
  } else {
    demoState.savedPropertyIds.add(id);
    audit("buyer.saved-property.added", { propertyId: id });
  }
  updateSavedCount();
  renderProperties();
  renderPropertyDetail();
  renderSavedProperties();
  showToast(
    demoState.savedPropertyIds.has(id)
      ? "Property saved in temporary browser memory."
      : "Property removed from the temporary saved list.",
  );
}

function renderSavedProperties() {
  const saved = properties.filter((property) => demoState.savedPropertyIds.has(property.id));
  $("#emptySavedState").hidden = saved.length > 0;
  $("#savedPropertyGrid").hidden = saved.length === 0;
  $("#savedPropertyGrid").innerHTML = saved
    .map(
      (property) => `
        <article class="property-card">
          <div
            class="property-image property-image-link ${property.style}"
          >
            <button
              class="property-image-open"
              data-action="view-property"
              data-property-id="${property.id}"
              aria-label="View ${property.address}"
            ></button>
            <div class="image-badges"><span class="image-badge verified">Saved in memory</span></div>
            <button class="property-save-button saved" data-action="favorite" data-property-id="${property.id}" aria-label="Remove from saved properties">♥</button>
          </div>
          <div class="property-body">
            <div class="price-row"><span class="property-price">${money(property.price)}</span><span class="digital-offer-pill">Demo</span></div>
            <p class="property-address">${property.address}, ${property.city}</p>
            <div class="property-meta">
              <span><strong>${property.beds}</strong> beds</span>
              <span><strong>${property.baths}</strong> baths</span>
              <span><strong>${property.sqft}</strong> sq ft</span>
            </div>
            <div class="property-footer">
              <span>Temporary shortlist</span>
              <button data-action="view-property" data-property-id="${property.id}">View home →</button>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function openOfferBuilder() {
  demoState.currentStep = 1;
  renderOfferProperty();
  renderStep();
  goToView("offer");
}

function renderTour() {
  const property = getProperty();
  $("#tourPropertyLabel").textContent = `${property.address}, ${property.city}`;
}

function collectBuyerIntake() {
  demoState.buyerIntake = {
    legalName: getFieldValue("buyerLegalName"),
    email: getFieldValue("buyerEmail"),
    phone: getFieldValue("buyerPhone"),
    authority: getFieldValue("buyerAuthority"),
    address: getFieldValue("buyerAddress"),
    coBuyers: getFieldValue("buyerCoBuyers"),
  };
  return demoState.buyerIntake;
}

function validateBuyerIntake() {
  const intake = collectBuyerIntake();
  const messages = [];
  let focusId = "";
  if (!intake.legalName) {
    messages.push("Enter the buyer's legal name for this simulation.");
    focusId ||= "buyerLegalName";
  }
  if (!isLikelyEmail(intake.email)) {
    messages.push("Enter a valid sample email address.");
    focusId ||= "buyerEmail";
  }
  if (!intake.phone) {
    messages.push("Enter a sample phone number.");
    focusId ||= "buyerPhone";
  }
  if (!intake.authority) {
    messages.push("Choose whether the person is the buyer or an authorized representative.");
    focusId ||= "buyerAuthority";
  }
  if (!intake.address) {
    messages.push("Enter a sample current address.");
    focusId ||= "buyerAddress";
  }
  if (messages.length) {
    showValidation("Complete the buyer intake.", messages, focusId);
    return false;
  }
  return true;
}

function beginBuyerRepresentationGate(destination) {
  if (demoState.buyerAgreementAcknowledged) {
    if (destination === "tour") {
      renderTour();
      goToView("tour");
    } else {
      openOfferBuilder();
    }
    return;
  }
  demoState.pendingBuyerAction = destination;
  audit("buyer.representation-gate.opened", {
    destination,
    propertyId: demoState.selectedPropertyId,
  });
  $("#buyerIntakeDialog").showModal();
}

function collectSellerIntake() {
  demoState.sellerIntake = {
    propertyAddress: getFieldValue("sellerPropertyAddress"),
    legalName: getFieldValue("sellerLegalName"),
    email: getFieldValue("sellerEmail"),
    phone: getFieldValue("sellerPhone"),
    authority: getFieldValue("sellerAuthority"),
    coOwners: getFieldValue("sellerCoOwners"),
    targetPrice: getFieldValue("sellerTargetPrice"),
    sqft: getFieldValue("sellerSqft"),
    yearBuilt: getFieldValue("sellerYearBuilt"),
    condition: getFieldValue("sellerCondition") || "Updated",
    visitTime: getFieldValue("sellerVisitTime"),
    currentlyListed: getFieldValue("sellerCurrentlyListed"),
  };
  return demoState.sellerIntake;
}

function validateSellerIntake() {
  const intake = collectSellerIntake();
  const messages = [];
  let focusId = "";
  if (!intake.propertyAddress) {
    messages.push("Enter the property address.");
    focusId ||= "sellerPropertyAddress";
  }
  if (!intake.legalName) {
    messages.push("Enter the seller's legal name.");
    focusId ||= "sellerLegalName";
  }
  if (!isLikelyEmail(intake.email)) {
    messages.push("Enter a valid sample email address.");
    focusId ||= "sellerEmail";
  }
  if (!intake.phone) {
    messages.push("Enter a sample phone number.");
    focusId ||= "sellerPhone";
  }
  if (!intake.authority) {
    messages.push("Choose whether the person is an owner or authorized representative.");
    focusId ||= "sellerAuthority";
  }
  if (!intake.visitTime) {
    messages.push("Choose a preferred agent-visit window.");
    focusId ||= "sellerVisitTime";
  }
  if (!intake.currentlyListed) {
    messages.push("Indicate whether the property is currently listed with another broker.");
    focusId ||= "sellerCurrentlyListed";
  }
  if (messages.length) {
    showValidation("Complete the seller intake.", messages, focusId);
    return false;
  }
  return true;
}

function renderSellerReviewStatus() {
  const agreementStatus = demoState.sellerAgreementAcknowledged
    ? "Mock acknowledgment complete"
    : "Available to review now or later";
  $("#sellerReviewStatus").innerHTML = `
    <article><span>Intake</span><strong>Temporarily completed</strong></article>
    <article><span>Agreement</span><strong>${agreementStatus}</strong></article>
    <article><span>Activation</span><strong>Blocked pending licensed broker approval</strong></article>
  `;
}

function agreementSummaryItems(type) {
  if (type === "buyer" && demoState.agreementContext.mode === "sign") {
    return [
      ["Demo participant", demoState.buyerIntake.legalName || "Not provided"],
      ["Property", `${getProperty().address}, ${getProperty().city}`],
      ["Requested path", demoState.pendingBuyerAction === "tour" ? "Schedule tour" : "Prepare offer"],
    ];
  }
  if (type === "seller" && demoState.agreementContext.mode === "sign") {
    return [
      ["Demo participant", demoState.sellerIntake.legalName || "Not provided"],
      ["Property", demoState.sellerIntake.propertyAddress || "Not provided"],
      ["Review status", demoState.sellerIntakeCompleted ? "Intake complete" : "Intake in progress"],
    ];
  }
  return [];
}

function openAgreement(type, mode = "view") {
  const agreement = agreements[type];
  if (!agreement) return;
  demoState.agreementContext = { type, mode };
  $("#agreementDialogEyebrow").textContent =
    mode === "sign" ? "Mock representation acknowledgment" : "Representative source template";
  $("#agreementDialogTitle").textContent =
    type === "buyer" ? "Exclusive Buyer Brokerage Agreement" : "Exclusive Seller Brokerage Agreement";
  $("#agreementDocument").innerHTML = agreement.html;
  $("#agreementMockConsent").checked = false;
  $("#agreementSignPanel").hidden = mode !== "sign";
  $("#agreementIntakeSummary").innerHTML = agreementSummaryItems(type)
    .map(([label, value]) => `<div><span>${label}</span><strong>${escapeHTML(value)}</strong></div>`)
    .join("");
  audit("document.representation-agreement.opened", {
    agreementType: type,
    mode,
    sourceFile: agreement.sourceFile,
  });
  $("#agreementDialog").showModal();
}

function mockSignAgreement() {
  if (!$("#agreementMockConsent").checked) {
    showValidation(
      "Acknowledge the simulation first.",
      ["Confirm that the mock-sign control does not create or execute a real agreement."],
      "agreementMockConsent",
    );
    return;
  }

  const type = demoState.agreementContext.type;
  const result = sandbox.providers.invoke("eSignature", "createEnvelope", {
    actor: demoState.role,
    documentType: `${type}-representation-agreement`,
    mockOnly: true,
  });
  audit("document.representation-agreement.mock-acknowledged", {
    agreementType: type,
    simulationId: result.simulationId,
  });
  $("#agreementDialog").close();

  if (type === "buyer") {
    demoState.buyerAgreementAcknowledged = true;
    const destination = demoState.pendingBuyerAction;
    demoState.pendingBuyerAction = "";
    showToast("Mock buyer representation acknowledgment complete. No signature or contract was created.");
    if (destination === "tour") {
      renderTour();
      goToView("tour");
    } else {
      openOfferBuilder();
    }
    return;
  }

  demoState.sellerAgreementAcknowledged = true;
  renderSellerReviewStatus();
  showToast("Mock seller representation acknowledgment complete. No signature or contract was created.");
  if (demoState.sellerIntakeCompleted) goToView("sellerReview");
}

function submitSellerForReview() {
  if (!validateSellerIntake()) return;
  const result = sandbox.providers.invoke("documentVault", "storeDocument", {
    actor: "seller",
    documentType: "seller-intake-summary",
    memoryOnly: true,
  });
  demoState.sellerIntakeCompleted = true;
  audit("seller.intake.submitted-for-mock-review", {
    simulationId: result.simulationId,
    agreementAcknowledged: demoState.sellerAgreementAcknowledged,
    currentlyListed: demoState.sellerIntake.currentlyListed,
  });
  renderSellerReviewStatus();
  goToView("sellerReview");
}

function setContactStatus(message, type = "") {
  const status = $("#contactStatus");
  if (!status) return;
  status.textContent = message;
  status.classList.remove("success", "error");
  if (type) status.classList.add(type);
}

function getPublicConfig() {
  return window.ESCROWLESS_PUBLIC_CONFIG || {};
}

function getTurnstileSiteKey() {
  return String(getPublicConfig().turnstileSiteKey || "").trim();
}

function isProductionHost() {
  return PRODUCTION_HOSTS.has(window.location.hostname);
}

function isTurnstileRequired() {
  return getPublicConfig().turnstileRequired === true || isProductionHost();
}

function setTurnstileStatus(message, type = "") {
  const status = $("#turnstileStatus");
  if (!status) return;
  status.textContent = message;
  status.classList.remove("success", "error");
  if (type) status.classList.add(type);
}

function setTurnstileToken(token) {
  turnstileState.token = token || "";
  const tokenField = $("#contactBotToken");
  if (tokenField) tokenField.value = turnstileState.token;
}

function resetTurnstileWidget() {
  setTurnstileToken("");
  if (window.turnstile && turnstileState.widgetId !== null) {
    try {
      window.turnstile.reset(turnstileState.widgetId);
    } catch {
      // The server-side validation remains the enforcement layer.
    }
  }
}

function renderTurnstileWidget() {
  const panel = $("#turnstilePanel");
  const container = $("#turnstileWidget");
  if (!panel || !container) return;

  const required = isTurnstileRequired();
  const siteKey = getTurnstileSiteKey();
  panel.classList.toggle("is-hidden", !required && !siteKey);

  if (!siteKey) {
    setTurnstileToken("");
    if (required) {
      setTurnstileStatus("Security verification is temporarily unavailable. Please try again later.", "error");
    } else {
      setTurnstileStatus("Security verification is not required in this local preview.", "");
    }
    return;
  }

  if (!window.turnstile?.render) {
    turnstileState.renderAttempts += 1;
    if (turnstileState.renderAttempts <= 25) {
      window.setTimeout(renderTurnstileWidget, 200);
      setTurnstileStatus("Loading security verification...", "");
    } else if (required) {
      setTurnstileStatus("Security verification could not load. Please refresh and try again.", "error");
    }
    return;
  }

  if (turnstileState.widgetId && turnstileState.renderedSiteKey === siteKey) return;

  container.innerHTML = "";
  setTurnstileToken("");
  turnstileState.widgetId = window.turnstile.render(container, {
    sitekey: siteKey,
    action: TURNSTILE_ACTION,
    callback: (token) => {
      setTurnstileToken(token);
      setTurnstileStatus("Security verification complete.", "success");
    },
    "expired-callback": () => {
      setTurnstileToken("");
      setTurnstileStatus("Security verification expired. Please complete it again.", "error");
    },
    "error-callback": () => {
      setTurnstileToken("");
      setTurnstileStatus("Security verification failed to load. Please refresh and try again.", "error");
    },
  });
  turnstileState.renderedSiteKey = siteKey;
  setTurnstileStatus("Complete the security verification before sending.", "");
}

async function submitContactMessage() {
  const name = getFieldValue("contactName");
  const email = getFieldValue("contactEmail");
  const phone = getFieldValue("contactPhone");
  const topic = getFieldValue("contactTopic");
  const message = getFieldValue("contactMessage");
  const website = getFieldValue("contactWebsite");
  const botToken = turnstileState.token || getFieldValue("contactBotToken");
  const messages = [];
  let focusId = "";
  if (!name) {
    messages.push("Enter your name.");
    focusId ||= "contactName";
  } else if (name.length > 100) {
    messages.push("Keep your name under 100 characters.");
    focusId ||= "contactName";
  }
  if (!isLikelyEmail(email)) {
    messages.push("Enter a valid email address.");
    focusId ||= "contactEmail";
  } else if (email.length > 254) {
    messages.push("Keep your email under 254 characters.");
    focusId ||= "contactEmail";
  }
  if (phone.length > 40) {
    messages.push("Keep your phone number under 40 characters.");
    focusId ||= "contactPhone";
  }
  if (!contactCategories.includes(topic)) {
    messages.push("Choose a contact reason.");
    focusId ||= "contactTopic";
  }
  if (!message) {
    messages.push("Enter a question, comment, or concern.");
    focusId ||= "contactMessage";
  } else if (message.length > CONTACT_MESSAGE_MAX_LENGTH) {
    messages.push("Keep your message under 10,000 characters.");
    focusId ||= "contactMessage";
  }
  if (!$("#contactConsent").checked) {
    messages.push("Confirm that you will not submit sensitive private or financial information through this basic contact form.");
    focusId ||= "contactConsent";
  }
  if (isTurnstileRequired() && !getTurnstileSiteKey()) {
    messages.push("Security verification is temporarily unavailable. Please try again later.");
    focusId ||= "turnstileWidget";
  } else if ((isTurnstileRequired() || getTurnstileSiteKey()) && !botToken) {
    messages.push("Complete the security verification.");
    focusId ||= "turnstileWidget";
  }
  if (messages.length) {
    showValidation("Complete the contact form.", messages, focusId);
    return;
  }

  const submitButton = $("#contactSubmitButton");
  submitButton.disabled = true;
  setContactStatus("Sending securely to EscrowLess...", "");

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({
        name,
        email,
        phone,
        category: topic,
        message,
        consent: true,
        website,
        botToken,
      }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      throw new Error(result.message || "The message could not be sent.");
    }
    audit("contact.message.sent", {
      category: topic,
      submissionId: result.submissionId,
      destination: "info@escrowless.net",
    }, "submitted");
    setContactStatus(`Message sent to EscrowLess. Submission ID: ${result.submissionId}`, "success");
    ["contactName", "contactEmail", "contactPhone", "contactTopic", "contactMessage", "contactWebsite", "contactBotToken"].forEach((id) => {
      const field = $(`#${id}`);
      if (field) field.value = "";
    });
    $("#contactConsent").checked = false;
    resetTurnstileWidget();
  } catch {
    audit("contact.message.failed", { category: topic }, "failed");
    resetTurnstileWidget();
    setContactStatus("Your message was not sent. Please try again in a few minutes.", "error");
  } finally {
    submitButton.disabled = false;
  }
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
  updateOfferInsights();
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
  const fee = calculateEscrowLessFee(price, "buyer");
  $("#feeEstimate").textContent = money(fee.total);
  $("#feeBreakdown").innerHTML = `
    <div><span>Buyer representation</span><strong>${money(fee.representationFee)}</strong></div>
    <div><span>Platform fee</span><strong>${money(fee.platformFee)}</strong></div>
    <div><span>Effective rate</span><strong>${fee.effectiveRate.toFixed(2)}%</strong></div>
  `;
}

function updateMarketEstimator() {
  const property = getProperty();
  const insights = calculateOfferStrength();
  const { valuation, recommendedBid } = insights;
  $("#marketEstimate").textContent = money(valuation.estimate);
  $("#marketEstimateSummary").textContent =
    `Mock ${valuation.confidence.toLowerCase()} confidence estimate · ${money(valuation.pricePerSqft)} per sq ft · ${property.marketTemperature.toLowerCase()} sample market.`;
  $("#sellerListRecommendation").textContent = money(valuation.recommendedListPrice);
  $("#buyerBidRecommendation").textContent = money(recommendedBid);
  $("#marketCompList").innerHTML = valuation.comps
    .slice(0, 3)
    .map(
      (comp) => `
        <div>
          <span>${comp.label}</span>
          <strong>${money(comp.adjustedPrice)}</strong>
          <small>${comp.sqft.toLocaleString()} sq ft · ${comp.age} yrs · ${comp.condition}</small>
        </div>
      `,
    )
    .join("");
}

function updateOfferStrength() {
  const strength = calculateOfferStrength();
  $("#offerStrengthLabel").textContent = strength.label;
  $("#offerStrengthScore").textContent = strength.score;
  $("#offerStrengthMeter").style.width = `${strength.score}%`;
  $("#offerStrengthFactors").innerHTML = strength.factors.map((factor) => `<span>${escapeHTML(factor)}</span>`).join("");
}

function updateOfferInsights() {
  updateFeeEstimate();
  updateMarketEstimator();
  updateOfferStrength();
}

function getSellerEstimatorSubject() {
  const targetPrice = Number($("#sellerTargetPrice")?.value || demoState.sellerIntake.targetPrice);
  return {
    id: "seller-intake",
    price: targetPrice || 0,
    address: getFieldValue("sellerPropertyAddress") || "Seller intake property",
    sqft: getFieldValue("sellerSqft") || "2200",
    yearBuilt: Number(getFieldValue("sellerYearBuilt")) || 1978,
    condition: getFieldValue("sellerCondition") || "Updated",
    neighborhood: "Richmond",
    marketTemperature: "Warm",
    marketFactor: 1.004,
  };
}

function renderSellerEstimator() {
  if (!$("#sellerRecommendedPrice")) return;
  const subject = getSellerEstimatorSubject();
  const valuation = estimateSubjectValue(subject);
  const activeListPrice = Number($("#sellerTargetPrice")?.value || 0) || valuation.recommendedListPrice;
  const sellerFee = calculateEscrowLessFee(activeListPrice, "seller");
  $("#sellerRecommendedPrice").textContent = money(valuation.recommendedListPrice);
  $("#sellerEstimatorText").textContent =
    `Generated from fake Richmond comps, ${numericSquareFeet(subject.sqft).toLocaleString()} sq ft, ${propertyAge(subject.yearBuilt)} years old, and ${subject.condition.toLowerCase()} condition.`;
  $("#sellerFeePreview").innerHTML = `
    <div><span>List price used</span><strong>${money(activeListPrice)}</strong></div>
    <div><span>Listing fee</span><strong>${money(sellerFee.representationFee)}</strong></div>
    <div><span>Platform fee</span><strong>${money(sellerFee.platformFee)}</strong></div>
    <div><span>Total estimate</span><strong>${money(sellerFee.total)}</strong></div>
  `;
}

function showInfoDialog({ eyebrow = "Feature simulation", title, body, details = [], actionLabel = "Return to the demo" }) {
  $("#infoDialogEyebrow").textContent = eyebrow;
  $("#infoDialogTitle").textContent = title;
  $("#infoDialogBody").textContent = body;
  $("#infoDialogDetails").innerHTML = details
    .map(
      ([label, value]) => `
        <section>
          <span>${label}</span>
          <p>${value}</p>
        </section>
      `,
    )
    .join("");
  $("#infoDialogActions").innerHTML = `<button class="primary-button" data-action="close-info">${actionLabel}</button>`;
  $("#infoDialog").showModal();
}

function openFeature(featureId) {
  const feature = featureCatalog.find((item) => item.id === featureId);
  if (!feature) return;
  showInfoDialog({
    eyebrow: `${feature.status} · ${feature.category}`,
    title: feature.title,
    body: feature.summary,
    details: [
      ["Production purpose", feature.production],
      ["Typical workflow", feature.workflow.join(" → ")],
      ["Participating roles", feature.roles.join(", ")],
      ["Public demo boundary", feature.safety],
    ],
    actionLabel: "Continue exploring",
  });
}

function renderRoleWorkspace() {
  const role = roleDefinitions[demoState.role] || roleDefinitions.buyer;
  $("#roleEyebrow").textContent = `${role.label} workspace`;
  $("#roleHeading").textContent = `See the transaction as the ${role.label.toLowerCase()}.`;
  $("#roleDescription").textContent = role.description;
  $("#roleCapabilities").innerHTML = role.capabilities
    .map(
      ([title, description, featureId], index) => `
        <button class="role-capability-card" data-action="open-feature" data-feature-id="${featureId}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${title}</strong>
          <small>${description}</small>
          <em>Explore feature →</em>
        </button>
      `,
    )
    .join("");
  $("#roleVisibility").innerHTML = role.visibility.map((item) => `<p><i>✓</i>${item}</p>`).join("");
  $("#roleHandoffs").innerHTML = role.handoffs.map((item) => `<p><i>→</i>${item}</p>`).join("");
  const [title, description, label, destination] = role.next;
  const destinationIsView = ["discover", "review", "workspace", "offer"].includes(destination);
  $("#roleNextAction").innerHTML = `
    <p class="eyebrow">Suggested walkthrough</p>
    <h3>${title}</h3>
    <p>${description}</p>
    <button class="primary-button" ${
      destinationIsView
        ? `data-view-link="${destination}"`
        : `data-action="open-feature" data-feature-id="${destination}"`
    }>${label}</button>
  `;
}

function renderFeatureExplorer() {
  const features =
    demoState.featureFilter === "all"
      ? featureCatalog
      : featureCatalog.filter((feature) => feature.category === demoState.featureFilter);
  $("#featureGrid").innerHTML = features
    .map(
      (feature) => `
        <article class="feature-card">
          <div class="feature-card-top">
            <span class="feature-category">${feature.category}</span>
            <span class="feature-status">${feature.status}</span>
          </div>
          <h2>${feature.title}</h2>
          <p>${feature.summary}</p>
          <div class="feature-role-list">${feature.roles.slice(0, 4).map((role) => `<span>${role}</span>`).join("")}</div>
          <button class="text-button" data-action="open-feature" data-feature-id="${feature.id}">Open feature details <span>→</span></button>
        </article>
      `,
    )
    .join("");
}

function renderContract() {
  const property = getProperty();
  const contingencies = selectedContingencies();
  const stageIndex = getStageIndex();
  const approvedIndex = getStageIndex("approved");
  const reviewedIndex = getStageIndex("contract_reviewed");
  const contractContinue = $("#contractContinue");

  $("#contractDocument").innerHTML = `
    <div class="contract-watermark">SIMULATION · UNOFFICIAL · NOT BINDING · CANNOT BE SIGNED</div>
    <header class="contract-header">
      <p>EscrowLess public demo · Offer EL-1048 · Negotiated version ${demoState.negotiation.version}</p>
      <h1>Mock Residential Purchase and Sale Agreement</h1>
      <strong>Legal-style textual prototype populated from simulated deal terms</strong>
    </header>
    <section class="contract-disclaimer">
      IMPORTANT DEMONSTRATION NOTICE: This document is an original product-design mockup. It is not
      an official Virginia, Richmond, Virginia REALTORS®, broker, bar association, lender, title, or
      government form; it has not been approved by counsel; and it must not be used, relied upon,
      executed, recorded, or adapted for an actual transaction.
    </section>
    <p class="contract-recital">
      THIS MOCK RESIDENTIAL PURCHASE AND SALE AGREEMENT (the “Agreement”) is displayed solely to
      demonstrate how negotiated data could be assembled into a readable instrument after all
      required professional and regulatory approvals. No person identified below is real, and no
      offer, acceptance, consideration, promise, duty, agency, or contractual relationship is created.
    </p>
    <section class="contract-section">
      <span>1</span>
      <div>
        <h2>Parties; Agreement to Buy and Sell</h2>
        <p>For purposes of this simulation only, the party designated as <strong>Buyer</strong> offers to
        purchase, and the party designated as <strong>Seller</strong> agrees to sell, the fictional
        residential real property commonly described as <strong>${property.address}, ${property.city}</strong>
        (the “Property”), together with those improvements, rights, and appurtenances that an
        attorney-approved production agreement would properly identify.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>2</span>
      <div>
        <h2>Purchase Price; Method of Payment</h2>
        <p>The simulated purchase price is <strong>${money(demoState.offer.price)}</strong>, subject to the
        financing and settlement terms stated below. All figures are illustrative and no funds are
        requested, received, held, transferred, or disbursed by this prototype.</p>
        <div class="contract-term-grid">
          <p><small>Purchase price</small><strong>${money(demoState.offer.price)}</strong></p>
          <p><small>List-price ratio</small><strong>${offerToListPercentage()}</strong></p>
          <p><small>Financing</small><strong>${demoState.offer.financing}</strong></p>
          <p><small>Down payment</small><strong>${demoState.offer.financing === "Cash" ? "Not applicable" : `${demoState.offer.downPayment}%`}</strong></p>
        </div>
      </div>
    </section>
    <section class="contract-section">
      <span>3</span>
      <div>
        <h2>Earnest Money Deposit</h2>
        <p>Buyer’s simulated earnest-money deposit is <strong>${money(demoState.offer.earnestMoney)}</strong>.
        In a lawful production transaction, the governing agreement would identify the authorized
        holder, delivery deadline, approved delivery method, disposition rules, anti-fraud controls,
        and remedies. EscrowLess does not receive, safeguard, direct, or move any deposit in this demo.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>4</span>
      <div>
        <h2>Financing and Contingencies</h2>
        <p>This mock transaction identifies the following selected protections:
        <strong>${escapeHTML(contingencies.join(", ") || "No selected contingencies")}</strong>. The text
        shown here does not define satisfaction, waiver, termination, notice, cure, refund, or remedy
        rights; those matters require jurisdiction-specific language approved by qualified professionals.</p>
        <div class="contract-term-grid">
          <p><small>Seller response requested</small><strong>${formatDate(demoState.offer.responseDate)}</strong></p>
          <p><small>Preferred closing</small><strong>${formatDate(demoState.offer.closingDate)}</strong></p>
          <p><small>Inspection period</small><strong>${contingencies.includes("Home inspection") ? "7 days" : "Not selected"}</strong></p>
          <p><small>Appraisal period</small><strong>${contingencies.includes("Appraisal") ? "14 days" : "Not selected"}</strong></p>
        </div>
      </div>
    </section>
    <section class="contract-section">
      <span>5</span>
      <div>
        <h2>Inspection; Property Condition</h2>
        <p>If the inspection contingency is selected, the prototype assumes a seven-day review period.
        A production agreement would address access, inspection scope, property condition, required
        disclosures, repair requests, credits, acceptance, termination, casualty, and risk of loss.
        This demo makes no representation concerning the Property or any inspection result.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>6</span>
      <div>
        <h2>Title; Conveyance; Settlement</h2>
        <p>The parties’ simulated closing date is <strong>${formatDate(demoState.offer.closingDate)}</strong>.
        A production agreement would specify marketable title standards, permitted exceptions, deed
        form, settlement provider selection, payoff handling, prorations, possession, recording,
        closing costs, and any applicable Virginia requirements. None of those services is performed here.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>7</span>
      <div>
        <h2>Fixtures and Personal Property</h2>
        <p>The simulation currently identifies the following items:
        <strong>${escapeHTML(demoState.offer.includedItems || "No personal property stated")}</strong>.
        Counsel or an authorized real estate professional would determine the proper treatment,
        ownership, condition, conveyance language, and any bill-of-sale requirements.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>8</span>
      <div>
        <h2>Representations; Disclosures; Compliance</h2>
        <p>A production instrument would incorporate all legally required disclosures, representations,
        statutory notices, fair-housing obligations, brokerage disclosures, lead-based-paint provisions
        where applicable, property-owner-association materials, and other required compliance language.
        Their omission from this mockup must not be interpreted as a waiver or statement of law.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>9</span>
      <div>
        <h2>Default; Remedies; Dispute Provisions</h2>
        <p>No default or remedy language is supplied by this prototype. Any provision concerning breach,
        deposit disposition, damages, specific performance, attorney fees, mediation, arbitration,
        venue, governing law, or limitation of liability must be selected and approved through the
        future controlled clause library and qualified legal review.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>10</span>
      <div>
        <h2>Notices; Entire Agreement; Electronic Records</h2>
        <p>A production agreement would define valid notice methods, delivery and receipt, amendments,
        counterparts, electronic records, integration, survival, severability, and all required
        acknowledgments. The public demo cannot transmit a notice, create a record, capture consent,
        or establish an electronic signature.</p>
      </div>
    </section>
    <section class="contract-section contract-nonterm">
      <span>N</span>
      <div>
        <h2>Non-Contractual Buyer Note</h2>
        <p>${escapeHTML(demoState.offer.note || "No separate buyer note was entered.")}</p>
      </div>
    </section>
    <section class="contract-signature-lock">
      <div>
        <span>Buyer signature</span>
        <strong>Disabled in public demo simulation</strong>
      </div>
      <div>
        <span>Seller signature</span>
        <strong>Disabled in public demo simulation</strong>
      </div>
    </section>
  `;

  if (stageIndex < approvedIndex) {
    const negotiationIsActive =
      demoState.stage === "submitted" && demoState.negotiation.history.length > 1;
    contractContinue.textContent = negotiationIsActive ? "Return to negotiation" : "Return to review";
    contractContinue.dataset.action = "";
    contractContinue.dataset.viewLink = negotiationIsActive ? "negotiation" : "review";
    contractContinue.disabled = false;
  } else if (stageIndex < reviewedIndex) {
    contractContinue.textContent = "Mark preview reviewed";
    contractContinue.dataset.action = "review-contract";
    delete contractContinue.dataset.viewLink;
    contractContinue.disabled = false;
  } else {
    contractContinue.textContent = "Contract preview reviewed";
    contractContinue.dataset.action = "review-contract";
    delete contractContinue.dataset.viewLink;
    contractContinue.disabled = true;
  }
}

function renderDeed() {
  const property = getProperty();
  const isClosed = demoState.stage === "closed";
  if (!isClosed) {
    showValidation(
      "The simulated deed is not available yet.",
      ["Complete the closing, recording, and archive milestone before opening the deed preview."],
    );
    goToView("workspace");
    return;
  }

  $("#deedDocument").innerHTML = `
    <div class="contract-watermark">SIMULATED DEED · NOT RECORDABLE · NO CONVEYANCE</div>
    <header class="contract-header deed-header">
      <p>Prepared solely for the EscrowLess public demo</p>
      <h1>Mock Special Warranty Deed</h1>
      <strong>After-closing document preview · Instrument EL-DEMO-1048</strong>
    </header>
    <section class="contract-disclaimer">
      THIS IS NOT A LEGAL DEED. It has not been prepared or approved by an attorney, title company,
      settlement agent, clerk, recorder, or governmental authority. It cannot convey title or be recorded.
    </section>
    <div class="deed-recording-box">
      <p><small>Tax map / parcel</small><strong>DEMO-4216-000</strong></p>
      <p><small>Consideration</small><strong>${money(demoState.offer.price)}</strong></p>
      <p><small>Return to</small><strong>Buyer role · Simulated document vault</strong></p>
    </div>
    <p class="contract-recital">
      THIS MOCK DEED, displayed after the simulated closing, is made between the fictional
      <strong>Seller role</strong>, as Grantor, and the fictional <strong>Buyer role</strong>, as Grantee.
    </p>
    <section class="contract-section">
      <span>1</span>
      <div>
        <h2>Mock Grant and Consideration</h2>
        <p>For the simulated consideration of <strong>${money(demoState.offer.price)}</strong>, Grantor
        would grant and convey to Grantee, subject to attorney-approved exceptions and covenants,
        the real property described below. No consideration is paid and no estate or interest passes.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>2</span>
      <div>
        <h2>Common Address</h2>
        <p><strong>${property.address}, ${property.city}</strong>. A street address is not a legal
        description and is included only to make this fictional document easy to recognize.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>3</span>
      <div>
        <h2>Fictional Legal Description</h2>
        <p>LOT 12, BLOCK B, SAMPLE GROVE SUBDIVISION, as shown on a fictional plat identified as
        “EscrowLess Demonstration Plat No. 1048.” This description is invented, incomplete, and must
        never be used to identify, convey, insure, tax, or record any real property.</p>
      </div>
    </section>
    <section class="contract-section">
      <span>4</span>
      <div>
        <h2>Title and Recording Status</h2>
        <p>The public demo timeline has marked the transaction “closed” solely for demonstration.
        No title examination, deed preparation, execution, acknowledgment, delivery, recording,
        tax assessment, or governmental filing has occurred.</p>
      </div>
    </section>
    <section class="contract-signature-lock deed-signature-lock">
      <div><span>Grantor execution</span><strong>Disabled · no signature captured</strong></div>
      <div><span>Notarial acknowledgment</span><strong>Disabled · no notarization performed</strong></div>
      <div><span>Recording endorsement</span><strong>Disabled · not submitted for recording</strong></div>
    </section>
    <p class="deed-access-note">
      Production access concept: the buyer and specifically authorized seller, attorney, broker,
      title/closing, and administrative roles could receive only the document access permitted by law,
      transaction authority, retention policy, and least-privilege controls.
    </p>
  `;
}

function getMilestoneTaskSet(milestoneId) {
  if (!demoState.providerTaskCompletions[milestoneId]) {
    demoState.providerTaskCompletions[milestoneId] = new Set();
  }
  return demoState.providerTaskCompletions[milestoneId];
}

function getCompletedMilestoneTaskCount(milestoneId) {
  return getMilestoneTaskSet(milestoneId).size;
}

function isMilestoneTaskDone(milestoneId, taskIndex) {
  return getMilestoneTaskSet(milestoneId).has(taskIndex);
}

function isMilestoneTaskReady(milestoneId, taskIndex) {
  return taskIndex === 0 || isMilestoneTaskDone(milestoneId, taskIndex - 1);
}

function areMilestoneTasksComplete(milestoneId) {
  const milestone = milestoneDefinitions[milestoneId];
  return Boolean(milestone) && getCompletedMilestoneTaskCount(milestoneId) >= milestone.steps.length;
}

function getMilestoneNextTask(milestoneId) {
  const milestone = milestoneDefinitions[milestoneId];
  if (!milestone) return null;
  return milestone.steps.find((_, index) => !isMilestoneTaskDone(milestoneId, index)) || null;
}

function runMilestoneTaskProviderCalls(milestoneId, taskIndex) {
  const calls = milestoneTaskProviderCalls[milestoneId]?.[taskIndex] || [];
  calls.forEach(([provider, method]) => {
    sandbox.providers.invoke(provider, method, {
      actor: demoState.role,
      transactionId: "EL-1048-DEMO",
      milestone: milestoneId,
      taskIndex,
      mockOnly: true,
    });
  });
}

function completeProviderTask(milestoneId, taskIndex) {
  const milestone = milestoneDefinitions[milestoneId];
  if (!milestone) return;
  if (isMilestoneTaskDone(milestoneId, taskIndex)) return;
  if (!isMilestoneTaskReady(milestoneId, taskIndex)) {
    showValidation("Complete the prior task first.", [
      "This demo uses a simple status gate so the provider steps stay in order.",
      "Finish the unlocked task above before completing this one.",
    ]);
    return;
  }
  runMilestoneTaskProviderCalls(milestoneId, taskIndex);
  getMilestoneTaskSet(milestoneId).add(taskIndex);
  audit("provider_portal.task.completed", {
    milestone: milestoneId,
    taskIndex: taskIndex + 1,
    taskTitle: milestone.steps[taskIndex][0],
    responsibleRole: milestone.steps[taskIndex][2],
    output: milestoneTaskOutputs[milestoneId]?.[taskIndex] || "Mock status completed.",
  });
  renderMilestone(milestoneId);
  showToast(`${milestone.steps[taskIndex][0]} marked complete. No real provider was contacted.`);
}

function renderMilestonePortal(milestoneId) {
  const milestone = milestoneDefinitions[milestoneId];
  const completed = getCompletedMilestoneTaskCount(milestoneId);
  const total = milestone.steps.length;
  const nextTask = getMilestoneNextTask(milestoneId);
  const blocked = completed < total;
  $("#milestoneProgressPanel").innerHTML = `
    <div>
      <span>${completed}/${total}</span>
      <strong>${blocked ? "Provider tasks still open" : "Provider tasks complete"}</strong>
      <p>${blocked ? "Complete each mock task below to unlock milestone completion." : "The milestone completion button is now unlocked."}</p>
    </div>
    <div class="milestone-progress-bar" aria-label="Provider task completion">
      <span class="progress-${completed}"></span>
    </div>
  `;
  $("#milestonePortalTitle").textContent = `${milestone.owner} task desk`;
  $("#milestonePortalStatus").innerHTML = `
    <p><i>${blocked ? "!" : "✓"}</i><span>${blocked ? "Next required task" : "Ready to advance"}<strong>${nextTask ? nextTask[0] : milestone.completionLabel}</strong></span></p>
    <p><i>D</i><span>Document placeholders<strong>No files are attached yet; status only.</strong></span></p>
    <p><i>A</i><span>Allowed demo actions<strong>Mock complete, audit, explain, and hand off.</strong></span></p>
    <p><i>0</i><span>Real-world boundary<strong>No money, order, policy, report, recording, message, or upload occurs.</strong></span></p>
  `;
}

function renderMilestone(milestoneId = demoState.activeMilestone) {
  const milestone = milestoneDefinitions[milestoneId];
  if (!milestone) return;
  demoState.activeMilestone = milestoneId;
  $("#milestoneEyebrow").textContent = milestone.eyebrow;
  $("#milestoneHeading").textContent = milestone.heading;
  $("#milestoneDescription").textContent = milestone.description;
  $("#milestoneOwner").textContent = milestone.owner;
  $("#milestoneSteps").innerHTML = milestone.steps
    .map(
      ([title, description, responsibleRole], index) => {
        const done = isMilestoneTaskDone(milestoneId, index);
        const ready = isMilestoneTaskReady(milestoneId, index);
        const locked = !done && !ready;
        const output = milestoneTaskOutputs[milestoneId]?.[index] || "Mock status completed.";
        return `
        <article class="${done ? "task-done" : ready ? "task-ready" : "task-locked"}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <div>
            <strong>${title}</strong>
            <p>${description}</p>
            <small class="task-role"><b>Responsible role</b>${responsibleRole}</small>
            <small class="task-output"><b>Mock output</b>${output}</small>
          </div>
          <div class="task-action-stack">
            <i>${done ? "Completed" : locked ? "Locked" : "Ready"}</i>
            <button
              class="provider-step-button"
              data-action="complete-provider-task"
              data-milestone-id="${milestoneId}"
              data-task-index="${index}"
              ${done || locked ? "disabled" : ""}
            >${done ? "Done" : "Mock complete"}</button>
          </div>
        </article>
      `;
      },
    )
    .join("");
  $("#milestoneVisibility").innerHTML = milestone.visibility.map((item) => `<p><i>✓</i>${item}</p>`).join("");
  $("#milestoneHandoffTitle").textContent = milestone.handoffTitle;
  $("#milestoneHandoffBody").textContent = milestone.handoffBody;
  $("#milestoneSafety").textContent = milestone.safety;
  $("#completeMilestone").textContent = milestone.completionLabel;
  $("#completeMilestone").disabled = !areMilestoneTasksComplete(milestoneId);
  renderMilestonePortal(milestoneId);
}

function openMilestone(milestoneId) {
  setDemoRole(milestoneLeadRoles[milestoneId] || demoState.role);
  renderMilestone(milestoneId);
  goToView("milestone");
}

function renderReviewSummary() {
  updateOfferFromForm();
  const contingencies = selectedContingencies();
  $("#reviewSummary").innerHTML = `
    <div class="summary-row"><span>Property</span><strong>${getProperty().address}</strong></div>
    <div class="summary-row"><span>Offer price</span><strong>${money(demoState.offer.price)}</strong></div>
    <div class="summary-row"><span>Financing</span><strong>${demoState.offer.financing} · ${demoState.offer.downPayment}% down</strong></div>
    <div class="summary-row"><span>Earnest money</span><strong>${money(demoState.offer.earnestMoney)}</strong></div>
    <div class="summary-row"><span>Contingencies</span><strong>${contingencies.join(", ") || "None selected"}</strong></div>
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
  $("#nextStep").textContent = demoState.currentStep === 4 ? "Simulate offer submission" : "Continue";
  $("#nextStep").classList.toggle("submit-offer-button", demoState.currentStep === 4);
  updateOfferInsights();
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
  audit("ui.view.opened", { view: name });
  if (name === "review") renderReviewDesk();
  if (name === "negotiation") renderNegotiation();
  if (name === "workspace") renderWorkspace();
  if (name === "contract") renderContract();
  if (name === "deed") renderDeed();
  if (name === "milestone") renderMilestone();
  if (name === "role") renderRoleWorkspace();
  if (name === "features") renderFeatureExplorer();
  if (name === "saved") renderSavedProperties();
  if (name === "tour") renderTour();
  if (name === "seller") renderSellerEstimator();
  if (name === "sellerReview") renderSellerReviewStatus();
  if (name === "contact") renderTurnstileWidget();
}

function renderReviewDesk() {
  const property = getProperty();
  const isApproved = getStageIndex() >= getStageIndex("approved");
  const isAttorney = demoState.role === "attorney" || getStageIndex() >= getStageIndex("accepted");
  $("#reviewRoleLabel").textContent = isAttorney ? "Mock reviewer queue" : "Mock seller offer desk";
  $("#reviewHeading").textContent = isAttorney
    ? isApproved
      ? "Demo package marked approved."
      : "One mock package is ready for review."
    : "One new offer, ready to compare.";
  $("#reviewSubheading").textContent = `${property.address} · ${property.city}`;

  if (isAttorney) {
    $("#reviewDesk").innerHTML = `
      <div class="review-grid">
        <section class="review-panel">
          <div class="review-panel-header">
            <div>
              <p class="eyebrow">Mock package · Demo only</p>
              <h2>Sample purchase agreement preview</h2>
              <p>Browser-only document preview built from sample facts and clauses.</p>
            </div>
            ${isApproved ? '<span class="status-approved">Demo approved</span>' : '<span class="digital-offer-pill">Mock review</span>'}
          </div>
          <div class="compare-grid">
            <div class="compare-item"><span>Purchase price</span><strong>${money(demoState.offer.price)}</strong></div>
            <div class="compare-item"><span>Closing</span><strong>${formatDate(demoState.offer.closingDate)}</strong></div>
            <div class="compare-item"><span>Financing</span><strong>${demoState.offer.financing}</strong></div>
            <div class="compare-item"><span>Earnest money</span><strong>${money(demoState.offer.earnestMoney)}</strong></div>
          </div>
          <div class="attorney-flag">
            <span>!</span>
            <div><strong>Illustrative human review step</strong>The demo flags the included personal-property term to show where future licensed review could occur.</div>
          </div>
          <div class="contingency-tags">
            <span>Inspection · 7 days</span>
            <span>Appraisal · 14 days</span>
            <span>Financing · 21 days</span>
            <span>Virginia demo rules</span>
          </div>
          <div class="review-actions">
            <button class="secondary-button" data-action="return-correction">Return for correction</button>
            <button class="secondary-button" data-action="view-contract">View full contract</button>
            <button class="primary-button" data-action="approve-contract" ${isApproved ? "disabled" : ""}>
              ${isApproved ? "Demo package approved" : "Approve demo package"}
            </button>
          </div>
        </section>
        <aside class="review-panel document-preview">
          <span>Preview · Not a legal form</span>
          <h3>Sample Purchase Agreement Preview</h3>
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
          <button class="secondary-button contract-preview-button" data-action="view-contract">Open populated contract preview</button>
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
            <p class="eyebrow">Mock offer EL-1048</p>
            <h2>${money(demoState.offer.price)}</h2>
            <p>Buyer role · Sample pre-approval metadata · Nothing submitted</p>
          </div>
          <div class="offer-number">${offerToListPercentage()}</div>
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
          <button class="secondary-button" data-action="view-contract">Preview contract</button>
          <button class="primary-button" data-action="accept-offer">Accept and route for review</button>
        </div>
      </section>
      <aside class="review-panel document-preview">
        <span>Structured offer summary</span>
        <h3>What matters at a glance</h3>
        <p>The original submission and every change remain in the audit history.</p>
        <div class="document-highlight">
          <strong>Well-positioned offer</strong>
          <small>Above list price, mock financing data, sample contingencies, and an illustrative 35-day closing.</small>
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
        <button class="secondary-button contract-preview-button" data-action="view-contract">Open populated contract preview</button>
      </aside>
    </div>
  `;
}

function timelineForStage() {
  const currentIndex = getStageIndex();
  return {
    currentIndex,
    stages: transactionFlow.map(([id, title, description, owner], index) => ({
      id,
      title,
      description,
      owner,
      index,
    })),
  };
}

function nextActionForStage() {
  const actions = {
    draft: ["Complete the offer", "Finish the guided questionnaire to start this transaction.", "Continue offer", "offer"],
    submitted: ["Seller response is next", "Compare the simulated offer and choose whether to counter or accept.", "Open seller view", "review"],
    accepted: ["Review the document package", "Inspect the generated terms and resolve the flagged item.", "Open review desk", "review"],
    approved: ["Read the populated contract", "The approved terms are now assembled into a view-only simulated agreement.", "View simulated contract", "contract"],
    contract_reviewed: ["Preview the e-sign handoff", "See signer order, consent, identity, and audit concepts without capturing a signature.", "Open signature workflow", "signatures"],
    signatures: ["Confirm earnest-money status", "Continue to the deposit milestone without payment instructions or fund movement.", "Open earnest money", "earnest"],
    earnest: ["Resolve the inspection contingency", "Coordinate scope, access, findings, requests, and the response deadline.", "Open inspection", "inspection"],
    inspection: ["Track the appraisal", "Follow the lender-controlled independent valuation milestone.", "Open appraisal", "appraisal"],
    appraisal: ["Finish financing", "Satisfy the simulated lender conditions and reach clear-to-close status.", "Open mortgage hub", "financing"],
    financing: ["Clear title requirements", "Track title, payoff, settlement, and exception readiness.", "Open title workflow", "title"],
    title: ["Complete insurance readiness", "Simulate quote comparison, selection, and evidence delivery.", "Open insurance", "insurance"],
    insurance: ["Prepare the closing package", "Coordinate final figures, walkthrough, signing appointment, and funding readiness.", "Open closing preparation", "closing_ready"],
    closing_ready: ["Close, record, and archive", "Complete the last simulated settlement and file-retention steps.", "Simulate final closing", "closed"],
    closed: ["Transaction complete", "Every planned transaction milestone has been simulated from offer through archive.", "View contract", "contract"],
  };
  return actions[demoState.stage] || actions.draft;
}

function renderWorkspace() {
  const property = getProperty();
  const { stages, currentIndex } = timelineForStage();
  const isClosed = demoState.stage === "closed";
  const progress = Math.round((currentIndex / (transactionFlow.length - 1)) * 100);
  const currentStage = getStageDefinition();
  const upcomingStage = transactionFlow[Math.min(currentIndex + 1, transactionFlow.length - 1)];
  $("#workspaceAddress").textContent = `${property.address}`;
  $("#workspaceStatus").textContent = currentStage[1];
  $("#timelineTitle").textContent = isClosed ? "The simulated transaction is complete." : `Next: ${upcomingStage[1]}`;
  $("#progressNumber").textContent = `${progress}%`;
  $("#progressBar").style.width = `${progress}%`;
  $("#timelineList").innerHTML = stages
    .map((stage, index) => {
      const complete = isClosed || (currentIndex > 0 && index <= currentIndex);
      const current = !isClosed && (currentIndex === 0 ? index === 0 : index === currentIndex + 1);
      const stateClass = complete ? "complete" : current ? "current" : "";
      const marker = complete ? "✓" : index + 1;
      const dateLabel = complete ? "Complete" : current ? "Next" : "Pending";
      return `
        <div class="timeline-item ${stateClass}">
          <span class="timeline-marker">${marker}</span>
          <div class="timeline-copy">
            <strong>${stage.title}</strong>
            <small>${stage.description}</small>
            <span class="timeline-role">Responsible: ${stage.owner}</span>
          </div>
          <span class="timeline-date">${dateLabel}</span>
        </div>
      `;
    })
    .join("");

  const nextAction = nextActionForStage();
  $("#nextActionCard").innerHTML = isClosed
    ? `
      <p class="eyebrow">Completed transaction</p>
      <h3>${nextAction[0]}</h3>
      <p>${nextAction[1]}</p>
      <div class="completed-document-actions">
        <button class="primary-button" data-action="view-contract">View Contract</button>
        <button class="secondary-button" data-action="view-deed">View Deed</button>
      </div>
    `
    : `
      <p class="eyebrow">Next action</p>
      <h3>${nextAction[0]}</h3>
      <p>${nextAction[1]}</p>
      <button class="primary-button" data-action="workspace-next" data-destination="${nextAction[3]}">${nextAction[2]}</button>
    `;

  const activities = sandbox.audit.list().slice(0, 8);
  $("#activityList").innerHTML = activities
    .map((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      return `
        <div class="activity">
          <i></i>
          <div>
            <strong>${escapeHTML(entry.action.replaceAll(".", " "))}</strong>
            <small>${escapeHTML(entry.actor)} · ${time} · ${escapeHTML(entry.outcome)}</small>
          </div>
        </div>
      `;
    })
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
  sandbox.memory.clear();
  sandbox.audit.markBoundary("transaction-demo-reset");
  demoState.currentStep = 1;
  demoState.role = "buyer";
  demoState.stage = "draft";
  demoState.activeMilestone = "signatures";
  demoState.validationFocusId = "";
  demoState.negotiation.turn = "seller";
  demoState.negotiation.mode = "edit";
  demoState.negotiation.version = 1;
  demoState.negotiation.history = [];
  demoState.negotiation.draft = null;
  demoState.selectedPropertyId = 1;
  demoState.savedPropertyIds.clear();
  demoState.pendingBuyerAction = "";
  demoState.buyerAgreementAcknowledged = false;
  demoState.sellerAgreementAcknowledged = false;
  demoState.providerTaskCompletions = {};
  demoState.sellerIntakeCompleted = false;
  demoState.buyerIntake = {
    legalName: "",
    email: "",
    phone: "",
    authority: "",
    address: "",
    coBuyers: "",
  };
  demoState.sellerIntake = {
    propertyAddress: "",
    legalName: "",
    email: "",
    phone: "",
    authority: "",
    coOwners: "",
    targetPrice: "",
    sqft: "",
    yearBuilt: "",
    condition: "Updated",
    visitTime: "",
    currentlyListed: "",
  };
  demoState.offer.price = 612000;
  demoState.offer.financing = "Conventional loan";
  demoState.offer.downPayment = "20";
  demoState.offer.earnestMoney = 6000;
  demoState.offer.includedItems = "Kitchen refrigerator, washer, and dryer";
  demoState.offer.note = "We love the natural light and the care you have put into the home.";
  setDefaultDates();
  $("#inspectionContingency").checked = true;
  $("#financingContingency").checked = true;
  $("#appraisalContingency").checked = true;
  $("#homeSaleContingency").checked = false;
  $$(".choice-card").forEach((card) => {
    card.classList.toggle("selected", card.querySelector("input").checked);
  });
  $("#roleSelect").value = "buyer";
  $("#reviewConsent").checked = false;
  [
    "buyerLegalName",
    "buyerEmail",
    "buyerPhone",
    "buyerAuthority",
    "buyerAddress",
    "buyerCoBuyers",
    "sellerPropertyAddress",
    "sellerLegalName",
    "sellerEmail",
    "sellerPhone",
    "sellerAuthority",
    "sellerCoOwners",
    "sellerTargetPrice",
    "sellerSqft",
    "sellerYearBuilt",
    "sellerVisitTime",
    "sellerCurrentlyListed",
    "contactName",
    "contactEmail",
    "contactPhone",
    "contactTopic",
    "contactMessage",
    "contactWebsite",
    "contactBotToken",
    "tourDay",
    "tourTime",
  ].forEach((id) => {
    const field = $(`#${id}`);
    if (field) field.value = "";
  });
  $("#sellerCondition").value = "Updated";
  $("#contactConsent").checked = false;
  setContactStatus("");
  renderOfferProperty();
  renderProperties();
  renderPropertyDetail();
  renderSavedProperties();
  renderSellerReviewStatus();
  renderSellerEstimator();
  updateSavedCount();
  renderStep();
  renderWorkspace();
  renderRoleWorkspace();
  renderFeatureExplorer();
  resetTurnstileWidget();
  goToView("home");
  showToast("The public demo simulation has been reset. No records were stored.");
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (!(event.target instanceof Element)) return;
  if (event.target.closest("a, button, input, select, textarea")) return;
  const actionTarget = event.target.closest('[role="button"][data-action]');
  if (!actionTarget) return;
  event.preventDefault();
  actionTarget.click();
});

document.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  const viewButton = event.target.closest("[data-view-link]");

  if (viewButton) {
    audit("ui.navigation.requested", { destination: viewButton.dataset.viewLink });
    goToView(viewButton.dataset.viewLink);
    return;
  }

  if (!actionButton) return;
  const action = actionButton.dataset.action;
  audit("ui.action.selected", {
    action,
    propertyId: actionButton.dataset.propertyId || null,
  });

  if (action === "home") goToView("home");
  if (action === "back-to-homes") goToView("discover");
  if (action === "back-to-property") goToView("property");
  if (action === "choose-buy") {
    setDemoRole("buyer");
    goToView("discover");
  }
  if (action === "choose-list" || action === "list-property") {
    setDemoRole("seller");
    goToView("seller");
  }
  if (action === "disclosure") $("#disclosureDialog").showModal();
  if (action === "close-disclosure") $("#disclosureDialog").close();
  if (action === "close-info") $("#infoDialog").close();
  if (action === "close-buyer-intake") $("#buyerIntakeDialog").close();
  if (action === "close-agreement") $("#agreementDialog").close();
  if (action === "close-validation") {
    $("#validationDialog").close();
    const focusTarget = demoState.validationFocusId ? $(`#${demoState.validationFocusId}`) : null;
    focusTarget?.focus();
  }
  if (action === "search") {
    const term = $("#propertySearch").value.trim() || "all demo areas";
    sandbox.providers.invoke("listings", "searchListings", {
      actor: "buyer",
      criteria: "public-demo-sample-catalog",
    });
    showToast(`Showing public demo sample results for ${term}. No listing service was searched.`);
  }
  if (action === "explain") openFeature("offers");
  if (action === "filter") {
    actionButton.closest(".filter-row")?.querySelectorAll(".filter").forEach((button) => button.classList.remove("active"));
    actionButton.classList.add("active");
    showToast(`${actionButton.dataset.filter} applied to the three public demo sample homes.`);
  }
  if (action === "more-filters") {
    showInfoDialog({
      eyebrow: "Search feature",
      title: "Expanded property filters",
      body: "The full search would let a buyer refine homes without exposing unnecessary personal data.",
      details: [
        ["Property", "Price, beds, baths, home type, square footage, acreage, age, parking, accessibility, and features."],
        ["Location", "City, ZIP, neighborhood, school preference, commute radius, map area, and flood-zone indicators."],
        ["Transaction", "Days listed, open houses, digital-offer readiness, seller concessions, and closing flexibility."],
        ["Public demo behavior", "This prototype would filter only the fixed local sample catalog."],
      ],
    });
  }
  if (action === "feature-filter") {
    demoState.featureFilter = actionButton.dataset.featureFilter;
    actionButton.closest(".feature-toolbar").querySelectorAll(".filter").forEach((button) => button.classList.remove("active"));
    actionButton.classList.add("active");
    renderFeatureExplorer();
  }
  if (action === "open-feature") openFeature(actionButton.dataset.featureId);
  if (action === "favorite") {
    toggleSavedProperty(actionButton.dataset.propertyId);
  }
  if (action === "view-property") {
    demoState.selectedPropertyId = Number(actionButton.dataset.propertyId);
    demoState.offer.price = getProperty().price + 14000;
    renderPropertyDetail();
    renderOfferProperty();
    goToView("property");
  }
  if (action === "start-offer") {
    beginBuyerRepresentationGate("offer");
  }
  if (action === "tour") beginBuyerRepresentationGate("tour");
  if (action === "continue-buyer-agreement") {
    if (validateBuyerIntake()) {
      sandbox.providers.invoke("identity", "beginVerification", {
        actor: "buyer",
        purpose: demoState.pendingBuyerAction,
        mockOnly: true,
      });
      $("#buyerIntakeDialog").close();
      openAgreement("buyer", "sign");
    }
  }
  if (action === "view-buyer-agreement") openAgreement("buyer", "view");
  if (action === "view-seller-agreement") openAgreement("seller", "view");
  if (action === "mock-sign-agreement") mockSignAgreement();
  if (action === "seller-sign-agreement") {
    if (demoState.sellerIntakeCompleted || validateSellerIntake()) {
      collectSellerIntake();
      openAgreement("seller", "sign");
    }
  }
  if (action === "seller-submit-review") submitSellerForReview();
  if (action === "seller-photo-concept") {
    showInfoDialog({
      eyebrow: "Seller photo workflow",
      title: "Property photo upload is disabled.",
      body: "A production listing intake could accept photos only after secure authentication, consent, malware scanning, metadata handling, storage, access, and retention controls are approved.",
      details: [
        ["Current behavior", "No file picker opens and no local file can be read."],
        ["Future access", "Seller and specifically authorized brokerage or listing roles."],
        ["Review gate", "Photos remain unpublished until ownership, content rights, fair-housing, and broker approval checks pass."],
        ["Provider status", "Document-vault adapter is mock and persistence is disabled."],
      ],
    });
  }
  if (action === "complete-tour") {
    const tourDay = getFieldValue("tourDay");
    const tourTime = getFieldValue("tourTime");
    const messages = [];
    let focusId = "";
    if (!tourDay) {
      messages.push("Choose a sample tour day.");
      focusId ||= "tourDay";
    }
    if (!tourTime) {
      messages.push("Choose a sample time window.");
      focusId ||= "tourTime";
    }
    if (messages.length) {
      showValidation("Choose a tour preference.", messages, focusId);
    } else {
      audit("buyer.tour.request.simulated", {
        propertyId: demoState.selectedPropertyId,
        tourType: getFieldValue("tourType"),
        tourDay,
        tourTime,
      });
      showInfoDialog({
        eyebrow: "Tour workflow simulated",
        title: "No appointment was created.",
        body: "The demo has shown how an agreement-gated tour request could proceed into licensed-agent and property-access coordination.",
        details: [
          ["Property", `${getProperty().address}, ${getProperty().city}`],
          ["Preference", `${tourDay}, ${tourTime}`],
          ["Representation gate", "Mock buyer acknowledgment complete."],
          ["Real-world effects", "No calendar event, access request, message, or showing instruction was created."],
        ],
        actionLabel: "Return to the property",
      });
      $("#infoDialogActions").innerHTML = '<button class="primary-button" data-action="return-to-property">Return to the property</button>';
    }
  }
  if (action === "return-to-property") {
    $("#infoDialog").close();
    goToView("property");
  }
  if (action === "submit-contact") submitContactMessage();
  if (action === "preview-upload") {
    showInfoDialog({
      eyebrow: "Secure-document concept",
      title: "Pre-approval document request",
      body: "In production, a buyer could authorize a lender or approved secure provider to supply proof of financing without exposing the full document to every participant.",
      details: [
        ["Buyer sees", "Requested document type, purpose, recipient, expiration, and sharing permissions."],
        ["Seller sees", "Only the approved status or permitted summary needed to evaluate the offer."],
        ["Production safeguard", "Encrypted upload, malware scanning, access logging, retention controls, and redaction."],
        ["Public demo behavior", "No file picker opens and no file can be read, copied, or transmitted."],
      ],
    });
  }
  if (action === "seller-review") {
    setDemoRole("seller");
    goToView("review");
  }
  if (action === "view-contract") goToView("contract");
  if (action === "view-deed") goToView("deed");
  if (action === "complete-provider-task") {
    completeProviderTask(actionButton.dataset.milestoneId, Number(actionButton.dataset.taskIndex));
  }
  if (action === "edit-contract-terms") {
    demoState.currentStep = 1;
    renderOfferProperty();
    renderStep();
    goToView("offer");
  }
  if (action === "counter-offer") beginCounter("seller");
  if (action === "counter-back") beginCounter(demoState.negotiation.turn);
  if (action === "submit-counter") submitCounter();
  if (action === "accept-counter") {
    demoState.stage = "accepted";
    setDemoRole("attorney");
    renderWorkspace();
    goToView("review");
    showToast(`Negotiated version ${demoState.negotiation.version} accepted. The demo advanced to professional review.`);
  }
  if (action === "accept-offer") {
    demoState.stage = "accepted";
    setDemoRole("attorney");
    renderReviewDesk();
    showToast("Mock offer accepted. No party was contacted; the demo advanced to review.");
  }
  if (action === "return-correction") {
    showInfoDialog({
      eyebrow: "Review workflow",
      title: "Correction request prepared",
      body: "The reviewer would identify the exact issue, explain what must be corrected, assign the responsible role, and preserve the original package unchanged.",
      details: [
        ["Flagged item", "Included personal-property language needs confirmation and approved treatment."],
        ["Assigned role", "Buyer and seller roles review the proposed correction."],
        ["Version control", "The original package remains visible while a corrected version is prepared."],
        ["Public demo behavior", "No party is contacted and no legal document is changed."],
      ],
    });
  }
  if (action === "approve-contract") {
    demoState.stage = "approved";
    renderReviewDesk();
    renderWorkspace();
    showToast("The review is approved. A populated, view-only contract preview is ready.");
  }
  if (action === "review-contract" && getStageIndex() < getStageIndex("contract_reviewed")) {
    demoState.stage = "contract_reviewed";
    renderWorkspace();
    goToView("workspace");
    showToast("Contract preview reviewed. No signature or binding agreement was created.");
  }
  if (action === "workspace-next") {
    const destination = actionButton.dataset.destination;
    if (destination === "offer") {
      renderOfferProperty();
      goToView("offer");
    } else if (destination === "review") {
      if (demoState.stage === "submitted") {
        if (demoState.negotiation.history.length > 1) {
          setDemoRole(demoState.negotiation.turn);
          goToView("negotiation");
          return;
        }
        setDemoRole("seller");
      } else {
        setDemoRole("attorney");
      }
      goToView("review");
    } else if (destination === "contract") {
      goToView("contract");
    } else {
      openMilestone(destination);
    }
  }
  if (action === "complete-milestone") {
    const milestone = milestoneDefinitions[demoState.activeMilestone];
    if (!milestone) return;
    if (!areMilestoneTasksComplete(demoState.activeMilestone)) {
      showValidation("Complete the provider tasks first.", [
        "Each provider task above must be mock-completed before this stage can unlock the next milestone.",
        "No real vendor, payment, upload, signature, title, insurance, lending, notary, or recording action occurs.",
      ]);
      return;
    }
    (milestoneProviderCalls[demoState.activeMilestone] || []).forEach(([provider, method]) => {
      sandbox.providers.invoke(provider, method, {
        actor: demoState.role,
        transactionId: "EL-1048-DEMO",
        mockOnly: true,
      });
    });
    demoState.stage = milestone.nextStage;
    audit("transaction.milestone.completed", {
      milestone: demoState.activeMilestone,
      nextStage: demoState.stage,
    });
    if (demoState.stage === "closed") {
      setDemoRole("buyer");
    } else {
      const nextMilestone = nextActionForStage()[3];
      setDemoRole(milestoneLeadRoles[nextMilestone] || demoState.role);
    }
    renderWorkspace();
    goToView("workspace");
    showToast(
      demoState.stage === "closed"
        ? "The simulated transaction is closed, recorded, and archived."
        : `${getStageDefinition()[1]} recorded in the public demo timeline.`,
    );
  }
  if (action === "reset-demo") resetDemo();
});

$("#roleSelect").addEventListener("change", (event) => {
  demoState.role = event.target.value;
  audit("role.changed", { role: demoState.role });
  renderRoleWorkspace();
  goToView("role");
});

function refreshOfferInsightsFromForm(event) {
  if (event.target.closest(".choice-card")) {
    event.target.closest(".choice-card").classList.toggle("selected", event.target.checked);
  }
  updateOfferFromForm();
  updateOfferInsights();
}

$("#offerForm").addEventListener("input", refreshOfferInsightsFromForm);
$("#offerForm").addEventListener("change", refreshOfferInsightsFromForm);

$("#sellerIntakeForm").addEventListener("input", () => {
  collectSellerIntake();
  renderSellerEstimator();
});

$("#nextStep").addEventListener("click", () => {
  if (!validateCurrentOfferStep()) return;
  if (demoState.currentStep < 4) {
    audit("buyer.offer.step.completed", { step: demoState.currentStep });
    demoState.currentStep += 1;
    renderStep();
    return;
  }
  updateOfferFromForm();
  const documentResult = sandbox.providers.invoke("documentVault", "storeDocument", {
    actor: "buyer",
    documentType: "mock-offer-package",
    memoryOnly: true,
  });
  demoState.stage = "submitted";
  initializeNegotiation();
  audit("buyer.offer.submission.simulated", {
    propertyId: demoState.selectedPropertyId,
    simulationId: documentResult.simulationId,
    offerPrice: demoState.offer.price,
  });
  goToView("submitted");
});

$("#previousStep").addEventListener("click", () => {
  audit("buyer.offer.step.returned", { step: demoState.currentStep });
  demoState.currentStep = Math.max(1, demoState.currentStep - 1);
  renderStep();
});

setDefaultDates();
renderProperties();
renderPropertyDetail();
renderSavedProperties();
renderOfferProperty();
renderStep();
renderWorkspace();
renderRoleWorkspace();
renderFeatureExplorer();
renderSellerReviewStatus();
renderSellerEstimator();
updateSavedCount();

$("#disclosureDialog").showModal();
