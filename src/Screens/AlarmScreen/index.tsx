import {useEffect} from 'react';
import {Text, View, TouchableOpacity, Linking} from 'react-native';
import {useRoute, RouteProp} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import AlarmManager from '../../Services/AlarmManager';
import Button from '../../Components/Button';
import Map from '../../Components/Map';
import {RootStackParamList} from '../../Types/navigationTypes';
import {ScreenNameConstants} from '../../Constants/navigationConstants';
import styles from './style';

const AlarmScreen = ({
  navigation,
}: NativeStackScreenProps<
  RootStackParamList,
  ScreenNameConstants.ALARM_SCREEN
>) => {
  const route = useRoute<RouteProp<RootStackParamList, ScreenNameConstants.ALARM_SCREEN>>();
  console.log("route ==========>", route)
  const latitude = Number(route?.params?.latitude);
  const longitude = Number(route?.params?.longitude);

  const stopAlarm = async () => {
    await AlarmManager.stopAlarm();
    navigation.navigate(ScreenNameConstants.HOME);
  };

  // const handleUrl = (url) => {
  //   // Parse the URL to get query parameters
  //   const params = new URLSearchParams(url.split('?')[1]);
  //   const lat = params.get('latitude');
  //   const long = params.get('longitude');

  //   console.log("lat ====>", lat)
  //   console.log("long ===>", long)
  //   // setLatitude(lat);
  //   // setLongitude(long);
  // };

  // const getInitialUrl = async () => {
  //   const url = await Linking.getInitialURL();
  //   if (url) {
  //     handleUrl(url);
  //   }
  // };

  // useEffect(() => {
  //   getInitialUrl()
  // }, [])

  return (
    <View style={styles.mainContainer}>
      {!!latitude && !!longitude && (
        <Map
          latitude={latitude}
          longitude={longitude}
          markers={[
            {
              coords: {
                latitude: latitude,
                longitude: longitude,
              },
            },
          ]}
        />
      )}
      <View style={styles.container}>
        <View style={styles.contentBox}>
          <Text style={styles.text}>Latitude: {latitude}</Text>
          <Text style={styles.text}>Longitude: {longitude}</Text>
          <Text style={styles.text}>Alarm Ringing</Text>
          <Button text="Mute Alarm" onPress={stopAlarm} />
        </View>
      </View>
    </View>
  );
};

export default AlarmScreen;
