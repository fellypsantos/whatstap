import React from 'react';
import { ICheckboxButton } from 'react-native-bouncy-checkbox-group';
import { BouncyCheckBox, Container } from './styles';

interface ICheckboxFieldProps {
  data: ICheckboxButton[];
  initialValue: number;
  onChange(selectedItem: ICheckboxButton): void;
}

const CheckboxGroupField: React.FC<ICheckboxFieldProps> = ({
  data,
  initialValue = 0,
  onChange,
}) => (
  <Container>
    <BouncyCheckBox
      initial={initialValue}
      data={data}
      onChange={onChange}
      style={{ flexDirection: 'column' }}
    />
  </Container>
);

export default CheckboxGroupField;
