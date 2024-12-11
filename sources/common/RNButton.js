import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontFamily, FontSize, hp, wp } from '../theme';
import RNStyles from './RNStyles';
import RNText from './RNText';

const RNButton = ({ title, style, textStyle, onPress, disable }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      disabled={disable}
      style={[styles.Container, style]}>
      <RNText style={[styles.buttonText, textStyle]}>{title}</RNText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Container: {
    ...RNStyles.center,
    backgroundColor: Colors.Primary,
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(4),
    marginHorizontal: wp(4),
    marginVertical: hp(1),
    borderRadius: wp(3),
  },
  buttonText: {
    fontSize: FontSize.font18,
    fontFamily: FontFamily.Medium,
    color: Colors.White,
  },
});

export default RNButton;
