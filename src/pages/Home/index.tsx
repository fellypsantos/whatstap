import React from 'react';
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

const Home = () => (
  <AppStructure
    sectionName="Contact History"
    headerMenuOptions={{icon: 'plus-circle', onPress: () => null}}>
    <>
      {[1, 2, 3, 4, 5, 6].map(item => (
        <ContactCard key={item}>
          <ContactCardHeader>
            <ContactNumber>+5591998379320</ContactNumber>
            <ContactMenuButton
              dropdownMenuMode
              actions={[{title: 'Editar'}, {title: 'Excluir'}]}
              onPress={e =>
                console.log(
                  `Pressed ${e.nativeEvent.name} at index ${e.nativeEvent.index}`,
                )
              }>
              <ContactMenuButtonIcon name="ellipsis-v" color="#aaa" size={14} />
            </ContactMenuButton>
          </ContactCardHeader>

          <ContactName>Backend Developer</ContactName>

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
            <ContactDateTime>27 MAY, 2019 | 07:00PM</ContactDateTime>
            <ContactMenuWhatsAppButton>
              <ContactMenuWhatsAppButtonIcon
                name="whatsapp"
                color="#fff"
                size={14}
              />
            </ContactMenuWhatsAppButton>
          </ContactFooter>
        </ContactCard>
      ))}
    </>
  </AppStructure>
);

export default Home;
