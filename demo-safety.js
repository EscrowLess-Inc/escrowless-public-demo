"use strict";

(() => {
  const config = window.ESCROWLESS_CONFIG;
  const features = config?.features || {};

  if (
    config?.environment !== "public-demo" ||
    config?.publicDemoOnly !== true ||
    config?.demoOnly !== true ||
    config?.mockDataOnly !== true ||
    config?.allowMockProviderCalls !== true ||
    config?.realWorldEffectsDisabled !== true ||
    Object.values(features).some(Boolean)
  ) {
    throw new Error("Public demo safety configuration is invalid.");
  }

  const blocked = () => {
    throw new Error("Network and production operations are disabled in the public demo.");
  };

  for (const name of ["fetch", "XMLHttpRequest", "WebSocket", "EventSource"]) {
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
})();
