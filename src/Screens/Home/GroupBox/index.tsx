import {
  TouchableOpacity,
  Text,
  View,
  TouchableOpacityProps,
  Image,
} from 'react-native';

import Button from '../../../Components/Button';
import { Group } from '../../../Types/dataType';
import groupDummy from '../../../Assets/images/groupDummy.png';
import styles from './style';

interface GroupBoxProps {
  item: Group;
  onBoxPress: TouchableOpacityProps['onPress'];
  onBtnPress: TouchableOpacityProps['onPress'];
}

const GroupBox = ({item, onBoxPress, onBtnPress}: GroupBoxProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onBoxPress}>
      <Image source={item.image ? { uri: item.image }: groupDummy} style={styles.picture} resizeMode='cover' />
      <View style={styles.leftContainer}>
        <Text style={styles.groupName}>{item.groupName}</Text>
        <Text style={styles.count}>{item.members.length} Member</Text>
        {!!item.nonActiveUsers && <Text style={styles.count}>{item.nonActiveUsers} Non Active</Text>}
      </View>
      <Button text="Panic" onPress={onBtnPress} theme="panic" size="small" />
    </TouchableOpacity>
  );
};

export default GroupBox;
