import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  margin: 0 20px;
  align-items: center;
  justify-content: center;
`;

export const Column = styled.View`
  margin: 0px 5px;
  flex-direction: row;
`;

export const DescriptionText = styled.Text`
font-family:'Ubuntu-R';
  color: #666;
  text-align: center;
  font-size: 18px;
  margin-bottom: 25px;
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

export const SelectedCountryItemFromContactsToImport = styled(RectButton)`
  align-items: center;
  justify-content: center;
  padding: 10px 5px;
  background-color: #eee;
`;

export const SelectedCountryItemFromContactsToImportLabel = styled.Text`
  font-family:'Ubuntu-R';
  color: #474747;
`;

export const LoadingProgressContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #efefef;
  padding: 8px 10px;
`;

export const LoadingProgressText = styled.Text`
  font-family:'Ubuntu-R';
  color: #474747;
  font-size: 16px;
  margin-left: 10px;
`;

export const TopWarningText = styled.Text`
  font-family:'Ubuntu-R';
  color: #fff;
  padding: 15px 10px;
  text-align: center;
  background-color: #5467fb;
  font-size: 16px;
`;

export const ModalImagesContainerScrollView = styled.View`
  flex: 1;
  background-color: #1A1B26;
`;

export const ModalImagesContainer = styled.View`
  justify-content: center;
  align-items: center;
  padding: 10px;
`;

export const ModalImageTitle = styled.Text`
  font-family:'Ubuntu-R';
  color: #fff;
  padding: 10px;
  text-align: center;
  background-color: #393c56;
  font-size: 16px;
  margin-bottom: 5px;
  border-radius: 5px;
  align-self: stretch;
`;

export const ModalCloseButton = styled.TouchableHighlight`
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  padding: 10px 20px;
  margin-top: 10px;
`;
