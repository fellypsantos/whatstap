import React, { useCallback, useState, useEffect } from 'react';
import { Modal } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import { useCountries } from '../../hooks/countries';
import { useSettings } from '../../hooks/settings';

import { useAppTranslation } from '../../hooks/translation';
import ICountryPhone from '../../interfaces/IPhoneCountry';

import {
  Container,
  InputLabel,
  InputLabelIcon,
  InputLabelText,
  PhoneNumberContainer,
  PhoneNumberCountryCodeButton,
  PhoneNumberCountryCodeText,
  PhoneNumberTextInput,
} from './styles';

interface ICountry {
  code: string;
  dialCode: string;
  name: string;
}

interface IPhoneNumberProps {
  show: boolean;
  disabledPhoneMask: boolean;
  countryCode: string;
  phoneNumber: string;
  resetCountryCode(): void;
  handleOpenCountryPicker(): void;
  handleCloseCountryPicker(): void;
  onChangeCountryCode(country: ICountry): void;
  onChangePhoneNumber(phone: string): void;
}

const PHONE_MASK_DISABLED = '9999999999999999999999999999999';

const PhoneNumberInput: React.FC<IPhoneNumberProps> = props => {
  const { Translate } = useAppTranslation();
  const { settings, updateSettings } = useSettings();
  const { countries } = useCountries();

  const [phoneMask, setPhoneMask] = useState(() => {
    const selectedCountry: ICountryPhone | undefined = countries.find(
      country => country.iso === settings.last_country_iso,
    );

    return selectedCountry?.mask || '';
  });

  const {
    show,
    disabledPhoneMask,
    countryCode,
    phoneNumber,
    resetCountryCode,
    handleOpenCountryPicker,
    handleCloseCountryPicker,
    onChangeCountryCode,
    onChangePhoneNumber,
  } = props;

  const updatePhoneMaskToCountry = useCallback(
    (code: string) => {
      const selectedCountry: ICountryPhone | undefined = countries.find(
        country => country.iso === code,
      );

      if (selectedCountry !== undefined) {
        const mask = selectedCountry.mask;
        setPhoneMask(mask);
      }
    },
    [countries],
  );

  useEffect(() => {
    if (phoneMask.length === 0) {
      updateSettings({
        ...settings,
        last_country_code: '+1',
        last_country_iso: 'US',
        last_country_name: 'United States',
      });

      resetCountryCode();
      setPhoneMask('(999)999-9999');

      handleOpenCountryPicker();
    }
  }, []);

  return (
    <>
      <Modal transparent={true} visible={show} style={{ flex: 1 }}>
        <CountryPicker
          lang={settings.language}
          show={true}
          inputPlaceholder={Translate('searchCountryName')}
          pickerButtonOnPress={item => {
            const country: ICountry = {
              code: item.code,
              dialCode: item.dial_code,
              name: item.name.en,
            };

            onChangeCountryCode(country);
            updatePhoneMaskToCountry(country.code);
            handleCloseCountryPicker();
          }}
          onBackdropPress={() => handleCloseCountryPicker()}
          style={{
            modal: {
              height: '75%',
            },
            textInput: {
              height: 50,
              borderRadius: 0,
              color: '#333',
            },
            flag: {},
            dialCode: {
              color: '#333',
              fontWeight: 'bold',
            },
            countryName: {
              color: '#333',
            },
          }}
        />
      </Modal>
      <Container>
        <PhoneNumberContainer>
          <PhoneNumberCountryCodeButton onPress={handleOpenCountryPicker}>
            <PhoneNumberCountryCodeText>
              {countryCode}
            </PhoneNumberCountryCodeText>
          </PhoneNumberCountryCodeButton>
          <PhoneNumberTextInput
            type={'custom'}
            value={phoneNumber}
            placeholder={Translate('typeHere')}
            keyboardType="phone-pad"
            onChangeText={onChangePhoneNumber}
            options={{
              mask: disabledPhoneMask ? PHONE_MASK_DISABLED : phoneMask,
            }}
          />
        </PhoneNumberContainer>
        <InputLabel>
          <InputLabelIcon name="phone" color="#aaa" size={14} />
          <InputLabelText>{Translate('phoneNumberLabel')}</InputLabelText>
        </InputLabel>
      </Container>
    </>
  );
};

export default PhoneNumberInput;
