import React from 'react';
import Image from "next/image";
import analysis from "../components/images/analysis.png"
import database from "../components/images/database.png"
import conversation from "../components/images/conversation.png"

const Features = () => {
  return (
    <div className="bg-cream flex flex-col justify-center items-center md:mb-20">
      <div className="text-center mt-10 mb-12">
        <h2 className="text-3xl font-bold text-black">What can Sheria AI do?</h2>
      </div>

      {/* Updated the class from "flex" to "md:flex-row flex-col items-center" for responsive design */}
      <div className="flex flex-col md:flex-row items-center">

        <div className="feature-card max-w-sm mx-5 mb-5 md:mb-0 flex-grow">
          <div className="bg-white rounded-lg shadow-lg p-8 h-full">
            <div className="text-black mb-6">
              <Image src={conversation} alt="Q&A" height={60}/>
              <h3 className="text-2xl font-semibold mb-2">Instant Legal Queries</h3>
              <p className="text-gray-600">Ask any legal question and get instant, accurate responses based on what the
                law says. Sheria AI has knowledge of <strong>Kenyan</strong> Laws and the judicial system.</p>
            </div>
          </div>
        </div>

        <div className="feature-card max-w-sm mx-5 mb-5 md:mb-0 flex-grow">
          <div className="bg-white rounded-lg shadow-lg p-8 h-full">
            <div className="text-black mb-6">
              <Image src={database} alt="Database" height={60}/>
              <h3 className="text-2xl font-semibold mb-2">Case Law Database</h3>
              <p className="text-gray-600">Ask a question and Sheria AI will search through thousands of cases,
                read the relevant one, and answer. Sheria also gives you references to the cases used to answer you.</p>
            </div>
          </div>
        </div>

        <div className="feature-card max-w-sm mx-5 mb-5 md:mb-0 flex-grow">
          <div className="bg-white rounded-lg shadow-lg p-8 h-full">
            <div className="text-black mb-6">
              <Image src={analysis} alt="Analysis" height={60}/>
              <h3 className="text-2xl font-semibold mb-2">Case Analysis</h3>
              <p className="text-gray-600">Quickly locate case information from large data sets. Just ask Sheria AI
                a question and get a fast analysis of the case, allowing you to draw meaningful conclusions
                and build stronger cases.</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Features;