import {
  BackHandler,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "react-native-remix-icon";
// import images from "@/constants/images";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Handle from "./CustomHandle";
import { addHistory, updateProductPrice } from "@/database/db";
import CurrencyInput from "react-native-currency-input";
import { useGlobalContext } from "@/context/GlobalProvider";

type StockItem = {
  id?: number;
  name: string;
  stock: number;
  prodPrice?: number;
  prodSubPrice?: number;
  image: any;
  otherStyles?: string;
  stocks: any;
  fetchStocks: () => Promise<void>;
};

const StockItem = ({
  id = 0,
  otherStyles,
  stock,
  prodPrice = 0,
  prodSubPrice = 0,
  name,
  image,
  stocks,
  fetchStocks,
}: StockItem) => {
  const [price, setPrice] = useState<number | null>(prodPrice);
  const [subPrice, setSubPrice] = useState<number | null>(prodSubPrice);
  const [stockPrice, setStockPrice] = useState<number | null>(0);
  const { fetchProducts } = useGlobalContext();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [!id ? "60%" : "70%"], [id]);
  const handlePresentModalPress = useCallback(() => {
    setPrice(prodPrice);
    setSubPrice(prodSubPrice);
    setAddStock(0);
    bottomSheetModalRef.current?.present();
  }, [prodPrice, prodSubPrice]);
  const handleSheetChanges = useCallback((index: number) => {
    if (index == -1) {
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

  const [addStock, setAddStock] = useState<number>(0);

  const handleSave = async () => {
    // console.log(name)
    if (addStock == 0 && !addStock && price == prodPrice && subPrice == prodSubPrice) {
      ToastAndroid.show("Masukan jumlah stok!", ToastAndroid.SHORT);
      return;
    }
    if (id && (price != prodPrice || subPrice != prodSubPrice)) {
      await updateProductPrice(id, price, subPrice);
      fetchProducts();
      ToastAndroid.show("Harga Berhasil Di ubah!", ToastAndroid.SHORT);
      return
    }
    try {
      if(!stockPrice){
        ToastAndroid.show("isi harga pembelian/barang", ToastAndroid.SHORT);
        return
      }
      if (!addStock || !stockPrice || stocks.saldo - addStock * stockPrice < 0 || !stockPrice) {
        ToastAndroid.show("Saldo tidak cukup", ToastAndroid.SHORT);
        return;
      } else if (name == "Aqua") {
        if (stocks.stock_galon_kosong - addStock < 0)
          return ToastAndroid.show("Galon Kosong tidak Cukup", ToastAndroid.SHORT);
        const newStocks = {
          ...stocks,
          stock_aqua: stock + addStock,
          stock_galon_kosong: stocks.stock_galon_kosong - addStock,
          saldo: stocks.saldo - addStock * stockPrice,
          transactionId: null,
        };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      } else if (name == "Isi Ulang") {
        if (stocks.stock_galon_kosong - addStock < 0)
          return ToastAndroid.show("Galon Kosong tidak Cukup", ToastAndroid.SHORT);

        const newStocks = {
          ...stocks,
          stock_isi_ulang: stock + addStock,
          stock_galon_kosong: stocks.stock_galon_kosong - addStock,
          transactionId: null,
        };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      } else if (name == "Galon Kosong") {
        const newStocks = {
          ...stocks,
          stock_galon_kosong: stock + addStock,

          transactionId: null,
        };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      } else if (name == "Gas 12 kg") {
        if (stocks.stock_gas_kosong - addStock < 0)
          return ToastAndroid.show("Gas Kosong tidak Cukup", ToastAndroid.SHORT);

        const newStocks = {
          ...stocks,
          stock_gas_12kg: stock + addStock,
          stock_gas_kosong: stocks.stock_gas_kosong - addStock,
          saldo: stocks.saldo - addStock * stockPrice,
          transactionId: null,
        };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      } else if (name == "Gas Kosong") {
        const newStocks = { ...stocks, stock_gas_kosong: stock + addStock, transactionId: null };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      }
    }
  };

  function formatNumber(num: number) {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "k";
    }
    return num.toString();
  }

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
          {price ? (
            <Text className="harga text-2xl font-semibold text-gray-700">
              /{formatNumber(price)}
            </Text>
          ) : null}
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
        enableDynamicSizing
      >
        <BottomSheetScrollView>
          <View className="main py-3">
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
                <TextInput
                  className="text-2xl font-semibold text-blue-800"
                  keyboardType="number-pad"
                  defaultValue={addStock.toString()}
                  onChangeText={(input) => {
                    // console.log(input == "-")
                    if (input == "-") return;
                    if (!input) return setAddStock(0);
                    setAddStock(parseInt(input));
                  }}
                ></TextInput>
                {/* <Text className="text-2xl font-semibold text-blue-800">{addStock}</Text> */}
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
            <View className={`px-3 mt-4 hidden ${(id == 1 || id == 4) && "flex"}`}>
              <Text className="text-sm font-semibold mb-2.5 text-blue-800">
                Harga Pembelian/barang:
              </Text>
              <View className="border-2 rounded-md px-3 border-blue-800">
                <CurrencyInput
                  // onFocus={() => handleSnapPress(1)}
                  // onBlur={() => handleSnapPress(0)}
                  className="text-blue-800 "
                  placeholder="Masukan Harga"
                  keyboardType="number-pad"
                  value={stockPrice}
                  onChangeValue={setStockPrice}
                  prefix="Rp"
                  // onChangeText={() => console.log()}
                  precision={0}
                  showPositiveSign
                  // minValue={0}
                />
              </View>
            </View>
            <View className={`px-3 mt-4 ${!id && "hidden"}`}>
              <Text className="text-sm font-semibold mb-2.5">Harga customer:</Text>
              <View className="border-2 rounded-md px-3">
                <CurrencyInput
                  // onFocus={() => handleSnapPress(1)}
                  // onBlur={() => handleSnapPress(0)}
                  placeholder="Masukan Harga"
                  keyboardType="number-pad"
                  value={price}
                  onChangeValue={setPrice}
                  prefix="Rp"
                  // onChangeText={() => console.log()}
                  precision={0}
                  showPositiveSign
                  // minValue={0}
                />
              </View>
            </View>
            <View className={`px-3 mt-4 ${!id && "hidden"}`}>
              <Text className="text-sm font-semibold mb-2.5">Harga Warung:</Text>
              <View className="border-2 rounded-md px-3">
                <CurrencyInput
                  // onFocus={() => handleSnapPress(1)}
                  // onBlur={() => handleSnapPress(0)}
                  placeholder="Masukan harga"
                  keyboardType="number-pad"
                  value={subPrice}
                  onChangeValue={setSubPrice}
                  prefix="Rp"
                  // onChangeText={() => console.log(price)}
                  precision={0}
                  showPositiveSign
                  // minValue={0}
                />
              </View>
            </View>
            <View className="action-button px-3 mt-4">
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
