import React, { useCallback, useState } from 'react';
import { Alert, Linking } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import { Container, BottomButtonContainer, SelectableContactDisplayName, SelectableContactToImport, SelectableContactToImportView, ToggleSelectAllContacts } from './styles';
import ButtonComponent from '../../components/Button';
import { Contact } from 'react-native-contacts/type';
import { convertContactToContactImportItem } from './services/contactImportService';
import Icon from 'react-native-vector-icons/FontAwesome5';

export type ContactImportItemType = Contact & {
  selected: boolean;
}

export default function ImportContactsFromAgenda() {
  const [allContactsChecked, setAllContactsChecked] = useState(false);
  const [contactsFromAgenda, setContactsFromAgenda] = useState<ContactImportItemType[]>([]);

  const manuallyAllowReadContactsMessage = useCallback(() => {
    Alert.alert('Permission Denied', 'You need to allow contact access from the settings.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]);
  }, []);

  const handleReadContactsFromAgenda = useCallback(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Contacts',
      message: 'This app would like to view your contacts.',
      buttonPositive: 'Please accept bare mortal',
    })
      .then(res => {
        if (res === 'never_ask_again') {
          manuallyAllowReadContactsMessage();
          return;
        }

        if (res === 'granted') {
          Contacts.getAll()
            .then((contacts: Contact[]) => {
              const contactsImportList = convertContactToContactImportItem(contacts);
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
  }, [manuallyAllowReadContactsMessage]);

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

  const renderContactListFromAgenda = useCallback(
    ({ item }: { item: ContactImportItemType }) => (
      <SelectableContactToImport
        key={item.recordID}
        onPress={() => {
          handleToggleCheckContact(item);
        }}>
        <SelectableContactToImportView>
          <CheckBox disabled={false} value={item.selected} onValueChange={() => { }} tintColors={{ true: '#5467FB' }} />
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
          <ButtonComponent text="Importar da Agenda" type="default" onPress={handleReadContactsFromAgenda} />
          <ButtonComponent text="Voltar" type="cancel" onPress={handleReadContactsFromAgenda} />
        </Container>
      )}

      {contactsFromAgenda.length > 0 && (
        <React.Fragment>
          <FlatList data={contactsFromAgenda} keyExtractor={contact => contact.recordID} renderItem={renderContactListFromAgenda} />

          <BottomButtonContainer>
            <ToggleSelectAllContacts onPress={handleToggleCheckAllContacts}>
              <Icon name={allContactsChecked ? 'square' : 'check-square'} color="#fff" size={18} />
            </ToggleSelectAllContacts>
            <ButtonComponent text="Importar Selecionados" type="default" onPress={handleReadContactsFromAgenda} fillWidth disabled />
          </BottomButtonContainer>
        </React.Fragment>
      )}
    </React.Fragment>

  );
}
