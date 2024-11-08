import {Text, TextStyle, View, ViewStyle} from 'react-native';
import RNPickerSelect, {PickerSelectProps} from 'react-native-picker-select';

import styles from './style';

interface SelectInputProps {
  items: PickerSelectProps['items'];
  onValueChange?: PickerSelectProps['onValueChange'];
  inputAndroidContainerStyle?: ViewStyle;
  inputAndroidStyle?: TextStyle;
  placeholder?: string;
  value?: PickerSelectProps['value'],
  error?: string
}

const SelectInput = ({
  items,
  onValueChange = () => {},
  inputAndroidContainerStyle,
  inputAndroidStyle,
  placeholder,
  value,
  error
}: SelectInputProps) => {
  return (
    <View>
        <RNPickerSelect
          style={{
            inputAndroid: [styles.input, inputAndroidStyle],
            placeholder: styles.placeholder,
            inputAndroidContainer: inputAndroidContainerStyle,
          }}
          useNativeAndroidPickerStyle={false}
          onValueChange={onValueChange}
          items={items}
          placeholder={{
            label: placeholder,
          }}
          value={value}
    
        />
        {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default SelectInput;
