import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  DEBUG,
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

const DatabaseProvider: React.FC<DatabaseProviderProps> = ({children}) => {
  const [dbConnection, setDbConnection] = useState<SQLiteDatabase | null>(null);

  const createContactsTable = useCallback((db: SQLiteDatabase) => {
    db.transaction(tx => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS "contacts" (
          "id"	TEXT NOT NULL UNIQUE,
          "name"	TEXT,
          "phone"	TEXT NOT NULL,
          "country"	TEXT NOT NULL,
          "createdAt"	TEXT NOT NULL,
          PRIMARY KEY("id")
        );
      `);
    });
  }, []);

  useEffect(() => {
    async function connect() {
      if (!dbConnection) {
        if (__DEV__) DEBUG(true);
        enablePromise(true);

        const connection = await openDatabase({
          name: 'app.db',
          location: 'default',
        });

        setDbConnection(connection);
        createContactsTable(connection);

        if (__DEV__) console.log('DB: Connected');
      } else {
        if (__DEV__) console.log('DB: Already connected');
      }
    }

    connect();
  }, [dbConnection, createContactsTable]);

  const value = useMemo(() => ({dbConnection}), [dbConnection]);

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

export {DatabaseProvider, useDatabase};
