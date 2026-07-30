# Security

Every protected render validates the session with `/auth/me` and requires the
`STUDENT` role. Proxy checks improve navigation only; API guards remain the
authorization authority.

Access and refresh tokens use httpOnly, SameSite Lax, path-wide cookies and
secure transport in production. Tokens, private storage keys, signed document
URLs, passwords, OTPs, and raw API failures must never enter logs, browser
storage, public environment variables, analytics, or metadata.

Same-origin mutation handlers refresh once after `401`. Logout revokes the
backend session before clearing both cookies. Authentication return paths must
be local, non-API paths. Private data responses are uncached.
