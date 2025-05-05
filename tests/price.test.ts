import { formatPrice } from "../lib/price";
import { test, expect } from "bun:test";

test("format price", () => {
  expect(formatPrice(0.1342232323)).toBe("+0.13");
  expect(formatPrice(0.1342232323, { prefix: "$" })).toBe("+$0.13");
  expect(formatPrice(0.1342232323, { prefix: "$", precision: 4 })).toBe(
    "+$0.1342",
  );
  expect(formatPrice(-0.1342232323, { prefix: "$", precision: 4 })).toBe(
    "-$0.1342",
  );

  expect(formatPrice(-100000, { prefix: "$" })).toBe("-$100.00K");
  expect(formatPrice(-1000000, { prefix: "$" })).toBe("-$1.00M");
});
