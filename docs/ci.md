# Student Portal Continuous Integration

## Quality Gate

The `Student Portal CI` workflow runs for pull requests targeting `main`,
pushes to `main`, and manual dispatches. Its stable required-check name is:

```text
Student portal quality gate
```

The gate performs a clean install, lock validation, TypeScript checking,
non-mutating lint, deterministic unit tests, and a production Next.js build
through `npm run ci:check`.

## Main Branch Protection

After the first successful workflow run, protect `main` in GitHub:

1. Require a pull request before merging.
2. Require `Student portal quality gate`.
3. Require branches to be up to date before merging.
4. Require all review conversations to be resolved.
5. Block force pushes and branch deletion.
6. Apply the rules to repository administrators.

Use one required approval when another maintainer is available. A single
maintainer repository can initially use zero required approvals while still
requiring pull requests and the quality gate.

## Security

The workflow has read-only repository permission, pins actions to complete
commit SHAs, and does not persist checkout credentials. It does not receive
staging secrets or read `.env.production`; deployment remains a separate phase.
