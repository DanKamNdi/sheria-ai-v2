"use client"

import React, {useState} from 'react';
import {UserAuth} from "@/app/context/AuthContext";
import {useRouter} from "next/navigation";
import {doc, setDoc} from "firebase/firestore";
import {db} from "@/app/firebase";
import {toast, ToastContainer} from "react-toastify";

const PricingPage = () => {
  const {user} = UserAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);

  const saveDataToFirestore = async (paymentRef, user) => {
    const docRef = doc(db, "users", user.uid)
    if (!docRef.hasOwnProperty(paymentRef)) {
      try {
        await setDoc(doc(db, `users/${user.uid}`), {
          paymentRef: paymentRef
        }, {merge: true});
        console.log('Document written with ID: ', docRef.id);
        return true
      } catch (error) {
        console.error('Error adding document: ', error);
        return false
      }
    } else {
      return false
    }
  };

  const handlePayment = async () => {
    setIsLoading(true);
    const userEmail = user.email;
    const userName = user.displayName
    try {
      const payload = {
        email: userEmail,
        name: userName
      }

      const response = await fetch("https://dankamndi.com/pay", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      })

      console.log(response)

      if (response.ok) {
        const res = await response.json();
        const saveResponse = await saveDataToFirestore(res.reference, user)
        console.log(saveResponse)
        if (saveResponse) {
          router.push(res.authorization_url);
          console.log(res)
        }
        setIsLoading(false);
      } else if (response.message) {
        console.log("Request failed. This is the error message: ", response.message);
        setIsLoading(false);
      } else {
        toast.error("Your payment request was not successful. Ensure that you do not have an active subscription already.")
        setIsLoading(false);
      }
    } catch (error) {
      // Handle errors
      console.error('Error Message:', error.message);
    }
  }

  return (
    <section className="flex items-center justify-center mt-10 pb-10">
      <ToastContainer/>
      <div className="p-4 sm:px-10 flex flex-col justify-center items-center text-base h-100vh mx-auto" id="pricing">
        <h3 className="text-5xl font-semibold text-center flex gap-2 justify-center mb-10">Subscribe to Sheria
          Co-Counsel</h3>
        {/*<div className="isolate mx-auto grid max-w-md grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">

        </div>*/}
        <div className="ring-2 ring-blue-600 rounded-3xl p-8 xl:p-10">
          <div className="flex items-center justify-between gap-x-4">
            <h3 id="tier-extended" className="text-blue-600 text-2xl font-semibold leading-8">Sheria AI</h3>
            <p className="rounded-full bg-blue-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-blue-600">
              Best Price</p>
          </div>
          <p className="mt-4 text-base leading-6 text-gray-600">Get all the features for one price</p>
          <p className="mt-6 flex items-baseline gap-x-1">
            <span className="line-through text-xl font-sans text-gray-500/70">Kes 3,000 </span><span
            className="text-4xl font-bold tracking-tight text-gray-900"> Kes 1,500</span><span
            className="text-xl">per month</span>
          </p>
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="bg-blue-600 w-full text-white shadow-sm hover:bg-blue-500 mt-6 block rounded-md py-2 px-3 text-center text-base font-medium leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
            {isLoading ? 'Loading...' : 'Buy now'}
          </button>
          <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 xl:mt-10">
            <li className="flex gap-x-3 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Sheria AI has knowledge on<strong>All Laws</strong>
            </li>
            <li className="flex gap-x-3 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                   stroke="currentColor" aria-hidden="true" className="h-6 w-5 flex-none text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Sheria AI has access to thousands of<strong>Case Law</strong>
            </li>
            <li className="flex gap-x-3 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth="1.5" stroke="currentColor" aria-hidden="true"
                   className="h-6 w-5 flex-none text-blue-600">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <strong>Multiple threads</strong>of conversations with Sheria
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default PricingPage;
