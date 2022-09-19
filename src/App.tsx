import React from 'react';
import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import mobileAds from 'react-native-google-mobile-ads';

import Stack from './routes/Stack';
import AdMobBanner from './components/AdMobBanner';
import '../i18n.config';

mobileAds()
  .initialize()
  .then(
    adapterStatuses =>
      __DEV__ && console.log('mobileAds status', adapterStatuses),
  );

const App = () => {
  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
    },
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={AppTheme}>
        <StatusBar backgroundColor="#5467FB" barStyle="light-content" />
        <Stack />
        <AdMobBanner />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
