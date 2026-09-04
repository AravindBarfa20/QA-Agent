export function parseCliArguments(arguments_: string[]) {
  const ai = arguments_.includes("--ai");
  const target = arguments_.find(value => value !== "--ai") ?? ".";
  return { target, ai };
}
