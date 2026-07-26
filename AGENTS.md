<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Talent Match Student Portal Rules

- Read `README.md` and every relevant file in `docs/` before changing the
  project.
- Follow `docs/git.md`. Every changed file requires its own commit.
- Keep one React component per file. Put non-rendering constants and pure
  helpers in dedicated `constants`, `utils`, or `lib` modules.
- Reuse shared form, filter, pagination, feedback, and loading primitives.
- Use server-side session validation for protected routes. Frontend checks do
  not replace API authorization.
- Never store access or refresh tokens in browser storage or expose them
  through `NEXT_PUBLIC_*` variables.
- Production builds use only `.env.production` under the documented
  `production-only` policy.
- Keep student self-service concerns in this repository. Admin, university,
  employer, authentication, API, and database concerns remain in their owning
  projects.
- Add an uncached, unauthenticated process health endpoint only under
  `/api/health/live`; business data endpoints remain authenticated.
- Preserve the deployment ports and domains documented in `docs/deploy.md`.
