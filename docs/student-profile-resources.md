# Student Profile, Resources, and Documents

The resource library supports URL-owned search, format filters, card results,
and pagination. Document resources use ownership-aware, short-lived access URLs;
video links are supplied only by the trusted resource record.

The resource directory reproduces the administrator resource workspace's
header, advanced filter shell, responsive six-column table, row measurements,
lifecycle badges, pagination, empty state, and route skeleton. Students can
filter by the API-supported type, visibility, date range, and ordering fields.
Publication and owner filters remain server-managed and are never exposed.

Students can edit allowlisted profile fields and upload or delete private career
documents. Files remain private, are limited to API-approved document formats
and sizes, and are never represented by public storage paths. Email and password
changes continue to use their dedicated verified API workflows.

Documents are ordered newest-first. The newest upload is presented as the
primary CV and may be replaced without nesting another form inside the profile
management form. Application submission selects that CV by default, but the
student may choose a different local file. The API revalidates ownership and
copies a saved CV into application storage so later profile changes cannot
invalidate an already submitted application.

The profile workspace mirrors the administrator four-section management form:
identity, education, verified email, and security. University reassignment uses
a dedicated API contract; faculties are reloaded for the selected university
and stale campus links are cleared by the database package.
