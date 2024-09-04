import '../../globals.css'
import ChatsNavbar from "@/app/components/TrialChatsNavbar";

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