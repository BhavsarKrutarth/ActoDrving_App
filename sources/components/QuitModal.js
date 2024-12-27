import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import React from "react";
import { RNContainer, RNStyles, RNText } from "../common";
import FetchMethod from "../api/FetchMethod";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useTheme } from "../common/RNThemeContext";
import { Colors, FontFamily, FontSize, hp, wp } from "../theme";

const QuitModal = ({ visible, OnRequestClose, MistakeData }) => {
  //console.log("MistakeData", MistakeData);
  const userAnswers = useSelector((state) => state.Quiz.userAnswers);
  const mistakeResponse = useSelector((state) => state.Mistake.mistakeResponse);
  const { colorScheme, selectedLanguage } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const handleMistakedata = async () => {
    try {
      const response = await FetchMethod.POST({
        EndPoint: `UserQuestions_Answer`,
        Params: JSON.stringify(
          MistakeData == true ? mistakeResponse : userAnswers
        ),
      });
      //console.log("UserQuestions_Answer response", response);
      if (response.responseCode) {
        //console.log(response);
        navigation.goBack();
      }
    } catch (error) {
      navigation.goBack();
    }
  };
  return (
    // <RNContainer>
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={() => OnRequestClose()}
    >
      <TouchableWithoutFeedback onPress={() => OnRequestClose()}>
        <View style={styles(colorScheme).modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles(colorScheme).modalContent}>
              <RNText
                style={[
                  styles(colorScheme).titleText,
                  { paddingBottom: hp(1) },
                ]}
              >
                {t("header.leavemess")}{" "}
              </RNText>
              <View style={[RNStyles.flexRowCenter, { gap: 10 }]}>
                <TouchableOpacity
                  style={[
                    styles(colorScheme).button,
                    {
                      backgroundColor:
                        colorScheme === "dark" ? "#3e6075" : Colors.lightWhite,
                    },
                  ]}
                  onPress={() => {
                    OnRequestClose();
                  }}
                >
                  <RNText style={styles(colorScheme).dialogText}>
                    {t("header.Cancel")}{" "}
                  </RNText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles(colorScheme).button,
                    { backgroundColor: Colors.Orange },
                  ]}
                  onPress={async () => {
                    await handleMistakedata();
                    OnRequestClose();
                  }}
                >
                  <RNText
                    style={[
                      styles(colorScheme).dialogText,
                      { color: Colors.White },
                    ]}
                  >
                    {t("header.OK")}{" "}
                  </RNText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
    // </RNContainer>
  );
};

export default QuitModal;

const styles = (colorScheme) =>
  StyleSheet.create({
    modalContainer: {
      ...RNStyles.flexCenter,
      backgroundColor:
        colorScheme === "dark"
          ? "rgba(35, 55, 67, 0.5)"
          : "rgba(0 ,0 , 0, 0.5)",
    },
    modalContent: {
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      width: wp(70),
      padding: hp(4),
      borderRadius: 10,
      gap: 15,
    },
    dialogText: {
      fontFamily: FontFamily.Regular,
      fontSize: FontSize.font12,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      textAlign: "center",
    },
    button: {
      width: wp(25),
      padding: wp(1.8),
      borderRadius: 5,
    },
  });
