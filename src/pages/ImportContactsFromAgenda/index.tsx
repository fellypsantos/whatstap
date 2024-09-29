import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import Contacts from 'react-native-contacts';
import uuid from 'react-native-uuid';
import { PermissionsAndroid } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import { Container, BottomButtonContainer, SelectableContactDisplayName, SelectableContactToImport, SelectableContactToImportView, ToggleSelectAllContacts, SelectedCountryItemFromContactsToImport, SelectedCountryItemFromContactsToImportLabel } from './styles';
import ButtonComponent from '../../components/Button';
import { Contact } from 'react-native-contacts/type';
import { convertContactToContactImportItem, removeCountryCodeFromPhoneNumber, sanitizePhoneNumber, sortContactsAZ } from './services/contactImportService';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAppTranslation } from '../../hooks/translation';
import { useNavigation } from '@react-navigation/core';
import { useSettings } from '../../hooks/settings';
import { CountryItem, CountryPicker } from 'react-native-country-codes-picker';
import { useContact } from '../../hooks/contact';
import { sleep } from '../../utils/helper';

export type ContactImportItemType = Contact & {
  selected: boolean;
}

export default function ImportContactsFromAgenda() {
  const { Translate } = useAppTranslation();
  const { settings } = useSettings();
  const { contacts, addContact, findContactByCountryCodeAndPhoneNumber } = useContact();
  const navigation = useNavigation();

  console.log('contacts', contacts.length);

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [allContactsChecked, setAllContactsChecked] = useState(false);
  const [contactsFromAgenda, setContactsFromAgenda] = useState<ContactImportItemType[]>([]);
  const [selectedCountryForContacts, setSelectedCountryForContacts] = useState<CountryItem | null>(null);
  const [isImportingContacts, setIsImportingContacts] = useState(false);

  const manuallyAllowReadContactsMessage = useCallback(() => {
    Alert.alert(Translate('Alerts.PermissionDenied'), Translate('Alerts.AlowContactAccessFromAppSettings'), [
      { text: Translate('cancel'), style: 'cancel' },
      { text: Translate('openSettings'), onPress: () => Linking.openSettings() },
    ]);
  }, [Translate]);

  const handleReadContactsFromAgenda = useCallback(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: Translate('Permission.ReadContacts.Title'),
      message: Translate('Permission.ReadContacts.ActionDescription'),
      buttonPositive: Translate('Buttons.Allow'),
    })
      .then(res => {
        if (res === 'never_ask_again') {
          manuallyAllowReadContactsMessage();
          return;
        }

        if (res === 'granted') {
          Contacts.getAll()
            .then((contacts: Contact[]) => {
              const sortedContactsAZ = sortContactsAZ(contacts);
              const contactsImportList = convertContactToContactImportItem(sortedContactsAZ);
              setContactsFromAgenda(contactsImportList);
            })
            .catch(e => {
              console.log(e);
            });
        }
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  }, [Translate, manuallyAllowReadContactsMessage]);

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

  const handleProcessSelectedContacts = useCallback(async () => {

    if (!selectedCountryForContacts) { return; }

    const selectedContacts = contactsFromAgenda.filter((contact) => contact.selected);

    setIsImportingContacts(true);

    for (const contact of selectedContacts) {
      if (contact.phoneNumbers.length === 0) { continue; }

      const phoneNumberWithPlusSign = contact.phoneNumbers.find(phone => phone.number.includes('+'));

      let targetPhoneNumber = null;
      const firstPhoneNumberOnList = contact.phoneNumbers[0].number;

      targetPhoneNumber = phoneNumberWithPlusSign
        ? removeCountryCodeFromPhoneNumber(phoneNumberWithPlusSign.number, selectedCountryForContacts.dial_code)
        : firstPhoneNumberOnList;

      if (!targetPhoneNumber) { continue; }

      const sanitizedPhoneNumber = sanitizePhoneNumber(targetPhoneNumber);

      const contactsFound = await findContactByCountryCodeAndPhoneNumber({
        countryCode: selectedCountryForContacts.dial_code,
        phoneNumber: sanitizedPhoneNumber,
      });

      const isDuplicated = contactsFound.length > 0;
      if (isDuplicated) { continue; }

      const contactData = {
        id: uuid.v4().toString(),
        name: contact.displayName,
        country_code: selectedCountryForContacts.dial_code,
        phone: sanitizedPhoneNumber,
        country: selectedCountryForContacts.name.en,
        createdAt: new Date(),
      };

      await sleep(100);
      addContact(contactData);
    }

    setIsImportingContacts(false);

  }, [addContact, contactsFromAgenda, findContactByCountryCodeAndPhoneNumber, selectedCountryForContacts]);


  const countSelectedContactsToImport = useMemo(() => {
    return contactsFromAgenda.reduce((accumulator, currentContact) => {
      return currentContact.selected ? accumulator + 1 : accumulator;
    }, 0);
  }, [contactsFromAgenda]);

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
          <ButtonComponent text={Translate('Buttons.ImportContacts.FromAgenda')} type="default" onPress={handleReadContactsFromAgenda} />
          <ButtonComponent text={Translate('Buttons.Back')} type="cancel" onPress={() => {
            navigation.goBack();
          }} />
        </Container>
      )}

      {contactsFromAgenda.length > 0 && (
        <React.Fragment>
          <FlatList data={contactsFromAgenda} keyExtractor={contact => contact.recordID} renderItem={renderContactListFromAgenda} />

          <React.Fragment>
            <CountryPicker
              lang={settings.language}
              show={showCountryPicker}
              inputPlaceholder={Translate('searchCountryName')}
              pickerButtonOnPress={(item) => {
                setSelectedCountryForContacts(item);
                setShowCountryPicker(false);
              }}
              onBackdropPress={() => setShowCountryPicker(false)}
              style={{
                modal: {
                  height: '75%',
                },
                textInput: {
                  height: 50,
                  borderRadius: 0,
                  color: '#333',
                },
                flag: {},
                dialCode: {
                  color: '#333',
                  fontWeight: 'bold',
                },
                countryName: {
                  color: '#333',
                },
              }}
            />

            <SelectedCountryItemFromContactsToImport onPress={() => setShowCountryPicker(true)}>
              {!selectedCountryForContacts && (
                <SelectedCountryItemFromContactsToImportLabel>Toque aqui e selecione um país.</SelectedCountryItemFromContactsToImportLabel>
              )}

              {selectedCountryForContacts && (
                <SelectedCountryItemFromContactsToImportLabel>País: {selectedCountryForContacts?.name[settings.language]}</SelectedCountryItemFromContactsToImportLabel>
              )}
            </SelectedCountryItemFromContactsToImport>
          </React.Fragment>

          <BottomButtonContainer>
            <ToggleSelectAllContacts onPress={handleToggleCheckAllContacts}>
              <Icon name={allContactsChecked ? 'square' : 'check-square'} color="#fff" size={18} />
            </ToggleSelectAllContacts>
            <ButtonComponent text={Translate('Buttons.ImportContacts.Selected')} type="default" onPress={handleProcessSelectedContacts} fillWidth disabled={countSelectedContactsToImport === 0 || !selectedCountryForContacts} />
          </BottomButtonContainer>
        </React.Fragment>
      )}
    </React.Fragment>

  );
}
