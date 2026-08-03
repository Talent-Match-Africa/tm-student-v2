# Student Guidance

Counselor discovery is limited by the API to active counselors belonging to the
student's university. Search and pagination remain in the URL. Booking requires
a counselor, future date, subject, and message; cancellation is confirmed and
the API remains authoritative for ownership and appointment state.

The counselor directory reproduces the administrator counselor workspace's
header, filter shell, responsive table, row measurements, pagination, empty
state, and route skeleton. Administrator-only status, edit, delete, invitation,
and cross-university controls are replaced by student-safe availability and
booking actions. The browser receives no account-management capability.

All mutations pass through authenticated same-origin handlers. Buttons disable
while requests are pending and server-safe feedback remains visible.

The appointments workspace reproduces the administrator appointments header,
filter shell, responsive seven-column table, row density, lifecycle badges,
pagination, empty state, booking dialog, and route skeleton. The visible filter
bar exposes student-safe search and scheduled from/to dates. The Filter dialog
adds lifecycle, schedule scope, and ordering without exposing the administrator
university or cross-user controls. Students may book with counselors from their
university and cancel only their own eligible appointments; administrator
lifecycle and ownership controls are not exposed.
