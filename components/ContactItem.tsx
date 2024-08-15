import { View, Text, TextInput, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Icon from "react-native-remix-icon";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Handle from "@/components/CustomHandle";
import CartItem from "@/components/CartItem";
import { updateContact } from "@/database/db";

type ContactItem = {
  id: number;
  index: number;
  name: string;
  address: string;
  phone: string;
  isSubscriber: number;
  fetchContacts: () => void;
};

const ContactItem = ({
  index,
  name,
  address,
  phone,
  isSubscriber,
  id,
  fetchContacts,
}: ContactItem) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback(
    (index: number) => {
      // console.log("handleSheetChanges", index);
      if (index == -1) {
        setEditName(name);
        setEditPhone(phone);
        setEditAddress(address);
        setEditStatus(isSubscriber);
      }
    },
    [name, phone, address, isSubscriber]
  );
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

  const [editName, setEditName] = useState<string>(name);
  const [editPhone, setEditPhone] = useState<string>(phone);
  const [editAddress, setEditAddress] = useState<string>(address);
  const [editStatus, setEditStatus] = useState<number>(isSubscriber);

  const handleSave = async () => {
    if (!editName || !editPhone || !editAddress) {
      ToastAndroid.show("Form belum terisi semua", ToastAndroid.SHORT);
      return;
    }

    await updateContact(
      {
        name: editName,
        address: editAddress,
        phone: editPhone,
        isSubscriber: editStatus,
      },
      id
    );
    fetchContacts();
    handleClosePress();
  };

  return (
    <View className="kontak-item py-1.5 ">
      <View className="flex-row justify-between items-center mb-2.5">
        <Text className="text-base font-medium">
          {index + 1}. {name}
        </Text>
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
              name={`${isSubscriber ? "home-smile-2-line" : "user-3-line"}`}
              size={20}
              color="white"
            />
          </View>
          <Text className="text-sm font-normal">{isSubscriber ? "Warung" : "Customer"}</Text>
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
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => Handle({ ...props, HandleText: "Detail Kontak" })}
      >
        <BottomSheetScrollView>
          <View className="main py-3 gap-y-4">
            <View className="customer px-3">
              <Text className="text-sm font-semibold mb-2.5">Nama:</Text>
              <View className="border-2 rounded-md px-3">
                <TextInput
                  placeholder="isi nama Customer"
                  value={editName}
                  onChangeText={(text) => setEditName(text)}
                />
              </View>
            </View>
            <View className="nomor telepon px-3 ">
              <Text className="text-sm font-semibold mb-2.5">Nomor Telepon:</Text>
              <View className="border-2 rounded-md px-3 flex-row items-center">
                <TextInput
                  placeholder="Masukan nomor telepon"
                  value={editPhone}
                  onChangeText={(text) => setEditPhone(text)}
                />
              </View>
            </View>
            <View className="alamat px-3 ">
              <Text className="text-sm font-semibold mb-2.5">Alamat:</Text>
              <View className="border-2 rounded-md px-3 flex-row items-center">
                <TextInput
                  placeholder="Isi Alamat"
                  value={editAddress}
                  onChangeText={(text) => setEditAddress(text)}
                />
              </View>
            </View>
            <View className="tipe-pelanggan px-3">
              <Text className="text-sm font-semibold mb-2.5">Status:</Text>
              <View className="status-boxes self-center flex-row gap-x-3">
                <TouchableOpacity
                  activeOpacity={1}
                  className={`px-3 py-1 border rounded-md ${
                    editStatus && "bg-blue-800"
                  } border-blue-800`}
                  onPress={() => setEditStatus(1)}
                >
                  <Text
                    className={`text-center text-xs ${
                      editStatus ? "text-white" : "text-blue-800"
                    } font-semibold`}
                  >
                    Warung
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  className={`px-3 py-1 rounded-md ${
                    !editStatus && "bg-blue-800"
                  } border-blue-800 border`}
                  onPress={() => setEditStatus(0)}
                >
                  <Text
                    className={`text-center text-xs ${
                      !editStatus ? "text-white" : "text-blue-800"
                    } font-semibold`}
                  >
                    Customer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="action-button px-3">
              <TouchableOpacity
                className="rounded-lg bg-blue-800 px-3 py-2 mb-2.5"
                activeOpacity={0.9}
                onPress={handleSave}
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
