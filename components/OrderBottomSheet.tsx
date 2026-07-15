import CartItem from "@/components/CartItem";
import Handle from "@/components/CustomHandle";
import images from "@/constants/images";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getContact } from "@/database/contact";
import { addHistory, type HistoryDTO } from "@/database/history";
import { deleteTransaction, updateTransaction } from "@/database/transaction";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, Switch, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import CurrencyInput from "react-native-currency-input";
import { SelectList } from "react-native-dropdown-select-list";
import Popover from "react-native-popover-view";
import Icon from "react-native-remix-icon";

const OrderItemBottomSheet = ({
  editable = true,
  bottomSheetModalRef,
  id,
  orderList,
  curCustomerId,
  curStatus,
  curDate,
  curOngkir,
  total_price,
}: any) => {
  type products = {
    id: number;
    name: string;
    price: number;
    subs_price: number;
  };

  const [customerId, setCustomerId] = useState(curCustomerId);

  const { lastHistory: history, fetchHistory, fetchTransactions, customers, products } = useGlobalContext();

  const [aquaVal, setAquaVal] = useState(0);
  const [isiUlangVal, setIsiUlangVal] = useState(0);
  const [galonKosongVal, setGalonKosongVal] = useState(0);
  const [gasVal, setGasVal] = useState(0);
  const [gasKosongVal, setGasKosongVal] = useState(0);
  const [total, setTotal] = useState<number>(total_price);

  const [ongkir, setOngkir] = useState<number | null>(curOngkir);
  const [antar, setAntar] = useState<boolean>(curOngkir ? true : false);

  const [customerType, setCustomerType] = useState(0);

  const [status, setStatus] = useState<any>(curStatus);
  const [date, setDate] = useState(new Date(curDate));

  const snapPoints = useMemo(() => ["90%"], []);
  const handleSheetChanges = useCallback(
    (index: number) => {
      fetchOrderList();
    },
    [orderList, curCustomerId, curStatus, total_price, customers, customerId, date]
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

  const fetchCustomer = async () => {
    try {
      const data: any = await getContact(customerId);
      // console.log(data);
      setCustomerType(data.isSubscriber);
    } catch (e) {
      if (e instanceof Error) {
        console.log("error", e);
      }
    }
  };
  const fetchOrderList = () => {
    let parsedList = typeof orderList == "string" ? JSON.parse(orderList) : orderList;

    setAquaVal(parsedList[0].sum);
    setIsiUlangVal(parsedList[1].sum);
    setGasVal(parsedList[2].sum);
    setGalonKosongVal(parsedList[3].sum);
    setGasKosongVal(parsedList[4].sum);
    setDate(new Date(curDate));
    setAntar(curOngkir ? true : false);
    setOngkir(curOngkir);
    setStatus(curStatus);
    setTotal(total_price + curOngkir);
  };

  useEffect(() => {
    fetchCustomer();
    fetchOrderList();
  }, [orderList, curCustomerId, curStatus, total_price, customers, customerId]);

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

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(new Date().getHours()).padStart(2, "0");
    const minutes = String(new Date().getMinutes()).padStart(2, "0");
    const seconds = String(new Date().getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log(formattedDate);
    await updateTransaction(
      {
        orderList: newOrderList,
        customerId,
        status,
        total_price: total - (ongkir ? ongkir : 0),
        date: formattedDate,
        ongkir: ongkir ? ongkir : 0,
      },
      id
    );
    await fetchTransactions();

    let parsedList = JSON.parse(orderList);

    const oldCart = {
      aqua: parsedList[0].sum,
      isiUlang: parsedList[1].sum,
      gas: parsedList[2].sum,
      galonKosong: parsedList[3].sum,
      gasKosong: parsedList[4].sum,
    };
    const newCart = {
      aqua: aquaVal,
      isiUlang: isiUlangVal,
      gas: gasVal,
      galonKosong: galonKosongVal,
      gasKosong: gasKosongVal,
    };

    const oldEffect = computeEffect(curStatus, oldCart, total_price + curOngkir);
    const newEffect = computeEffect(status, newCart, total);

    console.log("saving edit transaction");
    console.log("old cart", oldCart);
    console.log("new cart", newCart);
    console.log("old effect", oldEffect);
    console.log("new effect", newEffect);

    const currentTimestamp = new Date()

    const newHistory: HistoryDTO = {
      saldo: history.saldo + (newEffect.saldo - oldEffect.saldo),
      stock_aqua: history.stock_aqua + (newEffect.stock_aqua - oldEffect.stock_aqua),
      stock_isi_ulang: history.stock_isi_ulang + (newEffect.stock_isi_ulang - oldEffect.stock_isi_ulang),
      stock_gas_12kg: history.stock_gas_12kg + (newEffect.stock_gas_12kg - oldEffect.stock_gas_12kg),
      stock_galon_kosong: history.stock_galon_kosong + (newEffect.stock_galon_kosong - oldEffect.stock_galon_kosong),
      stock_gas_kosong: history.stock_gas_kosong + (newEffect.stock_gas_kosong - oldEffect.stock_gas_kosong),
      transactionId: id,
      note: "-",
      date: currentTimestamp,
    }
    console.log(newHistory);
    await addHistory(newHistory);

    fetchHistory();
    handleClosePress();
  };

  const handleDelete = async () => {
    let parsedList = JSON.parse(orderList);
    Alert.alert(
      "Yakin ingin menghapus?",
      "gak di balikin loh",
      [
        {
          text: "batal",
          onPress: () => false,
          style: "cancel",
        },
        {
          text: "hapus",
            onPress: async () => {
              await deleteTransaction(id);
              const deletedHistory: HistoryDTO = {
                saldo: history.saldo - (curStatus == "hutang" ? 0 : total_price) - curOngkir,
                stock_aqua: history.stock_aqua + parsedList[0].sum,
                stock_galon_kosong:
                  history.stock_galon_kosong -
                  (curStatus == "pinjam" ? -parsedList[3].sum : parsedList[3].sum) -
                  parsedList[0].sum -
                  parsedList[1].sum,
                stock_gas_12kg: history.stock_gas_12kg + parsedList[2].sum,
                stock_gas_kosong:
                  history.stock_gas_kosong -
                  (curStatus == "pinjam" ? -parsedList[4].sum : parsedList[4].sum) -
                  parsedList[2].sum,
                stock_isi_ulang: history.stock_isi_ulang + parsedList[1].sum,
                transactionId: null,
              };
              await addHistory(deletedHistory);
            await fetchHistory();
            await fetchTransactions();
            handleClosePress();
          },
        },
      ],
      {
        cancelable: true,
        onDismiss() {},
      }
    );
  };

  const handleSelected = async (id: number) => {
    setCustomerId(id);
    const getCustomer: any = await getContact(id);
    setCustomerType(getCustomer.isSubscriber);
    if (getCustomer.isSubscriber == 0) {
      setTotal(aquaVal * products[0]?.price + isiUlangVal * products[1]?.price + gasVal * products[2]?.price + ongkir);
    } else {
      setTotal(
        aquaVal * products[0]?.subs_price + isiUlangVal * products[1]?.subs_price + gasVal * products[2]?.price + ongkir
      );
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleComponent={(props) => Handle({ ...props, HandleText: "Detail Pesanan" })}>
      <BottomSheetScrollView>
        <View className="main gap-y-4 py-3">
          <View className="customer px-3">
            <Text className="mb-2.5 text-sm font-semibold">Customer:</Text>
            <View className="rounded-md px-3">
              {editable ?
                <SelectList
                  data={[
                    ...customers.map((item, i) => {
                      return { key: item.id, value: item.name };
                    }),
                  ]}
                  setSelected={(val: any) => {
                    if (!val) return ToastAndroid.show("Customer tidak terpilih", ToastAndroid.SHORT);
                    handleSelected(val);
                  }}
                  defaultOption={{
                    key: curCustomerId,
                    value: customers?.find((item) => item.id == curCustomerId)?.name,
                  }}
                  // setSelected={val => console.log(val)}

                  placeholder="pilih pelanggan"
                  searchPlaceholder="cari pelanggan"
                />
              : <View className="rounded-lg border border-gray-600 px-5 py-3">
                  <Text>{customers?.find((item) => item.id == curCustomerId)?.name}</Text>
                </View>
              }
            </View>
          </View>
          <View className="cart mb-6 border-b border-t py-4">
            <CartItem
              editable={editable}
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
              editable={editable}
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
              editable={editable}
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
              editable={editable}
              name="Galon Kosong"
              image={images.galonKosong}
              val={galonKosongVal}
              setVal={setGalonKosongVal}
              setTotal={setTotal}
              total={total}
              stok={history?.stock_galon_kosong}
            />
            <CartItem
              editable={editable}
              name="Gas Kosong"
              image={images.gasKosong}
              val={gasKosongVal}
              setVal={setGasKosongVal}
              setTotal={setTotal}
              total={total}
              stok={history?.stock_gas_kosong}
            />
            <View className={`add px-5 ${!editable && "hidden"}`}>
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
                    className={`items-center py-4 ${aquaVal && isiUlangVal && gasVal && "hidden"} ${galonKosongVal && gasKosongVal && "hidden"} `}>
                    <Icon name="add-circle-line" size={32} />
                  </TouchableOpacity>
                }>
                <TouchableOpacity
                  onPress={() => {
                    if (!history.stock_aqua) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                    setAquaVal(1);
                    console.log(customerType);
                    setTotal(total + (!customerType ? products[0]?.price : products[0]?.subs_price));
                  }}
                  className={`border px-4 py-2 ${aquaVal && "hidden"} ${status == "pinjam" && "hidden"}`}>
                  <Text className="font-semibold text-gray-50">aqua</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!history.stock_isi_ulang) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                    setIsiUlangVal(1);
                    setTotal(total + (!customerType ? products[1]?.price : products[1]?.subs_price));
                  }}
                  className={`border px-4 py-2 ${isiUlangVal && "hidden"} ${status == "pinjam" && "hidden"}`}>
                  <Text className="font-semibold text-gray-50">Isi Ulang</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!history.stock_gas_12kg) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                    setGasVal(1);
                    setTotal(total + (!customerType ? products[2]?.price : products[2]?.subs_price));
                  }}
                  className={`border px-4 py-2 ${gasVal && "hidden"} ${status == "pinjam" && "hidden"}`}>
                  <Text className="font-semibold text-gray-50">Gas 12 Kg</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!history.stock_galon_kosong) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                    setGalonKosongVal(1);
                  }}
                  className={`border px-4 py-2 ${galonKosongVal && "hidden"} ${status != "pinjam" && "hidden"}`}
                  disabled={status != "pinjam"}>
                  <Text className="font-semibold text-gray-50">Galon Kosong</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    if (!history.stock_gas_kosong) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                    setGasKosongVal(1);
                  }}
                  className={`border px-4 py-2 ${gasKosongVal && "hidden"} ${status != "pinjam" && "hidden"}`}
                  disabled={status != "pinjam"}>
                  <Text className="font-semibold text-gray-50">Gas Kosong</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`hidden border px-4 py-2 ${aquaVal && isiUlangVal && gasVal && "flex"} ${galonKosongVal && gasKosongVal && "flex"} `}>
                  <Text className="font-semibold text-gray-200">Tekan Di luar untuk Tutup</Text>
                </TouchableOpacity>
              </Popover>
            </View>
          </View>
          {editable ?
            <ShippingCostInput
              ongkir={ongkir}
              setOngkir={setOngkir}
              curOngkir={curOngkir}
              total={total}
              setTotal={setTotal}
              antar={antar}
              setAntar={setAntar}
            />
          : <View className="px-3">
              <Text className="mb-2 text-sm font-bold">Ongkir:</Text>
              <View className="rounded-lg border border-gray-600 px-5 py-3">
                <Text>{curOngkir}</Text>
              </View>
            </View>
          }
          <View className={`total px-3 ${status == 1 && "hidden"} mb-6`}>
            <View className="flex-row items-center justify-between rounded-lg bg-blue-800 px-3 py-2">
              <Text className="text-base font-bold text-gray-50">Total pembayaran</Text>
              <Text className="text-sm font-bold text-gray-50">{total?.toLocaleString()}</Text>
            </View>
          </View>
          <DateInput date={date} setDate={setDate} editable={editable} />
          <View className="status px-3">
            <Text className="mb-2.5 text-sm font-semibold">Status:</Text>
            <View className="status-boxes flex-row gap-x-3 self-center">
              <TouchableOpacity
                disabled={!editable}
                onPress={() => {
                  setStatus("hutang");
                  setGalonKosongVal(0);
                  setGasKosongVal(0);
                }}
                activeOpacity={1}>
                <Text
                  className={`w-min-[67px] rounded-md border border-red-500 px-3 py-1 text-center text-xs font-semibold ${status == "hutang" ? "bg-red-500 text-white" : "text-red-500"} `}>
                  Hutang
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!editable}
                onPress={() => {
                  setStatus("pinjam");
                  setAquaVal(0);
                  setIsiUlangVal(0);
                  setGasVal(0);
                  setTotal(0);
                  setAntar(false);
                  setOngkir(0);
                }}
                activeOpacity={1}>
                <Text
                  className={`w-min-[67px] rounded-md border border-yellow-500 px-3 py-1 text-center text-xs font-semibold ${status == "pinjam" ? "bg-yellow-500 text-white" : "text-yellow-500"}`}>
                  Pinjam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={!editable}
                onPress={() => {
                  if (curStatus == "pinjam") {
                    setStatus("lunas");
                    return;
                  }
                  setStatus("lunas");
                  setGalonKosongVal(0);
                  setGasKosongVal(0);
                }}
                activeOpacity={1}>
                <Text
                  className={`w-min-[67px] rounded-md border border-green-500 px-3 py-1 text-center text-xs font-semibold ${status == "lunas" ? "bg-green-500 text-white" : "text-green-500"}`}>
                  Lunas
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="action-button px-3">
            {editable && (
              <>
                <TouchableOpacity
                  className={`rounded-lg ${isLoading ? "bg-blue-900" : "bg-blue-800"} mb-2.5 px-3 py-2`}
                  activeOpacity={0.9}
                  disabled={isLoading}
                  onPress={async () => {
                    setIsLoading(true);
                    await handleSave();
                    setIsLoading(false);
                  }}>
                  <ActivityIndicator size={"small"} color={"#ffff"} className={`${!isLoading && "hidden"}`} />
                  <Text className={`text-center text-xs font-semibold text-gray-100 ${isLoading && "hidden"}`}>
                    Simpan
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`rounded-lg ${isLoading ? "bg-red-600" : "bg-red-500"} border px-3 py-2`}
                  activeOpacity={0.9}
                  disabled={isLoading}
                  onPress={async () => {
                    setIsLoading(true);
                    await handleDelete();
                    setIsLoading(false);
                  }}>
                  <ActivityIndicator size={"small"} color={"#ffff"} className={`${!isLoading && "hidden"}`} />
                  <Text className={`text-center text-xs font-semibold text-gray-100 ${isLoading && "hidden"}`}>
                    Hapus
                  </Text>
                </TouchableOpacity>
              </>
            )}
            {/* <TouchableOpacity
                onPress={() => {
                  const test = customers.find((item) => item.id == curCustomerId);
                  console.log(test);
                }}
              >
                <Text>test</Text>
              </TouchableOpacity> */}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

// Bottomsheet Component
const DateInput = ({ date, setDate, editable }) => {
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showDateMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onDateChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showDateMode("date");
  };

  const showTimepicker = () => {
    showDateMode("time");
  };
  return (
    <View className="date mb-6 px-3">
      <TouchableOpacity
        disabled={!editable}
        className="flex-row items-center justify-between rounded-lg border border-blue-800 px-3 py-2"
        activeOpacity={0.8}
        onPress={showDatepicker}>
        <Text className="text-sm font-semibold text-blue-800">Tanggal:</Text>
        <Text className="text-sm font-semibold text-blue-800">{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
    </View>
  );
};
const ShippingCostInput = ({ ongkir, setOngkir, curOngkir, total, setTotal, antar, setAntar }: any) => {
  const handleAntar = () => {
    setAntar(!antar);
    if (antar) {
      setOngkir(0);
      setTotal(total - curOngkir);
    } else {
      setOngkir(curOngkir);
      setTotal(total + curOngkir);
    }
  };
  return (
    <View className="ongkir mb-6 items-start px-3">
      <Text className="text-sm font-semibold">Antar:</Text>
      <View>
        <Switch thumbColor={antar ? "#55b8d4" : "gray"} value={antar} onChange={handleAntar} />
      </View>
      {antar && (
        <View className="input-value w-full rounded-md border py-2 pl-3">
          {/* <TextInput /> */}
          <CurrencyInput
            value={ongkir}
            onChangeValue={(e) => {
              setTotal(total + (e - ongkir));
              setOngkir(e);
            }}
            prefix="Rp"
            placeholder="Masukan harga ongkir"
            precision={0}
          />
        </View>
      )}
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

const computeEffect = (
  status: "lunas" | "hutang" | "pinjam",
  cart: {
    aqua: number;
    isiUlang: number;
    gas: number;
    galonKosong: number;
    gasKosong: number;
  },
  totalWithOngkir: number
) => {
  if (status === "lunas" || status === "hutang") {
    return {
      saldo: status === "lunas" ? totalWithOngkir : 0,
      stock_aqua: -cart.aqua,
      stock_isi_ulang: -cart.isiUlang,
      stock_gas_12kg: -cart.gas,
      stock_galon_kosong: cart.aqua + cart.isiUlang,
      stock_gas_kosong: cart.gas,
    };
  }

  // pinjam
  return {
    saldo: 0,
    stock_aqua: 0,
    stock_isi_ulang: 0,
    stock_gas_12kg: 0,
    stock_galon_kosong: -cart.galonKosong,
    stock_gas_kosong: -cart.gasKosong,
  };
};

export default OrderItemBottomSheet;
