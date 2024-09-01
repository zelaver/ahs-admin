import { View, Text, TouchableOpacity, Button } from "react-native";
import React, { useState } from "react";
import { execQuery, getAllTables, getQuery } from "@/database/debug";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const Debug = () => {
  const [date, setDate] = useState(new Date());

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
  return (
    <View className="py-32 h-full px-32 flex-1 gap-y-3 justify-center items-center">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => getQuery()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          debug db
        </Text>
      </TouchableOpacity>
      <View className="w-full">
        <Button
          onPress={() => {
            console.log(date.toLocaleString())
            // showDatepicker();
          }}
          title="Show date picker!"
        />
        <Button
          onPress={showTimepicker}
          title="Show time picker!"
        />
        <Text>selected: {date.toLocaleDateString().split("/")[2]}</Text>
      </View>
    </View>
  );
};

export default Debug;
