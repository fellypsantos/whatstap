import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ContextMenu from 'react-native-context-menu-view';
import { RectButton } from 'react-native-gesture-handler';

export const ContactCard = styled.View`
  border-bottom-color: #e3e3e3;
  border-bottom-width: 1px;
  background-color: #fff;
`;

export const ContactCardRow = styled.View`
  flex-direction: row;
`;

export const ContactCardTouchable = styled(RectButton)`
  flex: 1;
  flex-direction: column;
  padding: 8px 20px;
`;

export const ContactMenuButton = styled(ContextMenu)`
  padding: 0px 15px;
  justify-content: center;
  align-items: center;
`;

export const ContactMenuButtonIcon = styled(Icon)``;

export const ContactName = styled.Text`
  font-family: 'Ubuntu-M';
  font-size: 20px;
  color: #474747;
`;

export const ContactLocationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const ContactLocationIcon = styled(Icon)`
  margin-right: 5px;
`;

export const ContactPhoneNumber = styled.Text`
  font-family: 'Ubuntu-R';
  font-size: 14px;
  color: #666;
`;

export const NoContactsLabel = styled.Text`
  font-family: 'Ubuntu-R';
  font-size: 14px;
  margin: 10px 20px;
  color: #474747;
`;

export const ContainerWithMargin = styled.View`
  margin: 10px 20px;
`;

export const ButtonBottomContainer = styled.View`
  margin: 10px 10px 0px 10px;
`;
