import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../common/RNThemeContext';
import {useDispatch, useSelector} from 'react-redux';
import FetchMethod from '../../api/FetchMethod';
import {
  SET_CATEGORYDATA,
  SET_SELECTED_CATEGORY,
} from '../../redux/Reducers/CategoryReducer';
import {Images} from '../../constants';
import {RNImage, RNStyles, RNText} from '../../common';
import {Colors, FontFamily, FontSize, hp, wp} from '../../theme';
import {SafeAreaView} from 'react-native';

export default function RNTabHeader({navigation}) {
  const {t} = useTranslation();
  const {colorScheme, selectedLanguage} = useTheme();
  const [showCategory, setShowCategory] = useState(false);
  const dispatch = useDispatch();
  const categories = useSelector(state => state.Category.categoryData);
  const selectedCategory = useSelector(
    state => state.Category.selectedCategory,
  );
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await FetchMethod.GET({
          EndPoint: `Vehicle/GetCategory?langCode=${selectedLanguage}`,
        });
        dispatch(SET_CATEGORYDATA(response));
        if (response.length > 0) {
          dispatch(SET_SELECTED_CATEGORY(response[0]));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchData();
  }, [dispatch, selectedLanguage]);

  const bounceIn = () => {
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 4,
      tension: 20,
      useNativeDriver: true,
    }).start();
  };

  const bounceOut = () => {
    Animated.timing(bounceAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      setShowCategory(false);
    });
  };

  const toggleCategory = () => {
    if (!showCategory) {
      bounceAnim.setValue(0);
      bounceIn();
      setShowCategory(true);
    } else {
      bounceOut();
    }
  };

  const selectCategory = category => {
    dispatch(SET_SELECTED_CATEGORY(category));
    bounceOut();
  };

  const animatedStyle = {
    transform: [
      {
        translateY: bounceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [50, 0],
        }),
      },
    ],
    opacity: bounceAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  const handleSetting = () => {
    navigation.navigate('SettingScreen');
  };

  const thumbnail = {
    'motorcycle-thumbnail.png': Images.motorcycle,
    'car-thumbnail.png': Images.cars,
    'hgv-thumbnail.png': Images.hgv,
    'pcv-thumbnail.png': Images.pcv,
    'adi-thumbnail.png': Images.adi,
  };

  const images = {
    'motorcycle-thumbnail.png': Images.motorcyclethumbnail,
    'car-thumbnail.png': Images.carthumbnail,
    'hgv-thumbnail.png': Images.hgvthumbnail,
    'pcv-thumbnail.png': Images.pcvthumbnail,
    'adi-thumbnail.png': Images.adithumbnail,
  };

  return (
    <SafeAreaView
      style={[styles(colorScheme).Container, RNStyles.flexRowBetween]}>
      <View style={{width: '27%', paddingHorizontal: wp(2)}}>
        <TouchableOpacity
          //style={{width: wp(33), backgroundColor: 'red'}}
          onPress={handleSetting}>
          <RNImage
            style={{
              height: wp(6),
              width: wp(6),
              color: Colors.White,
            }}
            source={Images.setting}
          />
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, alignItems: 'center'}}>
        <RNText
          style={{
            fontFamily: FontFamily.Bold,
            fontSize: FontSize.font18,
            color: colorScheme === 'dark' ? Colors.White : Colors.Black,
            //width: wp(33),
          }}>
          {t('header.TheoryTest')}
        </RNText>
      </View>

      <View
        style={{
          width: '27%',
          alignItems: 'flex-end',
          paddingHorizontal: wp(2),
        }}>
        <TouchableOpacity
          style={[styles(colorScheme).button, RNStyles.flexRowEvenly]}
          onPress={toggleCategory}>
          <RNImage
            style={{height: wp(6), width: wp(6)}}
            source={
              selectedCategory
                ? thumbnail[selectedCategory.thumbnail]
                : 'Loading...'
            }
          />
          {/* <RNText numOfLines={1} style={styles(colorScheme).buttonText}>
            {selectedCategory ? selectedCategory.name : 'Loading...'}
          </RNText> */}
          <RNImage
            style={{
              height: wp(3),
              width: wp(3),
              transform: [{rotate: '270deg'}],
            }}
            source={Images.leftarrow}
          />
        </TouchableOpacity>
      </View>

      {showCategory && (
        <Animated.View
          style={[styles(colorScheme).categoriesView, animatedStyle]}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.vehicle_Id}
              style={styles(colorScheme).categoryItem}
              onPress={() => selectCategory(category)}>
              <RNImage
                style={styles(colorScheme).categoryImage}
                source={images[category.thumbnail]}
              />
              <RNText style={styles(colorScheme).categoryText}>
                {category.name}
              </RNText>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = colorScheme =>
  StyleSheet.create({
    Container: {
      width: wp(100),
      borderBottomWidth: 1,
      height: Platform.OS === 'ios' ? hp(12) : hp(8),
      backgroundColor: colorScheme === 'dark' ? Colors.BgBlack : Colors.White,
      borderColor: colorScheme === 'dark' ? Colors.White : Colors.LightGrey,
    },
    button: {
      backgroundColor: colorScheme === 'dark' ? '#2c4454' : Colors.lightWhite,
      borderRadius: 20,
      //padding: wp(2),
      paddingHorizontal: wp(2.5),
      paddingVertical: hp(0.8),
      gap: wp(2),
      //width: wp(20),
    },
    buttonText: {
      fontFamily: FontFamily.Medium,
      fontSize: FontSize.font13,
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
      textAlign: 'center',
      width: wp(10),
    },
    categoriesView: {
      backgroundColor: colorScheme === 'dark' ? '#111c22' : Colors.White,
      padding: 10,
      position: 'absolute',
      top: hp(12),
      //marginHorizontal: wp(3.5),
      right: 10,
      zIndex: 1,
      borderRadius: 10,
      gap: 5,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: {width: 2, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      margin: 2,
    },
    categoryImage: {
      height: wp(6),
      width: wp(6),
    },
    categoryText: {
      fontFamily: FontFamily.Medium,
      fontSize: FontSize.font14,
      color: colorScheme === 'dark' ? '#7D7D7D' : Colors.DarkGrey,
    },
  });
