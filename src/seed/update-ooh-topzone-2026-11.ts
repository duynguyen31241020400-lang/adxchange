/**
 * One-off content update (2026-11-13, August's request), safe to re-run:
 * - "Khai trương TopZone": unpublished (back to draft, not deleted). Its photos
 *   (Drive "Activation Tràng Thi") show Nguyễn Kim branding, not TopZone.
 * - "OOH LED Đại lễ 30/4/2025" (Nguyễn Kim): cover + gallery replaced with the 15 photos
 *   from Drive folder "OOH LED Nguyễn Kim - 30-4-2025" (1eawTdxSOq1vVLG-Xz7x3u31Tii_vwTIj).
 *
 * Expects the JPGs in seed-media/ooh-30-4/ (gitignored).
 * Run: npx tsx --env-file=.env.local src/seed/update-ooh-topzone-2026-11.ts && pnpm publish-media
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { loadSeedEnv } from './loadEnv'

loadSeedEnv()

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const dir = path.join(root, 'seed-media/ooh-30-4')

// Gallery order (cover first) and alt text, from looking at each photo.
const photos: [number, string][] = [
  [10, 'Màn hình LED Nguyễn Kim "Mừng Đại lễ 50 năm, tung đại deal đến 50%" ven sông Sài Gòn giữa pháo hoa'],
  [2, 'Toàn cảnh sông Sài Gòn về đêm với màn LED Nguyễn Kim bên bờ sông'],
  [8, 'Màn LED Nguyễn Kim ven sông Sài Gòn phản chiếu đỏ trên mặt nước'],
  [11, 'Màn LED "Đến Nguyễn Kim ngay" trong đêm pháo hoa mừng 50 năm Thống nhất'],
  [15, 'Thông điệp Mừng Đại lễ 50 năm, tung đại deal đến 50% nhìn từ trên cao Quận 1'],
  [9, 'Màn LED Nguyễn Kim nhìn từ trên cao giữa các tòa nhà ven sông'],
  [6, 'Màn hình Nguyễn Kim bên sông Sài Gòn về đêm'],
  [13, 'Quận 1 đêm 30/4 nhìn từ trên cao, các tòa nhà sáng đèn và pháo hoa'],
  [5, 'Màn LED Nguyễn Kim giữa các tòa nhà cao tầng ven sông'],
  [4, 'Các tòa nhà Quận 1 sáng đèn đỏ đêm Đại lễ 30/4'],
  [7, 'Biểu diễn trên sông Sài Gòn đêm Đại lễ 30/4'],
  [12, 'Người dân xem pháo hoa ven sông Sài Gòn'],
  [3, 'Người dân mặc áo cờ đỏ sao vàng xem lễ mừng 50 năm Thống nhất'],
  [14, 'Đám đông người dân chờ xem pháo hoa đêm 30/4'],
  [1, 'Trụ sở UBND TP.HCM lên đèn đêm Đại lễ 30/4/2025'],
]

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config')
const payload = await getPayload({ config })

const bySlug = async (slug: string) =>
  (await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true }))
    .docs[0]

const topzone = await bySlug('khai-truong-topzone')
if (topzone && (topzone as { _status?: string })._status !== 'draft') {
  await payload.update({
    collection: 'projects',
    id: topzone.id,
    data: { _status: 'draft', summary: topzone.summary || 'Khai trương TopZone' },
  })
  console.log('topzone unpublished')
}

const ids: (string | number)[] = []
for (const [n, alt] of photos) {
  const name = `nguyen-kim-ooh-30-4-${String(n).padStart(2, '0')}.webp`
  const found = await payload.find({ collection: 'media', where: { filename: { equals: name } }, limit: 1 })
  if (found.docs[0]) {
    ids.push(found.docs[0].id)
    continue
  }
  const data = await sharp(path.join(dir, name.replace('.webp', '.jpg'))).webp({ quality: 82 }).toBuffer()
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: { data, mimetype: 'image/webp', name, size: data.length },
  })
  ids.push(media.id)
  console.log('uploaded', name)
}

// Published read: older draft versions predate the `summary` column.
const ooh = (
  await payload.find({
    collection: 'projects',
    where: { slug: { equals: 'ooh-led-nguyen-kim-dai-le-30-4' } },
    limit: 1,
    depth: 0,
  })
).docs[0]
if (ooh) {
  await payload.update({
    collection: 'projects',
    id: ooh.id,
    data: {
      name: 'OOH LED Đại lễ 30/4/2025',
      clientLabel: 'Nguyễn Kim',
      year: 2025,
      summary:
        ooh.summary ||
        'Quảng cáo trên màn hình LED ven sông Sài Gòn và các tòa nhà Quận 1 đúng đêm pháo hoa mừng 50 năm Thống nhất.',
      coverImage: ids[0],
      gallery: ids.map((id) => ({ image: id })),
      _status: 'published',
    },
  })
  console.log('ooh updated with', ids.length, 'photos')
}
process.exit(0)
