import {useNavigation} from '@react-navigation/core';
import React, {useCallback, useState} from 'react';
import {Linking} from 'react-native';
import uuid from 'react-native-uuid';
import {} from 'react-native-phone-number-input';

import {useContact} from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';
import ButtonContainer from '../../components/Button';
import CheckboxField from '../../components/CheckboxField';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import TextField from '../../components/TextField';
import IContact from '../../interfaces/IContact';

const AddNumber: React.FC = () => {
  const navigation = useNavigation();
  const [openWhatsApp, setOpenWhatsApp] = useState(false);
  const {addContact} = useContact();

  const [contact, setContact] = useState<IContact>(() => ({
    id: uuid.v4().toString(),
    name: '',
    number: '',
    country: 'Brazil',
    createdAt: new Date(),
  }));

  const handleAddContact = useCallback(() => {
    addContact({
      ...contact,
      createdAt: new Date(),
    });

    if (openWhatsApp) {
      Linking.openURL(`whatsapp://send?&phone=${contact.number}`);
    }

    navigation.goBack();
  }, [contact, addContact, openWhatsApp, navigation]);

  return (
    <AppStructure
      sectionName="Add Number"
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
          onChangeFormattedText={text => setContact({...contact, number: text})}
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
          isChecked={openWhatsApp}
          text="Start this chat when save"
          onPress={isChecked => setOpenWhatsApp(isChecked)}
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

export default AddNumber;
