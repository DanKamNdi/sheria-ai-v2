"use client"

import React, {useEffect, useRef, useState} from 'react';
import Link from "next/link";
import {UserAuth} from "@/app/context/AuthContext";
import Image from "next/image";
import logo from './images/ai.png';
import {useRouter} from "next/navigation";
import DropdownMenu from "@/app/components/NavbarDropdown";

const Navbar = () => {
  const {user, googleSignIn, signOut} = UserAuth();
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (e) {
      console.log(e);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e) {
      console.log(e);
    }
  }

  /*  const toggleMenu = () => {
      if (isMenuOpen) {
        console.log(isMenuOpen)
      }
      setIsMenuOpen(false);
    }*/

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener if dropdown is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    }
    checkAuthentication().then();
  }, []);

  return (
    <div>
      <nav className="bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-1 flex items-center w-60">
              <Link href="/" passHref>
                <Image src={logo} alt="Augmentin AI" height={40} width={40}/>
              </Link>
            </div>

            {/* Menu Links */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {
                  user ? (
                    <>
                      <Link href="/pricing"
                            className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Pricing</Link>

                      <Link href="/profile"
                            className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium">{user.displayName?.split(" ")[0]}</Link>

                      <button onClick={handleSignOut}
                              className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sign
                        Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleSignIn}
                              className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login
                      </button>

                      <button onClick={handleSignIn}
                              className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Sign
                        Up
                      </button>
                    </>
                  )
                }
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={isMenuOpen ? (() => setIsMenuOpen(false)) : (() => setIsMenuOpen(true))} type="button"
                      className="bg-black inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                <span className="sr-only">Open main menu</span>
                <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24"
                     strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"/>
                </svg>
                <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg"
                     fill="none" viewBox="0 0 24 24"
                     strokeWidth="2" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Conditional Dropdown */}
        {
          isMenuOpen && (
            <div ref={dropdownRef}>
              <DropdownMenu ref={dropdownRef} user={user} handleSignIn={handleSignIn} handleSignOut={handleSignOut}/>
            </div>
          )
        }
      </nav>
    </div>
  );
};

export default Navbar;