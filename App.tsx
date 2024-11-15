import React, {useEffect, useState, useRef} from 'react';
import {Alert, SafeAreaView, Text, Linking, AppState} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

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
import HelpModal from './src/Components/HelpModal';
import ConfirmDialogContextProvider from './src/Context/ConfirmDialogueContextProvider';

const {AlarmSoundModule} = NativeModules;

const INITAL_HELP_MODAL_VALUES = {
  isOpen: false,
  data: {
    name: '',
    coords: {
      latitude: null,
      longitude: null,
    },
  },
};

type HelpModalValues = {
  isOpen: boolean;
  data: {
    name: string;
    coords: {
      latitude: number | null;
      longitude: number | null;
    };
  };
};

function App(): React.JSX.Element {
  const [alarmRinging, setAlarmRinging] = useState(false);
  const [helpModalDetails, setHelpModalDetails] = useState<HelpModalValues>(
    INITAL_HELP_MODAL_VALUES,
  );

  const appStateRef = useRef(false);
  const queryClient = new QueryClient();

  const listenForForegroundMessage = async () => {
    messaging().onMessage(async remoteMessage => {
      try {
        const notifeeObj = JSON.parse(remoteMessage.data?.notifee as string);
        await AlarmManager.playAlarm();
        setHelpModalDetails({
          isOpen: true,
          data: {
            name: notifeeObj.data.name,
            coords: {
              latitude: notifeeObj.data.latitude,
              longitude: notifeeObj.data.longitude,
            },
          },
        });
        // navigate(ScreenNameConstants.ALARM_SCREEN, {
        //   latitude: notifeeObj.data.latitude,
        //   longitude: notifeeObj.data.longitude,
        // });
      } catch (e) {
        console.log('ERR => listenForForegroundMessage', e.message);
      }
    });
  };

  console.log('HELP MODAL', helpModalDetails);

  const stopAlarm = async () => {
    await AlarmManager.stopAlarm();
    setAlarmRinging(false);
  };

  const checkAsyncForNotif = async () => {
    try {
      const notifData = await getDataFromAsync('notif');
      let latitude: number;
      let longitude: number;
      let name = '';

      if (notifData) {
        latitude = notifData.latitude;
        longitude = notifData.longitude;
        name = notifData.name;
        // await removeValueFromAsync('notif');
      }
      if (notifData) {
        setTimeout(() => {
          setHelpModalDetails({
            isOpen: true,
            data: {
              name,
              coords: {
                latitude,
                longitude,
              },
            },
          });
          // navigate(ScreenNameConstants.ALARM_SCREEN, {
          //   latitude,
          //   longitude,
          // });
        }, 500);
      }
    } catch (e) {
      console.log('checkAsyncForNotif ERR ==>', e.message);
    }
  };

  const takePermissions = async () => {
    try {
      const notificationRes = await askNotificationPermission();
      let contactRes;
      if (notificationRes !== 'settings_opened') {
        contactRes = await askContactsPermission();
      }
      await checkForBatteryOptimization();
    } catch (e) {
      console.log('takePermissions ==>', e.message);
    }
  };

  const handleAppStateChange = async (nextAppState: string) => {
    if (nextAppState === 'active') {
      // appStateRef.current = true;
      checkAsyncForNotif();
    }
    // else if (nextAppState !== 'active') {
    //   appStateRef.current = false;
    // }
  };

  const onCloseHelpModal = async () => {
    setHelpModalDetails(INITAL_HELP_MODAL_VALUES);
    AlarmManager.stopAlarm();
    await removeValueFromAsync('notif');
  };

  useEffect(() => {
    // takePermissions();
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
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{flex: 1}}>
              <HelpModal
                isVisible={helpModalDetails.isOpen}
                data={helpModalDetails.data}
                onClose={onCloseHelpModal}
              />
              <BottomSheetModalProvider>
                <ConfirmDialogContextProvider>
                  <Navigation />
                </ConfirmDialogContextProvider>
              </BottomSheetModalProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
}

export default App;
