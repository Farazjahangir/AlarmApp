import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { User, Group, ContactWithAccount, Contact } from './dataType';

type SelectedContacts = {
  [phoneNumber: string]: boolean; // Using an index signature
};

export type UpdateUserProfilePayload = {
  name?: string;
  address?: string;
  isActive?: boolean;
  isProfileComplete?: boolean;
};

export type UpdateUserProfile = (
  payload: UpdateUserProfilePayload,
  uid: string,
) => Promise<User>;

export type GetUsersInBatchByNumberPayload = string[];

export type GetUsersInBatchByNumber = (
  payload: GetUsersInBatchByNumberPayload,
) => Promise<User[]>;

export type AddUserProfilePayload = {
  isActive: Boolean;
  name: string;
  number: string;
  countryCode?: string;
  isProfileComplete: boolean;
  address?: boolean;
  deviceToken?: string;
  email?: string;
};

export type AddUserProfile = (payload: AddUserProfilePayload) => Promise<User>;

export type AddGroupPayload = {
  createdAt: FirebaseFirestoreTypes.FieldValue;
  createdBy: string;
  groupName: string;
  members: string[];
};
export type AddGroup = (payload: AddGroupPayload) => Promise<Group>;

export type CreateGroupPayload = {
  contacts: Contact[] | ContactWithAccount[];
  selectedContacts: SelectedContacts;
  groupName: string;
  currentUserUid: string;
  groupType: string;
  description?: string
};

export type CreateGroup = (payload: CreateGroupPayload) => Promise<Group>;

export type LoginFirebasePayload = {
  email: string;
  password: string
};

export type LoginFirebase = (payload: LoginFirebasePayload) => Promise<User>;


export type GetUserById = (uid: string) => Promise<User>;

