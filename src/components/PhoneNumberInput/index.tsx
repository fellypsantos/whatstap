import React from 'react';
import { Modal } from 'react-native';
import CountryPicker from 'react-native-country-codes-picker';

import { useAppTranslation } from '../../hooks/translation';

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
  countryCode: string;
  phoneNumber: string;
  handleOpenCountryPicker(): void;
  handleCloseCountryPicker(): void;
  onChangeCountryCode(country: ICountry): void;
  onChangePhoneNumber(phone: string): void;
}

const PhoneNumberInput: React.FC<IPhoneNumberProps> = props => {
  const { Translate } = useAppTranslation();
  const {
    show,
    countryCode,
    phoneNumber,
    handleOpenCountryPicker,
    handleCloseCountryPicker,
    onChangeCountryCode,
    onChangePhoneNumber,
  } = props;

  return (
    <>
      <Modal transparent={true} visible={show} style={{ flex: 1 }}>
        <CountryPicker
          lang="en"
          show={true}
          inputPlaceholder="YOU NEED TO CHANGE ME"
          // when picker button press you will get the country object with dial code
          pickerButtonOnPress={item => {
            const country: ICountry = {
              code: item.code,
              dialCode: item.dial_code,
              name: item.name.en,
            };
            onChangeCountryCode(country);
            handleCloseCountryPicker();
          }}
          onBackdropPress={() => handleCloseCountryPicker()}
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
            value={phoneNumber}
            keyboardType="phone-pad"
            onChangeText={onChangePhoneNumber}
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
