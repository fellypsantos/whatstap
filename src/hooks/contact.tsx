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
import { useAppTranslation } from './translation';

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
  const { Translate } = useAppTranslation();

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
          ToastAndroid.show(
            Translate('Toast.Contact.Added'),
            ToastAndroid.LONG,
          );
        } else throw new Error(Translate('Toast.Contact.FailedToAdd'));
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
    },
    [dbConnection, contacts, Translate],
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
          ToastAndroid.show(
            Translate('Toast.Contact.Updated'),
            ToastAndroid.LONG,
          );
          return update[0].rowsAffected > 0;
        } else throw new Error(Translate('Toast.Contact.FailedToUpdate'));
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        return false;
      }
    },
    [dbConnection, contacts, Translate],
  );

  const removeContact = useCallback(
    async (contact: IContact): Promise<boolean> => {
      const confirm = await AlertAsync(
        Translate('Alerts.Warning'),
        Translate('Confirm.Contact.Delete'),
        [
          { text: Translate('Confirm.Option.YesIWant'), onPress: () => true },
          { text: Translate('Confirm.Option.No'), onPress: () => false },
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
          ToastAndroid.show(
            Translate('Toast.Contact.Deleted'),
            ToastAndroid.LONG,
          );
          return deleteResult[0].rowsAffected > 0;
        } else throw new Error('Toast.Contact.FailedToDelete');
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }

      return false;
    },
    [dbConnection, contacts, Translate],
  );

  const clearContacts = useCallback(async () => {
    try {
      const confirm = await AlertAsync(
        Translate('Alerts.DangerousAction'),
        Translate('Confirm.Contact.ClearAll'),
        [
          {
            text: Translate('Confirm.Option.YesClearHistory'),
            onPress: () => true,
          },
          { text: Translate('Confirm.Option.No'), onPress: () => false },
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
        ToastAndroid.show(
          Translate('Toast.Contact.HistoryCleared'),
          ToastAndroid.LONG,
        );
      } else throw new Error(Translate('Toast.Contact.FailedToClearAll'));
    } catch (err) {
      const error = err as Error;
      ToastAndroid.show(error.message, ToastAndroid.LONG);
    }
  }, [dbConnection, Translate]);

  const openWhatsApp = useCallback(
    async (phone: string) => {
      phone = phone.replace('+', '');

      const whatsappURL = `whatsapp://send?&phone=${phone}`;
      const supported = await Linking.canOpenURL(whatsappURL);

      if (supported) {
        ToastAndroid.show(
          Translate('Toast.OpeningWhatsApp'),
          ToastAndroid.LONG,
        );
        Linking.openURL(whatsappURL);
      } else {
        Alert.alert(
          Translate('Alerts.Error'),
          Translate('Alerts.WhatsAppCantHandleURL'),
        );
      }
    },
    [Translate],
  );

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
