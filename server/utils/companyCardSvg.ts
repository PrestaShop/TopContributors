import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createError } from 'h3'
import type { Company } from '../../app/types'
import { companyMembers } from '../../app/composables/useEntityDetail'
import { escapeXml, fetchAvatar, renderCard, type BarSegment } from './cardSvg'

// Repositories have no fixed colour: use the category palette in rank order.
const REPO_COLOURS = ['#7b4fac', '#59af70', '#ffb000', '#5c92aa']

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

const hostOf = (url: string | undefined) => {
  if (!url) return null
  try {
    return new URL(url).hostname
  }
  catch {
    return null
  }
}

// Card with the company's own counters only (PRs credited to it by traces):
// reviews / issues can't be attributed to a company, so they aren't shown.
export const buildCompanyCardSvg = (company: Company, avatarDataUri: string | null): string => {
  const name = escapeXml(company.name)
  const slug = escapeXml(company.slug ?? '')
  const memberCount = companyMembers(company).length
  const repos = company.repositories
  const counts = [plural(memberCount, 'contributor')]
  if (repos) counts.push(plural(Object.keys(repos).length, 'repo'))
  const host = hostOf(company.html_url)
  const share = company.pull_requests_percent

  const bar: BarSegment[] = Object.entries(repos ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, REPO_COLOURS.length)
    .map(([label, value], i) => ({ label, value, colour: REPO_COLOURS[i]! }))

  return renderCard({
    heading: name,
    subLines: [counts.join(' · '), ...(host ? [escapeXml(host)] : [])],
    kind: 'PrestaShop Top Company',
    name,
    initial: escapeXml(company.name.charAt(0).toUpperCase()),
    avatarDataUri,
    rank: (company.rank_pull_requests as number | undefined) ?? company.rank,
    rankLabel: 'RANK',
    rows: [
      { label: 'PRs merged', value: company.merged_pull_requests ?? 0 },
      { label: 'Commits', value: company.contributions ?? 0 },
      { label: 'Share of all PRs', value: share >= 0.01 ? `${share}%` : '&lt;0.01%' },
      { label: 'Years active', value: Object.keys(company.merged_pull_requests_by_year ?? {}).length },
    ],
    bar,
    footer: `contributors.prestashop-project.org/company/${slug}`,
  })
}

let companies: Company[] | null = null
const load = (): Company[] => {
  if (companies) return companies
  const path = resolve(process.cwd(), 'public/topcompanies_prs.json')
  if (!existsSync(path)) throw createError({ statusCode: 500, statusMessage: 'topcompanies_prs.json missing' })
  companies = (JSON.parse(readFileSync(path, 'utf-8')).companies ?? []) as Company[]
  return companies
}

export const renderCompanyCardSvg = async (rawSlug: string): Promise<string> => {
  const slug = rawSlug.replace(/\.svg$/i, '').toLowerCase()
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing company' })
  const company = load().find(c => c.slug?.toLowerCase() === slug)
  if (!company) throw createError({ statusCode: 404, statusMessage: `Company "${slug}" not found` })
  const avatarDataUri = company.avatar_url ? await fetchAvatar(company.avatar_url) : null
  return buildCompanyCardSvg(company, avatarDataUri)
}
