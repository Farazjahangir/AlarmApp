import firestore, {
    FirebaseFirestoreTypes,
    Filter
} from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import parsePhoneNumber, { CountryCode } from 'libphonenumber-js';

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
    FetchUserGroups,
    SignupFirebase,
    CheckUserWithPhoneNumber,
    CreateUserWithEmailAndPasswordFirebase,
    LeaveGroup,
    EditGroup,
    ProcessUpdateGroup
} from '../Types/firebaseTypes';
import {
    convertFirestoreDataIntoArrayOfObject,
    createSelectedUsersUIDArr,
    handleFirebaseAuthError,
    prepareGroupsArray
} from './helpers';
import { removeSpaces } from '.';
import { createUser } from './api';

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

export const updateGroup: EditGroup = async (payload) => {
    const groupDocRef = firestore().collection('groups').doc(payload.uid);
    await groupDocRef.update(payload.data);
    return null
};

export const createGroup: CreateGroup = async (
    { contacts,
        selectedContacts,
        groupName,
        currentUserUid,
        groupType,
        description,
        image
    }
) => {
    const uids = await createSelectedUsersUIDArr(contacts, selectedContacts);
    const data = {
        groupName: groupName,
        createdBy: currentUserUid,
        members: [currentUserUid, ...uids],
        createdAt: firestore.FieldValue.serverTimestamp(),
        groupType,
        description,
        image
    };
    return addGroup(data);
};

export const processUpdateGroup: ProcessUpdateGroup = async (
    { contacts,
        selectedContacts,
        groupName,
        currentUserUid,
        groupType,
        description,
        image,
        groupUid
    }
) => {
    const uids = await createSelectedUsersUIDArr(contacts, selectedContacts);
    const payload = {
        data: {
            groupName: groupName,
            createdBy: currentUserUid,
            members: [currentUserUid, ...uids],
            createdAt: firestore.FieldValue.serverTimestamp(),
            groupType,
            description,
            image
        },
        uid: groupUid
    }
    return updateGroup(payload);
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

export const checkUserWithPhoneNumber: CheckUserWithPhoneNumber = async ({ countryCode, number }) => {
    const num = parsePhoneNumber(number, countryCode);
    const internationalFormat = num?.formatInternational();
    const nationalFormat = num?.formatNational();
    const snapShot = await firestore()
        .collection('users')
        .where(
            Filter.or(
                Filter('number', '==', removeSpaces(internationalFormat)),
                Filter('number', '==', removeSpaces(nationalFormat)),
                Filter('number', '==', number),
            ),
        )
        .get();
    if (snapShot.empty) return null;
    return {
        ...snapShot.docs[0].data() as User,
        uid: snapShot.docs[0].id
    }
}

export const createUserWithEmailPasswordFirebase: CreateUserWithEmailAndPasswordFirebase = async (payload) => {
    const authUser = await auth().createUserWithEmailAndPassword(
        payload.email.trim(),
        payload.password
    );
    console.log("authUser", authUser)
    await firestore().collection('users').doc(authUser.user.uid).set({
        name: payload.name,
        email: payload.email.trim(),
        number: payload.number,
        isActive: true,
        countryCode: payload.countryCode,
        isProfileComplete: false,
    });
    return null
}


export const signupFirebase: SignupFirebase = async ({ user, countryCode }) => {
    const userData = await checkUserWithPhoneNumber({ countryCode, number: user.number })
    if (userData) {
        if (userData.isActive) throw new Error("Phone number Already Exist")
        await createUser({ ...user, uid: userData.uid, countryCode })
    }
    else {
        const payload = {
            name: user.name,
            email: user.email.trim(),
            number: user.number,
            countryCode,
            password: user.password
        }
        await createUserWithEmailPasswordFirebase(payload)
    }
    return null
}

export const leaveGroup: LeaveGroup = async ({ groupUid, userUid }) => {
    await firestore()
        .collection('groups')
        .doc(groupUid)
        .update({
            members: firestore.FieldValue.arrayRemove(userUid),
        });
    return null
}