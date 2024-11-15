import {useState} from 'react';
import {
  TextInput as RNTextInput,
  View,
  Text,
  TextInputProps as RNTextInputProps,
  Image,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  ImageSourcePropType
} from 'react-native';

import EyeIcon from '../../Assets/icons/eye.png';
import EyeOffIcon from '../../Assets/icons/eyeOff.png';
import COLORS from '../../Constants/colors';
import styles from './style';

interface TextInputProps {
  placeholder?: string;
  value: RNTextInputProps['value'];
  onChangeText?: RNTextInputProps['onChangeText'];
  secureTextEntry?: RNTextInputProps['secureTextEntry'];
  error?: string;
  showEyeIcon?: boolean;
  containerStyle?: ViewStyle;
  label?: string;
  inputBoxStyle?: ViewStyle;
  leftIcon?: ImageSourcePropType;
  readOnly?: boolean
}

const TextInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  error,
  showEyeIcon,
  containerStyle,
  label,
  inputBoxStyle,
  leftIcon,
  readOnly
}: TextInputProps) => {
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputBox, inputBoxStyle]}>
        {leftIcon && <Image source={leftIcon} style={styles.leftIcon} />}
        <RNTextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={COLORS.inputPlaceholder}
          secureTextEntry={isSecure}
          readOnly={readOnly}
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
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

TextInput.defaultProps = {
  secureTextEntry: false,
  showEyeIcon: false,
  label: '',
  readOnly: false
};

export default TextInput;
