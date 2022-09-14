import React from 'react';

import {ContactProvider} from './contact';
import {DatabaseProvider} from './database';

interface AppProviderProps {
  children: React.ReactElement;
}

const AppProvider: React.FC<AppProviderProps> = ({children}) => (
  <DatabaseProvider>
    <ContactProvider>{children}</ContactProvider>
  </DatabaseProvider>
);

export default AppProvider;
