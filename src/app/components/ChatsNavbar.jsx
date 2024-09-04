"use client"

import React, {useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import {UserAuth} from "@/app/context/AuthContext";
import logo from "@/app/components/images/ai.png";
import {useRouter} from "next/navigation";

const ChatsNavbar = () => {
  const {user, googleSignIn, signOut} = UserAuth();
  const [loading, setLoading] = useState(true)
  const {router} = useRouter();

  const handleSignIn = async () => {
    try {
      await googleSignIn()
    } catch (e) {
      console.log(e)
    }
  }

  /*  const handleSignOut = async () => {
      try {
        await signOut();
      } catch (e) {
        console.log(e)
      }
    }*/

  useEffect(() => {
    if (user === null) {
      router.push("/")
    }
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      setLoading(false)
    }
    checkAuthentication().then()
  }, []);

  return (
    <nav className="bg-black p-4 flex justify-between items-center">
      <div className="w-1/3">
        <div className="w-10 h-10 flex items-center justify-center">
          <Link href="/chats">
            <Image src={logo} alt="Augmentin AI" height={40} width={40}/>
          </Link>
        </div>
      </div>

      {/* Logo in the center */}
      <div className="flex items-center w-1/3 justify-center">
        <Link href="/" className="text-white font-bold text-xl">
          Sheria AI
        </Link>
      </div>

      <div className="w-1/3 flex items-center justify-end">
        <Link href="/profile" className="flex items-center justify-end">
          <Image src={user.photoURL} alt="Display Photo" className="ml-4 rounded-full" width={30} height={30}/>
        </Link>
      </div>

    </nav>
  );
};

export default ChatsNavbar;