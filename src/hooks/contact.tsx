import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {Alert, Linking} from 'react-native';

import IContact from '../interfaces/IContact';
import {useDatabase} from './database';

interface ContactContext {
  contacts: IContact[];
  loading: boolean;
  addContact(contact: IContact): void;
  removeContact(contact: IContact): void;
  openWhatsApp(phone: string): void;
}

interface ContactProviderProps {
  children: React.ReactNode;
}

const ContactContext = createContext<ContactContext | null>(null);

const ContactProvider: React.FC<ContactProviderProps> = ({children}) => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const {dbConnection} = useDatabase();

  useEffect(() => {
    async function loadContacts(): Promise<void> {
      const dbContacts = await dbConnection?.executeSql(
        'SELECT * FROM contacts',
      );

      if (dbContacts) {
        const data = dbContacts[0].rows.raw().reverse();
        setContacts(data);
      }

      setLoading(false);
    }

    setLoading(true);
    loadContacts();
  }, [dbConnection]);

  const addContact = useCallback(
    async (contact: IContact) => {
      try {
        const {id, name, phone, country, createdAt} = contact;

        const insertResult = await dbConnection?.executeSql(
          'INSERT INTO contacts(id, name, phone, country, createdAt) VALUES(?,?,?,?,?)',
          [id, name, phone, country, createdAt],
        );

        if (insertResult) setContacts([contact, ...contacts]);
        else throw new Error('Failed to save the contact');
      } catch (err) {
        const error = err as Error;
        Alert.alert('OOPS', error.message);
      }
    },
    [dbConnection, contacts],
  );

  const removeContact = useCallback(
    async (contact: IContact) => {
      try {
        console.log('removeContact useCallback');

        const deleteResult = await dbConnection?.executeSql(
          'DELETE FROM contacts WHERE id = ?',
          [contact.id],
        );

        if (deleteResult) {
          const filtered = contacts.filter(
            contactItem => contactItem.id !== contact.id,
          );

          setContacts(filtered);
          return deleteResult[0].rowsAffected > 0;
        } else
          throw new Error(`Failed to remove contact with id: ${contact.id}`);
      } catch (err) {
        const error = err as Error;
        console.error('Ocorreu um erro ao deletar o contato: ', error.message);
      }
    },
    [dbConnection, contacts],
  );

  const openWhatsApp = useCallback((phone: string) => {
    phone = phone.replace('+', '');
    Linking.openURL(`whatsapp://send?&phone=${phone}`);
  }, []);

  const value = useMemo(
    () => ({addContact, removeContact, contacts, loading, openWhatsApp}),
    [addContact, removeContact, contacts, loading, openWhatsApp],
  );

  return (
    <ContactContext.Provider value={value}>{children}</ContactContext.Provider>
  );
};

function useContact(): ContactContext {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }

  return context;
}

export {ContactProvider, useContact};
