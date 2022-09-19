import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import IContact from '../../interfaces/IContact';

import Home from '../../pages/Home';
import AddContact from '../../pages/AddContact';
import AppProvider from '../../hooks';
import EditContact from '../../pages/EditContact';

export type RootStackParamList = {
  Home: undefined;
  AddContact: undefined;
  EditContact: { contact: IContact };
};

export interface PageProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export type StackNavigationProps =
  NativeStackNavigationProp<RootStackParamList>;

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

const Stack: React.FC = () => (
  <AppProvider>
    <Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="Home" component={Home} />
      <Screen name="AddContact" component={AddContact} />
      <Screen name="EditContact" component={EditContact} />
    </Navigator>
  </AppProvider>
);

export default Stack;
