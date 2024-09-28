import React from 'react';
import { ButtonText, MainContainer, ButtonContainer } from './styles';

interface IButtonProps {
  type: 'default' | 'cancel';
  text: string;
  fillWidth?: boolean;
  disabled?: boolean;
  onPress(): void;
}

const ButtonComponent: React.FC<IButtonProps> = ({ type, text, fillWidth, disabled, onPress }) => (
  <MainContainer type={type} fillWidth={fillWidth}>
    <ButtonContainer type={type} onPress={onPress} disabled={disabled} enabled={!disabled}>
      <ButtonText type={type}>{text}</ButtonText>
    </ButtonContainer>
  </MainContainer>
);

export default ButtonComponent;
