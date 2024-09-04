"use client"

import {useRouter} from 'next/navigation';
import React, {useState} from 'react'; // Import useState for managing state
import Image from 'next/image'; // Import the Image component for the loading image
import {UserAuth} from "@/app/context/AuthContext";
import loader from "../components/images/1484 (1).gif"
import axios from "axios";

export default function VerificationPage() {
  const {user} = UserAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);  // State to track loading status

  async function verifyPayment() {
    setIsLoading(true);
    console.log("Verifying Payment...")
    try {
      const response = await axios.post('https://dankamndi.com/payment-verification', {
        uid: user.uid
      });

      if (response.data.transactionVerified) {
        router.push('/chats');
      } else {
        alert('Transaction was not verified. Kindly reach out to us at info@augmentinai.com');
      }
    } catch (error) {
      console.error('Verification error:', error);
      alert('An error occurred while verifying your transaction. Please try again.');
    } finally {
      setIsLoading(false); // Set loading to false once the response is received or an error occurs
    }
  }

  return (
    <div className="flex h-screen">
      <div className="m-auto bg-white p-6 rounded-lg shadow-lg w-1/2">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Payment Verification</h2>
          <p className="mb-4">Click the button below to verify your payment. Once this is done, you will be redirected
            to the page where you can start chatting with <strong>Sheria AI</strong>.</p>
          {isLoading ? (
            <div>
              <Image src={loader} alt="Loading"
                     className="w-10 h-10 mx-auto"/> {/* Show loader when isLoading is true */}
            </div>
          ) : (
            <button onClick={verifyPayment} className="px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
              Verify Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}