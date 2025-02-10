export function measureToNumber(str: string): number {
  let newStr = str;
  newStr = str.replace(" cm", "");
  newStr = newStr.replaceAll(".", "");
  newStr = newStr.replace(",", ".");
  return Number.parseFloat(newStr);
}
