import {
  ActivityIndicator,
  FlatList,
  Platform,
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
import { Colors, FontFamily, FontSize, hp, wp } from "../../../theme";
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
import NetInfoScreen from "../../../components/NetInfo";
import NetInfo from "@react-native-community/netinfo";

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
  const [isOffline, setIsOffline] = useState(false);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchMistakeData();
  //   }, [selectedCategory?.vehicle_Id, selectedLanguage])
  // );
  //console.log("quiz Data-->", quiz);

  useFocusEffect(
    React.useCallback(() => {
      const fetchMistakeData = async () => {
        try {
          const response = await FetchMethod.GET({
            EndPoint: `UserMistakesDataControllers/MistackData?UserLoginId=${userLoginData.userLoginID}&VehicalID=${selectedCategory?.vehicle_Id}&LangCode=${selectedLanguage}`,
          });
          dispatch(SET_MISTAKEQUESTIONDATA(response));
        } catch (error) {
          console.log("MistakeData error ->", error);
          dispatch(SET_MISTAKEQUESTIONDATA([]));
        } finally {
          setLoading(false);
        }
      };
      fetchMistakeData();
    }, [selectedCategory?.vehicle_Id, selectedLanguage, isOffline])
  );

  useFocusEffect(
    React.useCallback(() => {
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
          dispatch(SET_QUIZDATA(quizResponse));
          const topicResponse = await FetchMethod.GET({
            EndPoint: `Topic/getTopics?vehicleID=${selectedCategory.vehicle_Id}&languageCode=${selectedLanguage}&UserLoginID=${userLoginData.userLoginID}`,
          });
          dispatch(SET_TOPICDATA(topicResponse));
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };
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
      isOffline,
    ])
  );

  useEffect(() => {
    // Subscribe to NetInfo updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected); // If not connected, set isOffline to true
    });
    return () => unsubscribe();
  }, []);

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
      <View style={{ alignSelf: "center", paddingHorizontal: wp(2) }}>
        <FlatList
          numColumns={2}
          data={quiz}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: hp(2) }}
          renderItem={({ item, index }) => {
            // console.log(item);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleQuizSelection(item)}
                style={[styles(colorScheme).MockTestcard]}
              >
                <RNText style={[styles(colorScheme).text, { width: wp(42) }]}>
                  {item.name}
                </RNText>
                <ProgressBar
                  progress={
                    Math.round(
                      (item.fill_Questions / item.total_QuestionsCount) * 10
                    ) / 10
                  }
                  color={Colors.Green}
                  style={{ borderRadius: 10 }}
                />
                <RNText
                  style={[
                    styles(colorScheme).text,
                    {
                      textAlign: "right",
                      width: wp(40),
                      fontSize:
                        Platform.OS === "ios"
                          ? FontSize.font13
                          : FontSize.font11,
                    },
                  ]}
                >
                  {item.fill_Questions}/{item.total_QuestionsCount}
                </RNText>
              </TouchableOpacity>
            );
          }}
        />
        {/* {quiz.map((item, index) => {
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
                progress={
                  Math.round(
                    (item.fill_Questions / item.total_QuestionsCount) * 10
                  ) / 10
                }
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
        })} */}
        <NetInfoScreen isvisible={isOffline} />
      </View>
    );
  });

  const TopicTest = () => {
    return (
      <View style={{ alignSelf: "center", paddingHorizontal: wp(2) }}>
        <FlatList
          data={topic}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: hp(2) }}
          renderItem={({ item, index }) => {
            return (
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
                    progress={
                      Math.round(
                        (item.fill_Questions / item.question_Count) * 10
                      ) / 10
                    }
                    color={Colors.Green}
                    style={{ borderRadius: 10, width: wp(25) }}
                  />
                  <RNText style={styles(colorScheme).questionCountText}>
                    {item.fill_Questions}/{item.question_Count}
                  </RNText>
                </View>
              </Pressable>
            );
          }}
        />
        {/* {topic.map((item, index) => (
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
        ))} */}
        <NetInfoScreen isvisible={isOffline} />
      </View>
    );
  };

  return (
    <RNContainer style={styles(colorScheme).container} isLoading={isLoading}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      {renderComponent()}
      {/* </ScrollView> */}
    </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    container: {
      //paddingVertical: 20,
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
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    MockTestcard: {
      backgroundColor: colorScheme === "dark" ? Colors.Blue : Colors.lightWhite,
      padding: 10,
      borderRadius: 10,
      width: wp(47),
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? "#3e6075" : Colors.LightGrey,
      marginRight: wp(2),
      marginBottom: hp(1),
    },
    text: {
      fontSize: Platform.OS === "ios" ? FontSize.font18 : FontSize.font12,
      marginVertical: 3,
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      width: wp(25),
      paddingBottom: Platform.OS === "ios" ? hp(0.5) : hp(0),
      lineHeight: Platform.OS === "ios" ? hp(2.8) : hp(2.2),
    },
    questionCountText: {
      textAlign: "right",
      width: wp(25),
      fontSize: Platform.OS === "ios" ? FontSize.font13 : FontSize.font11,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
  });
