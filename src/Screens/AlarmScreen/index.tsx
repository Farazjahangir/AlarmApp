import {Text, View, TouchableOpacity} from 'react-native';

import AlarmManager from '../../Services/AlarmManager';
import Button from '../../Components/Button';
import styles from './style';

const AlarmScreen = ({navigation}) => {
  const stopAlarm = async () => {
    await AlarmManager.stopAlarm();
    navigation.navigate('Home');
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentBox}>
        <Text style={styles.text}>Alarm Ringing</Text>
        <Button text="Mute Alarm" onPress={stopAlarm} />
      </View>
    </View>
  );
};

export default AlarmScreen;
