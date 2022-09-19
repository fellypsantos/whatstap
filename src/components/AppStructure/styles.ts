import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const SectionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const SectionName = styled.Text`
  font-family: 'Ubuntu-R';
  font-size: 14px;
  color: #474747;
  margin: 15px 0;
`;

export const SectionOption = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

export const SectionOptionText = styled.Text`
  color: red;
  font-size: 14px;
  font-family: 'Ubuntu-R';
  text-align: center;
  padding: 0 15px;
  padding-right: 0;
`;
