# Talent Match Student Portal

The Talent Match V2 student portal owns authenticated student self-service
workflows. It is deployed independently from the public authentication app,
administrator console, university portal, and employer portal.

## Project Boundary

This project will own student profile management, education and experience,
opportunity discovery, applications, appointments, resources, notifications,
and student account settings. Authentication entry and recovery remain in
`../app`; administration remains in `../admin`; all data and authorization come
from `../../api/api`.

The browser must never connect directly to the database or store access and
refresh tokens in browser storage.

## Local Development

```bash
npm install
npm run dev
```

The local portal runs at `http://localhost:4003`. Start from `.env.example` for
local configuration.

## Quality Checks

```bash
npm run lockfile:validate
npm run typecheck
npm run lint
npm run build
```

## Staging Deployment

- Public URL: `https://student.talentmatch.rw`
- Loopback runtime: `127.0.0.1:4102`
- Service: `tmv2-student.service`
- Protected environment:
  `/var/www/tmV2/platform/shared/env/student.env.production`

The app is built as a standalone Next.js artifact and shares only the V2
staging httpOnly cookies with the authentication app and other role portals.
See `docs/deploy.md` for the guarded deployment procedure.

## Documentation

Read `docs/README.md`, `docs/git.md`, and `docs/deploy.md` before changing or
deploying this repository.
