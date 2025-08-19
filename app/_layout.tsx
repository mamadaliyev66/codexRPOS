import 'react-native-gesture-handler';
import React from 'react';
import { Stack } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ErrorBoundary>
          <Stack screenOptions={{ headerShown: false }} />
        </ErrorBoundary>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
