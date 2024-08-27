import {
  BackHandler,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-remix-icon";
import images from "@/constants/images";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Redirect } from "expo-router";
import StockItem from "@/components/StockItem";
import { addHistory } from "@/database/db";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import Handle from "@/components/CustomHandle";
import CurrencyInput from "react-native-currency-input";
import { RefreshControl } from "react-native-gesture-handler";
import { useGlobalContext } from "@/context/GlobalProvider";

export default function Home() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "40%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    // console.log('kocak')
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log(index);
    if (index == -1) {
      setSaldoInput(null);
    }
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    bottomSheetModalRef.current?.snapToIndex(index);
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

    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      bottomSheetModalRef.current?.snapToIndex(1);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      bottomSheetModalRef.current?.snapToIndex(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      backHandler.remove();
    };
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

  const [debugMode, setDebugMode] = useState<boolean>(false);
  // const [stocks, setStocks] = useState<any>([]);
  const {
    lastHistory: stocks,
    setHistory: setStocks,
    products,
    fetchHistory: fetchStocks,
    // isLoading: isGlobalLoading,
  } = useGlobalContext();
  const [keteranganSaldo, setkKteranganSaldo] = useState();
  const [saldoInput, setSaldoInput] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  if (debugMode) {
    return <Redirect href={"/(tabs)/backup"} />;
  }

  // console.log(stocks.length)
  // if (!stocks.length) {
  //   return (
  //     <View className="flex-1 justify-center items-center">
  //       <ActivityIndicator
  //         size={"small"}
  //         color={"black"}
  //       />
  //     </View>
  //   );
  // }

  const [isLoading, setIsLoading] = useState(false);
  const handleSave = async () => {
    if (!saldoInput) return ToastAndroid.show("Input saldo tidak boleh kosong", ToastAndroid.SHORT);
    if (stocks?.saldo + saldoInput < 0) {
      return ToastAndroid.show("Saldo anda tidak cukup", ToastAndroid.SHORT);
    }
    setIsLoading(true);
    await addHistory({ ...stocks, saldo: stocks?.saldo + saldoInput });
    await fetchStocks();
    setIsLoading(false);
    handleClosePress();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStocks();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-blue-600">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View className="main py-8 ">
          <View className="section-1 px-5 py-2">
            <Text className="text-2xl font-semibold text-blue-50">Home</Text>
          </View>
          <View className="section-2 px-5 box-content gap-y-3 pb-3">
            <View className="profile flex-row justify-between items-center py-1.5">
              <View className="pp-name flex-row items-center gap-3">
                <View className="pp bg-cyan-600 w-8 h-8 rounded-full justify-center items-center border">
                  <Text className="text-white text-xs font-medium">EM</Text>
                </View>
                <Text className="text-sm font-bold text-blue-50">Euis Marlina</Text>
              </View>
              <Icon
                name="settings-line"
                size={20}
                color="#fff"
              ></Icon>
            </View>
            <View className="saldo px-3 py-2 bg-blue-800 rounded-lg flex-col box-content border border-blue-50">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-bold text-white ">Saldo Toko</Text>
                <Icon
                  name="more-2-fill"
                  color="white"
                  size={12}
                ></Icon>
              </View>
              <View className="flex-row mb-1">
                <Text className="text-xs font-bold text-white">Rp</Text>
                <Text className="text-xl font-bold text-white">
                  {stocks?.saldo?.toLocaleString("id-ID")},00
                </Text>
              </View>
              <TouchableOpacity
                className="flex-row items-center w-full py-1"
                onPress={handlePresentModalPress}
              >
                <Text className="text-gray-100 opacity-50">Ubah Saldo</Text>
                <Icon
                  name="arrow-right-s-line"
                  size={12}
                  color="#899ad3"
                ></Icon>
              </TouchableOpacity>
            </View>
          </View>
          <View className="section-3 px-5 flex-col gap-y-2 ">
            <Text className="text-sm font-bold text-blue-50 mb-2">Stok/Harga Galon</Text>
            <View className="stok-row-1 flex-row justify-between mb-4 ">
              <StockItem
                id={products[0]?.id}
                otherStyles="mr-2"
                image={images.aqua}
                name="Aqua"
                prodPrice={products[0]?.price}
                prodSubPrice={products[0]?.subs_price}
                stock={stocks?.stock_aqua}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
              <StockItem
                id={products[1]?.id}
                image={images.isiUlang}
                name="Isi Ulang"
                prodPrice={products[1]?.price}
                prodSubPrice={products[1]?.subs_price}
                stock={stocks?.stock_isi_ulang}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
            </View>

            <View className="stok-row-2 flex-row justify-between mb-4">
              <StockItem
                image={images.galonKosong}
                name="Galon Kosong"
                stock={stocks?.stock_galon_kosong}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
            </View>
            <View className="stok-row-3 flex-row justify-between ">
              <StockItem
                id={products[2]?.id}
                otherStyles="mr-2"
                image={images.gas12Kg}
                name="Gas 12 kg"
                stock={stocks?.stock_gas_12kg}
                prodPrice={products[2]?.price}
                prodSubPrice={products[2]?.subs_price}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />

              <StockItem
                image={images.gasKosong}
                name="Gas Kosong"
                stock={stocks?.stock_gas_kosong}
                stocks={stocks}
                fetchStocks={fetchStocks}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        handleComponent={(props) => Handle({ ...props, HandleText: "Ubah Saldo" })}
      >
        <BottomSheetScrollView>
          <View className="main py-3 gap-y-4">
            <View className="nomor telepon px-3 ">
              <Text className="text-sm font-semibold mb-2.5">Jumlah Saldo:</Text>
              <View className="border-2 rounded-md px-3">
                <CurrencyInput
                  onFocus={() => handleSnapPress(1)}
                  onBlur={() => handleSnapPress(0)}
                  placeholder="Masukan Jumlah Saldo"
                  keyboardType="number-pad"
                  value={saldoInput}
                  onChangeValue={setSaldoInput}
                  prefix="Rp"
                  // onChangeText={() => console.log(saldoInput)}
                  precision={0}
                  showPositiveSign
                  // minValue={0}
                />
              </View>
            </View>

            <View className="action-button px-3">
              <TouchableOpacity
                className={`rounded-lg ${
                  isLoading ? "bg-blue-900" : "bg-blue-800"
                }  px-3 py-2 mb-2.5`}
                activeOpacity={0.9}
                onPress={handleSave}
                disabled={isLoading}
              >
                <ActivityIndicator
                  size={"small"}
                  color={"#ffff"}
                  className={`${!isLoading && "hidden"}`}
                />
                <Text
                  className={`text-center text-gray-100 text-xs font-semibold ${
                    isLoading && "hidden"
                  }`}
                >
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
