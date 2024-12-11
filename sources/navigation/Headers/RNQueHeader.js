import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors, FontFamily, FontSize, hp, wp} from '../../theme';
import RNStyles from '../../common/RNStyles';
import RNText from '../../common/RNText';
import RNImage from '../../common/RNImage';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTheme} from '../../common/RNThemeContext';
import FetchMethod from '../../api/FetchMethod';
import {useTranslation} from 'react-i18next';
import {Images} from '../../constants';

const RNQueHeader = ({route}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const datatype = 'Quizdata';
  const [modalVisible, setModalVisible] = useState(false);
  const [isCountQue, setCountQuestion] = useState(false);
  const {colorScheme} = useTheme();

  const selectedQuiz = useSelector(state => state.Quiz.selectedQuiz);
  const questions = useSelector(state => state.Quiz.questionData);
  const userAnswers = useSelector(state => state.Quiz.userAnswers);
  // console.log('userAnswer',JSON.stringify(userAnswers, null, 2));

  const handlePressBack = () => {
    setModalVisible(true);
  };

  const handleMistakedata = async () => {
    try {
      const response = await FetchMethod.POST({
        EndPoint: `UserQuestions_Answer`,
        Params: JSON.stringify(userAnswers),
      });

      if (response.responseCode) {
        navigation.goBack();
      }
    } catch (error) {
      navigation.goBack();
    }
  };

  const vehicleIndex = userAnswers
    .flatMap(user => user.vehicles.map((vehicle, index) => ({vehicle, index})))
    .find(({vehicle}) =>
      vehicle.quiz.some(quiz => quiz.QuizID === selectedQuiz.quiz_Id),
    )?.index;
  const quizAnswer =
    userAnswers.flatMap(user =>
      user.vehicles.flatMap(vehicle =>
        vehicle.quiz.find(quiz => quiz.QuizID === selectedQuiz.quiz_Id),
      ),
    )[vehicleIndex] || {};

  const rightQuestions = quizAnswer.rightQuestions || [];
  const wrongQuestions = quizAnswer.wrongQuestions || [];

  const getBorderColor = questionId => {
    if (rightQuestions.includes(questionId)) {
      return Colors.Green;
    }
    if (wrongQuestions.includes(questionId)) {
      return Colors.Red;
    }
    return colorScheme === 'dark' ? '#3e6075' : '#CCC';
  };

  return (
    <View style={styles(colorScheme).headerContainer}>
      <View style={[RNStyles.flexRowCenter, {gap: 20}]}>
        <TouchableOpacity onPress={handlePressBack} hitSlop={20}>
          <RNImage
            style={styles(colorScheme).backIcon}
            source={Images.leftarrow}
          />
        </TouchableOpacity>
        <RNText style={[styles(colorScheme).titleText]}>
          {t('header.MockTest')}
        </RNText>
      </View>
      <View style={[{gap: 10}]}>
        <TouchableOpacity onPress={() => setCountQuestion(!isCountQue)}>
          <RNImage
            resizeMode="contain"
            style={styles(colorScheme).optionIcon}
            source={
              colorScheme === 'dark'
                ? require('../../assets/images/customer-satisfaction1.png')
                : require('../../assets/images/customer-satisfaction.png')
            }
          />
        </TouchableOpacity>
      </View>

      {/* CountQuestion modal container */}
      {isCountQue && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isCountQue}
          onRequestClose={() => setCountQuestion(false)}>
          <TouchableWithoutFeedback onPress={() => setCountQuestion(false)}>
            <View style={styles(colorScheme).overlay}>
              <TouchableOpacity
                style={styles(colorScheme).questionCountModal}
                activeOpacity={1}>
                <ScrollView
                  contentContainerStyle={styles(colorScheme).scrollContent}
                  showsVerticalScrollIndicator={false}>
                  {[...Array(selectedQuiz.total_QuestionsCount)].map(
                    (_, index) => {
                      const questionId = questions[index]?.questionId;
                      const borderColor = getBorderColor(questionId);
                      return (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles(colorScheme).QutionsIndex,
                            {borderColor: borderColor},
                          ]}>
                          <RNText
                            style={styles(colorScheme).QuestionsIndexText}>
                            {index + 1}
                          </RNText>
                        </TouchableOpacity>
                      );
                    },
                  )}
                </ScrollView>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* Setting modal container */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles(colorScheme).modalContainer}>
          <View style={styles(colorScheme).modalContent}>
            <RNText
              style={[styles(colorScheme).titleText, {paddingBottom: hp(1)}]}>
              {t('header.leavemess')}{' '}
            </RNText>
            <View style={[RNStyles.flexRowCenter, {gap: 10}]}>
              <TouchableOpacity
                style={[
                  styles(colorScheme).button,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? '#3e6075' : Colors.lightWhite,
                  },
                ]}
                onPress={() => {
                  setModalVisible(false);
                }}>
                <RNText style={styles(colorScheme).dialogText}>
                  {t('header.Cancel')}{' '}
                </RNText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles(colorScheme).button,
                  {backgroundColor: Colors.Orange},
                ]}
                onPress={async () => {
                  await handleMistakedata();
                  setModalVisible(false);
                }}>
                <RNText
                  style={[
                    styles(colorScheme).dialogText,
                    {color: Colors.White},
                  ]}>
                  {t('header.OK')}{' '}
                </RNText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = colorScheme =>
  StyleSheet.create({
    headerContainer: {
      ...RNStyles.flexRowBetween,
      borderBottomWidth: 1,
      height: Platform.OS === 'ios' ? hp(12) : hp(8),
      paddingHorizontal: wp(2),
      paddingTop: Platform.OS === 'ios' ? hp(5) : hp(0),
      backgroundColor: colorScheme === 'dark' ? Colors.BgBlack : Colors.White,
      borderColor: colorScheme === 'dark' ? Colors.Grey : Colors.LightGrey,
    },
    backIcon: {
      height: wp(5),
      width: wp(5),
    },
    titleText: {
      fontFamily: FontFamily.SemiBold,
      fontSize: FontSize.font14,
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
      textAlign: 'center',
    },
    optionIcon: {
      height: wp(8),
      width: wp(8),
    },
    overlay: {
      flex: 1,
      alignItems: 'flex-end',
      top: Platform.OS === 'ios' ? hp(11) : hp(5.5),
      right: 1,
      marginHorizontal: wp(2),
      shadowColor: '#000',
      shadowOffset: {width: 2, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    questionCountModal: {
      width: wp(80),
      maxHeight: hp(30),
      backgroundColor: colorScheme === 'dark' ? Colors.BgBlack : Colors.White,
      borderRadius: 10,
      padding: 20,
      elevation: 7,
    },
    scrollContent: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 5,
    },
    QutionsIndex: {
      ...RNStyles.flexRowCenter,
      borderWidth: 1,
      height: wp(7),
      width: wp(7),
      borderRadius: 5,
    },
    QuestionsIndexText: {
      fontSize: FontSize.font10,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
    },
    modalContainer: {
      ...RNStyles.flexCenter,
      backgroundColor:
        colorScheme === 'dark'
          ? 'rgba(35, 55, 67, 0.5)'
          : 'rgba(0 ,0 , 0, 0.5)',
    },
    modalContent: {
      backgroundColor: colorScheme === 'dark' ? Colors.BgBlack : Colors.White,
      width: wp(70),
      padding: hp(4),
      borderRadius: 10,
      gap: 15,
    },
    dialogText: {
      fontFamily: FontFamily.Regular,
      fontSize: FontSize.font12,
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
      textAlign: 'center',
    },
    button: {
      width: wp(25),
      padding: wp(1.8),
      borderRadius: 5,
    },
  });

export default RNQueHeader;
