import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Receipt, Mail, Send, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TransactionItem from '../components/ui/TransactionItem';
import TransactionDetailModal from '../components/ui/TransactionDetailModal';

const Friends = () => {
  const { friends, splits, deleteSplit } = useAppContext();
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState(null);
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

  // Calculate balance for a friend (excluding settled transactions)
  const getFriendBalance = (friendId) => {
    const friendSplits = splits.filter(split =>
      split.participants?.some(p => p.id === friendId) && !split.settled
    );
    return friendSplits.reduce((total, split) => total + parseFloat(split.perPersonAmount || 0), 0).toFixed(2);
  };

  // Get splits for selected friend
  const getSelectedFriendSplits = () => {
    if (!selectedFriend) return [];
    return splits.filter(split =>
      split.participants?.some(p => p.id === selectedFriend.id)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your friends and create splits</p>
        </div>
        <div className="flex gap-3">
          <Link to="/add-friend">
            <button className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </button>
          </Link>
          <Link to="/create-split">
            <button className="inline-flex items-center px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm">
              <Receipt className="w-4 h-4 mr-2" />
              Create Split
            </button>
          </Link>
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Friends List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Your Friends</h2>
            <p className="text-xs text-gray-500 mt-1">{friends.length} {friends.length === 1 ? 'friend' : 'friends'}</p>
          </div>

          {friends.length > 0 ? (
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              {friends.map((friend) => {
                const balance = getFriendBalance(friend.id);
                const isSelected = selectedFriend?.id === friend.id;

                return (
                  <div
                    key={friend.id}
                    className={`p-5 cursor-pointer transition-all ${isSelected
                      ? 'bg-blue-50 border-l-4 border-l-blue-600'
                      : 'hover:bg-gray-50'
                      }`}
                    onClick={() => navigate(`/friends/${friend.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        {/* Avatar */}
                        <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${getAvatarGradient(friend.name)} flex items-center justify-center text-white font-semibold text-base flex-shrink-0`}>
                          {friend.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Friend Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 truncate">
                            {friend.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {friend.nickname && (
                              <span className="text-xs text-gray-500 truncate">
                                @{friend.nickname}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Balance Status */}
                      <div className="text-right ml-3">
                        {parseFloat(balance) > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-orange-600">Due</span>
                            <span className="text-sm font-semibold text-gray-900">${balance}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm font-semibold">Settled</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
              <p className="text-gray-500 mb-6">Add friends to start splitting expenses</p>
              <Link to="/add-friend">
                <button className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Your First Friend
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Side - Split History & Settled */}
        <div className="space-y-6">
          {/* Active Split History */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Split History</h2>
              <p className="text-xs text-gray-500 mt-1">
                {splits.filter(s => !s.settled).length} active {splits.filter(s => !s.settled).length === 1 ? 'transaction' : 'transactions'}
              </p>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {splits.filter(s => !s.settled).length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {splits.filter(s => !s.settled).reverse().map((split) => (
                    <div key={split.id}>
                      <TransactionItem
                        title={split.title}
                        date={split.date}
                        amount={split.amount}
                        points={parseFloat(split.amount) / 10}
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
                  <h3 className="text-base font-medium text-gray-900 mb-2">No active splits</h3>
                  <p className="text-sm text-gray-500">
                    Create your first split with a friend
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Settled Transactions */}
          {splits.filter(s => s.settled).length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">Settled</h2>
                <p className="text-xs text-gray-500 mt-1">
                  {splits.filter(s => s.settled).length} settled {splits.filter(s => s.settled).length === 1 ? 'transaction' : 'transactions'}
                </p>
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                <div className="divide-y divide-gray-100">
                  {splits.filter(s => s.settled).reverse().map((split) => (
                    <div key={split.id}>
                      <TransactionItem
                        title={split.title}
                        date={split.date}
                        amount={split.amount}
                        points={parseFloat(split.amount) / 10}
                        isSplit={true}
                        participants={split.participants || []}
                        paidByName={split.paidByName}
                        totalAmount={split.amount}
                        onClick={() => handleTransactionClick(split)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        address={window.ethereum.request({ method: 'eth_accounts' })[0]}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
};

export default Friends;
