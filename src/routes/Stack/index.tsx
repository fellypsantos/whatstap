import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import IContact from '../../interfaces/IContact';

import Home from '../../pages/Home';
import AddContact from '../../pages/AddContact';
import AppProvider from '../../hooks';
import EditContact from '../../pages/EditContact';
import {RouteProp} from '@react-navigation/core';

type RootStackParamList = {
  Home: undefined;
  AddContact: undefined;
  EditContact: {contact: IContact};
};

// export type PageProps = NativeStackScreenProps<RootStackParamList>;

export interface PageProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

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
      <Screen name="AddContact" component={AddContact} />
      <Screen name="EditContact" component={EditContact} />
    </Navigator>
  </AppProvider>
);

export default Stack;
