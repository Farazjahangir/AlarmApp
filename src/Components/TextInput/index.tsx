import {TextInput as RNTextInput, View, Text, TextInputProps as RNTextInputProps} from 'react-native';

import COLORS from '../../Constants/colors';
import styles from './style';

interface TextInputProps {
  placeholder?: string;
  value: RNTextInputProps['value'];
  onChangeText: RNTextInputProps['onChangeText'];
  secureTextEntry?: RNTextInputProps['secureTextEntry'];
  error?: string
}

const TextInput = ({placeholder, value, onChangeText, secureTextEntry, error}: TextInputProps) => {
  return (
    <View>
      <RNTextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={COLORS.inputBorder}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default TextInput;
