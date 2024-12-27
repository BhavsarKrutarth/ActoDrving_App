import {
  BackHandler,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Colors, FontFamily, FontSize, hp, wp } from "../../../theme";
import { RNImage, RNLoader, RNStyles, RNText } from "../../../common";
import { RadioButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import FetchMethod from "../../../api/FetchMethod";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../common/RNThemeContext";
import { SET_TOPICQUESTION_DATA } from "../../../redux/Reducers/TopicReducer";
import { ADD_ANSWER } from "../../../redux/Reducers/QuizReducer";
import { useFocusEffect } from "@react-navigation/native";
import { CheckBox, Icon } from "@rneui/themed";
import { Image } from "react-native";
import { QuestionsReport } from "../../../components";
import QuitModal from "../../../components/QuitModal";

export default function TopicTest() {
  const { t } = useTranslation();
  const { colorScheme, selectedLanguage } = useTheme();
  const [selectedId, setSelectedId] = useState(null);
  const [correctOptionId, setCorrectOptionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const dispatch = useDispatch();
  const datatype = "Topicdata";
  const questions = useSelector((state) => state.Topic.QuestionData);
  const selectedTopic = useSelector((state) => state.Topic.selectedTopic);
  const selectedQuestion = useSelector((state) => state.Topic.selectedQuestion);
  const userAnswers = useSelector((state) => state.Quiz.userAnswers);
  const mistakequesrtionsData = useSelector(
    (state) => state.Mistake.mistakequesrtionsData
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [ReportScreen, SetReportScreen] = useState(false);
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const [isLoading, setLoading] = useState(false);
  //console.log(JSON.stringify(userAnswers, null, 2));

  useFocusEffect(
    useCallback(() => {
      if (selectedTopic?.fill_Questions == questions.length) {
        // SetReportScreen(true);
        QuestionsReports();
      } else {
        SetReportScreen(false);
      }
      const fetchMistakeQuestions = () => {
        try {
          const filteredQuestions = mistakequesrtionsData
            .filter(
              (item) =>
                item.testID === selectedTopic.topicID &&
                item.dataType === datatype
            )
            .map((item) => item.questionId);

          const completedQuestionIds = questions
            .slice(0, selectedTopic.fill_Questions)
            .map((question) => question.topicQuestion_ID);
          const incorrectQuestions = completedQuestionIds.filter((id) =>
            filteredQuestions.includes(id)
          );
          const correctQuestions = completedQuestionIds.filter(
            (id) => !filteredQuestions.includes(id)
          );

          dispatch(
            ADD_ANSWER({
              loginID: userLoginData.userLoginID,
              vehicleID: selectedTopic.vehicleID,
              TopicID: selectedTopic.topicID,
              isCorrect: false,
              questionIndex: incorrectQuestions,
              isTopic: true,
              QuestionCounter: selectedTopic.fill_Questions,
            })
          );

          dispatch(
            ADD_ANSWER({
              loginID: userLoginData.userLoginID,
              vehicleID: selectedTopic.vehicleID,
              TopicID: selectedTopic.topicID,
              isCorrect: true,
              questionIndex: correctQuestions,
              isTopic: true,
              QuestionCounter: selectedTopic.fill_Questions,
            })
          );
        } catch (error) {
          console.log("Error fetching mistake questions:", error);
        }
      };
      fetchMistakeQuestions();
    }, [
      mistakequesrtionsData,
      selectedTopic.topicID,
      datatype,
      questions,
      selectedTopic.fill_Questions,
    ])
  );
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
  const QuestionsReports = async () => {
    setLoading(true);
    const vehicle = userAnswers?.[0]?.vehicles?.[0];
    const Topic = vehicle?.topic?.find(
      (q) => q.topicID === selectedTopic.topicID
    );
    //console.log("Topic", Topic);
    const rightQuestionsCount = Topic.rightQuestions.length;
    const wrongQuestionsCount = Topic.wrongQuestions.length;
    const TotalQuestions = rightQuestionsCount + wrongQuestionsCount;

    try {
      const response = await FetchMethod.POST({
        EndPoint: `UserMistakesDataControllers/QuestionsReport`,
        Params: {
          quizID: 0,
          userLoginID: userLoginData.userLoginID,
          topicID: selectedTopic.topicID,
          totalQuestions: TotalQuestions,
          correct: rightQuestionsCount,
          iNcorrect: wrongQuestionsCount,
        },
      });
      setLoading(false);
      // dispatch(SET_QUESTIONDATA(response));
      if (response) {
        setLoading(false);
        SetReportScreen(true);
        console.log("Questions Answer Report Data renpose", response);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error fetching QuizQuestions:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      //console.log("selectedTopic.topicID", selectedTopic.topicID);
      setLoading(true);
      try {
        const response = await FetchMethod.GET({
          EndPoint: `TopicQuestions/getTopicQuestions?topicID=${selectedTopic.topicID}&languageCode=${selectedLanguage}`,
        });
        dispatch(SET_TOPICQUESTION_DATA(response));
      } catch (error) {
        console.log("Error fetching Topic:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, selectedTopic, selectedLanguage]);

  useEffect(() => {
    if (questions.length > 0 && selectedTopic?.fill_Questions >= 0) {
      const initialIndex = Math.min(
        selectedTopic.fill_Questions,
        questions.length - 1
      );
      setCurrentQuestionIndex(initialIndex);
    }
  }, [questions, selectedTopic]);

  useEffect(() => {
    if (selectedQuestion) {
      const index = questions.findIndex(
        (question) =>
          question.topicQuestion_ID === selectedQuestion.topicQuestion_ID
      );
      if (index !== -1) {
        setCurrentQuestionIndex(index);
        setSelectedId(null);
        setCorrectOptionId(null);
        setIsOptionSelected(false);
      }
    }
  }, [selectedQuestion, questions]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedId(null);
      setCorrectOptionId(null);
      setIsOptionSelected(false);
    } else {
      // SetReportScreen(true);
      console.log("Quiz completed!");
      QuestionsReports();
    }
  };

  const handleOptionPress = (option) => {
    if (!isOptionSelected) {
      setSelectedId(option.topic_Question_Option_ID);
      setIsOptionSelected(true);
      const isCorrect = option.is_correct;
      if (isCorrect) {
        setCorrectOptionId(null);
      } else {
        const correctOption = currentQuestion.options.find(
          (opt) => opt.is_correct
        );
        setCorrectOptionId(correctOption.topic_Question_Option_ID);
      }

      dispatch(
        ADD_ANSWER({
          loginID: userLoginData.userLoginID,
          vehicleID: selectedTopic.vehicleID,
          TopicID: selectedTopic.topicID,
          isCorrect,
          questionIndex: currentQuestion.topicQuestion_ID,
          isTopic: true,
          QuestionCounter: currentQuestionIndex + 1,
        })
      );
    }
  };

  const currentQuestion = questions[currentQuestionIndex] || selectedQuestion;
  if (
    !currentQuestion ||
    !currentQuestion.options ||
    currentQuestion.options.length === 0
  ) {
    return <RNLoader visible={isLoading} />;
  }

  return (
    <View style={[styles(colorScheme).container]}>
      {ReportScreen ? (
        <QuestionsReport
          navigationScreen={"CNIndexes"}
          component={"TopicTest"}
          Topic_Id={selectedTopic.topicID}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* imageView */}
          {currentQuestion.questionImage != "0" && (
            <View style={styles(colorScheme).bannerImage}>
              <RNImage
                style={{ width: wp(100) }}
                source={{ uri: currentQuestion.questionImage }}
              />
            </View>
          )}

          {/* question/option component */}
          <View style={styles(colorScheme).questionView}>
            <RNText
              style={[
                styles(colorScheme).optionText,
                {
                  fontSize: FontSize.font18,
                  width: wp(90),
                  paddingVertical: hp(2),
                },
              ]}
            >
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </RNText>

            <View
              style={[
                currentQuestion?.options?.some(
                  (option) => option.optionImage !== "0"
                ) && RNStyles.flexWrapHorizontal,
                { width: wp(95), gap: 20 },
              ]}
            >
              {currentQuestion?.options?.map((option) => (
                <TouchableOpacity
                  key={option.topic_Question_Option_ID}
                  style={[
                    option.optionImage !== "0"
                      ? styles(colorScheme).optionImage
                      : styles(colorScheme).optionbtn,
                    {
                      padding: wp(4),
                      backgroundColor:
                        selectedId === option.topic_Question_Option_ID
                          ? option.is_correct
                            ? Colors.LightGreen
                            : Colors.lightRed
                          : correctOptionId === option.topic_Question_Option_ID
                          ? Colors.LightGreen
                          : colorScheme === "dark"
                          ? "#111c22"
                          : Colors.lightWhite,
                      borderColor:
                        selectedId === option.topic_Question_Option_ID
                          ? option.is_correct
                            ? Colors.Green
                            : Colors.Red
                          : correctOptionId === option.topic_Question_Option_ID
                          ? Colors.Green
                          : colorScheme === "dark"
                          ? "#111c22"
                          : Colors.lightWhite,
                    },
                  ]}
                  onPress={() => handleOptionPress(option)}
                >
                  {/* <RadioButton
                  value={option.topic_Question_Option_ID}
                  status={selectedId === option.topic_Question_Option_ID ? 'checked' : (correctOptionId === option.topic_Question_Option_ID ? 'checked' : 'unchecked')}
                  onPress={() => handleOptionPress(option)}
                  color={Colors.White}
                /> */}
                  <Image
                    resizeMode="contain"
                    source={
                      selectedId === option.topic_Question_Option_ID ||
                      correctOptionId === option.topic_Question_Option_ID
                        ? require("../../../assets/images/F_Radio.png")
                        : require("../../../assets/images/Radio.png")
                    }
                    style={{
                      width: wp(5),
                      height: wp(5),
                      tintColor:
                        selectedId === option.topic_Question_Option_ID ||
                        correctOptionId === option.topic_Question_Option_ID
                          ? Colors.White
                          : Colors.Grey,
                    }}
                  />
                  {/* <CheckBox
                  value={option.topic_Question_Option_ID}
                  checked={
                    selectedId === option.topic_Question_Option_ID ||
                    correctOptionId === option.topic_Question_Option_ID
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
                  {option.optionImage !== "0" ? (
                    <RNImage
                      source={{ uri: option.optionImage }}
                      style={styles(colorScheme).image}
                    />
                  ) : (
                    <RNText
                      numberOfLines={2}
                      style={[
                        styles(colorScheme).optionText,
                        {
                          paddingLeft: wp(3),
                          fontFamily: FontFamily.Medium,
                          color:
                            selectedId === option.topic_Question_Option_ID
                              ? Colors.White
                              : correctOptionId ===
                                option.topic_Question_Option_ID
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

          {/* explanation component */}
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
      // padding: 20,
    },
    optionbtn: {
      ...RNStyles.flexRow,
      borderRadius: 5,
      borderWidth: 2,
      // padding: hp(0.5),
      gap: 5,
    },
    optionText: {
      fontSize: FontSize.font13,
      fontFamily: FontFamily.SemiBold,
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
      fontSize: FontSize.font18,
      fontFamily: FontFamily.SemiBold,
    },
    subtext: {
      fontSize: FontSize.font12,
      fontFamily: FontFamily.Medium,
      color: Colors.DarkGrey,
    },
    nextButton: {
      ...RNStyles.flexCenter,
      backgroundColor: colorScheme === "dark" ? Colors.White : Colors.Black,
      padding: hp(1),
      width: wp(25),
      borderRadius: 50,
    },
    buttonText: {
      color: colorScheme === "dark" ? Colors.Black : Colors.White,
      fontFamily: FontFamily.Medium,
      textTransform: "capitalize",
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
  });
