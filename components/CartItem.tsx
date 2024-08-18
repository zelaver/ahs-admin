import { View, Text, Image } from "react-native";
import React from "react";
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
};

const CartItem = ({ image, name, price = 0, val, setVal, setTotal, total }: CartItem) => {
  return (
    <View className={`cart-item px-5 mb-4 ${!val && "hidden"}`}>
      <View className="py-4 flex-row justify-between border-b border-gray-500">
        <View className="nama-harga">
          <Text className="text-base font-semibold text-gray-700">{name}</Text>
          <Text className={`text-sm font-light ${!price && 'hidden'}`}>{price?.toLocaleString()}</Text>
        </View>
        <View className="gambarBarang-jumlah w-[108px] justify-center">
          <View className="items-center mb-2">
            <Image
              source={image}
              resizeMode="contain"
              className="w-14 h-16"
            />
          </View>
          <View className="jumlah justify-between flex-row items-center">
            <TouchableOpacity
              className="border-blue-800 rounded-full border"
              activeOpacity={0.8}
              onPress={() => {
                if (!val) return;
                setVal(val - 1);
                setTotal(total - price)
              }}
            >
              <Icon
                name="subtract-line"
                size={24}
                color="#1e40af"
              />
            </TouchableOpacity>
            <Text className="text-sm font-semibold text-blue-800">{val}</Text>
            <TouchableOpacity
              className="border-blue-800 rounded-full border"
              activeOpacity={0.8}
              onPress={() => {
                setVal(val + 1);
                setTotal(total + price)
              }}
            >
              <Icon
                name="add-line"
                size={24}
                color="#1e40af"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
