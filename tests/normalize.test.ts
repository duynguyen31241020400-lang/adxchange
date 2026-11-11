import { describe, expect, it } from 'vitest'
import { normalizeSearchText, slugify } from '../src/lib/normalize'

describe('normalizeSearchText', () => {
  it('strips vietnamese diacritics', () => {
    expect(normalizeSearchText('Quảng cáo')).toBe('quang cao')
    expect(normalizeSearchText('Nguyễn Kim')).toBe('nguyen kim')
    expect(normalizeSearchText('đăng báo')).toBe('dang bao')
  })

  it('collapses spaces and lowercases', () => {
    expect(normalizeSearchText('  RoadShow   LED ')).toBe('roadshow led')
  })
})

describe('slugify', () => {
  it('builds url slug', () => {
    expect(slugify('Quảng cáo ngoài trời')).toBe('quang-cao-ngoai-troi')
  })
})
