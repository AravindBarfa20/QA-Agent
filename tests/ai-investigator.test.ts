import { describe, expect, it } from "vitest";
import { buildInvestigationRequest } from "../lib/ai-investigator";

describe("AI investigator request", () => {
  it("uses a non-persistent request and includes only the audit evidence", () => {
    const request = buildInvestigationRequest({
      target: "/work/storefront",
      status: "failed",
      passed: 1,
      failed: 1,
      createdAt: "2026-09-05T00:00:00.000Z",
      steps: [{ name: "test", command: "npm run test", exitCode: 1, output: "Expected true to be false" }],
    });

    expect(request).toMatchObject({ store: false, model: "gpt-5.2" });
    expect(JSON.stringify(request)).toContain("Expected true to be false");
    expect(JSON.stringify(request)).toContain("Do not apply changes");
  });
});
