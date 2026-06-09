# EscrowLess Public Demo

This directory is the isolated, public EscrowLess demonstration environment.
It permits temporary mock edits in browser memory so visitors can explore the
workflow, but contains no backend, database, production Supabase connection,
authentication, account creation, form transmission, persistent storage, file
upload, email, messaging, payment, escrow, or binding-contract capability.

Public deployment: https://escrowless.net

Vercel fallback: https://escrowless-public-demo.vercel.app

Open `index.html` directly in a browser, or serve this folder with any simple static web server.

## Demo path

1. Open a sample home.
2. Create a digital offer.
3. Complete the four guided steps.
4. Simulate submitting the prototype offer.
5. Switch to seller review and create, accept, or return counteroffers.
6. Route agreed terms to the reviewer and open the populated textual contract.
7. Follow task-level role responsibilities through every milestone.
8. Complete the simulated closing and open the non-recordable mock deed.

The prototype uses sample data and does not contain legally valid forms or live
third-party integrations.

## Safety model

- `demo-config.js` defines the environment and keeps every production feature disabled.
- `demo-safety.js` fails closed if a feature is enabled and blocks browser network APIs and form submission.
- The Content Security Policy blocks connections, form actions, frames, workers, and plugins.
- Transaction controls use mock data. The only mutable state exists temporarily in JavaScript memory and disappears on refresh.
- Persistent top and bottom notices plus an entry dialog display the full demo disclosure.

## Production separation

This directory must never be repurposed into production by changing individual
flags. A production system should be a separate application and deployment,
created only after the approvals listed in `ENVIRONMENT_POLICY.md` are complete.
