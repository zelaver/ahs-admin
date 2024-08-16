import {
  BackHandler,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "react-native-remix-icon";
// import images from "@/constants/images";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Handle from "./CustomHandle";
import { addHistory } from "@/database/db";

type StockItem = {
  name: string;
  stock: number;
  price?: number;
  image: any;
  otherStyles?: string;
  stocks: any;
  fetchStocks: () => Promise<void>
};

const StockItem = ({ otherStyles, stock, price, name, image, stocks, fetchStocks }: StockItem) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["40%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    if (index == -1) {
      setAddStock(1);
    }
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  useEffect(() => {
    const backAction = () => {
      bottomSheetModalRef.current?.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"close"}
      />
    ),
    []
  );

  const [addStock, setAddStock] = useState<number>(1);

  const handleSave = async () => {
    // console.log(name)
    try {
      if (name == "Aqua") {
        const newStocks = { ...stocks, stock_aqua: stock + addStock, transactionId: null };
        await addHistory({ ...newStocks });
        await fetchStocks()
        handleClosePress()
      } else if (name == "Isi Ulang") {
        const newStocks = { ...stocks, stock_isi_ulang: stock + addStock, transactionId: null };
        await addHistory({ ...newStocks });
        await fetchStocks()
        handleClosePress()
      } else if (name == "Galon Kosong") {
        const newStocks = { ...stocks, stock_galon_kosong: stock + addStock, transactionId: null };
        await addHistory({ ...newStocks });
        await fetchStocks()
        handleClosePress()
      } else if (name == "Gas 12 kg") {
        const newStocks = { ...stocks, stock_gas_12kg: stock + addStock, transactionId: null };
        await addHistory({ ...newStocks });
        await fetchStocks()
        handleClosePress()
      } else if (name == "Gas Kosong") {
        const newStocks = { ...stocks, stock_gas_kosong: stock + addStock, transactionId: null };
        await addHistory({ ...newStocks });
        await fetchStocks()
        handleClosePress()
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      }
    }
  };

  return (
    <View
      className={`mini-box border-2 flex-col rounded-lg px-3 flex-1 gap-y-2 pb-2 ${otherStyles} `}
    >
      <View className="flex-row justify-between items-center ">
        <Text className="text-xs text-gray-700 font-semibold">{name}</Text>
        <Icon
          name="more-2-fill"
          color="black"
          size={12}
        ></Icon>
      </View>
      <View className="flex-row justify-between ">
        <View className="justify-center">
          <Text className="stok text-2xl font-semibold text-gray-700">{stock}</Text>
          {price && <Text className="harga text-2xl font-semibold text-gray-700">/{price}K</Text>}
        </View>
        <Image
          source={image}
          resizeMode="contain"
          className="w-14 h-16"
        />
      </View>
      <View className="flex-row items-center opacity-50">
        <TouchableOpacity onPress={handlePresentModalPress}>
          <Text className="text-gray-700 text-xs font-normal">Tambah Stok</Text>
        </TouchableOpacity>
        <Icon
          name="arrow-right-s-line"
          size={12}
          color="#374151"
        ></Icon>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => Handle({ ...props, HandleText: "Tambah Stock" })}
      >
        <BottomSheetScrollView>
          <View className="main py-3 gap-y-4">
            <View className="gambarBarang-jumlah  justify-center">
              <View className="items-center mb-2">
                <Image
                  source={image}
                  resizeMode="contain"
                  className="w-24"
                />
              </View>
              <View className="jumlah justify-center gap-x-6 flex-row items-center">
                <TouchableOpacity
                  className="border-blue-800 rounded-full border"
                  onPress={() => setAddStock(addStock - 1)}
                >
                  <Icon
                    name="subtract-line"
                    size={36}
                    color="#1e40af"
                  />
                </TouchableOpacity>
                <Text className="text-2xl font-semibold text-blue-800">{addStock}</Text>
                <TouchableOpacity
                  className="border-blue-800 rounded-full border"
                  onPress={() => setAddStock(addStock + 1)}
                >
                  <Icon
                    name="add-line"
                    size={36}
                    color="#1e40af"
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View className="action-button px-3">
              <TouchableOpacity
                className={`rounded-lg ${false ? "bg-blue-900" : "bg-blue-800"}  px-3 py-2 mb-2.5`}
                activeOpacity={0.9}
                onPress={handleSave}
                // disabled={isLoading}
              >
                <Text className="text-center text-gray-100 text-xs font-semibold">Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default StockItem;
