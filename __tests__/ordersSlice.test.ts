jest.mock('../services/orders', () => ({
  listOrdersByStatus: jest.fn(),
  createOrder: jest.fn(),
  addItem: jest.fn(),
  updateOrderStatus: jest.fn(),
  addPayment: jest.fn(),
  closeOrder: jest.fn(),
}));

import ordersReducer, { upsertLocal } from '../redux/slices/ordersSlice';
import type { Order } from '../types';

const base: Order = {
  id: 'ord_test',
  tenantId: 'default',
  tableId: 'T01',
  items: [],
  status: 'yangi',
  createdBy: 'tester',
  totals: { subtotal: 0, service: 0, tax: 0, grand: 0, discount: 0 },
  payments: [],
  createdAt: Date.now(),
};

function initState() {
  return {
    byId: {},
    lists: { yangi: [], oshxonada: [], tayyor: [], yopilgan: [] },
    loading: false,
  } as ReturnType<typeof ordersReducer>;
}

describe('ordersSlice', () => {
  it('upserts locally and places id into correct status list', () => {
    const s1 = ordersReducer(initState(), upsertLocal(base));
    expect(s1.byId['ord_test']).toBeTruthy();
    expect(s1.lists.yangi).toContain('ord_test');

    const moved = { ...base, status: 'oshxonada' as const };
    const s2 = ordersReducer(s1, upsertLocal(moved));
    expect(s2.lists.yangi).not.toContain('ord_test');
    expect(s2.lists.oshxonada).toContain('ord_test');
  });
});
