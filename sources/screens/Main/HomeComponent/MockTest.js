import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {Colors, FontFamily, FontSize, height, hp, wp} from '../../../theme';
import {RNImage, RNLoader, RNStyles, RNText} from '../../../common';
import {useDispatch, useSelector} from 'react-redux';
import FetchMethod from '../../../api/FetchMethod';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../../common/RNThemeContext';
import {
  ADD_ANSWER,
  SET_QUESTIONDATA,
} from '../../../redux/Reducers/QuizReducer';
import {useFocusEffect} from '@react-navigation/native';
import {CheckBox} from '@rneui/themed';

export default function MockTest() {
  const {t} = useTranslation();
  const {colorScheme, selectedLanguage} = useTheme();
  const [selectedId, setSelectedId] = useState(null);
  const [correctOptionId, setCorrectOptionId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const questions = useSelector(state => state.Quiz.questionData);
  const selectedQuiz = useSelector(state => state.Quiz.selectedQuiz);
  const selectedQuestion = useSelector(state => state.Quiz.selectedQuestion);
  const userLoginData = useSelector(state => state.Authentication.AsyncValue);
  const mistakequesrtionsData = useSelector(
    state => state.Mistake.mistakequesrtionsData,
  );
  const datatype = 'Quizdata';
  // console.log(JSON.stringify(userAnswers, null, 2));

  useFocusEffect(
    useCallback(() => {
      const fetchMistakeQuestions = () => {
        try {
          const filteredQuestions = mistakequesrtionsData
            .filter(
              item =>
                item.testID === selectedQuiz.quiz_Id &&
                item.dataType === datatype,
            )
            .map(item => item.questionId);
          console.log('filteredQuestions', filteredQuestions);

          const completedQuestionIds = questions
            .slice(0, selectedQuiz.fill_Questions)
            .map(question => question.questionId);
          console.log('completedQuestionIds', completedQuestionIds);
          const incorrectQuestions = completedQuestionIds.filter(id =>
            filteredQuestions.includes(id),
          );
          const correctQuestions = completedQuestionIds.filter(
            id => !filteredQuestions.includes(id),
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
            }),
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
            }),
          );
        } catch (error) {
          console.error('Error fetching mistake questions:', error);
        }
      };
      fetchMistakeQuestions();
    }, [
      mistakequesrtionsData,
      selectedQuiz.quiz_Id,
      datatype,
      questions,
      selectedQuiz.fill_Questions,
    ]),
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const response = await FetchMethod.GET({
          EndPoint: `Question/getQuestions?quizId=${selectedQuiz.quiz_Id}&langCode=${selectedLanguage}`,
        });
        dispatch(SET_QUESTIONDATA(response));
      } catch (error) {
        console.error('Error fetching QuizQuestions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [dispatch, selectedQuiz, selectedLanguage]);

  useEffect(() => {
    if (questions.length > 0 && selectedQuiz?.fill_Questions >= 0) {
      const initialIndex = Math.min(
        selectedQuiz.fill_Questions,
        questions.length - 1,
      );
      setCurrentQuestionIndex(initialIndex);
    }
  }, [questions, selectedQuiz]);

  useEffect(() => {
    if (selectedQuestion) {
      const index = questions.indexOf(selectedQuestion);
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
      console.log('Quiz completed!');
    }
  };

  const handleOptionPress = option => {
    if (!isOptionSelected) {
      setSelectedId(option.question_Option_id);
      setIsOptionSelected(true);
      const isCorrect = option.isCorrect;
      if (isCorrect) {
        setCorrectOptionId(null);
      } else {
        const correctOption = currentQuestion.options.find(
          opt => opt.isCorrect,
        );
        setCorrectOptionId(correctOption.question_Option_id);
      }

      dispatch(
        ADD_ANSWER({
          loginID: userLoginData.userLoginID,
          vehicleID: selectedQuiz.vehicleId,
          QuizID: selectedQuiz.quiz_Id,
          isCorrect,
          questionIndex: currentQuestion.questionId,
          isTopic: false,
          QuestionCounter: currentQuestionIndex + 1,
        }),
      );
    }
  };

  const currentQuestion = selectedQuestion || questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <RNLoader visible={isLoading} />;
  }

  return (
    <View style={[styles(colorScheme).container]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {currentQuestion.imagePathURL != 0 && (
          <View style={styles(colorScheme).bannerImage}>
            <RNImage
              style={{width: wp(100)}}
              source={{uri: currentQuestion.imagePathURL}}
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
            ]}>
            {currentQuestionIndex + 1}. {currentQuestion.text}
          </RNText>

          <View
            style={[
              currentQuestion.options.imageUrl !== '0' &&
                RNStyles.flexWrapHorizontal,
              {width: wp(95), gap: 20},
            ]}>
            {currentQuestion.options.map(option => (
              <TouchableOpacity
                key={option.question_Option_id}
                style={[
                  option.imageUrl !== '0'
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
                        : colorScheme === 'dark'
                        ? '#111c22'
                        : Colors.lightWhite,
                    borderColor:
                      selectedId === option.question_Option_id
                        ? option.isCorrect
                          ? Colors.Green
                          : Colors.Red
                        : correctOptionId === option.question_Option_id
                        ? Colors.Green
                        : colorScheme === 'dark'
                        ? '#111c22'
                        : Colors.lightWhite,
                  },
                ]}
                onPress={() => handleOptionPress(option)}>
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
                <Image
                  resizeMode="contain"
                  source={
                    selectedId === option.question_Option_id ||
                    correctOptionId === option.question_Option_id
                      ? require('../../../assets/images/F_Radio.png')
                      : require('../../../assets/images/Radio.png')
                  }
                  style={{
                    width: wp(5),
                    height: wp(5),
                    tintColor:
                      selectedId === option.question_Option_id ||
                      correctOptionId === option.question_Option_id
                        ? Colors.White
                        : Colors.Grey,
                  }}
                />
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
                {option.imageUrl !== '0' ? (
                  <RNImage
                    source={{uri: option.imageUrl}}
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
                          selectedId === option.question_Option_id ||
                          correctOptionId === option.question_Option_id
                            ? Colors.White
                            : colorScheme === 'dark'
                            ? Colors.lightWhite
                            : '#262626',
                      },
                    ]}>
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
              {t('Question.explanation')}
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
                  ? colorScheme === 'dark'
                    ? Colors.White
                    : Colors.Black
                  : Colors.Grey,
              },
            ]}
            disabled={!isOptionSelected}>
            <RNText style={styles(colorScheme).buttonText}>
              {t('Question.next')}
            </RNText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = colorScheme =>
  StyleSheet.create({
    container: {
      flex: 1,
      gap: 15,
      backgroundColor: colorScheme === 'dark' ? Colors.Black : Colors.White,
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
      fontSize: FontSize.font13,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === 'dark' ? Colors.lightWhite : Colors.Black,
      textTransform: 'capitalize',
      width: wp(80),
    },
    radioButton: {
      height: wp(2),
      width: wp(2),
    },
    explanationView: {
      alignSelf: 'center',
      width: wp(95),
      gap: 20,
      marginVertical: hp(2),
    },
    explanationContainer: {
      backgroundColor: colorScheme === 'dark' ? '#a5d9b1' : '#dbf0e0',
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
      backgroundColor: colorScheme === 'dark' ? Colors.White : Colors.Black,
      padding: hp(1),
      width: wp(20),
      borderRadius: 50,
    },
    buttonText: {
      color: colorScheme === 'dark' ? Colors.Black : Colors.White,
      fontFamily: FontFamily.Medium,
      textTransform: 'capitalize',
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
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
    },
  });
