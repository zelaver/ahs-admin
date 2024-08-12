import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import SearchInput from "@/components/SearchInput";
import Icon from "react-native-remix-icon";
import OrderItem from "@/components/OrderItem";

const Pesanan = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="main py-8">
          <View className="section-1 px-5 py-2">
            <Text className="text-2xl font-semibold">Pesanan</Text>
          </View>
          <View className="section-2 px-5 flex-row items-center ">
            <SearchInput
              placeholder="cari pesanan"
              otherStyles="border flex-1 mr-2"
            />
            <Icon
              name="add-fill"
              size={32}
            ></Icon>
          </View>
          <View className="section-3 px-5 py-3 ">
            
            <View className="pesanan-item border rounded-lg p-2.5 flex-row justify-between items-center mb-4">
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
                <Text className="bg-red-500 text-gray-50 text-xs font-semibold px-3 py-1 rounded-md mr-2">Hutang</Text>
                <Icon name="pencil-line" size={16}></Icon>
              </View>
            </View>
            <OrderItem/>
            <OrderItem/>
            <OrderItem/>
            <OrderItem/>
            <OrderItem/>
            <OrderItem/>
            <OrderItem/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Pesanan;
