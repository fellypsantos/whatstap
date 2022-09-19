import React from 'react';

import { ContactProvider } from './contact';
import { DatabaseProvider } from './database';
import { TranslationProvider } from './translation';
import { SettingsProvider } from './settings';

interface AppProviderProps {
  children: React.ReactElement;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <DatabaseProvider>
    <TranslationProvider>
      <SettingsProvider>
        <ContactProvider>{children}</ContactProvider>
      </SettingsProvider>
    </TranslationProvider>
  </DatabaseProvider>
);

export default AppProvider;
