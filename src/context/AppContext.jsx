import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [friends, setFriends] = useState(() => {
    const savedFriends = localStorage.getItem('friends');
    return savedFriends ? JSON.parse(savedFriends) : [];
  });

  const [splits, setSplits] = useState(() => {
    const savedSplits = localStorage.getItem('splits');
    return savedSplits ? JSON.parse(savedSplits) : [];
  });

  // Dummy transaction data
  const getDummyTransactions = () => [
    {
      id: 'dummy-1',
      title: 'Netflix Subscription',
      amount: '15.99',
      perPersonAmount: (15.99 / 2).toFixed(2), // Equally distributed
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      participants: [
        { id: '1', name: 'John Doe' },
        { id: '2', name: 'Jane Smith' }
      ],
      paidByName: 'Maria Ma'
    },
    {
      id: 'dummy-2',
      title: 'Coffee at Starbucks',
      amount: '12.50',
      perPersonAmount: (12.50 / 2).toFixed(2), // Equally distributed
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      participants: [
        { id: '1', name: 'John Doe' },
        { id: '3', name: 'Bob Wilson' }
      ],
      paidByName: 'Maria Ma'
    },
    {
      id: 'dummy-3',
      title: 'Dinner at Italian Restaurant',
      amount: '45.00',
      perPersonAmount: (45.00 / 3).toFixed(2), // Equally distributed
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      participants: [
        { id: '2', name: 'Jane Smith' },
        { id: '3', name: 'Bob Wilson' },
        { id: '4', name: 'Alice Brown' }
      ],
      paidByName: 'Maria Ma'
    },
    {
      id: 'dummy-4',
      title: 'Uber Ride',
      amount: '18.75',
      perPersonAmount: '18.75', // Single participant
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      participants: [
        { id: '1', name: 'John Doe' }
      ],
      paidByName: 'Maria Ma'
    }
  ];

  const [ezPoints, setEzPoints] = useState(() => {
    const savedPoints = localStorage.getItem('ezPoints');
    return savedPoints ? parseInt(savedPoints) : 0;
  });

  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('splits', JSON.stringify(splits));
  }, [splits]);

  useEffect(() => {
    localStorage.setItem('ezPoints', ezPoints.toString());
  }, [ezPoints]);

  const addFriend = (friend) => {
    setFriends([...friends, { ...friend, id: Date.now().toString() }]);
  };

  const addSplit = (split) => {
    setSplits([...splits, { ...split, id: Date.now().toString(), date: new Date().toISOString() }]);
    // Award 20 ezPoints for each transaction
    setEzPoints(prevPoints => prevPoints + 20);
  };

  const deleteSplit = (splitId) => {
    setSplits(splits.filter(split => split.id !== splitId));
  };

  const settleTransaction = (splitId) => {
    setSplits(splits.map(split =>
      split.id === splitId ? { ...split, settled: true, settledDate: new Date().toISOString() } : split
    ));
  };

  const getTotalBalance = () => {
    return splits.reduce((total, split) => total + parseFloat(split.amount), 0).toFixed(2);
  };

  const getEzPoints = () => {
    return ezPoints;
  };

  return (
    <AppContext.Provider value={{ friends, splits, addFriend, addSplit, deleteSplit, settleTransaction, getTotalBalance, getEzPoints, getDummyTransactions }}>
      {children}
    </AppContext.Provider>
  );
};
