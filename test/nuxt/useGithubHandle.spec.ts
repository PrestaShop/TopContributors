import { describe, expect, it } from 'vitest'
import { githubHandle } from '@/composables/useGithubHandle'

describe('githubHandle', () => {
  it('turns a GitHub profile URL into an @handle', () => {
    expect(githubHandle('https://github.com/PrestaEdit')).toBe('@PrestaEdit')
    expect(githubHandle('https://github.com/PrestaShop/')).toBe('@PrestaShop')
    expect(githubHandle('http://www.github.com/PrestaEdit?tab=repositories')).toBe('@PrestaEdit')
  })

  it('keeps the URL as-is when it is not a GitHub profile', () => {
    expect(githubHandle('https://www.wepika.com')).toBe('https://www.wepika.com')
    expect(githubHandle('https://github.com/PrestaShop/PrestaShop')).toBe('https://github.com/PrestaShop/PrestaShop')
    expect(githubHandle('not a url')).toBe('not a url')
  })
})
