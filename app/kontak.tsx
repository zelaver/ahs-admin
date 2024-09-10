import ContactItem from "@/components/ContactItem";
import Handle from "@/components/CustomHandle";
import { useGlobalContext } from "@/context/GlobalProvider";
import { addContact } from "@/database/db";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-remix-icon";
import { useDebounce } from 'use-debounce';

const Kontak = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["55%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index == -1) {
        setName("");
        setPhone("");
        setAddress("");
        setStatus(0);
      }
    },
    [name, phone, address, status]
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

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<number>(0);
  const { customers: contacts, fetchCustomers: fetchContacts } = useGlobalContext();
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState<string>();
  const [value] = useDebounce(query, 600)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      bottomSheetModalRef.current?.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, [contacts]);

  const handleSave = async () => {
    if (!name || !phone || !address) {
      ToastAndroid.show("Form belum terisi semua!", ToastAndroid.SHORT);
      return;
    }
    try {
      await addContact({ name, phone, address, isSubscriber: status });
      await fetchContacts();
      handleClosePress();
    } catch (e) {
      if (e instanceof Error) {
        ToastAndroid.show(`Error: ${e}`, ToastAndroid.SHORT);
      }
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContacts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-blue-50 pt-8">
      <View className="Header border-b border-gray-500 pb-4">
        <View className="section-1 flex-row items-center px-5 py-2">
          <Icon name="contacts-book-2-fill" color="#172554" size={26} />
          <Text className="ml-2 text-2xl font-semibold text-blue-950">Kontak</Text>
        </View>
        <View className="section-2 flex-row items-center justify-between px-5">
          <View className={`mr-2 flex-1 flex-row items-center rounded-md border bg-white px-2 py-1`}>
            <TextInput
              className="mr-2 flex-1 items-center justify-center text-xs font-normal"
              value={query}
              placeholder={"Cari Kontak"}
              placeholderTextColor={"#CDCDE0"}
              onChangeText={(e) => {
                setQuery(e);
                console.log(query);
              }}
            />
            <TouchableOpacity>
              <Icon name="search-2-line" size={16}></Icon>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} className="bg-blue-50" />}>
        <View className="main pb-20">
          <View className="section-3 px-5 py-1.5">
            {[...contacts]
              .filter((item) =>
                query ?
                  item.name.toLowerCase().includes(value?.toLowerCase()) ||
                  item.address.toLowerCase().includes(value?.toLowerCase())
                : item
              )
              .map(({ id, name, address, phone, isSubscriber }, i) => {
                return (
                  <ContactItem
                    key={id}
                    address={address}
                    index={i}
                    name={name}
                    phone={phone}
                    isSubscriber={isSubscriber}
                    id={id}
                    fetchContacts={fetchContacts}
                  />
                );
              })}
          </View>
        </View>
      </ScrollView>
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
                <TextInput placeholder="isi nama Customer" onChangeText={(input) => setName(input)} />
              </View>
            </View>
            <View className="tanggal px-3">
              <Text className="mb-2.5 text-sm font-semibold">Nomor Telepon:</Text>
              <View className="rounded-md border-2 px-3">
                <TextInput
                  placeholder="Masukan nomor telepon"
                  keyboardType="number-pad"
                  textContentType="telephoneNumber"
                  inputMode="numeric"
                  onChangeText={(input) => setPhone(input)}
                />
              </View>
            </View>
            <View className="alamat px-3">
              <Text className="mb-2.5 text-sm font-semibold">Alamat:</Text>
              <View className="rounded-md border-2 px-3">
                <TextInput placeholder="Isi Alamat" onChangeText={(input) => setAddress(input)} />
              </View>
            </View>
            <View className="tipe-pelanggan px-3">
              <Text className="mb-2.5 text-sm font-semibold">Status:</Text>
              <View className="status-boxes flex-row gap-x-3 self-center">
                <TouchableOpacity
                  activeOpacity={1}
                  className={`rounded-md border px-3 py-1 ${status && "bg-blue-800"} border-blue-800`}
                  onPress={() => setStatus(1)}>
                  <Text className={`text-center text-xs ${status ? "text-white" : "text-blue-800"} font-semibold`}>
                    Warung
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  className={`rounded-md px-3 py-1 ${!status && "bg-blue-800"} border border-blue-800`}
                  onPress={() => setStatus(0)}>
                  <Text className={`text-center text-xs ${!status ? "text-white" : "text-blue-800"} font-semibold`}>
                    Customer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="action-button px-3">
              <TouchableOpacity
                className={`rounded-lg ${isLoading ? "bg-blue-900" : "bg-blue-800"} mb-2.5 px-3 py-2`}
                activeOpacity={0.9}
                onPress={async () => {
                  setIsLoading(true);
                  await handleSave();
                  setIsLoading(false);
                }}
                disabled={isLoading}>
                <ActivityIndicator size={"small"} color={"#ffff"} className={`${!isLoading && "hidden"}`} />
                <Text className={`text-center text-xs font-semibold text-gray-100 ${isLoading && "hidden"}`}>
                  Simpan
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                className={`rounded-lg ${isLoading ? "bg-red-600" : "bg-red-500"} px-3 py-2 border`}
                activeOpacity={0.9}
              >
                <Text className="text-center text-gray-100 text-xs font-semibold">Hapus</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={handlePresentModalPress}
        className="absolute bottom-10 right-5 rounded-full border bg-blue-800">
        <Icon name="add-fill" size={40} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Kontak;
