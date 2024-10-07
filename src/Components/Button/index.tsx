import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';
import styles from './styles';

const Button = ({text, onPress, containerStyle, loading, disabled}) => {
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

export default Button;
