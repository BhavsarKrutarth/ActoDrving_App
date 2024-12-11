import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigation from './AuthNavigation';
import {
  onAuthChange,
  setAsyncStorageValue,
} from '../redux/Reducers/AuthReducers';
import {useDispatch, useSelector} from 'react-redux';
import {Functions} from '../utils';
import TabContent from './BottomTabs/TabContent';
import {RNLoader} from '../common';

export default function Routes() {
  const [isLoading, setLoading] = useState(true);
  const isAuth = useSelector(state => state.Authentication.isAuth);
  const dispatch = useDispatch();

  useEffect(() => {
    userData();
  }, []);

  const userData = async () => {
    const data = await Functions.getUserData();
    if (data) {
      dispatch(onAuthChange(true));
      dispatch(setAsyncStorageValue(data));
    } else {
      dispatch(onAuthChange(false));
      dispatch(setAsyncStorageValue(''));
    }
    setLoading(false);
  };

  if (isLoading) {
    return <RNLoader visible={isLoading} />;
  }

  return (
    <NavigationContainer>
      {isAuth ? <TabContent /> : <AuthNavigation />}
    </NavigationContainer>
  );
}
