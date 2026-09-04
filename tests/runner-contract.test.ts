import { describe, expect, it } from "vitest";
import { buildRunnerJob } from "../lib/runner-contract";

describe("runner contract", () => {
  it("creates a read-only job for an immutable commit", () => {
    expect(buildRunnerJob({ repository: "acme/storefront", commitSha: "a".repeat(40), runId: "run_123" })).toMatchObject({
      mode: "READ_ONLY",
      network: "RESTRICTED",
      checkout: { ref: "a".repeat(40), readOnly: true },
    });
  });

  it("rejects a mutable branch name as a runner ref", () => {
    expect(() => buildRunnerJob({ repository: "acme/storefront", commitSha: "main", runId: "run_123" })).toThrow("40-character commit SHA");
  });
});
