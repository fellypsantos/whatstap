import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const SelectableContactToImport = styled(RectButton)``;

export const SelectableContactToImportView = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 2px 8px;
  border-bottom-color: #ccc;
  border-bottom-width: 1px;
`;

export const SelectableContactDisplayName = styled.Text`
  font-family: 'Ubuntu-R';
  font-size: 16px;
`;
