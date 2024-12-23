import { configureStore } from '@reduxjs/toolkit'
import {
    persistReducer,
    persistStore,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import rootReducer from './rootReducer';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: []
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;