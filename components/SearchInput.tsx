import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-remix-icon";
import { Image } from "react-native";
import { router, usePathname } from "expo-router";

type FormField = {
  value?: string;
  placeholder?: string;
  handleChangeText?: (e: any) => void;
  otherStyles?: string;
  keyboardType?: string;
  initialQuery?: string | string[] | undefined;
};

const SearchInput = ({
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  initialQuery,
}: FormField) => {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  return (
    <View className={`flex-row py-1  px-2  rounded-md items-center  ${otherStyles}`}>
      <TextInput
        className=" text-xs flex-1 font-normal justify-center items-center"
        value={query}
        placeholder={placeholder}
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              "Missing query",
              "Please input somthing to search results across database"
            );
          }

          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          } else {
            router.push(`/search/${query}`);
          }
        }}
      >
        <Icon
          name="search-2-line"
          size={16}
        ></Icon>
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
