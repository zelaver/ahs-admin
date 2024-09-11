import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import Icon from "react-native-remix-icon";

const DatePicker = ({ date, setDate, onDateChange, customStyle = '' }) => {
  const showDateMode = (currentMode) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onDateChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showDateMode("date");
  };

  const showTimepicker = () => {
    showDateMode("time");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={showDatepicker}
      className={`flex-row items-center justify-start rounded-md border border-blue-950 px-2 py-1 ${customStyle}`}>
      <Icon name="calendar-line" size={16} color="#172554" />
      <Text className={`ml-1 text-xs font-semibold text-blue-950`}>
        {date.toLocaleDateString() == new Date().toLocaleDateString() ? "Hari ini" : date?.toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );
};

export default DatePicker;
