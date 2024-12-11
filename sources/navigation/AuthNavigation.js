import React from 'react';
import {NavConfigs, NavRoutes} from './index';
import {createStackNavigator} from '@react-navigation/stack';
import {RNHeader} from '../common';
import {useTranslation} from 'react-i18next';
import {Login, Register} from '../screens';
import OTPScreen from '../screens/Auth/OTPScreen';
import EmailScreen from '../screens/Auth/EmailScreen';
import ResetPassword from '../screens/Auth/ResetPassword';

const Stack = createStackNavigator();

const AuthNavigation = () => {
  const {t} = useTranslation();
  return (
    <Stack.Navigator screenOptions={NavConfigs.screenOptions}>
      <Stack.Screen name={'Login'} component={Login} />
      <Stack.Screen
        name={'Register'}
        component={Register}
        options={{
          headerShown: true,
          header: () => <RNHeader />,
        }}
        initialParams={{title: t('header.Register')}}
      />
      <Stack.Screen name={NavRoutes.OTPScreen} component={OTPScreen} />
      <Stack.Screen
        name={NavRoutes.EmailScreen}
        component={EmailScreen}
        options={{
          headerShown: true,
          header: () => <RNHeader />,
        }}
        initialParams={{title: t('header.ForgotPass')}}
      />
      <Stack.Screen
        name={NavRoutes.ResetPassword}
        component={ResetPassword}
        options={{
          headerShown: true,
          header: () => <RNHeader />,
        }}
        initialParams={{title: t('header.NewPassword')}}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigation;
