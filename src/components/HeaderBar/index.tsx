import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useAppTranslation } from '../../hooks/translation';

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
  const { iconName, onPress } = props;
  const { Translate } = useAppTranslation();

  return (
    <Container>
      <HeaderTextContainer>
        <AppName>WhatsTap</AppName>
        <AppDescription>{Translate('appDescription')}</AppDescription>
      </HeaderTextContainer>

      <HeaderButtonContainer onPress={onPress}>
        <Icon name={iconName} size={28} color="#fff" />
      </HeaderButtonContainer>
    </Container>
  );
};

export default HeaderBar;
