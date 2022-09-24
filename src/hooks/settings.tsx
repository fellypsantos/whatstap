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
}

interface SettingsContext {
  settings: ISettings;
  loaded: boolean;
}

interface Props {
  children: React.ReactNode;
}

const SettingsContext = createContext<SettingsContext | null>(null);

const SettingsProvider: React.FC<Props> = ({ children }) => {
  const clearDatabaseSettingsOnStart = false;

  const [loaded, setLoaded] = useState(false);
  const defaultSettings = useMemo<ISettings>(() => ({ language: 'pt' }), []);
  const [settings, setSettings] = useState<ISettings>({ ...defaultSettings });

  const { dbConnection } = useDatabase();

  const clearDatabaseSettings = useCallback(async () => {
    if (__DEV__) console.log('DATABASE: SETTINGS CLEARED');
    await dbConnection?.executeSql('DELETE FROM settings');
  }, [dbConnection]);

  const loadDatabaseSettings = useCallback(async () => {
    const result = await dbConnection?.executeSql('SELECT * FROM settings');
    const dbSettings: ISettings = result?.[0].rows.raw()[0];

    if (!dbSettings) {
      if (__DEV__) console.log('using default settings');

      await dbConnection?.executeSql(
        'INSERT INTO settings (language, last_country_iso) VALUES(?,?)',
        [defaultSettings.language, 'BR'],
      );
    } else {
      if (__DEV__) console.log('using database settings');
      setSettings(dbSettings);
    }

    setLoaded(true);
  }, [dbConnection, defaultSettings]);

  useEffect(() => {
    async function loadSettings() {
      if (clearDatabaseSettingsOnStart) await clearDatabaseSettings();
      await loadDatabaseSettings();
    }

    if (!loaded) loadSettings();
  }, [
    loaded,
    loadDatabaseSettings,
    clearDatabaseSettings,
    clearDatabaseSettingsOnStart,
  ]);

  const value = useMemo(() => ({ loaded, settings }), [loaded, settings]);

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
