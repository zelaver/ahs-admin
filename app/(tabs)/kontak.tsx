import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import SearchInput from "@/components/SearchInput";
import Icon from "react-native-remix-icon";
import ContactItem from "@/components/ContactItem";

const Kontak = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="main py-8">
          <View className="section-1 px-5 py-2">
            <Text className="text-2xl font-semibold">Kontak</Text>
          </View>
          <View className="section-2 px-5 flex-row items-center ">
            <SearchInput
              placeholder="cari kontak pelanggan"
              otherStyles="border flex-1 mr-2"
            />
            <Icon
              name="add-fill"
              size={32}
            />
          </View>
          <View className="section-3 px-5 py-1.5 ">
            <ContactItem/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Kontak;
