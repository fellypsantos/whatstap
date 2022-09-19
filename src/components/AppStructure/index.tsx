import React, { ReactElement } from 'react';

import AppMargin from '../AppMargin';
import HeaderBar from '../HeaderBar';

import {
  Container,
  SectionContainer,
  SectionName,
  SectionOption,
  SectionOptionText,
} from './styles';

interface HeaderMenu {
  icon: string;
  onPress(): void;
}

interface AppStructureProps {
  children: ReactElement;
  headerMenuOptions: HeaderMenu;
  sectionName: string;
  sectionMenuText?: string;
  sectionMenuOnPress?(): void;
}

const AppStructure: React.FC<AppStructureProps> = ({
  children,
  headerMenuOptions,
  sectionName,
  sectionMenuText,
  sectionMenuOnPress,
}) => (
  <>
    <HeaderBar
      iconName={headerMenuOptions.icon}
      onPress={headerMenuOptions.onPress}
    />

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
