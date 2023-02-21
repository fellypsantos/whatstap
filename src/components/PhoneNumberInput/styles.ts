import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RectButton } from 'react-native-gesture-handler';
import { TextInputMask } from 'react-native-masked-text';

export const Container = styled.View`
  border-color: #e3e3e3;
  border-width: 1px;
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 15px;
`;

export const InputLabel = styled.View`
  flex-direction: row;
  margin: 0 12px;
  border-top-width: 1px;
  border-top-color: #e3e3e3;
  padding: 10px 5px;
`;

export const InputLabelIcon = styled(Icon)`
  margin-right: 10px;
`;

export const InputLabelText = styled.Text`
  font-family: 'Ubuntu-R';
  text-transform: uppercase;
  color: #aaa;
  font-size: 12px;
`;

export const PhoneNumberContainer = styled.View`
  flex-direction: row;
  padding: 0px 15px;
`;

export const PhoneNumberCountryCodeButton = styled(RectButton)`
  width: 75px;
  justify-content: center;
  align-items: center;
`;

export const PhoneNumberCountryCodeText = styled.Text`
  font-family: 'Ubuntu-B';
  font-size: 18px;
  color: #474747;
`;

export const PhoneNumberTextInput = styled(TextInputMask)`
  flex: 1;
  height: 45px;
  font-family: 'Ubuntu-B';
  font-size: 18px;
  color: #474747;
  margin-top: 2px;
`;
