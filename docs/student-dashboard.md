# Student Dashboard

`/dashboard` server-renders the bounded student aggregate after validating the
active session. It presents profile readiness, recent opportunity counts,
application statuses, upcoming guidance sessions, and recent resources.

Every panel links to its owning workflow. Failures remain inline and do not
expose API internals. The dashboard does not reproduce domain mutation rules or
request unbounded activity feeds.

The student dashboard reproduces the administrator command-center hierarchy:
context header, shared action shell, five-metric overview, operational split,
outcome grid, error treatment, responsive breakpoints, and route skeleton. The
administrator reporting-period control is replaced by student journey
shortcuts because the bounded student aggregate has no date-filter contract.
