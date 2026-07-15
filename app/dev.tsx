import CartItem from "@/components/CartItem";
import Handle from "@/components/CustomHandle";
import DatePicker from "@/components/DatePicker";
import OrderItem from "@/components/OrderItem";
import images from "@/constants/images";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getContact } from "@/database/contact";
import { addHistory, type HistoryDTO } from "@/database/history";
import { addTransaction, getTransactions } from "@/database/transaction";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { memo, useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Switch,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import CurrencyInput from "react-native-currency-input";
import { SelectList } from "react-native-dropdown-select-list";
import Popover from "react-native-popover-view";
import Icon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator, Screen } = createMaterialTopTabNavigator();

const PesananDev = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const [ascending, setAscending] = useState(false);
  const [dateFilter, setDateFilter] = useState(new Date());
  const { transactions } = useGlobalContext();
  const onDateChange = (e, selectedDate) => {
    console.log(selectedDate);
    setDateFilter(selectedDate);
  };

  return (
    <>
      <SafeAreaView className="bg-blue-800">
        <View className="section-1 flex-row items-center px-5 py-2.5">
          <Icon name="file-list-fill" color="#eff6ff" size={26} />
          <Text className="ml-2 text-2xl font-semibold text-blue-50">Pesanan</Text>
          <DatePicker
            date={dateFilter}
            setDate={setDateFilter}
            onDateChange={onDateChange}
            containerStyle="ml-auto py-1.5 border-blue-50 "
            textStyle="text-blue-50"
            iconColor="#eff6ff"
          />
          <TouchableOpacity onPress={() => setAscending(!ascending)} className="ml-2">
            <Icon name={`${ascending ? "sort-desc" : "sort-asc"}`} size={24} color="#eff6ff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Navigator
        screenOptions={{
          tabBarLabelStyle: { fontWeight: "bold" },
        }}>
        <Screen
          name="Hutang"
          children={() => (
            <OrderList
              items={[...transactions].filter((item) => item.status == "hutang")}
              dateFilter={dateFilter}
              ascending={ascending}
            />
          )}
          options={{
            title: "Hutang",
            tabBarLabelStyle: { color: "#ef4444", fontWeight: "bold" },
            tabBarIndicatorStyle: { backgroundColor: "#ef4444" },
          }}
        />
        <Screen
          name="Pinjam"
          children={() => (
            <OrderList
              items={[...transactions].filter((item) => item.status == "pinjam")}
              dateFilter={dateFilter}
              ascending={ascending}
            />
          )}
          options={{
            title: "Pinjam",
            tabBarLabelStyle: { color: "#eab308", fontWeight: "bold" },
            tabBarIndicatorStyle: { backgroundColor: "#eab308" },
          }}
        />
        <Screen
          name="Lunas"
          children={() => (
            <OrderList
              items={[...transactions].filter((item) => item.status == "lunas")}
              dateFilter={dateFilter}
              ascending={ascending}
            />
          )}
          options={{
            title: "Lunas",
            tabBarLabelStyle: { color: "#22c55e", fontWeight: "bold" },
            tabBarIndicatorStyle: { backgroundColor: "#22c55e" },
          }}
        />
      </Navigator>
      <BottomSheetAddPesanan bottomSheetModalRef={bottomSheetModalRef} />
      <TouchableOpacity
        onPress={handlePresentModalPress}
        activeOpacity={0.8}
        className="absolute bottom-10 right-5 rounded-full border bg-blue-800">
        <Icon name="add-fill" size={40} color="white"></Icon>
      </TouchableOpacity>
    </>
  );
};

const OrderList = ({ items, dateFilter, ascending }: { items: any[]; dateFilter: Date; ascending: boolean }) => {
  const { fetchTransactions } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
    setRefreshing(false);
  };
  const sort = (a, b) => {
    if (ascending) {
      return b - a;
    } else {
      return a - b;
    }
  };
  return (
    <ScrollView
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      className="bg-blue-50">
      <View className="main pb-16">
        <View className="section-3 px-5 py-3">
          {[...items]
            // .filter((item) => item.status == filterStatus)
            .filter((item) => new Date(item.date).toLocaleDateString() == dateFilter?.toLocaleDateString())
            .sort((a, b) => sort(b.id, a.id))
            .map((item: any, i: any) => (
              <OrderItem
                key={i}
                curCustomerId={item.customerId}
                curStatus={item.status}
                curDate={item.date}
                curOngkir={item.ongkir}
                total_price={item.total_price}
                id={item.id}
                orderList={item.orderList}
              />
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

const BottomSheetAddPesanan = ({ bottomSheetModalRef }: any) => {
  const snapPoints = useMemo(() => ["90%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    if (index == -1) {
      setStatus(2);
      setAquaVal(0);
      setIsiUlangVal(0);
      setGalonKosongVal(0);
      setGasVal(0);
      setGasKosongVal(0);
      setCustomerId(null);
      setIsSubscriber(0);
      setAntar(false);
      setOngkir(0);
      setTotal(0);
    }
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

  const { lastHistory: history, fetchHistory, fetchTransactions, customers, products } = useGlobalContext();
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [isSubscriber, setIsSubscriber] = useState(0);
  const [aquaVal, setAquaVal] = useState(0);
  const [isiUlangVal, setIsiUlangVal] = useState(0);
  const [galonKosongVal, setGalonKosongVal] = useState(0);
  const [gasVal, setGasVal] = useState(0);
  const [gasKosongVal, setGasKosongVal] = useState(0);
  const [status, setStatus] = useState<number>(2);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [ongkir, setOngkir] = useState<number | null>(0);
  const [antar, setAntar] = useState<boolean>(false);
  const [date, setDate] = useState(new Date());

  const handleCustomerSelected = useCallback(
    async (id: number) => {
      setCustomerId(id);
      const getCustomer: any = await getContact(id);
      setIsSubscriber(getCustomer.isSubscriber);
      // console.log(getCustomer.isSubscriber);
      if (getCustomer.isSubscriber == 0) {
        setTotal(
          aquaVal * products[0]?.price +
            isiUlangVal * products[1]?.price +
            gasVal * products[2]?.price +
            (ongkir ? ongkir : 0)
        );
      } else {
        setTotal(
          aquaVal * products[0]?.subs_price +
            isiUlangVal * products[1]?.subs_price +
            gasVal * products[2]?.price +
            (ongkir ? ongkir : 0)
        );
      }
    },
    [customerId, total]
  );

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

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() menghasilkan bulan dengan indeks mulai dari 0
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // INPUT DATA KE TRANSACTION DULU BIAR DAPET ID DARI TRANSACTION
    await addTransaction({
      orderList: orderList,
      customerId: customerId,
      status: statusString,
      ongkir: ongkir ? ongkir : 0,
      total_price: total - (ongkir ? ongkir : 0),
      date: formattedDate,
    });

    // INPUT DATA KE HISTORY
    const transaction: any = await getTransactions();
    const transactionId = transaction[transaction?.length - 1].id;
    const newSaldo = history.saldo + (status == 0 ? 0 : total);
    const newStockAqua = history.stock_aqua - aquaVal;
    const newStockGalonKosong = history.stock_galon_kosong - galonKosongVal + aquaVal + isiUlangVal;
    const newStockGas12kg = history.stock_gas_12kg - gasVal;
    const newStockGasKosong = history.stock_gas_kosong - gasKosongVal + gasVal;
    const newStockIsiUlang = history.stock_isi_ulang - isiUlangVal;
    const newNote = `-`;

    const historyEntry: HistoryDTO = {
      saldo: newSaldo,
      stock_aqua: newStockAqua,
      stock_galon_kosong: newStockGalonKosong,
      stock_gas_12kg: newStockGas12kg,
      stock_gas_kosong: newStockGasKosong,
      stock_isi_ulang: newStockIsiUlang,
      transactionId: transactionId,
      note: newNote,
    };
    await addHistory(historyEntry);

    await fetchHistory();
    await fetchTransactions();
    handleClosePress();
  };

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      handleComponent={(props) => Handle({ ...props, HandleText: "Detail Pesanan" })}>
      <BottomSheetScrollView>
        <View className="main gap-y-4 py-6">
          <CustomerInput customers={customers} handleCustomerSelected={handleCustomerSelected} />
          <CartInput
            products={products}
            history={history}
            isSubscriber={isSubscriber}
            aquaVal={aquaVal}
            setAquaVal={setAquaVal}
            setTotal={setTotal}
            total={total}
            isiUlangVal={isiUlangVal}
            setIsiUlangVal={setIsiUlangVal}
            gasVal={gasVal}
            setGasVal={setGasVal}
            galonKosongVal={galonKosongVal}
            setGalonKosongVal={setGalonKosongVal}
            gasKosongVal={gasKosongVal}
            setGasKosongVal={setGasKosongVal}
            status={status}
          />

          <ShippingCostInput
            ongkir={ongkir}
            setOngkir={setOngkir}
            total={total}
            setTotal={setTotal}
            antar={antar}
            setAntar={setAntar}
          />
          <TotalBox status={status} total={total} />
          <DateInput date={date} setDate={setDate} />
          <StatusBox
            status={status}
            setStatus={setStatus}
            setGalonKosongVal={setGalonKosongVal}
            setGasKosongVal={setGasKosongVal}
            setAquaVal={setAquaVal}
            setIsiUlangVal={setIsiUlangVal}
            setGasVal={setGasVal}
            setAntar={setAntar}
            setOngkir={setOngkir}
            setTotal={setTotal}
          />
          <ActionButton isLoading={isLoading} setIsLoading={setIsLoading} handleSave={handleSave} />
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};
const CustomerInput = memo(({ customers, handleCustomerSelected }: any) => {
  return (
    <View className="customer mb-6 px-3">
      <Text className="mb-2.5 text-sm font-semibold">Customer:</Text>
      <View className="rounded-md px-3">
        {/* <TextInput placeholder="isi nama Customer" /> */}
        <SelectList
          data={[
            ...customers.map((item, i) => {
              return { key: item.id, value: item.name };
            }),
          ]}
          setSelected={(val: any) => {
            // console.log(val)
            if (!val) return ToastAndroid.show("Customer tidak terpilih", ToastAndroid.SHORT);
            handleCustomerSelected(val);
          }}
          placeholder="pilih pelanggan"
          searchPlaceholder="cari pelanggan"
        />
      </View>
    </View>
  );
});
const CartInput = memo(
  ({
    products,
    history,
    isSubscriber,
    aquaVal,
    setAquaVal,
    setTotal,
    total,
    isiUlangVal,
    setIsiUlangVal,
    gasVal,
    setGasVal,
    galonKosongVal,
    setGalonKosongVal,
    gasKosongVal,
    setGasKosongVal,
    status,
  }: any) => {
    return (
      <View className="cart mb-6 border-b border-t py-4">
        <CartItem
          name="Aqua"
          image={images.aqua}
          price={isSubscriber == 0 ? products[0]?.price : products[0]?.subs_price}
          val={aquaVal}
          setVal={setAquaVal}
          setTotal={setTotal}
          total={total}
          stok={history?.stock_aqua}
        />
        <CartItem
          name="Isi Ulang"
          image={images.isiUlang}
          price={isSubscriber == 0 ? products[1]?.price : products[1]?.subs_price}
          val={isiUlangVal}
          setVal={setIsiUlangVal}
          setTotal={setTotal}
          total={total}
          stok={history?.stock_isi_ulang}
        />
        <CartItem
          name="Gas 12 kg"
          image={images.gas12Kg}
          price={isSubscriber == 0 ? products[2]?.price : products[2]?.subs_price}
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
        <View className="add px-5">
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
                // console.log(isSubscriber);
                setTotal(total + (!isSubscriber ? products[0]?.price : products[0]?.subs_price));
              }}
              className={`border px-4 py-2 ${aquaVal && "hidden"} ${status == 1 && "hidden"}`}>
              <Text className="font-semibold text-gray-50">aqua</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!history.stock_isi_ulang) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                setIsiUlangVal(1);
                setTotal(total + (!isSubscriber ? products[1]?.price : products[1]?.subs_price));
              }}
              className={`border px-4 py-2 ${isiUlangVal && "hidden"} ${status == 1 && "hidden"}`}>
              <Text className="font-semibold text-gray-50">Isi Ulang</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!history.stock_gas_12kg) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                setGasVal(1);
                setTotal(total + (!isSubscriber ? products[2]?.price : products[2]?.subs_price));
              }}
              className={`border px-4 py-2 ${gasVal && "hidden"} ${status == 1 && "hidden"}`}>
              <Text className="font-semibold text-gray-50">Gas 12 Kg</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!history.stock_galon_kosong) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                setGalonKosongVal(1);
              }}
              className={`border px-4 py-2 ${galonKosongVal && "hidden"} ${status != 1 && "hidden"}`}
              disabled={status != 1}>
              <Text className="font-semibold text-gray-50">Galon Kosong</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (!history.stock_gas_kosong) return ToastAndroid.show("Stok kosong!", ToastAndroid.SHORT);
                setGasKosongVal(1);
              }}
              className={`border px-4 py-2 ${gasKosongVal && "hidden"} ${status != 1 && "hidden"}`}
              disabled={status != 1}>
              <Text className="font-semibold text-gray-50">Gas Kosong</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`hidden border px-4 py-2 ${aquaVal && isiUlangVal && gasVal && "flex"} ${galonKosongVal && gasKosongVal && "flex"} `}>
              <Text className="font-semibold text-gray-200">Tekan Di luar untuk Tutup</Text>
            </TouchableOpacity>
          </Popover>
        </View>
      </View>
    );
  }
);
const DateInput = ({ date, setDate }) => {
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
        className="flex-row items-center justify-between rounded-lg border border-blue-800 px-3 py-2"
        activeOpacity={0.8}
        onPress={showDatepicker}>
        <Text className="text-sm font-semibold text-blue-800">Tanggal:</Text>
        <Text className="text-sm font-semibold text-blue-800">{date.toLocaleDateString()}</Text>
      </TouchableOpacity>
    </View>
  );
};
const ShippingCostInput = ({ ongkir, setOngkir, total, setTotal, antar, setAntar }: any) => {
  const handleAntar = () => {
    setAntar(!antar);
    if (antar) {
      setOngkir(0);
      setTotal(total - ongkir);
    } else {
      setOngkir(1000);
      setTotal(total + 1000);
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
const TotalBox = ({ status, total }: any) => {
  return (
    <View className={`total mb-6 px-3 ${status == 1 && "hidden"}`}>
      <View className="flex-row items-center justify-between rounded-lg bg-blue-800 px-3 py-2">
        <Text className="text-base font-bold text-gray-50">Total pembayaran</Text>
        <Text className="text-sm font-bold text-gray-50">{total.toLocaleString()}</Text>
      </View>
    </View>
  );
};
const StatusBox = ({
  status,
  setStatus,
  setGalonKosongVal,
  setGasKosongVal,
  setAquaVal,
  setIsiUlangVal,
  setGasVal,
  setAntar,
  setOngkir,
  setTotal,
}: any) => {
  return (
    <View className="status mb-6 px-3">
      <Text className="mb-2.5 text-sm font-semibold">Status:</Text>
      <View className="status-boxes flex-row gap-x-3 self-center">
        <TouchableOpacity
          onPress={() => {
            setStatus(0);
            setGalonKosongVal(0);
            setGasKosongVal(0);
          }}
          activeOpacity={1}>
          <Text
            className={`w-min-[67px] rounded-md border border-red-500 px-3 py-1 text-center text-xs font-semibold ${!status ? "bg-red-500 text-white" : "text-red-500"} `}>
            Hutang
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStatus(1);
            setAquaVal(0);
            setIsiUlangVal(0);
            setGasVal(0);
            setAntar(false);
            setOngkir(0);
            setTotal(0);
          }}
          activeOpacity={1}>
          <Text
            className={`w-min-[67px] rounded-md border border-yellow-500 px-3 py-1 text-center text-xs font-semibold ${status == 1 ? "bg-yellow-500 text-white" : "text-yellow-500"}`}>
            Pinjam
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setStatus(2);
            setGalonKosongVal(0);
            setGasKosongVal(0);
          }}
          activeOpacity={1}>
          <Text
            className={`w-min-[67px] rounded-md border border-green-500 px-3 py-1 text-center text-xs font-semibold ${status == 2 ? "bg-green-500 text-white" : "text-green-500"}`}>
            Lunas
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const ActionButton = ({ isLoading, setIsLoading, handleSave }: any) => {
  return (
    <View className="action-button px-3">
      <TouchableOpacity
        className={`mb-2.5 rounded-lg px-3 py-2 ${isLoading ? "bg-blue-900" : "bg-blue-800"}`}
        activeOpacity={0.9}
        disabled={isLoading}
        onPress={async () => {
          setIsLoading(true);
          await handleSave();
          setIsLoading(false);
        }}>
        <ActivityIndicator size={"small"} color={"#ffff"} className={`${!isLoading && "hidden"}`} />
        <Text className={`text-center text-xs font-semibold text-gray-100 ${isLoading && "hidden"}`}>Simpan</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PesananDev;
