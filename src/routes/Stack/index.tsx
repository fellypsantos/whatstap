import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import Home from '../../pages/Home';
import AddNumber from '../../pages/AddNumber';
import AppProvider from '../../hooks';

type RootStackParamList = {
  Home: undefined;
  AddNumber: undefined;
};

export type StackNavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

const {Navigator, Screen} = createNativeStackNavigator<RootStackParamList>();

const Stack: React.FC = () => (
  <AppProvider>
    <Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="Home" component={Home} />
      <Screen name="AddNumber" component={AddNumber} />
    </Navigator>
  </AppProvider>
);

export default Stack;
