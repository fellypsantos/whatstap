import i18next from 'i18next';
import React, { createContext, useContext, useMemo, useEffect, useCallback, useState } from 'react';
import { getSupportedLocale } from '../utils/device';
import DataBase from '../databases';

interface ISettings {
  language: string;
  last_country_code: string;
  last_country_name: string;
  last_country_iso: string;
  disabled_phone_mask: boolean;
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
    () => ({
      language: getSupportedLocale(),
      last_country_code: '+1',
      last_country_name: 'United States',
      last_country_iso: 'US',
      disabled_phone_mask: false,
    }),
    [],
  );

  const [settings, setSettings] = useState<ISettings>({ ...defaultSettings });

  const clearDatabaseSettings = useCallback(async () => {
    DataBase.db.transaction(tx => {
      tx.executeSql('DELETE FROM settings', [], (_, result) => {
        if (__DEV__ && result.rowsAffected > 0) {
          console.log('DATABASE: SETTINGS CLEARED');
        }
      });
    });
  }, []);

  const updateSettings = useCallback(async (newSettings: ISettings) => {
    const { language, last_country_code, last_country_name, last_country_iso, disabled_phone_mask } = newSettings;

    setSettings({
      language,
      last_country_code,
      last_country_name,
      last_country_iso,
      disabled_phone_mask,
    });

    DataBase.db.transaction(tx => {
      tx.executeSql(
        'UPDATE settings SET language=?, last_country_code=?, last_country_name=?, last_country_iso=?, disabled_phone_mask=?',
        [language, last_country_code, last_country_name, last_country_iso, disabled_phone_mask],
        (_, result) => {
          if (__DEV__) console.log('upate settings result', result);
          if (result.rowsAffected !== 1) console.log('Failed to update DB', result.rowsAffected);
        },
      );
    });
  }, []);

  const loadDatabaseSettings = useCallback(async () => {
    DataBase.db.transaction(tx => {
      tx.executeSql('SELECT * FROM settings', [], (_, result) => {
        const dbSettings: ISettings = result.rows.raw()[0];

        if (!dbSettings) {
          if (__DEV__) console.log('using default settings');

          tx.executeSql('INSERT INTO settings (language, last_country_code, last_country_iso, disabled_phone_mask) VALUES(?,?,?,?)', [
            defaultSettings.language,
            defaultSettings.last_country_code,
            defaultSettings.last_country_iso,
            defaultSettings.disabled_phone_mask,
          ]);
        } else {
          if (__DEV__) console.log('using database settings');
          setSettings(dbSettings);
        }

        setLoaded(true);
      });
    });
  }, [defaultSettings]);

  useEffect(() => {
    async function loadSettings() {
      if (clearDatabaseSettingsOnStart) await clearDatabaseSettings();
      await loadDatabaseSettings();
    }

    if (!loaded) loadSettings();
  }, [loaded, loadDatabaseSettings, clearDatabaseSettings, clearDatabaseSettingsOnStart]);

  useEffect(() => {
    i18next.changeLanguage(settings.language);
  }, [settings.language]);

  const value = useMemo(() => ({ loaded, settings, updateSettings }), [loaded, settings, updateSettings]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

const useSettings = (): SettingsContext => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }

  return context;
};

export { SettingsProvider, useSettings };
