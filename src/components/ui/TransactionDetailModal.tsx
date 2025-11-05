import React, { useState } from "react";
import { X, Calendar, DollarSign, Users, Trash2 } from "lucide-react";
import LoadingOverlay from "./LoadingOverlay";
import EmailSentModal from "./EmailSentModal";

const TransactionDetailModal = ({
  transaction,
  isOpen,
  onClose,
  onDelete,
}: {
  transaction: any;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}) => {
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);
  const [showEmailSent, setShowEmailSent] = useState<boolean>(false);
  const [friendsWithLinks, setFriendsWithLinks] = useState<
    { id: string; name: string; paymentLink: string }[]
  >([]);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(transaction.id);
      onClose();
    }
  };

  const handleSettleUp = async () => {
    // Show loading overlay
    setIsGeneratingLink(true);

    // Generate payment links for all participants
    const participants = transaction.participants || [];
    const linksData = participants.map(
      (friend: { id: string; name: string }) => {
        const requestId = `${transaction.id}_${friend.id}`;
        const link = `${window.location.origin}/payment/${requestId}`;
        return {
          id: friend.id,
          name: friend.name,
          paymentLink: link,
        };
      }
    );

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Hide loading and show email sent modal
    setIsGeneratingLink(false);
    setFriendsWithLinks(linksData);
    setShowEmailSent(true);
  };

  if (!isOpen || !transaction) return null;

  const handleCloseEmailModal = () => {
    setShowEmailSent(false);
    onClose();
  };

  // Generate avatar colors based on name
  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-emerald-500 to-teal-600",
      "from-pink-500 to-rose-600",
      "from-orange-500 to-red-600",
      "from-indigo-500 to-blue-600",
      "from-violet-500 to-purple-600",
      "from-cyan-500 to-blue-600",
      "from-amber-500 to-orange-600",
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPeople = (transaction.participants?.length || 0) + 1;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Settled Stamp */}
            {transaction.settled && (
              <div className="absolute top-24 right-8 z-20 transform rotate-12">
                <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xl border-4 border-green-600 shadow-lg opacity-90">
                  SETTLED
                </div>
              </div>
            )}

            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                Transaction Details
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group"
                  title="Delete transaction"
                >
                  <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-red-600" />
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {transaction.title}
                </h3>
              </div>

              {/* Date & Time */}
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-2" />
                <div>
                  <p className="text-sm font-medium">
                    {formatDate(transaction.date)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatTime(transaction.date)}
                  </p>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">
                    ${transaction.amount}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Split Between</span>
                  <span className="text-sm font-medium text-gray-900">
                    {totalPeople} {totalPeople === 1 ? "person" : "people"}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      Your Share
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      ${transaction.perPersonAmount || transaction.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Paid By */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">
                    Paid by
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {transaction.paidByName || "You"}
                </span>
              </div>

              {/* Participants */}
              {transaction.participants &&
                transaction.participants.length > 0 && (
                  <div>
                    <div className="flex items-center mb-3">
                      <Users className="w-5 h-5 text-gray-600 mr-2" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        Split With
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {/* You - Always First */}
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-semibold mr-3">
                            Y
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              You
                            </span>
                            <p className="text-xs text-blue-600 font-medium">
                              Paid
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">
                          $
                          {transaction.perPersonAmount ||
                            (
                              parseFloat(transaction.amount) / totalPeople
                            ).toFixed(2)}
                        </span>
                      </div>

                      {/* Other Participants */}
                      {transaction.participants.map(
                        (participant: { id: string; name: string }) => (
                          <div
                            key={participant.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
                                  participant.name
                                )} flex items-center justify-center text-white font-semibold mr-3`}
                              >
                                {participant.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-900">
                                  {participant.name}
                                </span>
                                <p className="text-xs text-orange-600 font-medium">
                                  Due
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">
                              $
                              {transaction.perPersonAmount ||
                                (
                                  parseFloat(transaction.amount) / totalPeople
                                ).toFixed(2)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Tx Hash - Only show when settled */}
              {transaction.settled && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Tx Hash
                      </h4>
                      <a
                        href="https://etherscan.io/tx/0x90f8133250df3d79bf8444015ebedca782d30d23594cadbe2a83dd6a8e0c638a"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:text-blue-700 underline break-all font-mono"
                      >
                        https://etherscan.io/tx/0x90f8133250df3d79bf8444015ebedca782d30d23594cadbe2a83dd6a8e0c638a
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer - Only show Settle Up button if not settled */}
            {!transaction.settled && (
              <div className="p-6 border-t border-gray-100 flex justify-center">
                <button
                  onClick={handleSettleUp}
                  className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Settle Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGeneratingLink && (
        <LoadingOverlay message="Generating Payment Link..." />
      )}

      {/* Email Sent Modal */}
      <EmailSentModal
        isOpen={showEmailSent}
        onClose={handleCloseEmailModal}
        friends={friendsWithLinks}
      />
    </>
  );
};

export default TransactionDetailModal;
