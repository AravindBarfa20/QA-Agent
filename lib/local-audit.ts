export type AuditStep = { name: "test" | "lint" | "build"; command: string };
export type AuditExecution = AuditStep & { exitCode: number; output: string };
export type AuditReport = {
  target: string;
  status: "passed" | "failed";
  passed: number;
  failed: number;
  steps: AuditExecution[];
  createdAt: string;
};

export function createAuditReport(target: string, steps: AuditExecution[]): AuditReport {
  const passed = steps.filter(step => step.exitCode === 0).length;
  return {
    target,
    status: passed === steps.length ? "passed" as const : "failed" as const,
    passed,
    failed: steps.length - passed,
    steps,
    createdAt: new Date().toISOString(),
  };
}

export function planAudit(packageJson: { scripts?: Record<string, string> }): AuditStep[] {
  const scripts = packageJson.scripts ?? {};
  const names: AuditStep["name"][] = ["test", "lint", "build"];
  return names.filter(name => Boolean(scripts[name]?.trim())).map(name => ({ name, command: `npm run ${name}` }));
}
