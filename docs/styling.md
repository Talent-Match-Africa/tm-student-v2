# Styling And Admin Parity

Use Tailwind CSS as the primary styling layer and CSS Modules for scoped
geometry. Use Outfit, `#49151A`, and the admin app's exact page gutters,
22-rem sidebar, 5.35-rem collapsed rail, 4.85-rem top navigation, pills,
borders, shadows, responsive breakpoints, and focus treatment.

Opportunity cards must preserve the admin card's owner header, avatar,
availability rail, status badge, title hierarchy, information badges, footer,
motion, and grid measurements. Replace only admin actions with student actions.

Filter workspaces preserve the admin filter shell and sidebar rail. Expose only
fields supported by student API contracts. Pagination uses the admin pill
buttons and page status. Motion uses transform and opacity and respects reduced
motion.
