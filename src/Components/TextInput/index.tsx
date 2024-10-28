import {useState} from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps as RNTextInputProps,
  Image,
  TouchableOpacity,
} from 'react-native';

import EyeIcon from '../../Assets/icons/eye.png';
import EyeOffIcon from '../../Assets/icons/eyeOff.png';
import COLORS from '../../Constants/colors';
import styles from './style';

interface TextInputProps {
  placeholder?: string;
  value: RNTextInputProps['value'];
  onChangeText: RNTextInputProps['onChangeText'];
  secureTextEntry?: RNTextInputProps['secureTextEntry'];
  error?: string;
  showEyeIcon?: boolean;
}

const TextInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  showEyeIcon,
}: TextInputProps) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View>
      <View style={styles.inputBox}>
        <RNTextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={COLORS.inputBorder}
          secureTextEntry={isSecure}
        />
        {showEyeIcon && (
          <TouchableOpacity
            style={styles.eyeIconBox}
            onPress={togglePasswordVisibility}>
            <Image
              source={isSecure ? EyeOffIcon : EyeIcon}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

TextInput.defaultProps = {
  secureTextEntry: false,
  showEyeIcon: false,
};

export default TextInput;
