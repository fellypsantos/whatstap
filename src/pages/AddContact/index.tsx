import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import uuid from 'react-native-uuid';

import {useContact} from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';
import ButtonContainer from '../../components/Button';
import CheckboxField from '../../components/CheckboxField';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import TextField from '../../components/TextField';
import IContact from '../../interfaces/IContact';

const AddContact: React.FC = () => {
  const navigation = useNavigation();
  const [openWhatsAppChecked, setOpenWhatsAppChecked] = useState(false);
  const {addContact, openWhatsApp} = useContact();

  const [contact, setContact] = useState<IContact>(() => ({
    id: uuid.v4().toString(),
    name: '',
    phone: '',
    country: 'Brazil',
    createdAt: new Date(),
  }));

  const handleAddContact = useCallback(() => {
    addContact({
      ...contact,
      createdAt: new Date(),
    });

    if (openWhatsAppChecked) openWhatsApp(contact.phone);

    navigation.goBack();
  }, [contact, addContact, openWhatsAppChecked, navigation, openWhatsApp]);

  return (
    <AppStructure
      sectionName="Add Contact"
      headerMenuOptions={{
        icon: 'trash',
        onPress: () => navigation.goBack(),
      }}>
      <>
        <PhoneNumberInput
          autoFocus
          defaultCode="BR"
          onChangeCountry={({name}) =>
            setContact({...contact, country: name.toString()})
          }
          onChangeFormattedText={text => setContact({...contact, phone: text})}
          placeholder="Type here"
        />

        <TextField
          icon="id-card"
          label="identifier"
          value={contact.name}
          placeholder="Optional name"
          onChangeText={text => setContact({...contact, name: text})}
        />

        <CheckboxField
          isChecked={openWhatsAppChecked}
          text="Start this chat when save"
          onPress={isChecked => setOpenWhatsAppChecked(isChecked)}
        />

        <ButtonContainer
          text="Save Phone Number"
          type="default"
          onPress={handleAddContact}
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

export default AddContact;
