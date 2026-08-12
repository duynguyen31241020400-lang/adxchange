# Security baseline

## Prototype

- Mock authentication only
- No sensitive production data
- No real payment or payout
- Role routing is UX simulation, not a security boundary

## Production backend requirements

- Argon2id password hashing
- Email verification and expiring single-use reset tokens
- Server-managed sessions in Secure, HttpOnly, SameSite cookies
- Authentication + RBAC + resource ownership checks on every protected API
- CSRF controls for state-changing cookie-authenticated requests
- Restricted CORS, HTTPS and security headers (CSP, HSTS, nosniff, Referrer-Policy)
- Rate limiting for auth and public forms
- Server-side validation for all inputs
- Signed object-storage uploads with MIME/size validation
- Audit logs for privileged actions
- Admin MFA in the operations phase
