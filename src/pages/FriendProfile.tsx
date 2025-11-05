import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Mail, Send, Receipt, DollarSign } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TransactionItem from '../components/ui/TransactionItem';
import TransactionDetailModal from '../components/ui/TransactionDetailModal';

const FriendProfile = () => {
  const { friendId } = useParams();
  const navigate = useNavigate();
  const { friends, splits, deleteSplit } = useAppContext();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTransactionClick = (split) => {
    setSelectedTransaction(split);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = (splitId) => {
    deleteSplit(splitId);
  };

  const friend = friends.find(f => f.id === friendId);

  if (!friend) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-900">Friend not found</h2>
        <button 
          onClick={() => navigate('/friends')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Go back to Friends
        </button>
      </div>
    );
  }

  // Get splits for this friend
  const friendSplits = splits.filter(split => 
    split.participants?.some(p => p.id === friendId)
  );

  // Calculate balance (excluding settled transactions)
  const calculateBalance = () => {
    const total = friendSplits
      .filter(split => !split.settled)
      .reduce((sum, split) => sum + parseFloat(split.perPersonAmount || 0), 0);
    return total.toFixed(2);
  };

  const balance = calculateBalance();
  const youOwe = parseFloat(balance) > 0;

  // Generate avatar colors based on name
  const getAvatarGradient = (name) => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-emerald-500 to-teal-600',
      'from-pink-500 to-rose-600',
      'from-orange-500 to-red-600',
      'from-indigo-500 to-blue-600',
      'from-violet-500 to-purple-600',
      'from-cyan-500 to-blue-600',
      'from-amber-500 to-orange-600',
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/friends')}
        className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Friends
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header with gradient background */}
        <div className={`bg-gradient-to-r ${getAvatarGradient(friend.name)} h-32`}></div>
        
        <div className="px-8 pb-8">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getAvatarGradient(friend.name)} flex items-center justify-center text-white font-bold text-5xl border-4 border-white shadow-lg`}>
              {friend.name.charAt(0).toUpperCase()}
            </div>
            
            <Link to="/create-split">
              <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm">
                <Receipt className="w-4 h-4 inline mr-2" />
                Create Split
              </button>
            </Link>
          </div>

          {/* Friend Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{friend.name}</h1>
              {friend.nickname && (
                <p className="text-lg text-gray-500 mt-1">@{friend.nickname}</p>
              )}
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-4">
              {friend.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{friend.email}</span>
                </div>
              )}
              {friend.telegram && (
                <div className="flex items-center text-gray-600">
                  <Send className="w-4 h-4 mr-2" />
                  <span className="text-sm">{friend.telegram}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center">
          <div className={`w-12 h-12 rounded-full ${youOwe ? 'bg-red-100' : 'bg-emerald-100'} flex items-center justify-center mr-4`}>
            <DollarSign className={`w-6 h-6 ${youOwe ? 'text-red-600' : 'text-emerald-600'}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">
              {youOwe ? 'Due' : 'Owes you'}
            </p>
            <p className={`text-3xl font-bold ${youOwe ? 'text-red-600' : 'text-emerald-600'}`}>
              ${balance}
            </p>
          </div>
        </div>
      </div>

      {/* Split History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Split History</h2>
          <p className="text-xs text-gray-500 mt-1">
            {friendSplits.length} {friendSplits.length === 1 ? 'transaction' : 'transactions'}
          </p>
        </div>
        
        {friendSplits.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {[...friendSplits].reverse().map((split) => (
              <div key={split.id}>
                <TransactionItem
                  title={split.title}
                  date={split.date}
                  amount={split.perPersonAmount}
                  points={parseFloat(split.perPersonAmount) / 10}
                  isSplit={true}
                  participants={split.participants || []}
                  paidByName={split.paidByName}
                  totalAmount={split.amount}
                  onClick={() => handleTransactionClick(split)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Receipt className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">No splits yet</h3>
            <p className="text-sm text-gray-500 mb-6">
              Create your first split with {friend.name}
            </p>
            <Link to="/create-split">
              <button className="inline-flex items-center px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                <Receipt className="w-4 h-4 mr-2" />
                Create Split
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default FriendProfile;
