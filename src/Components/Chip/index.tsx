import {Text, View} from 'react-native';

import styles from './styles';

interface ChipProps {
  text: string;
}
const Chip = ({text}: ChipProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default Chip;
