import { View, Text, TouchableOpacity, Button } from 'react-native';
import React, { useState } from 'react';
import { execQuery, getAllTables, getQuery } from '@/database/debug';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useGlobalContext } from '@/context/GlobalProvider';

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
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
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
      <View className="w-full">
        <Button
          onPress={() => {
            console.log(date.toLocaleString());
            // showDatepicker();
          }}
          title="Show date picker!"
        />
        <Button onPress={showTimepicker} title="Show time picker!" />
        <Text>selected: {date.toLocaleDateString().split('/')[2]}</Text>
      </View>
    </View>
  );
};

export default Debug;
