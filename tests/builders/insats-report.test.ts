import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseInsatsReport } from '../../src/lib/insats-report'

const fixture = (entries: string, merchants: string) => `
  <html><body><h1>Kibera report</h1><div>
    <div><span>Verified entries</span> <span>${entries}</span></div>
    <div><span>Active merchants</span> <span>${merchants}</span></div>
  </div></body></html>`

test('zero observations are a valid empty report', () => {
  const report = parseInsatsReport(fixture('0', '0'), '2026-09-10T00:00:00.000Z')
  assert.equal(report.verifiedEntries, 0)
  assert.equal(report.activeMerchants, 0)
  assert.equal(report.checkedAt, '2026-09-10T00:00:00.000Z')
  assert.equal(report.source, 'https://prices.insats.org/report')
})

test('formatted public counts and nested text remain readable', () => {
  const report = parseInsatsReport(fixture('<strong>1,234</strong>', '25'))
  assert.equal(report.verifiedEntries, 1234)
  assert.equal(report.activeMerchants, 25)
})

test('error and login pages never become a zero-count report', () => {
  assert.throws(() => parseInsatsReport('<html><h1>Service unavailable</h1></html>'))
  assert.throws(() => parseInsatsReport(fixture('10', '2').replace('Kibera report', 'Sign in')))
})

test('missing or changed labels fail explicitly', () => {
  assert.throws(() => parseInsatsReport(fixture('10', '2').replace('Verified entries', 'Submitted entries')))
  assert.throws(() => parseInsatsReport('<h1>Kibera report</h1>'))
})

test('invalid, negative, approximate, and unsafe counts are rejected', () => {
  for (const value of ['--', '-1', '1.5', '1,2', 'about 10', 'NaN', '9007199254740992']) {
    assert.throws(() => parseInsatsReport(fixture(value, '0')), value)
  }
})
