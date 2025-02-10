export function percentageToNumber(str: string): number {
  let newStr = str;
  newStr = str.replace("%", "");
  newStr = str.replace(",", ".");
  return Number.parseFloat(newStr);
}
