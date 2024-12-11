import {Alert, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ALERT = ({Title, Text, Buttons}) => Alert.alert(Title, Text, Buttons);

const OpenUrl = url => Linking.openURL(url);

const setAppData = async data => {
  const previousValue = await getAppData();
  if (previousValue) {
    await AsyncStorage.setItem(
      'appdata',
      JSON.stringify({...previousValue, ...data}),
    );
  } else {
    await AsyncStorage.setItem('appdata', JSON.stringify(data));
  }
};

const getAppData = async () => {
  const value = await AsyncStorage.getItem('appdata');
  return JSON.parse(value);
};

const getUserData = async () => {
  const value = await AsyncStorage.getItem('user');
  return JSON.parse(value);
};

const setUserData = async data => {
  await AsyncStorage.setItem('user', JSON.stringify(data));
};

const ToPercentage = ({value, total}) => {
  const Percentage = Math.floor((value * 100) / total);
  return Percentage > 100 ? 100 : Percentage;
};

const Functions = {
  ALERT,
  OpenUrl,
  setAppData,
  getAppData,
  ToPercentage,
  getUserData,
  setUserData,
};

export default Functions;
