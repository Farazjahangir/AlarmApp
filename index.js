/**
 * @format
 */

import {AppRegistry, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import AlarmManager from './src/Services/AlarmManager';

notifee.createChannel({
  id: 'default',
  name: 'Default Channel',
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('NOTIF RECEIVED ===>', remoteMessage);
  await AlarmManager.playAlarm();
  await notifee.displayNotification(JSON.parse(remoteMessage.data.notifee));
});

notifee.onBackgroundEvent(async ({type, detail}) => {
  if (type === EventType.ACTION_PRESS && detail.pressAction?.id === 'mute') {
    AlarmManager.stopAlarm();
  }

  if (type === EventType.PRESS) {
    const deepLink = detail.notification.data?.deep_link;
    if (deepLink) {
      // Open app with deep link
      Linking.openURL(deepLink);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
