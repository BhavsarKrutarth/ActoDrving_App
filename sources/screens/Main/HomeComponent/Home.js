import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../common/RNThemeContext";
import FetchMethod from "../../../api/FetchMethod";
import { SET_MISTAKEQUESTIONDATA } from "../../../redux/Reducers/MistakeReducers";
import {
  RNContainer,
  RNImage,
  RNLoader,
  RNStyles,
  RNText,
} from "../../../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../../../theme";
import { Item, OverviewContent } from "./Modals";
import { Images } from "../../../constants";

export default function Home({ navigation }) {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const [selectedId, setSelectedId] = useState(null);
  const selectedCategory = useSelector(
    (state) => state.Category.selectedCategory
  );
  const userLoginData = useSelector((state) => state.Authentication.AsyncValue);
  const { selectedLanguage } = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const overviewContent = OverviewContent() || [];

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
    }, [selectedCategory?.vehicle_Id, selectedLanguage])
  );

  if (isLoading) {
    return <RNLoader visible={isLoading} />;
  }

  return (
    <RNContainer
      style={{
        backgroundColor:
          colorScheme === "dark" ? Colors.BgBlack : Colors.lightWhite,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: wp(2) }}>
          {/* banner view */}
          <View style={RNStyles.flexCenter}>
            <View
              style={{ overflow: "hidden", borderRadius: 10, marginTop: hp(2) }}
            >
              <Image
                style={{ width: wp(95), height: hp(20) }}
                source={Images.car}
              />
              <View
                style={[RNStyles.flexRow, styles(colorScheme).CategoryData]}
              >
                <View>
                  <RNText style={styles(colorScheme).bannerText}>
                    {selectedCategory
                      ? selectedCategory.name
                      : t("Home.NoCategory")}
                  </RNText>
                  <RNText style={[styles(colorScheme).content]}>
                    {t("Home.v_summary")}
                  </RNText>
                </View>
              </View>
            </View>
          </View>

          {/* Overview */}
          <View style={styles(colorScheme).ContentView}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                <RNText style={styles(colorScheme).overviewText}>
                  {t("Home.overview")}
                </RNText>
                <RNImage
                  style={styles(colorScheme).starIcon}
                  source={Images.star1}
                />
              </View>
              <View
                style={{
                  //paddingHorizontal: wp(3),
                  flexWrap: "wrap",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // ...RNStyles.flexWrapHorizontal,
                  // gap: wp(2),
                }}
              >
                {overviewContent.map((item) => (
                  <Item
                    key={item.id}
                    {...item}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    colorScheme={colorScheme}
                    navigationScreen={item.navigation}
                    component={item.component}
                    navigation={navigation}
                  />
                ))}
              </View>
            </View>

            {/* Study Material */}
            {/* <View style={{ flex: 1, paddingVertical: 20, marginBottom: 50 }}>
            <View style={{ flexDirection: 'row' }}>
              <RNText style={styles(colorScheme).overviewText}>
                {t('Home.s_material')}
              </RNText>
              <RNImage
                style={styles(colorScheme).starIcon}
                source={Images.star1}
              />
            </View>
            <RNText
              style={[
                styles(colorScheme).content,
                {
                  paddingHorizontal: 20,
                  paddingBottom: 10,
                  fontSize: FontSize.font12,
                },
              ]}>
              {t('Home.s_summary')}
            </RNText>
            <View style={[RNStyles.flexWrapHorizontal, { gap: 15 }]}>
              {stdMaterial.map(item => (
                <Sub_Item
                  key={item.id}
                  {...item}
                  selectedsubId={selectedsubId}
                  setSelectedsubId={setSelectedsubId}
                  colorScheme={colorScheme}
                  navigationScreen={item.navigation}
                  component={item.component}
                  navigation={navigation}
                />
              ))}
            </View>
          </View> */}
          </View>
        </View>
      </ScrollView>
    </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    bannerText: {
      fontSize: FontSize.font20,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    ContentView: { flex: 2.5, paddingTop: hp(3), paddingBottom: hp(15) },
    overviewText: {
      fontSize: FontSize.font22,
      fontFamily: FontFamily.SemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
      paddingLeft: 20,
      paddingBottom: 5,
    },
    starIcon: {
      height: wp(2),
      width: wp(2),
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    content: {
      fontFamily: FontFamily.Medium,
      fontSize: FontSize.font13,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
    },
    CategoryData: {
      width: wp(95),
      height: hp(9),
      backgroundColor: colorScheme === "dark" ? Colors.Blue : Colors.White,
      padding: wp(4),
    },
  });
