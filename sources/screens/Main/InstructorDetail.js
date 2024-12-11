import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {RNText} from '../../common';
import {Colors, FontFamily, FontSize} from '../../theme';
import {useTheme} from '../../common/RNThemeContext';

export default function InstructorDetail() {
  const {colorScheme} = useTheme();

  return (
    <View>
      <RNText style={styles(colorScheme).title}>Where you'll be</RNText>
      <RNText
        style={[
          styles(colorScheme).subTitle,
          {color: colorScheme === 'dark' ? Colors.Grey : Colors.DarkGrey},
        ]}>
        Palghar, Maharashtra, India
      </RNText>
    </View>
  );
}

const styles = colorScheme =>
  StyleSheet.create({
    title: {
      fontSize: FontSize.font20,
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
    },
    subTitle: {
      fontSize: FontSize.font13,
      fontFamily: FontFamily.Regular,
      color: colorScheme === 'dark' ? Colors.White : Colors.Black,
    },
  });
