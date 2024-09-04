"use client"

import React from 'react';
import Image from 'next/image'
import loader from './images/spinner.gif'

const Spinner = () => {
  return (
    <div className="w-10 h-10 flex items-center justify-center">
      <Image src={loader} alt="loading" className="w-16"/>
    </div>
  );
};

export default Spinner;