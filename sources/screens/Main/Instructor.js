import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { RNContainer, RNImage, RNStyles, RNText } from "../../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../../theme";
import { useTheme } from "../../common/RNThemeContext";
import { Images } from "../../constants";
import { QuestionsReport } from "../../components";

export default function Instructor({ navigation }) {
  const { colorScheme } = useTheme();

  return (
    <RNContainer>
      <View style={[RNStyles.flexCenter, { backgroundColor: Colors.White }]}>
        <RNImage
          source={Images.NotFound}
          style={{ height: hp(30), width: wp(50) }}
        />
      </View>
    </RNContainer>
    // <RNContainer
    //   style={{
    //     paddingHorizontal: wp(3),
    //     paddingVertical: hp(3),
    //     backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
    //   }}
    // >
    //   <ScrollView showsVerticalScrollIndicator={false}>
    //     <View style={{gap: 20}}>
    //       <View>
    //         <RNText style={styles(colorScheme).title}>Where you'll be</RNText>
    //         <RNText
    //           style={[
    //             styles(colorScheme).subTitle,
    //             {color: colorScheme === 'dark' ? Colors.Grey : Colors.DarkGrey},
    //           ]}>
    //           Palghar, Maharashtra, India
    //         </RNText>
    //       </View>

    //       <View style={{alignItems: 'center'}}>
    //         <RNImage
    //           resizeMode="stretch"
    //           style={{width: wp(95), height: hp(30)}}
    //           source={require('../../assets/images/map.png')}
    //         />
    //       </View>
    //       <View style={{gap: hp(2)}}>
    //         <RNText
    //           style={[styles(colorScheme).title, {fontSize: FontSize.font18}]}>
    //           About Instructor
    //         </RNText>

    //         <TouchableOpacity
    //           style={styles(colorScheme).aboutInstructor}
    //           // onPress={() => navigation.navigate('InstructorDet')}
    //         >
    //           <View style={{flexDirection: 'row', gap: 15}}>
    //             <RNImage
    //               resizeMode="stretch"
    //               style={{width: wp(30), height: wp(30)}}
    //               source={require('../../assets/images/Rectangle28.png')}
    //             />
    //             <View style={{gap: 5}}>
    //               <RNText
    //                 style={[
    //                   styles(colorScheme).title,
    //                   {fontSize: FontSize.font16},
    //                 ]}>
    //                 kamani Driving School
    //               </RNText>
    //               <View style={styles(colorScheme).borderHorizontal} />
    //               <RNText
    //                 style={[styles(colorScheme).subTitle, {width: wp(55)}]}>
    //                 Recommended driving school with an excellent driving
    //                 instructor
    //               </RNText>
    //             </View>
    //           </View>
    //           <View style={[RNStyles.flexRow, {gap: 10}]}>
    //             <View style={[RNStyles.flexRow, {gap: 5}]}>
    //               <RNImage
    //                 style={{width: wp(5), height: wp(5)}}
    //                 source={
    //                   colorScheme === 'dark'
    //                     ? require('../../assets/images/direction2.png')
    //                     : require('../../assets/images/direction1.png')
    //                 }
    //               />
    //               <RNText
    //                 style={[
    //                   styles(colorScheme).subTitle,
    //                   {fontFamily: FontFamily.Medium},
    //                 ]}>
    //                 Direction
    //               </RNText>
    //             </View>
    //             <View style={styles(colorScheme).borderVertical} />

    //             <View style={[RNStyles.flexRow, {gap: 5}]}>
    //               <RNImage
    //                 style={{width: wp(4), height: wp(4)}}
    //                 source={
    //                   colorScheme === 'dark'
    //                     ? require('../../assets/images/phone2.png')
    //                     : require('../../assets/images/phone1.png')
    //                 }
    //               />
    //               <RNText
    //                 style={[
    //                   styles(colorScheme).subTitle,
    //                   {fontFamily: FontFamily.Medium},
    //                 ]}>
    //                 Call
    //               </RNText>
    //             </View>
    //             <View style={styles(colorScheme).borderVertical} />

    //             <View style={[RNStyles.flexRow, {gap: 5}]}>
    //               <RNImage
    //                 style={{width: wp(4), height: wp(4)}}
    //                 source={
    //                   colorScheme === 'dark'
    //                     ? require('../../assets/images/share2.png')
    //                     : require('../../assets/images/share1.png')
    //                 }
    //               />
    //               <RNText
    //                 style={[
    //                   styles(colorScheme).subTitle,
    //                   {fontFamily: FontFamily.Medium},
    //                 ]}>
    //                 Share
    //               </RNText>
    //             </View>
    //           </View>
    //         </TouchableOpacity>
    //       </View>
    //     </View>
    //   </ScrollView>
    // </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    title: {
      fontSize: FontSize.font20,
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    subTitle: {
      fontSize: FontSize.font13,
      fontFamily: FontFamily.Regular,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    aboutInstructor: {
      width: wp(95),
      backgroundColor: colorScheme === "dark" ? "#111c22" : Colors.lightWhite,
      alignSelf: "center",
      padding: wp(3),
      borderRadius: 10,
      gap: 10,
    },
    borderHorizontal: {
      width: wp(55),
      padding: 0,
      borderWidth: 0.5,
      borderColor: colorScheme === "dark" ? Colors.DarkGrey : "#ccc",
    },
    borderVertical: {
      height: hp(3),
      width: wp(0.6),
      backgroundColor: Colors.LightGrey,
    },
  });
