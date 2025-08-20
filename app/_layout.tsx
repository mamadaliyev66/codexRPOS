import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../redux/store';

import Screen from '../components/ui/Screen';
import AppBar from '../components/ui/AppBar';
import ErrorBoundary from '../components/ui/ErrorBoundary';
import { UZ } from '../constants/i18n';
import { useNetStatus } from '../hooks/useNetStatus';
import { useSyncQueue } from '../hooks/useSyncQueue';

function Shell() {
  useNetStatus();
  useSyncQueue();
  return (
    <Screen padded>
      <AppBar title={UZ.appName} />
      <Stack screenOptions={{ headerShown: false }} />
    </Screen>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <PaperProvider>
            <ErrorBoundary>
              <Shell />
            </ErrorBoundary>
          </PaperProvider>
        </PersistGate>
      </ReduxProvider>
    </SafeAreaProvider>
  );
}
