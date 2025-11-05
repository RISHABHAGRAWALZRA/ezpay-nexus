import React from "react";
import { Send, Bell, Share2 } from "lucide-react";

const BalanceCard = ({ name, total }: { name: string; total: string }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Card */}
      <div className="relative bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800 rounded-3xl p-8 shadow-xl overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Name */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white">{name}</h2>
          </div>

          {/* Total */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-300 mb-2">Total:</p>
            <h1 className="text-5xl font-bold text-white">
              ${parseFloat(total).toFixed(2)}
            </h1>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-12 -mt-8 relative z-20">
        <button className="flex flex-col items-center group">
          <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-2 group-hover:shadow-xl transition-shadow">
            <Send className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs font-medium text-gray-700">
            Send
            <br />
            Payment
          </span>
        </button>

        <button className="flex flex-col items-center group">
          <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mb-2 group-hover:shadow-xl transition-shadow">
            <Share2 className="w-6 h-6 text-blue-500" />
          </div>
          <span className="text-xs font-medium text-gray-700">
            Share
            <br />
            Invite
          </span>
        </button>
      </div>
    </div>
  );
};

export default BalanceCard;
