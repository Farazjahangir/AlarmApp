import { Contact as ContactLibType } from "react-native-contacts/type";

import { Contact, ContactWithAccount } from "../dataType";

export type ContactReducer = {
    loading: boolean
    data: {
        contactsWithoutAccount: ContactLibType[],
        contactsWithAccount: ContactWithAccount[]
    }
}