import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Touchable,
} from "react-native";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SearchInput from "@/components/SearchInput";
import Icon from "react-native-remix-icon";
import OrderItem from "@/components/OrderItem";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import CartItem from "@/components/CartItem";
import Handle from "@/components/CustomHandle";
import { getAllContacts, getProducts } from "@/database/db";
import { SelectList } from "react-native-dropdown-select-list";
import { UnknownOutputParams } from "expo-router";

const Pesanan = () => {
  type products = {
    id: number;
    name: string;
    price: number;
    subs_price: number;
  };

  const [status, setStatus] = useState<number>(2);
  const [aquaVal, setAquaVal] = useState(0);
  const [isiUlangVal, setIsiUlangVal] = useState(0);
  const [galonKosongVal, setGalonKosongVal] = useState(0);
  const [gasVal, setGasVal] = useState(0);
  const [gasKosongVal, setGasKosongVal] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([])
  const [customerId, setCustomerId] = useState([])

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["90%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
    console.log(products);
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

  const fetchProducts = async () => {
    try {
      const data: products[] | any = await getProducts();
      // setProducts([products?.map((item, i) => {
      //   return {key: i, value: item.name, }
      // })]);
      setProducts(data);
      console.log(products);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      }
    }
  };
  const fetchCustomers = async () => {
    try {
      const data: any[] | any = await getAllContacts();
      setCustomers(data);
      console.log(products);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCustomers()
  }, []);

  return (
    <SafeAreaView className="py-8">
      <View className="header pb-3">
        <View className="section-1 px-5 py-2">
          <Text className="text-2xl font-semibold">Pesanan</Text>
        </View>
        <View className="section-2 px-5 flex-row items-center ">
          <SearchInput
            placeholder="cari pesanan"
            otherStyles="border flex-1 mr-2"
          />
          <TouchableOpacity onPress={handlePresentModalPress}>
            <Icon
              name="add-fill"
              size={32}
            ></Icon>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView>
        <View className="main pb-16">
          <View className="section-3 px-5 py-3 ">
            {/* <View className="pesanan-item border rounded-lg p-2.5 flex-row justify-between items-center mb-4">
              <View className="flex-row">
                <View className="bg-gray-200 rounded-full w-10 h-10 items-center justify-center">
                  <Icon
                    name="user-3-line"
                    size={24}
                  ></Icon>
                </View>
                <View className="ml-4">
                  <Text className="text-sm font-medium">AG 5</Text>
                  <Text className="text-xs font-normal text-gray-400">2 juli, 2024</Text>
                </View>
              </View>
              <View className="flex-row items-center">
                <Text className="bg-red-500 text-gray-50 text-xs font-semibold px-3 py-1 rounded-md mr-2">
                  Hutang
                </Text>
                <Icon
                  name="pencil-line"
                  size={16}
                ></Icon>
              </View>
            </View> */}
            <OrderItem />
          </View>
        </View>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleComponent={(props) => Handle({ ...props, HandleText: "Detail Pesanan" })}
      >
        <BottomSheetScrollView>
          <View className="main py-3 gap-y-4">
            <View className="customer px-3">
              <Text className="text-sm font-semibold mb-2.5">Customer:</Text>
              <View className=" rounded-md px-3">
                {/* <TextInput placeholder="isi nama Customer" /> */}
                <SelectList
                  data={[
                    ...customers.map((item, i) => {
                      return {key: item.id, value: item.name};
                    })
                  ]}
                  setSelected={(val) => setCustomerId(val)}
                  // setSelected={val => console.log(val)}
                  placeholder="pilih pelanggan"
                  searchPlaceholder="cari pelanggan"
                />
              </View>
            </View>
            <View className="cart border-t border-b py-4">
              <CartItem />
              <CartItem />
              <View className="px-5 hidden">
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
                <TouchableOpacity
                  onPress={() => setStatus(0)}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border font-semibold rounded-md w-[67px] text-center text-xs border-red-500 
                    ${!status ? "text-white bg-red-500" : "text-red-500"} `}
                  >
                    Hutang
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setStatus(1)}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border rounded-md w-[67px] text-center text-xs border-yellow-500 font-semibold
                    ${status == 1 ? "text-white bg-yellow-500" : "text-yellow-500"}`}
                  >
                    Pinjam
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setStatus(2)}
                  activeOpacity={1}
                >
                  <Text
                    className={`px-3 py-1 border rounded-md w-[67px] text-center text-xs border-green-500 font-semibold
                    ${status == 2 ? "text-white bg-green-500" : "text-green-500"}`}
                  >
                    Lunas
                  </Text>
                </TouchableOpacity>
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
    </SafeAreaView>
  );
};

export default Pesanan;
