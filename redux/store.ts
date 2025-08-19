import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import auth from './slices/authSlice';
import menu from './slices/menuSlice';
import tables from './slices/tablesSlice';
import orders from './slices/ordersSlice';
import cart from './slices/cartSlice';
import users from './slices/usersSlice';
import sync from './slices/syncSlice';

const rootReducer = combineReducers({
  auth,
  menu,
  tables,
  orders,
  cart,
  users,
  sync,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
