'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, createScope } from 'animejs'
import { useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  Check,
  Milk,
  Wheat,
  Leaf,
  RefreshCw,
  Database,
  Store,
  CloudOff,
} from 'lucide-react'
import {
  insatsDemonstration,
  insatsReportSchema,
  INSATS_REPORT_URL,
  type InsatsReport,
  type InsatsPoint,
} from '@/lib/insats'

const productsIcons = [Milk, Wheat, Leaf]
const series = [
  { key: 'kesIndex', label: 'KES price', color: '#f7931a' },
  { key: 'satsIndex', label: 'Sats required', color: '#6cdcb0' },
  { key: 'basketIndex', label: 'Living-cost basket', color: '#76c9ea' },
] as const
type SeriesKey = (typeof series)[number]['key']
const number = new Intl.NumberFormat('en-KE')
const x = (index: number) => 20 + (index / 7) * 760
const y = (value: number) => 250 - ((value - 70) / 55) * 240
const line = (points: InsatsPoint[], key: SeriesKey) =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'}${x(index)},${y(point[key])}`).join(' ')

function InsatsPublicReport() {
  const [report, setReport] = useState<InsatsReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const request = useRef<AbortController | null>(null)
  const inView = useRef(false)

  const refresh = useCallback(async () => {
    if (request.current) return
    const controller = new AbortController()
    request.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 12000)
    setLoading(true)
    try {
      const response = await fetch('/api/builders/insats', { signal: controller.signal })
      if (!response.ok) throw new Error('Unavailable')
      const body: unknown = await response.json()
      if (!body || typeof body !== 'object' || !('data' in body)) throw new Error('Invalid report')
      setReport(insatsReportSchema.parse(body.data))
      setFailed(false)
    } catch {
      if (request.current === controller) setFailed(true)
    } finally {
      window.clearTimeout(timeout)
      if (request.current === controller) {
        request.current = null
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    const poll = () => {
      if (inView.current && document.visibilityState === 'visible') void refresh()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView.current = entry.isIntersecting
      if (entry.isIntersecting) poll()
    })
    if (root.current) observer.observe(root.current)
    const interval = window.setInterval(poll, 300000)
    document.addEventListener('visibilitychange', poll)
    return () => {
      observer.disconnect()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', poll)
      request.current?.abort()
      request.current = null
    }
  }, [refresh])

  return (
    <div className="insats-public-report" ref={root}>
      <div className="insats-report-heading">
        <div>
          <span className="builder-kicker">Insats public report</span>
          <h3>Kibera, on the record.</h3>
        </div>
        <button
          type="button"
          className="builder-icon-button"
          onClick={() => void refresh()}
          disabled={loading}
          aria-label="Refresh Insats report"
          title="Refresh Insats report"
        >
          <RefreshCw size={17} className={loading ? 'motion-safe:animate-spin' : ''} />
        </button>
      </div>
      <div className="insats-report-counts">
        <div>
          <Database size={19} />
          <strong>{report ? number.format(report.verifiedEntries) : '--'}</strong>
          <span>Verified entries</span>
        </div>
        <div>
          <Store size={19} />
          <strong>{report ? number.format(report.activeMerchants) : '--'}</strong>
          <span>Active merchants</span>
        </div>
      </div>
      <p role="status" className="insats-report-status">
        {failed ? (
          <>
            <CloudOff size={16} />{' '}
            {report
              ? 'Refresh unavailable. Showing the last retrieved report.'
              : 'The public report is temporarily unavailable.'}
          </>
        ) : report ? (
          report.verifiedEntries === 0 ? (
            'No verified entries are published in this report yet.'
          ) : (
            'Counts from the Insats public report. The chart above remains illustrative.'
          )
        ) : (
          'Connecting to the public report...'
        )}
      </p>
      <div className="insats-report-footer">
        {report && (
          <span>
            Retrieved{' '}
            <time dateTime={report.checkedAt}>
              {new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
                timeZone: 'Africa/Nairobi',
              }).format(new Date(report.checkedAt))}{' '}
              EAT
            </time>
          </span>
        )}
        <a href={INSATS_REPORT_URL} target="_blank" rel="noopener noreferrer">
          View source report <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  )
}

export function InsatsObservatory() {
  const [productIndex, setProductIndex] = useState(0)
  const [period, setPeriod] = useState(7)
  const [visible, setVisible] = useState<SeriesKey[]>(['kesIndex', 'satsIndex', 'basketIndex'])
  const product = insatsDemonstration[productIndex]
  const current = product.points[period]
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced !== false) return
    const scope = createScope({ root }).add(() => {
      animate('[data-chart-series]', {
        opacity: [0, 1],
        duration: 750,
        ease: 'out(3)',
      })
    })
    return () => scope.revert()
  }, [productIndex, reduced])

  const toggle = (key: SeriesKey) =>
    setVisible((current) =>
      current.includes(key)
        ? current.length > 1
          ? current.filter((item) => item !== key)
          : current
        : [...current, key],
    )

  return (
    <div className="insats-observatory" ref={root}>
      <div className="insats-chart-tool">
        <div className="builder-tool-heading">
          <span className="builder-kicker">The Insats measurement method</span>
          <span className="insats-data-label">Illustrative data / baseline 100</span>
        </div>
        <div className="insats-products" role="group" aria-label="Choose a product">
          {insatsDemonstration.map((item, index) => {
            const Icon = productsIcons[index]
            return (
              <button
                type="button"
                key={item.id}
                aria-pressed={productIndex === index}
                onClick={() => setProductIndex(index)}
              >
                <Icon size={21} aria-hidden="true" />
                <span>
                  {item.label}
                  <small>{item.unit}</small>
                </span>
              </button>
            )
          })}
        </div>
        <div className="insats-readings" aria-live="polite">
          <div>
            <span>Local shelf price / {current.label}</span>
            <strong>KES {number.format(current.kes)}</strong>
            <small>
              {current.kesIndex - 100 >= 0 ? '+' : ''}
              {current.kesIndex - 100}% from baseline
            </small>
          </div>
          <div>
            <span>Bitcoin equivalent</span>
            <strong>
              {number.format(current.sats)} <em>sats</em>
            </strong>
            <small>
              {current.satsIndex - 100 >= 0 ? '+' : ''}
              {current.satsIndex - 100}% from baseline
            </small>
          </div>
          <div>
            <span>Living-cost basket</span>
            <strong>{current.basketIndex}</strong>
            <small>Index / baseline 100</small>
          </div>
        </div>
        <div className="insats-plot-wrap">
          <div className="insats-y-axis" aria-hidden="true">
            {[120, 110, 100, 85, 75].map((value) => (
              <span key={value} style={{ top: `${(y(value) / 270) * 100}%` }}>
                {value}
              </span>
            ))}
          </div>
          <svg
            className="insats-plot"
            viewBox="0 0 800 270"
            preserveAspectRatio="none"
            role="img"
            aria-label={`${product.label}: illustrative KES, sats, and living-cost basket indices over eight periods`}
            onPointerMove={(event) => {
              if (event.pointerType !== 'mouse') return
              const bounds = event.currentTarget.getBoundingClientRect()
              setPeriod(
                Math.max(
                  0,
                  Math.min(
                    7,
                    Math.round(
                      ((((event.clientX - bounds.left) / bounds.width) * 800 - 20) / 760) * 7,
                    ),
                  ),
                ),
              )
            }}
            onPointerDown={(event) => {
              const bounds = event.currentTarget.getBoundingClientRect()
              setPeriod(
                Math.max(
                  0,
                  Math.min(
                    7,
                    Math.round(
                      ((((event.clientX - bounds.left) / bounds.width) * 800 - 20) / 760) * 7,
                    ),
                  ),
                ),
              )
            }}
          >
            {[120, 110, 100, 85, 75].map((value) => (
              <line
                key={value}
                x1="20"
                x2="780"
                y1={y(value)}
                y2={y(value)}
                stroke={value === 100 ? '#747975' : '#303733'}
                strokeDasharray={value === 100 ? '5 5' : undefined}
                vectorEffect="non-scaling-stroke"
              />
            ))}
            <g data-chart-series>
              {series.map((item) => (
                <path
                  key={item.key}
                  data-chart-line
                  d={line(product.points, item.key)}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                  opacity={visible.includes(item.key) ? 1 : 0}
                />
              ))}
            </g>
            <line
              x1={x(period)}
              x2={x(period)}
              y1="10"
              y2="250"
              stroke="#777f79"
              strokeDasharray="3 5"
              vectorEffect="non-scaling-stroke"
            />
            {series
              .filter((item) => visible.includes(item.key))
              .map((item) => (
                <circle
                  key={item.key}
                  cx={x(period)}
                  cy={y(current[item.key])}
                  r="4"
                  fill={item.color}
                />
              ))}
          </svg>
        </div>
        <div className="insats-x-axis" aria-hidden="true">
          {product.points.map((point) => (
            <span key={point.label}>{point.label}</span>
          ))}
        </div>
        <input
          className="insats-period"
          type="range"
          min="0"
          max="7"
          step="1"
          value={period}
          onChange={(event) => setPeriod(Number(event.target.value))}
          aria-label="Observation period"
          aria-valuetext={`${current.label}: ${current.kes} Kenyan shillings, ${current.sats} sats, basket index ${current.basketIndex}`}
        />
        <div className="insats-legend" role="group" aria-label="Visible chart series">
          {series.map((item) => (
            <button
              key={item.key}
              type="button"
              aria-pressed={visible.includes(item.key)}
              onClick={() => toggle(item.key)}
              disabled={visible.length === 1 && visible.includes(item.key)}
            >
              <span
                className="insats-swatch"
                style={{
                  background: visible.includes(item.key) ? item.color : 'transparent',
                  borderColor: item.color,
                }}
              >
                {visible.includes(item.key) && <Check size={11} />}
              </span>
              {item.label}
            </button>
          ))}
        </div>
        <div className="insats-chart-source">
          <p>
            Method demonstration from{' '}
            <a href="https://insats.org" target="_blank" rel="noopener noreferrer">
              Insats <ArrowUpRight size={13} />
            </a>
            . These example values are not verified Kibera prices or a current exchange-rate quote.
          </p>
          <details>
            <summary>View data table</summary>
            <div className="insats-table-scroll">
              <table>
                <caption>
                  {product.label}, {product.unit}: illustrative Insats values
                </caption>
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>KES</th>
                    <th>Sats</th>
                    <th>KES index</th>
                    <th>Sats index</th>
                    <th>Basket index</th>
                  </tr>
                </thead>
                <tbody>
                  {product.points.map((point) => (
                    <tr key={point.label}>
                      <th scope="row">{point.label}</th>
                      <td>{point.kes}</td>
                      <td>{number.format(point.sats)}</td>
                      <td>{point.kesIndex}</td>
                      <td>{point.satsIndex}</td>
                      <td>{point.basketIndex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </div>
      </div>
      <InsatsPublicReport />
    </div>
  )
}
