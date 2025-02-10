export function brlToInt(str: string): number {
  let newStr = str;
  newStr = str.replace("R$", "");
  newStr = newStr.replaceAll(".", "");
  newStr = newStr.replace(",", "");
  return Number.parseInt(newStr);
}

export function intToBrl(value: number): string {
  return Number(value / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
