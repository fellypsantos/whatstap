import React, {useCallback, useMemo} from 'react';
import {useNavigation} from '@react-navigation/core';

import {StackNavigationProps} from '../../routes/Stack';
import {useContact} from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';

import {
  ContactCard,
  ContactCardHeader,
  ContactDateTime,
  ContactFooter,
  ContactLocationContainer,
  ContactLocationIcon,
  ContactLocationName,
  ContactMenuButton,
  ContactMenuButtonIcon,
  ContactMenuWhatsAppButton,
  ContactMenuWhatsAppButtonIcon,
  ContactName,
  ContactNumber,
  Divider,
} from './styles';
import {format} from 'date-fns';
import {pt} from 'date-fns/locale';
import {ActivityIndicator} from 'react-native';
import IContact from '../../interfaces/IContact';

const Home: React.FC = () => {
  const navigation = useNavigation<StackNavigationProps>();
  const {contacts, loading, openWhatsApp, removeContact} = useContact();

  const dropdown = useMemo(
    () => ({
      indexes: {EDIT: 0, DELETE: 1},
      options: [{title: 'Edit'}, {title: 'Delete'}],
    }),
    [],
  );

  const handlePressMenuItem = useCallback(
    (contact: IContact, optionIndex: number) => {
      if (optionIndex === dropdown.indexes.EDIT)
        navigation.navigate('EditContact', {contact: contact});
      else if (optionIndex === dropdown.indexes.DELETE) removeContact(contact);
    },
    [removeContact, dropdown.indexes, navigation],
  );

  return (
    <AppStructure
      sectionName="Contact History"
      headerMenuOptions={{
        icon: 'plus-circle',
        onPress: () => navigation.navigate('AddContact'),
      }}>
      <>
        {loading ? (
          <ActivityIndicator />
        ) : contacts.length === 0 ? (
          <ContactCard useGrayedLeftBorder>
            <ContactNumber>
              No contacts yet. Tap the + button to add you first contact.
            </ContactNumber>
          </ContactCard>
        ) : (
          contacts.map(contact => (
            <ContactCard key={contact.id}>
              <ContactCardHeader>
                <ContactNumber>{contact.phone}</ContactNumber>
                <ContactMenuButton
                  dropdownMenuMode
                  actions={dropdown.options}
                  onPress={({nativeEvent}) =>
                    handlePressMenuItem(contact, nativeEvent.index)
                  }>
                  <ContactMenuButtonIcon
                    name="ellipsis-v"
                    color="#aaa"
                    size={14}
                  />
                </ContactMenuButton>
              </ContactCardHeader>

              <ContactName>{contact.name || 'No name'}</ContactName>

              <ContactLocationContainer>
                <ContactLocationIcon
                  name="map-marker-alt"
                  color="#5467FB"
                  size={14}
                />
                <ContactLocationName>{contact.country}</ContactLocationName>
              </ContactLocationContainer>

              <Divider />

              <ContactFooter>
                <ContactDateTime>
                  {format(new Date(contact.createdAt), 'PPpp', {locale: pt})}
                </ContactDateTime>

                <ContactMenuWhatsAppButton
                  onPress={() => openWhatsApp(contact.phone)}>
                  <ContactMenuWhatsAppButtonIcon
                    name="whatsapp"
                    color="#fff"
                    size={14}
                  />
                </ContactMenuWhatsAppButton>
              </ContactFooter>
            </ContactCard>
          ))
        )}
      </>
    </AppStructure>
  );
};

export default Home;
