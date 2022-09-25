import styled from 'styled-components/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox-group';

export const Container = styled.View`
  background-color: #fff;
  padding-bottom: 10px;
`;

export const BouncyCheckBox = styled(BouncyCheckbox).attrs({
  checkboxProps: {
    size: 25,
    fillColor: '#5467fb',
    unfillColor: '#fff',
    paddingBottom: 5,
    textStyle: {
      fontFamily: 'Ubuntu-R',
      textDecorationLine: 'none',
      fontSize: 14,
    },
  },
})``;
