import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  enablePromise,
  openDatabase,
  SQLiteDatabase,
} from 'react-native-sqlite-storage';

interface DatabaseContext {
  dbConnection: SQLiteDatabase | null;
}

interface DatabaseProviderProps {
  children: React.ReactNode;
}

const DatabaseContext = createContext<DatabaseContext | null>(null);

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [dbConnection, setDbConnection] = useState<SQLiteDatabase | null>(null);

  const createContactsTable = useCallback((db: SQLiteDatabase) => {
    db.transaction(tx => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS "contacts" (
          "id"	TEXT NOT NULL UNIQUE,
          "name"	TEXT,
          "country_code"	TEXT NOT NULL,
          "phone"	TEXT NOT NULL,
          "country"	TEXT NOT NULL,
          "createdAt"	TEXT NOT NULL,
          PRIMARY KEY("id")
        );
      `);
    });
  }, []);

  const createSettingsTable = useCallback((db: SQLiteDatabase) => {
    db.transaction(tx => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS "settings" (
          "language"	TEXT,
          "last_country_code"	TEXT,
          "last_country_name"	TEXT
        );
      `);
    });
  }, []);

  const addLastCountryIsoColumnInSettings = useCallback(
    (db: SQLiteDatabase) => {
      db.transaction(tx => {
        tx.executeSql(
          'ALTER TABLE "settings" ADD COLUMN "last_country_iso" TEXT',
        );
      }).catch(() => null);
    },
    [],
  );

  const addDisabledPhoneMaskColumnInSettings = useCallback(
    (db: SQLiteDatabase) => {
      db.transaction(tx => {
        tx.executeSql(
          'ALTER TABLE "settings" ADD COLUMN "disabled_phone_mask" INTEGER',
        );
      }).catch(() => null);
    },
    [],
  );

  useEffect(() => {
    async function connect() {
      if (!dbConnection) {
        enablePromise(true);

        const connection = await openDatabase({
          name: 'app.db',
          location: 'default',
        });

        setDbConnection(connection);
        createContactsTable(connection);
        createSettingsTable(connection);

        addLastCountryIsoColumnInSettings(connection);
        addDisabledPhoneMaskColumnInSettings(connection);

        if (__DEV__) console.log('DB: Connected');
      }
    }

    connect();
  }, [
    dbConnection,
    createContactsTable,
    createSettingsTable,
    addLastCountryIsoColumnInSettings,
    addDisabledPhoneMaskColumnInSettings,
  ]);

  const value = useMemo(() => ({ dbConnection }), [dbConnection]);

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

const useDatabase = (): DatabaseContext => {
  const context = useContext(DatabaseContext);

  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }

  return context;
};

export { DatabaseProvider, useDatabase };
