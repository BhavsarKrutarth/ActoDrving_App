import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import {
  RNContainer,
  RNImage,
  RNLoader,
  RNStyles,
  RNText,
} from "../../../common";
import { Colors, FontFamily, FontSize, wp } from "../../../theme";
import { ProgressBar } from "react-native-paper";
import FetchMethod from "../../../api/FetchMethod";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_QUIZDATA,
  SET_SELECTED_QUIZDATA,
} from "../../../redux/Reducers/QuizReducer";
import { useTheme } from "../../../common/RNThemeContext";
import {
  SET_SELECTED_TOPICDATA,
  SET_TOPICDATA,
} from "../../../redux/Reducers/TopicReducer";
import { useFocusEffect } from "@react-navigation/native";
import { SET_MISTAKEQUESTIONDATA } from "../../../redux/Reducers/MistakeReducers";

export function CNIndexes({ route, navigation }) {
  const { component } = route.params;
  const selectedCategory = useSelector(
    (state) => state.Category.selectedCategory
  );
  const quiz = useSelector((state) => state.Quiz.quizData);
  const topic = useSelector((state) => state.Topic.topicData);
  const dispatch = useDispatch();
  const { colorScheme, selectedLanguage } = useTheme();
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const [isLoading, setLoading] = useState(true);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchMistakeData();
  //   }, [selectedCategory?.vehicle_Id, selectedLanguage])
  // );
  //console.log("quiz Data-->", quiz);

  useFocusEffect(
    React.useCallback(() => {
      fetchMistakeData();
      if (
        selectedCategory.vehicle_Id &&
        selectedLanguage &&
        userLoginData.userLoginID
      ) {
        fetchData();
      }
    }, [
      selectedCategory?.vehicle_Id,
      selectedLanguage,
      userLoginData?.userLoginID,
    ])
  );
  const fetchMistakeData = async () => {
    try {
      const response = await FetchMethod.GET({
        EndPoint: `UserMistakesDataControllers/MistackData?UserLoginId=${userLoginData.userLoginID}&VehicalID=${selectedCategory?.vehicle_Id}&LangCode=${selectedLanguage}`,
      });
      //console.log("mistak response", response);
      dispatch(SET_MISTAKEQUESTIONDATA(response));
    } catch (error) {
      console.log("MistakeData error ->", error);
      dispatch(SET_MISTAKEQUESTIONDATA([]));
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const quizResponse = await FetchMethod.POST({
        EndPoint: "Quiz/GetQuiz",
        Params: {
          vehicleId: selectedCategory.vehicle_Id,
          languageCode: selectedLanguage,
          userLoginID: userLoginData.userLoginID,
        },
      });
      // console.log("data response", quizResponse[7].fill_Questions);
      dispatch(SET_QUIZDATA(quizResponse));
      const topicResponse = await FetchMethod.GET({
        EndPoint: `Topic/getTopics?vehicleID=${selectedCategory.vehicle_Id}&languageCode=${selectedLanguage}&UserLoginID=${userLoginData.userLoginID}`,
      });
      dispatch(SET_TOPICDATA(topicResponse));
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <RNLoader visible={isLoading} />;
  }

  const renderComponent = () => {
    switch (component) {
      case "MockTest":
        return <MockTest />;
      case "TopicTest":
        return <TopicTest />;
    }
  };

  const handleQuizSelection = (quizItem) => {
    dispatch(SET_SELECTED_QUIZDATA(quizItem));
    navigation.navigate("Mocktest", { component: "MockTest" });
  };

  const handleTopicSelection = (quizItem) => {
    dispatch(SET_SELECTED_TOPICDATA(quizItem));
    navigation.navigate("TopicTest", { component: "TopicTest" });
  };

  const MockTest = memo(() => {
    return (
      <View style={[RNStyles.flexWrapHorizontal, { gap: 10 }]}>
        {quiz.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleQuizSelection(item)}
              style={styles(colorScheme).MockTestcard}
            >
              <RNText style={[styles(colorScheme).text, { width: wp(42) }]}>
                {item.name}
              </RNText>
              <ProgressBar
                progress={item.fill_Questions / item.total_QuestionsCount}
                color={Colors.Green}
                style={{ borderRadius: 10 }}
              />
              <RNText
                style={[
                  styles(colorScheme).text,
                  {
                    textAlign: "right",
                    width: wp(40),
                    fontSize: FontSize.font11,
                  },
                ]}
              >
                {item.fill_Questions}/{item.total_QuestionsCount}
              </RNText>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  });

  const TopicTest = () => {
    return (
      <View style={[RNStyles.flexWrapHorizontal, { gap: 10 }]}>
        {topic.map((item, index) => (
          <Pressable
            key={index}
            style={[
              styles(colorScheme).MockTestcard,
              RNStyles.flexRow,
              { gap: 10 },
            ]}
            onPress={() => handleTopicSelection(item)}
          >
            <RNImage
              style={{ width: wp(12), height: wp(12) }}
              source={{ uri: item.image }}
            />
            <View style={{ gap: 5 }}>
              <RNText numberOfLines={2} style={styles(colorScheme).text}>
                {item.topicName}
              </RNText>
              <ProgressBar
                progress={parseFloat(
                  (item.fill_Questions / item.question_Count).toFixed(2)
                )}
                color={Colors.Green}
                style={{ borderRadius: 10, width: wp(25) }}
              />
              <RNText style={styles(colorScheme).questionCountText}>
                {item.fill_Questions}/{item.question_Count}
              </RNText>
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <RNContainer style={styles(colorScheme).container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderComponent()}
      </ScrollView>
    </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    container: {
      paddingVertical: 20,
      backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
    },
    tabContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    tabButton: {
      padding: 10,
      backgroundColor: colorScheme === "dark" ? Colors.Blue : Colors.lightWhite,
      borderRadius: 5,
    },
    tabText: {
      fontSize: FontSize.font14,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    MockTestcard: {
      backgroundColor: colorScheme === "dark" ? Colors.Blue : Colors.lightWhite,
      padding: 10,
      borderRadius: 10,
      width: wp(47),
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? "#3e6075" : Colors.LightGrey,
    },
    text: {
      fontSize: FontSize.font14,
      marginVertical: 3,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      width: wp(25),
    },
    questionCountText: {
      textAlign: "right",
      width: wp(25),
      fontSize: FontSize.font11,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
  });
