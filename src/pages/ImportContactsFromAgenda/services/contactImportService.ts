import { Contact } from 'react-native-contacts/type';
import { ContactImportItemType } from '..';

export const convertContactToContactImportItem = (contacts: Contact[], defaultSelectedState: boolean = false): ContactImportItemType[] => {
    return contacts.map<ContactImportItemType>(contact => ({ ...contact, selected: defaultSelectedState }));
};
