import { Image, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import React from "react";
import Icon from "react-native-remix-icon";
import images from "@/constants/images";

type StockItem = {
  name: string
  stock: number
  price?: number
  image: any
  otherStyles?: string
}

const StockItem = ({otherStyles, stock, price, name, image} : StockItem) => {
  return (
    <View className={`mini-box border-2 flex-col rounded-lg px-3 flex-1 gap-y-2 pb-2 ${otherStyles} `}>
      <View className="flex-row justify-between items-center ">
        <Text className="text-xs text-gray-700 font-semibold">{name}</Text>
        <Icon
          name="more-2-fill"
          color="black"
          size={12}
        ></Icon>
      </View>
      <View className="flex-row justify-between ">
        <View className="justify-center">
          <Text className="stok text-2xl font-semibold text-gray-700">{stock}</Text>
          {price && (
            <Text className="harga text-2xl font-semibold text-gray-700">/{price}K</Text>
          )}
        </View>
        <Image
          source={image}
          resizeMode="contain"
          className="w-14 h-16"
        />
      </View>
      <View className="flex-row items-center opacity-50">
        <Text className="text-gray-700 text-xs font-normal">Tambah Stok</Text>
        <Icon
          name="arrow-right-s-line"
          size={12}
          color="#374151"
        ></Icon>
      </View>
    </View>
  );
};

export default StockItem;
