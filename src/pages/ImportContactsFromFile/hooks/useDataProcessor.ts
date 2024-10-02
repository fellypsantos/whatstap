import { useCallback } from 'react';
import { readString } from 'react-native-csv';

type FileType = 'json' | 'csv';

export const useDataProcessor = () => {
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

    const processJSON = useCallback((data: string): string => {
        const parsedContent = JSON.parse(data);
        console.log(parsedContent.length);
        return '';
    }, []);

    const processCSV = useCallback((data: string): string => {
        const response = readString(removeEmojis(data), {
            header: true,
            skipEmptyLines: true,
        });

        console.log(response.data.length);

        return '';
    }, []);



    const processContactsFromFile = useCallback((data: string, fileType: FileType): string => {
        if (fileType === 'csv') { return processCSV(data); }
        if (fileType === 'json') { return processJSON(data); }
        throw new Error('Unsupported file type');
    }, [processCSV, processJSON]);

    return { processContactsFromFile };
};


