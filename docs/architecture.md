# Architecture

Protected pages are server rendered. The root layout calls
`requireStudentSession()` and supplies only the safe public profile to the
workspace shell. Server endpoint wrappers call the API with the httpOnly access
cookie; browser mutations call same-origin route handlers that refresh and
retry once after `401`.

Use these boundaries:

- `src/app`: routes, layouts, loading, and same-origin handlers.
- `src/endpoints/student`: one backend endpoint wrapper per file.
- `src/components/shared`: portal-wide visual primitives.
- `src/components/<feature>`: feature presentation and interaction.
- `src/lib`: session, API, errors, environment, and reusable helpers.
- `src/types`: frontend API contracts.

Server data stays server-side until required for rendering. Client components
own interaction state only.
