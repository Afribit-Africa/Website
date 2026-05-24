import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Afribit Africa'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#070807',
          color: '#f4f5f0',
          padding: '56px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at top left, rgba(247,147,26,0.22), transparent 34%), radial-gradient(circle at right center, rgba(0,135,81,0.18), transparent 30%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            border: '1px solid rgba(244,245,240,0.08)',
            borderRadius: '28px',
            padding: '44px',
            background: 'rgba(18,21,18,0.86)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '30px',
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: '18px',
                height: '18px',
                borderRadius: '999px',
                background: '#f7931a',
              }}
            />
            Afribit Africa
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '820px' }}>
            <div style={{ fontSize: '68px', lineHeight: 1.02, fontWeight: 800 }}>
              Bitcoin-powered change rooted in Kibera.
            </div>
            <div style={{ fontSize: '28px', lineHeight: 1.45, color: 'rgba(244,245,240,0.8)' }}>
              Community-led action, merchant networks, and practical Bitcoin adoption across Kibera, Nairobi.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              fontSize: '24px',
              color: 'rgba(244,245,240,0.72)',
            }}
          >
            <span>afribit.africa</span>
            <span style={{ color: '#f7931a' }}>•</span>
            <span>Merchant networks</span>
            <span style={{ color: '#f7931a' }}>•</span>
            <span>Education</span>
            <span style={{ color: '#f7931a' }}>•</span>
            <span>Community</span>
          </div>
        </div>
      </div>
    ),
    size,
  )
}