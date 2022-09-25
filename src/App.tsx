import React, { useEffect, useRef } from 'react';
import { StatusBar, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import mobileAds, {
  AppOpenAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

import Stack from './routes/Stack';
import AdMobBanner from './components/AdMobBanner';
import { OpenApp } from './AdMob';
import '../i18n.config';
import { GetRandomBoolean } from './utils/random';

const adUnitId = __DEV__ ? TestIds.APP_OPEN : OpenApp;
const appOpenAd = AppOpenAd.createForAdRequest(adUnitId);

// Preload an app open ad
appOpenAd.load();

// Show the app open ad when user brings the app to the foreground.
// appOpenAd.show();

mobileAds()
  .initialize()
  .then(
    adapterStatuses =>
      __DEV__ && console.log('mobileAds status', adapterStatuses),
  );

const App: React.FC = () => {
  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
    },
  };

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const unsubscribeClosed = appOpenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => appOpenAd.load(),
    );

    const unsubscrubeAppState = AppState.addEventListener(
      'change',
      nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active' &&
          appOpenAd.loaded
        ) {
          const shouldDisplayAd = GetRandomBoolean();
          if (shouldDisplayAd) appOpenAd.show();
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      unsubscribeClosed();
      unsubscrubeAppState.remove();
    };
  }, []);

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
