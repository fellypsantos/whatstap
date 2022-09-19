import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import uuid from 'react-native-uuid';
import {
  TestIds,
  InterstitialAd,
  AdEventType,
} from 'react-native-google-mobile-ads';

import { useContact } from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';
import ButtonContainer from '../../components/Button';
import CheckboxField from '../../components/CheckboxField';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import TextField from '../../components/TextField';
import IContact from '../../interfaces/IContact';
import AppMargin from '../../components/AppMargin';
import { ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useAppTranslation } from '../../hooks/translation';
import { useSettings } from '../../hooks/settings';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

const AddContact: React.FC = () => {
  const [processing, setProcessing] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adClosed, setAdClosed] = useState(false);
  const [openWhatsAppChecked, setOpenWhatsAppChecked] = useState(false);
  const wantShowAd = useMemo(() => Boolean(Math.floor(Math.random() * 2)), []);

  const navigation = useNavigation();
  const { Translate } = useAppTranslation();
  const { addContact, openWhatsApp } = useContact();
  const { settings } = useSettings();

  const [contact, setContact] = useState<IContact>(() => ({
    id: uuid.v4().toString(),
    name: '',
    phone: '',
    country: 'Brazil',
    createdAt: new Date(),
  }));

  const handleAddContact = useCallback(() => {
    if (contact.phone === '') {
      Alert.alert(
        Translate('Alerts.Attention'),
        Translate('Alerts.Empty.PhoneNumber'),
      );

      return;
    }

    setProcessing(true);

    setTimeout(() => {
      addContact({
        ...contact,
        createdAt: new Date(),
      });

      if (adLoaded) {
        if (__DEV__) console.log('Good! Ad is loaded, let show now.');
        interstitial.show();
      }

      if (!adLoaded && openWhatsAppChecked) {
        openWhatsApp(contact.phone);
      }

      setProcessing(false);
      if (!adLoaded) navigation.goBack();
    }, 3000);
  }, [
    contact,
    addContact,
    openWhatsAppChecked,
    navigation,
    openWhatsApp,
    adLoaded,
    Translate,
  ]);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => setAdLoaded(true),
    );

    const unsubscribeClose = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => setAdClosed(true),
    );

    if (!adLoaded && wantShowAd) {
      interstitial.load();
      if (__DEV__) console.log('Requesting ad to AdMob Network');
    }

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClose();
    };
  }, [adLoaded, wantShowAd]);

  useEffect(() => console.log('settings change', settings), [settings]);

  // HANDLE AD_CLOSE
  useEffect(() => {
    if (adLoaded && adClosed) {
      if (__DEV__) console.log('Ad was closed by user');
      if (openWhatsAppChecked) openWhatsApp(contact.phone);
      navigation.goBack();
    }
  }, [
    adLoaded,
    adClosed,
    contact.phone,
    openWhatsApp,
    navigation,
    openWhatsAppChecked,
  ]);

  return (
    <AppStructure
      sectionName={Translate('addContact')}
      headerMenuOptions={{
        icon: 'trash',
        onPress: () => navigation.goBack(),
      }}>
      <ScrollView>
        <AppMargin>
          <>
            <PhoneNumberInput
              autoFocus
              defaultCode={settings.lastCountryISO}
              onChangeCountry={({ name }) =>
                setContact({ ...contact, country: name.toString() })
              }
              onChangeFormattedText={text =>
                setContact({ ...contact, phone: text })
              }
              placeholder={Translate('typeHere')}
            />

            <TextField
              editable={!processing}
              icon="id-card"
              label={Translate('identifier')}
              value={contact.name}
              placeholder={Translate('optionalName')}
              onChangeText={text => setContact({ ...contact, name: text })}
            />

            <CheckboxField
              isChecked={openWhatsAppChecked}
              text={Translate('startChatOnSave')}
              onPress={isChecked => setOpenWhatsAppChecked(isChecked)}
            />

            {processing ? (
              <ActivityIndicator size={25} color="#5467fb" />
            ) : (
              <>
                <ButtonContainer
                  text={Translate('saveContact')}
                  type="default"
                  onPress={handleAddContact}
                />

                <ButtonContainer
                  text={Translate('cancel')}
                  type="cancel"
                  onPress={() => navigation.goBack()}
                />
              </>
            )}
          </>
        </AppMargin>
      </ScrollView>
    </AppStructure>
  );
};

export default AddContact;
