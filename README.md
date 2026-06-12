# EscrowLess Public Demo

This directory is the isolated, public EscrowLess demonstration environment.
It permits temporary mock edits in browser memory so visitors can explore the
workflow, but contains no backend, database, production Supabase connection,
authentication, account creation, form transmission, persistent storage, file
upload, email, messaging, payment, escrow, or binding-contract capability.

Public deployment: https://escrowless.net

Vercel fallback: https://escrowless-public-demo.vercel.app

Open `index.html` directly in a browser, or serve this folder with any simple static web server.

## Demo paths

### Buyer

1. Choose Buy a Property and save or open a sample home.
2. Start a tour or offer and complete the temporary buyer intake.
3. Review the supplied buyer brokerage agreement and use the nonbinding
   mock-acknowledgment control.
4. Schedule a mock tour or complete the guided offer.
5. Negotiate unlimited buyer/seller counteroffers and route agreed terms to
   simulated professional review.
6. Open the populated purchase contract and follow every stakeholder milestone
   through the non-recordable mock deed.

### Seller

1. Choose List a Property.
2. Complete the temporary seller intake.
3. Review the supplied seller brokerage agreement now or continue to the
   simulated broker-review screen and review it later.
4. See the ownership, disclosure, representation, licensing, and broker
   approval gates that prevent listing activation.

Visitors can also save sample homes, view both agreements, explore stakeholder
roles, and preview a contact workflow. The contact adapter sends nothing.

The prototype uses sample data and does not contain legally valid forms or live
third-party integrations.

## Safety model

- `demo-config.js` applies a single fail-closed policy that denies every
  real-world effect.
- `demo-safety.js` refuses to load if the public-demo environment, mock-only
  policy, or disabled feature set is changed.
- `sandbox-platform.js` provides mock adapter contracts and a redacted,
  in-memory audit trail without exposing internal configuration controls.
- The Content Security Policy blocks connections, form actions, frames, workers, and plugins.
- Transaction controls use mock data. The only mutable state exists temporarily in JavaScript memory and disappears on refresh.
- Persistent top and bottom notices plus an entry dialog display the full demo disclosure.
- The supplied buyer and seller agreement text is view-only, carries a
  conspicuous nonbinding overlay, and cannot capture or apply a signature.

## Production separation

This directory must never be repurposed into production by changing individual
flags. A production system must be a separate private application and
deployment created only after licensing, broker, legal, security, vendor,
privacy, and compliance approvals. Internal provider and environment controls
are intentionally absent from this repository and deployment.
