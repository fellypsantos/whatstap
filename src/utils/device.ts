import { NativeModules } from 'react-native';

export const getSupportedLocale = (): string => {
  const currentDeviceLocale = NativeModules.I18nManager.localeIdentifier;

  const sanitizantedLocale = currentDeviceLocale
    .replace('_', '-')
    .toLowerCase();

  const countryID = sanitizantedLocale.split('-')[0];

  switch (countryID) {
    case 'pt':
    case 'es':
      return countryID;

    default:
      return 'en';
  }
};
