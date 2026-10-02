import { ImageResponse } from 'next/og'

export const alt = 'Afribit Africa: community-led Bitcoin in Kibera, Nairobi'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#070807', color: '#f4f5f0', padding: '64px 72px', borderLeft: '16px solid #f7931a', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', fontSize: 34, color: '#f7931a', fontWeight: 700 }}>Afribit Africa</div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 60, fontSize: 76, lineHeight: 1.12, fontWeight: 700 }}>
        <span>Bitcoin-powered change.</span>
        <span>Rooted in Kibera.</span>
      </div>
      <div style={{ display: 'flex', marginTop: 32, fontSize: 28, lineHeight: 1.5, maxWidth: 930, color: '#b7bdb6' }}>Community-led education, merchant payments and a local circular economy in Nairobi, Kenya.</div>
      <div style={{ display: 'flex', marginTop: 'auto', alignItems: 'center', justifyContent: 'space-between', fontSize: 24 }}>
        <span>www.afribit.africa</span><span style={{ color: '#7bd4aa' }}>Education / Commerce / Community</span>
      </div>
    </div>, size,
  )
}
