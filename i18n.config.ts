import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { ptBR, enUS, esES } from './src/translations';

// setup available languages
const resources = {
  pt: { translation: ptBR },
  en: { translation: enUS },
  es: { translation: esES },
};

i18n.use(initReactI18next).init({
  resources,
  compatibilityJSON: 'v3',
  lng: 'pt',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
