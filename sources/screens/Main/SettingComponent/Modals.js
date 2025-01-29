import React from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import { Divider, RadioButton } from "react-native-paper";
import { RNImage, RNStyles, RNText } from "../../../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../../../theme";
import { Images } from "../../../constants";

export const LanguageModal = ({
  IsShowLang,
  toggleLanguageMenu,
  languageAnim,
  colorScheme,
  t,
  LanguageInfo,
  selectedLanguage,
  handleLanguage,
}) =>
  IsShowLang && (
    <View style={styles(colorScheme).overlay}>
      <TouchableOpacity
        style={styles(colorScheme).overlay}
        onPress={toggleLanguageMenu}
      />
      <Animated.View
        style={[
          styles(colorScheme).languageContainer,
          {
            opacity: languageAnim,
            transform: [
              {
                translateY: languageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [hp(60), 0],
                }),
              },
            ],
          },
        ]}
      >
        <View style={[RNStyles.flexRow, { gap: 20, padding: hp(3) }]}>
          <TouchableOpacity onPress={toggleLanguageMenu}>
            <RNImage
              style={{ height: wp(3), width: wp(3) }}
              source={Images.close}
            />
          </TouchableOpacity>
          <RNText style={styles(colorScheme).title}>
            {t("setting.App_language")}
          </RNText>
        </View>
        <Divider />
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {LanguageInfo.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[RNStyles.flexRow, { gap: 10, padding: 10 }]}
              onPress={() => handleLanguage(item.Code)}
            >
              <RadioButton
                value={item.Code}
                status={
                  selectedLanguage === item.Code ? "checked" : "unchecked"
                }
                onPress={() => handleLanguage(item.Code)}
                color={Colors.Green}
              />
              <RNText
                style={[
                  styles(colorScheme).title,
                  {
                    fontSize:
                      Platform.OS === "ios" ? FontSize.font16 : FontSize.font13,
                    color: colorScheme === "dark" ? Colors.White : Colors.Black,
                  },
                ]}
              >
                {item.Language}
              </RNText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );

export const SignOutModal = ({
  showSignOutConfirmation,
  handleConfirmSignOut,
  cancelSignOut,
  colorScheme,
  t,
}) =>
  showSignOutConfirmation && (
    <Modal transparent={true}>
      <View
        style={[
          RNStyles.flexCenter,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(35, 55, 67, 0.5)"
                : "rgba(0 ,0 , 0, 0.5)",
          },
        ]}
      >
        <View style={[styles(colorScheme).logoutView, RNStyles.center]}>
          <RNText
            style={{
              fontSize: FontSize.font16,
              fontFamily: FontFamily.GilroySemiBold,
              color: colorScheme === "dark" ? Colors.White : Colors.Black,
              textAlign: "center",
            }}
          >
            {t("setting.logout_desc")}
          </RNText>
          <RNImage
            style={{ width: wp(45), height: wp(45) }}
            source={Images.Logout}
          />
          <RNText style={styles(colorScheme).subModelText}>
            {t("setting.logout_mess")}
          </RNText>
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={[
                { backgroundColor: Colors.Orange },
                styles(colorScheme).logoutButton,
              ]}
              onPress={handleConfirmSignOut}
            >
              <RNText
                style={[
                  styles(colorScheme).title,
                  { color: Colors.White, textAlign: "center" },
                ]}
              >
                {t("setting.LogOut_Account")}
              </RNText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles(colorScheme).logoutButton,
                { paddingBottom: hp(0) },
              ]}
              onPress={cancelSignOut}
            >
              <RNText
                style={[
                  styles(colorScheme).title,
                  {
                    color: colorScheme === "dark" ? Colors.Grey : Colors.Grey,
                    textAlign: "center",
                  },
                ]}
              >
                {t("setting.Keepit")}
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

export const DeleteAccount = ({
  showSignOutConfirmation,
  handleConfirmSignOut,
  cancelSignOut,
  colorScheme,
  t,
}) =>
  showSignOutConfirmation && (
    <Modal transparent={true}>
      <View
        style={[
          RNStyles.flexCenter,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(35, 55, 67, 0.5)"
                : "rgba(0 ,0 , 0, 0.5)",
          },
        ]}
      >
        <View style={[styles(colorScheme).logoutView, RNStyles.center]}>
          <RNText
            style={{
              fontSize: FontSize.font15,
              width: wp(90),
              fontFamily: FontFamily.GilroySemiBold,
              color: colorScheme === "dark" ? Colors.White : Colors.Black,
              textAlign: "center",
              lineHeight: Platform.OS === "ios" ? hp(2.8) : hp(2.5),
            }}
          >
            {t("Delete.Permission_Mes")}
          </RNText>
          <RNImage
            style={{ width: wp(45), height: wp(45) }}
            source={Images.Logout}
          />
          <View style={{ gap: 10 }}>
            <TouchableOpacity
              style={[
                { backgroundColor: Colors.Orange },
                styles(colorScheme).logoutButton,
              ]}
              onPress={handleConfirmSignOut}
            >
              <RNText
                style={[
                  styles(colorScheme).title,
                  { color: Colors.White, textAlign: "center" },
                ]}
              >
                {t("Delete.Yes_Delete")}
              </RNText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles(colorScheme).logoutButton,
                { paddingBottom: hp(0) },
              ]}
              onPress={cancelSignOut}
            >
              <RNText
                style={[
                  styles(colorScheme).title,
                  {
                    color: colorScheme === "dark" ? Colors.Grey : Colors.Grey,
                    textAlign: "center",
                  },
                ]}
              >
                {t("setting.Keepit")}
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

export const ThemeModal = ({
  modalVisible,
  setModalVisible,
  selectedOption,
  colorScheme,
  t,
}) => (
  <Modal visible={modalVisible} transparent={true} animationType="slide">
    <View
      style={[
        RNStyles.flexCenter,
        {
          backgroundColor:
            colorScheme === "dark"
              ? "rgba(35, 55, 67, 0.5)"
              : "rgba(0 ,0 , 0, 0.5)",
        },
      ]}
    >
      <View style={styles(colorScheme).modalContent}>
        <View style={[RNStyles.flexRow, { gap: 20, padding: hp(3) }]}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <RNImage
              style={{ height: wp(3), width: wp(3) }}
              source={Images.close}
            />
          </TouchableOpacity>
          <RNText style={styles(colorScheme).title}>
            {t("setting.theme")}
          </RNText>
        </View>
        <RadioButton.Group value={selectedOption}>
          <RadioButton.Item
            color={Colors.Green}
            label={t("setting.System_default")}
            labelStyle={{
              color: colorScheme === "dark" ? Colors.White : Colors.Black,
            }}
            value="system_default"
          />
          <RadioButton.Item
            color={Colors.Green}
            label={t("setting.Light")}
            labelStyle={{
              color: colorScheme === "dark" ? Colors.White : Colors.Black,
            }}
            value="light"
          />
          <RadioButton.Item
            color={Colors.Green}
            label={t("setting.Dark")}
            labelStyle={{
              color: colorScheme === "dark" ? Colors.White : Colors.Black,
            }}
            value="dark"
          />
        </RadioButton.Group>
      </View>
    </View>
  </Modal>
);

const styles = (colorScheme) =>
  StyleSheet.create({
    title: {
      fontSize: Platform.OS === "ios" ? FontSize.font19 : FontSize.font15,
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    subTitle: {
      fontSize: FontSize.font11,
      fontFamily: FontFamily.GilroyRegular,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor:
        colorScheme === "dark" ? "rgba(35, 55, 67, 0.5)" : "rgba(0, 0, 0, 0.5)",
    },
    languageContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: "45%",
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      borderTopLeftRadius: wp(5),
      borderTopRightRadius: wp(5),
    },
    modalContent: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      height: hp(30),
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      borderTopLeftRadius: wp(5),
      borderTopRightRadius: wp(5),
    },
    logoutView: {
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      width: wp(95),
      padding: wp(10),
      borderRadius: 20,
      gap: hp(1),
    },
    logoutButton: {
      paddingVertical: hp(1.6),
      width: wp(75),
      borderRadius: 50,
    },
    logoutButtonText: {
      color: Colors.White,
      textAlign: "center",
      fontSize: FontSize.font14,
      fontFamily: FontFamily.GilroyMedium,
    },
    subModelText: {
      fontSize: FontSize.font14,
      fontFamily: FontFamily.GilroyMedium,
      textAlign: "center",
      color: colorScheme === "dark" ? Colors.Grey : Colors.Black,
      marginBottom: hp(2),
      lineHeight: hp(2.5),
    },
  });

export default {
  LanguageModal,
  SignOutModal,
  ThemeModal,
};
