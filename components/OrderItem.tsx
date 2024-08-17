import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import Icon from "react-native-remix-icon";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Handle from "@/components/CustomHandle";
import CartItem from "@/components/CartItem";

const OrderItem = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const handleClosePress = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior={"close"}

        // onPress={handleClosePress}
      />
    ),
    []
  );

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
        <TouchableOpacity
          onPress={handlePresentModalPress}
          activeOpacity={0.9}
        >
          <Icon
            name="pencil-line"
            size={16}
          />
        </TouchableOpacity>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => Handle({...props, HandleText: 'Detail Pesanan'})}
      >
        <BottomSheetScrollView>
          <View className="main py-3 gap-y-4">
            <View className="customer px-3">
              <Text className="text-sm font-semibold mb-2.5">Customer:</Text>
              <View className="border-2 rounded-md px-3">
                <TextInput placeholder="isi nama Customer" />
              </View>
            </View>
            <View className="tanggal px-3 ">
              <Text className="text-sm font-semibold mb-2.5">Tanggal:</Text>
              <View className="border-2 rounded-md px-3 flex-row items-center">
                <Icon
                  name="calendar-2-fill"
                  size={16}
                  color="#374151"
                />
                <TextInput
                  placeholder="Masukan tanggal"
                  className="ml-1"
                />
              </View>
            </View>
            <View className="cart border-t border-b py-4">
              <CartItem />
              <CartItem />
              <View className="px-5">
                <View className="py-4 items-center">
                  <Icon
                    name="add-circle-line"
                    size={32}
                  />
                </View>
              </View>
            </View>
            <View className="total px-3">
              <View className="py-2 px-3 flex-row justify-between items-center bg-blue-800 rounded-lg">
                <Text className="text-base font-bold text-gray-50">Total pembayaran</Text>
                <Text className="text-sm font-bold text-gray-50">25.000</Text>
              </View>
            </View>
            <View className="status px-3">
              <Text className="text-sm font-semibold mb-2.5">Status:</Text>
              <View className="status-boxes self-center flex-row gap-x-3">
                <Text className="px-3 py-1 border rounded-md w-[67px] text-center text-xs border-red-500 text-red-500 font-semibold">
                  Hutang
                </Text>
                <Text className="px-3 py-1 border rounded-md w-[67px] text-center text-xs border-yellow-500 text-yellow-500 font-semibold">
                  Pinjam
                </Text>
                <Text className="px-3 py-1  rounded-md w-[67px] text-center text-xs bg-green-500  font-semibold text-white">
                  Lunas
                </Text>
              </View>
            </View>
            <View className="action-button px-3">
              <TouchableOpacity
                className="rounded-lg bg-blue-800 px-3 py-2 mb-2.5"
                activeOpacity={0.9}
                onPress={handleClosePress}
              >
                <Text className="text-center text-gray-100 text-xs font-semibold">Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-lg bg-red-500 px-3 py-2 border"
                activeOpacity={0.9}
              >
                <Text className="text-center text-gray-100 text-xs font-semibold">Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default OrderItem;
