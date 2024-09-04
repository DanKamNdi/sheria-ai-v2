"use client"

import React, {useEffect, useState} from 'react';
import {UserAuth} from "@/app/context/AuthContext";
import {useRouter} from "next/navigation";
import Spinner from "@/app/components/spinner";
import {FaRegPenToSquare} from "react-icons/fa6";
import loader from "../components/images/1484 (1).gif"
import Image from "next/image"
import Link from "next/link";
import {collection, getDocs, orderBy, query} from "firebase/firestore";
import {db} from "@/app/firebase";
import ProtectedRoute from "@/app/components/ProtectedRoute";

const ChatsPage = () => {
  const {user} = UserAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [chats, setChats] = useState([]); // State to store chat documents

  const startChat = async (usrObj) => {
    setLoading(true)
    try {
      const response = await fetch("https://us-central1-sheria-ai-web.cloudfunctions.net/genUUID", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userName: usrObj.displayName,
          userId: usrObj.uid
        })
      })
      const uuid = await response.json();
      router.push(`/chat/${uuid}`, {scroll: false});
      // setLoading(false)
    } catch (e) {
      console.log(`HTTP ERROR! Error Message: ${e.message}`)
    }
  }

  useEffect(() => {
    if (user) {
      console.log(user)

      const fetchChats = async () => {
        setLoading(true);
        try {
          const chatsRef = collection(db, `users/${user.uid}/Conversations Metadata`); // Adjust with the correct path to your chats collection
          // Query for documents, ordered by timestamp in ascending order
          const q = query(chatsRef, orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const chatsData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            // Convert timestamp to JavaScript Date object and then to a string
            const date = data.createdAt?.toDate();
            const formattedDate = date ? new Intl.DateTimeFormat('en-US', {
              dateStyle: 'medium',
              timeStyle: 'short'
            }).format(date) : ''; // Adjust date format as needed

            return {
              id: doc.id,
              ...data,
              formattedDate: formattedDate // Or just 'date: formattedDate' if you want to override
            }
          });
          setChats(chatsData); // Update state with fetched chats
        } catch (error) {
          console.log(`Error fetching chats: ${error.message}`);
        } finally {
          setLoading(false);
        }
      };

      fetchChats().then();
    } else {
      console.log("No User")
    }
  }, [user]);

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center m-4">
        {
          loading ? (
            <div className="flex justify-center items-center">
              <Spinner/>
            </div>
          ) : user ? (
            <>
              <div className="flex flex-col justify-center items-center text-center mb-8">
                <h1 className="font-bold text-2xl md:text-4xl">Welcome, {user.displayName?.split(" ")[0]}</h1>
                {/* New chat button */}
                <button
                  onClick={() => startChat(user)}
                  disabled={loading} // Disable the button while loading
                  className="md:w-1/2 bg-tertiary mb-3 mt-3 border-2 border-tertiary flex justify-center items-center gap-2 rounded-lg p-2 text-sm font-semibold text-white hover:bg-cream hover:text-tertiary transition-colors"
                >
                  {loading ?
                    <Image src={loader} alt="Loading..." width={30} height={30}/>
                    :
                    <p>
                      New chat <FaRegPenToSquare className="inline-block"/>
                    </p>
                  }
                </button>
              </div>

              {/* Chats listing */}
              <div className="w-full md:w-1/2">
                {chats.length > 0 ? (
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold mb-4">Your Chats</h2>
                    <ul className="divide-y divide-gray-200">
                      {chats.map((chat) => (
                        <li key={chat.id} className="py-4">
                          <Link href={`/chat/${chat.chatId}`}>
                            <div className="flex flex-row justify-between">
                              <p className="text-tertiary font-bold">{chat.topic || "Chat with Sheria"}</p>
                              <p className="text-tertiary ">{chat.formattedDate}</p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="flex justify-center items-center">
                    <p className="md:text-xl font-bold">Chat with Sheria to populate your chats here.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <></>
          )
        }
      </div>
    </ProtectedRoute>
  );
};

export default ChatsPage;
