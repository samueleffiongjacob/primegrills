import React from 'react';
import { Home } from 'lucide-react';

const ThankYouPage = ({ customerName = 'valued customer', onGoHome }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 p-6">
      <div className="max-w-md text-center bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-6">
          {/* <img 
            src="/api/placeholder/100/100" 
            alt="Celebration icon" 
            className="mx-auto mb-4"
          /> */}
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Delicious Thanks!</h1>
          <p className="text-lg text-gray-700 mb-6">
            Thank you for satisfying your cravings with us, {customerName}!
          </p>
          <p className="text-gray-600 mb-6">
            Your taste buds are in for a treat. We're preparing your order with care,
            and it will be on its way to tantalize your palate very soon.
          </p>
          <p className="italic text-amber-700 text-sm mb-8">
            "Good food is the foundation of genuine happiness."
          </p>
        </div>
        
        <button 
          onClick={onGoHome}
          className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-full w-full transition duration-300 ease-in-out"
        >
          <Home size={18} />
          Return to Home
        </button>
        
        <p className="mt-6 text-sm text-gray-500">
          Have questions about your order? Contact us at support@youreatery.com
        </p>
      </div>
    </div>
  );
};

export default ThankYouPage;