import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Tasks } from '../../Tasks';
import NavRoutes from '../NavRoutes';
import NavConfigs from '../NavConfigs';
import DrawerContent from './DrawerContent';  

const Drawer = createDrawerNavigator();

const Index = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ ...NavConfigs.screenOptions, drawerType: 'front' }}
      drawerContent={p => <DrawerContent {...p} />}>
      <Drawer.Screen name={NavRoutes.Tasks} component={Tasks} />
    </Drawer.Navigator>
  );
};

export default Index;
