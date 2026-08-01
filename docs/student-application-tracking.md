# Student Application Tracking

The application workspace mirrors the administrator applications presentation:
the same header measurements, type rail, filter shell, sidebar, responsive card
grid, empty states, progressive loading, and route skeletons. Search and status
remain URL-owned; only filters supported by the student API are rendered.
Students can inspect only their own job and internship submissions.

The first page is rendered on the server after `requireStudentSession` verifies
the STUDENT role. Further pages pass through the authenticated same-origin
`/api/student/application-feed/[type]` route and are appended without exposing
the access token to client code. Duplicate records are discarded by id.

Application documents are never exposed as storage keys. A same-origin route
uses the server-held session, the API verifies ownership, and the browser opens
only an HTTPS short-lived URL returned by the API.
