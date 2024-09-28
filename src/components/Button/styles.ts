import { RectButton } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

interface IButtonStyleProps {
  type: string;
  fillWidth?: boolean;
  disabled?: boolean;
}

export const MainContainer = styled.View<IButtonStyleProps>`
  border-color: ${props => (props.type === 'default' ? '#5467fb' : '#D91E18')};
  border-width: 1px;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;

  ${({ fillWidth }) => fillWidth && 'flex: 1;'}`;

export const ButtonContainer = styled(RectButton) <IButtonStyleProps>`
  background-color: ${props => (props.type === 'default' ? '#5467fb' : '#fff')};
  padding: 16px;
  align-items: center;

  ${({ disabled }) => disabled && 'background-color: #b0b9fd;'}
`;

export const ButtonText = styled.Text<IButtonStyleProps>`
  font-family: 'Ubuntu-R';
  color: ${props => (props.type === 'default' ? '#fff' : '#D91E18')};
  font-size: 14px;
`;
