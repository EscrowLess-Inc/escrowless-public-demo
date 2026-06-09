# EscrowLess Public Demo

This directory is the isolated, public, read-only EscrowLess demo environment.
It uses fixed mock data and contains no backend, database, production Supabase
connection, authentication, account creation, form transmission, persistent
storage, file upload, email, messaging, payment, escrow, or binding-contract
capability.

Public deployment: https://escrowless-public-demo.vercel.app

Open `index.html` directly in a browser, or serve this folder with any simple static web server.

## Demo path

1. Open a sample home.
2. Create a digital offer.
3. Complete the four guided steps.
4. Simulate submitting the prototype offer.
5. Switch to the seller review.
6. Accept and route the package to attorney review.
7. Approve the package.
8. Open **My transaction** to see the shared timeline and audit history.

The prototype uses sample data and does not contain legally valid forms or live
third-party integrations.

## Safety model

- `demo-config.js` defines the environment and keeps every production feature disabled.
- `demo-safety.js` fails closed if a feature is enabled and blocks browser network APIs and form submission.
- The Content Security Policy blocks connections, form actions, frames, workers, and plugins.
- Transaction controls use fixed mock data. The only mutable state exists temporarily in JavaScript memory and disappears on refresh.
- Persistent top and bottom notices plus an entry dialog display the full demo disclosure.

## Production separation

This directory must never be repurposed into production by changing individual
flags. A production system should be a separate application and deployment,
created only after the approvals listed in `ENVIRONMENT_POLICY.md` are complete.
