import { describe, expect, it } from "vitest";
import { approveFix, createQaRun, requestPullRequest } from "../lib/qa-workflow";

describe("QA workflow", () => {
  it("blocks pull request creation before an explicit fix approval", () => {
    const run = createQaRun("acme/storefront", "main");

    expect(() => requestPullRequest(run)).toThrow("explicit human approval");
  });

  it("allows a proposed fix to advance to pull request creation after approval", () => {
    const run = approveFix(createQaRun("acme/storefront", "main"), "qa-bot/fix-cart-total");

    expect(requestPullRequest(run)).toMatchObject({
      status: "PR_REQUESTED",
      branch: "qa-bot/fix-cart-total",
    });
  });
});
