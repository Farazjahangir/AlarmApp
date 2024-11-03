import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import styles from './styles';

interface ButtonProps {
  text: string;
  onPress?: TouchableOpacityProps['onPress'];
  containerStyle?: ViewStyle;
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  theme?: 'default' | 'panic';
}

const Button = ({
  text,
  onPress,
  containerStyle,
  loading,
  disabled,
  size,
  theme,
}: ButtonProps) => {
  const btnContainerStyles = () => {
    let sizeStyle = styles.largeBtn;
    let bgTheme = styles.bgColorDefault;

    if (size === 'medium') {
      sizeStyle = styles.medumBtn;
    }

    if (size === 'small') {
      sizeStyle = styles.smallBtn;
    }

    if (theme === 'panic') {
      bgTheme = styles.bgColorPanic;
    }
    return [styles.container, bgTheme, sizeStyle, containerStyle];
  };

  const textStyles = () => {
    let sizeStyle = styles.textLarge;

    if (size === 'medium') {
      sizeStyle = styles.textMedium;
    }

    if (size === 'small') {
      sizeStyle = styles.textSmall;
    }
    return [styles.text, sizeStyle];
  };

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
  size: 'large',
  theme: 'default',
};

export default Button;
