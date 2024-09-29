import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { SearchContainer, SearchInputField, ClearButtonSearchContact } from './styles';
import { useAppTranslation } from '../../hooks/translation';

type SearchInputType = {
  onSearchContentChange: (searchContent: string) => void;
};

export default function SearchInput({ onSearchContentChange }: SearchInputType) {
  const { Translate } = useAppTranslation();
  const [searchContent, setSearchContent] = useState<string>('');

  useEffect(() => {
    onSearchContentChange(searchContent);
  }, [onSearchContentChange, searchContent]);

  return (
    <SearchContainer>
      <SearchInputField value={searchContent} placeholder={Translate('searchPlaceholder')} placeholderTextColor="#aaa" onChangeText={(text: string) => setSearchContent(text)} autoFocus={false} />

      <ClearButtonSearchContact onPress={() => setSearchContent('')}>
        <Icon name="times" color="#999" size={20} />
      </ClearButtonSearchContact>
    </SearchContainer>
  );
}
