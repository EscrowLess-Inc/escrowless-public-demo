# EscrowLess Environment Policy

## Public demo

The `public-demo` environment is presentation-only. Every capability that could
create a real-world effect is disabled:

- Account creation and authentication
- Form submission and record persistence
- File uploads
- Email, SMS, chat, and notifications
- Payments, earnest money, escrow, and disbursement
- Binding contract or legal-document generation
- Supabase and all external API connections
- Analytics or tracking

The public demo may use temporary in-memory state solely to advance the mock
screens. Refreshing the browser resets that state.

## Future production

A future production application must be a separate environment, repository
configuration, database, deployment, and domain target. Production features may
be enabled only after documented approval for every applicable category:

1. Brokerage entity and state licensing
2. Principal or supervising broker
3. Real estate and document-generation counsel
4. MLS, IDX, VOW, and association-form rights
5. Agency, compensation, advertising, fair-housing, and RESPA policies
6. Title, escrow, attorney, lender, inspection, appraisal, notary, and e-sign vendors
7. Privacy, security, retention, incident response, and vendor agreements
8. Payment, trust-account, wire-fraud, and reconciliation controls
9. Insurance, including E&O and cyber coverage
10. Written release approval from legal, compliance, brokerage supervision, and the CEO

No production secret, key, URL, database identifier, or vendor credential may
be added to the public-demo deployment.
