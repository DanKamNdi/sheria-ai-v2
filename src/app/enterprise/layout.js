import '../globals.css'
import Link from "next/link";
import Image from "next/image";
import logo from "@/app/components/images/ai.png";

export const metadata = {
  title: 'Sheria AI',
  description: 'Your ultimate legal assistant.',
}

export default function ChatsLayout({children}) {
  return (
    <div className="h-screen">
      <nav className="bg-black p-4 flex justify-between items-center">
        <div className="w-1/3">
          <div className="w-10 h-10 flex items-center justify-center">
            <Link href="/enterprise">
              <Image src={logo} alt="Augmentin AI" height={40} width={40}/>
            </Link>
          </div>
        </div>

        {/* Logo in the center */}
        <div className="flex items-center w-1/3 justify-center">
          <Link href="/enterprise" className="text-white font-bold text-xl">
            Sheria AI
          </Link>
        </div>

        <div className="flex items-center w-1/3 justify-center">

        </div>
      </nav>
      <div className="h-full">
        {children}
      </div>
    </div>
  )
}