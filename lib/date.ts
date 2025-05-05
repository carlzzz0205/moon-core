/**
 * 计算时间差并格式化为 xd xh xm xs 格式
 * @param {number} startTime - 开始时间戳（毫秒）
 * @param {number} endTime - 结束时间戳（毫秒）
 * @returns {string} - 格式化后的字符串，例如 "1d2h30m45s"
 */
export function formatTimeDiff(startTime: number, endTime: number): string {
  const secondsTotal = Math.abs(endTime - startTime);

  const days = Math.floor(secondsTotal / (24 * 60 * 60));
  if (days > 0) return `${days}d`;

  const hours = Math.floor((secondsTotal % (24 * 60 * 60)) / 3600);
  if (hours > 0) return `${hours}h`;

  const minutes = Math.floor((secondsTotal % 3600) / 60);
  if (minutes > 0) return `${minutes}m`;

  const seconds = secondsTotal % 60;
  return `${seconds}s`;
}
