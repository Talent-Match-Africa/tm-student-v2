# Skeleton Loading

Every data route must have a route-level skeleton matching the final hierarchy,
spacing, grid, controls, card count, pagination position, and responsive
breakpoints. Skeletons contain no fake identities, values, statuses, or signed
links.

Opportunity loading reproduces the admin header, filter shell, type/sidebar
rail, opportunity card grid, and student pagination. Use subtle neutral motion,
one accessible loading announcement, and disable animation for reduced motion.

Counselor loading reproduces the administrator counselor header, filter shell,
responsive table structure, 24-row density, and pagination position. Student
labels and actions replace management controls only after real data loads.

Appointment loading reproduces the administrator header, shared filter shell,
seven-column table, eight-row density, and responsive table breakpoint without
rendering fake participant details or mutation controls.

Resource loading reproduces the administrator header metrics, advanced filter
shell, responsive six-column table, 24-row density, and pagination position
without rendering fake owners, filenames, or access links.

Dashboard loading reproduces the administrator context header, action-shell
position, five overview metrics, operational split, attention list, and outcome
grid without presenting invented counts, identities, or activity.
