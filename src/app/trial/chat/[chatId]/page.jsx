"use client"

import React, {useEffect, useState} from 'react';
import ChatInput from "@/app/components/ChatInput";
import ChatsNavbar from "@/app/components/TrialChatsNavbar";
import {UserAuth} from "@/app/context/AuthContext";
import MessagesSection from "@/app/components/MessagesSection";
import {app, db, initializeAnalytics} from '@/app/firebase';
import {addDoc, collection, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc} from 'firebase/firestore';
import {useRouter} from "next/navigation";
import axios from "axios";
import {logEvent} from "firebase/analytics";
import {Dialog} from "@headlessui/react";

const ChatPage = ({params}) => {
  const {user} = UserAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // At the beginning of your ChatPage component, add these states
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

// Feedback Modal (You can place this directly inside the ChatPage component)
  const FeedbackModal = () => (
    <Dialog open={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title className=" text-xl font-semibold">How can we improve Sheria AI?</Dialog.Title>
          <Dialog.Description>Please be blunt. Your feedback means a lot to us.</Dialog.Description>
          <form onSubmit={handleFeedbackSubmit}>
            <textarea
              name="feedbackText"
              rows={3}
              cols={30}
              className="w-full mt-2 p-2 border rounded"
              placeholder="No joking. Be blunt."
              required
            />

            <div className="mt-4 flex justify-end">
              <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white">
                Submit Feedback
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

// Feedback submission function
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const form = e.target;
    const formData = new FormData(form)
    const formJson = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, "Trial Feedback"), {
        userId: user.uid,
        email: user.email,
        timestamp: serverTimestamp(),
        content: formJson.feedbackText,
      });
      setFeedback(''); // Reset feedback input after submission
      setIsFeedbackModalOpen(false); // Close feedback modal
    } catch (error) {
      console.error("Error submitting feedback: ", error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push("/")
      return;
    }

    const fetchMessages = async () => {
      const fetchedMessages = [];
      try {
        const messagesRef = collection(db, `chats/${user.uid}/${params.chatId}`);
        const q = query(messagesRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        await querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.sender === "sheria") {
            fetchedMessages.push({
              isServerMessage: data.sender === "sheria",
              text: data.message.sheriaResponse,
              casesArray: data.message.cases,
            });
          } else if (data.sender === "system") {
            fetchedMessages.push({
              isServerMessage: data.sender === "system",
              text: data.message,
            });
          } else {
            fetchedMessages.push({
              isServerMessage: data.sender === "sheria",
              text: data.message,
            });
          }
        });
        // Optionally sort by createdAt if the order is not guaranteed
        fetchedMessages.reverse();
      } catch (e) {
        console.error(e)
      } finally {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setMessages(fetchedMessages)
        setLoading(false)
      }
    };

    fetchMessages().catch(console.error);
  }, [user, params.chatId]);

  const handleSendMessage = async (messageText) => {
    setSendingMessage(true);
    const newMessage = {
      text: messageText,
      isServerMessage: false,
    };
    setMessages([...messages, newMessage]);

    const payload = {
      userName: user.displayName,
      userId: user.uid,
      userMessage: messageText,
      chatId: params.chatId
    }

    // Reference to the user's document
    const userRef = doc(db, "users", user.uid);

    try {

      /*DO THE FREE TRIAL CHECKING HERE*/
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        let freeTrialQueries = userDoc.data().subscription?.freeTrialQueries;
        if (freeTrialQueries < 11) {
          // Update the freeTrialQueries count in Firestore
          await updateDoc(userRef, {
            "subscription.freeTrialQueries": freeTrialQueries + 1,
          });
          // Proceed with message sending logic...
          const analytics = await initializeAnalytics(app);

          await logEvent(analytics, "trial_query_asked", {
            userId: user.uid,
            name: "trial_user_query",
            chatId: params.chatId,
          });

          // Replace with your actual API call
          const {data} = await axios.post('https://us-central1-sheria-ai-web.cloudfunctions.net/ai', payload, {
            headers: {'Content-Type': 'application/json'},
            timeout: 600000, // Set the timeout to 60 seconds
          });
          console.log(data)
          const responseData = await data.message;

          // Assuming response data has the server message
          const serverMessage = {
            text: responseData.sheriaResponse,
            casesArray: responseData.cases,
            isServerMessage: true,
          };
          setMessages((prevMessages) => [...prevMessages, serverMessage]);

        } else {
          // Show the limit reached dialog
          setIsModalOpen(true);
          setSendingMessage(false);
          // Stop execution further
        }
      }
    } catch (error) {
      console.error('Error sending message:', error.message);
    } finally {
      setSendingMessage(false); // Done sending the message, whether successful or failed
    }
  };

  // If the user is not authenticated, return a message or redirect
  if (!user) {
    return <div>Please log in to view this page.</div>; // Modify as needed
  }

  const LimitReachedModal = () => (
    <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded bg-white p-6">
          <Dialog.Title>You have reached your free trial limit</Dialog.Title>
          <Dialog.Description>
            To continue using Sheria AI, please subscribe to Sheria Premium.
          </Dialog.Description>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => router.push('/pricing')}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              Go to Pricing
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );

  return (
    <div className="flex flex-col h-screen ">
      {/* Navbar, let's ensure it doesn't shrink */}
      <div className="flex-shrink-0">
        <ChatsNavbar/>
      </div>

      {/* Main content area */}
      <div className="flex flex-row flex-grow overflow-hidden mx-2">
        <div className="lg:w-1/5">
          {/* Left sidebar */}
        </div>

        <div className="sm:w-full md:w-full lg:w-3/5 flex flex-col">
          <LimitReachedModal/>
          {/* Scrollable chat messages */}
          <MessagesSection
            loading={loading}
            displayName={user.displayName}
            messages={messages}
            userId={user.uid}
            chatId={params.chatId}
            sendingMessage={sendingMessage}
          />

          {/* Fixed ChatInput at the bottom */}
          {/* Removed `absolute` and relying on flex layout instead */}
          <div className="flex-shrink-0">
            <ChatInput
              onSendMessage={handleSendMessage}
              userId={user.uid}
              userName={user.displayName}
              chatId={params.chatId}
              sendingMessage={sendingMessage}
            />
          </div>
        </div>

        <div className="hidden lg:block lg:w-1/5 mx-2">
          <button onClick={() => setIsFeedbackModalOpen(true)}
                  className="mt-4 p-2 mx-2 bg-blue-500 text-white rounded w-full">Give
            Feedback
          </button>
        </div>
      </div>
      <FeedbackModal/>
    </div>
  );
};

export default ChatPage;