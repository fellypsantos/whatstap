import { useCallback } from 'react';
import { readString } from 'react-native-csv';
import { ContactImportItemFromFile, ContactItemFromFile } from '..';
import { TFunction } from 'i18next';
import uuid from 'react-native-uuid';

type FileType = 'json' | 'csv';

export const useDataProcessor = (Translate: TFunction) => {
    const removeEmojis = (text: string): string => {
        return text.replace(/[\u{1F600}-\u{1F64F}]/gu, '') // Emoticons
            .replace(/[\u{1F300}-\u{1F5FF}]/gu, '') // Miscellaneous Symbols and Pictographs
            .replace(/[\u{1F680}-\u{1F6FF}]/gu, '') // Transport and Map Symbols
            .replace(/[\u{1F700}-\u{1F77F}]/gu, '') // Alchemical Symbols
            .replace(/[\u{1F780}-\u{1F7FF}]/gu, '') // Geometric Shapes Extended
            .replace(/[\u{1F800}-\u{1F8FF}]/gu, '') // Supplemental Arrows-C
            .replace(/[\u{1F900}-\u{1F9FF}]/gu, '') // Supplemental Symbols and Pictographs
            .replace(/[\u{1FA00}-\u{1FA6F}]/gu, '') // Chess Symbols
            .replace(/[\u{1FA70}-\u{1FAFF}]/gu, '') // Symbols and Pictographs Extended-A
            .replace(/[\u{2600}-\u{26FF}]/gu, '')   // Miscellaneous Symbols
            .replace(/[\u{2700}-\u{27BF}]/gu, '');  // Dingbats
    };

    const isValidContact = useCallback((item: ContactItemFromFile) => {
        return (
            typeof item.name === 'string' &&
            typeof item.country_code === 'string' &&
            typeof item.phone === 'string'
        );
    }, []);

    const generateContactItemData = useCallback((item: ContactItemFromFile) => {
        return {
            selected: false,
            id: uuid.v4().toString(),
            name: item.name,
            country_code: item.country_code,
            phone: item.phone,
        };
    }, []);

    const validateContactListFromFile = useCallback((contactsFromFile: ContactItemFromFile[]) => {
        contactsFromFile.forEach((contactFromFile) => {
            const isValid = isValidContact(contactFromFile);
            if (!isValid) {
                throw new Error(`${Translate('ImportContactFromFileFailed')}: \n\n` + JSON.stringify(contactFromFile));
            }
        });
    }, [Translate, isValidContact]);

    const processJSON = useCallback((data: string): ContactImportItemFromFile[] => {
        const parsedContacts = JSON.parse(data);

        const contactImportList: ContactImportItemFromFile[] = parsedContacts.map((item: ContactItemFromFile): ContactImportItemFromFile => {
            return generateContactItemData(item);
        });

        validateContactListFromFile(contactImportList);

        return contactImportList;
    }, [generateContactItemData, validateContactListFromFile]);

    const processCSV = useCallback((data: string): ContactImportItemFromFile[] => {
        const response = readString(removeEmojis(data), {
            header: true,
            skipEmptyLines: true,
        });

        const importedContent = response.data as ContactItemFromFile[];

        const contactImportList: ContactImportItemFromFile[] = importedContent.map((item: ContactItemFromFile): ContactImportItemFromFile => {
            return generateContactItemData(item);
        });

        validateContactListFromFile(contactImportList);

        return contactImportList;
    }, [generateContactItemData, validateContactListFromFile]);

    const processContactsFromFile = useCallback((data: string, fileType: FileType): ContactImportItemFromFile[] => {
        if (fileType === 'csv') { return processCSV(data); }
        if (fileType === 'json') { return processJSON(data); }
        throw new Error('Unsupported file type');
    }, [processCSV, processJSON]);

    return { processContactsFromFile };
};


