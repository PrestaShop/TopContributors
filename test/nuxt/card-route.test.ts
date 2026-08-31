import { beforeAll, describe, expect, it, vi } from 'vitest'
import overallHandler from '~~/server/routes/card/[login].get'
import variantHandler from '~~/server/routes/card/[login]/[variant].get'

// Skip real network for avatars — the handler tolerates fetch failures and
// falls back to the initial-letter tile.
beforeAll(() => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(null, { status: 500 }))))
})

const invokeOverall = (login: string, ranking?: string) => {
  const path = `/card/${login}.svg${ranking ? `?ranking=${ranking}` : ''}`
  const event = {
    path,
    context: { params: { login: `${login}.svg` } },
    node: { res: { setHeader: () => {} } },
  } as unknown as Parameters<typeof overallHandler>[0]
  return overallHandler(event) as Promise<string>
}

const invokeVariant = (login: string, variant: string) => {
  const event = {
    path: `/card/${login}/${variant}.svg`,
    context: { params: { login, variant: `${variant}.svg` } },
    node: { res: { setHeader: () => {} } },
  } as unknown as Parameters<typeof variantHandler>[0]
  return variantHandler(event) as Promise<string>
}

describe('card route — ranking variants', () => {
  it('flat path defaults to the overall variant when no query param is given', async () => {
    const svg = await invokeOverall('Progi1984')
    expect(svg).toContain('>RANK<')
    expect(svg).toContain('PRs merged')
    expect(svg).toContain('PRs opened')
    expect(svg).toContain('Reviews')
    expect(svg).toContain('Issues opened')
    expect(svg).not.toMatch(/class="row-v row-v--hi"/)
  })

  it('flat path unknown ranking values fall back to overall (no crash, no highlight)', async () => {
    const svg = await invokeOverall('Progi1984', 'bogus')
    expect(svg).toContain('>RANK<')
    expect(svg).not.toMatch(/class="row-v row-v--hi"/)
  })

  it('nested reviewer variant swaps the badge label and promotes the Reviews row', async () => {
    const svg = await invokeVariant('Progi1984', 'reviewer')
    expect(svg).toContain('>REVIEWER<')
    const highlighted = svg.match(/row-l row-l--hi">([^<]+)</)?.[1]
    expect(highlighted).toBe('Reviews')
  })

  it('nested qa variant shows the QA reviews row and picks up the QA rank', async () => {
    const svg = await invokeVariant('Progi1984', 'qa')
    expect(svg).toContain('>QA<')
    expect(svg).toContain('QA reviews')
    expect(svg).toContain('#3')
  })

  it('nested author variant reads its rank from top_pullrequests.json', async () => {
    const svg = await invokeVariant('Progi1984', 'author')
    expect(svg).toContain('>AUTHOR<')
    const highlighted = svg.match(/row-l row-l--hi">([^<]+)</)?.[1]
    expect(highlighted).toBe('PRs merged')
  })

  it('nested issues variant highlights Issues opened', async () => {
    const svg = await invokeVariant('Progi1984', 'issues')
    expect(svg).toContain('>ISSUES<')
    const highlighted = svg.match(/row-l row-l--hi">([^<]+)</)?.[1]
    expect(highlighted).toBe('Issues opened')
  })

  it('nested unknown variant falls back to overall', async () => {
    const svg = await invokeVariant('Progi1984', 'bogus')
    expect(svg).toContain('>RANK<')
    expect(svg).not.toMatch(/class="row-v row-v--hi"/)
  })

  it('renders a dash when the contributor is missing from the variant ranking', async () => {
    const svg = await invokeVariant('Progi1984', 'reviewer').catch(() => '')
    expect(svg).toContain('>REVIEWER<')
    expect(svg).toMatch(/#\d+|—/)
  })
})
