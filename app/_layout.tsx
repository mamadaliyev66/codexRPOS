import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { PaperProvider } from 'react-native-paper';
import React from 'react';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </Provider>
  );
}
