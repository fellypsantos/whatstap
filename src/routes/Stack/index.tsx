import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';

import IContact from '../../interfaces/IContact';

import SplashScreen from '../../pages/SplashScreen';
import Home from '../../pages/Home';
import AddContact from '../../pages/AddContact';
import AppProvider from '../../hooks';
import EditContact from '../../pages/EditContact';
import ImportContactsFromAgenda from '../../pages/ImportContactsFromAgenda';

export type RootStackParamList = {
  Home: undefined;
  AddContact: undefined;
  EditContact: { contact: IContact };
  SplashScreen: undefined;
  ImportContactsFromAgenda: undefined;
};

export interface PageProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export type StackNavigationProps = NativeStackNavigationProp<RootStackParamList>;

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

const Stack: React.FC = () => (
  <AppProvider>
    <Navigator
      initialRouteName="SplashScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Screen name="SplashScreen" component={SplashScreen} />
      <Screen name="Home" component={Home} />
      <Screen name="AddContact" component={AddContact} />
      <Screen name="EditContact" component={EditContact} />
      <Screen name="ImportContactsFromAgenda" component={ImportContactsFromAgenda} />
    </Navigator>
  </AppProvider>
);

export default Stack;
