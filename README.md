# Watcher QA

Human-in-the-loop QA engineering platform for finding bugs, validating fixes, and creating reviewable pull requests.

## Product flow

1. Install the GitHub App on selected repositories.
2. Queue an audit pinned to a commit SHA.
3. An isolated worker runs allowed checks and returns evidence.
4. An agent proposes a patch and tests.
5. A human approves that exact patch.
6. Watcher QA creates a branch and pull request; GitHub CI verifies it.

## Run it on your project now

From this repository, point the QA command at any local Node.js project. Watcher QA runs only the `test`, `lint`, and `build` scripts that the target project's own `package.json` declares. It does not invent shell commands or modify source code.

```bash
git clone https://github.com/AravindBarfa20/QA-Agent.git
cd QA-Agent
npm install
npm run qa -- /absolute/path/to/your-project
```

For example, to audit the project in the current folder:

```bash
npm run qa -- .
```

The command streams test output and writes an evidence report to:

```text
/absolute/path/to/your-project/.watcher-qa/latest-report.json
```

If one check fails, the command exits non-zero but still writes the complete report. The command is deliberately read-only except for that report directory.

For an opt-in AI investigation of a failed report, set your own key only in the terminal session and add `--ai`. The audit evidence is sent to OpenAI with non-persistent API storage; no source code is modified.

```bash
OPENAI_API_KEY="your-key" npm run qa -- /absolute/path/to/your-project --ai
```

## Dashboard setup

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
