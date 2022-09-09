import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '../../pages/Home';
import AddNumber from '../../pages/AddNumber';

const {Navigator, Screen} = createNativeStackNavigator();

const Stack: React.FC = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Screen name="AddNumber" component={AddNumber} />
    <Screen name="Home" component={Home} />
  </Navigator>
);

export default Stack;
