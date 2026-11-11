/** Static brand logo metadata for assets under /public/clients. */
export type ClientLogoMeta = {
  src: string
  /** White / light-on-transparent marks that wash out on cream `--bg`. */
  needsDarkChip?: boolean
}

export const clientLogoMeta: Record<string, ClientLogoMeta> = {
  'Thế Giới Di Động': { src: '/clients/the-gioi-di-dong.png' },
  'Điện Máy Xanh': { src: '/clients/dien-may-xanh.png' },
  TopZone: { src: '/clients/topzone.png' },
  'An Khang': { src: '/clients/an-khang.png' },
  'Nguyễn Kim': { src: '/clients/nguyen-kim.png' },
  MoMo: { src: '/clients/momo.png' },
  Toshiba: { src: '/clients/toshiba.png' },
  Samsung: { src: '/clients/samsung.png' },
  Castrol: { src: '/clients/castrol.png' },
  URC: { src: '/clients/urc.png' },
  'Galaxy Cinema': { src: '/clients/galaxy-cinema.png' },
  'Thiên Long': { src: '/clients/thien-long.png', needsDarkChip: true },
  Philips: { src: '/clients/philips.png' },
  'Khải Hoàn Land': { src: '/clients/khai-hoan-land.png', needsDarkChip: true },
  'Kim Dental': { src: '/clients/kim-dental.png' },
  'LG Clinic': { src: '/clients/lg-clinic.png' },
  // Nestlé / Nutrinest — text-only (no asset)
}

/** @deprecated prefer clientLogoMeta; kept for call sites that only need the path */
export const clientLogos: Record<string, string> = Object.fromEntries(
  Object.entries(clientLogoMeta).map(([name, meta]) => [name, meta.src]),
)

export function clientLogoSrc(name: string): string | undefined {
  return clientLogoMeta[name]?.src
}

export function clientLogoNeedsDarkChip(name: string): boolean {
  return Boolean(clientLogoMeta[name]?.needsDarkChip)
}
