import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Linking } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import { Container, BottomButtonContainer, SelectableContactDisplayName, SelectableContactToImport, SelectableContactToImportView, ToggleSelectAllContacts } from './styles';
import ButtonComponent from '../../components/Button';
import { Contact } from 'react-native-contacts/type';
import { convertContactToContactImportItem, sortContactsAZ } from './services/contactImportService';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAppTranslation } from '../../hooks/translation';
import { useNavigation } from '@react-navigation/core';

export type ContactImportItemType = Contact & {
  selected: boolean;
}

export default function ImportContactsFromAgenda() {
  const { Translate } = useAppTranslation();
  const navigation = useNavigation();

  const [allContactsChecked, setAllContactsChecked] = useState(false);
  const [contactsFromAgenda, setContactsFromAgenda] = useState<ContactImportItemType[]>([]);

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

  const handleProcessSelectedContacts = useCallback(() => {
    console.log('---- PREPARE TO IMPORT ----');

    contactsFromAgenda.filter((contact) => contact.selected).forEach(contact => {
      console.log('contact', contact.displayName, 'phone', contact.phoneNumbers);
    });

    console.log('---- DONE ----');
  }, [contactsFromAgenda]);

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

          <BottomButtonContainer>
            <ToggleSelectAllContacts onPress={handleToggleCheckAllContacts}>
              <Icon name={allContactsChecked ? 'square' : 'check-square'} color="#fff" size={18} />
            </ToggleSelectAllContacts>
            <ButtonComponent text={Translate('Buttons.ImportContacts.Selected')} type="default" onPress={handleProcessSelectedContacts} fillWidth disabled={countSelectedContactsToImport === 0} />
          </BottomButtonContainer>
        </React.Fragment>
      )}
    </React.Fragment>

  );
}
