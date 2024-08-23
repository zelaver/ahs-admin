import GlobalProvider, { useGlobalContext } from "@/context/GlobalProvider";
import { getHistory, initDB, initHistory } from "@/database/db";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import { View, Image, Text, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-remix-icon";

// Prevent the splash screen from auto-hiding before asset loading is complete.
// SplashScreen.preventAutoHideAsync();

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

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // Inter: require("@/assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator
          size="large"
          color="#60a5fa"
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Error kang</Text>
      </View>
    );
  }
  return (
    <GlobalProvider>
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
            {/* <Tabs.Screen
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
          /> */}
            <Tabs.Screen
              name="backup"
              options={{
                title: "backup",
                tabBarIcon: ({ color, focused }) => (
                  <TabIcon
                    icon={"upload"}
                    color={color}
                    name="Backup"
                    focused={focused}
                  />
                ),
              }}
            />
          </Tabs>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </GlobalProvider>
  );
}
