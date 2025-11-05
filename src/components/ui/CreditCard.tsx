import React from 'react';
import { Wifi } from 'lucide-react';

const CreditCard = ({ name, cardNumber, expiryDate }) => {
  // Format card number with spaces
  const formattedCardNumber = cardNumber.match(/.{1,4}/g).join(' ');
  
  return (
    <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-16">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">EZ credit card</p>
        </div>
        <div>
          <Wifi className="w-6 h-6 text-gray-400 rotate-90" />
        </div>
      </div>
      
      <div className="mb-8">
        <p className="text-gray-800 font-medium text-base mb-3">{name}</p>
        <p className="text-xl font-mono tracking-wider text-gray-900">{formattedCardNumber}</p>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-gray-500 mb-1">Valid Thru</p>
          <p className="text-sm font-medium text-gray-700">{expiryDate}</p>
        </div>
        <div className="flex items-center">
          <svg className="h-8" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="32" rx="4" fill="#1434CB"/>
            <path d="M17.5 8h-6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z" fill="#EB001B"/>
            <path d="M30.5 8h6c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2h-6c-1.1 0-2-.9-2-2V10c0-1.1.9-2 2-2z" fill="#F79E1B"/>
            <path d="M24 10c-1.7 0-3 1.3-3 3v6c0 1.7 1.3 3 3 3s3-1.3 3-3v-6c0-1.7-1.3-3-3-3z" fill="#FF5F00"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CreditCard;
