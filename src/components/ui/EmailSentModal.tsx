import React, { useState } from "react";
import { X, Copy, Check, Mail } from "lucide-react";

const EmailSentModal = ({
  isOpen,
  onClose,
  friends = [],
}: {
  isOpen: boolean;
  onClose: () => void;
  friends: { id: string; name: string; paymentLink: string }[];
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopyLink = (link: string, index: number) => {
    navigator.clipboard.writeText(link);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Format friend names for display
  const friendNames = friends.map((f) => f.name).join(", ");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Email Sent!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-gray-700">
            Payment request email has been sent to{" "}
            <span className="font-semibold">{friendNames}</span>
          </p>

          {/* Payment Links for Each Friend */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">
              Payment Links
            </label>
            {friends.map((friend, index) => (
              <div key={friend.id} className="space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  {friend.name}
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={friend.paymentLink}
                    readOnly
                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyLink(friend.paymentLink, index)}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 whitespace-nowrap"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Share these links with your friends to receive payment directly to
              your wallet.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailSentModal;
