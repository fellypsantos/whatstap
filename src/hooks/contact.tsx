import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Linking, ToastAndroid } from 'react-native';
import AlertAsync from 'react-native-alert-async';

import IContact from '../interfaces/IContact';
import { useDatabase } from './database';

interface ContactContext {
  contacts: IContact[];
  loading: boolean;
  addContact(contact: IContact): void;
  editContact(contact: IContact): Promise<boolean>;
  removeContact(contact: IContact): Promise<boolean>;
  openWhatsApp(phone: string): void;
  clearContacts(): void;
}

interface ContactProviderProps {
  children: React.ReactNode;
}

const ContactContext = createContext<ContactContext | null>(null);

const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const { dbConnection } = useDatabase();

  const addContact = useCallback(
    async (contact: IContact) => {
      try {
        const { id, name, phone, country, createdAt } = contact;

        const insertResult = await dbConnection?.executeSql(
          'INSERT INTO contacts(id, name, phone, country, createdAt) VALUES(?,?,?,?,?)',
          [id, name, phone, country, createdAt],
        );

        if (insertResult) {
          setContacts([contact, ...contacts]);
          ToastAndroid.show('Contact was added.', ToastAndroid.LONG);
        } else throw new Error('Failed to save the contact');
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
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
            return item;
          });

          setContacts(updatedList);
          ToastAndroid.show('Contact updated.', ToastAndroid.LONG);
          return update[0].rowsAffected > 0;
        } else throw new Error('Failed to edit the contact.');
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
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
          ToastAndroid.show('Contact was removed.', ToastAndroid.LONG);
          return deleteResult[0].rowsAffected > 0;
        } else {
          throw new Error(`Failed to remove contact with id: ${contact.id}`);
        }
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }

      return false;
    },
    [dbConnection, contacts],
  );

  const clearContacts = useCallback(async () => {
    try {
      const confirm = await AlertAsync(
        'Dangerous Action',
        "You are going to delete all your contact list. It can't be undone. Are you really sure?",
        [
          { text: 'Yes, Clear History', onPress: () => true },
          { text: 'No', onPress: () => false },
        ],
        {
          cancelable: true,
          onDismiss: () => false,
        },
      );

      if (!confirm) return false;

      const result = await dbConnection?.executeSql('DELETE FROM contacts');
      if (result) {
        setContacts([]);
        ToastAndroid.show('Contact history was cleared.', ToastAndroid.LONG);
      } else throw new Error('Failed to clear you contact history.');
    } catch (err) {
      const error = err as Error;
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }, [dbConnection]);

  const openWhatsApp = useCallback((phone: string) => {
    phone = phone.replace('+', '');
    ToastAndroid.show('Opening Whatsapp....', ToastAndroid.LONG);
    Linking.openURL(`whatsapp://send?&phone=${phone}`);
  }, []);

  useEffect(() => {
    async function loadContacts(): Promise<void> {
      const result = await dbConnection?.executeSql('SELECT * FROM contacts');

      if (result !== undefined) {
        setContacts(result[0].rows.raw().reverse());
        setLoading(false);
      }
    }

    setLoading(true);
    loadContacts();
  }, [dbConnection]);

  const value = useMemo(
    () => ({
      addContact,
      editContact,
      removeContact,
      contacts,
      loading,
      openWhatsApp,
      clearContacts,
    }),
    [
      addContact,
      editContact,
      removeContact,
      contacts,
      loading,
      openWhatsApp,
      clearContacts,
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
