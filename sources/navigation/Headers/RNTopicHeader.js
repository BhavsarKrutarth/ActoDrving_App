import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { Colors, FontFamily, FontSize, hp, wp } from "../../theme";
import RNStyles from "../../common/RNStyles";
import RNText from "../../common/RNText";
import RNImage from "../../common/RNImage";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../common/RNThemeContext";
import FetchMethod from "../../api/FetchMethod";
import { useTranslation } from "react-i18next";
import { Images } from "../../constants";
import QuitModal from "../../components/QuitModal";

const RNTopicHeader = ({ route }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isCountQue, setCountQuestion] = useState(false);
  const { colorScheme } = useTheme();
  const userAnswers = useSelector((state) => state.Quiz.userAnswers);
  const selectedTopic = useSelector((state) => state.Topic.selectedTopic);
  const topicQuestion = useSelector((state) => state.Topic.QuestionData);

  // const handleQuestions = (index) => {
  //   dispatch(SET_SELECTED_TOPICQUESTION(topicQuestion[index]));
  // };

  const handlePressBack = () => {
    setModalVisible(true);
  };

  // const handleMistakedata = async () => {
  //   try {
  //     const response = await FetchMethod.POST({
  //       EndPoint: `UserQuestions_Answer`,
  //       Params: JSON.stringify(userAnswers),
  //     });
  //     console.log(response);
  //     if (response.responseCode) {
  //       navigation.goBack();
  //     }
  //   } catch (error) {
  //     navigation.goBack();
  //   }
  // };

  const vehicleTopicIndex = userAnswers
    .flatMap((user) =>
      user.vehicles.map((vehicle, index) => {
        return { vehicle, index };
      })
    )
    .find(({ vehicle }) => {
      return vehicle.topic.some(
        (topic) => topic.topicID === selectedTopic.topicID
      );
    })?.index;
  const TopicAnswer =
    userAnswers.flatMap((user) =>
      user.vehicles.flatMap((vehicle) =>
        vehicle.topic.find((topic) => topic.topicID === selectedTopic.topicID)
      )
    )[vehicleTopicIndex] || {};

  const rightQuestions = TopicAnswer.rightQuestions || [];
  const wrongQuestions = TopicAnswer.wrongQuestions || [];

  const getBorderColor = (topicQuestion_ID) => {
    if (rightQuestions.includes(topicQuestion_ID)) {
      return Colors.Green;
    }
    if (wrongQuestions.includes(topicQuestion_ID)) {
      return Colors.Red;
    }
    return colorScheme === "dark" ? "#3e6075" : "#CCC";
  };

  return (
    <View style={styles(colorScheme).headerContainer}>
      <View style={[RNStyles.flexRowCenter, { gap: 20 }]}>
        <TouchableOpacity onPress={handlePressBack} hitSlop={20}>
          <RNImage
            style={styles(colorScheme).backIcon}
            source={Images.leftarrow}
          />
        </TouchableOpacity>
        <RNText style={[RNStyles.flexRowCenter, styles(colorScheme).titleText]}>
          {t("header.TopicTest")}{" "}
        </RNText>
      </View>
      <View style={[RNStyles.flexRowCenter, { gap: 10 }]}>
        <TouchableOpacity onPress={() => setCountQuestion(!isCountQue)}>
          <RNImage
            resizeMode="contain"
            style={styles(colorScheme).optionIcon}
            source={Images.customersatisfaction}
          />
        </TouchableOpacity>
      </View>

      {/* CountQuestion modal container */}
      {isCountQue && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isCountQue}
          onRequestClose={() => setCountQuestion(false)}
        >
          <TouchableWithoutFeedback onPress={() => setCountQuestion(false)}>
            <View style={styles(colorScheme).overlay}>
              <TouchableOpacity
                style={styles(colorScheme).questionCountModal}
                activeOpacity={1}
              >
                <ScrollView
                  contentContainerStyle={styles(colorScheme).scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  {[...Array(selectedTopic.question_Count)].map((_, index) => {
                    const topicQuestion_ID =
                      topicQuestion[index]?.topicQuestion_ID;
                    const borderColor = getBorderColor(topicQuestion_ID);
                    return (
                      <Pressable
                        key={index}
                        style={[
                          styles(colorScheme).QutionsIndex,
                          { borderColor: borderColor },
                        ]}
                      >
                        <RNText style={styles(colorScheme).QuestionsIndexText}>
                          {index + 1}
                        </RNText>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* Setting modal container */}
      <QuitModal
        visible={modalVisible}
        OnRequestClose={() => setModalVisible(false)}
      />
      {/* <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles(colorScheme).modalContainer}>
          <View style={styles(colorScheme).modalContent}>
            <RNText
              style={[styles(colorScheme).titleText, { paddingBottom: hp(1) }]}
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
                  setModalVisible(false);
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
    </View>
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
      paddingHorizontal: 10,
      paddingTop: Platform.OS === "ios" ? hp(5) : hp(0),
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
    overlay: {
      flex: 1,
      alignItems: "flex-end",
      top: Platform.OS === "ios" ? hp(11) : hp(5.5),
      right: 1,
      marginHorizontal: wp(2),
      shadowColor: "#000",
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    questionCountModal: {
      width: wp(80),
      maxHeight: hp(30),
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      borderRadius: 10,
      padding: 20,
      elevation: 7,
    },
    scrollContent: {
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 5,
    },
    QutionsIndex: {
      borderWidth: 1,
      height: wp(7),
      width: wp(7),
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
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
    //   padding: hp(4),
    //   borderRadius: 10,
    //   gap: 15,
    // },
    // dialogText: {
    //   fontSize: FontSize.font13,
    //   fontFamily: FontFamily.SemiBold,
    //   color: colorScheme === "dark" ? Colors.White : Colors.Black,
    // },
    // button: {
    //   width: wp(28),
    //   borderRadius: 7,
    //   height: wp(8),
    //   alignItems: "center",
    //   justifyContent: "center",
    // },
  });

export default RNTopicHeader;
