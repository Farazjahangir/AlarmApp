import { combineReducers } from '@reduxjs/toolkit';

import UserReducer from './user/userSlice';

const rootReducer = combineReducers({
    user: UserReducer,
});

export default rootReducer;
