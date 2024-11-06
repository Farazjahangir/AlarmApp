import { Contact as ContactLibType } from "react-native-contacts/type";

export type User = {
    deviceToken: string;
    email: string;
    isActive: Boolean;
    name: string;
    number: string;
    uid: string
    countryCode?: string;
    isProfileComplete?: boolean;
    address?: boolean
}

export interface Contact extends ContactLibType {
    phoneNumber: string;
    localFormat: string;
    localId: string
}

export interface ContactWithAccount extends Partial<Contact> {
    user?: Partial<User> | null;
}
// export type ContactWithAccount = User & {
//     localData: Contact;
//   };

export type Group = {
    createdAt: string;
    createdBy: string;
    groupName: string;
    members: string[];
    uid: string
}