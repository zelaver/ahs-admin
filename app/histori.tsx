import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Icon from "react-native-remix-icon";
import { useGlobalContext } from "@/context/GlobalProvider";
import { LineChart, LineChartPropsType } from "react-native-gifted-charts";

type ChartData = {
  value: number;
  date: string;
  saldo: string;
};

const Histori = () => {
  const { history, fetchHistory } = useGlobalContext();
  const [ascending, setAscending] = useState(false);
  const sort = (a, b) => {
    if (ascending) {
      return b - a;
    } else {
      return a - b;
    }
  };
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const formatData = (data) => {
    const saldoTerakhirPerTanggal = data.reduce((acc, current) => {
      const dateOnly = current.date.split(" ")[0]; // Pisahkan tanggal dari waktu
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
      date: entry.date.split(" ")[0],
      // @ts-ignore
      saldo: entry.saldo,
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
  };

  const [chartData, setChartData] = useState<ChartData[]>(formatData(history));

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setIsLoading(true);
    setChartData(formatData(history));
    setIsLoading(false);
  }, [history]);

  return (
    <SafeAreaView className="pt-8 flex-1 bg-blue-600">
      <View className="section-1 px-5 py-2 flex-row items-center">
        <Text className="text-2xl font-bold mr-3 text-blue-50">Histori</Text>
      </View>
      <View className="h-full mb-32">
        {isLoading ? (
          <View className="flex-1 justify-center items-center ">
            <ActivityIndicator
              size={"large"}
              color={"white"}
            />
          </View>
        ) : (
          <ScrollView
            className="main"
            contentContainerStyle={{ paddingBottom: 70 }}
            nestedScrollEnabled
          >
            <View className="py-2 px-5 chart">
              <View className="section-1 py-2 flex-row items-center">
                <Text className="text-lg font-semibold mr-3 text-blue-50">Saldo Harian</Text>
              </View>
              <View className="bg-white rounded-md py-2 border shadow-md">
                <LineChart
                  areaChart
                  // isAnimated
                  curved
                  // animationDuration={2000}
                  data={chartData}
                  rotateLabel
                  width={300}
                  hideDataPoints
                  spacing={20}
                  color="#1943b4"
                  thickness={2}
                  startFillColor="rgba(25, 67, 180,0.3)"
                  endFillColor="rgba(25, 67, 180,0.01)"
                  // backgroundColor={"white"}
                  endSpacing={-20}
                  startOpacity={0.9}
                  endOpacity={0.2}
                  initialSpacing={40}
                  noOfSections={6}
                  maxValue={chartData[chartData.length - 1].value + 1000}
                  yAxisColor="white"
                  yAxisThickness={0}
                  rulesType="solid"
                  rulesColor="rgba(25, 67, 180,0.3)"
                  yAxisTextStyle={{ color: "gray" }}
                  yAxisSide="right"
                  xAxisColor="lightgray"
                  pointerConfig={{
                    pointerStripHeight: 100,
                    pointerStripColor: "#0481c6",
                    pointerStripWidth: 2,
                    pointerColor: "#0481c6",
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
                          }}
                        >
                          <Text
                            style={{
                              color: "black",
                              fontSize: 14,
                              marginBottom: 6,
                              marginTop: 6,
                              textAlign: "center",
                              fontWeight: "bold",
                              minWidth: 120,
                            }}
                          >
                            {items[0].date}
                          </Text>
                          <View
                            style={{
                              paddingHorizontal: 14,
                              paddingVertical: 6,
                              borderRadius: 16,
                              backgroundColor: "#1e1e1e",
                              minWidth: 120,
                            }}
                          >
                            <Text
                              style={{ fontWeight: "bold", textAlign: "center", color: "white" }}
                            >
                              {"Rp" + items[0].saldo + ",00"}
                            </Text>
                          </View>
                        </View>
                      );
                    },
                  }}
                />
              </View>
              {/* <TouchableOpacity
              onPress={() => console.log(chartData[chartData.length - 1].value)}
            >
              <Text>test</Text>
            </TouchableOpacity> */}
            </View>
            <View className="section-2 px-5 table">
              <View className="section-1 py-2 flex-row items-center ">
                <Text className="text-lg font-semibold mr-2.5 text-blue-50">Stock</Text>
                <TouchableOpacity onPress={() => setAscending(!ascending)}>
                  <Icon
                    name={`${ascending ? "sort-desc" : "sort-asc"}`}
                    size={20}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
              <View className="header p-2 bg-blue-800 rounded-tl-md rounded-tr-md">
                <View className="flex-row items-center">
                  <Text className="text-sm text-white flex-1 font-semibold mr-2.5">Aqua</Text>
                  <Text className="text-sm text-white flex-1 font-semibold mr-2.5">Isi Ulang</Text>
                  <Text className="text-sm text-white flex-1 font-semibold mr-2.5">
                    Galon Kosong
                  </Text>
                  <Text className="text-sm text-white flex-1 font-semibold mr-2.5">Gas 12 Kg</Text>
                  <Text className="text-sm text-white flex-1 font-semibold">Gas Kosong</Text>
                </View>
              </View>
              <ScrollView
                nestedScrollEnabled
                // ref={scrollViewRef}
                className="h-96 border-b border-blue-800"
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                {[...history]
                  .sort((a, b) => sort(b.id, a.id))
                  .map((item, i) => (
                    <RowData
                      key={i}
                      id={item.id}
                      data={history}
                    />
                  ))}
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const RowData = ({ id, data }) => {
  const dataRow = data.find((item) => item.id == id);
  // if()
  const dataRowBefore = data.find((item) => item.id == id - 1);
  return (
    <View className="row-data px-2 py-2.5 bg-white">
      <View className="flex-row">
        <View className="flex-1 mr-2.5 flex-row ">
          <Text className=" text-gray-700 text-sm mr-2">{dataRow.stock_aqua}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${
                dataRow.stock_aqua - dataRowBefore?.stock_aqua == 0 && "hidden"
              } ${
                dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Math.abs(dataRow.stock_aqua - dataRowBefore?.stock_aqua)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${
                dataRow.stock_aqua - dataRowBefore?.stock_aqua == 0 && "hidden"
              }`}
            >
              <Icon
                name={`${
                  dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0
                    ? "arrow-up-line"
                    : "arrow-down-line"
                }`}
                size={12}
                color={`${
                  dataRow.stock_aqua - dataRowBefore?.stock_aqua > 0 ? "#22c55e" : "#ef4444"
                }`}
              />
            </View>
          </View>
        </View>
        <View className="flex-1 mr-2.5 flex-row ">
          <Text className=" text-gray-700 text-sm mr-2">{dataRow.stock_isi_ulang}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${
                dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang == 0 && "hidden"
              } ${
                dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Math.abs(dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${
                dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang == 0 && "hidden"
              }`}
            >
              <Icon
                name={`${
                  dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0
                    ? "arrow-up-line"
                    : "arrow-down-line"
                }`}
                size={12}
                color={`${
                  dataRow.stock_isi_ulang - dataRowBefore?.stock_isi_ulang > 0
                    ? "#22c55e"
                    : "#ef4444"
                }`}
              />
            </View>
          </View>
        </View>
        <View className="flex-1 mr-2.5 flex-row ">
          <Text className=" text-gray-700 text-sm mr-2">{dataRow.stock_galon_kosong}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${
                dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong == 0 && "hidden"
              } ${
                dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Math.abs(dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${
                dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong == 0 && "hidden"
              }`}
            >
              <Icon
                name={`${
                  dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0
                    ? "arrow-up-line"
                    : "arrow-down-line"
                }`}
                size={12}
                color={`${
                  dataRow.stock_galon_kosong - dataRowBefore?.stock_galon_kosong > 0
                    ? "#22c55e"
                    : "#ef4444"
                }`}
              />
            </View>
          </View>
        </View>
        <View className="flex-1 mr-2.5 flex-row ">
          <Text className=" text-gray-700 text-sm mr-2">{dataRow.stock_gas_12kg}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${
                dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg == 0 && "hidden"
              } ${
                dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Math.abs(dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${
                dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg == 0 && "hidden"
              }`}
            >
              <Icon
                name={`${
                  dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0
                    ? "arrow-up-line"
                    : "arrow-down-line"
                }`}
                size={12}
                color={`${
                  dataRow.stock_gas_12kg - dataRowBefore?.stock_gas_12kg > 0 ? "#22c55e" : "#ef4444"
                }`}
              />
            </View>
          </View>
        </View>
        <View className="flex-1 mr-2.5 flex-row ">
          <Text className=" text-gray-700 text-sm mr-2">{dataRow.stock_gas_kosong}</Text>
          <View className="flex-row">
            <Text
              className={`text-xs ${!dataRowBefore && "hidden"} ${
                dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong == 0 && "hidden"
              } ${
                dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Math.abs(dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong)}
            </Text>
            <View
              className={`icon ${!dataRowBefore && "hidden"} ${
                dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong == 0 && "hidden"
              }`}
            >
              <Icon
                name={`${
                  dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0
                    ? "arrow-up-line"
                    : "arrow-down-line"
                }`}
                size={12}
                color={`${
                  dataRow.stock_gas_kosong - dataRowBefore?.stock_gas_kosong > 0
                    ? "#22c55e"
                    : "#ef4444"
                }`}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Histori;
