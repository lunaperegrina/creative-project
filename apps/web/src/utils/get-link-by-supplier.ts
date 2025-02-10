export function getLinkBySupplier(supplier_id?: string | number): string | undefined {
  if (!supplier_id) return undefined;

  switch (supplier_id.toString()) {
    case "1":
      return "https://www.spotgifts.com.br/fotos/produtos/";
    default:
      return undefined;
  }
}
