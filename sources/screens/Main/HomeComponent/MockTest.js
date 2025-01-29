import {
  BackHandler,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Colors,
  FontFamily,
  FontSize,
  height,
  hp,
  normalize,
  wp,
} from "../../../theme";
import { RNImage, RNLoader, RNStyles, RNText } from "../../../common";
import { useDispatch, useSelector } from "react-redux";
import FetchMethod from "../../../api/FetchMethod";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../common/RNThemeContext";
import {
  ADD_ANSWER,
  QUESTIONS_ANSWER,
  SET_CLEAR_QUESTIONDATA,
  SET_QUESTIONDATA,
} from "../../../redux/Reducers/QuizReducer";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { QuestionsReport } from "../../../components";
import { renderNode } from "@rneui/base";
import QuitModal from "../../../components/QuitModal";
import NetInfoScreen from "../../../components/NetInfo";
import NetInfo from "@react-native-community/netinfo";

export default function MockTest() {
  const { t } = useTranslation();
  const { colorScheme, selectedLanguage } = useTheme();
  const [selectedId, setSelectedId] = useState(null);
  const [correctOptionId, setCorrectOptionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [ReportScreen, SetReportScreen] = useState(false);
  const questions = useSelector((state) => state.Quiz.questionData);
  const selectedQuiz = useSelector((state) => state.Quiz.selectedQuiz);
  const selectedQuestion = useSelector((state) => state.Quiz.selectedQuestion);
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const userAnswers = useSelector((state) => state.Quiz.userAnswers);
  const [modalVisible, setModalVisible] = useState(false);
  const [RightQuestions, SetRightQuestions] = useState([]);
  const [WrongQuestions, SetWrongQuestions] = useState([]);
  const [AnswerCorrect, setAnswerCorrect] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const scrollRef = useRef();
  const mistakequesrtionsData = useSelector(
    (state) => state.Mistake.mistakequesrtionsData
  );
  const navigation = useNavigation();
  const datatype = "Quizdata";
  let currentQuestion = selectedQuestion || questions[currentQuestionIndex];
  //console.log("currentQuestion", currentQuestion);

  useFocusEffect(
    useCallback(() => {
      if (selectedQuiz?.fill_Questions == questions.length) {
        SetReportScreen(true);
        //QuestionsReports();
      } else {
        SetReportScreen(false);
      }
      fetchMistakeQuestions();
    }, [
      mistakequesrtionsData,
      selectedQuiz.quiz_Id,
      datatype,
      questions,
      selectedQuiz.fill_Questions,
    ])
  );
  useEffect(() => {
    // Subscribe to NetInfo updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected); // If not connected, set isOffline to true
    });
    return () => unsubscribe();
  }, []);

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
  }, [modalVisible]);

  useEffect(() => {
    fetchQuestions();
    return () => ClearData();
  }, [selectedQuiz, selectedLanguage, isOffline]);
  const ClearData = () => {
    dispatch(SET_CLEAR_QUESTIONDATA());
  };
  useEffect(() => {
    if (questions.length > 0 && selectedQuiz?.fill_Questions >= 0) {
      const initialIndex = Math.min(
        selectedQuiz.fill_Questions,
        questions.length - 1
      );
      // console.log("initialIndex", initialIndex);

      setCurrentQuestionIndex(initialIndex);
    }
  }, [questions, selectedQuiz]);

  useEffect(() => {
    if (selectedQuestion) {
      //  const index = questions.indexOf(selectedQuestion);
      const index = questions.findIndex(
        (question) => question.quiz_Id === selectedQuestion.quiz_Id
      );

      if (index !== -1) {
        setCurrentQuestionIndex(index);
        setSelectedId(null);
        setCorrectOptionId(null);
        setIsOptionSelected(false);
      }
    }
  }, [selectedQuestion, questions]);
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await FetchMethod.GET({
        EndPoint: `Question/getQuestions?quizId=${selectedQuiz.quiz_Id}&langCode=${selectedLanguage}`,
      });
      //console.log("SET_QUESTIONDATA =====>", response);
      dispatch(SET_QUESTIONDATA(response));
    } catch (error) {
      console.log("Error fetching QuizQuestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMistakeQuestions = () => {
    try {
      const filteredQuestions = mistakequesrtionsData
        .filter(
          (item) =>
            item.testID === selectedQuiz.quiz_Id && item.dataType === datatype
        )
        .map((item) => item.questionId);

      const completedQuestionIds = questions
        .slice(0, selectedQuiz.fill_Questions)
        .map((question) => question.questionId);

      const incorrectQuestions = completedQuestionIds.filter((id) =>
        filteredQuestions.includes(id)
      );

      const correctQuestions = completedQuestionIds.filter(
        (id) => !filteredQuestions.includes(id)
      );
      dispatch(
        ADD_ANSWER({
          loginID: userLoginData.userLoginID,
          vehicleID: selectedQuiz.vehicleId,
          QuizID: selectedQuiz.quiz_Id,
          isCorrect: false,
          questionIndex: incorrectQuestions,
          isTopic: false,
          QuestionCounter: selectedQuiz.fill_Questions,
        })
      );

      dispatch(
        ADD_ANSWER({
          loginID: userLoginData.userLoginID,
          vehicleID: selectedQuiz.vehicleId,
          QuizID: selectedQuiz.quiz_Id,
          isCorrect: true,
          questionIndex: correctQuestions,
          isTopic: false,
          QuestionCounter: selectedQuiz.fill_Questions,
        })
      );
    } catch (error) {
      console.log("Error fetching mistake questions:", error);
    }
  };
  const handleNextQuestion = () => {
    scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
    dispatch(
      QUESTIONS_ANSWER({
        loginID: userLoginData.userLoginID,
        vehicleID: selectedQuiz.vehicleId,
        QuizID: selectedQuiz.quiz_Id,
        //isCorrect,
        //questionIndex: currentQuestion.questionId,
        rightQuestions: RightQuestions,
        wrongQuestions: WrongQuestions,
        isTopic: false,
        QuestionCounter: currentQuestionIndex + 1,
      })
    );

    dispatch(
      ADD_ANSWER({
        loginID: userLoginData.userLoginID,
        vehicleID: selectedQuiz.vehicleId,
        QuizID: selectedQuiz.quiz_Id,
        isCorrect: AnswerCorrect,
        questionIndex: currentQuestion.questionId,
        isTopic: false,
        //QuestionCounter: currentQuestionIndex + 1,
      })
    );
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedId(null);
      setCorrectOptionId(null);
      setIsOptionSelected(false);
      // dispatch(
      //   QUESTIONS_ANSWER({
      //     loginID: userLoginData.userLoginID,
      //     vehicleID: selectedQuiz.vehicleId,
      //     QuizID: selectedQuiz.quiz_Id,
      //     //isCorrect,
      //     //questionIndex: currentQuestion.questionId,
      //     rightQuestions: RightQuestions,
      //     wrongQuestions: WrongQuestions,
      //     isTopic: false,
      //     QuestionCounter: currentQuestionIndex + 1,
      //   })
      // );
    } else {
      SetReportScreen(true);
      //QuestionsReports();
      console.log("Quiz completed!");
    }
    // if (currentQuestionIndex == questions.length - 1) {
    //   SetReportScreen(true);
    //   //QuestionsReports();
    //   console.log("Quiz completed!");
    // }
  };

  const handleOptionPress = (option) => {
    if (!isOptionSelected) {
      setSelectedId(option.question_Option_id);
      setIsOptionSelected(true);
      const isCorrect = option.isCorrect;
      setAnswerCorrect(isCorrect);
      if (isCorrect) {
        setCorrectOptionId(null);
        // SetRightQuestions.push(currentQuestion.questionId);
        SetRightQuestions((prevRightQuestions) => [
          ...prevRightQuestions,
          currentQuestion.questionId,
        ]);
      } else {
        const correctOption = currentQuestion.options.find(
          (opt) => opt.isCorrect
        );
        setCorrectOptionId(correctOption.question_Option_id);
        // SetWrongQuestions.push(currentQuestion.questionId);
        SetWrongQuestions((prevWrongQuestions) => [
          ...prevWrongQuestions,
          currentQuestion.questionId,
        ]);
      }
      ScrollToEndEffect();
      // dispatch(
      //   ADD_ANSWER({
      //     loginID: userLoginData.userLoginID,
      //     vehicleID: selectedQuiz.vehicleId,
      //     QuizID: selectedQuiz.quiz_Id,
      //     isCorrect,
      //     questionIndex: currentQuestion.questionId,
      //     isTopic: false,
      //     //QuestionCounter: currentQuestionIndex + 1,
      //   })
      // );

      // dispatch(
      //   QUESTIONS_ANSWER({
      //     loginID: userLoginData.userLoginID,
      //     vehicleID: selectedQuiz.vehicleId,
      //     QuizID: selectedQuiz.quiz_Id,
      //     isCorrect,
      //     questionIndex: currentQuestion.questionId,
      //     rightQuestions: RightQuestions,
      //     wrongQuestions: WrongQuestions,
      //     isTopic: false,
      //     QuestionCounter: currentQuestionIndex + 1,
      //   })
      // );
    }
  };

  if (!currentQuestion || currentQuestion == undefined) {
    return <RNLoader visible={isLoading} />;
  }

  const ScrollToEndEffect = () => {
    scrollRef.current.scrollToEnd({ animated: true });
  };

  return (
    <View style={[styles(colorScheme).container]}>
      {ReportScreen ? (
        <QuestionsReport
          // navigationScreen={"CNIndexes"}
          // component={"MockTest"}
          quiz_Id={selectedQuiz.quiz_Id}
        />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          ref={scrollRef}
          // onContentSizeChange={() => ScrollToEndEffect()}
        >
          {currentQuestion.imagePathURL != 0 && (
            <View style={styles(colorScheme).bannerImage}>
              <RNImage
                style={{ width: wp(100) }}
                source={{ uri: currentQuestion.imagePathURL }}
              />
            </View>
          )}

          <View style={styles(colorScheme).questionView}>
            <RNText
              style={[
                styles(colorScheme).optionText,
                {
                  fontSize:
                    Platform.OS === "ios" ? FontSize.font20 : FontSize.font15,
                  width: wp(90),
                  paddingVertical: hp(2),
                  lineHeight: hp(3.2),
                },
              ]}
            >
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </RNText>

            <View
              style={[
                currentQuestion.options.imageUrl !== "0" &&
                  RNStyles.flexWrapHorizontal,
                { width: wp(95), gap: 20 },
              ]}
            >
              {currentQuestion.options.map((option) => (
                <TouchableOpacity
                  key={option.question_Option_id}
                  style={[
                    option.imageUrl !== "0"
                      ? styles(colorScheme).optionImage
                      : styles(colorScheme).optionbtn,
                    {
                      padding: wp(4),
                      backgroundColor:
                        selectedId === option.question_Option_id
                          ? option.isCorrect
                            ? Colors.LightGreen
                            : Colors.lightRed
                          : correctOptionId === option.question_Option_id
                          ? Colors.LightGreen
                          : colorScheme === "dark"
                          ? "#111c22"
                          : Colors.lightWhite,
                      borderColor:
                        selectedId === option.question_Option_id
                          ? option.isCorrect
                            ? Colors.Green
                            : Colors.Red
                          : correctOptionId === option.question_Option_id
                          ? Colors.Green
                          : colorScheme === "dark"
                          ? "#111c22"
                          : Colors.lightWhite,
                    },
                  ]}
                  onPress={() => handleOptionPress(option)}
                >
                  {/* <RadioButton
                  value={option.question_Option_id}
                  status={
                    selectedId === option.question_Option_id ||
                    correctOptionId === option.question_Option_id
                      ? 'checked'
                      : 'unchecked'
                  }
                  onPress={() => handleOptionPress(option)}
                  color={Colors.White}
                /> */}
                  <View>
                    <View
                      style={[
                        styles(colorScheme).RadioBtnView,
                        {
                          borderColor:
                            selectedId === option.question_Option_id ||
                            correctOptionId === option.question_Option_id
                              ? Colors.White
                              : Colors.Grey,
                        },
                      ]}
                    >
                      {selectedId === option.question_Option_id ||
                      correctOptionId === option.question_Option_id ? (
                        <View
                          style={[
                            styles(colorScheme).RadioView,
                            {
                              backgroundColor:
                                selectedId === option.question_Option_id ||
                                correctOptionId === option.question_Option_id
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
                  {/* <Image
                    resizeMode="contain"
                    source={
                      selectedId === option.question_Option_id ||
                      correctOptionId === option.question_Option_id
                        ? require("../../../assets/images/F_Radio.png")
                        : require("../../../assets/images/Radio.png")
                    }
                    style={{
                      width: wp(6),
                      height: wp(5),
                      tintColor:
                        selectedId === option.question_Option_id ||
                        correctOptionId === option.question_Option_id
                          ? Colors.White
                          : Colors.Grey,
                    }}
                  /> */}
                  {/* <CheckBox
                  //color="red"
                  value={option.question_Option_id}
                  checked={
                    selectedId === option.question_Option_id ||
                    correctOptionId === option.question_Option_id
                  }
                  onPress={() => handleOptionPress(option)}
                  //onPress={() => setSelectedId(option.question_Option_id)}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  checkedColor="white"
                  //color={Colors.White}
                  containerStyle={{
                    backgroundColor: 'transparent',
                    // height: hp(6),
                    width: wp(3),
                    //marginLeft: wp(2),
                    color: 'red',
                  }}
                  textStyle={{color: 'transparent'}}
                /> */}
                  {option.imageUrl !== "0" ? (
                    <RNImage
                      source={{ uri: option.imageUrl }}
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
                            selectedId === option.question_Option_id ||
                            correctOptionId === option.question_Option_id
                              ? Colors.White
                              : colorScheme === "dark"
                              ? Colors.lightWhite
                              : "#262626",
                        },
                      ]}
                    >
                      {option.optionText}
                    </RNText>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

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
              onPress={handleNextQuestion}
              style={[
                styles(colorScheme).nextButton,
                {
                  backgroundColor: isOptionSelected
                    ? colorScheme === "dark"
                      ? Colors.White
                      : Colors.Black
                    : Colors.Grey,
                },
              ]}
              disabled={!isOptionSelected}
            >
              <RNText style={styles(colorScheme).buttonText}>
                {t("Question.next")}
              </RNText>
            </TouchableOpacity>
          </View>
          <QuitModal
            visible={modalVisible}
            OnRequestClose={() => setModalVisible(false)}
          />
        </ScrollView>
      )}
      <NetInfoScreen isvisible={isOffline} />
    </View>
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
    },
    optionbtn: {
      ...RNStyles.flexRow,
      borderRadius: 5,
      borderWidth: 2,
      gap: 5,
    },
    optionText: {
      fontSize: Platform.OS === "ios" ? FontSize.font18 : FontSize.font13,
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
