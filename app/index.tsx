import Handle from "@/components/CustomHandle";
import StockItem from "@/components/StockItem";
import images from "@/constants/images";
import { useGlobalContext } from "@/context/GlobalProvider";
import { addHistory, type HistoryDTO } from "@/database/history";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Redirect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Keyboard,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import { RefreshControl } from "react-native-gesture-handler";
import Icon from "react-native-remix-icon";

export default function Home() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const { lastHistory: stocks, products, fetchHistory: fetchStocks } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);
  const [debugMode, setDebugMode] = useState<boolean>(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStocks();
    setRefreshing(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setDebugMode(false);
    }, 500);

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

  if (debugMode) {
    return <Redirect href={"/debug"} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-100 pt-8">
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{
          paddingBottom: 70,
        }}>
        <Header />
        <Saldo stocks={stocks} handlePresentModalPress={handlePresentModalPress} />
        <Stock stocks={stocks} products={products} fetchStocks={fetchStocks} />
      </ScrollView>
      <BottomSheetSaldo bottomSheetModalRef={bottomSheetModalRef} stocks={stocks} fetchStocks={fetchStocks} />
    </SafeAreaView>
  );
}

const Header = () => {
  return (
    <View className="section-1 flex-row items-center px-5 py-2">
      <Icon name="home-4-fill" color="#172554" size={26} />
      <Text className="ml-2 text-2xl font-semibold text-blue-950">Home</Text>
    </View>
  );
};
const Saldo = ({ stocks, handlePresentModalPress }: any) => {
  return (
    <View className="section-2 box-content gap-y-3 px-5 pb-3">
      <View className="profile flex-row items-center justify-between py-1.5">
        {/* <View className="pp-name flex-row items-center gap-3">
          <View className="pp h-8 w-8 items-center justify-center rounded-full border bg-cyan-600">
            <Text className="text-xs font-medium text-white">EM</Text>
          </View>
          <Text className="text-sm font-bold text-blue-950">Euis Marlina</Text>
        </View> */}
        {/* <Icon name="settings-line" size={20} color="#172554"></Icon> */}
      </View>
      <View className="saldo box-content flex-col rounded-lg border border-blue-50 bg-blue-800 px-3 py-2">
        <View className="mb-1 flex-row items-center justify-between">
          <Text className="text-base font-bold text-white">Saldo Toko</Text>
          <Icon name="more-2-fill" color="white" size={12}></Icon>
        </View>
        <View className="mb-1 flex-row">
          <Text className="text-xs font-bold text-white">Rp</Text>
          <Text className="text-xl font-bold text-white">{stocks?.saldo?.toLocaleString("id-ID")},00</Text>
        </View>
        <TouchableOpacity className="w-full flex-row items-center py-1" onPress={handlePresentModalPress}>
          <Text className="text-gray-100 opacity-50">Ubah Saldo</Text>
          <Icon name="arrow-right-s-line" size={12} color="#899ad3"></Icon>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const Stock = ({ stocks, products, fetchStocks }: any) => {
  return (
    <View className="section-3 flex-col gap-y-2 px-5">
      <Text className="mb-2 text-sm font-bold text-blue-950">Stok/Harga Galon</Text>
      <View className="stok-row-1 mb-4 flex-row justify-between">
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

      <View className="stok-row-2 mb-4 flex-row justify-between">
        <StockItem
          image={images.galonKosong}
          name="Galon Kosong"
          stock={stocks?.stock_galon_kosong}
          stocks={stocks}
          fetchStocks={fetchStocks}
        />
      </View>
      <View className="stok-row-3 flex-row justify-between">
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
  );
};
const BottomSheetSaldo = ({ bottomSheetModalRef, stocks, fetchStocks }: any) => {
  const snapPoints = useMemo(() => ["40%", "60%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log(index);
    if (index == -1) {
      setSaldoInput(null);
      setNoteInput(undefined);
    }
  }, []);
  const handleSnapPress = useCallback((index: number) => {
    bottomSheetModalRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior={"close"} />
    ),
    []
  );

  const [saldoInput, setSaldoInput] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!saldoInput || !noteInput) return ToastAndroid.show("Input tidak boleh kosong", ToastAndroid.SHORT);
    if (stocks?.saldo + saldoInput < 0) {
      return ToastAndroid.show("Saldo anda tidak cukup", ToastAndroid.SHORT);
    }
    setIsLoading(true);
    const historyEntry: HistoryDTO = {
      ...stocks,
      saldo: stocks?.saldo + saldoInput,
      note: `${noteInput}`,
    };
    await addHistory(historyEntry);
    await fetchStocks();
    setIsLoading(false);
    handleClosePress();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      handleComponent={(props) => Handle({ ...props, HandleText: "Ubah Saldo" })}>
      <BottomSheetScrollView>
        <View className="main gap-y-4 py-3">
          <View className="saldo-input px-3">
            <Text className="mb-2.5 text-sm font-semibold">Jumlah Saldo:</Text>
            <View className="rounded-md border-2 px-3">
              <CurrencyInput
                onFocus={() => handleSnapPress(1)}
                onBlur={() => handleSnapPress(0)}
                placeholder="Masukan Jumlah Saldo"
                keyboardType="number-pad"
                value={saldoInput}
                onChangeValue={setSaldoInput}
                prefix="Rp"
                inputMode="text"
                precision={0}
                showPositiveSign
              />
            </View>
          </View>
          <View className="note-input px-3">
            <Text className="mb-2.5 text-sm font-semibold">Note:</Text>
            <View className="rounded-md border-2 px-3">
              <TextInput
                multiline={true}
                numberOfLines={4}
                value={noteInput}
                onChangeText={(e) => {
                  setNoteInput(e);
                }}
                placeholder="Masukan note"
              />
            </View>
          </View>
          <View className="action-button px-3">
            <TouchableOpacity
              className={`rounded-lg ${isLoading ? "bg-blue-900" : "bg-blue-800"} mb-2.5 px-3 py-2`}
              activeOpacity={0.9}
              onPress={handleSave}
              disabled={isLoading}>
              <ActivityIndicator size={"small"} color={"#ffff"} className={`${!isLoading && "hidden"}`} />
              <Text className={`text-center text-xs font-semibold text-gray-100 ${isLoading && "hidden"}`}>Simpan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
