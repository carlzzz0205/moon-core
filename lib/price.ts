const subscriptMap = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
};

function numberToSubscript(num: number) {
  return String(num)
    .split("")
    .map((digit) => subscriptMap[digit as keyof typeof subscriptMap])
    .join("");
}
function trimDecimal(num: string) {
  const decimalPart = String(parseFloat(String(num))).replace(/0+$/, "");
  return decimalPart;
}

interface FormatDigitNumberOptions {
  zeroFormat?: string;
  suffixZeroLen?: number;
}

/**
 * Formats a number or string into a specific digit format.
 *
 * @param {number | string} num - The number to format. Can be a number or a string representation of a number.
 * @param {FormatDigitNumberOptions} opts - Options for formatting the number.
 * @param {string} opts.zeroFormat - The format to return when the number is zero. Defaults to "--" if not provided.
 * @returns {string} The formatted number as a string.
 */
export function formatDigitNumber(
  num: number | string,
  opts?: FormatDigitNumberOptions,
) {
  if (Number.isNaN(num)) {
    throw new Error("num is valid number");
  }
  const { zeroFormat, suffixZeroLen } = opts || {};
  if (num === 0) return zeroFormat ?? "--";
  // 将科学计数法表示的数字转换为普通小数形式
  num = num.toString().includes("e")
    ? parseFloat(String(num)).toFixed(22)
    : num.toString();
  const decimalIndex = num.indexOf(".");
  if (decimalIndex === -1) {
    return num;
  }
  const decimalPart = num.slice(decimalIndex + 1);
  let zeroCount = 0;
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart[i] === "0") {
      zeroCount++;
    } else {
      break;
    }
  }
  if (zeroCount >= 4) {
    const nonZeroPart = decimalPart.slice(zeroCount);
    const truncatedNonZeroPart = nonZeroPart.slice(0, 5);
    const subscriptZeroCount = numberToSubscript(zeroCount);

    let ret =
      num.slice(0, decimalIndex + 1) +
      `0${subscriptZeroCount}` +
      trimDecimal(truncatedNonZeroPart);
    if (typeof suffixZeroLen === "number") {
      ret.padEnd(zeroCount, "0");
    }

    return ret;
  }

  const [digit, flo] = num.split(".");
  if (!flo) {
    return digit;
  }

  return [digit, flo.slice(0, 5)].join(".");
}

interface FormatPriceParams {
  precision?: number;
  prefix?: string;
}

export function formatPrice(num: number, opts: FormatPriceParams = {}) {
  const { precision = 2, prefix = "" } = opts;
  let ret = "";
  const sym = num > 0 ? "+" : "-";
  num = Math.abs(num);
  if (num >= 1e9) {
    ret = (num / 1e9).toFixed(precision) + "B";
  } else if (num >= 1e6) {
    ret = (num / 1e6).toFixed(precision) + "M";
  } else if (num >= 1e3) {
    ret = (num / 1e3).toFixed(precision) + "K";
  } else {
    ret = num.toFixed(precision).toString();
  }

  return `${sym}${prefix}${ret}`;
}
