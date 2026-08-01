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
