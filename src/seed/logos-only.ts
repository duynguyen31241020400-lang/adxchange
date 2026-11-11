/**
 * Upload seed-media/logos into Payload Media and attach to matching clients
 * with showLogo=true — without wiping projects.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadSeedEnv } from './loadEnv'
import { clientLogoFiles } from './site'

loadSeedEnv()

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const seedMedia = path.join(root, 'seed-media')

type PayloadClient = Awaited<ReturnType<typeof import('payload').getPayload>>

async function uploadFile(
  payload: PayloadClient,
  relativePath: string,
  alt: string,
) {
  const filePath = path.join(seedMedia, relativePath)
  const data = await fs.readFile(filePath)
  const filename = path.basename(relativePath)
  return payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: 'image/png',
      name: filename,
      size: data.byteLength,
    },
    overrideAccess: true,
  })
}

async function main() {
  const { getPayload } = await import('payload')
  const { default: config } = await import('../payload.config')
  const payload = await getPayload({ config })
  const clients = await payload.find({ collection: 'clients', limit: 100, overrideAccess: true })

  for (const [name, file] of Object.entries(clientLogoFiles)) {
    const client = clients.docs.find((c) => c.name === name)
    if (!client) {
      console.warn('Client not found:', name)
      continue
    }
    const media = await uploadFile(payload, file, `Logo ${name}`)
    await payload.update({
      collection: 'clients',
      id: client.id,
      data: { logo: media.id, showLogo: true },
      overrideAccess: true,
    })
    console.log('Updated logo:', name)
  }

  console.log('Done logos-only.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
