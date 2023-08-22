import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import React, { Fragment, useState } from 'react';
import DataBase from '..';
import migrations from '../updates';

import SQLite from 'react-native-sqlite-storage';

interface IDataBaseInitProps {
  children: React.ReactNode;
}

const LATEST_DATABASE_VERSION = 1;

const SQL_CREATE_CONTACTS_TABLE = `
  CREATE TABLE IF NOT EXISTS "contacts" (
    "id"	TEXT NOT NULL UNIQUE,
    "name"	TEXT,
    "country_code"	TEXT NOT NULL,
    "phone"	TEXT NOT NULL,
    "country"	TEXT NOT NULL,
    "createdAt"	TEXT NOT NULL,
    PRIMARY KEY("id")
  );
`;

const SQL_CREATE_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS "settings" (
    "language"	TEXT,
    "last_country_code"	TEXT,
    "last_country_name"	TEXT
  );
`;

export default function DataBaseInit({ children }: IDataBaseInitProps) {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    SQLite.DEBUG(__DEV__);

    DataBase.open().then(database => {
      database.transaction(tx => {
        tx.executeSql(SQL_CREATE_CONTACTS_TABLE);
        tx.executeSql(SQL_CREATE_SETTINGS_TABLE);

        tx.executeSql('PRAGMA user_version;', [], (_, result) => {
          const currentDataBaseVersion = result.rows.item(0).user_version;
          if (__DEV__) console.log('currentDataBaseVersion', currentDataBaseVersion);

          if (currentDataBaseVersion < LATEST_DATABASE_VERSION) {
            for (let i = currentDataBaseVersion; i < LATEST_DATABASE_VERSION; i++) {
              // RUN MULTIPLE COMMANDS SEPARATED BY SEMICOLON
              migrations[i].split(';').map(command => {
                if (command.trim().length > 0) {
                  tx.executeSql(command);
                }
              });
            }

            tx.executeSql('PRAGMA user_version = ' + LATEST_DATABASE_VERSION, [], () => {
              console.log('Database updated to v' + LATEST_DATABASE_VERSION);
            });
          }
        });

        setAppReady(true);
      });
    });
  }, []);

  return !appReady ? <ActivityIndicator color="#5467fb" size={25} /> : <Fragment>{children}</Fragment>;
}
