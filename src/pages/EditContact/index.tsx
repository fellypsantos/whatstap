import React, { useCallback, useState } from 'react';

import { useContact } from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';
import ButtonContainer from '../../components/Button';
import PhoneNumberTextInput from '../../components/PhoneNumberInput';
import TextField from '../../components/TextField';
import IContact from '../../interfaces/IContact';
import AppMargin from '../../components/AppMargin';
import { ScrollView } from 'react-native';
import { useAppTranslation } from '../../hooks/translation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/Stack';

type PageProps = NativeStackScreenProps<RootStackParamList, 'EditContact'>;

const EditContact: React.FC<PageProps> = ({ navigation, route }) => {
  const { editContact } = useContact();
  const { Translate } = useAppTranslation();

  const [contact, setContact] = useState<IContact>({ ...route.params.contact });
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleEdit = useCallback(
    async (contactEdit: IContact) => {
      const updated = await editContact(contactEdit);
      if (updated) navigation.goBack();
    },
    [editContact, navigation],
  );

  return (
    <AppStructure
      sectionName={Translate('addContact')}
      headerMenuOptions={{
        icon: 'trash',
        onPress: () => navigation.goBack(),
      }}>
      <ScrollView>
        <AppMargin>
          <>
            <PhoneNumberTextInput
              countryCode={contact.country_code}
              phoneNumber={contact.phone}
              show={showCountryPicker}
              handleOpenCountryPicker={() => setShowCountryPicker(true)}
              handleCloseCountryPicker={() => setShowCountryPicker(false)}
              onChangeCountryCode={country => {
                setContact({
                  ...contact,
                  country_code: country.dialCode,
                  country: country.name,
                });
              }}
              onChangePhoneNumber={text =>
                setContact({ ...contact, phone: text })
              }
            />

            <TextField
              icon="id-card"
              label={Translate('identifier')}
              value={contact.name}
              placeholder={Translate('optionalName')}
              onChangeText={text => setContact({ ...contact, name: text })}
            />

            <ButtonContainer
              text={Translate('editContact')}
              type="default"
              onPress={() => handleEdit(contact)}
            />

            <ButtonContainer
              text={Translate('cancel')}
              type="cancel"
              onPress={() => navigation.goBack()}
            />
          </>
        </AppMargin>
      </ScrollView>
    </AppStructure>
  );
};

export default EditContact;
