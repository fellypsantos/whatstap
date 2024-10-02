import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ToastAndroid } from 'react-native';
import uuid from 'react-native-uuid';
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import { Container, BottomButtonContainer, SelectableContactDisplayName, SelectableContactToImport, SelectableContactToImportView, ToggleSelectAllContacts, SelectedCountryItemFromContactsToImport, SelectedCountryItemFromContactsToImportLabel, LoadingProgressContainer, LoadingProgressText, TopWarningText } from './styles';
import ButtonComponent from '../../components/Button';
import { Contact } from 'react-native-contacts/type';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAppTranslation } from '../../hooks/translation';
import { useNavigation } from '@react-navigation/core';
import { TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import DocumentPicker, { } from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import { useContact } from '../../hooks/contact';
import { useDataProcessor } from './hooks/useDataProcessor';
import { Alert } from 'react-native';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);


export type ContactImportItemType = Contact & {
    selected: boolean;
}

export default function ImportContactsFromFile() {
    const { Translate } = useAppTranslation();
    const { addContact, findContactByCountryCodeAndPhoneNumber } = useContact();
    const { processContactsFromFile } = useDataProcessor();
    const navigation = useNavigation();

    const [allContactsChecked, setAllContactsChecked] = useState(false);
    const [contactsFromAgenda, setContactsFromAgenda] = useState<ContactImportItemType[]>([]);
    const [isImportingContacts, setIsImportingContacts] = useState(false);
    const [processedContactsCount, setProcessedContactsCount] = useState<number>(0);

    const [adLoaded, setAdLoaded] = useState(false);
    const [adClosed, setAdClosed] = useState(false);

    const handleReadContactsFromFile = useCallback(async () => {
        try {
            const [result] = await DocumentPicker.pick({
                mode: 'open',
                type: [DocumentPicker.types.json, DocumentPicker.types.csv, 'text/comma-separated-values'],
            });

            const { name, uri } = result;
            const content = await RNFS.readFile(uri, 'utf8');

            if (name?.includes('.csv')) {
                processContactsFromFile(content, 'csv');
                return;
            }

            if (name?.includes('.json')) {
                processContactsFromFile(content, 'json');
                return;
            }

        } catch (err) {
            const error = err as Error;
            Alert.alert('Ops!', error.message, [{ text: 'OK', style: 'default' }]);
        }
    }, [processContactsFromFile]);

    const handleToggleCheckContact = useCallback((contactToToggleChecState: ContactImportItemType) => {
        const updatedContactList = contactsFromAgenda.map(contact => {
            if (contact.recordID === contactToToggleChecState.recordID) { return { ...contact, selected: !contact.selected }; }
            return contact;
        });

        setContactsFromAgenda(updatedContactList);
    }, [contactsFromAgenda]);

    const handleToggleCheckAllContacts = useCallback(() => {
        const contactListToggledState = contactsFromAgenda.map(contact => ({ ...contact, selected: !allContactsChecked }));
        setAllContactsChecked(!allContactsChecked);
        setContactsFromAgenda(contactListToggledState);
    }, [allContactsChecked, contactsFromAgenda]);

    const selectedContacts = useMemo(() => contactsFromAgenda.filter((contact) => contact.selected), [contactsFromAgenda]);

    const handleProcessSelectedContacts = useCallback(async () => {

        // todo

    }, []);

    const countSelectedContactsToImport = useMemo(() => {
        return contactsFromAgenda.reduce((accumulator, currentContact) => {
            return currentContact.selected ? accumulator + 1 : accumulator;
        }, 0);
    }, [contactsFromAgenda]);

    useEffect(() => {
        const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => setAdLoaded(true));
        const unsubscribeClose = interstitial.addAdEventListener(AdEventType.CLOSED, () => setAdClosed(true));

        if (!adLoaded) {
            interstitial.load();
            if (__DEV__) { console.log('Requesting ad to AdMob Network'); }
        }

        // Unsubscribe from events on unmount
        return () => {
            unsubscribeLoaded();
            unsubscribeClose();
        };
    }, [adLoaded]);

    // HANDLE AD_CLOSE
    useEffect(() => {
        if (adLoaded && adClosed) {
            if (__DEV__) { console.log('Ad was closed by user'); }
            navigation.goBack();
        }
    }, [adLoaded, adClosed, navigation]);

    const renderContactListFromAgenda = useCallback(
        ({ item }: { item: ContactImportItemType }) => (
            <SelectableContactToImport
                key={item.recordID}
                onPress={() => {
                    handleToggleCheckContact(item);
                }}>
                <SelectableContactToImportView>
                    <CheckBox value={item.selected} tintColors={{ true: '#5467FB' }} />
                    <SelectableContactDisplayName>{item.displayName}</SelectableContactDisplayName>
                </SelectableContactToImportView>
            </SelectableContactToImport>
        ),
        [handleToggleCheckContact],
    );

    return (

        <React.Fragment>
            {contactsFromAgenda.length === 0 && (
                <Container>
                    <ButtonComponent text={'Selecionar arquivo'} type="default" onPress={handleReadContactsFromFile} />
                    <ButtonComponent text={Translate('Buttons.Back')} type="cancel" onPress={() => {
                        navigation.goBack();
                    }} />
                </Container>
            )}

            {contactsFromAgenda.length > 0 && (
                <React.Fragment>
                    <TopWarningText>{Translate('AlreadyStoredPhoneNumbersWillBeIgnored')}</TopWarningText>
                    <FlatList data={contactsFromAgenda} keyExtractor={contact => contact.recordID} renderItem={renderContactListFromAgenda} />

                    {isImportingContacts && (
                        <LoadingProgressContainer>
                            <ActivityIndicator color="#5467fb" size={25} />
                            <LoadingProgressText>{Translate('importingContacts')} {processedContactsCount}/{selectedContacts.length}</LoadingProgressText>
                        </LoadingProgressContainer>
                    )}

                    {
                        !isImportingContacts && (
                            <React.Fragment>
                                <BottomButtonContainer>
                                    <ToggleSelectAllContacts onPress={handleToggleCheckAllContacts}>
                                        <Icon name={allContactsChecked ? 'square' : 'check-square'} color="#fff" size={18} />
                                    </ToggleSelectAllContacts>
                                    <ButtonComponent text={Translate('Buttons.ImportContacts.Selected')} type="default" onPress={handleProcessSelectedContacts} fillWidth disabled={countSelectedContactsToImport === 0} />
                                </BottomButtonContainer>
                            </React.Fragment>
                        )
                    }
                </React.Fragment>
            )}
        </React.Fragment>

    );
}
