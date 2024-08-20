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
} from "react-native";
import Icon from "react-native-remix-icon";
import images from "@/constants/images";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Redirect } from "expo-router";
import StockItem from "@/components/StockItem";
import { addHistory, getHistory } from "@/database/db";
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

  const [debugMode, setDebugMode] = useState<boolean>();
  // const [stocks, setStocks] = useState<any>([]);
  const {lastHistory: stocks, setHistory: setStocks, fetchHistory: fetchStocks } = useGlobalContext()
  const [keteranganSaldo, setkKteranganSaldo] = useState();
  const [saldoInput, setSaldoInput] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // const fetchStocks = async () => {
  //   try {
  //     const data: any = await getHistory();
  //     setStocks(data[data.length - 1]);
  //     // console.log(JSON.stringify(stocks, 0 , 2))
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       console.log(e);
  //     }
  //   }
  // };

  useEffect(() => {
    fetchStocks();
    // console.log(stocks)
  }, []);

  if (debugMode) {
    return <Redirect href={"/(tabs)/debug"} />;
  }

  const handleSave = async () => {
    if (!saldoInput) return ToastAndroid.show("Input saldo tidak boleh kosong", ToastAndroid.SHORT);
    if (stocks.saldo + saldoInput < 0)
      return ToastAndroid.show("Saldo anda tidak cukup", ToastAndroid.SHORT);
    await addHistory({ ...stocks, saldo: stocks.saldo + saldoInput });
    await fetchStocks();
    handleClosePress();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStocks();
    setRefreshing(false);
  };

  return (
    <SafeAreaView>
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
                <Text className="text-xl font-bold text-white">
                  {stocks.saldo?.toLocaleString("id-ID")},00
                </Text>
              </View>
              <TouchableOpacity
                className="flex-row items-center"
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
                  onChangeText={() => console.log(saldoInput)}
                  precision={0}
                  showPositiveSign
                  // minValue={0}
                />
              </View>
            </View>

            <View className="action-button px-3">
              <TouchableOpacity
                className={`rounded-lg ${false ? "bg-blue-900" : "bg-blue-800"}  px-3 py-2 mb-2.5`}
                activeOpacity={0.9}
                onPress={handleSave}
              >
                <Text className="text-center text-gray-100 text-xs font-semibold">Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  );
}
