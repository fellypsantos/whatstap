import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

export default class DataBase {
  static db: SQLiteDatabase;

  static open = (): Promise<SQLiteDatabase> => {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        this.db = SQLite.openDatabase(
          { name: 'app.db', location: 'default' },
          () => {
            if (__DEV__) console.log('DATABASE SUCCESSFULLY OPENED!');
            resolve(this.db);
          },
          error => {
            reject(error.message);
          },
        );
      }
    });
  };
}
