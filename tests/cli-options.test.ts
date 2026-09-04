import { describe, expect, it } from "vitest";
import { parseCliArguments } from "../lib/cli-options";

describe("CLI options", () => {
  it("accepts an explicit target and AI opt-in", () => {
    expect(parseCliArguments(["/work/storefront", "--ai"])).toEqual({ target: "/work/storefront", ai: true });
  });

  it("uses the current directory when no target is supplied", () => {
    expect(parseCliArguments([])).toEqual({ target: ".", ai: false });
  });
});
