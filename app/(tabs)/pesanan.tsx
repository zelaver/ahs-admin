import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Touchable,
  Easing,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchInput from "@/components/SearchInput";
import Icon from "react-native-remix-icon";
import OrderItem from "@/components/OrderItem";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import CartItem from "@/components/CartItem";
import Handle from "@/components/CustomHandle";
import {
  addHistory,
  addTransaction,
  getAllContacts,
  getHistory,
  getProducts,
  getTransactions,
} from "@/database/db";
import { SelectList } from "react-native-dropdown-select-list";
import { UnknownOutputParams } from "expo-router";
import Popover from "react-native-popover-view/dist/Popover";
import { PopoverPlacement } from "react-native-popover-view";
import images from "@/constants/images";
import { useGlobalContext } from "@/context/GlobalProvider";

const Pesanan = () => {
  type products = {
    id: number;
    name: string;
    price: number;
    subs_price: number;
  };

  const [status, setStatus] = useState<number>(2);
  const [aquaVal, setAquaVal] = useState(0);
  const [isiUlangVal, setIsiUlangVal] = useState(0);
  const [galonKosongVal, setGalonKosongVal] = useState(0);
  const [gasVal, setGasVal] = useState(0);
  const [gasKosongVal, setGasKosongVal] = useState(0);

  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState(null);
  const [total, setTotal] = useState<number>(0);
  const {
    lastHistory: history,
    transactions,
    fetchHistory,
    fetchTransactions,
  } = useGlobalContext();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
    // console.log(products);
    if (index == -1) {
    }
    setStatus(2);
    setAquaVal(0);
    setIsiUlangVal(0);
    setGalonKosongVal(0);
    setGasVal(0);
    setGasKosongVal(0);
    setCustomerId(null);
    setTotal(0);
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"close"}

        // onPress={handleClosePress}
      />
    ),
    []
  );

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
  const fetchCustomers = async () => {
    try {
      const data: any[] | any = await getAllContacts();
      setCustomers(data);
      // console.log(products);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      }
    }
  };

  // const fetchHistory = async () => {
  //   try {
  //     const data: any = await getHistory();
  //     setHistory(data[data.length - 1]);
  //   } catch (e) {
  //     if (e instanceof Error) {
  //       console.log(history);
  //     }
  //   }
  // };

  useEffect(() => {
    fetchProducts();
    fetchCustomers();
    // fetchHistory();
  }, [transactions]);

  const handleSave = async () => {
    // console.log(aquaVal || isiUlangVal || gasVal || galonKosongVal || gasKosongVal)
    if (!aquaVal && !isiUlangVal && !gasVal && !galonKosongVal && !gasKosongVal)
      return ToastAndroid.show("Isi Cart!", ToastAndroid.SHORT);
    if (!customerId) {
      ToastAndroid.show("Pilih Customer!", ToastAndroid.SHORT);
      return;
    }
    type orderList = {
      productid: number;
      sum: number;
    };

    type Transaction = {
      orderList: orderList[];
      customerId: number;
      status: string;
      total_price: number;
    };
    let statusString: string = "";
    switch (status) {
      case 0:
        statusString = "hutang";
        break;
      case 1:
        statusString = "pinjam";
        break;
      case 2:
        statusString = "lunas";
        break;
    }

    let orderList: orderList[];
    orderList = [
      {
        productid: 1,
        sum: aquaVal,
      },
      {
        productid: 2,
        sum: isiUlangVal,
      },
      {
        productid: 3,
        sum: gasVal,
      },
      {
        productid: 4,
        sum: galonKosongVal,
      },
      {
        productid: 5,
        sum: gasKosongVal,
      },
    ];

    // INPUT DATA KE TRANSACTION DULU BIAR DAPET ID DARI TRANSACTION
    await addTransaction({
      orderList: orderList,
      customerId: customerId,
      status: statusString,
      total_price: total,
    });
    const transaction: any[] = await getTransactions();
    const transactionId = transaction[transaction?.length - 1].id;
    // console.log(transactionId);
    // INPUT DATA KE HISTORY
    await addHistory({
      saldo: history.saldo + (status == 0 ? 0 : total),
      stock_aqua: history.stock_aqua - aquaVal,
      stock_galon_kosong: history.stock_galon_kosong - galonKosongVal + aquaVal + isiUlangVal,
      stock_gas_12kg: history.stock_gas_12kg - gasVal,
      stock_gas_kosong: history.stock_gas_kosong - gasKosongVal + gasVal,
      stock_isi_ulang: history.stock_isi_ulang - isiUlangVal,
      transactionId: transactionId,
    });
    fetchHistory();
    fetchTransactions();
    handleClosePress();
    // console.log("id customer:", customerId);
    // console.log("status:", statusString);
    // console.log(JSON.stringify(orderList, null, 2));
    // console.log("total:", total);
    // console.log(JSON.stringify(history[history.length - 1], null, 2));
  };

  const [refreshing, setRefreshing] = useState(false)
  const onRefresh = () => {
    setRefreshing(true)
    fetchTransactions()
    // fetchHistory()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="py-8">
      <View className="header pb-3">
        <View className="section-1 px-5 py-2">
          <Text className="text-2xl font-semibold">Pesanan</Text>
        </View>
        <View className="section-2 px-5 flex-row items-center ">
          <SearchInput
            placeholder="cari pesanan"
            otherStyles="border flex-1 mr-2"
          />
          <TouchableOpacity onPress={handlePresentModalPress}>
            <Icon
              name="add-fill"
              size={32}
            ></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        <View className="main pb-16">
          <View className="section-3 px-5 py-3 ">
            {/* <View className="pesanan-item border rounded-lg p-2.5 flex-row justify-between items-center mb-4">
              <View className="flex-row">
                <View className="bg-gray-200 rounded-full w-10 h-10 items-center justify-center">
                  <Icon
                    name="user-3-line"
                    size={24}
                  ></Icon>
                </View>
                <View className="ml-4">
                  <Text className="text-sm font-medium">AG 5</Text>
                  <Text className="text-xs font-normal text-gray-400">2 juli, 2024</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="bg-red-500 text-gray-50 text-xs font-semibold px-3 py-1 rounded-md mr-2">
                  Hutang
                </Text>
                <Icon
                  name="pencil-line"
                  size={16}
                ></Icon>
              </View>
            </View> */}
            {/* <OrderItem /> */}
            {transactions.map((item: any, i: any) => (
              <OrderItem
                key={i}
                curCustomerId={item.customerId}
                curStatus={item.status}
                date={item.date}
                total_price={item.total_price}
                id={item.id}
                orderList={item.orderList}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => Handle({ ...props, HandleText: "Detail Pesanan" })}
      >
        <BottomSheetScrollView>
          <View className="main py-3 gap-y-4">
            <View className="customer px-3">
              <Text className="text-sm font-semibold mb-2.5">Customer:</Text>
              <View className="rounded-md px-3">
                {/* <TextInput placeholder="isi nama Customer" /> */}
                <SelectList
                  data={[
                    ...customers.map((item, i) => {
                      return { key: item.id, value: item.name };
                    }),
                  ]}
                  setSelected={(val: any) => setCustomerId(val)}
                  // setSelected={val => console.log(val)}
                  placeholder="pilih pelanggan"
                  searchPlaceholder="cari pelanggan"
                />
              </View>
            </View>
            <View className="cart border-t border-b py-4">
              <CartItem
                name="Aqua"
                image={images.aqua}
                price={products[0]?.price}
                val={aquaVal}
                setVal={setAquaVal}
                setTotal={setTotal}
                total={total}
                stok={history?.stock_aqua}
              />
              <CartItem
                name="Isi Ulang"
                image={images.isiUlang}
                price={products[1]?.price}
                val={isiUlangVal}
                setVal={setIsiUlangVal}
                setTotal={setTotal}
                total={total}
                stok={history?.stock_isi_ulang}
              />
              <CartItem
                name="Gas 12 kg"
                image={images.gas12Kg}
                price={products[2]?.price}
                val={gasVal}
                setVal={setGasVal}
                setTotal={setTotal}
                total={total}
                stok={history?.stock_gas_12kg}
              />
              <CartItem
                name="Galon Kosong"
                image={images.galonKosong}
                val={galonKosongVal}
                setVal={setGalonKosongVal}
                setTotal={setTotal}
                total={total}
                stok={history?.stock_galon_kosong}
              />
              <CartItem
                name="Gas Kosong"
                image={images.gasKosong}
                val={gasKosongVal}
                setVal={setGasKosongVal}
                setTotal={setTotal}
                total={total}
                stok={history?.stock_gas_kosong}
              />
              <View className="px-5 add ">
                <Popover
                  animationConfig={{ duration: 200 }}
                  arrowSize={{ width: 0, height: 0 }}
                  backgroundStyle={{ opacity: 0 }}
                  offset={-10}
                  // debug
                  // isVisible={isVisible}
                  popoverStyle={{
                    width: 200,
                    borderWidth: 1,
                    borderRadius: 12,
                    backgroundColor: "#1943b4",
                    // display: aquaVal && isiUlangVal && gasVal ? "none" : "flex"
                  }}
                  from={
                    <TouchableOpacity
                      className={`py-4 items-center ${aquaVal && isiUlangVal && gasVal && "hidden"}
                        ${galonKosongVal && gasKosongVal && "hidden"}
                      `}
                    >
                      <Icon
                        name="add-circle-line"
                        size={32}
                      />
                    </TouchableOpacity>
                  }
                >
                  <TouchableOpacity
                    onPress={() => {
                      if (!history.stock_aqua)
                        return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                      setAquaVal(1);
                      setTotal(total + products[0]?.price);
                    }}
                    className={`border px-4 py-2 ${aquaVal && "hidden"} ${status == 1 && "hidden"}`}
                  >
                    <Text className="text-gray-50 font-semibold">aqua</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!history.stock_isi_ulang)
                        return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                      setIsiUlangVal(1);
                      setTotal(total + products[1]?.price);
                    }}
                    className={`border px-4 py-2 ${isiUlangVal && "hidden"} ${
                      status == 1 && "hidden"
                    }`}
                  >
                    <Text className="text-gray-50 font-semibold">Isi Ulang</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!history.stock_gas_12kg)
                        return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                      setGasVal(1);
                      setTotal(total + products[2]?.price);
                    }}
                    className={`border px-4 py-2 ${gasVal && "hidden"} ${status == 1 && "hidden"}`}
                  >
                    <Text className="text-gray-50 font-semibold">Gas 12 Kg</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!history.stock_galon_kosong)
                        return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                      setGalonKosongVal(1);
                    }}
                    className={`border px-4 py-2 ${galonKosongVal && "hidden"} ${
                      status != 1 && "hidden"
                    }`}
                    disabled={status != 1}
                  >
                    <Text className="text-gray-50 font-semibold">Galon Kosong</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      if (!history.stock_gas_kosong)
                        return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                      setGasKosongVal(1);
                    }}
                    className={`border px-4 py-2 ${gasKosongVal && "hidden"} ${
                      status != 1 && "hidden"
                    }`}
                    disabled={status != 1}
                  >
                    <Text className="text-gray-50 font-semibold">Gas Kosong</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`border px-4 py-2 hidden ${
                      aquaVal && isiUlangVal && gasVal && "flex"
                    }
                    ${galonKosongVal && gasKosongVal && "flex"}
                    `}
                  >
                    <Text className="text-gray-200 font-semibold">Tekan Di luar untuk Tutup</Text>
                  </TouchableOpacity>
                </Popover>
              </View>
            </View>
            <View className={`total px-3 ${status == 1 && "hidden"}`}>
              <View className="py-2 px-3 flex-row justify-between items-center bg-blue-800 rounded-lg">
                <Text className="text-base font-bold text-gray-50">Total pembayaran</Text>
                <Text className="text-sm font-bold text-gray-50">{total.toLocaleString()}</Text>
              </View>
            </View>
            <View className="status px-3">
              <Text className="text-sm font-semibold mb-2.5">Status:</Text>
              <View className="status-boxes self-center flex-row gap-x-3">
                <TouchableOpacity
                  onPress={() => {
                    setStatus(0);
                    setGalonKosongVal(0);
                    setGasKosongVal(0);
                  }}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border font-semibold rounded-md w-[67px] text-center text-xs border-red-500 
                    ${!status ? "text-white bg-red-500" : "text-red-500"} `}
                  >
                    Hutang
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setStatus(1);
                    setAquaVal(0);
                    setIsiUlangVal(0);
                    setGasVal(0);
                    setTotal(0);
                  }}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border rounded-md w-[67px] text-center text-xs border-yellow-500 font-semibold
                    ${status == 1 ? "text-white bg-yellow-500" : "text-yellow-500"}`}
                  >
                    Pinjam
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setStatus(2);
                    setGalonKosongVal(0);
                    setGasKosongVal(0);
                  }}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border rounded-md w-[67px] text-center text-xs border-green-500 font-semibold
                    ${status == 2 ? "text-white bg-green-500" : "text-green-500"}`}
                  >
                    Lunas
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="action-button px-3">
              <TouchableOpacity
                className="rounded-lg bg-blue-800 px-3 py-2 mb-2.5"
                activeOpacity={0.9}
                onPress={() => {
                  handleSave();
                }}
              >
                <Text className="text-center text-gray-100 text-xs font-semibold">Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-lg bg-red-500 px-3 py-2 border"
                activeOpacity={0.9}
              >
                <Text className="text-center text-gray-100 text-xs font-semibold">Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default Pesanan;
