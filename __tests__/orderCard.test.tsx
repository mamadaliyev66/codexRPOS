import React from 'react';
import { render } from '@testing-library/react-native';
import OrderCard from '../components/order/OrderCard';
import type { Order } from '../types';

const order: Order = {
  id: 'ord_123456',
  tenantId: 'default',
  items: [],
  status: 'yangi',
  createdBy: 'tester',
  totals: { subtotal: 0, service: 0, tax: 0, grand: 0, discount: 0 },
  payments: [],
  createdAt: 1700000000000,
};

describe('OrderCard', () => {
  it('shows Uzbek status badge and id', () => {
    const { getByText } = render(<OrderCard order={order} />);
    expect(getByText(/BUYURTMA/i)).toBeTruthy();
    expect(getByText(/YANGI/i)).toBeTruthy();
  });
});
