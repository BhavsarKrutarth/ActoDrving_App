import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { Colors, FontFamily, FontSize, hp, wp } from "../../theme";
import RNStyles from "../../common/RNStyles";
import RNText from "../../common/RNText";
import RNImage from "../../common/RNImage";
import { useTheme } from "../../common/RNThemeContext";
import FetchMethod from "../../api/FetchMethod";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { Images } from "../../constants";
import QuitModal from "../../components/QuitModal";

const RNMistakeHeader = ({}) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isCountQue, setCountQuestion] = useState(false);
  const { colorScheme } = useTheme();
  const mistakequesrtionsData = useSelector(
    (state) => state.Mistake.mistakequesrtionsData
  );
  const mistakeResponse = useSelector((state) => state.Mistake.mistakeResponse);
  const handlePressBack = () => {
    setModalVisible(true);
  };

  // const handleMistakedata = async () => {
  //   try {
  //     const response = await FetchMethod.POST({
  //       EndPoint: `UserQuestions_Answer`,
  //       Params: JSON.stringify(mistakeResponse),
  //     });
  //     //console.log(response);
  //     if (response.responseCode) {
  //       navigation.goBack();
  //     }
  //   } catch (error) {
  //     navigation.goBack();
  //   }
  // };

  const vehicleData = mistakeResponse.flatMap((user) =>
    user.vehicles.map((vehicle) => ({
      vehicleID: vehicle.vehicleID,
      quizzes: vehicle.quiz,
      topics: vehicle.topic,
    }))
  );

  const getBorderColor = (testID, questionId, dataType) => {
    for (const vehicle of vehicleData) {
      if (dataType == "Quizdata") {
        for (const quiz of vehicle.quizzes) {
          // console.log(questionId);

          if (quiz.QuizID === testID) {
            //console.log("quiz.QuizID === testID", quiz.QuizID === testID);

            const rightQuestions = quiz.rightQuestions;
            const wrongQuestions = quiz.wrongQuestions;
            if (rightQuestions.includes(questionId)) {
              return Colors.Green;
            }
            if (wrongQuestions.includes(questionId)) {
              return Colors.Red;
            }
          }
        }
      } else if (dataType == "Topicdata") {
        for (const topic of vehicle.topics) {
          if (topic.TopicID === testID) {
            const rightQuestions = topic.rightQuestions;
            const wrongQuestions = topic.wrongQuestions;
            if (rightQuestions.includes(questionId)) {
              return Colors.Green;
            }
            if (wrongQuestions.includes(questionId)) {
              return Colors.Red;
            }
          }
        }
      }
    }
    return colorScheme === "dark" ? "#3e6075" : "#CCC";
  };

  return (
    <SafeAreaView style={styles(colorScheme).headerContainer}>
      <View
        style={[RNStyles.flexRowCenter, { gap: 20, paddingHorizontal: 10 }]}
      >
        <TouchableOpacity onPress={handlePressBack}>
          <RNImage
            style={styles(colorScheme).backIcon}
            source={Images.leftarrow}
          />
        </TouchableOpacity>
        <RNText style={[RNStyles.flexRowCenter, styles(colorScheme).titleText]}>
          {t("header.MistakeTest")}{" "}
        </RNText>
      </View>
      <View
        style={[RNStyles.flexRowCenter, { gap: 10, paddingHorizontal: 10 }]}
      >
        <TouchableOpacity onPress={() => setCountQuestion(!isCountQue)}>
          <RNImage
            resizeMode="contain"
            style={styles(colorScheme).optionIcon}
            source={
              colorScheme === "dark"
                ? require("../../assets/images/customer-satisfaction1.png")
                : require("../../assets/images/customer-satisfaction.png")
            }
          />
        </TouchableOpacity>
      </View>

      {/* CountQuestion modal container */}
      {isCountQue && (
        <View
          style={[
            styles(colorScheme).questionCount,
            RNStyles.flexWrapHorizontal,
          ]}
        >
          {mistakequesrtionsData.map((question, index) => {
            const borderColor = getBorderColor(
              question.testID,
              question.questionId,
              question.dataType
            );
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles(colorScheme).QutionsIndex,
                  { borderColor: borderColor },
                ]}
              >
                <RNText style={styles(colorScheme).QuestionsIndexText}>
                  {index + 1}
                </RNText>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Setting modal container */}
      <QuitModal
        visible={modalVisible}
        OnRequestClose={() => setModalVisible(false)}
        MistakeData={true}
      />
      {/* <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles(colorScheme).modalContainer}>
          <View style={styles(colorScheme).modalContent}>
            <RNText style={styles(colorScheme).titleText}>
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
                onPress={() => setModalVisible(false)}
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
                  setModalVisible(false);
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
        </View>
      </Modal> */}
    </SafeAreaView>
  );
};

const styles = (colorScheme) =>
  StyleSheet.create({
    headerContainer: {
      borderBottomWidth: 1,
      height: Platform.OS === "ios" ? hp(12) : hp(8),
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      borderColor: colorScheme === "dark" ? Colors.Grey : Colors.LightGrey,
    },
    backIcon: {
      height: wp(5),
      width: wp(5),
    },
    titleText: {
      fontFamily: FontFamily.SemiBold,
      fontSize: FontSize.font14,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      textAlign: "center",
    },
    optionIcon: {
      height: wp(8),
      width: wp(8),
    },
    questionCount: {
      position: "absolute",
      top: Platform.OS === "ios" ? hp(10) : hp(5),
      marginHorizontal: wp(4),
      right: 0,
      zIndex: 1,
      borderRadius: 10,
      padding: 20,
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      elevation: 7,
      gap: 5,
      width: wp(80),
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    QutionsIndex: {
      ...RNStyles.flexRowCenter,
      borderWidth: 1,
      height: wp(7),
      width: wp(7),
      borderRadius: 5,
    },
    QuestionsIndexText: {
      fontSize: FontSize.font10,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    // modalContainer: {
    //   ...RNStyles.flexCenter,
    //   backgroundColor:
    //     colorScheme === "dark"
    //       ? "rgba(35, 55, 67, 0.5)"
    //       : "rgba(0 ,0 , 0, 0.5)",
    // },
    // modalContent: {
    //   backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
    //   width: wp(70),
    //   padding: hp(5),
    //   borderRadius: 10,
    //   gap: 15,
    // },
    // dialogText: {
    //   fontFamily: FontFamily.Regular,
    //   fontSize: FontSize.font12,
    //   color: colorScheme === "dark" ? Colors.White : Colors.Black,
    //   textAlign: "center",
    // },
    // button: {
    //   width: wp(25),
    //   padding: wp(1.5),
    //   borderRadius: 5,
    // },
  });

export default RNMistakeHeader;
