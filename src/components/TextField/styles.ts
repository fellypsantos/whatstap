import styled from 'styled-components/native';
import { TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const Container = styled.View`
  border-color: #e3e3e3;
  border-width: 1px;
  border-radius: 5px;
  background-color: #fff;
  margin-bottom: 15px;
  padding-top: 5px;
`;

export const ContainerInput = styled.TextInput<TextInputProps>`
  background-color: ${props => (props.editable ? '#fff' : '#ddd')};
  padding: 10px 20px;
  font-family: 'Ubuntu-B';
  font-size: 18px;
  color: #474747;
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
