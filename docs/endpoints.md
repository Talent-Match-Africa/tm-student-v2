# Endpoint Integration

Put every API wrapper in its own file under `src/endpoints`. Server wrappers use
`backendJson()` or `backendFormData()`, an explicit access token, and
`cache: "no-store"`.

Browser mutations call same-origin routes. Those handlers use
`createAuthenticatedBackendResponse()` to read httpOnly cookies, retry once
after secure refresh, rotate cookies, normalize errors, and return
`Cache-Control: private, no-store`.

Do not call the database, expose bearer tokens, build API URLs in components,
or display unvalidated backend errors.
