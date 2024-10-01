import Handle from "@/components/CustomHandle";
import { useGlobalContext } from "@/context/GlobalProvider";
import { deleteContact, updateContact } from "@/database/contact";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";

type ContactItem = {
  id: number;
  index: number;
  name: string;
  address: string;
  phone: string;
  isSubscriber: number;
  fetchContacts: () => Promise<void>;
};

const ContactItem = ({ index, name, address, phone, isSubscriber, id, fetchContacts }: ContactItem) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback(
    (index: number) => {
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

  const [editName, setEditName] = useState<string>();
  const [editPhone, setEditPhone] = useState<string>();
  const [editAddress, setEditAddress] = useState<string>();
  const [editStatus, setEditStatus] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { fetchTransactions } = useGlobalContext();

  useEffect(() => {
    setEditName(name);
    setEditPhone(phone);
    setEditAddress(address);
    setEditStatus(isSubscriber);
  }, [name, phone, address, isSubscriber]);

  const handleSave = async () => {
    if (!editName || !editPhone || !editAddress) {
      ToastAndroid.show("Form belum terisi semua", ToastAndroid.SHORT);
      return;
    }
    try {
      setIsLoading(true);
      await updateContact(
        {
          name: editName,
          address: editAddress,
          phone: editPhone,
          isSubscriber: editStatus,
        },
        id
      );
      await fetchContacts();
      await fetchTransactions();
      setIsLoading(false);
      handleClosePress();
    } catch (e) {
      if (e instanceof Error) {
        ToastAndroid.show(`Error: ${e}`, ToastAndroid.SHORT);
      }
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      Alert.alert(
        "Yakin ingin menghapus?",
        "gak di balikin loh",
        [
          {
            text: "batal",
            onPress: () => false,
            style: "cancel",
          },
          {
            text: "hapus",
            onPress: async () => {
              await deleteContact(id);
              await fetchContacts();
              await fetchTransactions();
              setIsLoading(false);
              handleClosePress();
            },
          },
        ],
        {
          cancelable: true,
          onDismiss() {
            setIsLoading(false);
          },
        }
      );
    } catch (e) {
      if (e instanceof Error) {
        ToastAndroid.show(`Error: ${e}`, ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View className="kontak-item py-1.5">
      <View className="mb-2.5 flex-row items-center justify-between">
        <Text className="text-base font-bold text-blue-950">
          {index + 1}. {name}
        </Text>
        <TouchableOpacity onPress={handlePresentModalPress} className="pl-6" activeOpacity={0.9}>
          <Icon name="pencil-line" size={20} color="#172554" />
        </TouchableOpacity>
      </View>
      <View className="rounded-lg bg-white shadow-lg">
        <View className="phone flex-row items-center">
          <View className="mr-3 rounded-tl-md bg-blue-800 p-2">
            <Icon name="phone-line" size={20} color="white" />
          </View>
          <Text className="text-sm font-normal">{phone}</Text>
        </View>
        <View className="jenis flex-row items-center">
          <View className="mr-3 bg-blue-800 p-2">
            <Icon name={`${isSubscriber ? "home-smile-2-line" : "user-3-line"}`} size={20} color="white" />
          </View>
          <Text className="text-sm font-normal">{isSubscriber ? "Warung" : "Customer"}</Text>
        </View>
        <View className="alamat flex-row items-center">
          <View className="mr-3 rounded-bl-md bg-blue-800 p-2">
            <Icon name="map-pin-2-line" size={20} color="white" />
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
        handleComponent={(props) => Handle({ ...props, HandleText: "Detail Kontak" })}>
        <BottomSheetScrollView>
          <View className="main gap-y-4 py-3">
            <View className="customer px-3">
              <Text className="mb-2.5 text-sm font-semibold">Nama:</Text>
              <View className="rounded-md border-2 px-3">
                <TextInput
                  placeholder="isi nama Customer"
                  value={editName}
                  onChangeText={(text) => setEditName(text)}
                />
              </View>
            </View>
            <View className="nomor telepon px-3">
              <Text className="mb-2.5 text-sm font-semibold">Nomor Telepon:</Text>
              <View className="rounded-md border-2 px-3">
                <TextInput
                  placeholder="Masukan nomor telepon"
                  value={editPhone}
                  onChangeText={(text) => setEditPhone(text)}
                />
              </View>
            </View>
            <View className="alamat px-3">
              <Text className="mb-2.5 text-sm font-semibold">Alamat:</Text>
              <View className="rounded-md border-2 px-3">
                <TextInput placeholder="Isi Alamat" value={editAddress} onChangeText={(text) => setEditAddress(text)} />
              </View>
            </View>
            <View className="tipe-pelanggan px-3">
              <Text className="mb-2.5 text-sm font-semibold">Status:</Text>
              <View className="status-boxes flex-row gap-x-3 self-center">
                <TouchableOpacity
                  activeOpacity={1}
                  className={`rounded-md border px-3 py-1 ${editStatus && "bg-blue-800"} border-blue-800`}
                  onPress={() => setEditStatus(1)}>
                  <Text className={`text-center text-xs ${editStatus ? "text-white" : "text-blue-800"} font-semibold`}>
                    Warung
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  className={`rounded-md px-3 py-1 ${!editStatus && "bg-blue-800"} border border-blue-800`}
                  onPress={() => setEditStatus(0)}>
                  <Text className={`text-center text-xs ${!editStatus ? "text-white" : "text-blue-800"} font-semibold`}>
                    Customer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="action-button px-3">
              <TouchableOpacity
                className={`rounded-lg ${isLoading ? "bg-blue-900" : "bg-blue-800"} mb-2.5 px-3 py-2`}
                activeOpacity={0.9}
                onPress={handleSave}
                disabled={isLoading}>
                <ActivityIndicator size={"small"} color={"#ffff"} className={`${!isLoading && "hidden"}`} />
                <Text className={`text-center text-xs font-semibold text-gray-100 ${isLoading && "hidden"}`}>
                  Simpan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`rounded-lg ${isLoading ? "bg-red-600" : "bg-red-500"} border px-3 py-2`}
                activeOpacity={0.9}
                onPress={handleDelete}
                disabled={isLoading}>
                <ActivityIndicator size={"small"} color={"#ffff"} className={`${!isLoading && "hidden"}`} />
                <Text className={`text-center text-xs font-semibold text-gray-100 ${isLoading && "hidden"}`}>
                  Hapus
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default ContactItem;
