import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, Text, Linking} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import a from './assets/alarm.mp3';
import notifee, {EventType} from '@notifee/react-native';
import AlarmScreen from './src/Screens/AlarmScreen';
import {NativeModules} from 'react-native';
import AlarmManager from './src/Services/AlarmManager';
import Navigation from './src/Navigation';
import { navigate } from './src/Services/NavigationService';

const {AlarmSoundModule} = NativeModules;

function App(): React.JSX.Element {
  const [alarmRinging, setAlarmRinging] = useState(false);

  const fetchToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    // console.log('TOKEN', token);
  };

  // const reqPer = async () => {
  //   const per = await notifee.requestPermission();
  //   console.log('PER ===>', per);
  //   const opt = await notifee.isBatteryOptimizationEnabled();
  //   console.log('OPt ===>', opt);
  // };

  const listenForForegroundMessage = async () => {
    messaging().onMessage(async remoteMessage => {
      try {
        await AlarmManager.playAlarm();
        navigate('Alarm Screen')
      } catch (e) {
        console.log('ERR => listenForForegroundMessage', e.message);
      }
    });
  };

  const stopAlarm = async () => {
    await AlarmManager.stopAlarm();
    setAlarmRinging(false);
  };

  const checkInitialNotification = async () => {
    const initialNotification = await notifee.getInitialNotification();
    if (initialNotification) {
      const deepLink = initialNotification.notification?.data?.deep_link;
      console.log("App opened from a killed state via notification");

      // Check if the notification press opened the app
      if (deepLink) {
        console.log("deepLink ===>", deepLink)
        // Handle deep linking based on the notification action
        Linking.openURL(deepLink);
      }
    }
  };

  useEffect(() => {
    // reqPer()
    fetchToken();
    listenForForegroundMessage();
    checkInitialNotification()
  }, []);

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      {/* {alarmRinging ? (
        <AlarmScreen stopAlarm={stopAlarm} />
      ) : (
        <Text>Alarm App</Text>
      )} */}
      <Navigation />
    </SafeAreaView>
  );
}

export default App;
