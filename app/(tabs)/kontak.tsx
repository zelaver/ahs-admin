import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  BackHandler,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchInput from "@/components/SearchInput";
import Icon from "react-native-remix-icon";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Handle from "@/components/CustomHandle";
import { addContact, getAllContacts } from "@/database/db";
import ContactItem from "@/components/ContactItem";

const Kontak = () => {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<number>(0);
  const [contacts, setContacts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState(false);
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

  const fetchContacts = async () => {
    try {
      const data: any = await getAllContacts();
      // console.log(data);
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  useEffect(() => {
    fetchContacts();

    const backAction = () => {
      bottomSheetModalRef.current?.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => backHandler.remove();
  }, []);

  const handleSave = async () => {
    if (!name || !phone || !address) {
      ToastAndroid.show("Form belum terisi semua!", ToastAndroid.SHORT);
      return;
    }
    try {
      setIsLoading(true);
      await addContact({ name, phone, address, isSubscriber: status });
      await fetchContacts();
      setIsLoading(false);
      handleClosePress();
    } catch (e) {
      if (e instanceof Error) {
        ToastAndroid.show(`Error: ${e}`, ToastAndroid.SHORT);
      }
    }
  };

  const onRefresh = async () =>  {
    setRefreshing(true)
    await fetchContacts()
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="py-8 bg-white">
      <View className="Header pb-3">
        <View className="section-1 px-5 py-2">
          <Text className="text-2xl font-semibold">Kontak</Text>
        </View>
        <View className="section-2 px-5 flex-row items-center ">
          <SearchInput
            placeholder="cari kontak pelanggan"
            otherStyles="border flex-1 mr-2"
          />
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handlePresentModalPress}
            
            className="bg-white rounded-full"
          >
            <Icon
              name="add-fill"
              size={32}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
        <View className="main pb-16">
          <View className="section-3 px-5 py-1.5 ">
            {contacts.map(({ id, name, address, phone, isSubscriber }, i) => {
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
        handleComponent={(props) => Handle({ ...props, HandleText: "Detail Kontak" })}
      >
        <BottomSheetScrollView>
          <View className="main py-3 gap-y-4">
            <View className="customer px-3">
              <Text className="text-sm font-semibold mb-2.5">Nama:</Text>
              <View className="border-2 rounded-md px-3">
                <TextInput
                  placeholder="isi nama Customer"
                  onChangeText={(input) => setName(input)}
                />
              </View>
            </View>
            <View className="tanggal px-3 ">
              <Text className="text-sm font-semibold mb-2.5">Nomor Telepon:</Text>
              <View className="border-2 rounded-md px-3">
                <TextInput
                  placeholder="Masukan nomor telepon"
                  keyboardType="number-pad"
                  textContentType="telephoneNumber"
                  inputMode="numeric"
                  onChangeText={(input) => setPhone(input)}
                />
              </View>
            </View>
            <View className="alamat px-3 ">
              <Text className="text-sm font-semibold mb-2.5">Alamat:</Text>
              <View className="border-2 rounded-md px-3 ">
                <TextInput
                  placeholder="Isi Alamat"
                  onChangeText={(input) => setAddress(input)}
                />
              </View>
            </View>
            <View className="tipe-pelanggan px-3">
              <Text className="text-sm font-semibold mb-2.5">Status:</Text>
              <View className="status-boxes self-center flex-row gap-x-3">
                <TouchableOpacity
                  activeOpacity={1}
                  className={`px-3 py-1 border rounded-md ${
                    status && "bg-blue-800"
                  } border-blue-800`}
                  onPress={() => setStatus(1)}
                >
                  <Text
                    className={`text-center text-xs ${
                      status ? "text-white" : "text-blue-800"
                    } font-semibold`}
                  >
                    Warung
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  className={`px-3 py-1 rounded-md ${
                    !status && "bg-blue-800"
                  } border-blue-800 border`}
                  onPress={() => setStatus(0)}
                >
                  <Text
                    className={`text-center text-xs ${
                      !status ? "text-white" : "text-blue-800"
                    } font-semibold`}
                  >
                    Customer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="action-button px-3">
              <TouchableOpacity
                className={`rounded-lg ${
                  isLoading ? "bg-blue-900" : "bg-blue-800"
                }  px-3 py-2 mb-2.5`}
                activeOpacity={0.9}
                onPress={handleSave}
                disabled={isLoading}
              >
                <Text className="text-center text-gray-100 text-xs font-semibold">Simpan</Text>
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
    </SafeAreaView>
  );
};

export default Kontak;
