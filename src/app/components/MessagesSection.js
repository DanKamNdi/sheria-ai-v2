// components/MessageSection.js
import React, {useEffect, useRef} from "react";
import Dropdown from "@/app/components/Dropdown";
import Spinner from "@/app/components/spinner";
import Image from "next/image"
import loader from "../components/images/1484 (1).gif"

export default function MessageSection({messages, loading, sendingMessage}) {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom every time messages update
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({behavior: 'smooth'});
    }
  }, [messages]);

  // Function to format and sanitize message text for HTML rendering
  const formatMessageText = (text) => {
    // Remove pattern /【.*?†.*?】/g
    let formattedText = text.replace(/【.*?†.*?】/g, '');

    // Replace markdown-style bold with HTML bold tags and newlines with <br>
    formattedText = formattedText
      .replace(/\n/g, '<br>') // Replace newlines with HTML <br>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Markdown bold to HTML bold

    return formattedText;
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-grow items-center justify-center">
        <Spinner/>
      </div>
    );
  }

  return (
    <div
      className="overflow-y-auto overflow-x-hidden flex flex-col flex-grow items-start no-scrollbar m-2 p-2 space-y-2 break-words">
      {messages.map((msg, index) => {
        // Use formatMessageText to format and sanitize the message text
        const formattedText = {__html: formatMessageText(msg.text)};

        return (
          <div
            key={index}
            className={`p-2 rounded-lg shadow-md max-w-lg mx-2 my-1 ${
              msg.isServerMessage ? 'bg-white' : 'bg-userCard'
            } ${msg.isServerMessage ? 'self-start' : 'self-end'}`}
          >
            {/* Render the formatted and sanitized text as HTML */}
            <div dangerouslySetInnerHTML={formattedText}/>
            {/* Render Dropdown if message is from the server and contains cases */}
            {msg.isServerMessage && Array.isArray(msg.casesArray) && msg.casesArray.length > 0 && (
              <Dropdown casesArray={msg.casesArray}/>
            )}
          </div>
        );
      })}
      {
        sendingMessage ? (
          <Image src={loader} alt="Waiting for Sheria AI..." width={30} height={30}/>
        ) : (<div className="hidden h-0 w-0"></div>)
      }
      {/* Invisible element for scrolling into view */}
      <div ref={endOfMessagesRef}/>
    </div>
  );
}