import React from 'react';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
import Stack from './routes/Stack';
import {StatusBar} from 'react-native';

const App = () => {
  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
    },
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer theme={AppTheme}>
        <StatusBar backgroundColor="#5467FB" barStyle="light-content" />
        <Stack />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
