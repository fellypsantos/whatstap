import React from 'react';

import { ContactProvider } from './contact';
import { DatabaseProvider } from './database';
import { TranslationProvider } from './translation';
import { SettingsProvider } from './settings';
import { CountriesProvider } from './countries';

interface AppProviderProps {
  children: React.ReactElement;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <DatabaseProvider>
    <TranslationProvider>
      <SettingsProvider>
        <CountriesProvider>
          <ContactProvider>{children}</ContactProvider>
        </CountriesProvider>
      </SettingsProvider>
    </TranslationProvider>
  </DatabaseProvider>
);

export default AppProvider;
