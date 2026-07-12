"use strict";

(() => {
  const config = window.ESCROWLESS_CONFIG;
  const features = config?.features || {};
  const productionCapabilities = config?.productionCapabilities || {};
  const approvalGates = config?.approvalGates || {};
  const providers = config?.providers || {};
  const allowedBrowserFeatures = new Set(["publicContactForm"]);
  const originalFetch = window.fetch?.bind(window);

  const hasUnexpectedEnabledFeature = Object.entries(features).some(
    ([feature, enabled]) => enabled === true && !allowedBrowserFeatures.has(feature),
  );

  const hasUnexpectedProviderMode = Object.entries(providers).some(([name, provider]) => {
    if (name === "contactDelivery") {
      return provider?.mode !== "server-smtp" || provider?.credentialState !== "server-only-env";
    }
    return provider?.mode !== "mock" || provider?.credentialState !== "none";
  });

  if (
    config?.environment !== "public-demo" ||
    config?.publicDemoOnly !== true ||
    config?.realWorldEffectsDisabled !== true ||
    config?.demoOnly !== true ||
    config?.mockDataOnly !== true ||
    config?.allowMockProviderCalls !== true ||
    config?.allowLiveContactForm !== true ||
    hasUnexpectedEnabledFeature ||
    Object.values(productionCapabilities).some(Boolean) ||
    Object.values(approvalGates).some(Boolean) ||
    hasUnexpectedProviderMode
  ) {
    throw new Error("Public demo safety configuration is invalid.");
  }

  const blocked = () => {
    throw new Error("Network and production operations are disabled in the public demo.");
  };

  function isAllowedContactRequest(resource, init = {}) {
    try {
      const url = new URL(typeof resource === "string" ? resource : resource?.url, window.location.origin);
      const method = String(init.method || resource?.method || "GET").toUpperCase();
      return (
        originalFetch &&
        method === "POST" &&
        url.origin === window.location.origin &&
        url.pathname === "/api/contact"
      );
    } catch {
      return false;
    }
  }

  try {
    Object.defineProperty(window, "fetch", {
      configurable: false,
      writable: false,
      value: (resource, init = {}) => {
        if (isAllowedContactRequest(resource, init)) {
          return originalFetch(resource, { ...init, credentials: "same-origin" });
        }
        return blocked();
      },
    });
  } catch {
    // The Content Security Policy remains the primary enforcement layer.
  }

  for (const name of ["XMLHttpRequest", "WebSocket", "EventSource"]) {
    try {
      Object.defineProperty(window, name, {
        configurable: false,
        writable: false,
        value: blocked,
      });
    } catch {
      // The Content Security Policy remains the primary enforcement layer.
    }
  }

  try {
    Object.defineProperty(navigator, "sendBeacon", {
      configurable: false,
      writable: false,
      value: () => false,
    });
  } catch {
    // Some browsers do not allow replacing this property.
  }

  document.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );

  document.addEventListener(
    "drop",
    (event) => {
      event.preventDefault();
    },
    true,
  );

  document.addEventListener(
    "change",
    (event) => {
      if (event.target instanceof HTMLInputElement && event.target.type === "file") {
        event.target.value = "";
        throw new Error("File selection is disabled in the public demo.");
      }
    },
    true,
  );

  document.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)) {
      return;
    }
    if (!target.closest("#offerForm")) return;
    window.setTimeout(() => {
      target.dispatchEvent(new Event("input", { bubbles: true }));
    }, 0);
  });
})();
