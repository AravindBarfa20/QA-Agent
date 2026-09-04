# Watcher QA

Standalone human-in-the-loop QA engineering platform. It is deliberately separate from the original Watcher incident demo.

## Product flow

1. Install the GitHub App on selected repositories.
2. Queue an audit pinned to a commit SHA.
3. An isolated worker runs allowed checks and returns evidence.
4. An agent proposes a patch and tests.
5. A human approves that exact patch.
6. Watcher QA creates a branch and pull request; GitHub CI verifies it.

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:5180. The dashboard never exposes credential values.

## Required production integrations

- GitHub App: repository metadata/contents read, pull-requests write only after approval, checks read.
- Persistent database: Postgres/managed SQLite. Do not use Vercel `/tmp` for audit history.
- Isolated worker: separate non-root Docker/Kubernetes job runner with CPU/memory/time limits, a read-only checkout, restricted network, and a short-lived installation token.

`GITHUB_APP_PRIVATE_KEY`, `GITHUB_WEBHOOK_SECRET`, and `QA_RUNNER_TOKEN` belong only in a deployment secret manager—never the browser, git, or API output.
