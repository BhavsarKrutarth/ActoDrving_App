import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Linking,
  Platform,
} from "react-native";
import { Divider } from "react-native-paper";
import { RNContainer, RNImage, RNStyles, RNText } from "../../../common";
import { Colors, FontFamily, FontSize, hp, wp } from "../../../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from "i18next";
import { useTheme } from "../../../common/RNThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../../../constants";
import { LanguageModal, SignOutModal, ThemeModal } from "./Modals";
import {
  onAuthChange,
  setAsyncStorageValue,
} from "../../../redux/Reducers/AuthReducers";
import { useDispatch } from "react-redux";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { signOut } from "@react-native-firebase/auth";
import { color } from "@rneui/base";

export default function Setting() {
  const { t } = useTranslation();
  const { colorScheme, selectedLanguage, updateTheme, updateLanguage } =
    useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("system_default");
  const [IsShowLang, setShowLanguage] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showSignOutConfirmation, setShowSignOutConfirmation] = useState(false);
  const languages = require("language-list")();
  const specificLanguageCodes = [
    "en",
    "gu",
    "hi",
    "zh",
    "fr",
    // "ur",
    "es",
    "pa",
  ];
  const filteredLanguageCodes = languages
    .getLanguageCodes()
    .filter((code) => specificLanguageCodes.includes(code));
  const filteredLanguageNames = filteredLanguageCodes.map((code) =>
    languages.getLanguageName(code)
  );

  const languageAnim = useRef(new Animated.Value(0)).current;
  const modalAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme_preference");
        const storedLanguage = await AsyncStorage.getItem(
          "language_preference"
        );
        if (storedTheme) {
          setSelectedOption(storedTheme);
          updateTheme(storedTheme);
        }
        if (storedLanguage) {
          i18next.changeLanguage(storedLanguage);
        }
      } catch (error) {
        console.error("Failed to load preferences.", error);
      }
    };
    loadPreferences();
  }, [updateTheme, updateLanguage]);

  const handleOptionPress = async (option) => {
    try {
      await updateTheme(option);
      setModalVisible(false);
    } catch (error) {
      console.error("Failed to save theme preference.", error);
    }
  };

  const handleLanguage = async (lang) => {
    try {
      await updateLanguage(lang);
      await AsyncStorage.setItem("language_preference", lang);
      setShowLanguage(false);
      navigation.reset({
        index: 0,
        routes: [{ name: t("Nav.home") }],
      });
    } catch (error) {
      console.error("Failed to update language.", error);
    }
  };

  // const LanguageInfo = filteredLanguageCodes.map((code, index) => ({
  //   id: (index + 1).toString(),
  //   Code: code,
  //   Language: filteredLanguageNames[index],
  // }));
  const LanguageInfo = specificLanguageCodes.map((code, index) => ({
    id: (index + 1).toString(),
    Code: code,
    Language: i18next.t(`languageNames.${code}`),
  }));

  const PrivacyPoliceURL = "https://actodrivingprivacypolicies.actoscript.com";
  const TermsConditionsURL =
    "https://actodriving_terms_conditions.actoscript.com";
  // const handleURL = (url) => {
  //   Linking.openURL(url);
  // };

  const settingsOptions = [
    {
      image: Images.insurance,
      title: t("setting.privacy"),
      subtitle: t("setting.privacysubtitle"),
      onPress: () => Linking.openURL(PrivacyPoliceURL),
    },
    {
      image: Images.terms,
      title: t("setting.terms"),
      subtitle: t("setting.termssubtitle"),
      onPress: () => Linking.openURL(TermsConditionsURL),
    },
    // {
    //   image: Images.star,
    //   title: t("setting.rate"),
    //   subtitle: t("setting.ratesubtitle"),
    //   onPress: () => {},
    // },
    // {
    //   image: Images.share,
    //   title: t("setting.share"),
    //   subtitle: t("setting.sharesubtitle"),
    //   onPress: () => {},
    // },
    // {
    //   image: Images.about,
    //   title: t("setting.about"),
    //   subtitle: "",
    //   onPress: () => {},
    // },
  ];

  const toggleLanguageMenu = () => {
    if (IsShowLang) {
      Animated.timing(languageAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => setShowLanguage(false));
    } else {
      setShowLanguage(true);
      Animated.timing(languageAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    }
  };

  const confirmSignOut = () => {
    setShowSignOutConfirmation(true);
  };

  const cancelSignOut = () => {
    setShowSignOutConfirmation(false);
  };

  const handleConfirmSignOut = async () => {
    AsyncStorage.clear();
    dispatch(onAuthChange(false));
    dispatch(setAsyncStorageValue(""));
    await GoogleSignin.signOut();
    setShowSignOutConfirmation(false);
  };

  const openModal = () => {
    setModalVisible(true);
    Animated.timing(modalAnim, {
      toValue: 1,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

  return (
    <RNContainer
      style={{
        backgroundColor: colorScheme === "dark" ? Colors.BgBlack : Colors.White,
      }}
    >
      {/* <Divider />
      <TouchableOpacity style={[RNStyles.flexRowBetween, {padding: wp(4)}]}>
        <View>
          <RNText style={styles(colorScheme).title}>
            {t('setting.Answer_single_tap')}
          </RNText>
          <RNText style={styles(colorScheme).subTitle}>
            {t('setting.Disable_answer_preselection')}
          </RNText>
        </View>
        <TouchableOpacity>
          <Switch
            color={Colors.Green}
            value={isSwitchOn}
            onValueChange={onToggleSwitch}
          />
        </TouchableOpacity>
      </TouchableOpacity> */}
      <Divider />
      <TouchableOpacity style={{ padding: wp(4) }} onPress={toggleLanguageMenu}>
        <RNText style={styles(colorScheme).title}>
          {t("setting.App_language")}
        </RNText>
        <RNText style={styles(colorScheme).subTitle}>
          {
            filteredLanguageNames[
              filteredLanguageCodes.indexOf(selectedLanguage)
            ]
          }{" "}
          ({t("setting.device_language")})
        </RNText>
      </TouchableOpacity>
      <Divider />
      <TouchableOpacity
        style={{ padding: wp(4) }}
        onPress={() => navigation.navigate("EditProfile")}
      >
        <RNText style={styles(colorScheme).title}>
          {t("setting.EditProfile")}
        </RNText>
        <RNText style={styles(colorScheme).subTitle}>
          {t("setting.Update_details")}
        </RNText>
      </TouchableOpacity>
      <Divider />
      <View style={{ padding: wp(5), gap: 30 }}>
        {settingsOptions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[RNStyles.flexRow, { gap: 20 }]}
            onPress={item.onPress}
          >
            <RNImage
              style={{ width: wp(7), height: wp(7) }}
              source={item.image}
            />
            <View>
              <RNText style={styles(colorScheme).title}>{item.title}</RNText>
              {item.subtitle ? (
                <RNText style={styles(colorScheme).subTitle}>
                  {item.subtitle}
                </RNText>
              ) : null}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Divider />
      <TouchableOpacity style={{ padding: wp(4) }} onPress={confirmSignOut}>
        <RNText
          style={[
            {
              color: Colors.Red,
              fontFamily: FontFamily.GilroyExtraBold,
              fontSize:
                Platform.OS === "ios" ? FontSize.font22 : FontSize.font18,
            },
          ]}
        >
          {t("setting.logout")}
        </RNText>
      </TouchableOpacity>

      {/*  modals */}
      <LanguageModal
        IsShowLang={IsShowLang}
        toggleLanguageMenu={toggleLanguageMenu}
        languageAnim={languageAnim}
        colorScheme={colorScheme}
        t={t}
        LanguageInfo={LanguageInfo}
        selectedLanguage={selectedLanguage}
        handleLanguage={handleLanguage}
      />
      <SignOutModal
        showSignOutConfirmation={showSignOutConfirmation}
        handleConfirmSignOut={handleConfirmSignOut}
        cancelSignOut={cancelSignOut}
        colorScheme={colorScheme}
        t={t}
      />
      <ThemeModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedOption={selectedOption}
        colorScheme={colorScheme}
        t={t}
      />
    </RNContainer>
  );
}

const styles = (colorScheme) =>
  StyleSheet.create({
    title: {
      fontSize: Platform.OS === "ios" ? FontSize.font19 : FontSize.font16,
      fontFamily: FontFamily.GilroySemiBold,
      color: colorScheme === "dark" ? Colors.White : Colors.Black,
    },
    subTitle: {
      paddingTop: Platform.OS === "ios" ? hp(0.8) : hp(0.4),
      fontSize: Platform.OS === "ios" ? FontSize.font15 : FontSize.font13,
      fontFamily: FontFamily.GilroyRegular,
      color: colorScheme === "dark" ? Colors.Grey : Colors.DarkGrey,
    },
  });
