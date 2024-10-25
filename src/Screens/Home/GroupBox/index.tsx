import {TouchableOpacity, Text, View, TouchableOpacityProps} from 'react-native';

import Button from '../../../Components/Button';
import { Group } from '..';
import styles from './style';

interface GroupBoxProps {
  item: Group;
  onBoxPress: TouchableOpacityProps['onPress'];
  onBtnPress: TouchableOpacityProps['onPress']
}

const GroupBox = ({ item, onBoxPress, onBtnPress }: GroupBoxProps) => {
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
