import styled from 'styled-components/native';
import { RectButton } from 'react-native-gesture-handler';

export const SearchContainer = styled.View`
  background-color: #eee;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const SearchInputField = styled.TextInput`
  flex: 1;
  font-family: 'Ubuntu-R';
  padding: 8px 20px;
`;

export const ClearButtonSearchContact = styled(RectButton)`
  padding: 10px 20px;
`;
