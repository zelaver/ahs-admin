import images from "@/constants/images";
import { getAllContacts, getHistory, getProducts, getTransactions, initDB, initHistory } from "@/database/db";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image } from "react-native";
import { View } from "react-native";

type context = {
  history: [];
  lastHistory: any;
  setHistory: any;
  transactions: any;
  isLoading: boolean;
  setIsLoading: any;
  customers: any;
  fetchHistory: () => Promise<void>;
  fetchCustomers: any;
  fetchTransactions: any;
  fetchProducts: any;
};

const GlobalContext = createContext<any>({});
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: any) => {
  const [history, setHistory] = useState<[]>([]);
  const [lastHistory, setLastHistory] = useState<[]>([]);
  const [transactions, setTransactions] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  type products = {
    id: number;
    name: string;
    price: number;
    subs_price: number;
  };

  const fetchProducts = async () => {
    try {
      const data: products[] | any = await getProducts();
      // setProducts([products?.map((item, i) => {
      //   return {key: i, value: item.name, }
      // })]);
      setProducts(data);
      // console.log(products);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      }
    }
  };

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

  const fetchCustomers = async () => {
    try {
      const data: any = await getAllContacts();
      // console.log(data);
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
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

  const initDatabase = async () => {
    await initDB();
    const currentHistory = await getHistory();
    // console.log(currentHistory.length);
    if (!currentHistory.length) {
      await initHistory();
      console.log("masuk sini");
    }
    await fetchHistory();
  };

  useEffect(() => {
    const loadEverything = async () => {
      await initDatabase();
      await fetchTransactions();
      await fetchHistory();
      await fetchCustomers();
      await fetchProducts();
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    loadEverything();
    // setIsLoading(false);
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        history,
        products,
        lastHistory,
        transactions,
        isLoading,
        setIsLoading,
        customers,
        fetchHistory,
        fetchTransactions,
        fetchCustomers,
        fetchProducts,
      }}>
      {isLoading ? (
        <View className="h-full flex-1 items-center justify-center">
          <Image source={images.logo} className="w-[300px]" resizeMode="contain" />
        </View>
      ) : (
        children
      )}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
