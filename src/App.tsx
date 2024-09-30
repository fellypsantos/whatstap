import React, { useEffect, useRef, useCallback } from 'react';
import { StatusBar, AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import mobileAds, { AppOpenAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';

import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';
import VersionInfo from 'react-native-version-info';
import PushNotification from 'react-native-push-notification';

import Stack from './routes/Stack';
import AdMobBanner from './components/AdMobBanner';
import { OpenApp } from './AdMob';
import '../i18n.config';
import { CalculateChanceToDisplayAppOpenAd } from './utils/random';

PushNotification.configure({
  onRegister: token => __DEV__ && console.log('Firebase Token is: ', token),
  onNotification: notification => {
    if (__DEV__) { console.log('onNotification', notification); }
    // console.warn('Notification received inside Context!', notification);
    // if (notification.userInteraction === true) {
    //   console.warn('setAppNotification');
    //   // setAppNotification(notification.data);
    // }
  },
  onRegistrationError: err => {
    console.error(err.message, err);
  },
});

const adUnitId = __DEV__ ? TestIds.APP_OPEN : OpenApp;
const appOpenAd = AppOpenAd.createForAdRequest(adUnitId);

const CHECK_UPDATE_INTERVAL_IN_MS = 5 * 1000 * 60; // 5 minutes

// Preload an app open ad
appOpenAd.load();

mobileAds()
  .initialize()
  .then(adapterStatuses => __DEV__ && console.log('mobileAds status', adapterStatuses));

const App: React.FC = () => {
  const AppTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fff',
    },
  };

  const appState = useRef(AppState.currentState);

  const checkAppUpdates = useCallback(() => {
    // IN APP UPDATE
    const inAppUpdates = new SpInAppUpdates(
      __DEV__, // isDebug
    );

    inAppUpdates.checkNeedsUpdate({ curVersion: VersionInfo.appVersion }).then(result => {
      if (result.shouldUpdate) {
        let updateOptions = {};

        updateOptions = {
          updateType: IAUUpdateKind.FLEXIBLE,
        };

        inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
      }
    });
  }, []);

  useEffect(() => {
    if (!__DEV__) {
      checkAppUpdates();
      setInterval(checkAppUpdates, CHECK_UPDATE_INTERVAL_IN_MS);
    }
  }, [checkAppUpdates]);

  useEffect(() => {
    const unsubscribeClosed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => appOpenAd.load());

    const unsubscrubeAppState = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active' && appOpenAd.loaded) {
        const shouldDisplayAd = CalculateChanceToDisplayAppOpenAd();
        if (shouldDisplayAd) { appOpenAd.show(); }
      }

      appState.current = nextAppState;
    });

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
