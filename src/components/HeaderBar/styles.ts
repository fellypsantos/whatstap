import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  background-color: #5467fb;
  padding: 60px 20px 20px;
`;

export const HeaderTextContainer = styled.View`
  flex: 1;
`;

export const HeaderButtonContainer = styled.TouchableOpacity`
  justify-content: flex-end;
  padding: 0px 0px 0px 10px;
`;

export const AppName = styled.Text`
  font-family: 'Ubuntu-R';
  font-size: 24px;
  color: #fff;
`;

export const AppDescription = styled.Text`
  font-family: 'Ubuntu-R';
  font-size: 14px;
  margin-top: 5px;
  color: #fff;
`;
