import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Alert, Platform, Linking, PermissionsAndroid } from 'react-native';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import RNContacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';

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

export const normalizePhoneNumber = number => {
    if (!number) return ''; // Check if number exists
    return number.replace(/\s+/g, ''); // Remove spaces
};

export const transformContacts = contacts => {
    const transformedContacts = [];

    contacts.forEach(contact => {
        if (
            contact.phoneNumbers &&
            Array.isArray(contact.phoneNumbers) &&
            contact.phoneNumbers.length
        ) {
            const distinctNumbers = Array.from(
                new Set(
                    contact.phoneNumbers
                        .map(phone => normalizePhoneNumber(phone.number))
                        .filter(Boolean),
                ),
            );
            distinctNumbers.forEach(number => {
                const newContact = { ...contact };
                newContact.phoneNumber = number;
                transformedContacts.push(newContact);
            });
        }
    });

    return transformedContacts;
};

export const fetchContacts = async () => {
    const contacts = await RNContacts.getAll()
    const transformedData = transformContacts(contacts);
    return transformedData
}

export const checkContactsWithFirestore = async (data, authUser) => {
    try {
        const phoneNumbers = data.map(contact => contact.phoneNumber);
        const batchSize = 30;
        let contactsWithAccount = [];
        let contactsWithoutAccount = [];
        let firestoreNumbersSet = new Set();

        for (let i = 0; i < phoneNumbers.length; i += batchSize) {
            const batch = phoneNumbers.slice(i, i + batchSize);

            // 4. Fetch users from Firestore in batches
            const usersSnapshot = await firestore()
                .collection('users')
                .where('number', 'in', batch)
                .where('isActive', '==', true)
                .get();

            usersSnapshot.forEach(doc => {
                firestoreNumbersSet.add({ ...doc.data(), uid: doc.id });
            });
        }

        // 5. Split contacts into those with and without accounts
        for (const contact of data) {
            const phoneNumber = contact.phoneNumber;
            let foundInFirestore = false;
            firestoreNumbersSet.forEach(firestoreContact => {
                // Assuming phoneNumber is formatted consistently between Firestore and transformedData
                if (
                    firestoreContact.number === phoneNumber &&
                    phoneNumber !== authUser.number
                ) {
                    // If found in Firestore, push Firestore data to contactsWithAccount
                    contactsWithAccount.push(firestoreContact);
                    foundInFirestore = true;
                }
            });
            if (!foundInFirestore && phoneNumber !== authUser.number) {
                contactsWithoutAccount.push(contact);
            }
        }
        return {
            contactsWithAccount,
            contactsWithoutAccount
        }
    } catch (e) {
        console.log("checkContactsWithFirestore ERR ==>", e?.message || "Some Error")
    }
}

export const registerDeviceForFCM = async (uid) => {
    try {
        const token = await fetchDeviceToken();
        const userDocRef = firestore().collection('users').doc(uid);
        await userDocRef.update({
            deviceToken: token
        });
    } catch (e) {
        console.log('registerDeviceForFCM ERR', e.message);
    }
};

export const removeSpaces = (str) => {
    return str.replace(/\s+/g, '');
};

export const cleanString = (str) => {
    // Check if the string starts with a '+'
    const hasPlus = str.startsWith('+');

    // Remove all characters except digits and the starting '+'
    const cleaned = str.replace(/[^0-9]/g, '');

    // Add back the '+' at the start if it was present
    return hasPlus ? `+${cleaned}` : cleaned;
};

export const validateEmail = (email) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};