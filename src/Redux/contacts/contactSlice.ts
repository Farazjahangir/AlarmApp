import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit';

import { ContactReducer } from '../../Types/reducers/contactReducer';

const initialState: ContactReducer = {
  loading: false,
  data: {
    contactsWithAccount: [],
    contactsWithoutAccount: []
  },
}

type SetContact = ContactReducer['data']


export const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<SetContact>) => {
      state.data.contactsWithAccount = action.payload.contactsWithAccount;
      state.data.contactsWithoutAccount = action.payload.contactsWithoutAccount;
    },
    setContactLoading : (state, action) => {
      state.loading = action.payload
    }
  },
})

export const { setContacts, setContactLoading } = contactSlice.actions

export default contactSlice.reducer