import DatePicker from "@/components/DatePicker";
import OrderItemBottomSheet from "@/components/OrderBottomSheet";
import { useGlobalContext } from "@/context/GlobalProvider";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Icon from "react-native-remix-icon";

type ChartData = {
  value: number;
  date: string;
  saldo: string;
};

const Histori = () => {
  const { history, fetchHistory } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const formatData: (data: any) => ChartData[] | undefined = (data) => {
    try {
      const saldoTerakhirPerTanggal = data?.reduce((acc, current) => {
        const dateOnly = current?.date?.split(" ")[0]; // Pisahkan tanggal dari waktu
        if (!acc.has(dateOnly)) {
          acc.set(dateOnly, current); // Tambahkan entri pertama untuk tanggal ini
        } else {
          // Update jika entri ini lebih baru
          const existingEntry = acc.get(dateOnly);
          if (new Date(current.date) > new Date(existingEntry.date)) {
            acc.set(dateOnly, current);
          }
        }
        return acc;
      }, new Map());
      // @ts-ignore
      const saldoTerakhir = Array.from(saldoTerakhirPerTanggal.values()).map((entry) => ({
        // @ts-ignore
        date: entry?.date?.split(" ")[0],
        // @ts-ignore
        saldo: entry?.saldo,
      }));

      const formattedData = saldoTerakhir.map((item) => ({
        value: item.saldo / 1000, // Convert saldo to thousands
        saldo: item.saldo.toLocaleString("id-ID"), // Format saldo with thousands separator
        date: new Date(item.date)
          .toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
          .replace(/\./g, ""),
      }));

      return formattedData;
    } catch (e) {
      if (e instanceof Error) {
        ToastAndroid.show(`error: ${e}`, ToastAndroid.SHORT);
        const dummy: ChartData[] = [{ value: 0, saldo: "", date: "" }];
        return dummy;
      }
    }
  };

  const [chartData, setChartData] = useState<ChartData[] | undefined>([]);

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    setChartData(formatData(history));
    setIsLoading(false);
  }, [history]);

  return (
    <SafeAreaView className="flex-1 bg-blue-100 pt-8">
      <View className="section-1 flex-row items-center px-5 py-2">
        <Icon name="history-fill" color="#172554" size={26} />
        <Text className="ml-2 text-2xl font-semibold text-blue-950">Histori</Text>
      </View>
      <View className="mb-32 h-full">
        {isLoading ?
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size={"large"} color={"white"} />
          </View>
        : <ScrollView
            className="main"
            contentContainerStyle={{ paddingBottom: 70 }}
            nestedScrollEnabled
            showsHorizontalScrollIndicator
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <Chart chartData={chartData} />
            <Table history={history} />
          </ScrollView>
        }
      </View>
    </SafeAreaView>
  );
};

const Chart = ({ chartData }) => {
  return (
    <View className="chart px-5 py-2">
      <View className="section-1 flex-row items-center py-2">
        <Text className="mr-3 text-lg font-semibold text-blue-950">Saldo Harian</Text>
      </View>
      <ScrollView className="rounded-md border bg-white py-2 shadow-md">
        <LineChart
          isAnimated
          animationDuration={5000}
          // height={200}
          areaChart
          curved
          data={chartData}
          rotateLabel
          width={300}
          hideDataPoints
          initialSpacing={70}
          indicatorColor={"black"}
          spacing={30}
          endSpacing={50}
          color="#1943b4"
          // thickness={2}
          startFillColor="rgba(25, 67, 180,0.3)"
          endFillColor="rgba(25, 67, 180,0.01)"
          // backgroundColor={"white"}
          startOpacity={0.9}
          endOpacity={0.2}
          noOfSections={6}
          maxValue={chartData.reduce((max, item) => (item.value > max ? item.value : max), chartData[0].value) + 1500}
          yAxisColor="blue"
          yAxisThickness={0}
          rulesType="solid"
          rulesColor="rgba(25, 67, 180,0.3)"
          yAxisTextStyle={{ color: "gray" }}
          yAxisSide="right"
          // xAxisColor="blue"
          xAxisLabelsVerticalShift={10}
          pointerConfig={{
            pointerStripHeight: 150,
            pointerStripColor: "black",
            pointerStripWidth: 2,
            pointerColor: "black",
            radius: 6,
            pointerLabelWidth: 100,
            pointerLabelHeight: 90,
            activatePointersOnLongPress: true,
            autoAdjustPointerLabelPosition: false,
            pointerLabelComponent: (items) => {
              return (
                <View
                  style={{
                    height: 90,
                    width: 100,
                    justifyContent: "center",
                    marginTop: -10,
                    zIndex: 999,
                    marginLeft: -50,
                    display: items[0].value || items[0].value == 0 ? "flex" : "none",
                  }}>
                  <Text
                    style={{
                      color: "black",
                      fontSize: 14,
                      marginBottom: 6,
                      marginTop: 6,
                      textAlign: "center",
                      fontWeight: "bold",
                      minWidth: 120,
                    }}>
                    {items[0].date}
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 6,
                      borderRadius: 16,
                      backgroundColor: "#1e1e1e",
                      minWidth: 120,
                    }}>
                    <Text
                      style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                      }}>
                      {"Rp" + items[0].saldo}
                    </Text>
                  </View>
                </View>
              );
            },
          }}
        />
      </ScrollView>
      {/* <TouchableOpacity
              onPress={() => console.log(chartData[chartData.length - 1].value)}
            >
              <Text>test</Text>
            </TouchableOpacity> */}
    </View>
  );
};

const Table = ({ history }) => {
  const [ascending, setAscending] = useState(false);
  const sort = (a, b) => {
    if (ascending) {
      return b - a;
    } else {
      return a - b;
    }
  };

  const [date, setDate] = useState<Date>(new Date());
  const itemsPerPage = 10;
  const [totalPage, setTotalPage] = useState(
    Math.ceil(
      [...history].filter((item) => new Date(item.date).toLocaleDateString() == date?.toLocaleDateString()).length /
        itemsPerPage
    )
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [mode, setMode] = useState("galon");
  const { transactions } = useGlobalContext();

  const getPaginatedItems = (items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // console.log(currentPage);
    return items.slice(startIndex, endIndex);
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setCurrentPage(1);
    setDate(currentDate);
    // console.log(currentDate.toLocaleDateString());
    setTotalPage(
      Math.ceil(
        [...history].filter((item) => new Date(item.date).toLocaleDateString() == currentDate?.toLocaleDateString())
          .length / itemsPerPage
      )
    );
  };

  useEffect(() => {
    setTotalPage(
      Math.ceil(
        [...history].filter((item) => new Date(item.date).toLocaleDateString() == date?.toLocaleDateString()).length /
          itemsPerPage
      )
    );
    // setCurrentPage(
    //   Math.ceil(
    //     [...history].filter((item) => new Date(item.date).toLocaleDateString() == date?.toLocaleDateString()).length /
    //       itemsPerPage
    //   )
    // );
  }, [history]);

  return (
    <View className="main table px-5">
      <View className="judul flex-row items-center justify-between py-2">
        <View className="flex-row items-center">
          <Text className="mr-2.5 text-lg font-semibold text-blue-950">Stock</Text>
          <TouchableOpacity
            onPress={() => setMode("galon")}
            activeOpacity={0.6}
            className={`w-14 items-center rounded-md px-2 py-1 ${mode == "galon" ? "bg-blue-800" : "border border-blue-800"}`}>
            <Text className={`text-xs font-semibold text-blue-800 ${mode == "galon" ? "text-white" : "text-blue-800"}`}>
              Galon
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode("gas")}
            activeOpacity={0.6}
            className={`ml-2 w-14 items-center rounded-md px-2 py-1 ${mode == "gas" ? "bg-blue-800" : "border border-blue-800"}`}>
            <Text className={`text-xs font-semibold text-blue-800 ${mode == "gas" ? "text-white" : "text-blue-800"}`}>
              Gas
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => setAscending(!ascending)} className="mr-1.5">
            <Icon name={`${ascending ? "sort-desc" : "sort-asc"}`} size={24} color="#172554" />
          </TouchableOpacity>
          <DatePicker date={date} setDate={setDate} onDateChange={onDateChange} containerStyle="rounded-md" />
        </View>
      </View>
      <ScrollView horizontal>
        <View>
          <View className="header rounded-t-lg bg-blue-800 px-2">
            <View className="flex-row items-center">
              {/* <View className="w-24 flex-row justify-center py-2.5 pl-2">
                <Text className="text-center text-sm font-semibold text-white">Tanggal</Text>
              </View> */}
              {mode == "galon" && (
                <>
                  <View className="w-20 flex-row justify-center py-2.5 pl-2">
                    <Text className="text-center text-sm font-semibold text-white">Aqua</Text>
                  </View>
                  <View className="w-20 flex-row justify-center py-2.5 pl-2">
                    <Text className="w-20 text-center text-sm font-semibold text-white">Isi Ulang</Text>
                  </View>
                  <View className="w-20 flex-row justify-center py-2.5 pl-2">
                    <Text className="text-center text-sm font-semibold text-white">Galon Kosong</Text>
                  </View>
                </>
              )}
              {mode == "gas" && (
                <>
                  <View className="w-20 flex-row justify-center py-2.5 pl-2">
                    <Text className="text-center text-sm font-semibold text-white">Gas 12 Kg</Text>
                  </View>
                  <View className="w-20 flex-row justify-center py-2.5 pl-2">
                    <Text className="text-center text-sm font-semibold text-white">Gas Kosong</Text>
                  </View>
                </>
              )}
              <View className="w-36 flex-row justify-center py-2.5 pl-2">
                <Text className="text-center text-sm font-semibold text-white">Saldo</Text>
              </View>
              <View className="w-36 flex-row justify-center py-2.5 pl-2">
                <Text className="text-center text-sm font-semibold text-white">Note</Text>
              </View>
            </View>
          </View>
          <View
            // nestedScrollEnabled
            // ref={scrollViewRef}
            className={"min-h-[410px] border-b border-blue-800 bg-white"}>
            {getPaginatedItems(
              [...history]
                .filter((item) => new Date(item.date).toLocaleDateString() == date?.toLocaleDateString())
                .sort((a, b) => b.id - a.id)
            )
              .sort((a, b) => sort(b.id, a.id))
              .map((item, i) =>
                mode == "galon" ?
                  <RowDataGalon key={i} id={item.id} data={history} transactions={transactions} />
                : <RowDataGas key={i} id={item.id} data={history} transactions={transactions} />
              )}
            {[...history].filter((item) => new Date(item.date).toLocaleDateString() == date?.toLocaleDateString())
              .length == 0 && (
              <View className="ml-24 mt-48">
                <Text className="text-xl">Tidak ada Data :(</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <View className="mx-auto w-full flex-row items-center justify-center rounded-b-md bg-blue-800 py-2">
        <TouchableOpacity
          className="mr-4"
          disabled={currentPage == 1 || totalPage == 0}
          onPress={() => {
            if (currentPage == 1) return ToastAndroid.show(`sudah history paling awal`, ToastAndroid.SHORT);
            setCurrentPage(currentPage - 1);
          }}>
          <Icon name="arrow-left-s-line" color={`${currentPage == 1 || totalPage == 0 ? "gray" : "white"}`} />
        </TouchableOpacity>
        <Text className="mr-4 text-lg font-semibold text-white">{currentPage}</Text>
        <TouchableOpacity
          disabled={currentPage == totalPage || totalPage == 0}
          onPress={() => {
            if (currentPage == totalPage) return ToastAndroid.show(`sudah history paling akhir`, ToastAndroid.SHORT);
            setCurrentPage(currentPage + 1);
          }}>
          <Icon name="arrow-right-s-line" color={`${currentPage == totalPage || totalPage == 0 ? "gray" : "white"}`} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const RowDataGalon = ({ id, data, transactions }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const dataRow = data.find((item) => item.id == id);
  // if()
  const dataRowBefore = data.find((item) => item.id == id - 1);
  const dataTransaction = transactions.find((item) => item.id == dataRow.transactionId);
  // Jika tidak ada data galon yang berubah maka hide
  // if (
  //   dataRow.stock_aqua - dataRowBefore?.stock_aqua == 0 &&
  //   dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang == 0 &&
  //   dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong == 0
  // ) {
  //   return null;
  // }
  const handleOpenInfo = () => {
    if (!dataTransaction) {
      ToastAndroid.show("Tidak ada transaksi di data ini!", ToastAndroid.SHORT);
      return;
    }
    handlePresentModalPress();
    // console.log(JSON.parse(dataTransaction.orderList)[0]);
    // console.log(typeof JSON.parse(dataTransaction.orderList));
  };

  return (
    <>
      <TouchableOpacity className="row-data border-b bg-white px-2" onPress={handleOpenInfo}>
        <View className="flex-row">
          {/* <View className="w-24 flex-row border-r py-2.5 pl-2">
          <Text className="mr-2 text-sm text-gray-700">{new Date(dataRow.date).toLocaleDateString()}</Text>
        </View> */}
          <View className="w-20 flex-row border-r py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_aqua}</Text>
            <View className="flex-row">
              <Text
                className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_aqua - dataRowBefore?.stock_aqua == 0 && "hidden"} ${
                  dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0 ? "text-green-500" : "text-red-500"
                }`}>
                {Math.abs(dataRow.stock_aqua - dataRowBefore?.stock_aqua)}
              </Text>
              <View
                className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_aqua - dataRowBefore?.stock_aqua == 0 && "hidden"}`}>
                <Icon
                  name={`${dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                  size={12}
                  color={`${dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0 ? "#22c55e" : "#ef4444"}`}
                />
              </View>
            </View>
          </View>
          <View className="w-20 flex-row border-r py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_isi_ulang}</Text>
            <View className="flex-row">
              <Text
                className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang == 0 && "hidden"} ${
                  dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0 ? "text-green-500" : "text-red-500"
                }`}>
                {Math.abs(dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang)}
              </Text>
              <View
                className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang == 0 && "hidden"}`}>
                <Icon
                  name={`${dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                  size={12}
                  color={`${dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0 ? "#22c55e" : "#ef4444"}`}
                />
              </View>
            </View>
          </View>
          <View className="w-20 flex-row border-r py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_galon_kosong}</Text>
            <View className="flex-row">
              <Text
                className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong == 0 && "hidden"} ${
                  dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0 ? "text-green-500" : "text-red-500"
                }`}>
                {Math.abs(dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong)}
              </Text>
              <View
                className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong == 0 && "hidden"}`}>
                <Icon
                  name={`${dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                  size={12}
                  color={`${dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0 ? "#22c55e" : "#ef4444"}`}
                />
              </View>
            </View>
          </View>
          {/* <View className="w-20 flex-row border-r py-2.5 pl-2">
          <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_gas_12kg}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg == 0 && "hidden"} ${
                dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0 ? "text-green-500" : "text-red-500"
              }`}>
              {Math.abs(dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg == 0 && "hidden"}`}>
              <Icon
                name={`${dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                size={12}
                color={`${dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0 ? "#22c55e" : "#ef4444"}`}
              />
            </View>
          </View>
        </View>
        <View className="w-20 flex-row border-r py-2.5 pl-2">
          <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_gas_kosong}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong == 0 && "hidden"} ${
                dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0 ? "text-green-500" : "text-red-500"
              }`}>
              {Math.abs(dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong == 0 && "hidden"}`}>
              <Icon
                name={`${dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                size={12}
                color={`${dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0 ? "#22c55e" : "#ef4444"}`}
              />
            </View>
          </View>
        </View> */}
          <View className="w-36 flex-row border-r py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.saldo.toLocaleString()}</Text>
            <View className="flex-row">
              <Text
                className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.saldo - dataRowBefore?.saldo == 0 && "hidden"} ${
                  dataRow.saldo - dataRowBefore?.saldo > 0 ? "text-green-500" : "text-red-500"
                }`}>
                {Math.abs(dataRow.saldo - dataRowBefore?.saldo).toLocaleString()}
              </Text>
              <View
                className={`icon ${!dataRowBefore && "hidden"} ${dataRow.saldo - dataRowBefore?.saldo == 0 && "hidden"}`}>
                <Icon
                  name={`${dataRow.saldo - dataRowBefore?.saldo > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                  size={12}
                  color={`${dataRow.saldo - dataRowBefore?.saldo > 0 ? "#22c55e" : "#ef4444"}`}
                />
              </View>
            </View>
          </View>
          <View className="w-36 flex-row py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.note}</Text>
            {/* <TouchableOpacity
            onPress={() => {
              console.log(dataRow.date.split(" ")[0]);
            }}>
            <Text className="rounded-md border px-2 text-center">Debug</Text>
          </TouchableOpacity> */}
          </View>
        </View>
        {dataTransaction && (
          <OrderItemBottomSheet
            editable={false}
            bottomSheetModalRef={bottomSheetModalRef}
            id={dataTransaction?.id}
            orderList={JSON.parse(dataTransaction?.orderList)}
            curCustomerId={dataTransaction?.customerId}
            curStatus={dataTransaction?.status}
            curDate={dataTransaction?.date}
            curOngkir={dataTransaction?.ongkir}
            total_price={dataTransaction?.total_price}
          />
        )}
      </TouchableOpacity>
    </>
  );
};
const RowDataGas = ({ id, data, transactions }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const dataRow = data.find((item) => item.id == id);
  // if()
  const dataRowBefore = data.find((item) => item.id == id - 1);
  // if (
  //   dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg == 0 &&
  //   dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong == 0
  // ) {
  //   return null;
  // }

  const dataTransaction = transactions.find((item) => item.id == dataRow.transactionId);

  const handleOpenInfo = () => {
    if (!dataTransaction) {
      ToastAndroid.show("Tidak ada transaksi di data ini!", ToastAndroid.SHORT);
      return;
    }
    handlePresentModalPress();
    // console.log(JSON.parse(dataTransaction.orderList)[0]);
    // console.log(typeof JSON.parse(dataTransaction.orderList));
  };

  return (
    <>
      <TouchableOpacity className="row-data border-b bg-white px-2" onPress={handleOpenInfo}>
        <View className="flex-row">
          {/* <View className="w-24 flex-row border-r py-2.5 pl-2">
          <Text className="mr-2 text-sm text-gray-700">{new Date(dataRow.date).toLocaleDateString()}</Text>
        </View> */}
          {/* <View className="w-20 flex-row border-r py-2.5 pl-2">
          <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_aqua}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_aqua - dataRowBefore?.stock_aqua == 0 && "hidden"} ${
                dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0 ? "text-green-500" : "text-red-500"
              }`}>
              {Math.abs(dataRow.stock_aqua - dataRowBefore?.stock_aqua)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_aqua - dataRowBefore?.stock_aqua == 0 && "hidden"}`}>
              <Icon
                name={`${dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                size={12}
                color={`${dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0 ? "#22c55e" : "#ef4444"}`}
              />
            </View>
          </View>
        </View>
        <View className="w-20 flex-row border-r py-2.5 pl-2">
          <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_isi_ulang}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang == 0 && "hidden"} ${
                dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0 ? "text-green-500" : "text-red-500"
              }`}>
              {Math.abs(dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang == 0 && "hidden"}`}>
              <Icon
                name={`${dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                size={12}
                color={`${dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0 ? "#22c55e" : "#ef4444"}`}
              />
            </View>
          </View>
        </View>
        <View className="w-20 flex-row border-r py-2.5 pl-2">
          <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_galon_kosong}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong == 0 && "hidden"} ${
                dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0 ? "text-green-500" : "text-red-500"
              }`}>
              {Math.abs(dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong == 0 && "hidden"}`}>
              <Icon
                name={`${dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                size={12}
                color={`${dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0 ? "#22c55e" : "#ef4444"}`}
              />
            </View>
          </View>
        </View> */}
          <View className="w-20 flex-row border-r py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_gas_12kg}</Text>
            <View className="flex-row">
              <Text
                className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg == 0 && "hidden"} ${
                  dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0 ? "text-green-500" : "text-red-500"
                }`}>
                {Math.abs(dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg)}
              </Text>
              <View
                className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg == 0 && "hidden"}`}>
                <Icon
                  name={`${dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                  size={12}
                  color={`${dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0 ? "#22c55e" : "#ef4444"}`}
                />
              </View>
            </View>
          </View>
          <View className="w-20 flex-row border-r py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.stock_gas_kosong}</Text>
            <View className="flex-row">
              <Text
                className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong == 0 && "hidden"} ${
                  dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0 ? "text-green-500" : "text-red-500"
                }`}>
                {Math.abs(dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong)}
              </Text>
              <View
                className={`icon ${!dataRowBefore && "hidden"} ${dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong == 0 && "hidden"}`}>
                <Icon
                  name={`${dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                  size={12}
                  color={`${dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0 ? "#22c55e" : "#ef4444"}`}
                />
              </View>
            </View>
          </View>
          <View className="w-36 flex-row border-r py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.saldo.toLocaleString()}</Text>
            <View className="flex-row">
              <Text
                className={`text-xs ${!dataRowBefore && "hidden"} ${dataRow.saldo - dataRowBefore?.saldo == 0 && "hidden"} ${
                  dataRow.saldo - dataRowBefore?.saldo > 0 ? "text-green-500" : "text-red-500"
                }`}>
                {Math.abs(dataRow.saldo - dataRowBefore?.saldo).toLocaleString()}
              </Text>
              <View
                className={`icon ${!dataRowBefore && "hidden"} ${dataRow.saldo - dataRowBefore?.saldo == 0 && "hidden"}`}>
                <Icon
                  name={`${dataRow.saldo - dataRowBefore?.saldo > 0 ? "arrow-up-line" : "arrow-down-line"}`}
                  size={12}
                  color={`${dataRow.saldo - dataRowBefore?.saldo > 0 ? "#22c55e" : "#ef4444"}`}
                />
              </View>
            </View>
          </View>
          <View className="w-36 flex-row py-2.5 pl-2">
            <Text className="mr-2 text-sm text-gray-700">{dataRow.note}</Text>
            {/* <TouchableOpacity
            onPress={() => {
              console.log(dataRow.date.split(" ")[0]);
            }}>
            <Text className="rounded-md border px-2 text-center">Debug</Text>
          </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
      {dataTransaction && (
        <OrderItemBottomSheet
          editable={false}
          bottomSheetModalRef={bottomSheetModalRef}
          id={dataTransaction?.id}
          orderList={JSON.parse(dataTransaction?.orderList)}
          curCustomerId={dataTransaction?.customerId}
          curStatus={dataTransaction?.status}
          curDate={dataTransaction?.date}
          curOngkir={dataTransaction?.ongkir}
          total_price={dataTransaction?.total_price}
        />
      )}
    </>
  );
};

export default Histori;
