/**
 * Upload seed-media/logos into Payload Media and attach to matching clients
 * with showLogo=true — without wiping projects.
 */
import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../payload.config'
import { clientLogoFiles } from './site'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const seedMedia = path.join(root, 'seed-media')

async function uploadFile(
  payload: Awaited<ReturnType<typeof getPayload>>,
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
    console.log('Updated', name, '→ media', media.id)
  }

  console.log('Done.')
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
