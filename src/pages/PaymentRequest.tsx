import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import PaymentSuccessModal from "../components/ui/PaymentSuccessModal";
import { useNexus } from "@/components/nexus/NexusProvider";
import FastBridge from "@/components/fast-bridge/fast-bridge";
import { useAccount } from "wagmi";

const PaymentRequest = () => {
  const { requestId, address, amount } = useParams();
  const { address: connectedAddress } = useAccount();
  const navigate = useNavigate();
  const { unifiedBalance } = useNexus();
  const { splits, friends, settleTransaction } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState("Pay in USDC");
  const [showMethodDropdown, setShowMethodDropdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  // Decode the request ID to get transaction and friend info
  // Format: transactionId_friendId
  const [transactionId, friendId] = requestId ? requestId.split("_") : ["", ""];

  const transaction = splits.find((s) => s.id === transactionId);
  const friend = friends.find((f) => f.id === friendId);

  if (!transaction || !friend) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Payment Request Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This payment request link is invalid or has expired.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // const amount = parseFloat(transaction.perPersonAmount || 0).toFixed(2);
  const paymentMethods = ["Pay in USDC", "Pay in ETH", "Pay in USDT"];

  const handleProceedToPay = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mark transaction as settled
    settleTransaction(transactionId);

    setIsProcessing(false);
    setShowSuccess(true);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        {/* Payment Request Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {transaction.paidByName === "You"
              ? "Maria Ma"
              : transaction.paidByName || "Maria Ma"}{" "}
            is requesting a payment
          </h1>

          {/* Transaction Details */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Title</span>
              <span className="text-gray-900 font-semibold">
                {transaction.title}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600 font-medium">Amount</span>
              <span className="text-gray-900 font-bold text-xl">${amount}</span>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 text-center">
              Your Payment
            </h2>

            {/* Payment Method Dropdown */}
            {/* <div className="relative">
              <button
                onClick={() => setShowMethodDropdown(!showMethodDropdown)}
                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-gray-300 transition-colors"
              >
                <span className="text-gray-900 font-medium">
                  {paymentMethod}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </button>

              {showMethodDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  {paymentMethods.map((method) => (
                    <button
                      key={method}
                      onClick={() => {
                        setPaymentMethod(method);
                        setShowMethodDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {method}
                    </button>
                  ))}
                </div>
              )}
            </div> */}

            {/* Unified Balance */}
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <span>
                Unified Balance:{" "}
                {unifiedBalance?.find((b) => b.symbol === "USDC")?.balance} USDC
              </span>
              <ChevronDown className="w-4 h-4" />
            </div>

            {/* Payment Summary */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">You spend</span>
                <span className="text-gray-900 font-semibold">
                  {amount} USDC
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Your sources</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">2 chains</span>
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Proceed Button */}

            {/* <TransferButton>
              {({ onClick, isLoading }) => (
                <button onClick={onClick} className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-sm">
                  {isLoading ? 'Processing...' : 'Send Funds'}
                </button>
              )}
            </TransferButton> */}

            {/* <button
              onClick={handleProceedToPay}
              className="w-full px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-lg transition-colors shadow-sm"
            >
              Proceed to Pay
            </button> */}
            <FastBridge
              connectedAddress={connectedAddress as `0x${string}`}
              transactionId={transactionId}
              amount={amount as string}
              recipient={address as `0x${string}`}
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isProcessing && <LoadingOverlay message="Processing Payment..." />}

      {/* Success Modal */}
      <PaymentSuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        amount={amount}
        friendName={
          transaction.paidByName === "You"
            ? "Maria Ma"
            : transaction.paidByName || "Maria Ma"
        }
      />
    </div>
  );
};

export default PaymentRequest;
