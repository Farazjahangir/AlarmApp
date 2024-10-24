import React, {useEffect, useState, useRef} from 'react';
import {Alert, SafeAreaView, Text, Linking, AppState} from 'react-native';
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
import {navigate} from './src/Services/NavigationService';
import {
  checkNotificationPermission,
  askNotificationPermission,
  askContactsPermission,
  checkForBatteryOptimization,
} from './src/Utils';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {store, persistor} from './src/Redux/store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {getDataFromAsync, removeValueFromAsync} from './src/Utils';
import {ScreenNameConstants} from './src/Constants/navigationConstants';

const {AlarmSoundModule} = NativeModules;

function App(): React.JSX.Element {
  const [alarmRinging, setAlarmRinging] = useState(false);

  const appStateRef = useRef(false);

  const listenForForegroundMessage = async () => {
    messaging().onMessage(async remoteMessage => {
      try {
        const notifeeObj = JSON.parse(remoteMessage.data?.notifee as string);
        await AlarmManager.playAlarm();
        navigate(ScreenNameConstants.ALARM_SCREEN, {
          latitude: notifeeObj.data.latitude,
          longitude: notifeeObj.data.longitude,
        });
      } catch (e) {
        console.log('ERR => listenForForegroundMessage', e.message);
      }
    });
  };

  const stopAlarm = async () => {
    await AlarmManager.stopAlarm();
    setAlarmRinging(false);
  };

  const checkAsyncForNotif = async () => {
    try {
      const notifData = await getDataFromAsync('notif');
      let latitude: number;
      let longitude: number;

      console.log("notifData ====>", notifData)

      if (notifData) {
        latitude = notifData.latitude;
        longitude = notifData.longitude;
        // await removeValueFromAsync('notif');
      }
      if (AlarmManager.isAlarmRinging) {
          setTimeout(() => {
            navigate(ScreenNameConstants.ALARM_SCREEN, {
              latitude,
              longitude,
            });
          }, 500);
      }
    } catch (e) {
      console.log('checkAsyncForNotif ERR ==>', e.message);
    }
  };

  const takePermissions = async () => {
    const notificationRes = await askNotificationPermission();
    let contactRes;
    if (notificationRes !== 'settings_opened') {
      contactRes = await askContactsPermission();
    }

    await checkForBatteryOptimization();
  };

  const handleAppStateChange = async (nextAppState: string) => {
    console.log("handleAppStateChange ==========>")
    if (nextAppState === 'active') {
      // appStateRef.current = true;
      checkAsyncForNotif();
    }
    // else if (nextAppState !== 'active') {
    //   appStateRef.current = false;
    // }
  };

  useEffect(() => {
    takePermissions();
    listenForForegroundMessage();
    checkAsyncForNotif();
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      appStateListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{flexGrow: 1}}>
      {/* {alarmRinging ? (
        <AlarmScreen stopAlarm={stopAlarm} />
      ) : (
        <Text>Alarm App</Text>
      )} */}
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
}

export default App;
