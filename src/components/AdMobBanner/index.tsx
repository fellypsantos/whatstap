import React from 'react';
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Banner } from '../../AdMob';

const unitId = __DEV__ ? TestIds.BANNER : Banner;

const AdMobBanner: React.FC = () => (
  <BannerAd
    unitId={unitId}
    size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    onAdFailedToLoad={() => __DEV__ && console.log('Banner failed to load.')}
    onAdOpened={() => __DEV__ && console.log('Banner loaded.')}
  />
);

export default AdMobBanner;
