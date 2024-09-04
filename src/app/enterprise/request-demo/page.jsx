"use client";

import React, {useState} from 'react';
import {addDoc, collection, serverTimestamp} from "firebase/firestore";
import {db} from "@/app/firebase";
import {toast, ToastContainer} from "react-toastify";

const RequestDemo = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firmName, setFirmName] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      firstName,
      lastName,
      workEmail,
      phoneNumber,
      firmName,
      reason,
      createdAt: serverTimestamp(), // This adds a server-side timestamp
    };

    try {
      // Adding document to 'enterprise-demo' collection
      await addDoc(collection(db, 'enterprise-demo'), formData);
      // alert('Demo request submitted successfully!');
      toast.success("Demo request submitted successfully!");

      // Optional: Reset form or take further action after successful submission
    } catch (err) {
      console.error("Error submitting form:", err);
      // alert('Error while submitting. Please try again.');
      toast.error("Error while submitting. Please try again.", {
        position: "top-right",
        theme: "dark",
        autoClose: 3000,
        hideProgressBar: true,
        pauseOnHover: true
      });
    }
  };

  // Function to handle phone number changes
  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    // Enforce Kenyan code prefix and numbers only (up to 13 characters for +254XXXXXXXXX)
    const formattedInput = "+254" + input.replace(/\D/g, '').slice(3); // Replace non-digits and ensure +254 prefix
    setPhoneNumber(formattedInput.substring(0, 13)); // Limiting to Kenyan phone number length including country code
  };

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ToastContainer></ToastContainer>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Request Demo
        </h1>
        <h4 className="text-xl text-gray-600 mb-6">
          We understand that forms are not the most interesting things on the internet.
          But we need this information to better serve you😊.
        </h4>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex space-x-6">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Alvin"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="h-8 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Kamau"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="h-8 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="workEmail" className="block text-sm font-medium text-gray-700">
              Work Email *
            </label>
            <input
              type="email"
              id="workEmail"
              placeholder="alvin@someplace.com"
              value={workEmail}
              onChange={(e) => setWorkEmail(e.target.value)}
              required
              className="h-8 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
              placeholder="+254701234567" // Example for hint
              className="h-8 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="firmName" className="block text-sm font-medium text-gray-700">
              Law Firm/Company Name *
            </label>
            <input
              type="text"
              id="firmName"
              value={firmName}
              placeholder="ALN Kenya"
              onChange={(e) => setFirmName(e.target.value)}
              required
              className="h-8 p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Reason for demo *
            </label>
            <textarea
              id="reason"
              value={reason}
              placeholder="Be very descriptive about what part of your work that you think Sheria AI will be perfect to help you."
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="p-2 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="text-sm text-gray-500 mb-4">
            * All fields with an asterisk are required.
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Request Demo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestDemo;