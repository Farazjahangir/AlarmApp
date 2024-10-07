import {View, Text} from 'react-native';

import Button from '../../../Components/Button';
import styles from './style';

const GroupBox = ({ item, onPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <Text style={styles.groupName}>{item.groupName}</Text>
        <Text style={styles.count}>Member Count: {item.members.length}</Text>
      </View>
      <Button text="Ring" onPress={onPress} />
    </View>
  );
};

export default GroupBox;
