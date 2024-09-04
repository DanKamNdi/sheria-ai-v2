import {Inter} from 'next/font/google'
import '../../../globals.css'

const inter = Inter({subsets: ['latin']})

export default function ChatIdLayout({children}) {
  return (
    <div className="bg-cream">
      {children}
    </div>
  )
}