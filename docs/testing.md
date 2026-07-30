# Testing

Required checks are:

```bash
npm run lockfile:validate
npm run typecheck
npm run lint
npm run test
npm run build
```

Test session-required, expired, refreshed, revoked, and wrong-role behavior.
Test safe return paths and safe error normalization. Feature tests cover
loading, empty, filtered-empty, error, pagination, validation, duplicate click,
conflict, rate-limit, and responsive interaction states.

End-to-end acceptance covers opportunity discovery and application, application
tracking, appointment booking and cancellation, resource access, private
documents, profile changes, logout, and denial of non-student sessions.
