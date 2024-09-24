import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/core';

import { StackNavigationProps } from '../../routes/Stack';
import { useContact } from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';

import {
  ContactCard,
  ContactCardTouchable,
  ContactCardRow,
  ContactLocationContainer,
  ContactLocationIcon,
  ContactLocationName,
  ContactMenuButton,
  ContactMenuButtonIcon,
  ContactName,
  NoContactsLabel,
} from './styles';
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
      <ContactCardRow>
        <ContactCardTouchable onPress={() => openWhatsApp(formattedPhoneNumber(item))}>
          <ContactName>{item.name || Translate('unamedContact')}</ContactName>

          <ContactLocationContainer>
            <ContactLocationIcon name="phone-alt" color="#5467FB" size={14} />
            <ContactLocationName>{formattedPhoneNumber(item)}</ContactLocationName>
          </ContactLocationContainer>
        </ContactCardTouchable>

        <ContactMenuButton dropdownMenuMode actions={dropdown.options} onPress={({ nativeEvent }) => handlePressMenuItem(item, nativeEvent.index)}>
          <ContactMenuButtonIcon name="ellipsis-v" color="#aaa" size={14} />
        </ContactMenuButton>
      </ContactCardRow>
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
          <ContactCard>
            <NoContactsLabel>{Translate('noContactsYet')}</NoContactsLabel>
          </ContactCard>
        ) : (
          <FlatList data={contacts} keyExtractor={item => item.id} renderItem={renderItem} />
        )}
      </>
    </AppStructure>
  );
};

export default Home;
