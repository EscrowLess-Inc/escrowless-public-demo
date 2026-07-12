# EscrowLess Public Demo

This directory is the isolated, public EscrowLess demonstration environment.
It permits temporary mock edits in browser memory so visitors can explore the
workflow, but contains no backend, database, production Supabase connection,
authentication, account creation, persistent storage, file upload, payment,
escrow, or binding-contract capability. The only live backend capability is the
server-side contact endpoint at `/api/contact`, which sends basic contact-form
messages to `info@escrowless.net` and stores no submissions.

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
5. Review mock market guidance, live offer-strength scoring, and transparent
   EscrowLess fee estimates based on the tranche model.
6. Negotiate unlimited buyer/seller counteroffers and route agreed terms to
   simulated professional review.
7. Open the populated purchase contract and follow every stakeholder milestone
   through provider task portals, safe mock completion gates, and the
   non-recordable mock deed.

### Seller

1. Choose List a Property.
2. Complete the temporary seller intake.
3. Review the supplied seller brokerage agreement now or continue to the
   simulated broker-review screen and review it later.
4. See the ownership, disclosure, representation, licensing, and broker
   approval gates that prevent listing activation.

Visitors can also save sample homes, view both agreements, explore stakeholder
roles, mock-complete vendor/service-provider tasks, preview listing-price
guidance, and send a basic contact message to EscrowLess. The contact form is
not a secure document portal and must not be used for sensitive financial,
legal, identity, escrow, or transaction information.

The prototype uses sample data and does not contain legally valid forms or live
third-party integrations.

## Safety model

- `demo-config.js` applies a single fail-closed policy that denies every
  real-world effect except the narrow live contact-form email endpoint.
- `demo-safety.js` refuses to load if the public-demo environment, mock-only
  policy, disabled feature set, or contact-form exception is changed outside
  the approved shape.
- `sandbox-platform.js` provides mock adapter contracts and a redacted,
  in-memory audit trail without exposing internal configuration controls.
- The Content Security Policy allows same-origin `connect-src 'self'` only so
  the browser can call `/api/contact`; form actions, frames, workers, and
  plugins remain blocked.
- Transaction controls use mock data. The only mutable state exists temporarily in JavaScript memory and disappears on refresh.
- Persistent top and bottom notices plus an entry dialog display the full demo disclosure.
- The supplied buyer and seller agreement text is view-only, carries a
  conspicuous nonbinding overlay, and cannot capture or apply a signature.
- The contact endpoint validates input server-side, rejects unexpected fields,
  uses a honeypot, applies in-memory rate limits, sends via SMTP credentials
  stored only in Vercel environment variables, and logs only minimal metadata.

## Live contact form

Production browser path:

```text
Visitor browser
-> https://escrowless.net/api/contact
-> Vercel serverless function
-> Namecheap Private Email SMTP over TLS/SSL
-> info@escrowless.net
```

The browser-facing endpoint is same-origin and relative: `/api/contact`. No
Vercel preview URL or `vercel.app` URL is hard-coded into the frontend.

### Required Vercel environment variables

Create these manually in Vercel. Use Sensitive Environment Variables where
available.

```text
CONTACT_SMTP_USER=info@escrowless.net
CONTACT_SMTP_PASSWORD=[Namecheap Private Email mailbox password or app-specific SMTP credential]
```

Optional:

```text
CONTACT_SMTP_HOST=mail.privateemail.com
CONTACT_SMTP_PORT=465
CONTACT_SMTP_DISABLE_587_FALLBACK=false
CONTACT_BOT_PROVIDER=turnstile
CONTACT_BOT_SECRET=[Turnstile secret key]
```

If `CONTACT_BOT_PROVIDER` and `CONTACT_BOT_SECRET` are omitted, the contact form
uses server-side validation, rate limiting, and a honeypot only. A future
Turnstile or hCaptcha widget will require a frontend widget token and CSP
updates for that provider.

### Local test plan

1. Do not add real secrets to source code.
2. Install dependencies locally only if needed: `npm install`.
3. Start a local Vercel dev server.
4. Without env vars, submit the form and confirm it fails gracefully without
   exposing backend details.
5. With local test env vars set outside the repo, submit a harmless test message
   and confirm it reaches `info@escrowless.net`.
6. Test invalid email, missing consent, an overlong message, and the hidden
   honeypot field.

### Production test plan

1. Add the required Vercel env vars manually.
2. Deploy only after review and approval.
3. Open `https://escrowless.net` and use the normal Contact navigation path.
4. Submit a harmless test message using a non-sensitive body.
5. Confirm receipt at `info@escrowless.net`.
6. Confirm the reply-to address is the submitted user email.
7. Submit a second test to an alias-like scenario only after the direct
   `info@escrowless.net` path works.
8. Confirm the website, property flow, offer strength, and saved-property
   interactions still work.

### Rollback

If the contact form causes trouble:

1. Revert the deployment to the previous Vercel deployment.
2. Or remove the Vercel env vars so SMTP cannot send.
3. Or revert the commit that added `/api/contact`, the contact frontend changes,
   and the CSP `connect-src 'self'` change.
4. No DNS rollback is required; this implementation does not alter Vercel
   domain routing, Namecheap nameservers, A records, CNAME records, MX records,
   SPF, DKIM, or DMARC.

### Phase 2 encryption design

Phase 2 is intentionally not implemented yet. The approved design should:

- Generate an offline public/private keypair outside GitHub, Vercel, Codex, and
  the application code.
- Store only the public encryption key in the backend environment.
- Encrypt the validated message payload server-side before email delivery.
- Keep the private key offline and under EscrowLess control.
- Provide a separate decryption workflow for authorized EscrowLess recipients.
- Avoid storing plaintext message bodies in logs, databases, or durable queues.

## Production separation

This directory must never be repurposed into production by changing individual
flags. A production system must be a separate private application and
deployment created only after licensing, broker, legal, security, vendor,
privacy, and compliance approvals. Internal provider and environment controls
are intentionally absent from this repository and deployment.
