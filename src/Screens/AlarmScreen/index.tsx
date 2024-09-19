import {Text, View, TouchableOpacity, Button} from 'react-native';
import AlarmManager from '../../Services/AlarmManager';

const AlarmScreen = ({navigation}) => {

  const stopAlarm = async () => {
    await AlarmManager.stopAlarm();
    navigation.navigate('Home');
  };
  return (
    <View
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}>
      <View style={{width: '70%'}}>
        <Text style={{fontSize: 20, marginBottom: 10, textAlign: 'center'}}>
          Alarm Ringing
        </Text>
        <TouchableOpacity>
          <Button title="Mute Alarm" onPress={stopAlarm} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AlarmScreen;
