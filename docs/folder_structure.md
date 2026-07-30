# Folder Structure

```text
src/
  app/
    api/auth/
    dashboard/
    opportunities/
    applications/
    counselors/
    appointments/
    resources/
    profile/
  components/
    layout/
    shared/
    dashboard/
    opportunities/
    applications/
    counselors/
    appointments/
    resources/
    profile/
  constants/
  endpoints/
    auth/
    student/
  lib/
  types/
```

Keep one React component per file. Keep pure helpers and constants outside
rendering components. Every endpoint wrapper gets its own domain file.
