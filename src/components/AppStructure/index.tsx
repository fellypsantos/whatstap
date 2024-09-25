import React, { ReactElement } from 'react';

import AppMargin from '../AppMargin';
import HeaderBar from '../HeaderBar';

import { Container, SectionContainer, SectionName, SectionOption, SectionOptionText } from './styles';

interface AppStructureProps {
  children: ReactElement;
  sectionName: string;
  sectionMenuText?: string;
  sectionMenuOnPress?(): void;
}

const AppStructure: React.FC<AppStructureProps> = ({ children, sectionName, sectionMenuText, sectionMenuOnPress }) => (
  <>
    <HeaderBar />

    <Container>
      <AppMargin>
        <SectionContainer>
          <SectionName>{sectionName}</SectionName>
          {!!sectionMenuText && (
            <SectionOption onPress={sectionMenuOnPress}>
              <SectionOptionText>{sectionMenuText}</SectionOptionText>
            </SectionOption>
          )}
        </SectionContainer>
      </AppMargin>
      {children}
    </Container>
  </>
);

export default AppStructure;
