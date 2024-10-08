import React, { ReactElement } from 'react';

import AppMargin from '../AppMargin';
import HeaderBar from '../HeaderBar';

import { Container, SectionContainer, SectionName, SectionOption, SectionOptionText } from './styles';

interface AppStructureProps {
  children: ReactElement;
  sectionName: string;
  sectionMenuText?: string;
  hideSectionContainer?: boolean;
  sectionMenuOnPress?(): void;
}

const AppStructure: React.FC<AppStructureProps> = ({ children, sectionName, sectionMenuText, hideSectionContainer, sectionMenuOnPress }) => (
  <>
    <HeaderBar />

    <Container>
      {!hideSectionContainer && (
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
      )}
      {children}
    </Container>
  </>
);

export default AppStructure;
