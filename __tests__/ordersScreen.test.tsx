import React from 'react';
import { render } from '@testing-library/react-native';
import Orders from '../app/(tabs)/orders';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from '../redux/slices/ordersSlice';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';

const renderWithStore = (component: React.ReactElement) => {
  const store = configureStore({ reducer: { orders: ordersReducer } });
  return render(
    <Provider store={store}>
      <PaperProvider>
        <SafeAreaProvider>{component}</SafeAreaProvider>
      </PaperProvider>
    </Provider>
  );
};

test('renders empty orders list', () => {
  const { getByTestId } = renderWithStore(<Orders />);
  getByTestId('orders-list');
});
