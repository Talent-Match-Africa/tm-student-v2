# Staging Deployment

> Public URL: `https://student.talentmatch.rw`
> Source: `https://github.com/talent-ma/tm-student-v2`
> Runtime: `127.0.0.1:4102`

The student portal follows the same immutable release, protected environment,
standalone Next.js, systemd, Nginx, TLS, health, and rollback process as the
deployed auth and admin apps.

## Isolation

- Keep V1 under `/var/www/tm` unchanged.
- Check out this repository at
  `/var/www/tmV2/platform/releases/<release-id>/app/student`.
- Store the real environment only at
  `/var/www/tmV2/platform/shared/env/student.env.production` with mode `600`
  and owner `tmv2:tmv2`.
- Symlink it to the release as `.env.production`.
- Do not place `.env`, `.env.local`, or `.env.production.local` in a release.
- Bind only to `127.0.0.1:4102`.

## Build

```bash
sudo -u tmv2 env NODE_ENV=production APP_ENV=staging ENV_FILE_POLICY=production-only npm --prefix "${release_dir}/app/student" ci --include=dev --no-audit --no-fund
sudo -u tmv2 env NODE_ENV=production APP_ENV=staging ENV_FILE_POLICY=production-only npm --prefix "${release_dir}/app/student" run typecheck
sudo -u tmv2 env NODE_ENV=production APP_ENV=staging ENV_FILE_POLICY=production-only npm --prefix "${release_dir}/app/student" run lint
sudo -u tmv2 env NODE_ENV=production APP_ENV=staging ENV_FILE_POLICY=production-only npm --prefix "${release_dir}/app/student" run build
sudo -u tmv2 install -d -m 750 "${release_dir}/app/student/.next/standalone/.next"
sudo -u tmv2 cp -R "${release_dir}/app/student/.next/static" "${release_dir}/app/student/.next/standalone/.next/static"
sudo -u tmv2 cp -R "${release_dir}/app/student/public" "${release_dir}/app/student/.next/standalone/public"
sudo -u tmv2 install -d -m 750 "${release_dir}/app/student/.next/standalone/.next/cache"
```

Verify `GET /api/health/live` on loopback before adding the public proxy.

## Activation

Install `docs/deployment/tmv2-student.service` as
`/etc/systemd/system/tmv2-student.service`. Install the Nginx template as the
uniquely named `tmv2-student.conf`, test Nginx, and verify V1 before and after
every reload. Issue TLS only after the HTTP loopback proxy succeeds:

```bash
sudo certbot --nginx --redirect -d student.talentmatch.rw
```

Add `https://student.talentmatch.rw` to API CORS and update the auth app's
`NEXT_PUBLIC_STUDENT_APP_URL` before rebuilding the auth app.

## Acceptance

Verify role-based login redirect, protected routes, refresh rotation, logout,
API access, image loading, responsive behavior, and denial of non-student
sessions. Confirm that V1 and all existing V2 services remain healthy.

## Rollback

Move `/var/www/tmV2/platform/current` to the previous complete release and
restart only the V2 services. Never restart or edit V1 services as part of this
portal rollback.
