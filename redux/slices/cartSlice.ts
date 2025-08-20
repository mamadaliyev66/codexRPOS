import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CartItem = { id: string; name: string; price: number; qty: number; notes?: string; menuItemId?: string };
type CartState = { items: CartItem[] };

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const i = state.items.findIndex((x) => x.id === action.payload.id);
      if (i >= 0) state.items[i].qty += action.payload.qty;
      else state.items.push(action.payload);
    },
    setQty(state, action: PayloadAction<{ id: string; qty: number }>) {
      const it = state.items.find((x) => x.id === action.payload.id);
      if (it) it.qty = Math.max(1, action.payload.qty);
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((x) => x.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, setQty, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
