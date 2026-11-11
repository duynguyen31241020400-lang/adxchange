import { pageMeta } from '@/lib/seo'

export const metadata = pageMeta({
  title: 'Font check | ADX',
  description: 'Trang nội bộ so sánh font tiêu đề tiếng Việt cho ADX.',
  path: '/dev/font-check',
  noIndex: true,
})

const samples = ['Đi ngang mà không nhìn? Khó lắm.', 'Quảng cáo ngoài trời']

export default function FontCheckPage() {
  return (
    <div className="container space-y-16 pt-28 pb-20">
      <h1 className="text-h1">Font check</h1>
      {[
        { id: '1', label: '1 · Anton' },
        { id: '2', label: '2 · Barlow Condensed' },
        { id: '3', label: '3 · Oswald' },
      ].map((f) => (
        <section key={f.id} data-font={f.id} className="border-t border-[var(--line)] pt-8">
          <p className="text-small mb-4">{f.label}</p>
          <div style={{ fontFamily: 'var(--font-display-family)' }}>
            {samples.map((s) => (
              <p key={s} className="text-h2 mb-4" style={{ fontFamily: 'inherit' }}>
                {/* force display font via parent data-font attribute on html is global; local override: */}
                <span
                  style={{
                    fontFamily:
                      f.id === '1'
                        ? 'var(--font-anton)'
                        : f.id === '2'
                          ? 'var(--font-barlow)'
                          : 'var(--font-oswald)',
                  }}
                >
                  {s}
                </span>
              </p>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
