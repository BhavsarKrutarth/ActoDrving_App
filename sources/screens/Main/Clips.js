import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {RNContainer, RNImage, RNStyles, RNText} from '../../common';
import {Colors, FontFamily, FontSize, hp, wp} from '../../theme';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../common/RNThemeContext';

const clipsData = Array.from({length: 34}, (_, index) => ({
  id: index + 1,
  name: `Clip${index + 1}`,
  imageSource: require('../../assets/images/clip-bg.png'),
}));

export default function Clips() {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();

  return (
    <RNContainer style={{backgroundColor : colorScheme === 'dark' ? Colors.BgBlack : Colors.White}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={[RNStyles.flexRowBetween, styles(colorScheme).topHeader]}>
          <View style={[RNStyles.flexRowBetween, {gap: wp(3)}]}>
            <RNImage
              style={{height: wp(6), width: wp(6)}}
              source={require('../../assets/images/show.png')}
              resizeMode="stretch"
            />
            <RNText style={styles(colorScheme).titleText}>How it Works</RNText>
          </View>
          <RNImage
            style={{height: wp(3), width: wp(3)}}
            source={colorScheme === 'dark' ? require('../../assets/images/open1.png') : require('../../assets/images/open.png') }
            resizeMode="stretch"
          />
        </TouchableOpacity>
        <View style={[RNStyles.flexWrapHorizontal, {gap: 10,marginBottom: hp(10)}]}>
          {clipsData.map(clip => (
            <View key={clip.id} style={styles(colorScheme).hazarsView}>
              <RNImage
                style={{height: hp(19), width: wp(45)}}
                source={clip.imageSource}
                resizeMode="stretch"
              />
              <View
                style={[ RNStyles.flexRowAround, {backgroundColor: colorScheme === 'dark' ? '#111c22' : Colors.lightWhite, height: hp(6)}]}>
                <View style={[RNStyles.flexRow, {gap: 5}]}>
                  <RNImage
                    style={{height: wp(4), width: wp(4)}}
                    source={require('../../assets/images/play.png')}
                    resizeMode="stretch"
                  />
                  <RNText
                    style={styles(colorScheme).hazardText}>
                    {clip.name}
                  </RNText>
                </View>
                <View style={[RNStyles.flexRow, {gap: 5}]}>
                  <TouchableOpacity>
                    <RNImage
                      style={{height: hp(2), width: wp(4)}}
                      source={colorScheme === 'dark' ? require('../../assets/images/delete1.png') : require('../../assets/images/delete.png') }
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <RNImage
                      style={{height: hp(4), width: wp(13)}}
                      source={require('../../assets/images/free.png')}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </RNContainer>
  );
}

const styles = (colorScheme) => StyleSheet.create({
  topHeader: {
    borderWidth: 1,
    borderColor: Colors.Orange,
    borderStyle: 'dashed',
    margin: hp(2),
    borderRadius: 10,
    paddingVertical: wp(2),
    paddingHorizontal: hp(2),
  },
  titleText: {
    fontSize: FontSize.font16,
    color: colorScheme === 'dark' ? Colors.White : Colors.Black,
    fontFamily: FontFamily.SemiBold,
  },
  hazarsView: {
    overflow: 'hidden',
    borderRadius: 15,
    marginVertical: hp(1),
  },
  hazardText: {
    fontSize: FontSize.font14,
    fontFamily: FontFamily.SemiBold,
    color: colorScheme === 'dark' ? Colors.White : Colors.Black,
  }
});
