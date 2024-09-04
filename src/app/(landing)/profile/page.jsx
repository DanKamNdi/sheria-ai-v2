"use client"

// At the top of your component file
import {db} from '@/app/firebase'; // Adjust the path according to your Firebase config file
import {doc, getDoc} from 'firebase/firestore';
import React, {Fragment, useEffect, useState} from 'react';
import {UserAuth} from "@/app/context/AuthContext";
import Spinner from "@/app/components/spinner";
import {Dialog, Transition} from '@headlessui/react'
import Image from "next/image"
import Link from "next/link";

const ProfilePage = () => {
  const {user} = UserAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      }
      setLoading(false);
    };

    fetchUserData().then();
  }, [user]);

  const handleCancelSubscription = () => {
    setIsCancelPopupOpen(true);
  };

  if (loading) {
    return <Spinner/>;
  }

  return (
    <div className="flex justify-center items-center min-h-full p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        {userData ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <Image src={userData.photoURL} alt="Profile Picture" height={100} width={100} className="rounded-full"/>
            <h1 className="text-xl font-bold">{userData.displayName}</h1>
            <p>
              Email: <strong className="font-semibold">{userData.email}</strong>
            </p>
            {userData.subscription.status === "ACTIVE" && (
              <div className="flex flex-col">
                <p>
                  Subscription expires on: <span
                  className="font-semibold">{userData.subscription.expiresAt.toDate().toDateString()}</span>
                </p>
                <button onClick={handleCancelSubscription}
                        title="Let me tell you something... Let me tell you something"
                        className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                  Cancel Subscription
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1>You are not logged in.</h1>
            <Link href="/">
              {/* Direct use of Link without nesting <a> */}
              <span className="cursor-pointer text-blue-500 hover:underline">Go to home page</span>
            </Link>
          </div>
        )}

        {/* Cancel Subscription Popup */}
        <Transition appear show={isCancelPopupOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsCancelPopupOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25"/>
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Cancel Subscription
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        We're sorry to see you go! To cancel your subscription,
                        please email us at <strong>alvin@augmentinai.com</strong> or call us at
                        <strong> +254 748 079 211</strong>.
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => setIsCancelPopupOpen(false)}
                      >
                        Okay
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default ProfilePage;