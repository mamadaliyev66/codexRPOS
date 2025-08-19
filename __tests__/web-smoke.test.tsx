import React from 'react';
import { render } from '@testing-library/react-native';
import OrdersHome from '../app/(tabs)/index';
import { UZ } from '../constants/i18n';

test('renders Uzbek greeting', () => {
  const { getByText } = render(<OrdersHome />);
  expect(getByText(/rPOS veb ilovasi ishga tushdi/i)).toBeTruthy();
  expect(getByText(`— ${UZ.orders}`)).toBeTruthy();
});
