import {TextInput as RNTextInput} from 'react-native';

import COLORS from '../../Constants/colors';
import styles from './style';

const TextInput = ({placeholder, value, onChangeText}) => {
  return (
    <RNTextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={COLORS.inputBorder}
    />
  );
};

export default TextInput;
