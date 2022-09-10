import React from 'react';
import {BouncyCheckBox, Container} from './styles';

interface ICheckboxFieldProps {
  text: string;
  onPress(isChecked: boolean): void;
}

const CheckboxField: React.FC<ICheckboxFieldProps> = ({text, onPress}) => (
  <Container>
    <BouncyCheckBox text={text} onPress={onPress} />
  </Container>
);

export default CheckboxField;
