import React from 'react';
import {BouncyCheckBox, Container} from './styles';

interface ICheckboxFieldProps {
  text: string;
  isChecked: boolean;
  onPress(isChecked: boolean): void;
}

const CheckboxField: React.FC<ICheckboxFieldProps> = ({
  text,
  isChecked,
  onPress,
}) => (
  <Container>
    <BouncyCheckBox text={text} onPress={onPress} isChecked={isChecked} />
  </Container>
);

export default CheckboxField;
