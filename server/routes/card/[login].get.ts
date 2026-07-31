import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineEventHandler, getRouterParam, setHeader, createError } from 'h3'
import type { Contributor } from '../../../app/types'

const escapeXml = (s: string) =>
  s.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

interface Ranking { updatedAt: string, items: { rank: number, login: string, count: number }[] }
interface Cache {
  data: Record<string, Contributor>
  // Top Contributors ranking (aggregate contributions) — mirrors the derivation
  // in app/pages/index.vue where rank = 1-based index into the natural order
  // of contributors_prs.json. Not to be confused with top_pullrequests.json
  // which ranks PR authors only.
  rankByLogin: Map<string, number>
  reviewsByLogin: Map<string, number>
  issuesByLogin: Map<string, number>
  openedByLogin: Map<string, number>
}

const readRanking = (file: string) => {
  const path = resolve(process.cwd(), 'public', file)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as Ranking
  }
  catch {
    return null
  }
}

const indexBy = (r: Ranking | null, field: 'rank' | 'count') => {
  const m = new Map<string, number>()
  const items = Array.isArray(r?.items) ? r.items : []
  for (const it of items) {
    // Production ranking files occasionally carry summary/entries lacking a
    // login (e.g. aggregate rows). Skip them rather than 500'ing the card.
    if (!it || typeof it.login !== 'string' || !it.login) continue
    m.set(it.login.toLowerCase(), it[field])
  }
  return m
}

let cache: Cache | null = null
const load = (): Cache => {
  if (cache) return cache
  const contribPath = resolve(process.cwd(), 'public/contributors_prs.json')
  if (!existsSync(contribPath)) throw createError({ statusCode: 500, statusMessage: 'contributors_prs.json missing' })
  const data = JSON.parse(readFileSync(contribPath, 'utf-8')) as Record<string, Contributor>

  // Per-dimension counts live in the top_*.json ranking files; the raw
  // contributor JSON only carries merged PRs reliably. Read once, index by
  // lowercased login for case-insensitive lookup.
  const pulls = readRanking('top_pullrequests.json')
  const reviewers = readRanking('top_reviewers.json')
  const issues = readRanking('top_issues.json')

  // Top Contributors rank is derived from the natural order of
  // contributors_prs.json (already sorted by aggregate contributions in
  // Traces), same as app/pages/index.vue does at runtime. `updatedAt` is a
  // sibling metadata key on the same object, so skip it during enumeration.
  const rankByLogin = new Map<string, number>()
  let rank = 0
  for (const [k, v] of Object.entries(data)) {
    if (k === 'updatedAt' || !v || typeof v !== 'object' || !('login' in v)) continue
    rank += 1
    rankByLogin.set(k.toLowerCase(), rank)
  }

  cache = {
    data,
    rankByLogin,
    openedByLogin: indexBy(pulls, 'count'),
    reviewsByLogin: indexBy(reviewers, 'count'),
    issuesByLogin: indexBy(issues, 'count'),
  }
  return cache
}

// Categories share the chart legend palette from the contributor detail page
// (purple = merged/primary, green = reviews, orange = issues, ocean = extra).
const CAT_COLORS: Record<string, string> = {
  core: '#7b4fac',
  modules: '#59af70',
  themes: '#ffb000',
  documentation: '#5c92aa',
  tests: '#decde7',
  specs: '#bde9c9',
  tools: '#a4dbe8',
  blog: '#f8e08e',
  others: '#bbbbbb',
}
const OTHER_COLOR = '#5e5e5e'

// Avatar fetch — download once per contributor per process, base64-embed so
// the SVG stays self-contained (GitHub camo blocks external <image href>
// requests from within a README-embedded SVG).
const avatarCache = new Map<string, Promise<string | null>>()
const fetchAvatar = (url: string): Promise<string | null> => {
  const cached = avatarCache.get(url)
  if (cached) return cached
  const p = (async () => {
    try {
      const sized = url.includes('?') ? `${url}&s=96` : `${url}?s=96`
      const res = await fetch(sized)
      if (!res.ok) return null
      const buf = Buffer.from(await res.arrayBuffer())
      const type = res.headers.get('content-type') ?? 'image/jpeg'
      return `data:${type};base64,${buf.toString('base64')}`
    }
    catch {
      return null
    }
  })()
  avatarCache.set(url, p)
  return p
}

// Rank medal tint — matches the site's rank chip colours (TopSectionView).
const medalColour = (rank?: number) => {
  if (rank === 1) return '#ffd999'
  if (rank === 2) return '#eeeeee'
  if (rank === 3) return '#e7bd94'
  return '#decde7'
}

const buildStatRow = (label: string, value: number | string, y: number, W: number) => `  <text x="24" y="${y}" class="row-l">${escapeXml(label)}</text>
  <line x1="140" y1="${y - 4}" x2="${W - 40}" y2="${y - 4}" stroke="#3f3f3d" stroke-width="1" stroke-dasharray="1 4"/>
  <text x="${W - 24}" y="${y}" class="row-v" text-anchor="end">${value}</text>`

const buildBreakdownBar = (
  categories: Contributor['categories'] | undefined,
  x: number, y: number, w: number, h: number,
) => {
  const entries = Object.entries(categories ?? {})
    .map(([k, v]) => [k, typeof v === 'object' && v ? v.total : 0] as const)
    .filter(([, n]) => n > 0)
  const total = entries.reduce((s, [, n]) => s + n, 0)
  if (!total) return `  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="#3f3f3d"/>`
  entries.sort((a, b) => b[1] - a[1])
  let offset = 0
  const segs: string[] = []
  const legend: string[] = []
  for (const [k, n] of entries.slice(0, 4)) {
    const sw = Math.max(2, Math.round((n / total) * w))
    const colour = CAT_COLORS[k.toLowerCase()] ?? OTHER_COLOR
    segs.push(`<rect x="${x + offset}" y="${y}" width="${sw}" height="${h}" fill="${colour}"/>`)
    legend.push(`<tspan fill="${colour}">■</tspan> ${escapeXml(k)}`)
    offset += sw
  }
  return `  <g>
    <clipPath id="clip-bar"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/></clipPath>
    <g clip-path="url(#clip-bar)">${segs.join('')}</g>
    <text x="${x}" y="${y + h + 14}" class="legend">${legend.join('  ')}</text>
  </g>`
}

export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'login') ?? ''
  const login = decodeURIComponent(raw).replace(/\.svg$/i, '')
  if (!login) throw createError({ statusCode: 400, statusMessage: 'Missing login' })
  const { data, rankByLogin, reviewsByLogin, issuesByLogin, openedByLogin } = load()
  let c = data[login]
  if (!c) {
    const lower = login.toLowerCase()
    const key = Object.keys(data).find(k => k.toLowerCase() === lower)
    if (key) c = data[key]
  }
  if (!c || typeof c !== 'object' || !('login' in c)) {
    throw createError({ statusCode: 404, statusMessage: `Contributor "${login}" not found` })
  }

  const W = 560
  const H = 260
  const name = escapeXml(c.name || c.login)
  const login2 = escapeXml(c.login)
  const lk = c.login.toLowerCase()
  const rank = c.rank ?? rankByLogin.get(lk)
  const rankTxt = rank ? `#${rank}` : '—'
  const medal = medalColour(rank)
  const merged = c.mergedPullRequests ?? 0
  const opened = c.pullRequestsOpened ?? openedByLogin.get(lk) ?? 0
  const reviews = c.reviews ?? reviewsByLogin.get(lk) ?? 0
  const issues = c.issuesOpened ?? issuesByLogin.get(lk) ?? 0
  const repoCount = c.repositories ? Object.keys(c.repositories).length : 0
  const avatarDataUri = c.avatar_url ? await fetchAvatar(c.avatar_url) : null

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="PrestaShop Top Contributor: ${name}">
  <title>PrestaShop Top Contributor — ${name}</title>
  <style>
    .mono { font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace; }
    .name { font: 700 20px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #ffffff; }
    .sub { font: 400 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #bbbbbb; }
    .tag { font: 400 12px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #decde7; }
    .val { font: 700 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #decde7; }
    .row-l { font: 400 13px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #dddddd; }
    .row-v { font: 700 15px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #ffffff; }
    .legend { font: 400 10px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #bbbbbb; }
    .foot { font: 400 11px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; fill: #5e5e5e; }
  </style>
  <rect width="${W}" height="${H}" rx="10" fill="#1d1d1b" stroke="#3f3f3d"/>
  <rect x="0" y="0" width="${W}" height="3" fill="#7b4fac"/>

  ${avatarDataUri
    ? `<defs><clipPath id="clip-avatar"><rect x="20" y="22" width="56" height="56" rx="28"/></clipPath></defs>
  <image x="20" y="22" width="56" height="56" clip-path="url(#clip-avatar)" href="${avatarDataUri}" preserveAspectRatio="xMidYMid slice"/>
  <rect x="20" y="22" width="56" height="56" rx="28" fill="none" stroke="#3f3f3d"/>`
    : `<rect x="20" y="22" width="56" height="56" rx="28" fill="#3f3f3d" stroke="#5e5e5e"/>
  <text x="48" y="58" class="mono" fill="#decde7" font-size="26" font-weight="700" text-anchor="middle">${login2.charAt(0).toUpperCase()}</text>`}

  <text x="90" y="44" class="name">${login2}</text>
  <text x="90" y="62" class="sub">${name}</text>
  <text x="90" y="78" class="sub">${repoCount} repo${repoCount === 1 ? '' : 's'}</text>

  <g transform="translate(${W - 24 - 108}, 22)">
    <rect width="108" height="56" rx="6" fill="${medal}"/>
    <text x="14" y="24" fill="#1d1d1b" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="10" font-weight="700" letter-spacing="1.6">RANK</text>
    <text x="98" y="44" fill="#1d1d1b" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="26" font-weight="700" text-anchor="end">${rankTxt}</text>
  </g>

${buildStatRow('PRs merged', merged, 118, W)}
${buildStatRow('PRs opened', opened, 140, W)}
${buildStatRow('Reviews', reviews, 162, W)}
${buildStatRow('Issues opened', issues, 184, W)}

${buildBreakdownBar(c.categories, 24, 208, W - 48, 6)}

  <text x="${W / 2}" y="${H - 10}" class="foot" text-anchor="middle">$ contributors.prestashop-project.org/contributor/${login2}</text>
</svg>`

  setHeader(event, 'content-type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return svg
})
