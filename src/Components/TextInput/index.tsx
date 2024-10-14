import {TextInput as RNTextInput, View, Text} from 'react-native';

import COLORS from '../../Constants/colors';
import styles from './style';

const TextInput = ({placeholder, value, onChangeText, secureTextEntry, error}) => {
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
