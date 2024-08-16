import { View, Text, StyleSheet, Button } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";

const Histori = () => {
  return <View style={styles.container}></View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default Histori;
