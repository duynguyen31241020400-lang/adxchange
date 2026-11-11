import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path') || '/'
  const secret = searchParams.get('secret')
  if (secret !== process.env.PAYLOAD_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }
  const payload = await getPayload({ config })
  // ensure payload boots
  void payload
  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
