import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Alert, Linking, ToastAndroid } from 'react-native';
import AlertAsync from 'react-native-alert-async';

import IContact from '../interfaces/IContact';
import { useDatabase } from './database';

interface ContactContext {
  contacts: IContact[];
  loading: boolean;
  getContacts(): Promise<IContact[]>;
  addContact(contact: IContact): void;
  editContact(contact: IContact): Promise<boolean>;
  removeContact(contact: IContact): Promise<boolean>;
  openWhatsApp(phone: string): void;
}

interface ContactProviderProps {
  children: React.ReactNode;
}

const ContactContext = createContext<ContactContext | null>(null);

const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const { dbConnection } = useDatabase();

  const getContacts = useCallback(async (): Promise<IContact[]> => {
    const dbContacts = await dbConnection?.executeSql('SELECT * FROM contacts');

    if (dbContacts) return dbContacts[0].rows.raw().reverse();
    return [];
  }, [dbConnection]);

  const addContact = useCallback(
    async (contact: IContact) => {
      try {
        const { id, name, phone, country, createdAt } = contact;

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

  const editContact = useCallback(
    async (contact: IContact): Promise<boolean> => {
      try {
        const { id, name } = contact;

        const update = await dbConnection?.executeSql(
          'UPDATE contacts SET name = ? WHERE id = ?',
          [name, id],
        );

        if (update) {
          const updatedList = contacts.map(item => {
            if (item.id === contact.id) {
              return {
                ...item,
                name: contact.name,
              };
            }
            return contact;
          });

          setContacts(updatedList);
          ToastAndroid.show('Contact updated.', ToastAndroid.LONG);
          return update[0].rowsAffected > 0;
        } else throw new Error();
      } catch {
        ToastAndroid.show('Failed to edit the contact.', ToastAndroid.LONG);
        console.error('Failed to edit the contact.');
        return false;
      }
    },
    [dbConnection, contacts],
  );

  const removeContact = useCallback(
    async (contact: IContact): Promise<boolean> => {
      const confirm = await AlertAsync(
        'Caution',
        'Do you really want to delete this contact?',
        [
          { text: 'Yes, I Want', onPress: () => true },
          { text: 'No', onPress: () => false },
        ],
        {
          cancelable: true,
          onDismiss: () => false,
        },
      );

      if (!confirm) return false;

      try {
        const deleteResult = await dbConnection?.executeSql(
          'DELETE FROM contacts WHERE id = ?',
          [contact.id],
        );

        if (deleteResult) {
          const filtered = contacts.filter(item => item.id !== contact.id);

          setContacts(filtered);
          return deleteResult[0].rowsAffected > 0;
        } else {
          throw new Error(`Failed to remove contact with id: ${contact.id}`);
        }
      } catch (err) {
        const error = err as Error;
        console.error('Ocorreu um erro ao deletar o contato: ', error.message);
      }

      return false;
    },
    [dbConnection, contacts],
  );

  const openWhatsApp = useCallback((phone: string) => {
    phone = phone.replace('+', '');
    Linking.openURL(`whatsapp://send?&phone=${phone}`);
  }, []);

  useEffect(() => {
    async function loadContacts(): Promise<void> {
      const dbContacts = await getContacts();
      setContacts(dbContacts);
      setLoading(false);
    }

    setLoading(true);
    loadContacts();
  }, [dbConnection, getContacts]);

  const value = useMemo(
    () => ({
      getContacts,
      addContact,
      editContact,
      removeContact,
      contacts,
      loading,
      openWhatsApp,
    }),
    [
      getContacts,
      addContact,
      editContact,
      removeContact,
      contacts,
      loading,
      openWhatsApp,
    ],
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

export { ContactProvider, useContact };
