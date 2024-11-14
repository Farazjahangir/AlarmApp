import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { CountryCode } from 'libphonenumber-js';

import { User, Group, ContactWithAccount, Contact } from './dataType';

type SelectedContacts = {
  [phoneNumber: string]: boolean; // Using an index signature
};

export type UpdateUserProfilePayload = {
  name?: string;
  address?: string;
  isActive?: boolean;
  isProfileComplete?: boolean;
  deviceToken?: string;
  image?: string;
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
  description?: string,
  image: string
};

export type CreateGroup = (payload: CreateGroupPayload) => Promise<Group>;

export type LoginFirebasePayload = {
  email: string;
  password: string
};

export type LoginFirebase = (payload: LoginFirebasePayload) => Promise<User | null>;


export type GetUserById = (uid: string) => Promise<User | null>;


export type FetchUserGroupsPayload = {
  user: User;
  contactWithAccount: ContactWithAccount[]
};

export type FetchUserGroups = (payload: FetchUserGroupsPayload) => Promise<Group[]>;

export type SignupFirebasePayload = {
  countryCode: CountryCode;
  user: {
    email: string;
    password: string;
    name: string;
    number: string;
  }
};

export type SignupFirebase = (payload: SignupFirebasePayload) => Promise<null>;

export type CheckUserWithPhoneNumberPayload = {
  countryCode: CountryCode;
  number: string;
};

export type CheckUserWithPhoneNumber = (payload: CheckUserWithPhoneNumberPayload) => Promise<User | null>;

export type CreateUserWithEmailAndPasswordFirebasePayload = {
  email: string;
  password: string;
  name: string;
  number: string;
  countryCode: CountryCode
};

export type CreateUserWithEmailAndPasswordFirebase = (payload: CreateUserWithEmailAndPasswordFirebasePayload) => Promise<null>;
