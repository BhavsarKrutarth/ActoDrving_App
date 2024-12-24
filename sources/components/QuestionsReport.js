import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { RNButton, RNContainer, RNStyles, RNText } from "../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../theme";
import PieChart from "react-native-pie-chart";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavRoutes } from "../navigation";
import { useSelector } from "react-redux";
import FetchMethod from "../api/FetchMethod";

const QuestionsReport = ({
  navigationScreen,
  component,
  quiz_Id,
  Topic_Id,
}) => {
  // const widthAndHeight = 250;
  // const series = [123, 321];
  // console.log("Id-->", quiz_Id, Topic_Id);
  // useFocusEffect(
  //   useCallback(() => {
  //     if (!quiz_Id) {
  //       getQuizData(quiz_Id);
  //     } else if (!Topic_Id) {
  //       GetTopicData(Topic_Id);
  //     }
  //   }, [quiz_Id, Topic_Id])
  // );
  const sliceColor = ["#FFF0ED", "#FF8469"];
  const Navigations = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const widthAndHeight = screenWidth * 0.8;
  const userAnswers = useSelector((state) => state.Quiz.userAnswers);
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const [isLoading, setLoading] = useState(false);
  const [state, setstate] = useState({
    TotalQuestions: 1,
    correctAnswers: 1,
    incorrectAnswers: 1,
    roundedPercentage: 0,
  });

  useFocusEffect(
    useCallback(() => {
      QuestionsReportDataGet();
    }, [quiz_Id, Topic_Id])
  );

  //console.log("userAnswer", JSON.stringify(ReportData, null, 2));

  const handleMistakedata = async () => {
    try {
      setLoading(true);
      const response = await FetchMethod.POST({
        EndPoint: `UserQuestions_Answer`,
        Params: JSON.stringify(userAnswers),
      });

      if (response.responseCode) {
        setLoading(false);
        //Navigations.navigate(navigationScreen, { component });
        // console.log("Mistdata response", response.responseCode);
      }
    } catch (error) {
      setLoading(false);
      //Navigations.navigate(navigationScreen, { component });
      console.log("Mistdata Error", error);
    }
  };
  const QuestionsReportDataGet = async () => {
    handleMistakedata();
    setLoading(true);
    const QuizID = quiz_Id ? quiz_Id : 0;
    const TopicId = Topic_Id ? Topic_Id : 0;
    //console.log("QuizID-TopicId", QuizID, TopicId);

    try {
      setLoading(true);
      const renpose = await FetchMethod.GET({
        EndPoint: `UserMistakesDataControllers/QuestionsAnswerReport?UserLoginId=${userLoginData.userLoginID}&TopicID=${TopicId}&QuizID=${QuizID}`,
      });
      if (renpose != "") {
        setLoading(true);
        if (renpose[0].responseCode == "0") {
          setLoading(false);
          //console.log("QuestionsReportDataGet-->", renpose);
          const percentage =
            renpose[0]?.totalQuestions > 0
              ? (
                  (renpose[0]?.correct / renpose[0]?.totalQuestions) *
                  100
                ).toFixed(1)
              : 0;
          setstate((p) => ({
            ...p,
            TotalQuestions: renpose[0].totalQuestions,
            correctAnswers: renpose[0].correct,
            incorrectAnswers: renpose[0].iNcorrect,
            roundedPercentage: percentage,
          }));
        } else {
          setLoading(false);
          console.log("QuestionsReportDataGet", renpose);
          setstate((p) => ({
            ...p,
            TotalQuestions: 0,
            correctAnswers: 1,
            incorrectAnswers: 1,
            roundedPercentage: 0,
          }));
          //return { rightQuestionsCount: 0, wrongQuestionsCount: 0 };
        }
      } else {
        setLoading(false);
        console.log("QuestionsReportDataGet", renpose);
        setstate((p) => ({
          ...p,
          TotalQuestions: 0,
          correctAnswers: 1,
          incorrectAnswers: 1,
          roundedPercentage: 0,
        }));
        //return { rightQuestionsCount: 0, wrongQuestionsCount: 0 };
      }
    } catch (error) {
      setLoading(false);
      console.log("QuestionsAnswerreportdata Get API error-->", error);
    }
  };
  // const getQuizData = (quiz_Id) => {
  //   handleMistakedata();
  //   // const quiz = ReportData.find((data) => data.QuizID === quiz_Id);
  //   // const quiz = ReportData?.[quiz_Id];
  //   // if (quiz) {
  //   //   const { rightQuestionsCoun, wrongQuestionsCoun } = quiz.questions || {};
  //   //   return {
  //   //     rightQuestionsCount: rightQuestionsCoun || 0,
  //   //     wrongQuestionsCount: wrongQuestionsCoun || 0,
  //   //   };
  //   // } else {
  //   //   console.log("Quiz not found!");
  //   //   return { rightQuestionsCount: 0, wrongQuestionsCount: 0 };
  //   // }
  // };

  // const GetTopicData = (Topic_Id) => {
  //   handleMistakedata();
  //   const vehicle = userAnswers?.[0]?.vehicles?.[0];
  //   const Topic = vehicle?.topic?.find((q) => q.topicID === Topic_Id);

  //   if (Topic) {
  //     const rightQuestionsCount = Topic.rightQuestions.length;
  //     const wrongQuestionsCount = Topic.wrongQuestions.length;

  //     return { rightQuestionsCount, wrongQuestionsCount };
  //   } else {
  //     console.log("Topic not found!");
  //     return { rightQuestionsCount: 0, wrongQuestionsCount: 0 }; // Or handle it in another appropriate way (e.g., show an error message)
  //   }
  // };

  // const { rightQuestionsCount, wrongQuestionsCount } = quiz_Id
  //   ? getQuizData(quiz_Id)
  //   : GetTopicData(Topic_Id);

  // const { rightQuestionsCount, wrongQuestionsCount } = QuestionsReportDataGet();

  // const totalQuestions = rightQuestionsCount + wrongQuestionsCount;
  // const rightPercentage =
  //   totalQuestions === 0 ? 50 : (rightQuestionsCount / totalQuestions) * 100;

  // const wrongPercentage =
  //   totalQuestions === 0 ? 50 : (wrongQuestionsCount / totalQuestions) * 100;
  // const roundedPercentage = Math.floor(rightPercentage);
  // const series = [wrongPercentage, rightPercentage];

  return (
    <RNContainer isLoading={isLoading}>
      <View style={styles.Container}>
        <View>
          <View style={styles.FlagBoxWrpper}>
            <View
              style={[styles.FlagBox, { backgroundColor: "#FF8469" }]}
            ></View>
            <Text style={styles.FlexBoxText}>Correct</Text>
          </View>
          <View style={styles.FlagBoxWrpper}>
            <View
              style={[styles.FlagBox, { backgroundColor: "#FFF0ED" }]}
            ></View>
            <Text style={styles.FlexBoxText}>Incorrect</Text>
          </View>
        </View>
        <View style={{ paddingVertical: hp(3) }}>
          <View style={{ alignItems: "center" }}>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={[state.incorrectAnswers, state.correctAnswers]}
              sliceColor={sliceColor}
              coverRadius={0.9}
              coverFill={"#FFF"}
            />
            <View style={{ position: "absolute", top: hp(15) }}>
              <RNText
                family={FontFamily.GilroyBold}
                size={FontSize.font35}
                style={{ textAlign: "center" }}
              >
                {state.roundedPercentage + "%"}
              </RNText>
              <RNText style={{ textAlign: "center" }}>
                {state.correctAnswers} out of {state.TotalQuestions}
              </RNText>
            </View>
            {/* <View style={{ position: "absolute", top: hp(13) }}>
              {percentageSeries.map((value, index) => (
                <View key={index}>
                  <RNText
                    family={FontFamily.GilroyBold}
                    size={FontSize.font35}
                    style={{ textAlign: "center" }}
                  >
                    60%
                  </RNText>
                </View>
              ))}
            </View> */}
          </View>
        </View>
        <View>
          <RNText
            size={FontSize.font20}
            family={FontFamily.GilroyBold}
            color={Colors.Black}
            style={{ textAlign: "center" }}
          >
            Almost There!
          </RNText>
          <RNText
            size={FontSize.font20}
            family={FontFamily.GilroyBold}
            color={Colors.Black}
            style={{ textAlign: "center", paddingTop: hp(0.3) }}
          >
            You’ll do better next time
          </RNText>
          <View style={{ paddingHorizontal: wp(3), paddingTop: hp(1.5) }}>
            <RNText
              color={Colors.DarkGrey}
              size={FontSize.font15}
              style={{ textAlign: "center" }}
            >
              Keep training to better your score ! If you need. go back to our
              study page and learn everything you need to know !
            </RNText>
          </View>
        </View>
        <View style={{ paddingTop: hp(8) }}>
          <RNButton
            onPress={() =>
              Navigations.navigate(navigationScreen, { component })
            }
            title={"continue"}
            style={{ backgroundColor: Colors.Orange }}
          />
        </View>
      </View>
    </RNContainer>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingHorizontal: wp(3),
    paddingVertical: hp(3),
  },
  FlagBox: {
    height: wp(4.5),
    width: wp(4.5),
  },
  FlagBoxWrpper: {
    ...RNStyles.flexRow,
    gap: wp(3),
    paddingBottom: hp(1),
  },
  FlexBoxText: {
    color: Colors.Black,
    fontFamily: FontFamily.GilroySemiBold,
    fontSize: FontSize.font15,
  },
  ContentDrakText: {},
  legend: {
    marginTop: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  colorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },
});
export default QuestionsReport;
