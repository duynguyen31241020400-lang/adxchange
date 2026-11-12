/**
 * One-off content update (2026-11-13), safe to re-run:
 * - nestea-tiktok: summary was the placeholder "[Bối cảnh]" → sentence from the Drive sheet
 * - chuyen-nha-nguyen-kim: cover = ADX livestream studio photo (Drive "Ảnh khác / livestream-studio.png")
 *
 * Run: npx tsx --env-file=.env.local src/seed/update-projects-2026-11.ts && pnpm publish-media
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadSeedEnv } from './loadEnv'

loadSeedEnv()

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config')
const payload = await getPayload({ config })

const bySlug = async (slug: string) =>
  (await payload.find({ collection: 'projects', where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]

const nestea = await bySlug('nestea-tiktok')
if (nestea) {
  await payload.update({
    collection: 'projects',
    id: nestea.id,
    data: { summary: 'Chiến dịch TikTok cho Nestea: 78M+ lượt tiếp cận, 54M+ lượt xem video.' },
  })
  console.log('nestea summary updated')
}

const nha = await bySlug('chuyen-nha-nguyen-kim')
if (nha && !nha.coverImage) {
  const alt = 'Studio livestream của ADX, nơi quay series "Chuyện Nhà" cùng Nguyễn Kim'
  const existing = await payload.find({ collection: 'media', where: { alt: { equals: alt } }, limit: 1 })
  const media =
    existing.docs[0] ||
    (await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: await fs.readFile(path.join(root, 'seed-media/extra/livestream-studio.png')),
        mimetype: 'image/png',
        name: 'livestream-studio.png',
        size: (await fs.stat(path.join(root, 'seed-media/extra/livestream-studio.png'))).size,
      },
    }))
  await payload.update({
    collection: 'projects',
    id: nha.id,
    data: {
      summary: nha.summary || 'Series livestream trò chuyện cùng người nổi tiếng và chuyên gia về chuyện nhà cửa.',
      coverImage: media.id,
      gallery: [{ image: media.id }],
    },
  })
  console.log('chuyen-nha cover set', media.id)
}
process.exit(0)
