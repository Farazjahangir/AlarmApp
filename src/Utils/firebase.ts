import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { User, Group, Contact, ContactWithAccount } from '../Types/dataType';
import {
    UpdateUserProfilePayload,
    UpdateUserProfile,
    GetUsersInBatchByNumber,
    AddUserProfile,
    AddGroup,
    CreateGroup,
} from '../Types/firebaseTypes';
import {
    convertFirestoreDataIntoArrayOfObject,
    createSelectedUsersUIDArr,
} from './helpers';

export const updateUserProfile: UpdateUserProfile = async (payload, uid) => {
    const userDocRef = firestore().collection('users').doc(uid);
    await userDocRef.update(payload);
    const updatedDoc = await userDocRef.get();
    const user = {
        ...(updatedDoc.data() as User),
        uid: updatedDoc.id,
    };
    return user;
};

export const getUsersDataInBatchByNumber: GetUsersInBatchByNumber =
    async batch => {
        const usersSnapshot: FirebaseFirestoreTypes.QuerySnapshot =
            await firestore().collection('users').where('number', 'in', batch).get();
        return convertFirestoreDataIntoArrayOfObject(usersSnapshot);
    };

export const addUser: AddUserProfile = async payload => {
    const newUserRef = await firestore().collection('users').add(payload);
    return {
        ...((await newUserRef.get()).data() as User),
        uid: newUserRef.id,
    };
};

export const addGroup: AddGroup = async payload => {
    const newGroupRef = await firestore().collection('groups').add(payload);
    return {
        ...((await newGroupRef.get()).data() as Group),
        uid: newGroupRef.id,
    };
};

export const createGroup: CreateGroup = async (
    { contacts,
        selectedContacts,
        groupName,
        currentUserUid, 
        groupType,
        description
    }
) => {
    const uids = await createSelectedUsersUIDArr(contacts, selectedContacts);
    const data = {
        groupName: groupName,
        createdBy: currentUserUid,
        members: [currentUserUid, ...uids],
        createdAt: firestore.FieldValue.serverTimestamp(),
        groupType,
        description
    };
    return addGroup(data);
};