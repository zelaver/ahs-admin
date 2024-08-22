import {
  View,
  Text,
  StyleSheet,
  Button,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Icon from "react-native-remix-icon";
import { useGlobalContext } from "@/context/GlobalProvider";
const Histori = () => {
  const { history, fetchHistory } = useGlobalContext();
  const [ascending, setAscending] = useState(true);

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
  return (
    <SafeAreaView className="py-8">
      <View className="section-1 px-5 py-2 flex-row items-center">
        <Text className="text-2xl font-semibold mr-3">Histori</Text>
        <TouchableOpacity onPress={() => setAscending(!ascending)}>
          <Icon
            name={`${ascending ? "sort-desc" : "sort-asc"}`}
            size={24}
          />
        </TouchableOpacity>
      </View>
      <View>
        <View className="main ">
          <View className="section-2 px-5 py-5">
            <View className="header p-2 bg-blue-800 rounded-tl-md rounded-tr-md">
              <View className="flex-row items-center">
                <Text className="text-sm text-white flex-1 font-semibold mr-2.5">Aqua</Text>
                <Text className="text-sm text-white flex-1 font-semibold mr-2.5">Isi Ulang</Text>
                <Text className="text-sm text-white flex-1 font-semibold mr-2.5">Galon Kosong</Text>
                <Text className="text-sm text-white flex-1 font-semibold mr-2.5">Gas 12 Kg</Text>
                <Text className="text-sm text-white flex-1 font-semibold">Gas Kosong</Text>
              </View>
            </View>
            <ScrollView
              className="h-96"
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
            {/* <RowData /> */}
            {/* <TouchableOpacity
              // onPress={() => console.log(JSON.stringify(history, null, 2))}
              onPress={() => console.log(ascending)}
            >
              <Text>Debug history</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const RowData = ({ id, data }) => {
  const dataRow = data.find((item) => item.id == id);
  // if()
  const dataRowBefore = data.find((item) => item.id == id - 1);
  return (
    <View className="row-data px-2 py-3">
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
