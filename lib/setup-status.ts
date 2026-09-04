export type SetupStatus = {
  githubApp: "configured" | "needs_configuration";
  runner: "configured" | "needs_configuration";
};

export function getSetupStatus(environment: Record<string, string | undefined>): SetupStatus {
  return {
    githubApp: environment.GITHUB_APP_ID && environment.GITHUB_APP_PRIVATE_KEY ? "configured" : "needs_configuration",
    runner: environment.QA_RUNNER_URL ? "configured" : "needs_configuration",
  };
}
