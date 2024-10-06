import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: {
    user: null
  },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data.user = action.payload;
    },
    logout: (state) => {
      state.data.user = null
    }
  },
})

export const { setUser, logout } = userSlice.actions

export default userSlice.reducer