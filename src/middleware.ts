import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Payload serves local files at `/api/media/file/*`, which 500s on Netlify
 * (no persistent `media/` disk). Seeded assets live in `public/media/file/`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/api/media/file/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace('/api/media/file/', '/media/file/')
    return NextResponse.rewrite(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/api/media/file/:path*'],
}
