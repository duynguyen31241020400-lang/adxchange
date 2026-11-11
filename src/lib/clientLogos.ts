/** Static name → public logo path for brands we have assets for. */
export const clientLogos: Record<string, string> = {
  'Thế Giới Di Động': '/clients/the-gioi-di-dong.png',
  'Điện Máy Xanh': '/clients/dien-may-xanh.png',
  TopZone: '/clients/topzone.png',
  'An Khang': '/clients/an-khang.png',
  'Nguyễn Kim': '/clients/nguyen-kim.png',
  MoMo: '/clients/momo.png',
  Toshiba: '/clients/toshiba.png',
  Samsung: '/clients/samsung.png',
  Castrol: '/clients/castrol.png',
  URC: '/clients/urc.png',
  'Galaxy Cinema': '/clients/galaxy-cinema.png',
  'Thiên Long': '/clients/thien-long.png',
  Philips: '/clients/philips.png',
  'Khải Hoàn Land': '/clients/khai-hoan-land.png',
  'Kim Dental': '/clients/kim-dental.png',
  'LG Clinic': '/clients/lg-clinic.png',
  // Nestlé / Nutrinest — text-only (no asset)
}

export function clientLogoSrc(name: string): string | undefined {
  return clientLogos[name]
}
