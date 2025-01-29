import React, { useState, useRef, useTransition } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from "react-native";
import {
  RNContainer,
  RNImage,
  RNStyles,
  RNText,
  RNLoader,
  RNKeyboardAvoid,
} from "../../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../../theme";
import { useTheme } from "../../common/RNThemeContext";
import {
  onAuthChange,
  setAsyncStorageValue,
} from "../../redux/Reducers/AuthReducers";
import Toast from "react-native-toast-notifications";
import FetchMethod from "../../api/FetchMethod";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { Images } from "../../constants";
import { Functions } from "../../utils";

const initialPin = { a: "", b: "", c: "", d: "" };

export default function OTPScreen({ navigation, route }) {
  const { t } = useTranslation();

  const { RegisterData, Flag, component } = route.params;
  console.log("component", component, Flag);

  const [isLoading, setLoading] = useState(false);
  const toastRef = useRef();
  const [pin, setPin] = useState({ ...initialPin });
  console.log("pin", pin);
  const { colorScheme } = useTheme();
  const dispatch = useDispatch();

  const refs = {
    a: useRef(),
    b: useRef(),
    c: useRef(),
    d: useRef(),
  };

  const handleChangeText = (text, key) => {
    const newPin = { ...pin };
    newPin[key] = text;
    setPin(newPin);
    if (text === "") {
      const previousInput = {
        b: "a",
        c: "b",
        d: "c",
      };
      const previousKey = previousInput[key];
      if (previousKey) {
        refs[previousKey].current.focus();
      }
    } else if (text.length === 1) {
      const nextInput = {
        a: "b",
        b: "c",
        c: "d",
      };
      const nextKey = nextInput[key];
      if (nextKey) {
        refs[nextKey].current.focus();
      }
    }
  };

  const OnRegisterPress = async () => {
    setLoading(true);
    const enteredPin = Object.values(pin).join("");
    console.log("Entered PIN:", enteredPin);
    console.log("Expected Component:", component);

    if (enteredPin == component) {
      if (Flag === "RegisterData") {
        try {
          const response = await FetchMethod.POST({
            EndPoint: "Register",
            Params: {
              userLoginID: RegisterData.userLoginID,
              firstName: RegisterData.firstName,
              lastName: RegisterData.lastName,
              token: "",
              emailID: RegisterData.email,
              moblieNo: "",
              password: RegisterData.password,
              flag: "Register",
            },
          });
          console.log("Register response -->", response);
          if (response) {
            dispatch(onAuthChange(true));
            await Functions.setUserData(response);
            dispatch(setAsyncStorageValue(response));
          } else {
            setLoading(false);
            toastRef.current.show("Registration failed", {
              type: "danger",
              placement: "top",
              duration: 2000,
              offset: StatusBar.currentHeight + hp(2),
              animationType: "slide-in",
            });
          }
        } catch (error) {
          setLoading(false);
          setTimeout(() => {
            toastRef.current.show("Registration Error", {
              type: "danger",
              placement: "top",
              duration: 2000,
              offset: StatusBar.currentHeight + hp(2),
              animationType: "slide-in",
            });
          }, 1000);
          console.log("Register error", error);
        }
      } else if (Flag === "Forgotpassword") {
        setLoading(false);
        navigation.navigate("ResetPassword", { component: RegisterData });
      } else {
        setLoading(false);
        console.log("Flag Null");
      }
    } else {
      setLoading(false);
      toastRef.current.show("Invalid OTP", {
        type: "danger",
        placement: "top",
        duration: 2000,
        offset: StatusBar.currentHeight + hp(2),
        animationType: "slide-in",
      });
    }
  };

  const EmailCheck = async () => {
    try {
      const response = await FetchMethod.POST({
        EndPoint: `Forgotpass/CheckEmail`,
        Params: {
          email: RegisterData,
        },
      });
      console.log("Forgot Password Email response-->", response);
      setLoading(true);
      if (response.responseCode == 0) {
        navigation.navigate("OTPScreen", {
          component: response.otp,
          RegisterData: response.emailID,
          Flag: "Forgotpassword",
        });
      }
    } catch (error) {
      setLoading(false);
      console.log("Forgot Password Email error-->", error);
      seterror(true);
      setEmailError(false);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <RNLoader visible={isLoading} />;
  }

  return (
    <RNContainer style={[styles(colorScheme).Container]}>
      <RNKeyboardAvoid>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View style={styles(colorScheme).topContainer}>
            <RNImage
              style={styles(colorScheme).illustration}
              source={Images.otpscreen}
            />
            <RNText style={styles(colorScheme).title}>
              {t("OTPScreen.Verification")}
            </RNText>
            <RNText style={styles(colorScheme).subtitle}>
              {t("OTPScreen.otpDesc")}{" "}
              {Flag === "Forgotpassword" ? RegisterData : RegisterData.email}
            </RNText>
          </View>
          <View style={styles(colorScheme).otpContainer}>
            {Object.keys(pin).map((pinKey) => (
              <TextInput
                key={pinKey}
                ref={refs[pinKey]}
                style={styles(colorScheme).optSubContainer}
                maxLength={1}
                keyboardType="numeric"
                value={pin[pinKey]}
                onChangeText={(text) => handleChangeText(text, pinKey)}
                caretHidden
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    handleChangeText("", pinKey);
                  }
                }}
              />
            ))}
            <View style={{ flexDirection: "row" }}>
              <RNText style={styles(colorScheme).subtitle}>
                {t("OTPScreen.notReceive")}{" "}
              </RNText>
              <Pressable onPress={EmailCheck}>
                <RNText
                  style={[
                    styles(colorScheme).subtitle,
                    { color: Colors.Orange },
                  ]}
                >
                  {t("OTPScreen.ResendOTP")}{" "}
                </RNText>
              </Pressable>
            </View>
          </View>
          <TouchableOpacity
            style={styles(colorScheme).confirmButton}
            onPress={OnRegisterPress}
          >
            <RNText style={styles(colorScheme).confirmButtonText}>
              {t("OTPScreen.Confirm")}
            </RNText>
          </TouchableOpacity>
        </ScrollView>
      </RNKeyboardAvoid>
      <Toast ref={toastRef} />
    </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    Container: {
      ...RNStyles.flexCenter,
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      // paddingBottom: hp(5)
    },
    topContainer: {
      ...RNStyles.flexRowEnd,
      //flex: 1,
      // gap: hp(2),
    },
    title: {
      fontSize: Platform.OS === "ios" ? FontSize.font24 : FontSize.font21,
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === "dark" ? Colors.lightWhite : Colors.Black,
    },
    subtitle: {
      fontSize: Platform.OS === "ios" ? FontSize.font16 : FontSize.font14,
      fontFamily: FontFamily.GilroyMedium,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
      textAlign: "center",
      lineHeight: Platform.OS === "ios" ? hp(2.5) : hp(2),
      marginTop: hp(2),
    },
    illustration: {
      overflow: "hidden",
      width: Platform.OS === "ios" ? wp(70) : wp(75),
      height: Platform.OS === "ios" ? wp(70) : wp(75),
    },
    otpContainer: {
      ...RNStyles.flexWrapHorizontal,
      //flex: 0.5,
      gap: wp(4),
      justifyContent: "center",
      marginTop: hp(4),
    },
    optSubContainer: {
      ...RNStyles.flexRowCenter,
      height: wp(15),
      width: wp(15),
      backgroundColor: colorScheme === "dark" ? "#ffac99" : "#ffac99",
      borderRadius: 20,
      textAlign: "center",
      fontSize: FontSize.font18,
      color: Colors.White,
      fontFamily: FontFamily.GilroyBold,
    },
    confirmButton: {
      backgroundColor: Colors.Orange,
      paddingHorizontal: wp(10),
      paddingVertical: Platform.OS === "ios" ? hp(1.5) : hp(1),
      borderRadius: 10,
      width: "60%",
      alignSelf: "center",
      marginTop: hp(5),
    },
    confirmButtonText: {
      color: Colors.White,
      fontSize: Platform.OS === "ios" ? FontSize.font20 : FontSize.font17,
      fontFamily: FontFamily.GilroyBold,
      textAlign: "center",
    },
  });
