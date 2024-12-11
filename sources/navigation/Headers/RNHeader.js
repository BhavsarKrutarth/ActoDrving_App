import React from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {Colors, FontFamily, FontSize, hp, wp} from '../../theme';
import RNText from '../../common/RNText';
import RNImage from '../../common/RNImage';
import {useTheme} from '../../common/RNThemeContext';
import {Images} from '../../constants';

const RNHeader = () => {
  const {colorScheme} = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles(colorScheme).container}>
      <TouchableOpacity
        hitSlop={20}
        style={{paddingHorizontal: wp(2)}}
        onPress={() => navigation.goBack()}>
        <RNImage
          style={{height: wp(5), width: wp(5)}}
          source={Images.leftarrow}
        />
      </TouchableOpacity>
      <RNText style={styles(colorScheme).title}>
        {t(route.params?.title)}
      </RNText>
    </SafeAreaView>
  );
};

const styles = colorScheme =>
  StyleSheet.create({
    container: {
      borderBottomWidth: 1,
      //height: hp(7),
      height: Platform.OS === 'ios' ? hp(12) : hp(8),
      flexDirection: 'row',
      gap: wp(2),
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? Colors.BgBlack : Colors.White,
      borderColor: colorScheme === 'dark' ? Colors.Grey : Colors.LightGrey,
    },
    title: {
      flex: 1,
      fontSize: FontSize.font16,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
    },
  });

export default RNHeader;
