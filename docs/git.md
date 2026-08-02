# Git Rules

> Status: Mandatory
> Scope: Student portal repository

Run commands from `app/student` and use repository-relative paths.

Every changed file must have its own commit. Commit messages must be
imperative, specific, and describe the single file being committed.

```bash
git add "src/app/page.tsx"
git commit -m "Build the student workspace entry page"
```

Never commit `.env`, `.env.local`, `.env.production`, secrets, `.next`,
`node_modules`, logs, coverage, imported private data, or build output.

Inspect `git status --short` before and after work. Never revert unrelated
changes or rewrite history without explicit approval. AI agents must not run
`git add`, `git commit`, or `git push` unless the user explicitly requests it
in the current turn.
