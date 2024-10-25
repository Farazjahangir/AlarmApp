import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Alert, Platform, Linking, PermissionsAndroid } from 'react-native';
import { request, PERMISSIONS, check, RESULTS } from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import RNContacts from 'react-native-contacts';
import firestore from '@react-native-firebase/firestore';
import { parsePhoneNumber, AsYouType } from 'libphonenumber-js';
import Geolocation, { GeoPosition, GeoError } from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Contact as ContactLibType } from 'react-native-contacts/type';
import { Contact, ContactWithAccount, User } from '../Types/dataType';

export const checkNotificationPermission = async () => {
    try {
        let denied = true
        const settings = await notifee.getNotificationSettings()
        if (settings.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
            denied = false
        }

        return denied
    } catch (e) {
        throw e
    }
}

export const openAppSettings = async () => {
    if (Platform.OS === 'ios') {
        await Linking.openURL('app-settings:');  // Opens app settings on iOS
    } else {
        await Linking.openSettings();  // Opens app settings on Android
    }
}

export const askNotificationPermission = async (): Promise<'granted' | 'never_ask_again' | 'denied' | 'settings_opened'> => {
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
}

export const askContactsPermission = async (): Promise<'granted' | 'settings_opened' | 'never_ask_again' | 'denied'> => {
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

        } else {
            return reqRes === RESULTS.GRANTED ? "granted" : "denied"
        }
    }
    return "never_ask_again";
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
    } catch (e: any) {
        console.log("ERR fetching token", e.message)
    }
};

export const normalizePhoneNumber = (number: string) => {
    if (!number) return ''; // Check if number exists
    return number.replace(/\s+/g, ''); // Remove spaces
};

export const normalizePhoneNumberOnLocalFormat = (phoneNumber: string) => {
    // Remove spaces and other characters, keep + at the start if it exists
    let cleanedNumber: string = phoneNumber;

    if (cleanedNumber.startsWith('+')) {
        const num = parsePhoneNumber(cleanedNumber);
        cleanedNumber = num.formatNational();
        // Removing all special characters
        cleanedNumber = cleanedNumber.replace(/(?!^\+)[^\d]/g, '')
        // Add other country handling as needed
    }

    if (cleanedNumber.startsWith('0')) {
        cleanedNumber = cleanedNumber.substring(1);
    }
    cleanedNumber = removeSpaces(cleanedNumber)
    return cleanedNumber;
};

export const transformContacts = (contacts: ContactLibType[]) => {
    const transformedContacts: Contact[] = [];
    contacts.forEach(contact => {
        if (
            contact.phoneNumbers &&
            Array.isArray(contact.phoneNumbers) &&
            contact.phoneNumbers.length
        ) {
            const distinctNumbers = Array.from(
                new Set(
                    contact.phoneNumbers
                        .map(phone => normalizePhoneNumberOnLocalFormat(phone.number))
                        .filter(Boolean),
                ),
            );
            distinctNumbers.forEach(number => {
                const newContact: Contact = {
                    ...contact,
                    phoneNumber: number,
                    localFormat: normalizePhoneNumberOnLocalFormat(number)
                };
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

export const checkContactsWithFirestore = async (data: Contact[], authUser: User | null): Promise<{
    contactsWithAccount: ContactWithAccount[];
    contactsWithoutAccount: ContactLibType[];
}> => {
    try {
        const phoneNumbers = data.map(contact => (contact.localFormat));
        const batchSize = 30;
        let contactsWithAccount: ContactWithAccount[] = [];
        let contactsWithoutAccount: ContactLibType[] = [];
        let firestoreNumbersSet = new Set<User>();

        for (let i = 0; i < phoneNumbers.length; i += batchSize) {
            const batch = phoneNumbers.slice(i, i + batchSize);

            // 4. Fetch users from Firestore in batches
            const usersSnapshot = await firestore()
                .collection('users')
                .where('number', 'in', batch)
                .where('isActive', '==', true)
                .get();

            usersSnapshot.forEach(doc => {
                firestoreNumbersSet.add({ ...doc.data() as User, uid: doc.id });
            });
        }

        // 5. Split contacts into those with and without accounts
        for (const contact of data) {
            const phoneNumber = contact.localFormat;
            let foundInFirestore = false;
            firestoreNumbersSet.forEach(firestoreContact => {
                // Assuming phoneNumber is formatted consistently between Firestore and transformedData
                if (
                    firestoreContact.number === phoneNumber &&
                    phoneNumber !== authUser?.number
                ) {
                    const firebaseContactWithLocalData: ContactWithAccount = {
                        ...contact,
                        user: firestoreContact
                    }
                    // firestoreContact.localData = contact
                    // If found in Firestore, push Firestore data to contactsWithAccount
                    contactsWithAccount.push(firebaseContactWithLocalData);
                    foundInFirestore = true;
                }
            });
            if (!foundInFirestore && phoneNumber !== authUser?.number) {
                contactsWithoutAccount.push(contact);
            }
        }
        return {
            contactsWithAccount,
            contactsWithoutAccount
        }
    } catch (e) {
        console.log("checkContactsWithFirestore ERR ==>", e?.message || "Some Error")
        return {
            contactsWithAccount: [],
            contactsWithoutAccount: []
        };
    }
}

export const registerDeviceForFCM = async (uid: string) => {
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

export const removeSpaces = (str?: string) => {
    if (str) {
        return str.replace(/\s+/g, '');
    }
    return ""
};

export const cleanString = (str: string) => {
    // Check if the string starts with a '+'
    const hasPlus = str.startsWith('+');

    // Remove all characters except digits and the starting '+'
    const cleaned = str.replace(/[^0-9]/g, '');

    // Add back the '+' at the start if it was present
    return hasPlus ? `+${cleaned}` : cleaned;
};

export const validateEmail = (email: string) => {
    // Regular expression for basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const hasContactPermission = async () => {
    const hasPermission = await check(PERMISSIONS.ANDROID.READ_CONTACTS)
    if (hasPermission === RESULTS.GRANTED) return true
    return false
}

export const requestLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted === RESULTS.GRANTED) {
            return true
        }

        else {
            Alert.alert(
                'Permission Required',
                'Location permission is denied permanently. Please enable it from settings.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Open Settings', onPress: () => openAppSettings() },
                ],
                { cancelable: true },
            );
            return false
        }

    } catch (e) {
        console.log("requestLocationPermission ==>", e?.message)
    }
}

export const getPositionAsync = async (): Promise<GeoPosition> => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            (position: GeoPosition) => {
                console.log("POSITION ==>", position)
                resolve(position);
            },
            (error: GeoError) => {
                console.log("ERRRRR", error)
                reject(error);
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
        );
    });
}

export const storeDataInAsync = async (value: string | object, key: string) => {
    try {
        if (typeof value === 'string') {
            await AsyncStorage.setItem(key, value);
        }
        else if (typeof value === 'object') {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
        }

    } catch (e) {
        console.log("storeDataInAsync ==>", e.message)
    }
};

export const getDataFromAsync = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            try {
                const parsedValue = JSON.parse(value);
                return parsedValue;
            } catch (e) {
                return value;
            }
        }
        return null;
    } catch (e) {
        console.error('Error reading value from AsyncStorage', e.message);
        return null;
    }
};

export const removeValueFromAsync = (key: string) => (
    AsyncStorage.removeItem(key)
)