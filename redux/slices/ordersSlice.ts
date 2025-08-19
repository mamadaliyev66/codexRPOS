import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderStatus, Payment } from '../../types';

interface OrdersState {
  orders: Order[];
}

const initialState: OrdersState = { orders: [] };

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders: (s, a: PayloadAction<Order[]>) => {
      s.orders = a.payload;
    },
    addOrder: (s, a: PayloadAction<Order>) => {
      s.orders.push(a.payload);
    },
    updateStatus: (s, a: PayloadAction<{ id: string; status: OrderStatus }>) => {
      const o = s.orders.find(o => o.id === a.payload.id);
      if (o) o.status = a.payload.status;
    },
    addPayment: (s, a: PayloadAction<{ id: string; payment: Payment }>) => {
      const o = s.orders.find(o => o.id === a.payload.id);
      if (o) {
        o.payments.push(a.payload.payment);
      }
    },
  },
});

export const { setOrders, addOrder, updateStatus, addPayment } = ordersSlice.actions;
export default ordersSlice.reducer;
