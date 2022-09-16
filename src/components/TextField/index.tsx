import React from 'react';
import { KeyboardAvoidingView } from 'react-native';
import {
  Container,
  ContainerInput,
  InputLabel,
  InputLabelIcon,
  InputLabelText,
} from './styles';

interface TextFieldsProps {
  icon: string;
  label: string;
  value: string;
  placeholder?: string;
  editable?: boolean;
  onChangeText(text: string): void;
}

const TextField: React.FC<TextFieldsProps> = ({
  icon,
  label,
  value,
  placeholder,
  onChangeText,
  editable = true,
}) => (
  <KeyboardAvoidingView behavior="height">
    <Container>
      <ContainerInput
        editable={editable}
        value={value}
        placeholder={placeholder}
        onChangeText={onChangeText}
        placeholderTextColor="#aaa"
      />
      <InputLabel>
        <InputLabelIcon name={icon} color="#aaa" size={14} />
        <InputLabelText>{label}</InputLabelText>
      </InputLabel>
    </Container>
  </KeyboardAvoidingView>
);

export default TextField;
