import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { Contact, ContactWithAccount } from '../Types/dataType';
import { getUsersDataInBatchByNumber, addUser, addGroup } from "./firebase"
import { cleanString } from '.';

type SelectedContacts = {
    [phoneNumber: string]: boolean; // Using an index signature
}

export const convertFirestoreDataIntoArrayOfObject = <T>(snapshot: FirebaseFirestoreTypes.QuerySnapshot): Array<T & { uid: string }> => {
    const data: Array<T & { uid: string }> = [];
    if (!snapshot.empty) {
        snapshot.forEach(doc => {
            data.push({ ...doc.data(), uid: doc.id } as T & { uid: string });
        });
    }
    return data;
};


export const separateActiveAndNonActiveContacts = (contacts: Contact[] | ContactWithAccount[], selectedContacts: SelectedContacts) => {
    const selectedContactsData: string[] = [];
    const contactsWithoutUID: Contact[] = [];
    const data = contacts;
    data.forEach((contact: ContactWithAccount) => {
        if (contact.phoneNumber && selectedContacts[contact.phoneNumber]) {
            if (contact.user?.uid) {
                // Add contacts with UID directly
                selectedContactsData.push(
                    (contact as ContactWithAccount).user?.uid as string,
                );
            } else {
                // Collect contacts without UID for later processing
                contactsWithoutUID.push(contact as Contact);
            }
        }
    });

    return {
        selectedContactsData,
        contactsWithoutUID,
    };
};

export const createSelectedUsersUIDArr = async (contacts: Contact[] | ContactWithAccount[], selectedContacts: SelectedContacts) => {
    const { selectedContactsData, contactsWithoutUID } =
        separateActiveAndNonActiveContacts(contacts, selectedContacts);

    // If no contacts need further processing, return early
    if (contactsWithoutUID.length === 0) return selectedContactsData;

    // Process Firestore data (both find and create users in one pass)
    const { foundUserUIDs, newUserUIDs } = await processFirestoreData(
        contactsWithoutUID,
    );

    return [...selectedContactsData, ...foundUserUIDs, ...newUserUIDs];
};


export const processFirestoreData = async (contactsWithoutUID: Contact[]) => {
    const foundUserUIDs: string[] = [];
    const newUserUIDs: string[] = [];
    const batchSize = 30; // Firestore 'in' query can handle up to 30 numbers
    const existingUIDs = new Set();

    for (let i = 0; i < contactsWithoutUID.length; i += batchSize) {
        const batch = contactsWithoutUID
            .slice(i, i + batchSize)
            .map(contact => contact.phoneNumber);
        // Query Firestore for the current batch of phone numbers
        const users = await getUsersDataInBatchByNumber(batch)

        users.forEach(user => {
            const foundContact = contactsWithoutUID.find(
                c => c.phoneNumber === user.number,
            );
            if (foundContact) {
                foundUserUIDs.push(user.uid);
                existingUIDs.add(user.number); // Mark as found
            }
        });

        // Step 3: Handle remaining contacts not found in Firestore (create new users)
        for (const contact of contactsWithoutUID) {
            if (!existingUIDs.has(contact.phoneNumber)) {
                const newUser = await addUser({
                    name: contact.displayName,
                    number: cleanString(contact.phoneNumber),
                    isActive: false,
                    deviceToken: '',
                    email: '',
                    isProfileComplete: false
                })
                // Add the new user's UID to the array
                newUserUIDs.push(newUser.uid);
                existingUIDs.add(contact.phoneNumber);
            }
        }
    }

    return { foundUserUIDs, newUserUIDs };
};
