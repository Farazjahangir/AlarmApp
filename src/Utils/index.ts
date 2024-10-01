import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Alert, Platform, Linking, PermissionsAndroid } from 'react-native';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';

export const checkNotificationPermission = async () => {
    try {
        let denied = true
        const settings = await notifee.getNotificationSettings()
        if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
            denied = false
        }

        return denied
    } catch (e) {
        return e
    }
}

export const openAppSettings = async () => {
    if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');  // Opens app settings on iOS
    } else {
        await Linking.openSettings();  // Opens app settings on Android
    }
}

export const askNotificationPermission = async () => {
    try {
        const settings = await notifee.getNotificationSettings();
        if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
            return "granted"
        }

        else if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
            // You may need to guide the user to settings to re-enable permissions
            return new Promise((resolve) => (
                Alert.alert(
                    'Notifications Disabled',
                    'To recieve alarm notifications, please enable notifications permission in the app settings.',
                    [{
                        text: 'Open Settings', onPress: async () => {
                            await openAppSettings()
                            resolve("settings_opened")
                        }
                    }, { text: "Cancel", style: "cancel", onPress: () => resolve("never_ask_again") }]
                )
            ))
        } else {
            // Request permission if it was not determined or provisional
            const permission = await notifee.requestPermission();
            return permission.authorizationStatus === AuthorizationStatus.AUTHORIZED ? "granted" : "denied"
        }
    } catch (e) {
        console.log("ERR", e.message)
    }
}

export const askContactsPermission = async () => {
    const hasPermission = await check(PERMISSIONS.ANDROID.READ_CONTACTS)

    if (hasPermission === RESULTS.GRANTED) {
        return "granted"
    }
    else if (hasPermission === RESULTS.DENIED) {
        const reqRes = await request(PERMISSIONS.ANDROID.READ_CONTACTS)
        if (reqRes === RESULTS.BLOCKED) {
            return new Promise((resolve) => (
                Alert.alert(
                    "Contacts Permission Required",
                    "You have denied access to contacts permission. Please go to settings to enable the permission.",
                    [
                        {
                            text: "Go to Settings", onPress: async () => {
                                // Open app settings
                                await openAppSettings()
                                resolve("settings_opened")
                            }
                        },
                        { text: "Cancel", style: "cancel", onPress: () => resolve("never_ask_again") }
                    ]
                )
            ))

        }
    }
}

export const checkForBatteryOptimization = async () => {
    const isOptimied = await notifee.isBatteryOptimizationEnabled();
    if (isOptimied) {
        Alert.alert(
            'Restrictions Detected',
            'To ensure notifications are delivered in backgroud, please disable battery optimization for the app.',
            [
                // 3. launch intent to navigate the user to the appropriate screen
                {
                    text: 'OK, open settings',
                    onPress: async () =>
                        await notifee.openBatteryOptimizationSettings(),
                },
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
            ],
            { cancelable: false },
        );
    }
};

export const fetchDeviceToken = async () => {
    try {
        await messaging().registerDeviceForRemoteMessages();
        const token = await messaging().getToken();
        return token
    } catch (e) {
        console.log("ERR fetching token", e.message)
    }
};