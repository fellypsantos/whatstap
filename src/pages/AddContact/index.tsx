import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import uuid from 'react-native-uuid';
import { TestIds, InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

import { useContact } from '../../hooks/contact';
import AppStructure from '../../components/AppStructure';
import ButtonContainer from '../../components/Button';
import CheckboxField from '../../components/CheckboxField';
import PhoneNumberTextInput from '../../components/PhoneNumberInput';
import TextField from '../../components/TextField';
import IContact from '../../interfaces/IContact';
import AppMargin from '../../components/AppMargin';
import { ActivityIndicator, Alert, ScrollView, ToastAndroid } from 'react-native';
import { useAppTranslation } from '../../hooks/translation';
import { useSettings } from '../../hooks/settings';
import { CalculateChanceToDisplayAppOpenAd } from '../../utils/random';

const interstitial = InterstitialAd.createForAdRequest(TestIds.INTERSTITIAL);

const AddContact: React.FC = () => {
  const { settings, updateSettings } = useSettings();

  const [processing, setProcessing] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adClosed, setAdClosed] = useState(false);
  const [disabledPhoneMask, setDisabledPhoneMask] = useState(() => settings.disabled_phone_mask);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [openWhatsAppChecked, setOpenWhatsAppChecked] = useState(false);
  const wantShowAd = useMemo(() => CalculateChanceToDisplayAppOpenAd(true), []);

  const navigation = useNavigation();
  const { Translate } = useAppTranslation();
  const { addContact, openWhatsApp } = useContact();

  const [contact, setContact] = useState<IContact>(() => ({
    id: uuid.v4().toString(),
    name: '',
    country_code: settings.last_country_code,
    phone: '',
    country: settings.last_country_name,
    createdAt: new Date(),
  }));

  const handleAddContact = useCallback(() => {
    if (contact.phone === '') {
      Alert.alert(Translate('Alerts.Attention'), Translate('Alerts.Empty.PhoneNumber'));
      return;
    }

    setProcessing(true);

    setTimeout(() => {
      addContact({
        ...contact,
        createdAt: new Date(),
      });

      ToastAndroid.show(Translate('Toast.Contact.Added'), ToastAndroid.LONG);

      if (adLoaded) {
        if (__DEV__) { console.log('Good! Ad is loaded, let show now.'); }
        interstitial.show();
      }

      if (!adLoaded && openWhatsAppChecked) {
        openWhatsApp(contact.phone);
      }

      setProcessing(false);
      if (!adLoaded) { navigation.goBack(); }
    }, 3000);
  }, [contact, addContact, openWhatsAppChecked, navigation, openWhatsApp, adLoaded, Translate]);

  const handleChangeDisablePhoneMask = useCallback(
    (isChecked: boolean) => {
      setDisabledPhoneMask(isChecked);

      updateSettings({
        ...settings,
        disabled_phone_mask: isChecked,
      });
    },
    [settings, updateSettings],
  );

  const handleResetCountryCode = useCallback(() => {
    setContact({
      ...contact,
      country_code: '+1',
      country: 'United States',
    });
  }, [contact]);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => setAdLoaded(true));

    const unsubscribeClose = interstitial.addAdEventListener(AdEventType.CLOSED, () => setAdClosed(true));

    if (!adLoaded && wantShowAd) {
      interstitial.load();
      if (__DEV__) { console.log('Requesting ad to AdMob Network'); }
    }

    // Unsubscribe from events on unmount
    return () => {
      unsubscribeLoaded();
      unsubscribeClose();
    };
  }, [adLoaded, wantShowAd]);

  // HANDLE AD_CLOSE
  useEffect(() => {
    if (adLoaded && adClosed) {
      if (__DEV__) { console.log('Ad was closed by user'); }
      if (openWhatsAppChecked) { openWhatsApp(contact.phone); }
      navigation.goBack();
    }
  }, [adLoaded, adClosed, contact.phone, openWhatsApp, navigation, openWhatsAppChecked]);

  return (
    <AppStructure
      sectionName={Translate('addContact')}>
      <ScrollView>
        <AppMargin>
          <>
            <PhoneNumberTextInput
              disabledPhoneMask={disabledPhoneMask}
              countryCode={contact.country_code}
              phoneNumber={contact.phone}
              show={showCountryPicker}
              resetCountryCode={handleResetCountryCode}
              handleOpenCountryPicker={() => setShowCountryPicker(true)}
              handleCloseCountryPicker={() => setShowCountryPicker(false)}
              onChangeCountryCode={country => {
                setContact({
                  ...contact,
                  country_code: country.dialCode,
                  country: country.name,
                });

                updateSettings({
                  ...settings,
                  last_country_code: country.dialCode,
                  last_country_iso: country.code,
                  last_country_name: country.name,
                });
              }}
              onChangePhoneNumber={text => setContact({ ...contact, phone: text.replace(/\D+/g, '') })}
            />

            <CheckboxField isChecked={disabledPhoneMask} text={Translate('disablePhoneMask')} onPress={isChecked => handleChangeDisablePhoneMask(isChecked)} />

            <TextField
              editable={!processing}
              icon="id-card"
              label={Translate('identifier')}
              value={contact.name}
              placeholder={Translate('optionalName')}
              onChangeText={text => setContact({ ...contact, name: text })}
            />

            <CheckboxField isChecked={openWhatsAppChecked} text={Translate('startChatOnSave')} onPress={isChecked => setOpenWhatsAppChecked(isChecked)} />

            {processing ? (
              <ActivityIndicator size={25} color="#5467fb" />
            ) : (
              <>
                <ButtonContainer text={Translate('saveContact')} type="default" onPress={handleAddContact} />

                <ButtonContainer text={Translate('cancel')} type="cancel" onPress={() => navigation.goBack()} />
              </>
            )}
          </>
        </AppMargin>
      </ScrollView>
    </AppStructure>
  );
};

export default AddContact;
