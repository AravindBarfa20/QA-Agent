export type QaRunStatus = "QUEUED" | "RUNNING" | "AWAITING_APPROVAL" | "APPROVED" | "PR_REQUESTED" | "COMPLETED" | "FAILED";

export type QaRun = {
  repository: string;
  baseBranch: string;
  status: QaRunStatus;
  branch: string | null;
};

export function createQaRun(repository: string, baseBranch: string): QaRun {
  return { repository, baseBranch, status: "AWAITING_APPROVAL", branch: null };
}

export function approveFix(run: QaRun, branch: string): QaRun {
  if (run.status !== "AWAITING_APPROVAL") throw new Error("Only a proposed fix can be approved.");
  return { ...run, status: "APPROVED", branch };
}

export function requestPullRequest(run: QaRun): QaRun {
  if (run.status !== "APPROVED" || !run.branch) throw new Error("Pull request creation requires explicit human approval.");
  return { ...run, status: "PR_REQUESTED" };
}
