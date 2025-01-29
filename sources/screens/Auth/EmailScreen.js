import { useTheme } from "../../common/RNThemeContext";
import { Colors, FontFamily, FontSize, height, hp, wp } from "../../theme";
import {
  RNContainer,
  RNImage,
  RNInput,
  RNKeyboardAvoid,
  RNLoader,
  RNText,
} from "../../common";
import { useRef, useState } from "react";
import FetchMethod from "../../api/FetchMethod";
import Toast from "react-native-toast-notifications";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import { useTranslation } from "react-i18next";
import { Images } from "../../constants";

const EmailScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const [Email, SetEmail] = useState("");
  const toastRef = useRef();
  const [EmailError, setEmailError] = useState(false);
  const [iserror, seterror] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const EmailCheck = async () => {
    if (Email != "") {
      setIsLoading(true);
      try {
        const response = await FetchMethod.POST({
          EndPoint: `Forgotpass/CheckEmail`,
          Params: {
            email: Email,
          },
        });
        console.log("Forgot Password Email response-->", response);
        setIsLoading(true);
        if (response.responseCode == 0) {
          navigation.navigate("OTPScreen", {
            component: response.otp,
            RegisterData: response.emailID,
            Flag: "Forgotpassword",
          });
        }
      } catch (error) {
        setIsLoading(false);
        console.log("Forgot Password Email error-->", error);
        seterror(true);
        setEmailError(false);
      } finally {
        setIsLoading(false);
      }
    } else {
      seterror(false);
      setEmailError(true);
    }
  };

  if (isLoading) {
    return <RNLoader visible={isLoading} />;
  }

  return (
    <RNContainer style={styles(colorScheme).continer}>
      <RNKeyboardAvoid>
        <ScrollView
          // contentContainerStyle={{flexGrow: 1}}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          <View>
            <View style={{ height: hp(44) }}>
              <RNImage
                source={Images.email}
                style={styles(colorScheme).ImageView}
              />
              <View style={{ paddingHorizontal: wp(10) }}>
                <Text style={styles(colorScheme).ContenText}>
                  {t("forgotPass.Description")}
                </Text>
              </View>
            </View>
            <View style={{ height: hp(44), paddingHorizontal: wp(6) }}>
              <View style={styles(colorScheme).EmailView}>
                <Text
                  style={{
                    color:
                      colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
                    paddingHorizontal: wp(1),
                    fontSize:
                      Platform.OS === "ios" ? FontSize.font17 : FontSize.font15,
                    fontFamily: FontFamily.GilroySemiBold,
                  }}
                >
                  {t("forgotPass.Email")}
                </Text>
                <RNInput
                  style={styles(colorScheme).EmailInputView}
                  value={Email}
                  onChangeText={SetEmail}
                />
                <RNText
                  size={
                    Platform.OS === "ios" ? FontSize.font15 : FontSize.font12
                  }
                  style={{ paddingVertical: wp(1) }}
                  color="red"
                >
                  {EmailError ? " **please enter your Email" : ""}
                  {iserror ? "Invalid email address" : ""}
                </RNText>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ justifyContent: "flex-end" }}>
                  <TouchableOpacity
                    style={styles(colorScheme).SentButton}
                    onPress={() => EmailCheck()}
                  >
                    <RNText style={styles(colorScheme).SentText}>
                      {t("forgotPass.Send")}
                    </RNText>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </RNKeyboardAvoid>
      <Toast ref={toastRef} />
    </RNContainer>
  );
};

const styles = (colorScheme) =>
  StyleSheet.create({
    continer: {
      //flex: 1,
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
    },
    ImageView: {
      height: wp(70),
      width: wp(100),
    },
    ContenText: {
      fontSize: Platform.OS === "ios" ? FontSize.font17 : FontSize.font14,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
      textAlign: "center",
      fontFamily: FontFamily.GilroyMedium,
      paddingHorizontal: wp(5),
      lineHeight: hp(2.5),
    },
    EmailView: {
      paddingTop: hp(6),
      flex: 1,
    },
    EmailInputView: {
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderColor: "none",
      borderBottomColor: colorScheme === "dark" ? "white" : "black",
      fontFamily: FontFamily.GilroySemiBold,
      fontSize: Platform.OS === "ios" ? FontSize.font19 : FontSize.font15,
      paddingHorizontal: wp(1),
    },
    SentButton: {
      backgroundColor: Colors.Orange,
      borderRadius: 5,
      padding: Platform.OS === "ios" ? hp(2) : hp(1.5),
    },
    SentText: {
      color: Colors.White,
      fontSize: Platform.OS === "ios" ? FontSize.font20 : FontSize.font17,
      fontFamily: FontFamily.GilroySemiBold,
      textAlign: "center",
    },
  });
export default EmailScreen;
