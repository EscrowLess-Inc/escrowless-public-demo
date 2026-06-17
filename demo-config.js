"use strict";

window.ESCROWLESS_CONFIG = Object.freeze({
  companyName: "EscrowLess, Inc.",
  environment: "public-demo",
  release: "7.0.0-customer-provider-task-portals",
  demoOnly: true,
  mockDataOnly: true,
  publicDemoOnly: true,
  allowTemporaryMockEdits: true,
  allowMockProviderCalls: true,
  realWorldEffectsDisabled: true,
  features: Object.freeze({
    accountCreation: false,
    authentication: false,
    formSubmission: false,
    recordPersistence: false,
    fileUploads: false,
    emailOrMessaging: false,
    paymentsOrEscrow: false,
    bindingContracts: false,
    supabase: false,
    externalApis: false,
    analytics: false,
  }),
});
