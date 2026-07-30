# Routing

The protected navigation owns:

- `/dashboard`
- `/opportunities` with job and internship routes
- `/applications` with job and internship routes
- `/counselors`
- `/appointments`
- `/resources`
- `/profile`

`src/proxy.ts` performs the cookie-presence redirect and passes the requested
path to the layout. The layout performs authoritative `/auth/me` validation and
requires `STUDENT`. Root `/` redirects to `/dashboard`.

Filters and pagination belong in URL query state so views are refreshable and
bookmarkable. Never accept external URLs as authentication return targets.
