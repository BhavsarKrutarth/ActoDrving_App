import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from "react-native";
import {
  RNContainer,
  RNText,
  RNInput,
  RNLoader,
  RNImage,
  RNKeyboardAvoid,
} from "../../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../../theme";
import { Text } from "react-native-paper";
import FetchMethod from "../../api/FetchMethod";
import Toast from "react-native-toast-notifications";
import { useTheme } from "../../common/RNThemeContext";
import { Validation } from "../../utils";
import { useTranslation } from "react-i18next";

export default function Register({ navigation }) {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const toastRef = useRef();
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isNavigate, setIsNavigate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [PasswordError, setPasswordError] = useState(false);

  const isFirstNamevalid = isNavigate && state.firstName.length < 2;
  const IslastNameValid = isNavigate && state.lastName.length < 2;
  const isEmailError = isNavigate && !Validation.isEmailValid(state.email);

  const isValidation =
    state.firstName.length > 2 &&
    state.lastName.length > 2 &&
    Validation.isEmailValid(state.email);

  const OnRegisterPress = async () => {
    setIsNavigate(true);
    if (state.password == "") {
      setPasswordError(t("errors.Password"));
    } else if (state.password.length < 8 && state.password.length > 0) {
      setPasswordError(t("errors.passLength"));
    } else if (!Validation.isPasswordValid(state.password)) {
      setPasswordError(t("errors.errPasswordValidation"));
    }
    if (isValidation) {
      setIsLoading(true);
      try {
        const response = await FetchMethod.POST({
          EndPoint: "Register/OTP",
          Params: {
            email: state.email,
            firstName: state.firstName,
            moblieNo: "",
          },
        });
        console.log("Register response -->", response.otp);
        if (response != null) {
          navigation.navigate("OTPScreen", {
            component: response.otp,
            RegisterData: state,
            Flag: "RegisterData",
          });
        } else {
          toastRef.current.show(`Registration failed`, {
            type: "danger",
            placement: "top",
            duration: 2000,
            offset: StatusBar.currentHeight + hp(2),
            animationType: "slide-in",
          });
        }
      } catch (error) {
        setTimeout(() => {
          toastRef.current.show("User already exists", {
            type: "danger",
            placement: "top",
            duration: 2000,
            offset: StatusBar.currentHeight + hp(2),
            animationType: "slide-in",
          });
        }, 1000);
        console.log("register error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading) {
    return <RNLoader visible={isLoading} />;
  }

  return (
    <RNContainer
      style={{
        backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      }}
      // hidden={true}
    >
      <RNKeyboardAvoid offSet={Platform.OS === "ios" ? hp(15) : hp(0)}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View style={{ justifyContent: "center", flex: 1, marginTop: hp(5) }}>
            <View style={{ paddingHorizontal: wp(5) }}>
              <View style={styles(colorScheme).InputViewBox}>
                <RNText style={styles(colorScheme).userText}>
                  {t("Register.FirstName")}{" "}
                  <Text
                    style={{ color: Colors.Orange, fontSize: FontSize.font18 }}
                  >
                    *
                  </Text>
                </RNText>
                <RNInput
                  placeholder={t("Register.FirstName")}
                  value={state.firstName}
                  onChangeText={(v) =>
                    setState((p) => ({ ...p, firstName: v }))
                  }
                  style={styles(colorScheme).InputView}
                />
                <RNText
                  size={FontSize.font12}
                  pBottom={hp(1)}
                  pTop={hp(isFirstNamevalid ? 0.5 : 0)}
                  color={Colors.Red}
                >
                  {isFirstNamevalid ? t("errors.FirstName") : ""}
                </RNText>
              </View>
              <View style={styles(colorScheme).InputViewBox}>
                <RNText style={styles(colorScheme).userText}>
                  {t("Register.LastName")}{" "}
                  <Text
                    style={{ color: Colors.Orange, fontSize: FontSize.font18 }}
                  >
                    *
                  </Text>
                </RNText>
                <RNInput
                  placeholder={t("Register.LastName")}
                  value={state.lastName}
                  onChangeText={(v) => setState((p) => ({ ...p, lastName: v }))}
                  style={styles(colorScheme).InputView}
                />
                <RNText
                  size={FontSize.font12}
                  pBottom={hp(1)}
                  pTop={hp(IslastNameValid ? 0.5 : 0)}
                  color={Colors.Red}
                >
                  {IslastNameValid ? t("errors.LastName") : ""}
                </RNText>
              </View>
              <View style={styles(colorScheme).InputViewBox}>
                <RNText style={styles(colorScheme).userText}>
                  {t("Register.Email")}{" "}
                  <Text
                    style={{ color: Colors.Orange, fontSize: FontSize.font18 }}
                  >
                    *
                  </Text>
                </RNText>
                <RNInput
                  placeholder={"E-mail"}
                  value={state.email}
                  onChangeText={(v) => setState((p) => ({ ...p, email: v }))}
                  style={styles(colorScheme).InputView}
                />
              </View>
              <RNText
                size={FontSize.font12}
                pBottom={hp(1)}
                pTop={hp(isEmailError ? 0.5 : 0)}
                color={Colors.Red}
              >
                {isEmailError ? t("errors.Email") : ""}
              </RNText>
              <View style={styles(colorScheme).InputViewBox}>
                <RNText style={styles(colorScheme).userText}>
                  {t("Register.Password")}{" "}
                  <Text style={{ color: Colors.Orange }}>*</Text>
                </RNText>
                <View
                  style={[
                    styles(colorScheme).inputContainer,
                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                  ]}
                >
                  <RNInput
                    style={styles(colorScheme).userInput}
                    placeholder="Password"
                    value={state.password}
                    onChangeText={(v) =>
                      setState((p) => ({ ...p, password: v }))
                    }
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <RNImage
                      style={{ width: wp(5), height: wp(5) }}
                      source={
                        showPassword
                          ? colorScheme === "dark"
                            ? require("../../assets/images/eye-off.png")
                            : require("../../assets/images/eye-off1.png")
                          : colorScheme === "dark"
                          ? require("../../assets/images/eye-on.png")
                          : require("../../assets/images/eye-on1.png")
                      }
                    />
                  </TouchableOpacity>
                </View>
                <RNText
                  size={FontSize.font12}
                  pBottom={hp(1)}
                  pTop={hp(PasswordError ? 0.5 : 0)}
                  color={Colors.Red}
                >
                  {PasswordError || ""}
                </RNText>
              </View>
              <View style={styles(colorScheme).bottomView}>
                <TouchableOpacity
                  style={styles(colorScheme).loginButton}
                  onPress={() => OnRegisterPress()}
                >
                  <RNText style={styles(colorScheme).loginText}>
                    {t("Register.Register")}{" "}
                  </RNText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </RNKeyboardAvoid>
      <Toast ref={toastRef} />
    </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    InputViewBox: {
      marginBottom: hp(0),
    },
    userText: {
      fontSize: FontSize.font14,
      fontFamily: FontFamily.Medium,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      paddingBottom: hp(1),
    },
    bottomView: {
      justifyContent: "center",
      marginTop: hp(4),
    },
    loginButton: {
      backgroundColor: Colors.Orange,
      borderRadius: 5,
      padding: hp(2),
      width: wp(90),
    },
    loginText: {
      color: Colors.White,
      fontSize: FontSize.font16,
      fontFamily: "Poppins-Medium",
      textAlign: "center",
    },
    inputContainer: {
      borderWidth: 2,
      borderColor: Colors.lightWhite,
      borderRadius: 10,
      padding: 0,
      paddingHorizontal: 15,
      height: hp(6),
    },
    userInput: {
      height: hp(6),
      width: wp(75),
      fontFamily: FontFamily.Medium,
      fontSize: FontSize.font14,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      borderWidth: 0,
    },
    InputView: {
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      height: hp(6),
      paddingHorizontal: wp(3),
    },
  });
