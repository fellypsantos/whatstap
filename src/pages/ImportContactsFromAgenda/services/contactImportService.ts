import { Contact } from 'react-native-contacts/type';
import { ContactImportItemType } from '..';

export const convertContactToContactImportItem = (contacts: Contact[], defaultSelectedState: boolean = false): ContactImportItemType[] => {
    return contacts.map<ContactImportItemType>(contact => ({ ...contact, selected: defaultSelectedState }));
};

export const sortContactsAZ = (contacts: Contact[]): Contact[] => {
    return contacts.sort((a, b) => {
        const nameA = a.displayName?.toLowerCase();
        const nameB = b.displayName?.toLowerCase();

        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
};

export const filterValidContacts = (contacts: Contact[]): Contact[] => {
    return contacts.filter(contact => contact.phoneNumbers.length > 0);
};

export const sanitizePhoneNumber = (phoneNumber: string) => {
    return phoneNumber.replace(/[\s|-]/g, '');
};

export const removeCountryCodeFromPhoneNumber = (phoneNumber: string, countryCode: string): string => {
    return phoneNumber.replace(countryCode, '');
};
