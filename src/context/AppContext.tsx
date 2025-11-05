import NexusProvider from "@/components/nexus/NexusProvider";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
} from "react";
import Web3Provider from "./Web3Context";

export type Friend = {
  id: string;
  name: string;
  nickname?: string;
};

export type SplitParticipant = {
  id: string;
  name: string;
};

export type Split = {
  id: string;
  title: string;
  amount: string;
  perPersonAmount: string;
  paidBy: "me" | string;
  paidByName: string;
  participants: SplitParticipant[];
  date: string;
  settled?: boolean;
  settledDate?: string;
};

type NewFriend = Omit<Friend, "id">;
type NewSplit = Omit<Split, "id" | "date" | "settled" | "settledDate">;

type AppContextValue = {
  friends: Friend[];
  splits: Split[];
  addFriend: (friend: NewFriend) => void;
  addSplit: (split: NewSplit) => void;
  deleteSplit: (splitId: string) => void;
  settleTransaction: (splitId: string) => void;
  getTotalBalance: () => string;
  getEzPoints: () => number;
  getDummyTransactions: () => void;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const useAppContext = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [friends, setFriends] = useState<Friend[]>(() => {
    const savedFriends = localStorage.getItem("friends");
    return savedFriends ? JSON.parse(savedFriends) : [];
  });

  const [splits, setSplits] = useState<Split[]>(() => {
    const savedSplits = localStorage.getItem("splits");
    return savedSplits ? JSON.parse(savedSplits) : [];
  });

  const [ezPoints, setEzPoints] = useState<number>(() => {
    const savedPoints = localStorage.getItem("ezPoints");
    return savedPoints ? parseInt(savedPoints) : 0;
  });

  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem("splits", JSON.stringify(splits));
  }, [splits]);

  useEffect(() => {
    localStorage.setItem("ezPoints", ezPoints.toString());
  }, [ezPoints]);

  const addFriend = (friend: NewFriend) => {
    setFriends((prev) => [...prev, { ...friend, id: Date.now().toString() }]);
  };

  const addSplit = (split: NewSplit) => {
    setSplits((prev) => [
      ...prev,
      { ...split, id: Date.now().toString(), date: new Date().toISOString() },
    ]);
    // Award 20 ezPoints for each transaction
    setEzPoints((prevPoints) => prevPoints + 20);
  };

  const deleteSplit = (splitId: string) => {
    setSplits((prev) => prev.filter((split) => split.id !== splitId));
  };

  const getDummyTransactions = () => [
    {
      id: "dummy-1",
      title: "Netflix Subscription",
      amount: "15.99",
      perPersonAmount: (15.99 / 2).toFixed(2), // Equally distributed
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      participants: [
        { id: "1", name: "John Doe" },
        { id: "2", name: "Jane Smith" },
      ],
      paidByName: "Maria Ma",
    },
    {
      id: "dummy-2",
      title: "Coffee at Starbucks",
      amount: "12.50",
      perPersonAmount: (12.5 / 2).toFixed(2), // Equally distributed
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      participants: [
        { id: "1", name: "John Doe" },
        { id: "3", name: "Bob Wilson" },
      ],
      paidByName: "Maria Ma",
    },
    {
      id: "dummy-3",
      title: "Dinner at Italian Restaurant",
      amount: "45.00",
      perPersonAmount: (45.0 / 3).toFixed(2), // Equally distributed
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      participants: [
        { id: "2", name: "Jane Smith" },
        { id: "3", name: "Bob Wilson" },
        { id: "4", name: "Alice Brown" },
      ],
      paidByName: "Maria Ma",
    },
    {
      id: "dummy-4",
      title: "Uber Ride",
      amount: "18.75",
      perPersonAmount: "18.75", // Single participant
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      participants: [{ id: "1", name: "John Doe" }],
      paidByName: "Maria Ma",
    },
  ];

  const settleTransaction = (splitId: string) => {
    setSplits((prev) =>
      prev.map((split) =>
        split.id === splitId
          ? { ...split, settled: true, settledDate: new Date().toISOString() }
          : split
      )
    );
  };

  const getTotalBalance = () => {
    return splits
      .reduce((total, split) => total + parseFloat(split.amount), 0)
      .toFixed(2);
  };

  const getEzPoints = () => ezPoints;

  const value: AppContextValue = useMemo(() => {
    return {
      friends,
      splits,
      addFriend,
      addSplit,
      deleteSplit,
      settleTransaction,
      getTotalBalance,
      getEzPoints,
      getDummyTransactions,
    };
  }, [
    friends,
    splits,
    addFriend,
    addSplit,
    deleteSplit,
    settleTransaction,
    getTotalBalance,
    getEzPoints,
    getDummyTransactions,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
