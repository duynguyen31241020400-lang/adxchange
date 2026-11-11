import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'node:crypto'
import { searchContent } from '@/lib/search'

const hits = new Map<string, { count: number; reset: number }>()

function ipHash(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  const salt = process.env.IP_HASH_SALT || 'adx'
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

export async function GET(req: NextRequest) {
  const key = ipHash(req)
  const now = Date.now()
  const bucket = hits.get(key)
  if (!bucket || bucket.reset < now) hits.set(key, { count: 1, reset: now + 60_000 })
  else if (bucket.count >= 30) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
  } else bucket.count += 1

  const q = req.nextUrl.searchParams.get('q') || ''
  if (q.length > 80) {
    return NextResponse.json({ error: 'too_long' }, { status: 400 })
  }
  const results = await searchContent(q, 6)
  return NextResponse.json({ results })
}
