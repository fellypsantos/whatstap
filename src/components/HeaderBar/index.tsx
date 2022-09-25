import React, { useState, useMemo, useCallback } from 'react';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ICheckboxButton } from 'react-native-bouncy-checkbox-group';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useSettings } from '../../hooks/settings';
import { useAppTranslation } from '../../hooks/translation';

import {
  Container,
  AppName,
  AppDescription,
  HeaderTextContainer,
  HeaderButtonContainer,
  HeaderHamburgerMenuContainer,
  SettingsContainer,
  SettingsLabel,
} from './styles';

import CheckboxGroupField from '../CheckboxGroupField';
import ButtonComponent from '../Button';

interface HeaderBarProps {
  iconName: string;
  onPress(): void;
}

const HeaderBar: React.FC<HeaderBarProps> = props => {
  const { iconName, onPress } = props;
  const { Translate } = useAppTranslation();

  const [modalOpen, setModalOpen] = useState(false);
  const { settings, updateSettings } = useSettings();

  const languageOptions = useMemo(
    () => [
      {
        id: 0,
        text: 'English',
      },
      {
        id: 1,
        text: 'Português',
      },
      {
        id: 2,
        text: 'Spañol',
      },
    ],
    [],
  );

  const parseLanguageToIndex = useCallback((language: string): number => {
    if (language === 'es') return 2;
    else if (language === 'pt') return 1;
    else return 0;
  }, []);

  const parseIndexToLanguage = useCallback((index: string | number): string => {
    if (index === 2) return 'es';
    else if (index === 1) return 'pt';
    else return 'en';
  }, []);

  return (
    <>
      <Modal
        visible={modalOpen}
        animationType="slide"
        onDismiss={() => setModalOpen(false)}
        onRequestClose={() => setModalOpen(false)}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SettingsContainer>
            <SettingsLabel>{Translate('Settings.AppLanguage')}</SettingsLabel>

            <CheckboxGroupField
              data={languageOptions}
              initialValue={parseLanguageToIndex(settings.language)}
              onChange={(selectedItem: ICheckboxButton) => {
                const lang = parseIndexToLanguage(selectedItem.id);
                updateSettings({ ...settings, language: lang });
              }}
            />

            <ButtonComponent
              text={Translate('close')}
              onPress={() => setModalOpen(false)}
              type="default"
            />
          </SettingsContainer>
        </GestureHandlerRootView>
      </Modal>
      <Container>
        <HeaderTextContainer>
          <HeaderHamburgerMenuContainer onPress={() => setModalOpen(true)}>
            <Icon name={'bars'} size={28} color="#fff" />
          </HeaderHamburgerMenuContainer>
          <AppName>WhatsTap</AppName>
          <AppDescription>{Translate('appDescription')}</AppDescription>
        </HeaderTextContainer>

        <HeaderButtonContainer onPress={onPress}>
          <Icon name={iconName} size={28} color="#fff" />
        </HeaderButtonContainer>
      </Container>
    </>
  );
};

export default HeaderBar;
