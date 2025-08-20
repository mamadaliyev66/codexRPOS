import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from './slices/authSlice';
import menu from './slices/menuSlice';
import tables from './slices/tablesSlice';
import orders from './slices/ordersSlice';
import cart from './slices/cartSlice';
import users from './slices/usersSlice';
import sync from './slices/syncSlice';

const rootReducer = combineReducers({ auth, menu, tables, orders, cart, users, sync });

const persistConfig = {
  key: 'rpos',
  storage: AsyncStorage,
  whitelist: ['auth', 'menu', 'tables', 'orders', 'cart', 'sync'],
};

const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
