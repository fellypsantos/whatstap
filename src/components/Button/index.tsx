import React from 'react';
import { ButtonText, MainContainer, ButtonContainer } from './styles';

interface IButtonProps {
  type: 'default' | 'cancel';
  text: string;
  fillWidth?: boolean;
  fillBackground?: boolean;
  disabled?: boolean;
  marginLeft?: boolean;
  onPress(): void;
}

const ButtonComponent: React.FC<IButtonProps> = ({ type, text, fillWidth, fillBackground, disabled, marginLeft, onPress }) => (
  <MainContainer type={type} fillWidth={fillWidth} marginLeft={marginLeft}>
    <ButtonContainer type={type} onPress={onPress} disabled={disabled} enabled={!disabled} fillBackground={fillBackground}>
      <ButtonText type={type} fillBackground={fillBackground}>{text}</ButtonText>
    </ButtonContainer>
  </MainContainer>
);

export default ButtonComponent;
