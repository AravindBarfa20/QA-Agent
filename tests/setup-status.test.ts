import { describe, expect, it } from "vitest";
import { getSetupStatus } from "../lib/setup-status";

describe("setup status", () => {
  it("reports that the GitHub App and runner must be configured without exposing secrets", () => {
    const status = getSetupStatus({ GITHUB_APP_ID: "123", GITHUB_APP_PRIVATE_KEY: "super-secret", QA_RUNNER_URL: "https://runner.example" });

    expect(status).toEqual({ githubApp: "configured", runner: "configured" });
    expect(JSON.stringify(status)).not.toContain("super-secret");
  });

  it("reports missing production integrations", () => {
    expect(getSetupStatus({})).toEqual({ githubApp: "needs_configuration", runner: "needs_configuration" });
  });
});
