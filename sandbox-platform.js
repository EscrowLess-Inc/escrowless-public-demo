"use strict";

(() => {
  const config = window.ESCROWLESS_CONFIG;
  const MODES = Object.freeze(["mock", "sandbox", "production"]);
  const REDACTED_KEYS = new Set([
    "address",
    "authorization",
    "coowners",
    "email",
    "legalname",
    "message",
    "name",
    "phone",
    "signature",
    "ssn",
    "token",
  ]);

  const providerDefinitions = Object.freeze({
    identity: {
      label: "Identity verification",
      capability: "identityVerification",
      owner: "Identity / KYC vendor",
      methods: ["beginVerification", "getVerificationStatus"],
      mockResult: { status: "mock-verified", assuranceLevel: "simulation-only" },
    },
    listings: {
      label: "MLS and listing data",
      capability: "mlsAccess",
      owner: "MLS / listing-data vendor",
      methods: ["searchListings", "getListing", "publishListing"],
      mockResult: { status: "mock-catalog", listingCount: 3 },
    },
    eSignature: {
      label: "Electronic signature",
      capability: "eSignature",
      owner: "Approved e-signature vendor",
      methods: ["createEnvelope", "getEnvelopeStatus", "voidEnvelope"],
      mockResult: { status: "mock-signed", evidenceCaptured: false },
    },
    documentVault: {
      label: "Document vault",
      capability: "persistentStorage",
      owner: "Secure document-vault vendor",
      methods: ["storeDocument", "listDocuments", "grantDocumentAccess"],
      mockResult: { status: "memory-only", persisted: false },
    },
    earnestMoney: {
      label: "Earnest money deposit",
      capability: "payments",
      owner: "Authorized deposit holder",
      methods: ["createDepositIntent", "getDepositStatus", "cancelDepositIntent"],
      mockResult: { status: "mock-received", fundsMoved: false },
    },
    titleSettlement: {
      label: "Title and settlement",
      capability: "titleOrders",
      owner: "Licensed title / settlement provider",
      methods: ["openTitleOrder", "getTitleStatus", "prepareSettlement"],
      mockResult: { status: "mock-title-clear", orderCreated: false },
    },
    remoteNotary: {
      label: "Remote online notarization",
      capability: "remoteNotarization",
      owner: "Approved remote-notary provider",
      methods: ["checkEligibility", "scheduleNotarization", "getNotarizationStatus"],
      mockResult: { status: "mock-eligible", appointmentCreated: false },
    },
    eClosing: {
      label: "Electronic closing",
      capability: "eClosing",
      owner: "Approved eClosing provider",
      methods: ["prepareClosing", "getClosingStatus", "cancelClosing"],
      mockResult: { status: "mock-ready", closingCreated: false },
    },
    eRecording: {
      label: "Electronic recording",
      capability: "eRecording",
      owner: "Approved eRecording provider",
      methods: ["validatePackage", "submitForRecording", "getRecordingStatus"],
      mockResult: { status: "mock-recorded", submitted: false },
    },
    contactDelivery: {
      label: "Contact message delivery",
      capability: "email",
      owner: "Approved transactional-email provider",
      methods: ["sendContactMessage", "getDeliveryStatus"],
      mockResult: { status: "mock-previewed", delivered: false },
    },
  });

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function deepFreeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.freeze(value);
      Object.values(value).forEach(deepFreeze);
    }
    return value;
  }

  function redact(value, key = "") {
    if (REDACTED_KEYS.has(String(key).toLowerCase())) return "[redacted]";
    if (Array.isArray(value)) return value.map((item) => redact(item));
    if (value && typeof value === "object") {
      return Object.fromEntries(Object.entries(value).map(([childKey, childValue]) => [
        childKey,
        redact(childValue, childKey),
      ]));
    }
    if (typeof value === "string" && value.length > 120) return `${value.slice(0, 117)}...`;
    return value;
  }

  class AuditLog {
    #entries = [];
    #listeners = new Set();

    record(action, details = {}) {
      const previousEntryId = this.#entries.at(-1)?.id || "GENESIS";
      const entry = deepFreeze({
        id: `AUD-${String(this.#entries.length + 1).padStart(4, "0")}`,
        sequence: this.#entries.length + 1,
        previousEntryId,
        timestamp: new Date().toISOString(),
        environment: config.environment,
        action,
        outcome: details.outcome || "simulated",
        actor: details.actor || "demo-user",
        provider: details.provider || null,
        metadata: redact(details.metadata || {}),
      });
      this.#entries.push(entry);
      this.#listeners.forEach((listener) => listener(entry));
      return entry;
    }

    list() {
      return this.#entries.slice().reverse().map(clone);
    }

    markBoundary(reason = "session-boundary") {
      return this.record("audit.session.boundary", {
        actor: "platform",
        metadata: { reason },
      });
    }

    verify() {
      return this.#entries.every((entry, index) => {
        const expectedPrevious = index === 0 ? "GENESIS" : this.#entries[index - 1].id;
        return (
          Object.isFrozen(entry) &&
          entry.sequence === index + 1 &&
          entry.previousEntryId === expectedPrevious
        );
      });
    }

    subscribe(listener) {
      this.#listeners.add(listener);
      return () => this.#listeners.delete(listener);
    }
  }

  class CapabilityGate {
    assertMockProvider(providerKey) {
      const providerConfig = config.providers?.[providerKey];
      if (!providerConfig || providerConfig.mode !== "mock" || providerConfig.credentialState !== "none") {
        throw new Error(`Provider ${providerKey} is not approved for the public demo environment.`);
      }
    }

    assertRealCapabilityDisabled(capability) {
      if (config.productionCapabilities?.[capability] !== false) {
        throw new Error(`Real capability ${capability} must remain disabled.`);
      }
    }

    productionReadiness(capability) {
      return {
        capability,
        enabled: config.productionCapabilities?.[capability] === true,
        approvalsComplete: Object.values(config.approvalGates || {}).every(Boolean),
        credentialsAllowed: false,
        environmentEligible: config.environment === "production",
      };
    }
  }

  class MockProviderAdapter {
    constructor(key, definition, audit, gate) {
      this.key = key;
      this.definition = definition;
      this.audit = audit;
      this.gate = gate;
      this.mode = config.providers[key].mode;
    }

    invoke(method, payload = {}) {
      this.gate.assertMockProvider(this.key);
      this.gate.assertRealCapabilityDisabled(this.definition.capability);
      if (!this.definition.methods.includes(method)) {
        throw new Error(`${method} is not part of the ${this.key} adapter contract.`);
      }

      const simulationId = `MOCK-${this.key.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      this.audit.record(`provider.${this.key}.${method}`, {
        actor: payload.actor || "demo-user",
        provider: this.key,
        metadata: {
          simulationId,
          payloadFields: Object.keys(payload).filter((key) => key !== "actor"),
          realCapabilityEnabled: false,
          transmitted: false,
          persisted: false,
        },
      });
      return Object.freeze({
        provider: this.key,
        providerLabel: this.definition.label,
        mode: "mock",
        simulationId,
        transmitted: false,
        persisted: false,
        binding: false,
        ...clone(this.definition.mockResult),
      });
    }
  }

  class ProviderRegistry {
    #adapters = new Map();

    constructor(audit, gate) {
      Object.entries(providerDefinitions).forEach(([key, definition]) => {
        this.#adapters.set(key, new MockProviderAdapter(key, definition, audit, gate));
      });
    }

    invoke(providerKey, method, payload = {}) {
      const adapter = this.#adapters.get(providerKey);
      if (!adapter) throw new Error(`Unknown provider adapter: ${providerKey}`);
      return adapter.invoke(method, payload);
    }

    statuses() {
      return Object.entries(providerDefinitions).map(([key, definition]) => ({
        key,
        label: definition.label,
        owner: definition.owner,
        capability: definition.capability,
        methods: [...definition.methods],
        mode: config.providers[key].mode,
        credentialState: config.providers[key].credentialState,
        realCapabilityEnabled: config.productionCapabilities[definition.capability] === true,
      }));
    }
  }

  class MemoryTransactionStore {
    #state = new Map();

    set(key, value) {
      this.#state.set(key, clone(value));
      return this.get(key);
    }

    get(key) {
      return this.#state.has(key) ? clone(this.#state.get(key)) : null;
    }

    delete(key) {
      this.#state.delete(key);
    }

    clear() {
      this.#state.clear();
    }
  }

  const audit = new AuditLog();
  const gate = new CapabilityGate();
  const providers = new ProviderRegistry(audit, gate);
  const memory = new MemoryTransactionStore();

  audit.record("platform.session.started", {
    actor: "platform",
    metadata: {
      release: config.release,
      providerCount: providers.statuses().length,
      networkAllowed: false,
      persistenceAllowed: false,
    },
  });

  window.EscrowLessSandbox = Object.freeze({
    MODES,
    audit,
    gate,
    providers,
    memory,
    getEnvironmentStatus() {
      return {
        environment: config.environment,
        release: config.release,
        demoOnly: config.demoOnly,
        mockDataOnly: config.mockDataOnly,
        productionCapabilities: clone(config.productionCapabilities),
        approvalGates: clone(config.approvalGates),
        providers: providers.statuses(),
      };
    },
  });
})();
