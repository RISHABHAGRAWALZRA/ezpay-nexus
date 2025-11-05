import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BalanceCard from '../components/ui/BalanceCard';
import TransactionItem from '../components/ui/TransactionItem';
import TransactionDetailModal from '../components/ui/TransactionDetailModal';
import { useAppContext } from '../context/AppContext';

const Dashboard = () => {
  const { splits, getTotalBalance, deleteSplit, getDummyTransactions } = useAppContext();
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Balance Card */}
      <BalanceCard
        name="Maria Ma"
        total={getTotalBalance()}
      />

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
        </div>

        <div className="divide-y divide-gray-100">
          {(splits.length > 0 ? [...splits].reverse() : getDummyTransactions()).map((split) => (
            <div key={split.id}>
              <TransactionItem
                title={split.title}
                date={split.date}
                amount={split.perPersonAmount || split.amount}
                points={parseFloat(split.perPersonAmount || split.amount) / 10}
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

export default Dashboard;
