import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { RNContainer, RNStyles, RNText } from "../common";
import FetchMethod from "../api/FetchMethod";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useTheme } from "../common/RNThemeContext";
import { Colors, FontFamily, FontSize, hp, wp } from "../theme";
import {
  ADD_MiSTAKEDATA,
  SET_MISTAKEQUESTIONDATA,
  SET_SELECTED_QUESTIONDATA,
} from "../redux/Reducers/MistakeReducers";
import {
  ADD_ANSWER,
  QUESTIONS_ANSWER,
  SET_CLEAR_QUESTIONDATA,
  SET_SELECTED_QUIZDATA,
} from "../redux/Reducers/QuizReducer";

const QuitModal = ({ visible, OnRequestClose, MistakeData }) => {
  //console.log("MistakeData", MistakeData);
  const userAnswers = useSelector((state) => state.Quiz.userAnswers);
  const mistakeResponse = useSelector((state) => state.Mistake.mistakeResponse);
  const data = useSelector((state) => state.Quiz.data);
  const { colorScheme, selectedLanguage } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  //console.log("MistakeData", JSON.stringify(mistakeResponse, null, 2));
  // console.log(userAnswers);

  const handleMistakedata = async () => {
    try {
      const response = await FetchMethod.POST({
        EndPoint: `UserQuestions_Answer`,
        Params: JSON.stringify(MistakeData == true ? mistakeResponse : data),
      });
      //console.log("UserQuestions_Answer response", response.responseCode);
      if (response.responseCode == "0") {
        // console.log(response);
        // dispatch(SET_MISTAKEQUESTIONDATA([]));
        // dispatch(ADD_MiSTAKEDATA([]));
        dispatch(QUESTIONS_ANSWER([]));
        // dispatch(SET_CLEAR_QUESTIONDATA());
        navigation.goBack();
      } else {
        console.log("MistakeData Renpose error -->", response);
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
              <View style={[RNStyles.flexRowCenter, { gap: wp(5) }]}>
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
      padding: hp(3),
      borderRadius: 10,
      gap: hp(2.5),
    },
    titleText: {
      fontFamily: FontFamily.GilroySemiBold,
      fontSize: Platform.OS === "ios" ? FontSize.font20 : FontSize.font16,
      lineHeight: Platform.OS === "ios" ? hp(3) : hp(2.5),
      textAlign: "center",
    },
    dialogText: {
      fontFamily: FontFamily.GilroySemiBold,
      fontSize: Platform.OS === "ios" ? FontSize.font17 : FontSize.font12,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      textAlign: "center",
    },
    button: {
      width: wp(28),
      padding: wp(2.5),
      borderRadius: 5,
    },
  });
