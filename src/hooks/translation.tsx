import React, { createContext, useContext, useMemo } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

interface TranslationContext {
  Translate: TFunction;
  selectedLanguage: string;
}

interface Props {
  children: React.ReactNode;
}

const TranslationContext = createContext<TranslationContext | null>(null);

const TranslationProvider: React.FC<Props> = ({ children }) => {
  const { t: Translate, i18n } = useTranslation();

  const selectedLanguage = useMemo(() => i18n.language, [i18n.language]);

  const value = useMemo(
    () => ({ Translate, selectedLanguage }),
    [Translate, selectedLanguage],
  );
  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

const useAppTranslation = (): TranslationContext => {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error(
      'useAppTranslation must be used within a TranslationProvider',
    );
  }

  return context;
};

export { TranslationProvider, useAppTranslation };
