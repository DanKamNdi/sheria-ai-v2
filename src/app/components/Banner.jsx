'use client'

// components/Banner.js
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import YouTube from "react-youtube";
import useDeviceSize from "@/app/functions/DeviceSize";
import {UserAuth} from "@/app/context/AuthContext";
import Image from "next/image";
import loader from "../components/images/1484 (3).gif"
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/firebase";

const Banner = () => {
  const {user, googleSignIn} = UserAuth()
  const videoId = "FmjaoFdfgaY"
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [width] = useDeviceSize();
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [talkToSheriaLoading, setTalkToSheriaLoading] = useState(false)
  const router = useRouter();

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const handleSignIn = async () => {
    setSignUpLoading(true)
    try {
      await googleSignIn();
    } catch (e) {
      console.log(e);
    } finally {
      setSignUpLoading(false)
    }
  }

  const checkSubscriptionStatus = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().subscription.status === 'ACTIVE';
    } else {
      // Handle the case where the user document doesn't exist in your database
      console.log('No such document!');
      return false;
    }
  };

  const checkFreeTrialLimit = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.data().subscription.freeTrialQueries >= 10) {
      return true;
    } else {
      // Handle the case where the user document doesn't exist in your database
      console.log('No such document!');
      return false;
    }
  }

  const handleTalkToSheriaClick = async () => {
    setTalkToSheriaLoading(true);
    const isActiveSubscription = await checkSubscriptionStatus(user.uid);
    const freeTrialLimit = await checkFreeTrialLimit(user.uid)

    if (isActiveSubscription) {
      //setTalkToSheriaLoading(false);
      router.push('/chats'); // If subscription is active, navigate to chats
    } else if (freeTrialLimit) {
      //setTalkToSheriaLoading(false);
      router.push('/pricing')
    } else {
      //setTalkToSheriaLoading(false);
      router.push('/trial/chats'); // If subscription is not active, navigate to pricing
    }
  };

  return (
    <div className="bg-black p-6 text-white text-center h-auto flex flex-col justify-center">

      <div className=" flex flex-col items-center justify-between">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">Meet your AI legal assistant</h1>
        <p className="text-xl md:text-xl w-full md:w-1/2 mb-6">
          Sheria AI does legal research in minutes—with results you can trust and verify.
        </p>
        <div className="flex flex-row">
          {
            !user ? (
              <button className="bg-green-300 text-black font-bold px-4 py-2 rounded m-4" onClick={handleSignIn}>
                {signUpLoading ? <Image src={loader} alt="..." className="w-5 h-5"/> : "Get Started"}
              </button>
            ) : (
              <button className="bg-green-400 text-black font-bold px-4 py-2 rounded m-4"
                      onClick={handleTalkToSheriaClick}>
                {talkToSheriaLoading ? <Image src={loader} alt="..." className="w-5 h-5"/> : "Chat with Sheria"}
              </button>
            )
          }

          <button className="bg-secondary text-white font-bold px-4 py-2 rounded m-4" onClick={openPopup}>
            <Link
              href="/"
            >
              Watch Demo
            </Link>
          </button>
        </div>

        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 w-screen md:w-auto"
               onClick={closePopup}>
            {/* Add onClick event with stopPropagation to the content wrapper */}
            <div className="bg-transparent p-4 sm:p-6 w-full sm:max-w-lg mx-4 rounded"
                 onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <div></div>
                {/* Placeholder if you need something on the left of the title bar */}
                <button onClick={closePopup}
                        className="text-white text-2xl font-bold p-2 rounded-full hover:text-red-600">
                  &times;
                </button>
              </div>
              <YouTube videoId={videoId} opts={{width: "100%", playerVars: {autoplay: 1}}}/>
              {/*<h1 className="text-xl font-bold text-tertiary">Will show demo video</h1>*/}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;