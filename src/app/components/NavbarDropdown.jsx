// components/DropdownMenu.js
import React, {forwardRef} from "react";
import Link from "next/link";

const DropdownMenu = forwardRef(({user, handleSignIn, handleSignOut}, ref) => (
  <div ref={ref} className="absolute right-0 w-full bg-tertiary shadow-md z-20">
    {!user ? (
      <button onClick={handleSignIn}
              className="block w-full text-left text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-base font-medium">
        Get Started
      </button>
    ) : (
      <div className="flex flex-col">
        {/* Add link to the chats page */}
        <Link href="/pricing"
              className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-base font-medium">
          Pricing
        </Link>

        <Link href="/chats"
              className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md font-medium">
          Sheria Chat
        </Link>

        <Link href="/profile"
              className="text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md font-medium">
          Profile
        </Link>
        <button onClick={handleSignOut}
                className="block w-full text-left text-gray-300 hover:bg-blue-900 hover:text-white px-3 py-2 rounded-md text-base font-medium">
          Sign Out
        </button>
      </div>
    )}
  </div>
));

export default DropdownMenu;