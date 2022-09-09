import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import {
  Container,
  AppName,
  AppDescription,
  HeaderTextContainer,
  HeaderButtonContainer,
} from './styles';

interface HeaderBarProps {
  iconName: string;
  onPress(): void;
}

const HeaderBar: React.FC<HeaderBarProps> = props => {
  const {iconName, onPress} = props;

  return (
    <Container>
      <HeaderTextContainer>
        <AppName>WhatsTap</AppName>
        <AppDescription>Speed up your whatsapp chat.</AppDescription>
      </HeaderTextContainer>

      <HeaderButtonContainer onPress={onPress}>
        <Icon name={iconName} size={28} color="#fff" />
      </HeaderButtonContainer>
    </Container>
  );
};

export default HeaderBar;
