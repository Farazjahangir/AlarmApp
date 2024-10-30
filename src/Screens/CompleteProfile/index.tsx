import {useState, useEffect, useRef} from 'react';
import {Text, View, Image, AppState, ScrollView} from 'react-native';

import Switch from '../../Components/Switch';
import {
  askNotificationPermission,
  askContactsPermission,
  requestLocationPermission,
  checkForBatteryOptimization,
} from '../../Utils';
import TextInput from '../../Components/TextInput';
import Button from '../../Components/Button';
import styles from './style';

const PERMISSION_LIST = {
  notification: false,
  contacts: false,
  location: false,
  batteryOptDisabled: false,
};

const CompleteProfile = () => {
  const [hasPermission, setHasPermission] = useState(PERMISSION_LIST);
  //   const [prevState, setPrevState] = useState(null);
  const prevAppState = useRef(AppState.currentState);
  // const permissionChecked = useRef(false);
  const isPermissionChecked = useRef(false);
  const isSettingsOpened = useRef(false);
  const hasPermissionRef = useRef({});

  // const checkIsAllGranted = async () => {
  //   const notificationRes = await askNotificationPermission();
  //   const contactRes = await askContactsPermission();

  //   return notificationRes === 'granted' && contactRes === 'granted';
  // };
  // const takePermissions = async () => {
  //   try {
  //     permissionChecked.current = true;
  //     isSettingsOpened.current = false;

  //     const notificationRes = await askNotificationPermission();
  //     const permissions = {...hasPermission};
  //     let contactRes;
  //     if (notificationRes !== 'settings_opened') {
  //       contactRes = await askContactsPermission();

  //       if (contactRes === 'settings_opened') {
  //         isSettingsOpened.current = true;
  //       }
  //     } else {
  //       isSettingsOpened.current = true;
  //     }
  //     console.log('contactRes', contactRes);
  //     permissions.sendNotification =
  //       permissions.sendNotification || notificationRes === 'granted';
  //     permissions.readContacts =
  //       permissions.readContacts || contactRes === 'granted';
  //     setHasPermission(permissions);

  //     if (notificationRes !== 'settings_opened') {
  //       permissionChecked.current = false;
  //     }
  //     //   await checkForBatteryOptimization();
  //   } catch (e) {
  //     console.log('takePermissions ==>', e.message);
  //   }
  // };

  // const handleAppStateChange2 = async currentState => {
  //   console.log('handleAppStateChange ==> PREV', prevAppState.current);
  //   console.log('handleAppStateChange ==> currentState', currentState);

  //   if (isSettingsOpened.current && currentState === 'active') {
  //     isSettingsOpened.current = false;
  //     permissionChecked.current = false;

  //     const isAllGranted = await checkIsAllGranted();

  //     if (!isAllGranted) {
  //       takePermissions();
  //       return;
  //     }

  //     return;
  //   }

  //   if (permissionChecked.current) {
  //     return;
  //   }
  //   // setPrevState(currentState);
  //   if (
  //     prevAppState.current === 'background' &&
  //     currentState === 'active' &&
  //     !permissionChecked.current
  //   ) {
  //     console.log('IFFFFFFFFFFFFFFFFFFFFFF');
  //     takePermissions();
  //   }
  //   prevAppState.current = currentState;
  // };

  // useEffect(() => {
  //   takePermissions();
  //   const appState = AppState.addEventListener('change', handleAppStateChange2);
  //   return () => {
  //     appState.remove();
  //   };
  // }, []);

  const requestPermission = async permissionName => {
    let permissionStatus = null;

    if (permissionName === 'notification') {
      permissionStatus = await askNotificationPermission();
    } else if (permissionName === 'contacts') {
      permissionStatus = await askContactsPermission();
    } else if (permissionName === 'location') {
      permissionStatus = await requestLocationPermission();
    } else if (permissionName === 'batteryOptDisabled') {
      permissionStatus = await checkForBatteryOptimization();
      console.log('battery Optimization', permissionStatus);
    }
    // Add more permissions here as needed
    // For example:
    // else if (permissionName === 'location') {
    //   permissionStatus = await askLocationPermission();
    // }

    if (permissionStatus === 'settings_opened') {
      isSettingsOpened.current = true;
    }

    return permissionStatus === 'granted';
  };

  const requestPermissions = async permissionsList => {
    try {
      isPermissionChecked.current = true;
      isSettingsOpened.current = false;

      const permissions = {...hasPermission};

      for (const permission of permissionsList) {
        const isGranted = await requestPermission(permission);
        permissions[permission] = permissions[permission] || isGranted;
        if (isSettingsOpened.current) break;
      }

      setHasPermission(permissions);
      hasPermissionRef.current = permissions;

      // Reset permission check flag if no settings were opened
      if (!isSettingsOpened.current) {
        isPermissionChecked.current = false;
      }
    } catch (error) {
      console.error('Error requesting permissions:', error.message);
    }
  };

  // Handle app state changes to recheck permissions if needed
  const handleAppStateChange = async currentAppState => {
    const prevAppStateStatus = prevAppState.current;
    prevAppState.current = currentAppState;

    if (isSettingsOpened.current && currentAppState === 'active') {
      isSettingsOpened.current = false;
      isPermissionChecked.current = false;

      // Check if all permissions are granted
      const allGranted = await Promise.all(
        Object.keys(hasPermissionRef.current).map(
          async perm => await requestPermission(perm),
        ),
      ).then(results => results.every(res => res));

      if (!allGranted) {
        requestPermissions(Object.keys(hasPermissionRef.current));
      }
      return;
    }

    // Request permissions on app return if not yet checked
    if (
      !isPermissionChecked.current &&
      prevAppStateStatus === 'background' &&
      currentAppState === 'active'
    ) {
      requestPermissions(Object.keys(hasPermissionRef.current));
    }
  };
  // };

  useEffect(() => {
    requestPermissions(Object.keys(PERMISSION_LIST)); // Initial permission list
    const appStateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => appStateListener.remove();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scollViewContentBox}
        showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.screenTitle}>Complete Your Profile</Text>
          <Text style={styles.title}>Your Email</Text>
          <Text style={styles.value}>Email</Text>
          <Text style={styles.title}>Your Number</Text>
          <Text style={styles.value}>03442778759</Text>
          <View style={styles.inputBox}>
            <TextInput containerStyle={styles.mt10} label="Name" />
            <TextInput containerStyle={styles.mt10} label="Address" />
          </View>
          <View style={styles.permissionBox}>
            <Text style={styles.permissionText}>Permissions</Text>
            <Switch
              label="Allow notification"
              containerStyle={styles.mt10}
              value={hasPermission.notification}
            />
            <Switch
              label="Can read contacts"
              containerStyle={styles.mt10}
              value={hasPermission.contacts}
            />
            <Switch
              label="Enable live location"
              containerStyle={styles.mt10}
              value={hasPermission.location}
            />
            <Switch
              label="Disable battery optimization"
              containerStyle={styles.mt10}
              value={hasPermission.batteryOptDisabled}
            />
          </View>
          <Button text="Next" containerStyle={styles.btnBox} />
        </View>
      </ScrollView>
    </View>
  );
};

export default CompleteProfile;