import React from "react";
import {
  LogBox,
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Colors, FontFamily, FontSize, hp, wp } from "../../theme";
import RNText from "../../common/RNText";
import RNImage from "../../common/RNImage";
import { useTheme } from "../../common/RNThemeContext";
import { Images } from "../../constants";
import { RNStyles } from "../../common";

const RNHeader = ({
  title,
  onLeftPress,
  LeftIcon,
  Righticon,
  onRightPress,
}) => {
  const { colorScheme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles(colorScheme).container}>
      {LeftIcon ? (
        <TouchableOpacity
          hitSlop={20}
          style={styles(colorScheme).LeftIcon}
          onPress={() => (onLeftPress ? onLeftPress() : navigation.goBack())}
        >
          <RNImage source={Images.leftarrow} style={{ ...RNStyles.image100 }} />
        </TouchableOpacity>
      ) : (
        <View style={styles(colorScheme).LeftIcon}></View>
      )}
      <RNText style={styles(colorScheme).title}>{title}</RNText>
      {Righticon ? (
        <TouchableOpacity hitSlop={20} style={styles(colorScheme).RightIcon}>
          {/* <RNImage source={Images.leftarrow} style={{ ...RNStyles.image100 }} /> */}
        </TouchableOpacity>
      ) : (
        <View style={styles(colorScheme).RightIcon}></View>
      )}
    </SafeAreaView>
  );
};

const styles = (colorScheme) =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      //height: hp(7),
      height: Platform.OS === "ios" ? hp(12) : hp(8),
      flexDirection: "row",
      gap: wp(2),
      alignItems: "center",
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      borderColor: colorScheme === "dark" ? Colors.Grey : Colors.LightGrey,
    },
    title: {
      flex: 1,
      fontSize: FontSize.font16,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      textAlign: "center",
    },
    LeftIcon: {
      ...RNStyles.center,
      height: wp(6),
      width: wp(6),
      marginLeft: wp(2),
    },
    RightIcon: {
      ...RNStyles.center,
      height: wp(6),
      width: wp(6),
      marginRight: wp(2),
    },
  });

export default RNHeader;
