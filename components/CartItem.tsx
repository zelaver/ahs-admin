import { View, Text, Image } from "react-native";
import React from "react";
import images from "@/constants/images";
import Icon from "react-native-remix-icon";


const CartItem = () => {
  return (
    <View className="aqua px-5 mb-4">
      <View className="py-4 flex-row justify-between border-b border-gray-500">
        <View className="nama-harga">
          <Text className="text-base font-semibold text-gray-700">Aqua</Text>
          <Text className="text-sm font-light">20.000</Text>
        </View>
        <View className="gambarBarang-jumlah w-[108px] justify-center">
          <View className="items-center mb-2">
            <Image
              source={images.aqua}
              resizeMode="contain"
              className="w-14 h-16"
            />
          </View>
          <View className="jumlah justify-between flex-row items-center">
            <View className="border-blue-800 rounded-full border">
              <Icon
                name="subtract-line"
                size={24}
                color="#1e40af"
              />
            </View>
            <Text className="text-sm font-semibold text-blue-800">1</Text>
            <View className="border-blue-800 rounded-full border">
              <Icon
                name="add-line"
                size={24}
                color="#1e40af"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
