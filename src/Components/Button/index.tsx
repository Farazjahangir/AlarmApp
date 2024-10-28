import {TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps, ViewStyle} from 'react-native';
import styles from './styles';

interface ButtonProps {
  text: string;
  onPress?: TouchableOpacityProps["onPress"],
  containerStyle?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large'
}

const Button = ({text, onPress, containerStyle, loading, disabled, size}: ButtonProps) => {

  const btnContainerStyles = () => {
    let sizeStyle = styles.largeBtn

    if (size === 'medium') {
      sizeStyle = styles.medumBtn
    }

    if (size === 'small') {
      sizeStyle = styles.smallBtn
    }
    return [styles.container, sizeStyle, containerStyle];
  }


  const textStyles = () => {
    let sizeStyle = styles.textLarge

    if (size === 'medium') {
      sizeStyle = styles.textMedium
    }

    if (size === 'small') {
      sizeStyle = styles.textSmall
    }
    return [styles.text, sizeStyle];
  }

  return (
    <TouchableOpacity
      style={btnContainerStyles()}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={textStyles()}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

Button.defaultProps = {
  loading: false,
  disabled: false,
  size: 'large'
};

export default Button;
