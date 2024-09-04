"use client"

import React, {useEffect, useState} from 'react';
import {auth, db} from "@/app/firebase";
import {addDoc, collection, getDocs, serverTimestamp} from "firebase/firestore";
import {toast, ToastContainer} from "react-toastify";

const SignUpPage = () => {
  const [accountType, setAccountType] = useState('company');
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+254');
  const [lawyerCount, setLawyerCount] = useState('1-5');
  const [pricePlan, setPricePlan] = useState(10000); // Base price for 1-5 lawyers
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    switch (lawyerCount) {
      case '1-5':
        setPricePlan(10000);
        break;
      case '6-10':
        setPricePlan(15000);
        break;
      case '11-20':
        setPricePlan(20000);
        break;
      case '21+':
        setPricePlan(25000);
        break;
      default:
        setPricePlan(10000);
    }
  }, [lawyerCount]);

  const handlePhoneNumberChange = (e) => {
    const input = e.target.value;
    const formattedInput = "+254" + input.replace(/[^\d]/g, '').slice(3);
    setPhoneNumber(formattedInput.substring(0, 13));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(workEmail, password);
      const user = userCredential.user;
      await addDoc(collection(db, "enterprise-accounts"), {
        accountType,
        companyName,
        contactName,
        email: workEmail,
        phoneNumber,
        lawyerCount,
        pricePlan,
        createdAt: serverTimestamp(),
      });

      const enterpriseAccountsRef = collection(db, "enterprise-accounts");

      const querySnapshot = await getDocs(enterpriseAccountsRef);
      const accountDoc = querySnapshot.docs.find((doc) => {
        const data = doc.data();
        return (
          data.accountType === accountType &&
          data.companyName === companyName &&
          data.contactName === contactName &&
          data.email === workEmail &&
          data.phoneNumber === phoneNumber &&
          data.lawyerCount === lawyerCount &&
          data.pricePlan === pricePlan
        );
      });

      const accountRef = accountDoc.ref;

      await addDoc(collection(db, 'enterprise-users'), {
        uid: user.uid,
        email: workEmail,
        accountRef: accountRef.id,
        companyName: companyName,
        userType: 'admin',
      });
      toast.success('Enterprise account created successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // alert('Account created successfully');
      // Transition to dashboard or another page on successful sign up
    } catch (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 px-4 py-8 border shadow-lg rounded-md bg-gray-50">
      <h2 className="text-3xl font-bold mb-4 text-center">Sheria AI Enterprise</h2>
      <ToastContainer/>
      {/* Display error message */}
      {errorMsg && (
        <div className="text-red-500 text-center">
          {errorMsg}
        </div>
      )}
      <form className="space-y-4" onSubmit={handleSignUp}>
        <div className="flex flex-col gap-4">
          <p>What type of organization are you representing?</p>
          <div className="flex gap-4 items-center pl-3">
            <label className="flex items-center">
              <input type="radio" value="company" checked={accountType === 'company'}
                     onChange={() => setAccountType('company')} className="form-radio"/>
              <span className="ml-2">Company/Organization</span>
            </label>
            <label className="flex items-center">
              <input type="radio" value="lawfirm" checked={accountType === 'lawfirm'}
                     onChange={() => setAccountType('lawfirm')} className="form-radio"/>
              <span className="ml-2">Law Firm</span>
            </label>
          </div>
        </div>
        {/* Company/Law Firm Name, Contact Person Name, Email, Phone Number */}
        <div>
          <label htmlFor="companyName" className="block">Company/Law Firm Name</label>
          <input type="text" id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                 className="mt-1 p-2 w-full border rounded"/>
        </div>
        <div>
          <label htmlFor="contactName" className="block">Contact Person Name</label>
          <input type="text" id="contactName" value={contactName} onChange={(e) => setContactName(e.target.value)}
                 className="mt-1 p-2 w-full border rounded"/>
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block">Phone Number</label>
          <input type="tel" id="phoneNumber" placeholder="+254" value={phoneNumber} onChange={handlePhoneNumberChange}
                 className="mt-1 p-2 w-full border rounded"/>
        </div>
        {/* The inputs for these remain the same */}
        <div>
          <label htmlFor="email" className="block">Work Email</label>
          <input type="email" id="email" required value={workEmail} onChange={(e) => setWorkEmail(e.target.value)}
                 className="mt-1 p-2 w-full border rounded"/>
        </div>
        <div>
          <label htmlFor="password" className="block">Password</label>
          <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                 className="mt-1 p-2 w-full border rounded"/>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block">Confirm Password</label>
          <input type="password" id="confirmPassword" required value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 p-2 w-full border rounded"/>
        </div>
        <div>
          <label htmlFor="lawyerCount" className="block">Number of Lawyers</label>
          <select id="lawyerCount" value={lawyerCount} onChange={(e) => setLawyerCount(e.target.value)}
                  className="mt-1 p-2 w-full border rounded">
            <option value="1-5">1-5</option>
            <option value="6-10">6-10</option>
            <option value="11-20">11-20</option>
            <option value="21+">21+</option>
          </select>
        </div>
        <div className="text-center py-4">
          <strong>Price Plan: KES {pricePlan}</strong>
        </div>
        <div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Create
            Account
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpPage;