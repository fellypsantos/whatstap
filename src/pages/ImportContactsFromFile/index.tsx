import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, ToastAndroid } from 'react-native';
import uuid from 'react-native-uuid';
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import { Container, BottomButtonContainer, SelectableContactDisplayName, SelectableContactToImport, SelectableContactToImportView, ToggleSelectAllContacts, LoadingProgressContainer, LoadingProgressText, TopWarningText, Column, ModalImagesContainer, ModalImageTitle, ModalImagesContainerScrollView, ModalCloseButton, DescriptionText } from './styles';
import ButtonComponent from '../../components/Button';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAppTranslation } from '../../hooks/translation';
import { useNavigation } from '@react-navigation/core';
import { TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import DocumentPicker, { } from 'react-native-document-picker';
import RNFS from 'react-native-fs';

import { useContact } from '../../hooks/contact';
import { useDataProcessor } from './hooks/useDataProcessor';
import { Alert } from 'react-native';

import SampleJsonImage from '../../assets/images/contact-file-sample/sample-json.png';
import SampleCsvImage from '../../assets/images/contact-file-sample/sample-csv.png';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

export type ContactItemFromFile = {
    id: string;
    name: string;
    country_code: string;
    phone: string;
}

export type ContactImportItemFromFile = ContactItemFromFile & {
    selected: boolean;
}

export default function ImportContactsFromFile() {
    const { Translate } = useAppTranslation();
    const { addContact, findContactByCountryCodeAndPhoneNumber } = useContact();
    const { processContactsFromFile } = useDataProcessor(Translate);
    const navigation = useNavigation();

    const [allContactsChecked, setAllContactsChecked] = useState(false);
    const [contactsFromFile, setContactsFromFile] = useState<ContactImportItemFromFile[]>([]);
    const [isImportingContacts, setIsImportingContacts] = useState(false);
    const [processedContactsCount, setProcessedContactsCount] = useState<number>(0);

    const [showModal, setShowModal] = useState(false);
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
                const responseAfterCSV = processContactsFromFile(content, 'csv');
                setContactsFromFile(responseAfterCSV);
                return;
            }

            if (name?.includes('.json')) {
                const responseAfterJSON = processContactsFromFile(content, 'json');
                setContactsFromFile(responseAfterJSON);
                return;
            }

        } catch (err) {
            const error = err as Error;
            Alert.alert('Ops!', error.message, [{ text: 'OK', style: 'default' }]);
            ToastAndroid.show(error.message, ToastAndroid.LONG);
        }
    }, [processContactsFromFile]);

    const handleToggleCheckContact = useCallback((contactToToggleChecState: ContactImportItemFromFile) => {
        const updatedContactList = contactsFromFile.map(contact => {
            if (contact.id === contactToToggleChecState.id) { return { ...contact, selected: !contact.selected }; }
            return contact;
        });

        setContactsFromFile(updatedContactList);
    }, [contactsFromFile]);

    const handleToggleCheckAllContacts = useCallback(() => {
        const contactListToggledState = contactsFromFile.map(contact => ({ ...contact, selected: !allContactsChecked }));
        setAllContactsChecked(!allContactsChecked);
        setContactsFromFile(contactListToggledState);
    }, [allContactsChecked, contactsFromFile]);

    const selectedContacts = useMemo(() => contactsFromFile.filter((contact) => contact.selected), [contactsFromFile]);

    const handleProcessSelectedContacts = useCallback(async () => {
        setIsImportingContacts(true);

        for (const contact of selectedContacts) {
            const contactsFound = await findContactByCountryCodeAndPhoneNumber({
                countryCode: contact.country_code,
                phoneNumber: contact.phone,
            });

            const isDuplicated = contactsFound.length > 0;
            if (isDuplicated) { continue; }

            const contactData = {
                id: uuid.v4().toString(),
                name: contact.name,
                country_code: contact.country_code,
                phone: contact.phone,
                country: '',
                createdAt: new Date(),
            };

            addContact(contactData);
            setProcessedContactsCount((prevState) => prevState + 1);
        }

        setIsImportingContacts(false);

        if (adLoaded) { interstitial.show(); }

        ToastAndroid.show(Translate('Toast.Contact.Imported'), ToastAndroid.SHORT);

        if (!adLoaded) { navigation.goBack(); }

    }, [Translate, adLoaded, addContact, findContactByCountryCodeAndPhoneNumber, navigation, selectedContacts]);

    const countSelectedContactsToImport = useMemo(() => {
        return contactsFromFile.reduce((accumulator, currentContact) => {
            return currentContact.selected ? accumulator + 1 : accumulator;
        }, 0);
    }, [contactsFromFile]);

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
        ({ item }: { item: ContactImportItemFromFile }) => (
            <SelectableContactToImport
                key={item.id}
                enabled={!isImportingContacts}
                onPress={() => {
                    handleToggleCheckContact(item);
                }}>
                <SelectableContactToImportView>
                    <CheckBox value={item.selected} tintColors={{ true: '#5467FB' }} />
                    <SelectableContactDisplayName>{item.name}</SelectableContactDisplayName>
                </SelectableContactToImportView>
            </SelectableContactToImport>
        ),
        [handleToggleCheckContact, isImportingContacts],
    );

    return (
        <React.Fragment>
            <Modal visible={showModal} animationType="fade">
                <ModalImagesContainerScrollView>

                    <ModalCloseButton onPress={() => setShowModal(false)}>
                        <Icon name="times" color="#fff" size={16} />
                    </ModalCloseButton>

                    <ModalImagesContainer>
                        <ModalImageTitle>JSON</ModalImageTitle>
                        <Image source={SampleJsonImage} resizeMode="contain" />
                    </ModalImagesContainer>

                    <ModalImagesContainer>
                        <ModalImageTitle>CSV</ModalImageTitle>
                        <Image source={SampleCsvImage} />
                    </ModalImagesContainer>
                </ModalImagesContainerScrollView>
            </Modal>

            {contactsFromFile.length === 0 && (
                <Container>
                    <DescriptionText>{Translate('ImportContactsFromFileDescription')}</DescriptionText>

                    <Column>
                        <ButtonComponent text={Translate('ContactFileExample')} type="default" onPress={() => {
                            setShowModal(true);
                        }} />
                    </Column>

                    <Column>
                        <ButtonComponent text={Translate('SelectFile')} type="default" onPress={handleReadContactsFromFile} />
                        <ButtonComponent text={Translate('Buttons.Back')} type="cancel" marginLeft onPress={() => {
                            navigation.goBack();
                        }} />
                    </Column>
                </Container>
            )}

            {contactsFromFile.length > 0 && (
                <React.Fragment>
                    <TopWarningText>{Translate('AlreadyStoredPhoneNumbersWillBeIgnored')}</TopWarningText>
                    <FlatList data={contactsFromFile} keyExtractor={contact => contact.id} renderItem={renderContactListFromAgenda} />

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
