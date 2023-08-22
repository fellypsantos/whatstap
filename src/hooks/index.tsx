import React from 'react';

import { ContactProvider } from './contact';
import { TranslationProvider } from './translation';
import { SettingsProvider } from './settings';
import { CountriesProvider } from './countries';
import DataBaseInit from '../databases/DataBaseInit';

interface AppProviderProps {
  children: React.ReactElement;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <DataBaseInit>
    <TranslationProvider>
      <SettingsProvider>
        <CountriesProvider>
          <ContactProvider>{children}</ContactProvider>
        </CountriesProvider>
      </SettingsProvider>
    </TranslationProvider>
  </DataBaseInit>
);

export default AppProvider;
