import React, {useCallback} from 'react';
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
import {format, formatRelative, subDays} from 'date-fns';
import {pt} from 'date-fns/locale';

const DropDownOptions = {
  edit: 0,
  delete: 1,
};

const Home: React.FC = () => {
  const navigation = useNavigation<StackNavigationProps>();
  const {contacts} = useContact();

  const handlePressMenuOption = useCallback((itemIndex: number) => {
    // if (itemIndex === DropDownOptions.edit) handleEdit()
  }, []);

  const eraseAsyncStorageData = useCallback(async () => {
    console.log('ALL CLEAR');
  }, []);

  return (
    <AppStructure
      sectionName="Contact History"
      headerMenuOptions={{
        icon: 'plus-circle',
        onPress: () => navigation.navigate('AddNumber'),
      }}>
      <>
        {contacts.length === 0 ? (
          <ContactCard useGrayedLeftBorder>
            <ContactNumber>
              No contacts yet. Tap the + button to add you first contact.
            </ContactNumber>
          </ContactCard>
        ) : (
          contacts.map(contact => (
            <ContactCard key={contact.id}>
              <ContactCardHeader>
                <ContactNumber>{contact.number}</ContactNumber>
                <ContactMenuButton
                  dropdownMenuMode
                  actions={[{title: 'Editar'}, {title: 'Excluir'}]}
                  onPress={({nativeEvent}) =>
                    handlePressMenuOption(nativeEvent.index)
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
                <ContactLocationName>BRAZIL</ContactLocationName>
              </ContactLocationContainer>

              <Divider />

              <ContactFooter>
                <ContactDateTime>
                  {format(contact.createdAt, 'PPpp', {locale: pt})}
                </ContactDateTime>

                <ContactMenuWhatsAppButton
                  onPress={() => null}
                  onLongPress={eraseAsyncStorageData}>
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
