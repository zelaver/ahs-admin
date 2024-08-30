import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { execQuery, getAllTables, getQuery } from "@/database/debug";

const Debug = () => {
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
    </View>
  );
};

export default Debug;
