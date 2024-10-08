import React, { useCallback, useMemo, useState } from 'react';
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
  ContactPhoneNumber,
  ContactMenuButton,
  ContactMenuButtonIcon,
  ContactName,
  NoContactsLabel,
  ContainerWithMargin,
  ButtonBottomContainer,
  BottomButtonContainer,
  ToggleSelectAllContacts,
  CheckBoxComponent,
} from './styles';
import { ActivityIndicator, FlatList } from 'react-native';

import IContact from '../../interfaces/IContact';
import { useAppTranslation } from '../../hooks/translation';
import ButtonComponent from '../../components/Button';
import SearchInput from '../../components/SearchInput';
import { isNumeric } from '../../utils/helper';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Home: React.FC = () => {
  const { Translate } = useAppTranslation();
  const { contacts, loading, openWhatsApp, removeContact, clearContacts, deleteContacts } = useContact();

  const [searchContent, setSearchContent] = useState<string>('');
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<IContact[]>([]);
  const [allContactsChecked, setAllContactsChecked] = useState(false);

  const navigation = useNavigation<StackNavigationProps>();

  const dropdownMenuContactItem = useMemo(
    () => ({
      indexes: { EDIT: 0, DELETE: 1 },
      options: [{ title: Translate('Dropdown.Edit') }, { title: Translate('Dropdown.Delete') }],
    }),
    [Translate],
  );

  const formattedPhoneNumber = useCallback((contact: IContact) => `${contact.country_code}${contact.phone}`, []);

  const handlePressMenuItem = useCallback(
    (contact: IContact, optionIndex: number) => {
      if (optionIndex === dropdownMenuContactItem.indexes.EDIT) { navigation.navigate('EditContact', { contact: contact }); }
      else if (optionIndex === dropdownMenuContactItem.indexes.DELETE) { removeContact(contact); }
    },
    [removeContact, dropdownMenuContactItem.indexes, navigation],
  );

  const handleFilterSearchContacts = useCallback(
    (contact: IContact) => {
      if (searchContent === '') { return contact; }

      if (isNumeric(searchContent)) {
        // search in phone number
        if (contact.phone.includes(searchContent)) {
          return contact;
        }
      }

      // search in contact name
      const normalizedName = contact.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normalizedSearchContent = searchContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (normalizedName.includes(normalizedSearchContent)) {
        return contact;
      }
    },
    [searchContent],
  );

  const handleEnableMultiContactSelection = useCallback((contact: IContact) => {
    setSelectedContacts([contact]);
    setIsSelectionMode(true);
  }, []);

  const handleDisableMultiContactSelection = useCallback(() => {
    setIsSelectionMode(false);
    setSelectedContacts([]);
  }, []);

  const isContactSelected = useCallback((item: IContact) => {
    return selectedContacts.find(contact => contact.id === item.id) != null;
  }, [selectedContacts]);

  const handlePressContactItem = useCallback((item: IContact) => {
    if (!isSelectionMode) {
      openWhatsApp(formattedPhoneNumber(item));
      return;
    }

    const contactFound = selectedContacts.find(contact => contact.id === item.id);

    if (contactFound) {
      const filteredSelectedContacts = selectedContacts.filter(contact => contact.id !== item.id);
      setSelectedContacts(filteredSelectedContacts);
      return;
    }

    setSelectedContacts([...selectedContacts, item]);
  }, [formattedPhoneNumber, isSelectionMode, openWhatsApp, selectedContacts]);

  const handleToggleCheckAllContacts = useCallback(() => {
    const updatedSelectedContacts = allContactsChecked ? [] : contacts;
    setSelectedContacts(updatedSelectedContacts);
    setAllContactsChecked(!allContactsChecked);
  }, [allContactsChecked, contacts]);

  const handleDeleteSelectedContacts = useCallback(() => {
    deleteContacts(selectedContacts);
  }, [deleteContacts, selectedContacts]);

  const renderItem = useCallback(
    ({ item }: { item: IContact }) => (
      <ContactCard key={item.id}>
        <ContactCardRow selected={isContactSelected(item)}>
          {isSelectionMode && (
            <CheckBoxComponent
              onChange={() => handlePressContactItem(item)}
              value={isContactSelected(item)}
              tintColors={{ true: '#5467FB' }}
            />
          )}

          <ContactCardTouchable
            onPress={() => handlePressContactItem(item)}
            onLongPress={() => handleEnableMultiContactSelection(item)}
            reduceMarginLeft={isSelectionMode}
          >
            <ContactName>{item.name || Translate('unamedContact')}</ContactName>

            <ContactLocationContainer>
              <ContactLocationIcon name="phone-alt" color="#5467FB" size={14} />
              <ContactPhoneNumber>{formattedPhoneNumber(item)}</ContactPhoneNumber>
            </ContactLocationContainer>
          </ContactCardTouchable>

          {!isSelectionMode && (
            <ContactMenuButton dropdownMenuMode actions={dropdownMenuContactItem.options} onPress={({ nativeEvent }) => handlePressMenuItem(item, nativeEvent.index)}>
              <ContactMenuButtonIcon name="ellipsis-v" color="#aaa" size={14} />
            </ContactMenuButton>
          )}
        </ContactCardRow>
      </ContactCard>
    ),
    [Translate, dropdownMenuContactItem.options, formattedPhoneNumber, handleEnableMultiContactSelection, handlePressContactItem, handlePressMenuItem, isContactSelected, isSelectionMode],
  );

  const contactListToRender = useMemo(() => {
    return contacts
      .sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      })
      .filter(handleFilterSearchContacts);
  }, [contacts, handleFilterSearchContacts]);

  return (
    <AppStructure hideSectionContainer={isSelectionMode} sectionName={Translate('contactHistory')} sectionMenuText={contacts.length > 0 ? Translate('clearContacts') : ''} sectionMenuOnPress={() => clearContacts()}>
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
            <SearchInput onSearchContentChange={setSearchContent} />

            {contactListToRender.length === 0 && (
              <ContactCard>
                <NoContactsLabel>{Translate('noContactsFound')}</NoContactsLabel>
              </ContactCard>
            )}

            <FlatList data={contactListToRender} keyExtractor={item => item.id} renderItem={renderItem} />

            <ButtonBottomContainer>
              {
                !isSelectionMode && (
                  <ButtonComponent
                    text={Translate('addContact')}
                    type="default"
                    onPress={async () => {
                      navigation.navigate('AddContact');
                    }}
                  />
                )
              }

              {isSelectionMode && (
                <React.Fragment>
                  <BottomButtonContainer>
                    <ToggleSelectAllContacts onPress={handleToggleCheckAllContacts}>
                      <Icon name={allContactsChecked ? 'square' : 'check-square'} color="#fff" size={18} />
                    </ToggleSelectAllContacts>

                    <ButtonComponent
                      text={Translate('cancel')}
                      type="cancel"
                      onPress={handleDisableMultiContactSelection}
                    />

                    <ButtonComponent
                      marginLeft
                      fillWidth fillBackground
                      text={Translate('DeleteSelected')}
                      type="cancel"
                      onPress={handleDeleteSelectedContacts}
                    />
                  </BottomButtonContainer>
                </React.Fragment>
              )}
            </ButtonBottomContainer>
          </React.Fragment>
        )}
      </React.Fragment>
    </AppStructure>
  );
};

export default Home;
