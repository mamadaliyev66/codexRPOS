import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OrderItem } from '../../types';

interface CartState {
  items: OrderItem[];
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (s, a: PayloadAction<OrderItem>) => {
      s.items.push(a.payload);
    },
    removeItem: (s, a: PayloadAction<string>) => {
      s.items = s.items.filter(i => i.id !== a.payload);
    },
    clear: s => {
      s.items = [];
    },
  },
});

export const { addItem, removeItem, clear } = cartSlice.actions;
export default cartSlice.reducer;
