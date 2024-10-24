import {TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, ViewStyle} from 'react-native';
import styles from './styles';

interface ButtonProps {
  text: string;
  onPress?: TouchableOpacityProps["onPress"],
  containerStyle?: ViewStyle;
  loading?: boolean;
  disabled?: boolean
}

const Button = ({text, onPress, containerStyle, loading, disabled}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.text}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  loading: false,
  disabled: false,
};

export default Button;
