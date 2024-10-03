import { combineReducers } from '@reduxjs/toolkit';

import UserReducer from './user/userSlice';
import contactSlice from './contacts/contactSlice';

const rootReducer = combineReducers({
    user: UserReducer,
    contacts: contactSlice
});

export default rootReducer;
