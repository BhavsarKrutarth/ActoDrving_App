import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, FontFamily, FontSize, hp, wp } from "../../../theme";
import { RNContainer, RNImage, RNStyles, RNText } from "../../../common";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../common/RNThemeContext";
import { Images } from "../../../constants";
import NetInfo from "@react-native-community/netinfo";
import NetInfoScreen from "../../../components/NetInfo";

export default function Learn({ navigation }) {
  const { colorScheme } = useTheme();
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Subscribe to NetInfo updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected); // If not connected, set isOffline to true
    });
    return () => unsubscribe();
  }, []);

  const Std_Material = [
    {
      id: 1,
      navigation: "Highwaycode",
      imageSorce: Images.highwaycode,
      title: t("Home.highwaycode"),
      content: t("Home.highwaycode_Summary"),
    },
    // {
    //   id: 2,
    //   navigation: 'Signs',
    //   imageSorce: Images.signs,
    //   title: t('Home.signs'),
    //   content: t('Home.signs_summary'),
    // },
  ];

  return (
    <RNContainer
      style={{
        backgroundColor: Colors.lightWhite,
        paddingHorizontal: wp(3),
        paddingVertical: hp(3),
        gap: wp(7),
      }}
    >
      <View style={{ gap: hp(0.5) }}>
        <View style={{ flexDirection: "row" }}>
          <RNText
            style={{
              fontSize:
                Platform.OS === "ios" ? FontSize.font22 : FontSize.font18,
              fontFamily: FontFamily.GilroySemiBold,
            }}
          >
            {t("Home.s_material")}
          </RNText>
          <RNImage source={Images.star1} style={styles(colorScheme).starIcon} />
        </View>
        <RNText
          style={{
            fontSize: Platform.OS === "ios" ? FontSize.font16 : FontSize.font13,
            fontFamily: FontFamily.GilroyMedium,
            color: Colors.DarkGrey,
          }}
        >
          {t("Home.s_summary")}
        </RNText>
      </View>
      <View style={RNStyles.center}>
        {Std_Material.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles(colorScheme).modalContainer}
            onPress={() => navigation.navigate(item.navigation)}
          >
            <View style={[RNStyles.flexRowBetween, { gap: 20 }]}>
              <View
                style={[
                  RNStyles.center,
                  {
                    height: wp(15),
                    width: wp(15),
                    backgroundColor: Colors.lightWhite,
                    borderRadius: 50,
                  },
                ]}
              >
                <RNImage
                  source={item.imageSorce}
                  style={{ width: wp(8), height: wp(8) }}
                />
              </View>
              <TouchableOpacity
                style={styles(colorScheme).buttonView}
                onPress={() => navigation.navigate(item.navigation)}
              >
                <RNText
                  style={{
                    color: Colors.White,
                    fontFamily: FontFamily.GilroySemiBold,
                    fontSize:
                      Platform.OS === "ios" ? FontSize.font18 : FontSize.font14,
                  }}
                >
                  {t("Home.view")}
                </RNText>
              </TouchableOpacity>
            </View>
            <View>
              <RNText
                style={{
                  fontSize:
                    Platform.OS === "ios" ? FontSize.font22 : FontSize.font18,
                  fontFamily: FontFamily.GilroyBold,
                }}
              >
                {item.title}
              </RNText>
              <RNText
                pTop={Platform.OS === "ios" ? hp(0.8) : hp(0.6)}
                style={{
                  fontSize:
                    Platform.OS === "ios" ? FontSize.font16 : FontSize.font14,

                  fontFamily: FontFamily.GilroyRegular,
                  lineHeight: Platform.OS === "ios" ? hp(2.5) : hp(2.2),
                }}
              >
                {item.content}
              </RNText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <NetInfoScreen isvisible={isOffline} />
    </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    modalContainer: {
      backgroundColor: Colors.White,
      width: wp(95),
      paddingHorizontal: wp(5),
      paddingVertical: wp(5),
      borderRadius: 10,
      marginBottom: wp(3),
      gap: wp(5),
    },
    buttonView: {
      backgroundColor: Colors.Black,
      fontSize: FontSize.font14,
      fontFamily: FontFamily.Bold,
      borderRadius: 20,
      paddingHorizontal: wp(5),
      paddingVertical: wp(1.8),
    },
    starIcon: {
      width: wp(2),
      height: wp(2),
    },
  });
