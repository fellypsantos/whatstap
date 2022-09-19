import React from 'react';
import { Container } from './styles';

interface Props {
  children: React.ReactElement;
}

const AppMargin: React.FC<Props> = ({ children }) => (
  <Container>{children}</Container>
);

export default AppMargin;
