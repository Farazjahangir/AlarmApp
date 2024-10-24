import { createSlice } from '@reduxjs/toolkit'
import type {PayloadAction} from '@reduxjs/toolkit';

import { UserReducer } from '../../Types/reducers/userReducer';
import { User } from '../../Types/dataType';

const initialState: UserReducer = {
  data: {
    user: null
  },
}

type SetUser = {
  user: User;
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<SetUser>) => {
      state.data.user = action.payload.user;
    },
    logout: (state) => {
      state.data.user = null
    }
  },
})

export const { setUser, logout } = userSlice.actions

export default userSlice.reducer