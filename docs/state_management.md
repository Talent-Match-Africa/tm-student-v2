# State Management

Use server components for initial backend data. Use URL parameters for filters,
tabs, ordering, and pagination. Use local component state for menus, dialogs,
pending actions, and unsaved form input.

Do not place tokens or private document URLs in stores. Do not create global
stores for rows or filters owned by one route. Persist only harmless layout
preferences such as sidebar collapse state.
