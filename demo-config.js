"use strict";

window.ESCROWLESS_CONFIG = Object.freeze({
  companyName: "EscrowLess, Inc.",
  environment: "public-demo",
  demoOnly: true,
  mockDataOnly: true,
  allowTemporaryMockEdits: true,
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
