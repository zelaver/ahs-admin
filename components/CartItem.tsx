import { View, Text, Image, ToastAndroid } from "react-native";
import React, { memo } from "react";
import images from "@/constants/images";
import Icon from "react-native-remix-icon";
import { TouchableOpacity } from "react-native-gesture-handler";

type CartItem = {
  image: any;
  name: string;
  price?: number;
  val: number;
  setVal: any;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  stok: number | any;
};

const CartItem = memo(({ image, name, price = 0, val, setVal, setTotal, total, stok }: CartItem) => {
  return (
    <View className={`cart-item mb-4 px-5 ${!val && "hidden"}`}>
      <View className="flex-row justify-between border-b border-gray-500 py-4">
        <View className="nama-harga">
          <Text className="text-base font-semibold text-gray-700">{name}</Text>
          <Text className={`text-sm font-light ${!price && "hidden"}`}>{price?.toLocaleString()}</Text>
        </View>
        <View className="gambarBarang-jumlah w-[108px] justify-center">
          <View className="mb-2 items-center">
            <Image source={image} resizeMode="contain" className="h-16 w-14" />
          </View>
          <View className="jumlah flex-row items-center justify-between">
            <TouchableOpacity
              className="rounded-full border border-blue-800"
              activeOpacity={0.8}
              onPress={() => {
                if (!val) return;
                setVal(val - 1);
                setTotal(total - price);
              }}>
              <Icon name="subtract-line" size={24} color="#1e40af" />
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-blue-800">
              {val}/{stok}
            </Text>
            <TouchableOpacity
              className="rounded-full border border-blue-800"
              activeOpacity={0.8}
              onPress={() => {
                if (val >= stok) return ToastAndroid.show("Stok tidak Cukup", ToastAndroid.SHORT);
                setVal(val + 1);
                setTotal(total + price);
              }}>
              <Icon name="add-line" size={24} color="#1e40af" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

export default CartItem;
