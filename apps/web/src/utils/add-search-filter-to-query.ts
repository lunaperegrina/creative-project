export function addSearchFilter(search?: string): string {
  if (!search) return "";

  return `&search=${search}`;
}
