import { getHistory, getTransactions } from "@/database/db";
import { createContext, useContext, useEffect, useState } from "react";

type context = {
  history: [];
  lastHistory: any;
  setHistory: any;
  fetchHistory: () => Promise<void>;
  transactions: any;
};

const GlobalContext = createContext<any>({});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: any) => {
  const [history, setHistory] = useState<[]>([]);
  const [lastHistory, setLastHistory] = useState<[]>([]);
  const [transactions, setTransactions] = useState<[]>([]);
  const fetchHistory = async () => {
    try {
      const data: any = await getHistory();
      setHistory(data);
      setLastHistory(data[data.length - 1]);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      }
    }
  };
  const fetchTransactions = async () => {
    try {
      const data: any = await getTransactions();
      setTransactions(data);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchTransactions()
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        history,
        lastHistory,
        fetchHistory,
        transactions,
        fetchTransactions
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
