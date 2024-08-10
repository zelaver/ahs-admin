import { Image, Platform, SafeAreaView, ScrollView, Text, View } from "react-native";
import Icon from "react-native-remix-icon";
import images from "@/constants/images";

export default function Home() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="main py-8 ">
          <View className="section-1 px-5 py-2">
            <Text className="text-2xl font-semibold">Home</Text>
          </View>
          <View className="section-2 px-5 box-content gap-y-3 pb-3">
            <View className="profile flex-row justify-between items-center py-1.5">
              <View className="pp-name flex-row items-center gap-3">
                <View className="pp bg-cyan-600 w-8 h-8 rounded-full justify-center items-center border">
                  <Text className="text-white text-xs font-medium">EM</Text>
                </View>
                <Text className="text-sm font-bold">Euis Marlina</Text>
              </View>
              <Icon
                name="settings-line"
                size={20}
                color="#1e40af"
              ></Icon>
            </View>
            <View className="saldo px-3 py-2 bg-blue-800 rounded-lg flex-col box-content">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-base font-bold text-white">Saldo Toko</Text>
                <Icon
                  name="more-2-fill"
                  color="white"
                  size={12}
                ></Icon>
              </View>
              <View className="flex-row mb-1">
                <Text className="text-xs font-bold text-white">Rp</Text>
                <Text className="text-xl font-bold text-white">1.800.000,00</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-100 opacity-50">Ubah Saldo</Text>
                <Icon
                  name="arrow-right-s-line"
                  size={12}
                  color="#899ad3"
                ></Icon>
              </View>
            </View>
          </View>
          <View className="section-3 px-5 flex-col gap-y-2 ">
            <Text className="text-sm font-bold text-gray-700">Stok/Harga Galon</Text>
            <View className="stok-row-1 flex-row justify-between gap-2 ">
              <View className="mini-box border-2 flex-col rounded-lg px-3 flex-1  gap-y-2 pb-2">
                <View className="flex-row justify-between items-center ">
                  <Text className="text-xs text-gray-700 font-semibold">Aqua</Text>
                  <Icon
                    name="more-2-fill"
                    color="black"
                    size={12}
                  ></Icon>
                </View>
                <View className="flex-row justify-between ">
                  <View>
                    <Text className="stok text-2xl font-semibold text-gray-700">28</Text>
                    <Text className="harga text-2xl font-semibold text-gray-700">/20K</Text>
                  </View>
                  <Image
                    source={images.aqua}
                    resizeMode="contain"
                    className="w-14 h-16"
                  />
                </View>
                <View className="flex-row items-center opacity-50">
                  <Text className="text-gray-700 text-xs font-normal">Ubah Saldo</Text>
                  <Icon
                    name="arrow-right-s-line"
                    size={12}
                    color="#374151"
                  ></Icon>
                </View>
              </View>
              <View className="mini-box border-2 flex-col rounded-lg px-3 flex-1  gap-y-2 pb-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-gray-700 font-semibold">Isi Ulang</Text>
                  <Icon
                    name="more-2-fill"
                    color="black"
                    size={12}
                  ></Icon>
                </View>
                <View className="flex-row justify-between">
                  <View>
                    <Text className="stok text-2xl font-semibold text-gray-700">15</Text>
                    <Text className="harga text-2xl font-semibold text-gray-700">/5K</Text>
                  </View>
                  <Image
                    source={images.isiUlang}
                    resizeMode="contain"
                    className="w-14 h-16"
                  />
                </View>
                <View className="flex-row items-center opacity-50">
                  <Text className="text-gray-700 text-xs font-normal">Ubah Saldo</Text>
                  <Icon
                    name="arrow-right-s-line"
                    size={12}
                    color="#374151"
                  ></Icon>
                </View>
              </View> 
            </View>
            
            <View className="stok-row-2 flex-row justify-between gap-2 ">
              <View className="mini-box border-2 flex-col rounded-lg px-3 flex-1  gap-y-2 pb-2">
                <View className="flex-row justify-between items-center ">
                  <Text className="text-xs text-gray-700 font-semibold">Galon kosong</Text>
                  <Icon
                    name="more-2-fill"
                    color="black"
                    size={12}
                  ></Icon>
                </View>
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="stok text-2xl font-semibold text-gray-700">10</Text>
                  </View>
                  <Image
                    source={images.galonKosong}
                    resizeMode="contain"
                    className="w-14 h-16"
                  />
                </View>
                <View className="flex-row items-center opacity-50">
                  <Text className="text-gray-700 text-xs font-normal">Ubah Saldo</Text>
                  <Icon
                    name="arrow-right-s-line"
                    size={12}
                    color="#374151"
                  ></Icon>
                </View>
              </View>
              
            </View>
            <View className="stok-row-3 flex-row justify-between gap-2 ">
              <View className="mini-box border-2 flex-col rounded-lg px-3 flex-1  gap-y-2 pb-2">
                <View className="flex-row justify-between items-center ">
                  <Text className="text-xs text-gray-700 font-semibold">Gas 12 Kg</Text>
                  <Icon
                    name="more-2-fill"
                    color="black"
                    size={12}
                  ></Icon>
                </View>
                <View className="flex-row justify-between ">
                  <View>
                    <Text className="stok text-2xl font-semibold text-gray-700">10</Text>
                    <Text className="harga text-2xl font-semibold text-gray-700">/220K</Text>
                  </View>
                  <Image
                    source={images.gas12Kg}
                    resizeMode="contain"
                    className="w-14 h-16"
                  />
                </View>
                <View className="flex-row items-center opacity-50">
                  <Text className="text-gray-700 text-xs font-normal">Ubah Saldo</Text>
                  <Icon
                    name="arrow-right-s-line"
                    size={12}
                    color="#374151"
                  ></Icon>
                </View>
              </View>
              <View className="mini-box border-2 flex-col rounded-lg px-3 flex-1  gap-y-2 pb-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-gray-700 font-semibold">Gas kosong</Text>
                  <Icon
                    name="more-2-fill"
                    color="black"
                    size={12}
                  ></Icon>
                </View>
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="stok text-2xl font-semibold text-gray-700">2</Text>
                  </View>
                  <Image
                    source={images.gasKosong}
                    resizeMode="contain"
                    className="w-14 h-16"
                  />
                </View>
                <View className="flex-row items-center opacity-50">
                  <Text className="text-gray-700 text-xs font-normal">Ubah Saldo</Text>
                  <Icon
                    name="arrow-right-s-line"
                    size={12}
                    color="#374151"
                  ></Icon>
                </View>
              </View> 
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
