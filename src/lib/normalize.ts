/** Normalize Vietnamese text for search: lower case, strip diacritics, collapse spaces. */
export function normalizeSearchText(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

export function slugify(input: string): string {
  return normalizeSearchText(input)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
