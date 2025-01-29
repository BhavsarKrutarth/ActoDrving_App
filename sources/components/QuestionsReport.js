import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import React, { useCallback, useState } from "react";
import { RNButton, RNContainer, RNStyles, RNText } from "../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../theme";
import PieChart from "react-native-pie-chart";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NavRoutes } from "../navigation";
import { useDispatch, useSelector } from "react-redux";
import FetchMethod from "../api/FetchMethod";
import { QUESTIONS_ANSWER } from "../redux/Reducers/QuizReducer";
import { Modal } from "react-native-paper";
import { useTranslation } from "react-i18next";

const QuestionsReport = ({
  // navigationScreen,
  // component,
  quiz_Id,
  Topic_Id,
}) => {
  const sliceColor = ["#FFF0ED", "#FF8469"];
  const Navigations = useNavigation();
  const screenWidth = Dimensions.get("window").width;
  const widthAndHeight = screenWidth * 0.8;
  const userAnswers = useSelector((state) => state.Quiz.userAnswers);
  const data = useSelector((state) => state.Quiz.data);
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [state, setstate] = useState({
    TotalQuestions: 1,
    correctAnswers: 1,
    incorrectAnswers: 1,
    roundedPercentage: 0,
  });
  useFocusEffect(
    useCallback(() => {
      if (data != undefined) {
        //console.log("data-vehile", data[0].loginID);
        if (data[0].loginID != undefined) {
          handleMistakedata();
        } else {
          QuestionsReportDataGet();
        }
      } else {
        QuestionsReportDataGet();
      }
    }, [quiz_Id, Topic_Id])
  );

  const handleMistakedata = async () => {
    try {
      setLoading(true);
      const response = await FetchMethod.POST({
        EndPoint: `UserQuestions_Answer`,
        Params: JSON.stringify(data),
      });
      if (response.responseCode == "0") {
        setLoading(false);
        dispatch(QUESTIONS_ANSWER([]));
        QuestionsReportDataGet();
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
    // handleMistakedata();
    setLoading(true);
    const QuizID = quiz_Id ? quiz_Id : 0;
    const TopicId = Topic_Id ? Topic_Id : 0;

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
          //console.log("QuestionsReportDataGet", renpose);
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
        //console.log("QuestionsReportDataGet", renpose);
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

  return (
    <RNContainer isLoading={isLoading}>
      <View style={styles.Container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <View style={styles.FlagBoxWrpper}>
              <View
                style={[styles.FlagBox, { backgroundColor: "#FF8469" }]}
              ></View>
              <Text style={styles.FlexBoxText}>
                {t("QuestionsReport.Correct")}
              </Text>
            </View>
            <View style={styles.FlagBoxWrpper}>
              <View
                style={[styles.FlagBox, { backgroundColor: "#FFF0ED" }]}
              ></View>
              <Text style={styles.FlexBoxText}>
                {t("QuestionsReport.Incorrect")}
              </Text>
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
                  {state.correctAnswers} {t("QuestionsReport.outof")}{" "}
                  {state.TotalQuestions}
                </RNText>
              </View>
            </View>
          </View>
          {state.roundedPercentage == "100.0" ? (
            <View>
              <RNText
                size={FontSize.font20}
                family={FontFamily.GilroyBold}
                color={Colors.Black}
                style={{ textAlign: "center" }}
              >
                {t("QuestionsReport.Congratulations")}
              </RNText>
              <View style={{ paddingHorizontal: wp(3), paddingTop: hp(1.5) }}>
                <RNText
                  color={Colors.DarkGrey}
                  size={FontSize.font15}
                  family={FontFamily.GilroyRegular}
                  style={{ textAlign: "center" }}
                >
                  {t("QuestionsReport.Congratulations_Des")}
                </RNText>
              </View>
            </View>
          ) : (
            <View>
              <RNText
                size={FontSize.font20}
                family={FontFamily.GilroyBold}
                color={Colors.Black}
                style={{ textAlign: "center" }}
              >
                {t("QuestionsReport.Title")}
              </RNText>
              <RNText
                size={FontSize.font20}
                family={FontFamily.GilroyBold}
                color={Colors.Black}
                style={{ textAlign: "center", paddingTop: hp(0.3) }}
              >
                {t("QuestionsReport.Subtitle")}
              </RNText>
              <View style={{ paddingHorizontal: wp(3), paddingTop: hp(1.5) }}>
                <RNText
                  color={Colors.DarkGrey}
                  size={FontSize.font15}
                  style={{ textAlign: "center" }}
                >
                  {t("QuestionsReport.Subtitle_Des")}
                </RNText>
              </View>
            </View>
          )}

          <View style={{ paddingTop: hp(8) }}>
            <RNButton
              onPress={() =>
                //Navigations.navigate(navigationScreen, { component })
                Navigations.goBack()
              }
              title={t("QuestionsReport.continue")}
              style={{ backgroundColor: Colors.Orange }}
            />
          </View>
        </ScrollView>
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
