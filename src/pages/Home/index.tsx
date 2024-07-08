import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/core';

import { StackNavigationProps } from '../../routes/Stack';
import { useContact } from '../../hooks/contact';
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
import { format } from 'date-fns';
import { ptBR as ptBR_DateTime, enUS as enUS_DateTime, es as es_DateTime } from 'date-fns/locale';
import { ActivityIndicator, FlatList } from 'react-native';

import IContact from '../../interfaces/IContact';
import { useAppTranslation } from '../../hooks/translation';

const Home: React.FC = () => {
  const { Translate, selectedLanguage } = useAppTranslation();
  const navigation = useNavigation<StackNavigationProps>();
  const { contacts, loading, openWhatsApp, removeContact, clearContacts } = useContact();

  const dropdown = useMemo(
    () => ({
      indexes: { EDIT: 0, DELETE: 1 },
      options: [{ title: Translate('Dropdown.Edit') }, { title: Translate('Dropdown.Delete') }],
    }),
    [Translate],
  );

  const formattedPhoneNumber = useCallback((contact: IContact) => `${contact.country_code}${contact.phone}`, []);

  const parseI18NextLocale = useCallback(() => {
    if (selectedLanguage === 'pt') return ptBR_DateTime;
    else if (selectedLanguage === 'es') return es_DateTime;
    else return enUS_DateTime;
  }, [selectedLanguage]);

  const handlePressMenuItem = useCallback(
    (contact: IContact, optionIndex: number) => {
      if (optionIndex === dropdown.indexes.EDIT) navigation.navigate('EditContact', { contact: contact });
      else if (optionIndex === dropdown.indexes.DELETE) removeContact(contact);
    },
    [removeContact, dropdown.indexes, navigation],
  );

  const renderItem = ({ item }: { item: IContact }) => (
    <ContactCard key={item.id}>
      <ContactCardHeader>
        <ContactNumber>{formattedPhoneNumber(item)}</ContactNumber>
        <ContactMenuButton dropdownMenuMode actions={dropdown.options} onPress={({ nativeEvent }) => handlePressMenuItem(item, nativeEvent.index)}>
          <ContactMenuButtonIcon name="ellipsis-v" color="#aaa" size={14} />
        </ContactMenuButton>
      </ContactCardHeader>

      <ContactName>{item.name || Translate('unamedContact')}</ContactName>

      <ContactLocationContainer>
        <ContactLocationIcon name="map-marker-alt" color="#5467FB" size={14} />
        <ContactLocationName>{item.country}</ContactLocationName>
      </ContactLocationContainer>

      <Divider />

      <ContactFooter>
        <ContactDateTime>
          {format(new Date(item.createdAt), 'PPpp', {
            locale: parseI18NextLocale(),
          })}
        </ContactDateTime>

        <ContactMenuWhatsAppButton onPress={() => openWhatsApp(formattedPhoneNumber(item))}>
          <ContactMenuWhatsAppButtonIcon name="whatsapp" color="#fff" size={14} />
        </ContactMenuWhatsAppButton>
      </ContactFooter>
    </ContactCard>
  );

  return (
    <AppStructure
      sectionName={Translate('contactHistory')}
      sectionMenuText={contacts.length > 0 ? Translate('clearContacts') : ''}
      sectionMenuOnPress={() => clearContacts()}
      headerMenuOptions={{
        icon: 'plus-circle',
        onPress: () => navigation.navigate('AddContact'),
      }}>
      <>
        {loading ? (
          <ActivityIndicator />
        ) : contacts.length === 0 ? (
          <ContactCard useGrayedLeftBorder>
            <ContactNumber>{Translate('noContactsYet')}</ContactNumber>
          </ContactCard>
        ) : (
          <FlatList data={contacts} keyExtractor={item => item.id} renderItem={renderItem} />
        )}
      </>
    </AppStructure>
  );
};

export default Home;
