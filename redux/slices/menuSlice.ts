import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem, MenuCategory } from '../../types';

interface MenuState {
  categories: MenuCategory[];
  items: MenuItem[];
}

const initialState: MenuState = {
  categories: [],
  items: [],
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setCategories: (s, a: PayloadAction<MenuCategory[]>) => {
      s.categories = a.payload;
    },
    setItems: (s, a: PayloadAction<MenuItem[]>) => {
      s.items = a.payload;
    },
  },
});

export const { setCategories, setItems } = menuSlice.actions;
export default menuSlice.reducer;
