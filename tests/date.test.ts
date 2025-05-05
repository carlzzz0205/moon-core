import { test, expect } from "bun:test";
import { formatTimeDiff } from "../lib/date";

test("format holder date", () => {
  expect(formatTimeDiff(1745470235, 1745470893)).toBe("10m");
});
