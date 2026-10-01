import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function StudioHeader({ library = false }: { library?: boolean }) {
  return <header className="studio-header">
    <div className="studio-brand">
      <Link href="/" aria-label="Afribit home"><Image src="/Logo/Full logo png transparent.png" alt="" width={28} height={28} /><span>Afribit</span></Link>
      <span className="studio-brand-divider">/</span><Link href="/studio"><strong>Studio</strong></Link>
    </div>
    <div className="studio-header-center"><span />BITCOIN EDUCATION</div>
    <Link href={library ? '/' : '/studio'} className="studio-exit"><ArrowLeft size={15} /><span>{library ? 'Back to Afribit' : 'Library'}</span></Link>
  </header>
}
