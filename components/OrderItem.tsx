import { View, Text, TextInput, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "react-native-remix-icon";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Handle from "@/components/CustomHandle";
import CartItem from "@/components/CartItem";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  addHistory,
  getAllContacts,
  getContact,
  getProducts,
  updateTransaction,
} from "@/database/db";
import Popover from "react-native-popover-view";
import images from "@/constants/images";
import { SelectList } from "react-native-dropdown-select-list";

type OrderItem = {
  id: number;
  orderList: any[];
  curCustomerId: number;
  curStatus: string;
  total_price: number;
  date: string;
};

const OrderItem = ({ id, orderList, curCustomerId, curStatus, total_price, date }: OrderItem) => {
  type products = {
    id: number;
    name: string;
    price: number;
    subs_price: number;
  };

  const [status, setStatus] = useState<any>(curStatus);
  const [aquaVal, setAquaVal] = useState(0);
  const [isiUlangVal, setIsiUlangVal] = useState(0);
  const [galonKosongVal, setGalonKosongVal] = useState(0);
  const [gasVal, setGasVal] = useState(0);
  const [gasKosongVal, setGasKosongVal] = useState(0);

  // const [customers, setCustomers] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState(curCustomerId);
  const [total, setTotal] = useState<number>(total_price);
  const { lastHistory: history, setHistory, fetchHistory, fetchTransactions, customers, products, } = useGlobalContext();

  const [customerName, setCustomerName] = useState();
  const [customerType, setCustomerType] = useState();


  const fetchCustomer = async () => {
    try {
      const data: any = await getContact(customerId);
      // console.log(data);
      setCustomerName(data.name);
      setCustomerType(data.isSubscriber);
    } catch (e) {
      if (e instanceof Error) {
        console.log("error", e);
      }
    }
  };

  const fetchOrderList = () => {
    let parsedList = JSON.parse(orderList);
    // console.log(parsedList[1].sum);
    setAquaVal(parsedList[0].sum);
    setIsiUlangVal(parsedList[1].sum);
    setGasVal(parsedList[2].sum);
    setGalonKosongVal(parsedList[3].sum);
    setGasKosongVal(parsedList[4].sum);
    setTotal(total_price);
    setStatus(curStatus);
  };

  useEffect(() => {
    fetchCustomer();
    // fetchTransactions();
  }, [orderList, curCustomerId, curStatus, total_price, status, customers]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback(
    (index: number) => {
      // console.log("handleSheetChanges", index);
      if(index == 0) {
        fetchOrderList();
      }
    },
    [orderList, curCustomerId, curStatus, total_price]
  );
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

  const handleEdit = async () => {
    // console.log(curStatus)
    handlePresentModalPress();
  };

  const handleSave = async () => {
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

    let newOrderList: orderList[];
    newOrderList = [
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

    await updateTransaction(
      { orderList: newOrderList, customerId, status, total_price: total },
      id
    );
    await fetchTransactions();

    // console.log("curStatus", curStatus);
    // console.log("status", status);
    let parsedList = JSON.parse(orderList);
    // console.log(typeof orderList)
    if (curStatus == "lunas" && status == "hutang") {
      await addHistory({
        saldo: history.saldo - total,
        stock_aqua: history.stock_aqua - (aquaVal - parsedList[0].sum),
        stock_galon_kosong:
          history.stock_galon_kosong -
          galonKosongVal +
          (aquaVal - parsedList[0].sum) +
          (isiUlangVal - parsedList[1].sum),
        stock_gas_12kg: history.stock_gas_12kg - (gasVal - parsedList[2].sum),
        stock_gas_kosong: history.stock_gas_kosong - gasKosongVal + (gasVal - parsedList[3].sum),
        stock_isi_ulang: history.stock_isi_ulang - (isiUlangVal - parsedList[1].sum),
        transactionId: id,
      });
    }

    if (curStatus == "lunas" && status == "pinjam") {
      await addHistory({
        saldo: history.saldo - total_price,
        stock_aqua: history.stock_aqua + parsedList[0].sum,
        stock_galon_kosong:
          history.stock_galon_kosong -
          galonKosongVal +
          parsedList[0].sum +
          parsedList[1].sum,
        stock_gas_12kg: history.stock_gas_12kg + parsedList[2].sum,
        stock_gas_kosong: history.stock_gas_kosong - gasKosongVal + parsedList[3].sum,
        stock_isi_ulang: history.stock_isi_ulang + parsedList[1].sum,
        transactionId: id,
      });
    }

    if (curStatus == "lunas" && status == "lunas") {
      await addHistory({
        saldo: history.saldo - (total_price - total),
        stock_aqua: history.stock_aqua - (aquaVal - parsedList[0].sum),
        stock_galon_kosong:
          history.stock_galon_kosong -
          galonKosongVal +
          (aquaVal - parsedList[0].sum) +
          (isiUlangVal - parsedList[1].sum),
        stock_gas_12kg: history.stock_gas_12kg - (gasVal - parsedList[2].sum),
        stock_gas_kosong: history.stock_gas_kosong - gasKosongVal + (gasVal - parsedList[3].sum),
        stock_isi_ulang: history.stock_isi_ulang - (isiUlangVal - parsedList[1].sum),
        transactionId: id,
      });
    }

    if (curStatus == "hutang" && status == "lunas") {
      await addHistory({
        saldo: history.saldo + total,
        stock_aqua: history.stock_aqua - (aquaVal - parsedList[0].sum),
        stock_galon_kosong:
          history.stock_galon_kosong -
          galonKosongVal +
          (aquaVal - parsedList[0].sum) +
          (isiUlangVal - parsedList[1].sum),
        stock_gas_12kg: history.stock_gas_12kg - (gasVal - parsedList[2].sum),
        stock_gas_kosong: history.stock_gas_kosong - gasKosongVal + (gasVal - parsedList[3].sum),
        stock_isi_ulang: history.stock_isi_ulang - (isiUlangVal - parsedList[1].sum),
        transactionId: id,
      });
    }

    if (curStatus == "hutang" && status == "pinjam") {
      await addHistory({
        saldo: history.saldo - total_price,
        stock_aqua: history.stock_aqua + parsedList[0].sum,
        stock_galon_kosong:
          history.stock_galon_kosong -
          galonKosongVal +
          parsedList[0].sum +
          parsedList[1].sum,
        stock_gas_12kg: history.stock_gas_12kg + parsedList[2].sum,
        stock_gas_kosong: history.stock_gas_kosong - gasKosongVal + parsedList[3].sum,
        stock_isi_ulang: history.stock_isi_ulang + parsedList[1].sum,
        transactionId: id,
      });
    }

    if (curStatus == "hutang" && status == "hutang") {
      await addHistory({
        saldo: history.saldo + (total_price - total),
        stock_aqua: history.stock_aqua - (aquaVal - parsedList[0].sum),
        stock_galon_kosong:
          history.stock_galon_kosong -
          galonKosongVal +
          (aquaVal - parsedList[0].sum) +
          (isiUlangVal - parsedList[1].sum),
        stock_gas_12kg: history.stock_gas_12kg - (gasVal - parsedList[2].sum),
        stock_gas_kosong: history.stock_gas_kosong - gasKosongVal + (gasVal - parsedList[3].sum),
        stock_isi_ulang: history.stock_isi_ulang - (isiUlangVal - parsedList[1].sum),
        transactionId: id,
      });
    }

    if (curStatus == "pinjam" && status == "lunas") {
      await addHistory({
        saldo: history.saldo + total,
        stock_aqua: history.stock_aqua - aquaVal ,
        stock_galon_kosong:
          history.stock_galon_kosong +
          parsedList[3].sum +
          aquaVal +
          isiUlangVal,
        stock_gas_12kg: history.stock_gas_12kg - gasVal ,
        stock_gas_kosong: history.stock_gas_kosong + parsedList[4].sum + gasVal ,
        stock_isi_ulang: history.stock_isi_ulang - isiUlangVal,
        transactionId: id,
      });
    }

    if (curStatus == "pinjam" && status == "hutang") {
      await addHistory({
        saldo: history.saldo - total,
        stock_aqua: history.stock_aqua - aquaVal ,
        stock_galon_kosong:
          history.stock_galon_kosong +
          parsedList[3].sum +
          aquaVal +
          isiUlangVal,
        stock_gas_12kg: history.stock_gas_12kg - gasVal ,
        stock_gas_kosong: history.stock_gas_kosong + parsedList[4].sum + gasVal ,
        stock_isi_ulang: history.stock_isi_ulang - isiUlangVal,
        transactionId: id,
      });
    }
    
    if (curStatus == "pinjam" && status == "pinjam") {
      await addHistory({
        saldo: history.saldo,
        stock_aqua: history.stock_aqua,
        stock_galon_kosong:
          history.stock_galon_kosong -
          (galonKosongVal - parsedList[3].sum) +
          aquaVal +
          isiUlangVal,
        stock_gas_12kg: history.stock_gas_12kg ,
        stock_gas_kosong: history.stock_gas_kosong - (gasKosongVal - parsedList[4].sum) + gasVal ,
        stock_isi_ulang: history.stock_isi_ulang,
        transactionId: id,
      });
    }

    fetchHistory();
    handleClosePress();
  };

  const handleSelected = async (id: number) => {
    // console.log(customerType)
    setCustomerId(id);
    const getCustomer: any = await getContact(id);
    setCustomerType(getCustomer.isSubscriber);
    console.log(getCustomer.isSubscriber)
    if (getCustomer.isSubscriber == 0) {
      setTotal(
        aquaVal * products[0]?.price +
          isiUlangVal * products[1]?.price +
          gasVal * products[2]?.price
      );
    } else {
      setTotal(
        aquaVal * products[0]?.subs_price +
          isiUlangVal * products[1]?.subs_price +
          gasVal * products[2]?.price
      );
    }
  };

  return (
    <View className="pesanan-item border rounded-lg p-2.5 flex-row justify-between items-center mb-4">
      <View className="flex-row">
        <View className="bg-gray-200 rounded-full w-10 h-10 items-center justify-center">
          <Icon
            name={`${customerType ? "home-smile-2-line" : "user-3-line"}`}
            size={24}
          />
        </View>
        <View className="ml-4">
          <Text className="text-sm font-medium">{customerName}</Text>
          <Text className="text-xs font-normal text-gray-400">{formatDate(date)}</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        {status == "hutang" && (
          <Text className="bg-red-500 text-gray-50 text-xs font-semibold px-3 py-1 rounded-md mr-2 w-[67px] text-center">
            Hutang
          </Text>
        )}
        {status == "pinjam" && (
          <Text className="bg-yellow-500 text-gray-50 text-xs font-semibold px-3 py-1 rounded-md mr-2 w-[67px] text-center">
            Pinjam
          </Text>
        )}
        {status == "lunas" && (
          <Text className="bg-green-500 text-gray-50 text-xs font-semibold px-3 py-1 rounded-md mr-2 w-[67px] text-center">
            Lunas
          </Text>
        )}

        {/* <Text className="bg-yellow-500 text-gray-50 text-xs font-semibold px-3 py-1 rounded-md mr-2">
          Pinjam
        </Text> */}
        <TouchableOpacity
          onPress={handleEdit}
          activeOpacity={0.9}
        >
          <Icon
            name="pencil-line"
            size={16}
          />
        </TouchableOpacity>
      </View>
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
                  setSelected={(val: any) => {
                    handleSelected(val)
                  }}
                  defaultOption={{ key: curCustomerId, value: customerName }}
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
                price={customerType == 0 ? products[0]?.price : products[0]?.subs_price}
                val={aquaVal}
                setVal={setAquaVal}
                setTotal={setTotal}
                total={total}
                stok={history?.stock_aqua}
              />
              <CartItem
                name="Isi Ulang"
                image={images.isiUlang}
                price={customerType == 0 ? products[1]?.price : products[1]?.subs_price}
                val={isiUlangVal}
                setVal={setIsiUlangVal}
                setTotal={setTotal}
                total={total}
                stok={history?.stock_isi_ulang}
              />
              <CartItem
                name="Gas 12 kg"
                image={images.gas12Kg}
                price={customerType == 0 ? products[2]?.price : products[2]?.subs_price}
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
                      console.log(customerType)
                      setTotal(total + (!customerType ? products[0]?.price : products[0]?.subs_price));
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
                      setTotal(total + (!customerType ? products[1]?.price : products[1]?.subs_price));

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
                      setTotal(total + (!customerType ? products[2]?.price : products[2]?.subs_price));

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
                    setStatus("hutang");
                    setGalonKosongVal(0);
                    setGasKosongVal(0);
                  }}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border font-semibold rounded-md w-[67px] text-center text-xs border-red-500 
                    ${status == "hutang" ? "text-white bg-red-500" : "text-red-500"} `}
                  >
                    Hutang
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setStatus("pinjam");
                    setAquaVal(0);
                    setIsiUlangVal(0);
                    setGasVal(0);
                    setTotal(0);
                  }}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border rounded-md w-[67px] text-center text-xs border-yellow-500 font-semibold
                    ${status == "pinjam" ? "text-white bg-yellow-500" : "text-yellow-500"}`}
                  >
                    Pinjam
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if(curStatus == "pinjam"){
                      setStatus("lunas");
                      return
                    }
                    setStatus("lunas");
                    setGalonKosongVal(0);
                    setGasKosongVal(0);
                  }}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border rounded-md w-[67px] text-center text-xs border-green-500 font-semibold
                    ${status == "lunas" ? "text-white bg-green-500" : "text-green-500"}`}
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
    </View>
  );
};

const formatDate = (timestamp) => {
  // const timestamp = '2024-08-17 08:19:03';
  const date = new Date(timestamp);

  // Membuat array bulan dalam bahasa Indonesia
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Mendapatkan hari, bulan, dan tahun
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // Menggabungkan dalam format yang diinginkan
  const formattedDate = `${day} ${month}, ${year}`;

  return formattedDate;
};

export default OrderItem;
