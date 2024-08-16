import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React from "react";
import { initDB, execQuery, getAllTables, getQuery } from "@/database/db";

const showAlert = () => {
  Alert.alert(
    "Yakin ingin menghapus?",
    "gak di balikin loh",
    [
      {
        text: "batal",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "hapus", onPress: () => console.log("OK Pressed") },
    ],
    {
      cancelable: true,
    }
  );
};

const debug = () => {
  return (
    <View className="py-12 flex-1 items-center justify-center gap-y-3">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => initDB()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          init DB
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => getAllTables()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          get ALL Tables
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => getQuery()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          get query
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => execQuery()}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          exec query
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={showAlert}
      >
        <Text className="bg-blue-800 py-2 px-4 text-white text-xl font-bold rounded-lg">
          show alert
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default debug;
