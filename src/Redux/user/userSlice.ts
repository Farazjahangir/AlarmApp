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
      console.log("first")
      state.data.user = action.payload;
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer