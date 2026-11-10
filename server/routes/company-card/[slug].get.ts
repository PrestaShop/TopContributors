import { defineEventHandler, getRouterParam, setHeader, createError } from 'h3'
import { renderCompanyCardSvg } from '../../utils/companyCardSvg'

// Company share card. Lives outside /card/ so it can't collide with the
// contributor /card/:login/:variant.svg route (a GitHub login may be "company").
export default defineEventHandler(async (event) => {
  const slug = decodeURIComponent(getRouterParam(event, 'slug') ?? '')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Missing company' })
  const svg = await renderCompanyCardSvg(slug)
  setHeader(event, 'content-type', 'image/svg+xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600')
  return svg
})
