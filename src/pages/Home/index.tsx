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
  ContainerWithMargin,
  ButtonBottomContainer,
} from './styles';
import { ActivityIndicator, FlatList } from 'react-native';

import IContact from '../../interfaces/IContact';
import { useAppTranslation } from '../../hooks/translation';
import ButtonComponent from '../../components/Button';

const Home: React.FC = () => {
  const { Translate } = useAppTranslation();
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
    <AppStructure sectionName={Translate('contactHistory')} sectionMenuText={contacts.length > 0 ? Translate('clearContacts') : ''} sectionMenuOnPress={() => clearContacts()}>
      <React.Fragment>
        {loading && <ActivityIndicator />}

        {contacts.length === 0 && (
          <ContactCard>
            <NoContactsLabel>{Translate('noContactsYet')}</NoContactsLabel>

            <ContainerWithMargin>
              <ButtonComponent
                text={Translate('addContact')}
                type="default"
                onPress={() => {
                  navigation.navigate('AddContact');
                }}
              />
            </ContainerWithMargin>
          </ContactCard>
        )}

        {contacts.length > 0 && (
          <React.Fragment>
            <FlatList data={contacts} keyExtractor={item => item.id} renderItem={renderItem} />

            <ButtonBottomContainer>
              <ButtonComponent
                text={Translate('addContact')}
                type="default"
                onPress={() => {
                  navigation.navigate('AddContact');
                }}
              />
            </ButtonBottomContainer>
          </React.Fragment>
        )}
      </React.Fragment>
    </AppStructure>
  );
};

export default Home;
