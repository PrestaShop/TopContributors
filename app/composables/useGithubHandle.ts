/**
 * Displays a GitHub profile URL as `@handle` (github.com is implied). Anything
 * that isn't a plain profile URL is returned unchanged.
 */
export function githubHandle(url: string): string {
  try {
    const { hostname, pathname } = new URL(url)
    const segments = pathname.split('/').filter(Boolean)
    if (!['github.com', 'www.github.com'].includes(hostname) || segments.length !== 1) return url
    return `@${segments[0]}`
  }
  catch {
    return url
  }
}
