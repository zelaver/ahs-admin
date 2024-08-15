import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import Icon from "react-native-remix-icon";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Handle from "@/components/CustomHandle";
import CartItem from "@/components/CartItem";

type ContactItem = {
  index: number
  name: string
  address: string
  phone: string
  isSubscriber: number
}

const ContactItem = ({index, name, address, phone, isSubscriber}: ContactItem) => {

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
    <View className="kontak-item py-1.5 ">
      <View className="flex-row justify-between items-center mb-2.5">
        <Text className="text-base font-medium">{index + 1}. {name}</Text>
        <TouchableOpacity
          onPress={handlePresentModalPress}
          activeOpacity={0.9}
        >
          <Icon
            name="pencil-line"
            size={20}
          />
        </TouchableOpacity>
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
          <Text className="text-sm font-normal">{phone}</Text>
        </View>
        <View className="jenis flex-row items-center border-b">
          <View className="bg-blue-800 p-2 rounded-tl-sm mr-3">
            <Icon
              name={`${isSubscriber? 'home-smile-2-line' : 'user-3-line'}`}
              size={20}
              color="white"
            />
          </View>
          <Text className="text-sm font-normal">{isSubscriber ? 'Warung' : 'Customer'}</Text>
        </View>
        <View className="alamat flex-row items-center">
          <View className="bg-blue-800 p-2 rounded-tl-sm mr-3">
            <Icon
              name="map-pin-2-line"
              size={20}
              color="white"
            />
          </View>
          <Text className="text-sm font-normal">{address}</Text>
        </View>
      </View>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => Handle({ ...props, HandleText: "Detail Kontak" })}
      >
        <BottomSheetScrollView>
          <View className="main py-3 gap-y-4">
            <View className="customer px-3">
              <Text className="text-sm font-semibold mb-2.5">Nama:</Text>
              <View className="border-2 rounded-md px-3">
                <TextInput placeholder="isi nama Customer" />
              </View>
            </View>
            <View className="tanggal px-3 ">
              <Text className="text-sm font-semibold mb-2.5">Nomor Telepon:</Text>
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
            <View className="alamat px-3 ">
              <Text className="text-sm font-semibold mb-2.5">Alamat:</Text>
              <View className="border-2 rounded-md px-3 flex-row items-center">
                <TextInput placeholder="Isi Alamat" />
              </View>
            </View>
            <View className="tipe-pelanggan px-3">
              <Text className="text-sm font-semibold mb-2.5">Status:</Text>
              <View className="status-boxes self-center flex-row gap-x-3">
                <Text className="px-3 py-1 border rounded-md text-center text-xs border-blue-800 text-blue-800 font-semibold">
                  Warung
                </Text>
                <Text className="px-3 py-1 rounded-md text-center text-xs bg-blue-800  text-white font-semibold">
                  Customer
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

export default ContactItem;
