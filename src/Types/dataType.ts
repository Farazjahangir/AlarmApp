import { Contact as ContactLibType } from "react-native-contacts/type";

export type User = {
    deviceToken: string;
    email: string;
    isActive: Boolean;
    name: string;
    number: string;
    uid: string
    countryCode?: string
}

export interface Contact extends ContactLibType {
    phoneNumber: string;
    localFormat: string
}

export interface ContactWithAccount extends Partial<Contact> {
    user?: Partial<User> | null;
}
// export type ContactWithAccount = User & {
//     localData: Contact;
//   };