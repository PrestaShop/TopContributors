import { defineEventHandler, getRouterParam, getQuery, setHeader, createError } from 'h3'
import { renderCardSvg, parseVariant } from '../../utils/cardSvg'

// Overall-variant card. Kept at the flat path so long-lived README embeds keep
// working. Also honours ?ranking=… when the endpoint is reachable at runtime
// (dev / preview / SSR), for parity with the nested route. Note: on the
// GitHub Pages deploy this file is prerendered once with the overall variant,
// so the query string has no effect there — the nested /card/:login/:variant.svg
// route is the one that actually serves the other rankings in production.
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'login') ?? ''
  const login = decodeURIComponent(raw)
  if (!login) throw createError({ statusCode: 400, statusMessage: 'Missing login' })
  const variant = parseVariant(getQuery(event).ranking)
  const svg = await renderCardSvg(login, variant)
  setHeader(event, 'content-type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return svg
})
