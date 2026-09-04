#!/usr/bin/env node

import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { investigateAudit } from "../lib/ai-investigator";
import { parseCliArguments } from "../lib/cli-options";
import { createAuditReport, planAudit, type AuditExecution } from "../lib/local-audit";

type PackageFile = { scripts?: Record<string, string> };

function run(command: string, args: string[], cwd: string) {
  return new Promise<{ exitCode: number; output: string }>(resolveRun => {
    const child = spawn(command, args, { cwd, shell: false, stdio: ["ignore", "pipe", "pipe"] });
    let output = "";
    child.stdout.on("data", data => { output += data; process.stdout.write(data); });
    child.stderr.on("data", data => { output += data; process.stderr.write(data); });
    child.on("error", error => resolveRun({ exitCode: 1, output: `${output}\n${error.message}` }));
    child.on("close", code => resolveRun({ exitCode: code ?? 1, output }));
  });
}

async function main() {
  const options = parseCliArguments(process.argv.slice(2));
  const target = resolve(options.target);
  let packageJson: PackageFile;
  try { packageJson = JSON.parse(await readFile(resolve(target, "package.json"), "utf8")) as PackageFile; }
  catch { throw new Error(`No readable package.json found in ${target}.`); }

  const plan = planAudit(packageJson);
  if (!plan.length) throw new Error("No declared test, lint, or build scripts found. Watcher QA will not invent commands.");
  console.log(`\nWatcher QA: auditing ${target}\n`);
  const executions: AuditExecution[] = [];
  for (const step of plan) {
    console.log(`\n→ ${step.command}\n`);
    const result = await run("npm", ["run", step.name], target);
    executions.push({ ...step, ...result });
  }
  const report = createAuditReport(target, executions);
  const reportDir = resolve(target, ".watcher-qa");
  await mkdir(reportDir, { recursive: true });
  const reportPath = resolve(reportDir, "latest-report.json");
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`\nWatcher QA ${report.status.toUpperCase()}: ${report.passed} passed, ${report.failed} failed.`);
  console.log(`Evidence report: ${reportPath}`);
  if (options.ai && report.status === "failed") {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) throw new Error("--ai requires OPENAI_API_KEY. Your key is used only for this local investigation and is never written to the report.");
    console.log("\n→ AI investigation (sending audit evidence only; no files will be changed)\n");
    const proposal = await investigateAudit(report, apiKey);
    const proposalPath = resolve(reportDir, "latest-proposal.md");
    await writeFile(proposalPath, proposal, "utf8");
    console.log(`Proposed fix: ${proposalPath}`);
  }
  process.exitCode = report.status === "passed" ? 0 : 1;
}

main().catch(error => { console.error(`Watcher QA error: ${error instanceof Error ? error.message : String(error)}`); process.exitCode = 1; });
