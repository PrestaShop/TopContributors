import { defineEventHandler, getRouterParam, setHeader, createError } from 'h3'
import { renderCardSvg, parseVariant } from '../../../utils/cardSvg'

// Per-variant card served under a path-based URL so it survives static hosting
// (GitHub Pages ignores query strings — the sibling /card/:login.svg?ranking=…
// path returns whichever variant Nitro happened to prerender, which is why we
// need a distinct URL per variant).
export default defineEventHandler(async (event) => {
  const rawLogin = getRouterParam(event, 'login') ?? ''
  const rawVariant = getRouterParam(event, 'variant') ?? ''
  const login = decodeURIComponent(rawLogin)
  const variant = parseVariant(rawVariant.replace(/\.svg$/i, ''))
  if (!login) throw createError({ statusCode: 400, statusMessage: 'Missing login' })
  const svg = await renderCardSvg(login, variant)
  setHeader(event, 'content-type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return svg
})
