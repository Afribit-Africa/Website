import { parseDocument, DomUtils } from 'htmlparser2'
import { INSATS_REPORT_URL, insatsReportSchema } from './insats'

export function parseInsatsReport(html: string, checkedAt = new Date().toISOString()) {
  const document = parseDocument(html)
  const headings = DomUtils.getElementsByTagName('h1', document.children)
  if (!headings.some((heading) => DomUtils.textContent(heading).trim() === 'Kibera report')) {
    throw new Error('Insats report heading was not found')
  }
  const spans = DomUtils.getElementsByTagName('span', document.children)
  const readCount = (label: string) => {
    const heading = spans.find((span) => DomUtils.textContent(span).trim() === label)
    const value = heading && DomUtils.nextElementSibling(heading)
    const text = value ? DomUtils.textContent(value).trim() : ''
    if (!/^(?:\d+|\d{1,3}(?:,\d{3})+)$/.test(text))
      throw new Error(`Invalid Insats count: ${label}`)
    return Number(text.replaceAll(',', ''))
  }
  return insatsReportSchema.parse({
    verifiedEntries: readCount('Verified entries'),
    activeMerchants: readCount('Active merchants'),
    source: INSATS_REPORT_URL,
    checkedAt,
  })
}
