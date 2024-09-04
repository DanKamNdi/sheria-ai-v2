import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation'; // Corrected import for Next.js 10 and above
import {UserAuth} from "@/app/context/AuthContext";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/firebase";
import Image from "next/image";
import loader from "../components/images/spinner.gif";

const ProtectedRoute = ({children}) => {
  const {user} = UserAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      // Ensure user object is not null
      if (user) {
        try {
          // Now we're sure user and user.uid exist
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            // Check subscription status; redirect if INACTIVE
            if (userData.subscription.status !== 'ACTIVE') {
              router.push("/pricing");
            }
          } else {
            console.log("No such document!");
            alert("Couldn't find user data.");
            // Redirect if user document doesn't exist
            await router.push('/');
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
          alert("Error checking user subscription status." + error);
          // Redirect in case of error
          await router.push('/');
        }
      } else {
        // Redirect if user is not logged in (i.e., user is null)
        await router.push('/');
      }
      setIsLoading(false); // Set loading to false after the check
    };

    // Call checkSubscription only if user object is truthy, to avoid error on reload
    if (user.displayName) {
      checkSubscription().then();
    } else {
      setIsLoading(false); // Also avoid loader hanging indefinitely
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full justify-center items-center">
        <Image src={loader} alt="loading..." className="w-20 h-20"/>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;