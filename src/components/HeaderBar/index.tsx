import React, { useState, useMemo, useCallback } from 'react';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ICheckboxButton } from 'react-native-bouncy-checkbox-group';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useSettings } from '../../hooks/settings';
import { useAppTranslation } from '../../hooks/translation';

import { Container, AppName, AppDescription, HeaderTextContainer, SettingsContainer, SettingsLabel, ActionBarMenuButton } from './styles';

import CheckboxGroupField from '../CheckboxGroupField';
import ButtonComponent from '../Button';

const HeaderBar: React.FC = () => {
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

  const dropdown = useMemo(
    () => ({
      indexes: { LANGUAGE: 0 },
      options: [{ title: Translate('Settings.AppLanguage') }],
    }),
    [Translate],
  );

  const handlePressActionBarMenu = useCallback(
    (optionIndex: number) => {
      if (optionIndex === dropdown.indexes.LANGUAGE) {
        setModalOpen(true);
      }
    },
    [dropdown.indexes.LANGUAGE],
  );

  return (
    <>
      <Modal visible={modalOpen} animationType="slide" onDismiss={() => setModalOpen(false)} onRequestClose={() => setModalOpen(false)}>
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

            <ButtonComponent text={Translate('close')} onPress={() => setModalOpen(false)} type="default" />
          </SettingsContainer>
        </GestureHandlerRootView>
      </Modal>
      <Container>
        <HeaderTextContainer>
          <AppName>WhatsTap</AppName>
          <AppDescription>{Translate('appDescription')}</AppDescription>
        </HeaderTextContainer>

        <ActionBarMenuButton dropdownMenuMode actions={dropdown.options} onPress={({ nativeEvent }) => handlePressActionBarMenu(nativeEvent.index)}>
          <Icon name="ellipsis-v" color="#fff" size={16} />
        </ActionBarMenuButton>
      </Container>
    </>
  );
};

export default HeaderBar;
