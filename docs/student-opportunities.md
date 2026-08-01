# Student Opportunities

The opportunity workspace uses `/opportunities/job-listings` and
`/opportunities/internships`, backed by the API `jobs` and `internships`
segments. Initial data is server rendered and audience authorization remains an
API responsibility.

The workspace reproduces the admin header, result badge, filter shell, sticky
type and filter rail, two-column card feed, responsive reductions, progressive
loading, back-to-top control, empty states, and full page skeleton. Student
cards retain the admin geometry while replacing administrative controls with
View details and Apply now.

Supported URL state is page, search, work flexibility, industry sector,
location, lifecycle status, and ordering. Unsupported or unbounded URL values
are discarded before API requests.
