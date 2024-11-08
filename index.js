/**
 * @format
 */

import {AppRegistry, Linking, LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {
  EventType,
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import 'react-native-get-random-values'

import AlarmManager from './src/Services/AlarmManager';
import {checkNotificationPermission} from './src/Utils';
import AlarmScreen from './src/Screens/AlarmScreen';
import { storeDataInAsync } from './src/Utils';

let channelId;

// Create the notification channel
const createChannel = async () => {
  channelId = channelId = await notifee.createChannel({
    id: 'alarmNotif',
    name: 'Alarm Notification',
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
  });
};

// Immediately create the notification channel when the app starts
createChannel();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  const denied = await checkNotificationPermission();
  if (denied) return;
  await AlarmManager.playAlarm();
  const notifeeObj = JSON.parse(remoteMessage.data.notifee)
  await notifee.displayNotification({
    ...notifeeObj,
    android: {
      ...notifeeObj.android,
      channelId: 'alarmNotif',
      lightUpScreen: true,
      pressAction: {
        id: 'default',
      },
    },
  });
  // Linking.openURL(notifeeObj.data.deep_link);
  await storeDataInAsync(notifeeObj.data, 'notif')
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'mute') {
    AlarmManager.stopAlarm();
  }

  if (type === EventType.PRESS) {
    console.log("onBackgroundEvent =====>")
    const deepLink = detail.notification.data?.deep_link;
    console.log("deepLink =========>", deepLink)
    if (deepLink) {
      // Open app with deep link
      // Linking.openURL(deepLink);
    }
  }
});

LogBox.ignoreAllLogs(true);
AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent('AlarmScreen', () => AlarmScreen);
