import React from 'react';

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
    <NavigationContainer theme={AppTheme}>
      <StatusBar backgroundColor="#5467FB" barStyle="light-content" />
      <Stack />
    </NavigationContainer>
  );
};

export default App;
