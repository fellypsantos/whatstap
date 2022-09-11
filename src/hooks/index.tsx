import React from 'react';

import {ContactProvider} from './contact';

interface AppProviderProps {
  children: React.ReactElement;
}

const AppProvider: React.FC<AppProviderProps> = ({children}) => (
  <ContactProvider>{children}</ContactProvider>
);

export default AppProvider;
