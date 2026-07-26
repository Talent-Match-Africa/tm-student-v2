# Student Portal Documentation

- `deploy.md`: isolated staging build, activation, validation, and rollback.
- `git.md`: mandatory one-file-per-commit workflow.
- `deployment/environment.production.template`: protected staging environment.
- `deployment/tmv2-student.service`: hardened systemd unit.
- `deployment/nginx/student.talentmatch.rw.conf`: loopback reverse proxy.

Keep architecture, security, component, routing, testing, and workflow
documentation in this directory as the student portal is implemented.
