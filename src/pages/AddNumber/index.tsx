import React, {useState} from 'react';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import uuid from 'react-native-uuid';

import AppStructure from '../../components/AppStructure';
import ButtonContainenr from '../../components/Button';
import CheckboxField from '../../components/CheckboxField';
import PhoneNumberInput from '../../components/PhoneNumberInput';
import TextField from '../../components/TextField';

interface IContact {
  id: string;
  name: string;
  number: string;
}

const AddNumber: React.FC = () => {
  const [contact, setContact] = useState<IContact>(() => ({
    id: uuid.v4().toString(),
    name: '',
    number: '',
  }));

  return (
    <AppStructure
      sectionName="Add Number"
      headerMenuOptions={{
        icon: 'trash',
        onPress: () => null,
      }}>
      <>
        <PhoneNumberInput
          defaultCode="BR"
          onChangeFormattedText={text => setContact({...contact, number: text})}
          placeholder="digite aqui"
        />

        <TextField
          icon="id-card"
          value={contact.name}
          placeholder="Optional name"
          onChangeText={text => setContact({...contact, name: text})}
        />

        <CheckboxField
          text="Start this chat when save"
          onPress={isChecked => console.log(isChecked)}
        />

        <ButtonContainenr
          text="Save Phone Number"
          type="default"
          onPress={() => console.log('done')}
        />

        <ButtonContainenr
          text="Cancel"
          type="cancel"
          onPress={() => console.log('Cancel')}
        />
      </>
    </AppStructure>
  );
};

export default AddNumber;
