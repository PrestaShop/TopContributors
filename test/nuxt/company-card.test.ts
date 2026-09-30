import { describe, expect, it } from 'vitest'
import { buildCompanyCardSvg } from '~~/server/utils/companyCardSvg'
import type { Company } from '@/types'

const wepika: Company = {
  rank: 24,
  rank_pull_requests: 24,
  name: 'Wepika',
  slug: 'wepika',
  merged_pull_requests: 3,
  merged_pull_requests_by_year: { 2023: 3 },
  pull_requests_percent: 0.01,
  contributions: 4,
  avatar_url: '',
  html_url: 'https://www.wepika.com',
  contributors: ['PrestaEdit'],
  employees: [],
  repositories: { 'PrestaShop': 2, 'example-modules': 1 },
  repositories_by_year: { 'PrestaShop': { 2023: 2 }, 'example-modules': { 2023: 1 } },
}

const statRows = (svg: string) =>
  [...svg.matchAll(/class="row-l">([^<]+)<[\s\S]*?class="row-v" text-anchor="end">([^<]+)</g)].map(m => [m[1], m[2]])

describe('company card', () => {
  it('shows the company own counters and PR rank', () => {
    const svg = buildCompanyCardSvg(wepika, null)
    expect(svg).toContain('>Wepika<')
    expect(svg).toContain('>RANK<')
    expect(svg).toContain('>#24<')
    expect(statRows(svg)).toEqual([
      ['PRs merged', '3'],
      ['Commits', '4'],
      ['Share of all PRs', '0.01%'],
      ['Years active', '1'],
    ])
  })

  it('shows contributors and repositories counts, website and page URL', () => {
    const svg = buildCompanyCardSvg(wepika, null)
    expect(svg).toContain('1 contributor · 2 repos')
    expect(svg).toContain('www.wepika.com')
    expect(svg).toContain('contributors.prestashop-project.org/company/wepika')
  })

  it('splits the bottom bar by repository', () => {
    const svg = buildCompanyCardSvg(wepika, null)
    expect(svg).toContain('PrestaShop')
    expect(svg).toContain('example-modules')
    expect(svg).toContain('clip-bar')
  })

  it('degrades gracefully on older snapshots without repositories', () => {
    const legacy = { ...wepika, repositories: undefined, repositories_by_year: undefined }
    const svg = buildCompanyCardSvg(legacy, null)
    expect(svg).toContain('1 contributor<')
    expect(svg).not.toContain('repos')
  })

  it('shows <0.01% for tiny shares and the initial when there is no logo', () => {
    const svg = buildCompanyCardSvg({ ...wepika, pull_requests_percent: 0 }, null)
    expect(statRows(svg)).toContainEqual(['Share of all PRs', '&lt;0.01%'])
    expect(svg).toMatch(/text-anchor="middle">W</)
  })

  it('escapes company names', () => {
    const svg = buildCompanyCardSvg({ ...wepika, name: 'A&B <Co>' }, null)
    expect(svg).toContain('A&amp;B &lt;Co&gt;')
    expect(svg).not.toContain('<Co>')
  })
})
