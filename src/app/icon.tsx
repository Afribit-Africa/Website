/* eslint-disable @next/next/no-img-element */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const size = {
  width: 512,
  height: 512,
}

export const contentType = 'image/png'

async function getLogoSource() {
  const svg = await readFile(join(process.cwd(), 'public', 'Logo', 'icon symbol only svg.svg'), 'utf8')
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export default async function Icon() {
  const logoSource = await getLogoSource()

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
      >
        <img
          src={logoSource}
          alt="Afribit Africa"
          width="512"
          height="512"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            padding: '10%',
          }}
        />
      </div>
    ),
    size,
  )
}