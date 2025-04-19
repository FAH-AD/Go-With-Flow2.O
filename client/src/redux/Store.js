import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './AuthSlice';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
    key: 'root',
    storage,
};

const persistedReducer = persistReducer(persistConfig, AuthSlice);

export const store = configureStore({
    reducer: {
        Auth: persistedReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // 🔥 Disable serializability check
        }),
});

export const persistor = persistStore(store);
