import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { Colors } from "../theme";
import RNLoader from "./RNLoader";
const RNContainer = ({
  backgroundColor,
  isLoading,
  children,
  style,
  barStyle,
  translucent,
  hidden,
}) => {
  const styles = [{ flex: 1, backgroundColor: backgroundColor }, style];
  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: backgroundColor || Colors.White }]}
    >
      {isLoading && <RNLoader visible={isLoading} />}
      <View style={styles}>
        <StatusBar
          barStyle={barStyle ?? "dark-content"}
          backgroundColor={Colors.White}
          // translucent={translucent ?? true}
          hidden={hidden ?? false}
        />
        {children}
      </View>
    </SafeAreaView>
  );
};
export default RNContainer;
