import React, { useCallback, useState } from 'react';
import { Alert, Button, Linking, Text } from 'react-native';
import Contacts from 'react-native-contacts';
import { PermissionsAndroid } from 'react-native';
import { Contact } from 'react-native-contacts/type';
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import { SelectableContactDisplayName, SelectableContactToImport, SelectableContactToImportView } from './styles';

export default function ImportContactsFromAgenda() {
  const [contactsFromAgenda, setContactsFromAgenda] = useState<Contact[]>([]);

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
            .then(setContactsFromAgenda)
            .catch(e => {
              console.log(e);
            });
        }
      })
      .catch(error => {
        console.error('Permission error: ', error);
      });
  }, [manuallyAllowReadContactsMessage]);

  const renderContactListFromAgenda = useCallback(
    ({ item }: { item: Contact }) => (
      <SelectableContactToImport
        key={item.recordID}
        onPress={() => {
          // todo
        }}>
        <SelectableContactToImportView>
          <CheckBox disabled={false} value={true} onValueChange={() => { }} tintColors={{ true: '#5467FB' }} />
          <SelectableContactDisplayName>{item.displayName}</SelectableContactDisplayName>
        </SelectableContactToImportView>
      </SelectableContactToImport>
    ),
    [],
  );

  return (
    <React.Fragment>
      <Button onPress={handleReadContactsFromAgenda} title="sample" />

      <FlatList data={contactsFromAgenda} keyExtractor={contact => contact.recordID} renderItem={renderContactListFromAgenda} />
    </React.Fragment>
  );
}
