import { permanentRedirect } from 'next/navigation'

const known = new Set(['cau-chuyen', 'doi-ngu', 'khach-hang', 'dich-vu', 'cot-moc'])

export default async function AboutSubRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const hash = known.has(slug) ? slug : 'cau-chuyen'
  permanentRedirect(`/gioi-thieu#${hash}`)
}
