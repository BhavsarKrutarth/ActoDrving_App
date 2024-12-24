import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { RNContainer, RNImage, RNStyles, RNText } from "../../../common";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "../../../common/RNThemeContext";
import { Colors, FontFamily, FontSize, hp, wp } from "../../../theme";
import { useTranslation } from "react-i18next";
import { ADD_MiSTAKEDATA } from "../../../redux/Reducers/MistakeReducers";
import { CheckBox } from "@rneui/themed";
import { Image } from "react-native";

export default function Mistake() {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const dispatch = useDispatch();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [correctOptionId, setCorrectOptionId] = useState(null);
  const Mistakequestions = useSelector(
    (state) => state.Mistake.mistakequesrtionsData
  );
  const categoryData = useSelector((state) => state.Category.selectedCategory);
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const mistakeResponse = useSelector((state) => state.Mistake.mistakeResponse);
  console.log(mistakeResponse);
  // console.log(JSON.stringify(mistakeResponse, null, 2));

  const handleNextQuestion = () => {
    if (currentQuestionIndex < Mistakequestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedId(null);
      setCorrectOptionId(null);
      setIsOptionSelected(false);
    } else {
    }
  };

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
  };

  const currentQuestion = Mistakequestions[currentQuestionIndex];
  if (!Mistakequestions || Mistakequestions.length === 0) {
    return (
      <View style={[RNStyles.flexCenter, { backgroundColor: Colors.White }]}>
        <RNText style={{ fontFamily: FontFamily.GilroySemiBold }}>
          No data found
        </RNText>
      </View>
    );
  }

  return (
    <RNContainer style={styles(colorScheme).container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
                fontSize: FontSize.font18,
                width: wp(90),
                paddingVertical: hp(2),
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
              <Image
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
              />
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
                      fontFamily: FontFamily.Medium,
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
            style={styles(colorScheme).nextButton}
          >
            <RNText style={styles(colorScheme).buttonText}>
              {t("Question.next")}
            </RNText>
          </TouchableOpacity>
        </View>
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
      width: wp(20),
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
