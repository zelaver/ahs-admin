import React from "react";
import { StyleProp, StyleSheet, ViewStyle, Text, View } from "react-native";
import { BottomSheetHandleProps } from "@gorhom/bottom-sheet";

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
  HandleText?: string;
}

const Handle: React.FC<HandleProps> = ({ style, HandleText , animatedIndex }) => {
  return (
    <View className="bg-blue-800 rounded-t-xl py-3">
      {/* <Animated.View
        style={[containerStyle, containerAnimatedStyle]}
        renderToHardwareTextureAndroid={true}
      >
        <Animated.View style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]} />
        <Animated.View style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]} />
      </Animated.View> */}
      <View className="w-16 h-1.5 bg-gray-300 mx-auto mb-2.5 rounded-full"></View>
      <Text className="text-center text-gray-100 text-base font-bold">
        {HandleText}
      </Text>
    </View>
  );
};

export default Handle;

const styles = StyleSheet.create({
  header: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1e40af",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1e40af",
  },
  indicator: {
    position: "absolute",
    width: 10,
    height: 4,
    backgroundColor: "#fff",
  },
  leftIndicator: {
    borderTopStartRadius: 2,
    borderBottomStartRadius: 2,
  },
  rightIndicator: {
    borderTopEndRadius: 2,
    borderBottomEndRadius: 2,
  },
});
