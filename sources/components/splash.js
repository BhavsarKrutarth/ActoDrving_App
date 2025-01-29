import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { RNContainer, RNImage, RNStyles } from "../common";
import { Images } from "../constants";
import { height, hp, width, wp } from "../theme";

const Splash = () => {
  return (
    <RNContainer hidden={true}>
      <View style={{ ...RNStyles.flexCenter }}>
        <RNImage
          source={Images.Logo}
          style={{ height: hp(50), width: wp(50) }}
        />
      </View>
    </RNContainer>
  );
};

export default Splash;

const styles = StyleSheet.create({});
