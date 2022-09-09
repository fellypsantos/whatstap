import React, {useState} from 'react';
import {Text, View} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

import AppStructure from '../../components/AppStructure';

const AddNumber: React.FC = () => {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');

  return (
    <AppStructure
      sectionName="Add Number"
      headerMenuOptions={{
        icon: 'trash',
        onPress: () => null,
      }}>
      <>
        <Text>Value : {value}</Text>
        <Text>Formatted Value : {formattedValue}</Text>
        <PhoneInput
          defaultCode="BR"
          layout="first"
          onChangeText={text => {
            setValue(text);
          }}
          onChangeFormattedText={text => {
            setFormattedValue(text);
          }}
          autoFocus
          containerStyle={{
            backgroundColor: 'red',
            padding: 0,
          }}
          textInputStyle={{
            backgroundColor: 'orange',
          }}
          codeTextStyle={{
            backgroundColor: 'green',
          }}
        />
      </>
    </AppStructure>
  );
};

export default AddNumber;
