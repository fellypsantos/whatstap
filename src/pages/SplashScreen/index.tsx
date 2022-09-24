import React, { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useSettings } from '../../hooks/settings';
import { Container, LoadingText } from './styles';
import { RootStackParamList } from '../../routes/Stack';

type PageProps = NativeStackScreenProps<RootStackParamList, 'EditContact'>;

const SplashScreen: React.FC<PageProps> = ({ navigation }) => {
  const { loaded } = useSettings();

  useEffect(() => {
    if (loaded) {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'Home' }],
          }),
        );
      }, 2000);
    }
  }, [loaded, navigation]);

  return (
    <Container>
      <ActivityIndicator color="#fff" size={20} />
      <LoadingText>WhatsTap</LoadingText>
    </Container>
  );
};

export default SplashScreen;
