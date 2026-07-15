import { useGlobalContext } from "@/context/GlobalProvider";
import { getContact } from "@/database/contact";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-remix-icon";
import OrderItemBottomSheet from "./OrderBottomSheet";

type OrderItem = {
  id: number;
  curCustomerId: number;
  curStatus: string;
  curDate: string;
  orderList: any[];
  // curCustomerName: string;
  // curCustomerType: number;
  total_price: number;
  curOngkir: number;
  // handlePresentModalPress: () => void;
};

const OrderItem = ({
  id,
  curCustomerId,
  curStatus,
  curDate,
  orderList,
  // curCustomerName,
  // curCustomerType,
  total_price,
  curOngkir,
}: OrderItem) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  // const [status, setStatus] = useState<any>(curStatus);
  // const [date, setDate] = useState(new Date(curDate));

  // const fetchStatusDate = () => {
  //   setStatus(curStatus)
  //   setDate(new Date(curDate))
  // };

  // useEffect(() => {
  //   fetchStatusDate()
  // }, [curStatus, curDate]);

  const handleEdit = async () => {
    handlePresentModalPress();
  };

  return (
    <View className="pesanan-item mb-4 flex-row items-center justify-between rounded-lg bg-blue-50 p-2.5 shadow-lg border">
      <CustomerLogo customerId={curCustomerId} date={curDate} />
      <StatusEdit status={curStatus} handleEdit={handleEdit} />
      {/* <TouchableOpacity
        onPress={() => {
          console.log(
            new Date()
              .toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })
              .replace(",", "")
              .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$2-$1")
          );
        }}>
        <Text>debug</Text>
      </TouchableOpacity> */}
      <OrderItemBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        id={id}
        orderList={orderList}
        curCustomerId={curCustomerId}
        curStatus={curStatus}
        curDate={curDate}
        curOngkir={curOngkir}
        total_price={total_price}
      />
    </View>
  );
};

// Interface Component
const CustomerLogo = ({ customerId, date }: { customerId: number; date: string }) => {
  const [customerName, setCustomerName] = useState<string>("");
  const [customerType, setCustomerType] = useState<number>();
  const [formatedDate, setFormatedDate] = useState(formatDate(date));
  const { customers } = useGlobalContext();
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const data: any = await getContact(customerId);
        setCustomerName(data.name);
        setCustomerType(data.isSubscriber);
      } catch (e) {
        if (e instanceof Error) {
          console.log("error", e);
        }
      }
    };
    setFormatedDate(formatDate(date));
    fetchCustomer();
  }, [customerId, date, customers]);

  return (
    <View className="flex-row">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-800">
        <Icon name={`${customerType ? "home-smile-2-line" : "user-3-line"}`} size={24} color="white" />
      </View>
      <View className="ml-4">
        <Text className="text-sm font-medium">{customerName}</Text>
        <Text className="text-xs font-normal text-gray-400">{formatedDate}</Text>
      </View>
    </View>
  );
};
const StatusEdit = ({ status, handleEdit }) => {
  return (
    <View className="flex-row items-center">
      {status == "hutang" && (
        <Text className="w-max-[70px] mr-2 rounded-md border border-red-500 px-3 py-1 text-center text-sm font-semibold text-red-500">
          Hutang
        </Text>
      )}
      {status == "pinjam" && (
        <Text className="w-max-[70px] mr-2 rounded-md border border-yellow-500 px-3 py-1 text-center text-sm font-semibold text-yellow-500">
          Pinjam
        </Text>
      )}
      {status == "lunas" && (
        <Text className="w-max-[70px] mr-2 rounded-md border border-green-500 px-3 py-1 text-center text-sm font-semibold text-green-500">
          Lunas
        </Text>
      )}
      <TouchableOpacity onPress={handleEdit} activeOpacity={0.9}>
        <Icon name="pencil-line" size={20} color="#172554" />
      </TouchableOpacity>
    </View>
  );
};

const formatDate = (timestamp) => {
  // const timestamp = "2024-08-17 08:09:03";
  const date = new Date(timestamp);

  // Membuat array bulan dalam bahasa Indonesia
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Mendapatkan hari, bulan, dan tahun
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  // const hour = date.getHours();
  // const minute = date.getMinutes();
  // const second = date.getSeconds();

  const time = timestamp.split(" ")[1].split(":");
  const hour = time[0];
  const minute = time[1];
  const second = time[2];

  // Menggabungkan dalam format yang diinginkan
  const formattedDate = `${day} ${month}, ${year}`;
  const formattedTime = `${hour}:${minute}`;
  // return formattedDate;
  return formattedTime;
};

export default OrderItem;
