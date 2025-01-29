import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../../screens/Main/HomeComponent/Home";
import Learn from "../../screens/Main/LearnComponent/Learn";
import Instructor from "../../screens/Main/Instructor";
import { useTranslation } from "react-i18next";
import { Images } from "../../constants";
import { Colors, FontFamily, FontSize, hp, wp } from "../../theme";
import { Image, Platform, Pressable, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useTheme } from "../../common/RNThemeContext";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MockTest from "../../screens/Main/HomeComponent/MockTest";
import RNQueHeader from "../Headers/RNQueHeader";
import RNTopicHeader from "../Headers/RNTopicHeader";
import RNMistakeHeader from "../Headers/RNMistakeHeader";
import Mistake from "../../screens/Main/HomeComponent/Mistake";
import TopicTest from "../../screens/Main/HomeComponent/TopicTest";
import { CNIndexes } from "../../screens/Main/HomeComponent/CNIndexes";
import Setting from "../../screens/Main/SettingComponent/Setting";
import highwaycode from "../../screens/Main/LearnComponent/Highwaycode";
import RNHeader from "../Headers/RNHeader";
import RNTabHeader from "../Headers/RNTabHeader";
import InstructorDetail from "../../screens/Main/InstructorDetail";
import EditProfile from "../../screens/Main/EditProfile";
import { RNText } from "../../common";
import { useNavigation } from "@react-navigation/native";
import { color } from "@rneui/base";
import { QuestionsReport } from "../../components";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CustomTab = ({ navigation }) => {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const navigations = useNavigation();
  const CustomTabBarButton = ({ children, onPress }) => {
    const { t } = useTranslation();
    return (
      <Pressable
        style={{
          top: hp(-2.5),
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={onPress}
      >
        <View
          style={{
            width: wp(15),
            height: wp(15),
            marginBottom: hp(1),
          }}
        >
          <LinearGradient
            colors={["#000000", "#ffb366"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 2, y: 0.05 }}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: wp(100) / 2,
              justifyContent: "center",
              alignItems: "center",
              elevation: 10,
            }}
          >
            {children}
          </LinearGradient>
        </View>
        <RNText
          style={{
            color: Colors.Black,
            fontSize: FontSize.font14,
            fontFamily: FontFamily.GilroyMedium,
            paddingTop: hp(0),
          }}
        >
          {/* {t("Nav.home")} */}
        </RNText>
      </Pressable>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName={t("Nav.home")}
      screenOptions={{
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTopWidth: 1,
          backgroundColor:
            colorScheme === "dark" ? Colors.BgBlack : Colors.White,
          paddingHorizontal: wp(2.5),
          paddingBottom: Platform.OS === "ios" ? hp(2) : hp(1),
          paddingTop: hp(1),
          height: Platform.OS === "ios" ? hp(11) : hp(8),
        },
        tabBarLabelStyle: {
          color: colorScheme === "dark" ? Colors.White : Colors.Black,
          fontSize: FontSize.font13,
          fontFamily: FontFamily.GilroyMedium,
          paddingTop: hp(0),
        },
        headerStyle: {
          height: hp(7),
          backgroundColor:
            colorScheme === "dark" ? Colors.BgBlack : Colors.White,
          borderBottomWidth: 1,
          borderBottomColor: Colors.LightGrey,
        },
        headerTitleStyle: {
          color: colorScheme === "dark" ? Colors.White : Colors.Black,
          fontSize: FontSize.font16,
          fontFamily: FontFamily.GilroySemiBold,
        },
      }}
    >
      <Tab.Screen
        name={t("Nav.Learn")}
        component={Learn}
        options={{
          header: () => <RNHeader title={t("Nav.Learn")} />,
          tabBarIcon: ({ focused }) => (
            <Image
              resizeMode="contain"
              style={{ width: wp(5), height: wp(5) }}
              source={focused ? Images.f_learn : Images.learn}
            />
          ),
        }}
      />
      {/* <Tab.Screen
        name={t('Nav.clip')}
        component={Clips}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              resizeMode="contain"
              style={{width: wp(5), height: wp(5)}}
              source={focused ? Images.f_Clip : Images.clips}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name={t("Nav.home")}
        component={Home}
        options={{
          header: () => <RNTabHeader navigation={navigation} />,
          tabBarLabelStyle: { color: Colors.Transparent },
          tabBarButton: (props) => (
            <CustomTabBarButton {...props}>
              <Image
                resizeMode="contain"
                style={{ width: wp(6), height: wp(6) }}
                source={Images.home}
              />
            </CustomTabBarButton>
          ),
        }}
      />
      {/* <Tab.Screen
        name={t('Nav.share')}
        component={Share}
        options={{
          tabBarIcon: ({focused}) => (
            <Image
              resizeMode="contain"
              style={{width: wp(5), height: wp(5)}}
              source={Images.share1}
            />
          ),
        }}
      /> */}
      <Tab.Screen
        name={t("Nav.instructor")}
        component={Instructor}
        options={{
          header: () => <RNHeader title={t("Nav.instructor")} />,
          tabBarIcon: ({ focused }) => (
            <Pressable>
              <Image
                resizeMode="contain"
                style={{ width: wp(6), height: wp(6) }}
                source={focused ? Images.f_location : Images.location}
              />
            </Pressable>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const TabContent = () => {
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => <RNHeader />,
      }}
    >
      <Stack.Screen
        name="CustomTab"
        component={CustomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Mocktest"
        component={MockTest}
        initialParams={{ title: t("header.MockTest") }}
        options={({ route }) => ({
          header: () => <RNQueHeader component={route.params?.component} />,
          gestureEnabled: false, // Disables swipe back action
        })}
      />
      <Stack.Screen
        name="TopicTest"
        component={TopicTest}
        options={{
          header: () => <RNTopicHeader />,
          gestureEnabled: false, // Disables swipe back action
        }}
        initialParams={{ title: t("header.TopicTest") }}
      />
      <Stack.Screen
        name="Mistake"
        component={Mistake}
        options={{
          header: () => <RNMistakeHeader />,
          gestureEnabled: false, // Disables swipe back action
        }}
        initialParams={{ title: t("header.Mistakes") }}
      />
      <Stack.Screen
        name="CNIndexes"
        component={CNIndexes}
        // initialParams={{ title: t("header.Test") }}
        options={{
          header: () => (
            <RNHeader title={t("header.Test")} LeftIcon={Images.leftarrow} />
          ),
        }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={Setting}
        // initialParams={{ title: t("header.Setting") }}
        options={{
          header: () => (
            <RNHeader title={t("header.Setting")} LeftIcon={Images.leftarrow} />
          ),
        }}
      />
      <Stack.Screen
        name="Highwaycode"
        component={highwaycode}
        //initialParams={{ title: t("header.Highwaycode") }}
        options={{
          header: () => (
            <RNHeader
              title={t("header.Highwaycode")}
              LeftIcon={Images.leftarrow}
            />
          ),
        }}
      />
      <Stack.Screen
        name="InstructorDet"
        component={InstructorDetail}
        // initialParams={{ title: t("Nav.instructor") }}
        options={{
          header: () => (
            <RNHeader title={t("Nav.instructor")} LeftIcon={Images.leftarrow} />
          ),
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        //initialParams={{ title: t("setting.EditProfile") }}
        options={{
          header: () => (
            <RNHeader
              title={t("setting.EditProfile")}
              LeftIcon={Images.leftarrow}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

export default TabContent;
