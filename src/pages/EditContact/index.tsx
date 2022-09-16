import React, { useCallback, useState } from 'react';

import { useContact } from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';
import ButtonContainer from '../../components/Button';
import TextField from '../../components/TextField';
import IContact from '../../interfaces/IContact';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/Stack';

type PageProps = NativeStackScreenProps<RootStackParamList, 'EditContact'>;

const EditContact: React.FC<PageProps> = ({ navigation, route }) => {
  const [contact, setContact] = useState({ ...route.params.contact });
  const { removeContact, editContact } = useContact();

  const handleEdit = useCallback(
    async (contactEdit: IContact) => {
      const updated = await editContact(contactEdit);
      if (updated) navigation.goBack();
    },
    [editContact, navigation],
  );

  const handleDelete = useCallback(async () => {
    const result = await removeContact(contact);
    if (result) navigation.goBack();
  }, [contact, navigation, removeContact]);

  return (
    <AppStructure
      sectionName="Edit Contact"
      headerMenuOptions={{
        icon: 'trash',
        onPress: handleDelete,
      }}>
      <>
        <TextField
          editable={false}
          icon="lock"
          label="PHONE NUMBER NOT EDITABLE"
          value={contact.phone}
          onChangeText={() => null}
        />

        <TextField
          icon="id-card"
          label="identifier"
          value={contact.name}
          placeholder="Optional Name"
          onChangeText={text => setContact({ ...contact, name: text })}
        />

        <ButtonContainer
          text="Save"
          type="default"
          onPress={() => handleEdit(contact)}
        />

        <ButtonContainer
          text="Cancel"
          type="cancel"
          onPress={() => navigation.goBack()}
        />
      </>
    </AppStructure>
  );
};

export default EditContact;
