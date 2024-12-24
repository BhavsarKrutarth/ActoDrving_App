import React, { useState, useRef } from "react";
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from "react-native";
import {
  RNContainer,
  RNText,
  RNInput,
  RNLoader,
  RNKeyboardAvoid,
} from "../../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../../theme";
import FetchMethod from "../../api/FetchMethod";
import Toast from "react-native-toast-notifications";
import { useTheme } from "../../common/RNThemeContext";
import { Functions, Validation } from "../../utils";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DeleteAccount } from "./SettingComponent/Modals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  onAuthChange,
  setAsyncStorageValue,
} from "../../redux/Reducers/AuthReducers";

export default function Register({ navigation }) {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const toastRef = useRef();
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    firstName: userLoginData.firstName,
    lastName: userLoginData.lastName,
    email: userLoginData.emailID,
  });
  const [isNavigate, setIsNavigate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstNamevalid = isNavigate && state.firstName.length < 2;
  const IslastNameValid = isNavigate && state.lastName.length < 2;
  const isEmailError = isNavigate && !Validation.isEmailValid(state.email);
  const isValidation =
    state.firstName.length > 2 &&
    state.lastName.length > 2 &&
    Validation.isEmailValid(state.email);

  const OnUpdatePress = async () => {
    setIsNavigate(true);
    if (isValidation) {
      setIsLoading(true);
      try {
        const response = await FetchMethod.PUT({
          EndPoint: `Register/update?UserLoginID=${userLoginData.userLoginID}&EmailID=${state.email}&FirstName=${state.firstName}&lastName=${state.lastName}`,
        });
        if (response != null) {
          dispatch(onAuthChange(true));
          await Functions.setUserData(response);
          dispatch(setAsyncStorageValue(response));
          setTimeout(() => {
            toastRef.current.show(
              "Your profile has been successfully updated.",
              {
                type: "success",
                placement: "top",
                duration: 2000,
                offset: StatusBar.currentHeight + hp(2),
                animationType: "slide-in",
              }
            );
          }, 1000);
        }
      } catch (error) {
        setTimeout(() => {
          toastRef.current.show(
            "Ensure required fields are filled correctly.user cannot be update",
            {
              type: "danger",
              placement: "top",
              duration: 2000,
              offset: StatusBar.currentHeight + hp(2),
              animationType: "slide-in",
            }
          );
        }, 1000);
        console.log("register error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAccountRemove = async () => {
    try {
      const response = await FetchMethod.DELETE({
        EndPoint: `Register/delete?UserLoginID=${userLoginData.userLoginID}`,
      });
      if (response) {
        AsyncStorage.clear();
        dispatch(onAuthChange(false));
        dispatch(setAsyncStorageValue(""));
      }
    } catch (error) {
      Alert.alert("Error", error.msg);
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
              <View style={{ gap: hp(5) }}>
                <View style={styles(colorScheme).bottomView}>
                  <TouchableOpacity
                    style={styles(colorScheme).loginButton}
                    onPress={() => OnUpdatePress()}
                  >
                    <RNText style={styles(colorScheme).loginText}>
                      {t("Delete.update")}{" "}
                    </RNText>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => setShowSignOutConfirmation(true)}
                >
                  <RNText
                    color={"red"}
                    size={FontSize.font20}
                    align={"center"}
                    family={FontFamily.GilroyBold}
                  >
                    {t("Delete.Delete")}{" "}
                  </RNText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
        <DeleteAccount
          showSignOutConfirmation={showSignOutConfirmation}
          handleConfirmSignOut={handleAccountRemove}
          cancelSignOut={() => setShowSignOutConfirmation(false)}
          colorScheme={colorScheme}
          t={t}
        />
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
      fontSize: FontSize.font18,
      fontFamily: FontFamily.GilroyBold,
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
      fontSize: FontSize.font17,
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      height: hp(6),
      paddingHorizontal: wp(3),
    },
  });
