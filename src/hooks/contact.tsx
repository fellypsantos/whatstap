import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import IContact from '../interfaces/IContact';

interface ContactContext {
  contacts: IContact[];
  addContact(contact: IContact): void;
  removeContact(contact: IContact): void;
}

interface ContactProviderProps {
  children: React.ReactNode;
}

const ContactContext = createContext<ContactContext | null>(null);

const ContactProvider: React.FC<ContactProviderProps> = ({children}) => {
  const [contacts, setContacts] = useState<IContact[]>([]);

  useEffect(() => {
    async function loadContacts(): Promise<void> {
      const arrContacts = null;
      if (arrContacts) {
        console.log('loaded contacts', arrContacts);
        setContacts(JSON.parse(arrContacts));
      }
    }

    loadContacts();
  }, []);

  const addContact = useCallback(
    async (contact: IContact) => {
      setContacts([contact, ...contacts]);
      // await AsyncStorage.setItem('contacts', JSON.stringify(contacts));
    },
    [contacts],
  );

  const removeContact = useCallback(
    async (contact: IContact) => {
      const filtered = contacts.filter(
        contactItem => contactItem.id !== contact.id,
      );

      setContacts(filtered);
      await AsyncStorage.setItem('contacts', JSON.stringify(filtered));
    },
    [contacts],
  );

  const value = useMemo(
    () => ({addContact, removeContact, contacts}),
    [addContact, removeContact, contacts],
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
