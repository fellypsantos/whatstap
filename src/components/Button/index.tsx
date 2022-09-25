import React from 'react';
import { ButtonText, MainContainer, ButtonContainer } from './styles';

interface IButtonProps {
  type: 'default' | 'cancel';
  text: string;
  onPress(): void;
}

const ButtonComponent: React.FC<IButtonProps> = ({ type, text, onPress }) => (
  <MainContainer type={type}>
    <ButtonContainer type={type} onPress={onPress}>
      <ButtonText type={type}>{text}</ButtonText>
    </ButtonContainer>
  </MainContainer>
);

export default ButtonComponent;
