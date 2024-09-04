import '../../globals.css'
import ChatsNavbar from "@/app/components/ChatsNavbar";

export const metadata = {
  title: 'Sheria AI',
  description: 'Your ultimate legal assistant.',
}

export default function ChatsLayout({children}) {
  return (
    <div className="h-screen">
      <ChatsNavbar/>
      <div className="h-full">
        {children}
      </div>
    </div>
  )
}