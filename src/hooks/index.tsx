import React from 'react';

import { ContactProvider } from './contact';
import { DatabaseProvider } from './database';
import { TranslationProvider } from './translation';

interface AppProviderProps {
  children: React.ReactElement;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => (
  <DatabaseProvider>
    <TranslationProvider>
      <ContactProvider>{children}</ContactProvider>
    </TranslationProvider>
  </DatabaseProvider>
);

export default AppProvider;
