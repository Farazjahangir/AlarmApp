import {TouchableOpacity, Text, View} from 'react-native';

import Button from '../../../Components/Button';
import styles from './style';

const GroupBox = ({ item, onBoxPress, onBtnPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onBoxPress}>
      <View style={styles.leftContainer}>
        <Text style={styles.groupName}>{item.groupName}</Text>
        <Text style={styles.count}>Member Count: {item.members.length}</Text>
      </View>
      <Button text="Ring" onPress={onBtnPress} />
    </TouchableOpacity>
  );
};

export default GroupBox;
