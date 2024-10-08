import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Alert, Linking, ToastAndroid } from 'react-native';
import AlertAsync from 'react-native-alert-async';

import IContact from '../interfaces/IContact';
import { useAppTranslation } from './translation';
import DataBase from '../databases';

type FindContactByCountryCodeAndPhoneNumberParams = {
  countryCode: string;
  phoneNumber: string;
}

interface ContactContext {
  contacts: IContact[];
  loading: boolean;
  addContact(contact: IContact): void;
  editContact(contact: IContact): Promise<boolean>;
  removeContact(contact: IContact): Promise<boolean>;
  deleteContacts(contactsToDelete: IContact[]): Promise<boolean>;
  openWhatsApp(phone: string): void;
  clearContacts(): void;
  findContactByCountryCodeAndPhoneNumber({ countryCode, phoneNumber }: FindContactByCountryCodeAndPhoneNumberParams): Promise<IContact[]>;
}

interface ContactProviderProps {
  children: React.ReactNode;
}

const ContactContext = createContext<ContactContext | null>(null);

const ContactProvider: React.FC<ContactProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<IContact[]>([]);
  const { Translate } = useAppTranslation();

  const addContact = useCallback(
    (contact: IContact) => {
      try {
        const { id, name, country_code, phone, country, createdAt } = contact;

        DataBase.db.transaction(tx => {
          tx.executeSql('INSERT INTO contacts(id, name, country_code, phone, country, createdAt) VALUES(?,?,?,?,?,?)', [id, name, country_code, phone, country, createdAt.toString()], (_, result) => {
            if (result.rowsAffected === 1) {
              setContacts((prevContacts) => [contact, ...prevContacts]);
            } else { throw new Error(Translate('Toast.Contact.FailedToAdd')); }
          });
        });
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      }
    },
    [Translate],
  );

  const editContact = useCallback(
    async (contact: IContact): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        try {
          const { id, name, country, country_code, phone } = contact;

          DataBase.db.transaction(tx => {
            tx.executeSql('UPDATE contacts SET country=?, country_code=?, phone=?, name=? WHERE id = ?', [country, country_code, phone, name, id], (_, updateResult) => {
              if (updateResult.rowsAffected === 1) {
                const updatedList = contacts.map(item => {
                  if (item.id === contact.id) { return { ...contact }; }
                  return item;
                });

                setContacts(updatedList);
                ToastAndroid.show(Translate('Toast.Contact.Updated'), ToastAndroid.LONG);
                resolve(updateResult.rowsAffected > 0);
              } else { throw new Error(Translate('Toast.Contact.FailedToUpdate')); }
            });
          });
        } catch (err) {
          const error = err as Error;
          ToastAndroid.show(error.message, ToastAndroid.LONG);
          reject(error.message);
        }
      });
    },
    [contacts, Translate],
  );

  const removeContact = useCallback(
    async (contact: IContact): Promise<boolean> => {
      return new Promise(async (resolve, reject) => {
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

        if (!confirm) { return false; }

        try {
          DataBase.db.transaction(tx => {
            tx.executeSql('DELETE FROM contacts WHERE id = ?', [contact.id], (_, deleteResult) => {
              if (deleteResult) {
                const filtered = contacts.filter(item => item.id !== contact.id);

                setContacts(filtered);
                ToastAndroid.show(Translate('Toast.Contact.Deleted'), ToastAndroid.LONG);
                resolve(deleteResult.rowsAffected > 0);
              } else { throw new Error(Translate('Toast.Contact.FailedToDelete')); }
            });
          });
        } catch (err) {
          const error = err as Error;
          ToastAndroid.show(error.message, ToastAndroid.LONG);
          reject(error.message);
        }

        return false;
      });
    },
    [contacts, Translate],
  );

  const deleteContacts = useCallback((contactsToDelete: IContact[]): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      const confirm = await AlertAsync(
        Translate('Alerts.Warning'),
        Translate('Confirm.Contact.DeleteSelected'),
        [
          { text: Translate('Confirm.Option.No'), onPress: () => false },
          { text: Translate('Confirm.Option.YesIWant'), onPress: () => true },
        ],
        {
          cancelable: true,
          onDismiss: () => false,
        },
      );

      if (!confirm) { return false; }

      const idsToDelete = contactsToDelete.map(contact => contact.id);
      const placeholders = idsToDelete.map(() => '?').join(',');

      try {
        DataBase.db.transaction(tx => {
          tx.executeSql(`DELETE FROM contacts WHERE id IN (${placeholders})`, idsToDelete, (_, deleteResult) => {
            if (deleteResult) {
              const filtered = contacts.filter(item => !idsToDelete.includes(item.id));
              setContacts(filtered);
              ToastAndroid.show(Translate('Toast.Contact.SelectedsDeleted'), ToastAndroid.LONG);
              resolve(deleteResult.rowsAffected > 0);
            } else { throw new Error(Translate('Toast.Contact.FailedToDelete')); }
          });
        });
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        reject(error.message);
      }

      return false;
    });
  }, [Translate, contacts]);

  const clearContacts = useCallback(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const confirm = await AlertAsync(
          Translate('Alerts.DangerousAction'),
          Translate('Confirm.Contact.ClearAll'),
          [
            { text: Translate('Confirm.Option.No'), onPress: () => false },
            {
              text: Translate('Confirm.Option.YesClearHistory'),
              onPress: () => true,
            },
          ],
          {
            cancelable: true,
            onDismiss: () => false,
          },
        );

        if (!confirm) { return false; }

        DataBase.db.transaction(tx => {
          tx.executeSql('DELETE FROM contacts', [], (_, result) => {
            if (result.rowsAffected > 0) {
              setContacts([]);
              ToastAndroid.show(Translate('Toast.Contact.HistoryCleared'), ToastAndroid.LONG);
              resolve(true);
            } else { throw new Error(Translate('Toast.Contact.FailedToClearAll')); }
          });
        });
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        reject(error.message);
      }
    });
  }, [Translate]);

  const findContactByCountryCodeAndPhoneNumber = useCallback(({ countryCode, phoneNumber }: FindContactByCountryCodeAndPhoneNumberParams): Promise<IContact[]> => {
    return new Promise((resolve, reject) => {
      try {
        DataBase.db.transaction(tx => {
          tx.executeSql('SELECT * FROM contacts WHERE country_code=? AND phone=?', [countryCode, phoneNumber], (_, result) => {
            resolve(result.rows.raw());
          });
        });
      } catch (err) {
        const error = err as Error;
        ToastAndroid.show(error.message, ToastAndroid.LONG);
        reject(error.message);
      }
    });
  }, []);

  const openWhatsApp = useCallback(
    async (phone: string) => {
      phone = phone.replace('+', '');

      const whatsappURL = `whatsapp://send?&phone=${phone}`;
      const supported = await Linking.canOpenURL(whatsappURL);

      if (supported) {
        ToastAndroid.show(Translate('Toast.OpeningWhatsApp'), ToastAndroid.LONG);
        Linking.openURL(whatsappURL);
      } else {
        Alert.alert(Translate('Alerts.Error'), Translate('Alerts.WhatsAppCantHandleURL'));
      }
    },
    [Translate],
  );

  useEffect(() => {
    async function loadContacts(): Promise<void> {
      DataBase.db.transaction(tx => {
        tx.executeSql('SELECT * FROM contacts', [], (_, result) => {
          setContacts(result.rows.raw().reverse());
          setLoading(false);
        });
      });
    }

    setLoading(true);
    loadContacts();
  }, []);

  const value = useMemo(
    () => ({
      addContact,
      editContact,
      removeContact,
      deleteContacts,
      contacts,
      loading,
      openWhatsApp,
      clearContacts,
      findContactByCountryCodeAndPhoneNumber,
    }),
    [addContact, editContact, removeContact, deleteContacts, contacts, loading, openWhatsApp, clearContacts, findContactByCountryCodeAndPhoneNumber],
  );

  return <ContactContext.Provider value={value}>{children}</ContactContext.Provider>;
};

function useContact(): ContactContext {
  const context = useContext(ContactContext);

  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }

  return context;
}

export { ContactProvider, useContact };
