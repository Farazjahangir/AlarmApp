import {Text, TouchableOpacity, Image, ImageSourcePropType} from 'react-native';
import styles from './style';
import {TouchableOpacityProps} from 'react-native-gesture-handler';

interface OptionItemProps {
  textRed?: boolean;
  text: string;
  icon: ImageSourcePropType;
  containerStyle?: TouchableOpacityProps['style'];
  onPress?: TouchableOpacityProps['onPress'];
  disabled?: boolean;
}

const OptionItem = ({
  textRed,
  icon,
  text,
  containerStyle,
  onPress,
  disabled,
}: OptionItemProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabledBox, containerStyle]}
      onPress={onPress}>
      <Image source={icon} style={styles.icon} />
      <Text style={[styles.text, textRed && styles.textRed]}>{text}</Text>
    </TouchableOpacity>
  );
};

export default OptionItem;
