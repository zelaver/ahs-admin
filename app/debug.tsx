import { useGlobalContext } from "@/context/GlobalProvider";
import { execQuery, getQuery } from "@/database/debug";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";

const Debug = () => {
  const [date, setDate] = useState(new Date());
  const { fetchHistory } = useGlobalContext();

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View className="h-full flex-1 items-center justify-center gap-y-3 px-32 py-32">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          // execQuery();
          // fetchHistory()
          getQuery();
        }}>
        <Text className="rounded-lg bg-blue-800 px-4 py-2 text-xl font-bold text-white">debug db</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-red-500 px-3 py-2" onPress={() => setModalVisible(true)}>
        <Text className="rounded-md text-lg font-bold text-white">test</Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}>
        <View className="flex-1 items-center justify-center">
          <View className="border bg-blue-800">
            <Text className="px-4 py-2 text-white">lah najir</Text>
            <TouchableOpacity className="bg-red-500 px-3 py-2" onPress={() => setModalVisible((prev) => !prev)}>
              <Text className="rounded-md text-lg font-bold text-white">test</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Debug;
