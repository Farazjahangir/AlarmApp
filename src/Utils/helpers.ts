import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';

import {Contact, ContactWithAccount, Group, User} from '../Types/dataType';
import {getUsersDataInBatchByNumber, addUser, addGroup} from './firebase';
import {getUserById} from './firebase';
import {cleanString} from '.';

type SelectedContacts = {
  [phoneNumber: string]: boolean; // Using an index signature
};

export const convertFirestoreDataIntoArrayOfObject = <T>(
  snapshot: FirebaseFirestoreTypes.QuerySnapshot,
): Array<T & {uid: string}> => {
  const data: Array<T & {uid: string}> = [];
  if (!snapshot.empty) {
    snapshot.forEach(doc => {
      data.push({...doc.data(), uid: doc.id} as T & {uid: string});
    });
  }
  return data;
};

export const separateActiveAndNonActiveContacts = (
  contacts: Contact[] | ContactWithAccount[],
  selectedContacts: SelectedContacts,
) => {
  const selectedContactsData: string[] = [];
  const contactsWithoutUID: Contact[] = [];
  const data = contacts;
  console.log('data =====>', data);
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

export const createSelectedUsersUIDArr = async (
  contacts: Contact[] | ContactWithAccount[],
  selectedContacts: SelectedContacts,
) => {
  const {selectedContactsData, contactsWithoutUID} =
    separateActiveAndNonActiveContacts(contacts, selectedContacts);

  // If no contacts need further processing, return early
  if (contactsWithoutUID.length === 0) return selectedContactsData;

  // Process Firestore data (both find and create users in one pass)
  const {foundUserUIDs, newUserUIDs} = await processFirestoreData(
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
    const users = await getUsersDataInBatchByNumber(batch);

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
          isProfileComplete: false,
        });
        // Add the new user's UID to the array
        newUserUIDs.push(newUser.uid);
        existingUIDs.add(contact.phoneNumber);
      }
    }
  }

  return {foundUserUIDs, newUserUIDs};
};

export const prepareGroupsArray = async (
  user: User,
  contactWithAccount: ContactWithAccount[],
  firestoreData: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
) => {
  let groupsWithMembersData: Group[] = [];
  const userUid = user.uid;
  // 2. Loop through each group
  for (const groupDoc of firestoreData.docs) {
    const groupData = groupDoc.data();
    let membersData: ContactWithAccount[] = [];

    // 3. Check for member UIDs in Redux state first
    for (const uid of groupData.members) {
      if (uid === userUid) {
        membersData.push({user});
      }
      if (uid !== userUid) {
        // Exclude current user
        let memberData = contactWithAccount.find(
          contact => contact.user?.uid === uid,
        );

        if (memberData) {
          // 4. If member data found in Redux, push it to membersData
          membersData.push(memberData);
        } else {
          // 5. If member data not found in Redux, fetch from Firestore
          const userData = await getUserById(uid);
          if (userData) {
            membersData.push({user: userData});
          }
        }
      }
    }

    // 7. Build the group object with member data
    groupsWithMembersData.push({
      uid: groupDoc.id,
      groupName: groupData.groupName,
      createdBy: groupData.createdBy,
      members: membersData,
      createdAt: groupData.createdAt,
      description: groupData.description || '',
      groupType: groupData.groupType,
      image: groupData.image
    });
  }
  return groupsWithMembersData;
};
