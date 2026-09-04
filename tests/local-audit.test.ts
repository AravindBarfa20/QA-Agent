import { describe, expect, it } from "vitest";
import { createAuditReport, planAudit } from "../lib/local-audit";

describe("local audit planning", () => {
  it("runs only declared QA scripts in a predictable order", () => {
    expect(planAudit({ scripts: { build: "next build", test: "vitest run", lint: "eslint .", dev: "next dev" } })).toEqual([
      { name: "test", command: "npm run test" },
      { name: "lint", command: "npm run lint" },
      { name: "build", command: "npm run build" },
    ]);
  });

  it("does not invent commands when a project has no QA scripts", () => {
    expect(planAudit({ scripts: { dev: "vite" } })).toEqual([]);
  });

  it("marks the report as failed when any executed QA step fails", () => {
    const report = createAuditReport("/work/storefront", [
      { name: "test", command: "npm run test", exitCode: 0, output: "all passed" },
      { name: "lint", command: "npm run lint", exitCode: 1, output: "unused variable" },
    ]);

    expect(report).toMatchObject({ status: "failed", target: "/work/storefront", passed: 1, failed: 1 });
  });
});
