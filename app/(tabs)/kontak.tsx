import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import SearchInput from "@/components/SearchInput";
import Icon from "react-native-remix-icon";

const Kontak = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="main py-8">
          <View className="section-1 px-5 py-2">
            <Text className="text-2xl font-semibold">Kontak</Text>
          </View>
          <View className="section-2 px-5 flex-row items-center ">
            <SearchInput
              placeholder="cari kontak pelanggan"
              otherStyles="border flex-1 mr-2"
            />
            <Icon
              name="add-fill"
              size={32}
            />
          </View>
          <View className="section-3 px-5 py-1.5">
            <View className="kontak-item py-1.5 px-2">
              <View className="flex-row justify-between items-center mb-2.5">
                <Text className="text-base font-medium">1. Warung Ester</Text>
                <Icon
                  name="pencil-line"
                  size={20}
                />
              </View>
              <View className="border rounded-md">
                <View className="phone flex-row items-center border-b">
                  <View className="bg-blue-800 p-2 rounded-tl-sm mr-3">
                    <Icon
                      name="phone-line"
                      size={20}
                      color="white"
                    />
                  </View>
                  <Text className="text-sm font-normal">08203823238</Text>
                </View>
                <View className="jenis flex-row items-center border-b">
                  <View className="bg-blue-800 p-2 rounded-tl-sm mr-3">
                    <Icon
                      name="home-smile-2-line"
                      size={20}
                      color="white"
                    />
                  </View>
                  <Text className="text-sm font-normal">Toko/Warung</Text>
                </View>
                <View className="alamat flex-row items-center">
                  <View className="bg-blue-800 p-2 rounded-tl-sm mr-3">
                    <Icon
                      name="map-pin-2-line"
                      size={20}
                      color="white"
                    />
                  </View>
                  <Text className="text-sm font-normal">Jl. kampar 3</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Kontak;
