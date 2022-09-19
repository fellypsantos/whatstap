import React from 'react';
import { PhoneInputProps } from 'react-native-phone-number-input';
import { useAppTranslation } from '../../hooks/translation';

import {
  Container,
  ContainerInput,
  InputLabel,
  InputLabelIcon,
  InputLabelText,
} from './styles';

const PhoneNumberInput: React.FC<PhoneInputProps> = props => {
  const { Translate } = useAppTranslation();
  return (
    <Container>
      <ContainerInput
        {...props}
        containerStyle={{
          padding: 0,
          backgroundColor: '#fff',
          width: '100%',
          borderRadius: 5,
        }}
        textContainerStyle={{
          padding: 0,
          backgroundColor: '#fff',
          borderRadius: 5,
        }}
        codeTextStyle={{
          padding: 0,
          fontFamily: 'Ubuntu-B',
          fontSize: 18,
          backgroundColor: '#fff',
          marginLeft: -15,
        }}
        textInputStyle={{
          padding: 0,
          fontSize: 18,
          fontFamily: 'Ubuntu-B',
          backgroundColor: '#fff',
        }}
        textInputProps={{ placeholderTextColor: '#aaa' }}
      />
      <InputLabel>
        <InputLabelIcon name="phone" color="#aaa" size={14} />
        <InputLabelText>{Translate('phoneNumberLabel')}</InputLabelText>
      </InputLabel>
    </Container>
  );
};

export default PhoneNumberInput;
