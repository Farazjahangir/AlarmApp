
import firestore from '@react-native-firebase/firestore';

import { User } from '../Types/dataType';
import { UpdateUserProfilePayload, UpdateUserProfile } from '../Types/firebaseTypes';

export const updateUserProfile: UpdateUserProfile = async (payload, uid) => {
    const userDocRef = firestore().collection('users').doc(uid);
    await userDocRef.update(payload);
    const updatedDoc = await userDocRef.get();
    const user = {
        ...updatedDoc.data() as User,
        uid: updatedDoc.id
    }
    return user
}