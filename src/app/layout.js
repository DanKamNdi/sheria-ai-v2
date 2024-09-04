import {Inter} from 'next/font/google'
import './globals.css'
import {AuthContextProvider} from "@/app/context/AuthContext";
import {Analytics} from "@vercel/analytics/react";

const inter = Inter({subsets: ['latin']})

export default function RootLayout({children}) {
  return (
    <html lang="en">
    <body className={inter.className}>
    <AuthContextProvider>
      {children}
      <Analytics/>
    </AuthContextProvider>
    </body>
    </html>
  )
}
