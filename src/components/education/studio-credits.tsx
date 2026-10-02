import Image from 'next/image'
import { ArrowUpRight, AudioLines } from 'lucide-react'
import { bitcoinLesson } from '@/lib/education'

export function StudioCredits() {
  const { content, audio } = bitcoinLesson.credits
  return <section className="studio-credits" aria-label="Episode credits">
    <a className="studio-credit" href={content.href} target="_blank" rel="noopener noreferrer">
      <span className="studio-credit-mark"><Image src={content.logo} alt="" width={72} height={30} /></span>
      <span className="studio-credit-copy"><span>Content</span><strong>{content.name}<ArrowUpRight size={12} aria-hidden="true" /></strong></span>
    </a>
    <a className="studio-credit" href={audio.href} target="_blank" rel="noopener noreferrer">
      <span className="studio-credit-mark studio-credit-audio"><AudioLines size={25} strokeWidth={1.5} aria-hidden="true" /></span>
      <span className="studio-credit-copy"><span>AI-generated audio</span><strong>{audio.name}<ArrowUpRight size={12} aria-hidden="true" /></strong></span>
    </a>
  </section>
}
