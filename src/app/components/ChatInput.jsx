"use client";

import React, {useState} from "react";
import {FiSend} from "react-icons/fi";
import Image from 'next/image'
import loader from '../components/images/1484 (3).gif'

const ChatInput = ({userId, userName, chatId, onSendMessage, sendingMessage}) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (message !== "") {
      // Assuming userName and userId are provided as props
      const payload = {
        userName: userName,
        userId: userId,
        userMessage: message,
        chatId: chatId
      };

      onSendMessage(message)
      setMessage('');
      setLoading(true)

      const response = await fetch('https://dankamndi.com/dev/test', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        /*body: JSON.stringify({
          userName: userName,
          userId: userId,
          userMessage: message,
          chatId: chatId
        })*/
      });
      setLoading(false)

      /*try {
        const response = await fetch('https://dankamndi.com/dev/test', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userName: userName,
            userId: userId,
            userMessage: message,
            chatId: chatId
          })
        });

        const data = await response.json();
        setLoading(false)
        const aiMessagePayload = {
          message: data.message,
          sender: data.sender,
        }
        await sendAIMessage(aiMessagePayload)
      } catch (error) {
        // Handle any errors
        console.error('Error submitting message:', error.message);
      }*/
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    onSendMessage(message);
    setMessage('');
  };

  return (
    <div>
      <form className="mb-2 flex flex-col w-full" onSubmit={handleSend}>
        {/* Input field */}
        <div className="flex flex-row">
          <input
            type="text"
            id="userQuery"
            value={message}
            autoComplete="off"
            className="flex-grow m-2 p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" disabled={sendingMessage} className="m-2 p-3 bg-tertiary text-white rounded-md">
            {
              sendingMessage ? (
                <Image src={loader} alt="..." height={20} width={20}/>
              ) : (
                <FiSend className="text-xl"/>
              )
            }
          </button>
        </div>
        {/* Disclaimer */}
        <div id="disclaimer" className="text-xs text-gray-500 text-center">
          <p>Please note: Sheria AI is currently in beta. Features and functionality may change as we work towards
            improving the system.</p>
          {/*<button onClick={() => console.log(userId, userName)}>clci me</button>*/}
        </div>
      </form>
    </div>
  );
};

export default ChatInput;