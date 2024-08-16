import { Image, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import Icon from "react-native-remix-icon";
import images from "@/constants/images";
import { useCallback, useEffect, useRef, useState } from "react";
import { Redirect } from "expo-router";
import StockItem from "@/components/StockItem";
import { getHistory } from "@/database/db";

export default function Home() {
  // let debugMode: boolean = true;

  const [debugMode, setDebugMode] = useState<boolean>();
  const [stocks, setStocks] = useState<any>([]);

  const fetchStocks = async () => {
    try {
      const data: any = await getHistory()
      setStocks(data[data.length - 1])
      // console.log(JSON.stringify(stocks, 0 , 2))

    } catch(e) {
      if(e instanceof Error){
        console.log(e)    
      }
    }
  }
  

  useEffect(() => {
    fetchStocks()

  }, [])

  if (debugMode) {
    return <Redirect href={"/(tabs)/debug"} />;
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="main py-8 ">
          <View className="section-1 px-5 py-2">
            <Text className="text-2xl font-semibold">Home</Text>
          </View>
          <View className="section-2 px-5 box-content gap-y-3 pb-3">
            <View className="profile flex-row justify-between items-center py-1.5">
              <View className="pp-name flex-row items-center gap-3">
                <View className="pp bg-cyan-600 w-8 h-8 rounded-full justify-center items-center border">
                  <Text className="text-white text-xs font-medium">EM</Text>
                </View>
                <Text className="text-sm font-bold">Euis Marlina</Text>
              </View>
              <Icon
                name="settings-line"
                size={20}
                color="#1e40af"
              ></Icon>
            </View>
            <View className="saldo px-3 py-2 bg-blue-800 rounded-lg flex-col box-content">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-bold text-white font-inter ">Saldo Toko</Text>
                <Icon
                  name="more-2-fill"
                  color="white"
                  size={12}
                ></Icon>
              </View>
              <View className="flex-row mb-1">
                <Text className="text-xs font-bold text-white">Rp</Text>
                <Text className="text-xl font-bold text-white">1.800.000,00</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-100 opacity-50">Ubah Saldo</Text>
                <Icon
                  name="arrow-right-s-line"
                  size={12}
                  color="#899ad3"
                ></Icon>
              </View>
            </View>
          </View>
          <View className="section-3 px-5 flex-col gap-y-2 ">
            <Text className="text-sm font-bold text-gray-700 mb-2">Stok/Harga Galon</Text>
            <View className="stok-row-1 flex-row justify-between mb-4 ">
              <StockItem
                otherStyles="mr-2"
                image={images.aqua}
                name="Aqua"
                price={20}
                stock={stocks.stock_aqua}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
              <StockItem
                image={images.isiUlang}
                name="Isi Ulang"
                price={5}
                stock={stocks.stock_isi_ulang}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
            </View>

            <View className="stok-row-2 flex-row justify-between mb-4">
            
              <StockItem
                image={images.galonKosong}
                name="Galon Kosong"
                stock={stocks.stock_galon_kosong}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
            </View>
            <View className="stok-row-3 flex-row justify-between ">
              
              <StockItem
                otherStyles="mr-2"
                image={images.gas12Kg}
                name="Gas 12 kg"
                stock={stocks.stock_gas_12kg}
                price={220}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
             
              <StockItem
                image={images.gasKosong}
                name="Gas Kosong"
                stock={stocks.stock_gas_kosong}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
