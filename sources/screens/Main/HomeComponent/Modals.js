import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { RNImage, RNText, RNStyles } from "../../../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../../../theme";
import { Images } from "../../../constants";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export const OverviewContent = () => {
  const { t } = useTranslation();
  return [
    {
      id: 1,
      navigation: "CNIndexes",
      component: "MockTest",
      imageSorce: Images.mocktest,
      title: t("Home.mocktest"),
      content: t("Home.mocktestsummary"),
    },
    {
      id: 2,
      navigation: "CNIndexes",
      component: "TopicTest",
      imageSorce: Images.topics,
      title: t("Home.topics"),
      content: t("Home.topicsummary"),
    },
    {
      id: 3,
      navigation: "Mistake",
      imageSorce: Images.mistake,
      title: t("Home.mistake"),
      content: t("Home.mistakesummary"),
      isMistake: true,
    },
    // {
    //   id: 4,
    //   navigation: '',
    //   imageSorce: Images.hazard,
    //   title: t('Home.hazard'),
    //   content: t('Home.hazardsummary'),
    // },
  ];
};

// export const Std_Material = () => {
//   const { t } = useTranslation();
//   return [
//     {
//       id: 1,
//       navigation: 'Highwaycode',
//       imageSorce: Images.highwaycode,
//       title: t('Home.highwaycode'),
//       content: t('Home.highwaycode_Summary'),
//     },
//   ];
// };

export const Item = ({
  id,
  imageSorce,
  title,
  content,
  selectedId,
  setSelectedId,
  colorScheme,
  component,
  navigationScreen,
  navigation,
  isMistake,
}) => {
  const isSelected = selectedId === id;
  const MistakeQuestionsData = useSelector(
    (state) => state.Mistake.mistakequesrtionsData
  );
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      style={styles(colorScheme).item}
      onPress={() => {
        setSelectedId(id);
        navigation.navigate(navigationScreen, { component });
      }}
    >
      <View style={[RNStyles.flexRowBetween]}>
        <View style={styles(colorScheme).wrapper}>
          {isSelected && (
            <RNImage
              resizeMode="contain"
              source={Images.selected}
              style={styles(colorScheme).selected}
            />
          )}
          {isMistake && (
            <View
              style={{
                ...RNStyles.flexRowCenter,
                position: "absolute",
                zIndex: 1,
                overflow: "hidden",
                top: hp(0),
                left: wp(9),
                backgroundColor: "#DCEAFF",
                height: wp(6),
                minWidth: wp(6),
                maxWidth: wp(12),
                // width: wp(12),
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#7EB2FF",
              }}
            >
              <RNText
                style={{
                  fontSize: FontSize.font13,
                  fontFamily: FontFamily.Bold,
                  paddingHorizontal: wp(1),
                }}
              >
                {MistakeQuestionsData.length}
              </RNText>
            </View>
          )}
          <RNImage
            resizeMode="contain"
            source={imageSorce}
            style={styles(colorScheme).image}
          />
        </View>
        <TouchableOpacity
          style={[
            styles(colorScheme).buttonContainer,
            { backgroundColor: isSelected ? Colors.Orange : Colors.BgBlack },
          ]}
          onPress={() => {
            setSelectedId(id);
            navigation.navigate(navigationScreen, { component });
          }}
        >
          <RNText style={styles(colorScheme).buttonText}>
            {t("Home.view")}
          </RNText>
        </TouchableOpacity>
      </View>
      <View style={styles(colorScheme).textContainer}>
        <RNText numOfLines={1} style={styles(colorScheme).title}>
          {title}
        </RNText>
        <RNText numOfLines={3} style={styles(colorScheme).content}>
          {content}
        </RNText>
      </View>
    </TouchableOpacity>
  );
};

// export const Sub_Item = ({
//   id,
//     imageSorce,
//     title,
//     content,
//     component,
//     selectedsubId,
//     setSelectedsubId,
//     colorScheme,
//     navigationScreen,
//     navigation,
// }) => {
//   const isSelected = selectedsubId === id;
//   const { t } = useTranslation();

//   return (
//     <View
//         style={[
//           styles(colorScheme).item,
//           {width: wp(90), marginBottom: hp(10)},
//         ]}>
//         <View style={RNStyles.flexRowBetween}>
//           <View style={styles(colorScheme).wrapper}>
//             {isSelected && (
//               <RNImage
//                 resizeMode="contain"
//                 source={Images.selected}
//                 style={styles(colorScheme).selected}
//               />
//             )}
//             <RNImage
//               resizeMode="contain"
//               source={imageSorce}
//               style={styles(colorScheme).image}
//             />
//           </View>
//           <TouchableOpacity
//             style={[
//               styles(colorScheme).buttonContainer,
//               {backgroundColor: isSelected ? Colors.Orange : Colors.BgBlack},
//             ]}
//             onPress={() => navigation.navigate(navigationScreen, {component})}>
//             <RNText style={[styles(colorScheme).buttonText]}>
//               {t('Home.view')}
//             </RNText>
//           </TouchableOpacity>
//         </View>
//         <View style={styles(colorScheme).textContainer}>
//           <RNText numOfLines={1} style={styles(colorScheme).title}>
//             {title}
//           </RNText>
//           <RNText style={styles(colorScheme).content}>{content}</RNText>
//         </View>
//       </View>
//   );
// };

const styles = (colorScheme) =>
  StyleSheet.create({
    buttonContainer: {
      backgroundColor: Colors.Orange,
      paddingVertical: 5,
      paddingHorizontal: 15,
      borderRadius: 20,
    },
    buttonText: {
      fontSize: FontSize.font14,
      fontFamily: FontFamily.Medium,
      color: Colors.White,
    },
    item: {
      width: wp(45),
      borderRadius: 10,
      backgroundColor: colorScheme === "dark" ? Colors.Blue : Colors.White,
      padding: wp(3),
      gap: 20,
      marginBottom: hp(1.5),
    },
    image: { height: wp(7), width: wp(7) },
    wrapper: {
      height: wp(13),
      width: wp(13),
      backgroundColor: colorScheme === "dark" ? "#3e6075" : "#F0F0F0",
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontFamily: FontFamily.SemiBold,
      fontSize: FontSize.font18,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    content: {
      fontFamily: FontFamily.Medium,
      fontSize: FontSize.font13,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
    },
    selected: {
      height: wp(13),
      width: wp(13),
      position: "absolute",
      overflow: "hidden",
    },
  });
