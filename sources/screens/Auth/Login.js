import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import FetchMethod from "../../api/FetchMethod";
import Toast from "react-native-toast-notifications";
import {
  onAuthChange,
  setAsyncStorageValue,
} from "../../redux/Reducers/AuthReducers";
import { useDispatch } from "react-redux";
import { Images } from "../../constants";
import { Functions } from "../../utils";
import { hoverGestureHandlerProps } from "react-native-gesture-handler/lib/typescript/handlers/gestures/hoverGesture";
// import { GoogleSignin } from "@react-native-google-signin/google-signin";
// import { appleAuth } from "@invertase/react-native-apple-authentication";

export default function Login({ navigation }) {
  const { t } = useTranslation();
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const { colorScheme } = useTheme();
  const [isLoading, setLoading] = useState(false);
  const toastRef = useRef();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginBtnDisabled, setLoginBtnDisabled] = useState(true);

  // GoogleSignin.configure({
  //   // "676136670646-l8glp1iovmo8u6n3oa5r08qpe556so9d.apps.googleusercontent.com",
  //   webClientId:
  //     "676136670646-l8glp1iovmo8u6n3oa5r08qpe556so9d.apps.googleusercontent.com",
  //   offlineAccess: true,
  //   scopes: ["email", "profile"],
  //   iosClientId:
  //     "676136670646-sth07223adbr6cvdt3954ukj9n0ropou.apps.googleusercontent.com",
  // });
  useEffect(() => {
    setLoginBtnDisabled(number === "" || password === "");
  }, [number, password]);

  // const onGoogleButtonPress = async () => {
  //   try {
  //     console.log("Checking Play Services...");
  //     await GoogleSignin.hasPlayServices({
  //       showPlayServicesUpdateDialog: true,
  //     });

  //     console.log("Attempting Google Sign-In...");
  //     const response = await GoogleSignin.signIn();
  //     console.log("Google Sign-In Response:", response);

  //     if (response.data?.idToken) {
  //       console.log("Google ID Token found:", response.data?.idToken);
  //       const googleCredential = auth.GoogleAuthProvider.credential(
  //         response.idToken
  //       );
  //       console.log("Signing in with Google Credential...");
  //       return auth().signInWithCredential(googleCredential);
  //     } else {
  //       console.log("Google Sign-In failed: ID Token is null.");
  //     }
  //   } catch (error) {
  //     console.log("Google Sign-In Error:", error);
  //   }
  // };

  // const onAppleButtonPress = async () => {
  //   // Start the sign-in request
  //   const appleAuthRequestResponse = await appleAuth.performRequest({
  //     requestedOperation: appleAuth.Operation.LOGIN,
  //     // As per the FAQ of react-native-apple-authentication, the name should come first in the following array.
  //     // See: https://github.com/invertase/react-native-apple-authentication#faqs
  //     requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
  //   });

  //   // Ensure Apple returned a user identityToken
  //   if (!appleAuthRequestResponse.identityToken) {
  //     throw new Error("Apple Sign-In failed - no identify token returned");
  //   }

  //   // Create a Firebase credential from the response
  //   const { identityToken, nonce } = appleAuthRequestResponse;
  //   const appleCredential = auth.AppleAuthProvider.credential(
  //     identityToken,
  //     nonce
  //   );

  //   // Sign the user in with the credential
  //   return auth().signInWithCredential(appleCredential);
  // };

  const handleMobileLogin = useCallback(async () => {
    const newErrors = {};
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await FetchMethod.POST({
        EndPoint: `Login`,
        Params: {
          emailID: number,
          password: password,
        },
      });
      if (response != null) {
        dispatch(onAuthChange(true));
        await Functions.setUserData(response);
        dispatch(setAsyncStorageValue(response));
      }
    } catch (error) {
      setErrors({ global: t("errors.tryagain") });
      console.log("login error", error);
      setLoading(false);
    }
  }, [number, password]);

  if (isLoading) {
    return <RNLoader visible={isLoading} />;
  }

  return (
    <RNContainer
      style={{
        gap: hp(5),
        backgroundColor: colorScheme === "dark" ? Colors.Black : Colors.White,
      }}
    >
      <RNKeyboardAvoid>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View
            style={[
              RNStyles.flexRowEnd,
              { gap: wp(2), marginHorizontal: wp(5) },
            ]}
          >
            <RNImage
              style={{ width: wp(8), height: wp(8) }}
              source={Images.profile}
            />
            <View style={{ marginHorizontal: hp(5) }}>
              <RNText style={styles(colorScheme).title}>
                {t("Auth.login")}
              </RNText>
              <RNText style={styles(colorScheme).subTitle}>
                {t("Auth.Des")}
              </RNText>
            </View>
          </View>

          <View style={styles(colorScheme).dataView}>
            <View style={{ gap: wp(1) }}>
              <View style={{ flexDirection: "row", gap: 2 }}>
                <RNText style={styles(colorScheme).userText}>
                  {t("Auth.email")}{" "}
                  <RNText style={{ color: Colors.Orange }}>*</RNText>
                </RNText>
              </View>
              <TextInput
                style={styles(colorScheme).emailContainer}
                placeholder={t("Auth.email")}
                placeholderTextColor={
                  colorScheme === "dark" ? Colors.DarkGrey : Colors.LightGrey
                }
                value={number}
                onChangeText={setNumber}
              />
              {/* <RNText
                size={FontSize.font12}
                color="red"
                pBottom={hp(1)}
                pTop={hp(errors.number ? 0.5 : 0)}>
                {errors.number || ''}
              </RNText> */}
            </View>
            <View style={{ gap: wp(1) }}>
              <View style={{ flexDirection: "row", gap: 2 }}>
                <RNText style={styles(colorScheme).userText}>
                  {t("Auth.password")}{" "}
                  <RNText style={{ color: Colors.Orange }}>*</RNText>
                </RNText>
              </View>
              <View
                style={[
                  styles(colorScheme).passwordContainer,
                  RNStyles.flexRowBetween,
                ]}
              >
                <TextInput
                  style={styles(colorScheme).passwordInput}
                  placeholder={t("Auth.password")}
                  placeholderTextColor={
                    colorScheme === "dark" ? Colors.DarkGrey : Colors.LightGrey
                  }
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <RNImage
                    style={{ width: wp(5), height: wp(5) }}
                    source={showPassword ? Images.eyeoff : Images.eyeon}
                  />
                </TouchableOpacity>
              </View>
              {errors.global && (
                <RNText
                  style={{
                    fontSize: FontSize.font12,
                    color: "red",
                    textAlign: "center",
                    paddingTop: 5,
                  }}
                >
                  {errors.global}
                </RNText>
              )}
            </View>

            <TouchableOpacity
              style={{ alignItems: "flex-end" }}
              onPress={() => navigation.navigate("EmailScreen")}
            >
              <RNText
                style={[
                  {
                    fontSize: FontSize.font11,
                    color: "#269DF3",
                    fontFamily: FontFamily.Regular,
                  },
                ]}
              >
                {t("Auth.passforget")}
              </RNText>
            </TouchableOpacity>
          </View>

          <View style={styles(colorScheme).bottomView}>
            <TouchableOpacity
              style={[
                styles(colorScheme).loginButton,
                {
                  backgroundColor: isLoginBtnDisabled
                    ? "#ffc1b3"
                    : Colors.Orange,
                },
              ]}
              onPress={handleMobileLogin}
              disabled={isLoginBtnDisabled}
            >
              <RNText style={styles(colorScheme).loginText}>
                {t("Auth.login")}
              </RNText>
            </TouchableOpacity>
            {/* <View style={{ paddingTop: hp(4) }}>
              <TouchableOpacity
                style={styles(colorScheme).SocialBtnStyles}
                onPress={() => onGoogleButtonPress()}
              >
                <View style={styles(colorScheme).SocaialBtnView}>
                  <RNImage
                    source={Images.Google}
                    style={{ width: wp(6), height: wp(6) }}
                  />
                  <RNText style={styles(colorScheme).SocialBtnText}>
                    Log in With Google
                  </RNText>
                </View>
              </TouchableOpacity>
              {Platform.OS === "ios" ? (
                <TouchableOpacity
                  onPress={() => onAppleButtonPress()}
                  style={[
                    styles(colorScheme).SocialBtnStyles,
                    { marginTop: hp(1) },
                  ]}
                >
                  <View style={styles(colorScheme).SocaialBtnView}>
                    <RNImage
                      source={Images.Apple}
                      style={{ width: wp(6.5), height: wp(6.5) }}
                    />
                    <RNText style={styles(colorScheme).SocialBtnText}>
                      Continue With Apple
                    </RNText>
                  </View>
                </TouchableOpacity>
              ) : (
                ""
              )}
            </View> */}
            <View style={styles(colorScheme).newRegister}>
              <RNText
                style={{
                  fontSize: FontSize.font12,
                  color: colorScheme === "dark" ? Colors.White : Colors.Black,
                }}
              >
                {t("Auth.Newto")}
              </RNText>
              <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <RNText style={{ fontSize: FontSize.font12, color: "#269DF3" }}>
                  {t("Auth.registerhere")}
                </RNText>
              </TouchableOpacity>
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
    title: {
      fontSize: FontSize.font22,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      textAlign: "center",
    },
    newRegister: {
      ...RNStyles.center,
      marginTop: hp(2),
      flexDirection: "row",
      gap: wp(1),
    },
    subTitle: {
      fontSize: FontSize.font13,
      fontFamily: FontFamily.Medium,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
      textAlign: "center",
    },
    dataView: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: wp(5),
      gap: hp(2),
    },
    text: {
      fontSize: FontSize.font12,
      fontFamily: FontFamily.Medium,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
    },
    row: {
      borderWidth: 0.2,
      borderColor: Colors.LightGrey,
      width: wp(30),
      height: wp(0),
    },
    userText: {
      fontSize: FontSize.font14,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    emailContainer: {
      borderWidth: 2,
      borderColor: Colors.lightWhite,
      borderRadius: 10,
      padding: 0,
      paddingHorizontal: 15,
      height: hp(6),
      fontFamily: FontFamily.Medium,
      fontSize: FontSize.font13,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    passwordContainer: {
      borderWidth: 2,
      borderColor: Colors.lightWhite,
      borderRadius: 10,
      paddingHorizontal: 15,
      height: hp(6),
    },
    passwordInput: {
      width: wp(75),
      fontFamily: FontFamily.Medium,
      fontSize: FontSize.font13,
      padding: 0,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    confirmButton: {
      fontSize: FontSize.font11,
      fontFamily: FontFamily.Medium,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
      textAlign: "right",
    },
    bottomView: {
      flex: 0.8,
      justifyContent: "flex-start",
      paddingHorizontal: wp(5),
    },
    loginButton: {
      borderRadius: 5,
      padding: hp(1.5),
    },
    loginText: {
      color: Colors.White,
      fontSize: FontSize.font16,
      fontFamily: FontFamily.SemiBold,
      textAlign: "center",
    },
    SocialBtnStyles: {
      backgroundColor: "#F3F3F3",
      paddingVertical: hp(1.2),
      borderRadius: 5,
    },
    SocialBtnText: {
      color: Colors.Black,
      fontSize: FontSize.font15,
      fontFamily: FontFamily.SemiBold,
      textAlign: "center",
    },
    SocaialBtnView: {
      ...RNStyles.flexRowCenter,
      gap: wp(3),
    },
  });
