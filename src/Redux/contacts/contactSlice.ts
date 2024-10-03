import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  data: {
    contactsWithAccount: [],
    contactsWithoutAccount: []
  },
}

export const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setContacts: (state, action) => {
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