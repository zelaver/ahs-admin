import { Tabs } from "expo-router";
import React from "react";
import { View, Image, Text } from "react-native";
import Icon from "react-native-remix-icon";


const TabIcon = ({ icon, color, name, focused }: any) => {
  return (
    <View className="items-center justify-center w-14">
      {/* <Image source={icon} resizeMode="contain" tintColor={color} className="w-6 h-6" /> */}
      <Icon name={icon} color={`${focused ? "#60a5fa" : "#4b5563"}`} size={24}></Icon>
      {/* #4b5563 */}
      {/* #60a5fa */}
      <Text className={`${focused ? "font-semibold " : "font-pregular"} text-xs `} style={{ color: color }}>
        {name}
      </Text>
    </View>
  );
};


export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#60a5fa",
        tabBarStyle: {
          height: 87,
          borderTopColor: "#4b5563",
          borderTopWidth: 1
        }
        
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={"home-4-line"} color={color} name="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="pesanan"
        options={{
          title: 'Pesanan',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={"list-unordered"} color={color} name="Pesanan" focused={focused} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="kontak"
        options={{
          title: 'Pesanan',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={"list-unordered"} color={color} name="Pesanan" focused={focused} />
          ),
        }}
      /> */}
      
    </Tabs>

    
  );
}
