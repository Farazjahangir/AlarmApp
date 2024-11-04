import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  TouchableOpacityProps,
  ViewStyle,
  ImageStyle,
} from 'react-native';

import styles from './styles';

interface FloatingButton {
  icon: ImageSourcePropType;
  onPress?: TouchableOpacityProps['onPress'];
  containerStyle?: ViewStyle;
  buttonStyle?: ImageStyle;
}

const FloatingButton = ({
  icon,
  onPress = () => {},
  containerStyle,
  buttonStyle,
}: FloatingButton) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}>
      <Image source={icon} style={[styles.button, buttonStyle]} />
    </TouchableOpacity>
  );
};

export default FloatingButton;
