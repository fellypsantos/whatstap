import React from 'react';
import {KeyboardAvoidingView} from 'react-native';
import {
  Container,
  ContainerInput,
  InputLabel,
  InputLabelIcon,
  InputLabelText,
} from './styles';

interface TextFieldsProps {
  icon: string;
  value: string;
  placeholder?: string;
  onChangeText(text: string): void;
}

const TextField: React.FC<TextFieldsProps> = ({
  icon,
  value,
  placeholder,
  onChangeText,
}) => (
  <KeyboardAvoidingView behavior="height">
    <Container>
      <ContainerInput
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
      <InputLabel>
        <InputLabelIcon name={icon} color="#aaa" size={14} />
        <InputLabelText>Identifier</InputLabelText>
      </InputLabel>
    </Container>
  </KeyboardAvoidingView>
);

export default TextField;
