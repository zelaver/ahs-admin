import {
  ActivityIndicator,
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
} from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Icon from 'react-native-remix-icon';
// import images from "@/constants/images";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Handle from './CustomHandle';
import { addHistory, updateProductPrice } from '@/database/db';
import CurrencyInput from 'react-native-currency-input';
import { useGlobalContext } from '@/context/GlobalProvider';

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
  const snapPoints = useMemo(() => [!id ? '60%' : '70%'], [id]);
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
    setPrice(prodPrice);
    setSubPrice(prodSubPrice);
    setAddStock(0);
    const backAction = () => {
      bottomSheetModalRef.current?.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [prodPrice, prodSubPrice]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior={'close'} />
    ),
    []
  );

  const [addStock, setAddStock] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    // console.log(name)
    if (addStock == 0 && !addStock && price == prodPrice && subPrice == prodSubPrice) {
      ToastAndroid.show('Masukan jumlah stok!', ToastAndroid.SHORT);
      return;
    }
    if (id && (price != prodPrice || subPrice != prodSubPrice)) {
      await updateProductPrice(id, price, subPrice);
      await fetchProducts();
      ToastAndroid.show('Harga Berhasil Di ubah!', ToastAndroid.SHORT);
      return;
    }
    try {
      if (!stockPrice && id && id != 3) {
        console.log(id);
        ToastAndroid.show('isi harga pembelian/barang', ToastAndroid.SHORT);
        return;
      }
      if (!addStock || ((!stockPrice || stocks.saldo - addStock * stockPrice < 0) && id && id != 3)) {
        ToastAndroid.show('Saldo tidak cukup', ToastAndroid.SHORT);
        return;
      } else if (name == 'Aqua') {
        if (stocks.stock_galon_kosong - addStock < 0)
          return ToastAndroid.show('Galon Kosong tidak Cukup', ToastAndroid.SHORT);
        const newStocks = {
          ...stocks,
          stock_aqua: stock + addStock,
          stock_galon_kosong: stocks.stock_galon_kosong - addStock,
          saldo: stocks.saldo - addStock * stockPrice,
          transactionId: null,
          note: `Tambah stock aqua: ${addStock}/${stockPrice}`,
        };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      } else if (name == 'Isi Ulang') {
        if (stocks.stock_galon_kosong - addStock < 0)
          return ToastAndroid.show('Galon Kosong tidak Cukup', ToastAndroid.SHORT);

        const newStocks = {
          ...stocks,
          stock_isi_ulang: stock + addStock,
          stock_galon_kosong: stocks.stock_galon_kosong - addStock,
          transactionId: null,
          note: `Tambah stock aqua: ${addStock}`,
        };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      } else if (name == 'Galon Kosong') {
        const newStocks = {
          ...stocks,
          stock_galon_kosong: stock + addStock,

          transactionId: null,
          note: `Tambah stock galon kosong: ${addStock}`,
        };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      } else if (name == 'Gas 12 kg') {
        if (stocks.stock_gas_kosong - addStock < 0)
          return ToastAndroid.show('Gas Kosong tidak Cukup', ToastAndroid.SHORT);

        const newStocks = {
          ...stocks,
          stock_gas_12kg: stock + addStock,
          stock_gas_kosong: stocks.stock_gas_kosong - addStock,
          saldo: stocks.saldo - addStock * stockPrice,
          transactionId: null,
          note: `Tambah stock gas: ${addStock}/Rp${stockPrice}`,
        };
        await addHistory({ ...newStocks });
        await fetchStocks();
        handleClosePress();
      } else if (name == 'Gas Kosong') {
        const newStocks = {
          ...stocks,
          stock_gas_kosong: stock + addStock,
          transactionId: null,
          note: `Tambah stock gas: ${addStock}`,
        };
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
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'k';
    }
    return num.toString();
  }

  return (
    <View className={`mini-box flex-1 flex-col gap-y-2 rounded-lg border-2 bg-blue-50 px-3 pb-2 ${otherStyles} `}>
      <View className="flex-row items-center justify-between">
        <Text className="text-xs font-semibold text-gray-700">{name}</Text>
        <Icon name="more-2-fill" color="black" size={12}></Icon>
      </View>
      <View className="flex-row justify-between">
        <View className="justify-center">
          <Text className="stok text-2xl font-semibold text-gray-700">{stock}</Text>
          {price ?
            <Text className="harga text-2xl font-semibold text-gray-700">/{formatNumber(price)}</Text>
          : null}
        </View>
        <Image source={image} resizeMode="contain" className="h-16 w-14" />
      </View>
      <TouchableOpacity onPress={handlePresentModalPress} className="w-full flex-row items-center py-1 opacity-50">
        <Text className="text-xs font-normal text-gray-700">Tambah Stok</Text>
        <Icon name="arrow-right-s-line" size={12} color="#374151"></Icon>
      </TouchableOpacity>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => Handle({ ...props, HandleText: 'Tambah Stock' })}
        enableDynamicSizing>
        <BottomSheetScrollView>
          <View className="main py-3">
            <View className="gambarBarang-jumlah justify-center">
              <View className="mb-2 items-center">
                <Image source={image} resizeMode="contain" className="w-24" />
              </View>
              <View className="jumlah flex-row items-center justify-center gap-x-6">
                <TouchableOpacity
                  className="rounded-full border border-blue-800"
                  onPress={() => setAddStock(addStock - 1)}>
                  <Icon name="subtract-line" size={36} color="#1e40af" />
                </TouchableOpacity>
                <TextInput
                  className="text-2xl font-semibold text-blue-800"
                  keyboardType="number-pad"
                  defaultValue={addStock.toString()}
                  onChangeText={(input) => {
                    // console.log(input == "-")
                    if (input == '-') return;
                    if (!input) return setAddStock(0);
                    setAddStock(parseInt(input));
                  }}></TextInput>
                {/* <Text className="text-2xl font-semibold text-blue-800">{addStock}</Text> */}
                <TouchableOpacity
                  className="rounded-full border border-blue-800"
                  onPress={() => setAddStock(addStock + 1)}>
                  <Icon name="add-line" size={36} color="#1e40af" />
                </TouchableOpacity>
              </View>
            </View>
            <View className={`mt-4 hidden px-3 ${(id == 1 || id == 4) && 'flex'}`}>
              <Text className="mb-2.5 text-sm font-semibold text-blue-800">Harga Pembelian/barang:</Text>
              <View className="rounded-md border-2 border-blue-800 px-3">
                <CurrencyInput
                  // onFocus={() => handleSnapPress(1)}
                  // onBlur={() => handleSnapPress(0)}
                  className="text-blue-800"
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
            <View className={`mt-4 px-3 ${!id && 'hidden'}`}>
              <Text className="mb-2.5 text-sm font-semibold">Harga customer:</Text>
              <View className="rounded-md border-2 px-3">
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
            <View className={`mt-4 px-3 ${!id && 'hidden'}`}>
              <Text className="mb-2.5 text-sm font-semibold">Harga Warung:</Text>
              <View className="rounded-md border-2 px-3">
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
            <View className="action-button mt-4 px-3">
              <TouchableOpacity
                className={`rounded-lg ${isLoading ? 'bg-blue-900' : 'bg-blue-800'} mb-2.5 px-3 py-2`}
                activeOpacity={0.9}
                disabled={isLoading}
                onPress={async () => {
                  setIsLoading(true);
                  await handleSave();
                  setIsLoading(false);
                }}
                // disabled={isLoading}
              >
                <ActivityIndicator size={'small'} color={'#ffff'} className={`${!isLoading && 'hidden'}`} />
                <Text className={`text-center text-xs font-semibold text-gray-100 ${isLoading && 'hidden'}`}>
                  Simpan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default StockItem;
