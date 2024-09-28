import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  margin: 0 20px;
  align-items: center;
  justify-content: center;
`;

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
  color: #474747;
`;

export const BottomButtonContainer = styled.View`
  padding: 10px 10px 0px 10px;
  flex-direction: row;
  justify-content: center;
`;

export const ToggleSelectAllContacts = styled(RectButton)`
  background-color: #5467fb;
  border-radius: 5px;
  margin-bottom: 10px;
  padding: 10px 15px;
  margin-right: 10px;
  align-items: center;
  justify-content: center;
`;
