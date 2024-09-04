import Banner from "@/app/components/Banner";
import Navbar from "@/app/components/Navbar";
import CreatorCard from "@/app/components/CreatorCard";
import Features from "@/app/components/Features";

export const metadata = {
  metadataBase: new URL('https://augmentinai.com'),
  title: 'Sheria AI',
  description: 'Your AI-powered legal assistant with knowledge on Kenyan laws and case law.',
  OpenGraph: {
    images: [
      {
        url: "https://sheriatestbucket.s3.eu-west-2.amazonaws.com/images/Sheria+Logo.png",
        width: 1000,
        height: 1000,
      },
      {
        url: "https://sheriatestbucket.s3.eu-west-2.amazonaws.com/images/opengraph-image.jpg",
        width: 500,
        height: 500,
      },
    ],
    locale: "en-KE",
    type: "website"
  }
}

export default function Home() {
  return (
    <main className="mb-5">
      <Navbar/>
      <Banner/>
      <Features/>
      <CreatorCard/>
    </main>
  )
}
