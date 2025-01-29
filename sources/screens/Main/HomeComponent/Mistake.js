import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { RNContainer, RNImage, RNStyles, RNText } from "../../../common";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../common/RNThemeContext";
import {
  Colors,
  FontFamily,
  FontSize,
  height,
  hp,
  normalize,
  width,
  wp,
} from "../../../theme";
import { useTranslation } from "react-i18next";
import {
  ADD_MiSTAKEDATA,
  SET_MISTAKEQUESTIONDATA,
  SET_SELECTED_QUESTIONDATA,
} from "../../../redux/Reducers/MistakeReducers";
import { CheckBox } from "@rneui/themed";
import { Image } from "react-native";
import QuitModal from "../../../components/QuitModal";
import { useNavigation } from "@react-navigation/native";
import { Modal } from "react-native";
import { Text } from "react-native-paper";
import AntDesign from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import FetchMethod from "../../../api/FetchMethod";
import { Images } from "../../../constants";
import { ADD_ANSWER } from "../../../redux/Reducers/QuizReducer";
import NetInfo from "@react-native-community/netinfo";

export default function Mistake() {
  const { t } = useTranslation();
  const { colorScheme, selectedLanguage } = useTheme();
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [correctOptionId, setCorrectOptionId] = useState(null);
  const Mistakequestions = useSelector(
    (state) => state.Mistake.mistakequesrtionsData
  );
  const navigation = useNavigation();
  const categoryData = useSelector((state) => state.Category.selectedCategory);
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const mistakeResponse = useSelector((state) => state.Mistake.mistakeResponse);
  const [modalVisible, setModalVisible] = useState(false);
  const [MistakeModal, SetMistakeModal] = useState(false);
  const [MistakeModalHandle, SetMistakeModalHandle] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [activityIndicator, SetactivityIndicator] = useState(false);
  const scrollRef = useRef();
  //console.log("mistakeResponse", JSON.stringify(mistakeResponse, null, 2));

  const handleNextQuestion = () => {
    scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
    if (currentQuestionIndex < Mistakequestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedId(null);
      setCorrectOptionId(null);
      setIsOptionSelected(false);
    } else {
      //console.log("Mistake Data Done");
      let QuizrightQuestionsLength = 0; // Variable to store the total sum of wrongQuestions lengths
      let TopicrightQuestionsLength = 0;
      mistakeResponse.forEach((response) => {
        response.vehicles?.forEach((vehicle) => {
          if (vehicle.quiz?.length > 0) {
            vehicle.quiz.forEach((quiz) => {
              const quizID = quiz.QuizID;
              const wrongQuestionsLength = quiz.wrongQuestions?.length || 0;
              QuizrightQuestionsLength += wrongQuestionsLength;
              // console.log(
              //   `QuizID: ${quizID}, Wrong Questions Length: ${wrongQuestionsLength}`
              // );
            });
          }
          if (vehicle.topic?.length > 0) {
            vehicle.topic.forEach((topic, index) => {
              const topicID = topic.topicID || `Topic-${index}`; // If topicID is missing, use index-based ID
              const wrongQuestionsLength = topic.wrongQuestions?.length || 0;
              TopicrightQuestionsLength += wrongQuestionsLength;
              // console.log(
              //   `TopicID: ${topicID}, Wrong Questions Length: ${wrongQuestionsLength}`
              // );
              // console.log(
              //   `Total TopicrightQuestionsLength: ${TopicrightQuestionsLength}`
              // );
            });
          } else {
            console.log("No quizzes found in this vehicle, skipping.");
          }
        });
      });

      // Example conditional logic based on the calculated length
      if (QuizrightQuestionsLength === 0 && TopicrightQuestionsLength === 0) {
        SetMistakeModalHandle(true);
        SetMistakeModal(true);
      } else {
        SetMistakeModalHandle(false);
        SetMistakeModal(true);
      }
    }
  };

  const handleMistakedata = async () => {
    try {
      SetactivityIndicator(true);
      const response = await FetchMethod.POST({
        EndPoint: `UserQuestions_Answer`,
        Params: JSON.stringify(mistakeResponse),
      });
      // console.log("UserQuestions_Answer response", response.responseCode);
      if (response.responseCode == "0") {
        setModalVisible(false);
        SetactivityIndicator(false);
        navigation.goBack();
        // dispatch(ADD_MiSTAKEDATA([]));
        // dispatch(ADD_ANSWER([]));
      } else {
        SetactivityIndicator(false);
        navigation.goBack();
        console.log("MistakeData Renpose error -->", response);
        //navigation.goBack();
      }
    } catch (error) {
      SetactivityIndicator(false);
      console.log("MistakeData Renpose error -->", error);
      //navigation.goBack();
    }
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        // Show the modal when back button is pressed
        if (!modalVisible) {
          setModalVisible(true);
          return true; // Prevent the default back action
        }
        // If modal is already visible, allow closing it
        setModalVisible(false);
        return true; // Prevent default back action while closing the modal
      }
    );
    return () => backHandler.remove(); // Cleanup the listener on unmount
  }, [modalVisible, isOffline]);

  useEffect(() => {
    // Subscribe to NetInfo updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected); // If not connected, set isOffline to true
    });
    return () => unsubscribe();
  }, []);

  const handleOptionPress = (option) => {
    if (!isOptionSelected) {
      setSelectedId(option.questions_OptionsID);
      setIsOptionSelected(true);
      const isCorrect = option.isCorrect;
      if (isCorrect) {
        setCorrectOptionId(null);
      } else {
        const correctOption = currentQuestion.options.find(
          (opt) => opt.isCorrect
        );
        setCorrectOptionId(correctOption.questions_OptionsID);
      }

      dispatch(
        ADD_MiSTAKEDATA({
          loginID: userLoginData.userLoginID,
          vehicleID: categoryData.vehicle_Id,
          ...(currentQuestion.dataType === "Quizdata"
            ? { QuizID: currentQuestion.testID }
            : { TopicID: currentQuestion.testID }),
          isCorrect,
          questionIndex: currentQuestion.questionId,
          // QuestionCounter: currentQuestionIndex + 1
        })
      );
    }
    ScrollToEndEffect();
  };
  const ScrollToEndEffect = () => {
    scrollRef.current.scrollToEnd({ animated: true });
    // scrollRef.current.scrollTo({ x: 0, y: 100, animated: true });
  };

  const currentQuestion = Mistakequestions[currentQuestionIndex];
  if (!Mistakequestions || Mistakequestions.length === 0) {
    return (
      <RNContainer>
        <View style={[RNStyles.flexCenter, { backgroundColor: Colors.White }]}>
          {/* <RNText style={{ fontFamily: FontFamily.GilroySemiBold }}>
          No data found
        </RNText> */}
          <RNImage
            source={Images.NotFound}
            style={{ height: hp(30), width: wp(50) }}
          />
        </View>
      </RNContainer>
    );
  }

  return (
    <RNContainer style={styles(colorScheme).container}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {currentQuestion.questions_ImageName !== "0" && (
          <View style={styles(colorScheme).bannerImage}>
            <RNImage
              style={{ width: wp(100) }}
              source={{ uri: currentQuestion.questions_ImageName }}
            />
          </View>
        )}

        <View style={styles(colorScheme).questionView}>
          <RNText
            style={[
              styles(colorScheme).optionText,
              {
                fontSize:
                  Platform.OS === "ios" ? FontSize.font20 : FontSize.font17,
                width: wp(90),
                paddingVertical: hp(2),
                lineHeight: hp(3.2),
              },
            ]}
          >
            {currentQuestionIndex + 1}. {currentQuestion.questionsText}
          </RNText>
        </View>

        <View
          style={[
            currentQuestion.options.some(
              (option) => option.options_Image_URL != "0"
            )
              ? RNStyles.flexWrapHorizontal
              : null,
            { width: wp(95), gap: 20, alignSelf: "center" },
          ]}
        >
          {currentQuestion.options.map((option) => (
            <TouchableOpacity
              key={option.questions_OptionsID}
              style={[
                option.options_Image_URL != "0"
                  ? styles(colorScheme).optionImage
                  : styles(colorScheme).optionbtn,
                {
                  padding: wp(4),
                  backgroundColor:
                    selectedId === option.questions_OptionsID
                      ? option.isCorrect
                        ? Colors.LightGreen
                        : Colors.lightRed
                      : correctOptionId === option.questions_OptionsID
                      ? Colors.LightGreen
                      : colorScheme === "dark"
                      ? "#111c22"
                      : Colors.lightWhite,
                  borderColor:
                    selectedId === option.questions_OptionsID
                      ? option.isCorrect
                        ? Colors.Green
                        : Colors.Red
                      : correctOptionId === option.questions_OptionsID
                      ? Colors.Green
                      : colorScheme === "dark"
                      ? "#111c22"
                      : Colors.lightWhite,
                },
              ]}
              onPress={() => handleOptionPress(option)}
            >
              {/* <RadioButton
                value={option.questions_OptionsID}
                status={
                  selectedId === option.questions_OptionsID
                    ? 'checked'
                    : 'unchecked'
                }
                color={Colors.White}
                onPress={() => handleOptionPress(option)}
              /> */}
              {/* <Image
                resizeMode="contain"
                source={
                  selectedId === option.questions_OptionsID ||
                  correctOptionId === option.questions_OptionsID
                    ? require("../../../assets/images/F_Radio.png")
                    : require("../../../assets/images/Radio.png")
                }
                style={{
                  width: wp(5),
                  height: wp(5),
                  tintColor:
                    selectedId === option.questions_OptionsID ||
                    correctOptionId === option.questions_OptionsID
                      ? Colors.White
                      : Colors.Grey,
                }}
              /> */}
              <View>
                <View
                  style={[
                    styles(colorScheme).RadioBtnView,
                    {
                      borderColor:
                        selectedId === option.questions_OptionsID ||
                        correctOptionId === option.questions_OptionsID
                          ? Colors.White
                          : Colors.Grey,
                    },
                  ]}
                >
                  {selectedId === option.questions_OptionsID ||
                  correctOptionId === option.questions_OptionsID ? (
                    <View
                      style={[
                        styles(colorScheme).RadioView,
                        {
                          backgroundColor:
                            selectedId === option.questions_OptionsID ||
                            correctOptionId === option.questions_OptionsID
                              ? Colors.White
                              : Colors.Grey,
                        },
                      ]}
                    ></View>
                  ) : (
                    <View></View>
                  )}
                </View>
              </View>
              {/* <CheckBox
                value={option.questions_OptionsID}
                checked={
                  selectedId === option.questions_OptionsID ||
                  correctOptionId === option.questions_OptionsID
                }
                onPress={() => handleOptionPress(option)}
                //onPress={() => setSelectedId(option.question_Option_id)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checkedColor="white"
                containerStyle={{
                  backgroundColor: 'transparent',
                  // height: hp(6),
                  width: wp(3),
                  //marginLeft: wp(2),
                  color: 'red',
                }}
                textStyle={{color: 'transparent'}}
              /> */}
              {option.options_Image_URL !== "0" ? (
                <RNImage
                  source={{ uri: option.options_Image_URL }}
                  style={styles(colorScheme).image}
                />
              ) : (
                <RNText
                  numberOfLines={2}
                  style={[
                    styles(colorScheme).optionText,
                    {
                      paddingLeft: wp(3),
                      fontFamily: FontFamily.GilroyMedium,
                      color:
                        selectedId === option.questions_OptionsID
                          ? Colors.White
                          : colorScheme === "dark"
                          ? Colors.lightWhite
                          : "#262626",
                    },
                  ]}
                >
                  {option.optionsText}
                </RNText>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={MistakeModal}
          onRequestClose={() => SetMistakeModal(false)}
          transparent={true}
          animationType="slide"
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles(colorScheme).modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles(colorScheme).ModalView}>
                  <View>
                    <View
                      style={{
                        position: "absolute",
                        right: wp(0),
                        top: hp(-2),
                      }}
                    >
                      <Pressable onPress={() => SetMistakeModal(false)}>
                        <AntDesign
                          name="close"
                          size={normalize(30)}
                          color={Colors.Grey}
                        />
                      </Pressable>
                    </View>
                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <View>
                        <LottieView
                          source={
                            MistakeModalHandle
                              ? require("../../../assets/lottie/success.json")
                              : require("../../../assets/lottie/warning.json")
                          }
                          style={{
                            height: MistakeModalHandle ? wp(25) : wp(15),
                            width: MistakeModalHandle ? wp(40) : wp(20),
                          }}
                          resizeMode="cover"
                          autoPlay
                          loop={false}
                        />
                      </View>

                      <RNText
                        family={FontFamily.GilroySemiBold}
                        size={FontSize.font21}
                        pTop={MistakeModalHandle ? hp(0) : hp(2)}
                      >
                        {MistakeModalHandle
                          ? t("MistkeModal.Success")
                          : t("MistkeModal.warning")}
                      </RNText>

                      <RNText
                        align={"center"}
                        pTop={hp(1)}
                        family={FontFamily.GilroyMedium}
                        color={"#858585"}
                        size={FontSize.font16}
                      >
                        {MistakeModalHandle
                          ? t("MistkeModal.SuccessContent")
                          : t("MistkeModal.tryagainContent")}
                      </RNText>
                      <TouchableOpacity
                        disabled={activityIndicator == true ? true : false}
                        onPress={() => handleMistakedata()}
                        style={[
                          styles(colorScheme).OkBtnStyle,
                          {
                            backgroundColor: MistakeModalHandle
                              ? "#00b33c"
                              : "#ff9933",
                          },
                        ]}
                      >
                        {activityIndicator == true ? (
                          <View
                            style={{
                              alignItems: "center",
                            }}
                          >
                            <ActivityIndicator size={"large"} />
                          </View>
                        ) : (
                          <RNText
                            family={FontFamily.GilroyMedium}
                            color={Colors.White}
                            size={FontSize.font17}
                            align={"center"}
                          >
                            {MistakeModalHandle
                              ? t("MistkeModal.Ok")
                              : t("MistkeModal.Tryagain")}
                          </RNText>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View style={styles(colorScheme).explanationView}>
          <View style={styles(colorScheme).explanationContainer}>
            <RNText style={styles(colorScheme).explanation}>
              {t("Question.explanation")}
            </RNText>
            <RNText style={styles(colorScheme).subtext}>
              {currentQuestion.explanation}
            </RNText>
          </View>
          <TouchableOpacity
            onPress={() => handleNextQuestion()}
            style={styles(colorScheme).nextButton}
          >
            <RNText style={styles(colorScheme).buttonText}>
              {t("Question.next")}
            </RNText>
          </TouchableOpacity>
        </View>
        <QuitModal
          visible={modalVisible}
          OnRequestClose={() => setModalVisible(false)}
          MistakeData={true}
        />
      </ScrollView>
    </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 15,
      backgroundColor: colorScheme === "dark" ? Colors.Black : Colors.White,
    },
    bannerImage: {
      paddingVertical: 10,
      flex: 1,
      height: 200,
    },
    questionView: {
      ...RNStyles.flexCenter,
      gap: 5,
      // padding: 20,
    },
    optionbtn: {
      ...RNStyles.flexRow,
      borderRadius: 5,
      borderWidth: 2,
      //padding: hp(0.5),
      gap: 5,
    },
    optionText: {
      fontSize: Platform.OS === "ios" ? FontSize.font16 : FontSize.font13,
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === "dark" ? Colors.lightWhite : Colors.Black,
      textTransform: "capitalize",
      width: wp(80),
    },
    radioButton: {
      height: wp(2),
      width: wp(2),
    },
    explanationView: {
      alignSelf: "center",
      width: wp(95),
      gap: 20,
      marginVertical: hp(2),
    },
    explanationContainer: {
      backgroundColor: colorScheme === "dark" ? "#a5d9b1" : "#dbf0e0",
      padding: wp(7),
      gap: 5,
      borderRadius: 10,
    },
    explanation: {
      color: Colors.Black,
      fontSize: Platform.OS === "ios" ? FontSize.font20 : FontSize.font18,
      fontFamily: FontFamily.GilroySemiBold,
    },
    subtext: {
      fontSize: Platform.OS === "ios" ? FontSize.font17 : FontSize.font13,
      fontFamily: FontFamily.GilroyMedium,
      color: Colors.DarkGrey,
      lineHeight: Platform.OS === "ios" ? hp(2.8) : hp(2.3),
    },
    nextButton: {
      ...RNStyles.flexCenter,
      backgroundColor: colorScheme === "dark" ? Colors.White : Colors.Black,
      padding: Platform.OS === "ios" ? hp(1.5) : hp(1),
      width: wp(20),
      borderRadius: 50,
    },
    buttonText: {
      color: colorScheme === "dark" ? Colors.Black : Colors.White,
      fontFamily: FontFamily.GilroyMedium,
      textTransform: "capitalize",
      fontSize: Platform.OS === "ios" ? FontSize.font18 : FontSize.font15,
    },
    optionImage: {
      width: wp(40),
      padding: wp(5),
      borderRadius: 5,
      borderWidth: 2,
      ...RNStyles.flexRowCenter,
    },
    image: {
      width: wp(20),
      height: wp(20),
    },
    loadingText: {
      ...RNStyles.flexCenter,
      fontFamily: FontFamily.Bold,
      fontSize: FontSize.font16,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    modalContainer: {
      ...RNStyles.flexCenter,
      backgroundColor:
        colorScheme === "dark"
          ? "rgba(35, 55, 67, 0.5)"
          : "rgba(0 ,0 , 0, 0.5)",
    },
    ModalView: {
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      width: wp(85),
      paddingHorizontal: wp(4),
      paddingVertical: hp(4),
      borderRadius: normalize(15),
    },
    OkBtnStyle: {
      paddingHorizontal: wp(5),
      paddingVertical: hp(1),
      borderRadius: normalize(8),
      width: wp(70),
      marginTop: hp(4),
    },
    RadioBtnView: {
      height: hp(2.6),
      width: hp(2.6),
      borderRadius: normalize(50),
      borderWidth: 3,
      justifyContent: "center",
      alignItems: "center",
    },
    RadioView: {
      height: hp(1.2),
      width: hp(1.2),
      borderRadius: normalize(50),
    },
  });
