import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Alert, Platform, Linking, PermissionsAndroid } from 'react-native';

export const checkNotificationPermission = async () => {
    try {
        let denied = true
        const settings = await notifee.getNotificationSettings()
        console.log("settings.authorizationStatus", settings.authorizationStatus)
        if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
            denied = false
        }

        return denied
    } catch (e) {
        return e
    }
}

export const openAppSettings = () => {
    if (Platform.OS === 'ios') {
        Linking.openURL('app-settings:');  // Opens app settings on iOS
    } else {
        Linking.openSettings();  // Opens app settings on Android
    }
}

export const askNotificationPermission = async () => {
    try {
        const settings = await notifee.getNotificationSettings();
    
        if (settings.authorizationStatus === AuthorizationStatus.DENIED) {
            // You may need to guide the user to settings to re-enable permissions
            return (
                Alert.alert(
                    'Notifications Disabled',
                    'Please enable notifications in the app settings.',
                    [{ text: 'Open Settings', onPress: () => openAppSettings() }]
                )
            )
        } else {
            // Request permission if it was not determined or provisional
            const permission = await notifee.requestPermission();
            console.log('Requested permission:', permission);
        }
    } catch (e) {
        console.log("ERR", e.message)
    }
}
