import {TouchableOpacity, Text} from 'react-native';
import styles from './styles';

const Button = ({text, onPress, containerStyle}) => {
  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
