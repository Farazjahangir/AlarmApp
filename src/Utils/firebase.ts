import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { User, Group, Contact, ContactWithAccount } from '../Types/dataType';
import {
    UpdateUserProfilePayload,
    UpdateUserProfile,
    GetUsersInBatchByNumber,
    AddUserProfile,
    AddGroup,
    CreateGroup,
    LoginFirebase,
    GetUserById,
    FetchUserGroups
} from '../Types/firebaseTypes';
import {
    convertFirestoreDataIntoArrayOfObject,
    createSelectedUsersUIDArr,
    prepareGroupsArray
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

export const loginFirebase: LoginFirebase = async ({ email, password }) => {
    const authUser = await auth().signInWithEmailAndPassword(
        email,
        password,
    );
    return getUserById(authUser.user.uid)
}

export const getUserById: GetUserById = async (uid) => {
    const userDataSnapshot = await firestore()
        .collection('users')
        .doc(uid)
        .get();
    if (!userDataSnapshot.exists) return null
    return ({
        ...userDataSnapshot.data(),
        uid: userDataSnapshot.id,
    } as User)
}

export const fetchUserGroups: FetchUserGroups = async ({ user, contactWithAccount }) => {
    const groupSnapshots = await firestore()
        .collection('groups')
        .where('members', 'array-contains', user.uid)
        .orderBy('createdAt', 'desc')
        .get();
    if (!groupSnapshots.empty) {
        return await prepareGroupsArray(user, contactWithAccount, groupSnapshots)
    }
    return []
}