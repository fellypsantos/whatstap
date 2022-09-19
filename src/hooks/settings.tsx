import React, {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useCallback,
  useState,
} from 'react';
import { useDatabase } from './database';

interface ISettings {
  language: string;
  lastCountryISO: string;
}

interface SettingsContext {
  settings: ISettings;
}

interface Props {
  children: React.ReactNode;
}

const SettingsContext = createContext<SettingsContext | null>(null);

const SettingsProvider: React.FC<Props> = ({ children }) => {
  const [settings, setSettings] = useState<ISettings>({
    language: 'en',
    lastCountryISO: 'BR',
  });

  const { dbConnection } = useDatabase();

  const insertDefaultSettings = useCallback(async () => {
    const result = await dbConnection?.executeSql(
      'INSERT INTO settings (language, last_country_iso) VALUES(?,?)',
      [settings.language, settings.lastCountryISO],
    );

    console.log('insertDefaultSettings', result);
  }, [dbConnection, settings]);

  useEffect(() => {
    async function loadSettings() {
      const result = await dbConnection?.executeSql('SELECT * FROM settings');

      // LOOP INFINITO
      // CRIAR UM STATE PRA SABER QUANDO AS SETTINGS ESTÃO CARREGADAS
      // OU enquando as settings forem nulas.

      // setSettings({ ...settings, lastCountryISO: 'US' });
    }

    loadSettings();
  }, [dbConnection, insertDefaultSettings, settings]);

  const value = useMemo(() => ({ settings }), [settings]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

const useSettings = (): SettingsContext => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};

export { SettingsProvider, useSettings };
