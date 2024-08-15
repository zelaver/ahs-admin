import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import React from "react";
import { View, Image, Text } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-remix-icon";

const TabIcon = ({ icon, color, name, focused }: any) => {
  return (
    <View className="items-center justify-center w-14">
      {/* <Image source={icon} resizeMode="contain" tintColor={color} className="w-6 h-6" /> */}
      <Icon
        name={`${icon}-${focused ? "fill" : "line"}`}
        color={`${focused ? "#60a5fa" : "#4b5563"}`}
        size={24}
      ></Icon>
      {/* #4b5563 */}
      {/* #60a5fa */}
      <Text
        className={`${focused ? "font-semibold " : "font-pregular"} text-xs `}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: "#60a5fa",
            tabBarStyle: {
              height: 60,
              display: "flex",
              borderTopColor: "#4b5563",
              borderTopWidth: 1,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={"home-4"}
                  color={color}
                  name="Home"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="pesanan"
            options={{
              title: "Pesanan",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={"file-list"}
                  color={color}
                  name="Pesanan"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="kontak"
            options={{
              title: "kontak",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={"contacts-book-2"}
                  color={color}
                  name="Kontak"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="histori"
            options={{
              title: "histori",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={"history"}
                  color={color}
                  name="Histori"
                  focused={focused}
                />
              ),
            }}
          />
          <Tabs.Screen
            name="debug"
            options={{
              title: "debug",
              tabBarIcon: ({ color, focused }) => (
                <TabIcon
                  icon={"bug-2"}
                  color={color}
                  name="Debug"
                  focused={focused}
                />
              ),
            }}
          />
        </Tabs>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
