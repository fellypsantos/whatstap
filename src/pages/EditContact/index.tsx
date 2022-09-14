import React, {useCallback, useState} from 'react';
import {Alert} from 'react-native';
import uuid from 'react-native-uuid';
import PhoneInput from 'react-native-phone-number-input';

import {useContact} from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';
import ButtonContainer from '../../components/Button';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import TextField from '../../components/TextField';
import IContact from '../../interfaces/IContact';
import {PageProps} from '../../routes/Stack';
import {RouteProp} from '@react-navigation/core';

interface EditContactProps extends PageProps {
  route: RouteProp<{params: {contact: IContact}}, 'params'>;
}

const EditContact: React.FC<EditContactProps> = ({navigation, route}) => {
  const [contact] = useState(route.params.contact);

  const handleEdit = useCallback((contactEdit: IContact) => {
    console.log('edit', contactEdit);
  }, []);

  return (
    <AppStructure
      sectionName="Edit Contact"
      headerMenuOptions={{
        icon: 'trash',
        onPress: () =>
          Alert.alert('NEED_IMPLEMENT', 'DELETAR CONTATO SENDO EDITADO'),
      }}>
      <>
        <PhoneNumberInput
          autoFocus
          defaultCode="BR"
          defaultValue={contact.phone}
          onChangeCountry={({name}) => null}
          onChangeFormattedText={text => null}
          placeholder="Type here"
        />

        <TextField
          icon="id-card"
          label="identifier"
          value={contact.name}
          placeholder="Optional name"
          onChangeText={text => null}
        />

        <ButtonContainer
          text="Save Changes"
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
