import { View, Text } from "react-native";
import React from "react";
import Icon from "react-native-remix-icon";

const PesananItem = () => {
  return (
    <View className="pesanan-item border rounded-lg p-2.5 flex-row justify-between items-center mb-4">
      <View className="flex-row">
        <View className="bg-gray-200 rounded-full w-10 h-10 items-center justify-center">
          <Icon
            name="home-smile-2-line"
            size={24}
          ></Icon>
        </View>
        <View className="ml-4">
          <Text className="text-sm font-medium">Warung Madura</Text>
          <Text className="text-xs font-normal text-gray-400">6 januari, 2024</Text>
        </View>
      </View>
      <View className="flex-row items-center">
        <Text className="bg-yellow-500 text-gray-50 text-xs font-semibold px-3 py-1 rounded-md mr-2">
          Pinjam
        </Text>
        <Icon
          name="pencil-line"
          size={16}
        ></Icon>
      </View>
    </View>
  );
};

export default PesananItem;
