import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { RNContainer, RNImage, RNStyles, RNText } from "../common";
import { useTheme } from "../common/RNThemeContext";
import { Colors, FontFamily, hp, normalize, wp } from "../theme";
import { Images } from "../constants";
import NetInfo from "@react-native-community/netinfo";
import LottieView from "lottie-react-native";

const NetInfoScreen = ({ isvisible }) => {
  const { colorScheme } = useTheme();
  // const [isOffline, setIsOffline] = useState(false); // Default: assume online
  // useEffect(() => {
  //   // Subscribe to NetInfo updates
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     setIsOffline(!state.isConnected); // If not connected, set isOffline to true
  //   });

  //   // Cleanup the subscription when the component unmounts
  //   return () => unsubscribe();
  // }, []);

  return (
    // <RNContainer>
    <Modal visible={isvisible} transparent={true} animationType="slide">
      <View style={styles(colorScheme).modalContainer}>
        <View style={styles(colorScheme).modalContent}>
          <View style={[RNStyles.center, { paddingTop: hp(1) }]}>
            <LottieView
              loop
              autoPlay
              source={require("../assets/lottie/Nointernet.json")}
              style={{ height: hp(12), width: hp(12) }}
            />
            <RNText pTop={hp(5)} family={FontFamily.Black} align={"center"}>
              Please check internet connection.
            </RNText>
            {/* <RNImage
                source={Images.Google}
                style={{ height: hp(10), width: hp(10) }}
              /> */}
          </View>
        </View>
      </View>
    </Modal>
    //</RNContainer>
  );
};

export default NetInfoScreen;

const styles = (colorScheme) =>
  StyleSheet.create({
    modalContainer: {
      ...RNStyles.flexCenter,
      flex: 1,
      backgroundColor:
        colorScheme === "dark"
          ? "rgba(35, 55, 67, 0.5)"
          : "rgba(0 ,0 , 0, 0.5)",
    },
    modalContent: {
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      width: wp(80),
      paddingHorizontal: wp(3),
      paddingVertical: hp(3),
      borderRadius: normalize(10),
      // gap: 15,
      alignItems: "center",
    },
  });
