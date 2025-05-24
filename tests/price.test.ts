import { formatPrice, formatDigitNumber } from "../lib/price";
import { describe, test, expect, it } from "bun:test";

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

describe("formatDigitNumber", () => {
  // 测试普通数字处理
  test("should return integer part for integer number", () => {
    expect(formatDigitNumber(123)).toBe("123");
    expect(formatDigitNumber("456")).toBe("456");
  });

  // 测试小数位数截断
  test("should truncate decimal part to 5 digits", () => {
    expect(formatDigitNumber(123.456789)).toBe("123.45678");
    expect(formatDigitNumber("123.456789")).toBe("123.45678");
  });

  // 测试零值处理
  test("should return zeroFormat when number is zero", () => {
    expect(formatDigitNumber(0)).toBe("--");
    expect(formatDigitNumber(0, { zeroFormat: "0" })).toBe("0");
    expect(formatDigitNumber(0, { zeroFormat: "" })).toBe("");
  });

  // 测试前导零压缩
  test("should compress leading zeros with subscript when >=4", () => {
    expect(formatDigitNumber(0.0000123456)).toBe("0.0₄12345");
    expect(formatDigitNumber(0.000000123456)).toBe("0.0₇12345");
    expect(formatDigitNumber("0.0000123456789")).toBe("0.0₄12345");
  });

  // 测试科学计数法转换
  test("should handle scientific notation", () => {
    expect(formatDigitNumber(1.23e-5)).toBe("0.0₄123");
    expect(formatDigitNumber(1.23e-10)).toBe("0.0₉123");
    expect(formatDigitNumber("1.23e-5")).toBe("0.0₄123");
  });

  // 测试零压缩后的小数截断
  test("should truncate non-zero part after compressed zeros", () => {
    expect(formatDigitNumber(0.0000123456789)).toBe("0.0₄12345");
    expect(formatDigitNumber(0.000000123456789)).toBe("0.0₇12345");
  });

  // 测试无小数部分的情况
  test("should handle numbers without decimal part", () => {
    expect(formatDigitNumber(123)).toBe("123");
    expect(formatDigitNumber("123.")).toBe("123");
  });

  // 测试无有效小数部分的情况
  test("should handle numbers with all zero decimal part", () => {
    expect(formatDigitNumber(123.0)).toBe("123");
    expect(formatDigitNumber("123.000")).toBe("123.000");
  });

  // 测试刚好4个前导零的边界情况
  test("should handle exactly 4 leading zeros", () => {
    expect(formatDigitNumber(0.00001)).toBe("0.0₄1");
    expect(formatDigitNumber("0.00001")).toBe("0.0₄1");
  });

  // 测试不足4个前导零的情况
  test("should not compress less than 4 leading zeros", () => {
    expect(formatDigitNumber(0.00123456)).toBe("0.00123");
    expect(formatDigitNumber("0.00123456")).toBe("0.00123");
  });

  // 测试负数处理
  test("should handle negative numbers", () => {
    expect(formatDigitNumber(-123.456789)).toBe("-123.45678");
    expect(formatDigitNumber("-123.456789")).toBe("-123.45678");
    expect(formatDigitNumber(-0.0000123456)).toBe("-0.0₄12345");
  });

  // 测试大数处理
  test("should handle large numbers", () => {
    expect(formatDigitNumber(1234567890.123456789)).toBe("1234567890.12345");
    expect(formatDigitNumber("1234567890.123456789")).toBe("1234567890.12345");
  });

  // 测试极小科学计数法数字
  test("should handle very small scientific notation", () => {
    expect(formatDigitNumber(1.23e-20)).toBe("0.0₁₉123");
    expect(formatDigitNumber("1.23e-20")).toBe("0.0₁₉123");
  });

  // 测试零压缩后无剩余小数的情况
  test("should handle compressed zeros with no remaining decimal", () => {
    expect(formatDigitNumber(0.00001)).toBe("0.0₄1");
    expect(formatDigitNumber(0.00001)).toBe("0.0₄1");
  });

  // 测试不同的zeroFormat选项
  test("should use custom zeroFormat", () => {
    expect(formatDigitNumber(0, { zeroFormat: "N/A" })).toBe("N/A");
    expect(formatDigitNumber(0, { zeroFormat: "0.0" })).toBe("0.0");
  });

  test("should handle negative numbers correctly", () => {
    expect(formatDigitNumber(-12345)).toBe("-12345");
    expect(formatDigitNumber(-0.123456789)).toBe("-0.12345");
    expect(formatDigitNumber(-0.00000123456789)).toBe("-0.0₅12345");
  });

  test("should handle special numeric values", () => {
    expect(() => formatDigitNumber(NaN as any)).toThrow();
    expect(() => formatDigitNumber(null as any)).toThrow();
    expect(() => formatDigitNumber(undefined as any)).toThrow();
  });
});