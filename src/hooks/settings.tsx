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
  last_country_iso: string;
}

interface SettingsContext {
  settings: ISettings;
  loaded: boolean;
  updateSettings(settings: ISettings): void;
}

interface Props {
  children: React.ReactNode;
}

const SettingsContext = createContext<SettingsContext | null>(null);

const SettingsProvider: React.FC<Props> = ({ children }) => {
  const clearDatabaseSettingsOnStart = false;

  const [loaded, setLoaded] = useState(false);
  const defaultSettings = useMemo<ISettings>(
    () => ({ language: 'pt', last_country_iso: '+1' }),
    [],
  );

  const [settings, setSettings] = useState<ISettings>({ ...defaultSettings });
  const { dbConnection } = useDatabase();

  const clearDatabaseSettings = useCallback(async () => {
    if (__DEV__) console.log('DATABASE: SETTINGS CLEARED');
    await dbConnection?.executeSql('DELETE FROM settings');
  }, [dbConnection]);

  const updateSettings = useCallback(
    async (newSettings: ISettings) => {
      const { language, last_country_iso } = newSettings;

      setSettings({ language, last_country_iso });

      const result = await dbConnection?.executeSql(
        'UPDATE settings SET language=?, last_country_iso=?',
        [language, last_country_iso],
      );

      if (result?.[0].rowsAffected !== 0) console.log('Failed to update DB');
    },
    [dbConnection],
  );

  const loadDatabaseSettings = useCallback(async () => {
    const result = await dbConnection?.executeSql('SELECT * FROM settings');
    const dbSettings: ISettings = result?.[0].rows.raw()[0];

    if (!dbSettings) {
      if (__DEV__) console.log('using default settings');

      await dbConnection?.executeSql(
        'INSERT INTO settings (language, last_country_iso) VALUES(?,?)',
        [defaultSettings.language, defaultSettings.last_country_iso],
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

  const value = useMemo(
    () => ({ loaded, settings, updateSettings }),
    [loaded, settings, updateSettings],
  );

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
