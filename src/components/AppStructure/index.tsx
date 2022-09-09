import React, {ReactElement} from 'react';

import HeaderBar from '../HeaderBar';

import {Container, Scrollable, AppMargin, SectionName} from './styles';

interface HeaderMenu {
  icon: string;
  onPress(): void;
}

interface AppStructureProps {
  children: ReactElement;
  headerMenuOptions: HeaderMenu;
  sectionName: string;
}

const AppStructure: React.FC<AppStructureProps> = ({
  children,
  headerMenuOptions,
  sectionName,
}) => (
  <>
    <HeaderBar
      iconName={headerMenuOptions.icon}
      onPress={headerMenuOptions.onPress}
    />

    <Container>
      <Scrollable>
        <AppMargin>
          <SectionName>{sectionName}</SectionName>
          {children}
        </AppMargin>
      </Scrollable>
    </Container>
  </>
);

export default AppStructure;
