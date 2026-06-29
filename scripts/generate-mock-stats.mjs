// Deterministic mock generator for the Top stats leaderboards.
// Reads public/contributors_prs.json, derives plausible counters from existing
// fields (no randomness, no live date) and writes the three ranking files.
// Documents the data contract for the future Traces implementation.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public')
// Mock export date. When wiring real data (Traces, sub-project 2), set this to
// the actual data-export date.
const UPDATED_AT = '2026-06-26'
const TOP_N = 25

const contributors = JSON.parse(
  readFileSync(join(PUBLIC, 'contributors_prs.json'), 'utf8'),
)

const isContributor = v =>
  v !== null && typeof v === 'object' && 'contributions' in v

// Deterministic derivation: functions of existing numbers only.
const derive = (c) => {
  const contributions = Number(c.contributions) || 0
  const merged = Number(c.mergedPullRequests) || 0
  const id = Number(c.id) || 0
  c.reviews = Math.floor(contributions * 0.4) + (id % 50)
  c.issuesOpened = Math.floor(contributions * 0.15) + (id % 30)
  c.pullRequestsOpened = merged + (id % 20)
  return c
}

for (const [key, value] of Object.entries(contributors)) {
  if (isContributor(value)) contributors[key] = derive(value)
}

const buildRanking = (field) => {
  const items = Object.values(contributors)
    .filter(isContributor)
    .map(c => ({
      login: c.login,
      name: c.name || c.login,
      avatar_url: c.avatar_url,
      html_url: c.html_url,
      count: c[field],
    }))
    .sort((a, b) => b.count - a.count || a.login.localeCompare(b.login))
    .slice(0, TOP_N)
    .map((entry, index) => ({ rank: index + 1, ...entry }))
  return { updatedAt: UPDATED_AT, items }
}

const write = (name, data) =>
  writeFileSync(join(PUBLIC, name), JSON.stringify(data, null, 4) + '\n')

write('contributors_prs.json', contributors)
write('top_reviewers.json', buildRanking('reviews'))
write('top_issues.json', buildRanking('issuesOpened'))
write('top_pullrequests.json', buildRanking('pullRequestsOpened'))

console.log('Generated mock stats for', Object.keys(contributors).length, 'contributors')
