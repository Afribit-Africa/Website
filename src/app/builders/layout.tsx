import './builders.css'
import { BuildersFrame } from '@/components/builders/builders-frame'

export default function BuildersLayout({ children }: { children: React.ReactNode }) {
  return <BuildersFrame>{children}</BuildersFrame>
}
