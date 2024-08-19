import { getHistory } from "@/database/db";
import { createContext, useContext, useEffect, useState } from "react";

type context = {
  history: []
  lastHistory: any
  setHistory: any
  fetchHistory: () => Promise<void>;
};

const GlobalContext = createContext<any>({});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: any) => {
  const [history, setHistory] = useState<[]>([]);
  const [lastHistory, setLastHistory ] = useState<[]>([]);
  const fetchHistory = async () => {
    try {
      const data: any = await getHistory();
      setHistory(data);
      setLastHistory(data[data.length - 1])
    } catch (e) {
      if (e instanceof Error) {
        console.log(history);
      }
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        history,
        lastHistory,
        fetchHistory,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
