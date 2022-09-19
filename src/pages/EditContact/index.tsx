import React, { useCallback, useState } from 'react';

import { useContact } from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';
import ButtonContainer from '../../components/Button';
import TextField from '../../components/TextField';
import IContact from '../../interfaces/IContact';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/Stack';
import AppMargin from '../../components/AppMargin';
import { ScrollView } from 'react-native';
import { useAppTranslation } from '../../hooks/translation';

type PageProps = NativeStackScreenProps<RootStackParamList, 'EditContact'>;

const EditContact: React.FC<PageProps> = ({ navigation, route }) => {
  const [contact, setContact] = useState({ ...route.params.contact });
  const { removeContact, editContact } = useContact();
  const { Translate } = useAppTranslation();

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
      sectionName={Translate('editContact')}
      headerMenuOptions={{
        icon: 'trash',
        onPress: handleDelete,
      }}>
      <ScrollView>
        <AppMargin>
          <>
            <TextField
              editable={false}
              icon="lock"
              label={Translate('phoneNumberNotEditable')}
              value={contact.phone}
              onChangeText={() => null}
            />

            <TextField
              icon="id-card"
              label={Translate('identifier')}
              value={contact.name}
              placeholder={Translate('optionalName')}
              onChangeText={text => setContact({ ...contact, name: text })}
            />

            <ButtonContainer
              text={Translate('save')}
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
