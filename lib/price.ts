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

export function formatDigitNumber(num: number | string) {
  if (num === 0) return "--";
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

    return (
      num.slice(0, decimalIndex + 1) +
      `0${subscriptZeroCount}` +
      trimDecimal(truncatedNonZeroPart)
    );
  }

  const [digit, flo] = num.split(".");
  if (!flo) {
    return digit;
  }

  return [digit, flo.slice(0, 5)].join(".");
}
