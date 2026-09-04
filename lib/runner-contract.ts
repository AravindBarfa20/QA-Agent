export type RunnerJob = {
  runId: string;
  repository: string;
  mode: "READ_ONLY";
  network: "RESTRICTED";
  checkout: { ref: string; readOnly: true };
};

export function buildRunnerJob(input: { runId: string; repository: string; commitSha: string }): RunnerJob {
  if (!/^[a-f0-9]{40}$/i.test(input.commitSha)) throw new Error("Runner jobs require a 40-character commit SHA.");
  return {
    runId: input.runId,
    repository: input.repository,
    mode: "READ_ONLY",
    network: "RESTRICTED",
    checkout: { ref: input.commitSha, readOnly: true },
  };
}
