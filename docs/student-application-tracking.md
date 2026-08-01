# Student Application Tracking

The application workspace mirrors the administrator opportunity presentation:
type tabs, URL-owned search and status filters, responsive cards, and shared
pagination. Students can inspect only their own job and internship submissions.

Application documents are never exposed as storage keys. A same-origin route
uses the server-held session, the API verifies ownership, and the browser opens
only an HTTPS short-lived URL returned by the API.
