import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import RNHeader from '../Headers/RNHeader';
import {RNContainer} from '../../common';
import {useTranslation} from 'react-i18next';
import MockTest from '../../screens/Main/HomeComponent/MockTest';
import RNQueHeader from '../Headers/RNQueHeader';
import RNTopicHeader from '../Headers/RNTopicHeader';
import RNMistakeHeader from '../Headers/RNMistakeHeader';
import Mistake from '../../screens/Main/HomeComponent/Mistake';
import TopicTest from '../../screens/Main/HomeComponent/TopicTest';
import {CNIndexes} from '../../screens/Main/HomeComponent/CNIndexes';
import Setting from '../../screens/Main/SettingComponent/Setting';
import highwaycode from '../../screens/Main/LearnComponent/Highwaycode';
import AuthNavigation from '../AuthNavigation';
import NavRoutes from '../NavRoutes';
import TabContent from './TabContent';

const Stack = createNativeStackNavigator();

export default function index() {
  const {t} = useTranslation();

  return (
    <RNContainer hidden={true}>
      <Stack.Navigator
        screenOptions={{
          header: () => <RNHeader />,
        }}>
        <Stack.Screen
          name="TabContent"
          component={TabContent}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Mocktest"
          component={MockTest}
          initialParams={{title: t('header.MockTest')}}
          options={({route}) => ({
            header: () => <RNQueHeader component={route.params?.component} />,
          })}
        />
        <Stack.Screen
          name="TopicTest"
          component={TopicTest}
          options={{header: () => <RNTopicHeader />}}
          initialParams={{title: t('header.TopicTest')}}
        />
        <Stack.Screen
          name="Mistake"
          component={Mistake}
          options={{header: () => <RNMistakeHeader />}}
          initialParams={{title: t('header.Mistakes')}}
        />
        <Stack.Screen
          name="CNIndexes"
          component={CNIndexes}
          initialParams={{title: t('header.Test')}}
        />
        <Stack.Screen
          name="SettingScreen"
          component={Setting}
          initialParams={{title: t('header.Setting')}}
        />
        <Stack.Screen
          name="Highwaycode"
          component={highwaycode}
          initialParams={{title: t('header.Highwaycode')}}
        />
        <Stack.Screen
          name={NavRoutes.AuthNavigation}
          component={AuthNavigation}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </RNContainer>
  );
}

const styles = StyleSheet.create({});
