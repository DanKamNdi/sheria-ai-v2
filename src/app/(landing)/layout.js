import '../globals.css'
import {AuthContextProvider} from "@/app/context/AuthContext";
import Navbar from "@/app/components/Navbar";

export default function LandingLayout({children}) {
  return (
    <AuthContextProvider>
      <Navbar/>
      {children}
    </AuthContextProvider>
  )
}
