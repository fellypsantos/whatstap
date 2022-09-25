import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  background-color: #5467fb;
  padding: 20px 20px 20px;
`;

export const HeaderTextContainer = styled.View`
  flex: 1;
`;

export const HeaderHamburgerMenuContainer = styled.TouchableOpacity`
  justify-content: center;
  width: 40px;
  height: 35px;
  margin-bottom: 10px;
`;

export const HeaderButtonContainer = styled.TouchableOpacity`
  justify-content: flex-end;
  padding: 0px 0px 0px 15px;
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

export const SettingsContainer = styled.ScrollView`
  flex: 1;
  padding: 20px;
`;

export const SettingsLabel = styled.Text`
  color: #333;
  font-family: 'Ubuntu-R';
  font-size: 20px;
  margin-bottom: 15px;
`;
