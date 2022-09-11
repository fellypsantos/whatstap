import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ContextMenu from 'react-native-context-menu-view';
import {RectButton} from 'react-native-gesture-handler';

interface ContactCardProps {
  useGrayedLeftBorder: boolean;
}

export const ContactCard = styled.View<ContactCardProps>`
  border-top-color: #e3e3e3;
  border-right-color: #e3e3e3;
  border-bottom-color: #e3e3e3;
  border-width: 1px;
  border-radius: 5px;
  border-left-width: 5px;
  padding: 15px 20px 10px 20px;
  background-color: #fff;
  margin-bottom: 15px;

  border-left-color: ${props =>
    props.useGrayedLeftBorder ? '#aaa' : '#5467fb'};
`;

export const ContactCardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export const ContactNumber = styled.Text`
  font-family: 'Ubuntu-M';
  color: #aaa;
  font-size: 14px;
`;

export const ContactMenuButton = styled(ContextMenu)`
  position: relative;
  top: 0px;
  right: -15px;
  width: 35px;
  height: 25px;
  justify-content: center;
  align-items: center;
`;

export const ContactMenuButtonIcon = styled(Icon)``;

export const ContactName = styled.Text`
  font-family: 'Ubuntu-B';
  font-size: 20px;
  color: #474747;
`;

export const ContactLocationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 5px;
`;

export const ContactLocationIcon = styled(Icon)`
  margin-right: 5px;
`;

export const ContactLocationName = styled.Text`
  font-family: 'Ubuntu-R';
  font-size: 14px;
`;

export const Divider = styled.View`
  border-bottom-width: 1px;
  border-bottom-color: #e3e3e3;
  margin-top: 20px;
`;

export const ContactFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

export const ContactDateTime = styled.Text`
  font-family: 'Ubuntu-R';
  font-size: 14px;
  letter-spacing: 0.8px;
  color: #aaaaaa;
`;

export const ContactMenuWhatsAppButton = styled(RectButton)`
  background-color: #25d366;
  width: 35px;
  height: 30px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

export const ContactMenuWhatsAppButtonIcon = styled(Icon)``;
