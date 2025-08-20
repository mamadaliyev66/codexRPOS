import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { MenuCategory, MenuItem } from '../../types';
import {
  listCategories, listMenuItems, upsertCategory as svcUpsertCat, deleteCategory as svcDeleteCat,
  upsertMenuItem as svcUpsertItem, deleteMenuItem as svcDeleteItem,
} from '../../services/menu';
import { RootState } from '../store';
import { enqueue } from './syncSlice';
import type { SyncTask } from '../../types';

type MenuState = {
  categories: MenuCategory[];
  items: MenuItem[];
  loading: boolean;
  error?: string;
};

const initialState: MenuState = { categories: [], items: [], loading: false };

export const fetchMenu = createAsyncThunk('menu/fetch', async () => {
  const [cats, items] = await Promise.all([listCategories(), listMenuItems({})]);
  return { cats, items };
});

export const upsertCategory = createAsyncThunk('menu/upsertCategory', async (cat: MenuCategory) => {
  await svcUpsertCat(cat);
  return cat;
});

export const deleteCategory = createAsyncThunk('menu/deleteCategory', async (id: string) => {
  await svcDeleteCat(id);
  return id;
});

export const upsertMenuItem = createAsyncThunk<MenuItem, MenuItem, { state: RootState }>(
  'menu/upsertItem',
  async (item, { getState, dispatch }) => {
    const online = getState().sync.online;
    if (online) {
      await svcUpsertItem(item);
    } else {
      // optimistic local + queue
      const task: SyncTask = {
        id: `sync_${item.id}`,
        createdAt: Date.now(),
        retries: 0,
        op: { type: 'UPSERT_MENU', payload: item },
      };
      dispatch(enqueue(task));
    }
    return item;
  },
);

export const deleteMenuItem = createAsyncThunk('menu/deleteItem', async (id: string) => {
  await svcDeleteItem(id);
  return id;
});

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMenu.pending, (s) => { s.loading = true; s.error = undefined; });
    b.addCase(fetchMenu.fulfilled, (s, a) => {
      s.loading = false;
      s.categories = a.payload.cats;
      s.items = a.payload.items;
    });
    b.addCase(fetchMenu.rejected, (s, a) => { s.loading = false; s.error = String(a.error.message || a.error); });

    b.addCase(upsertCategory.fulfilled, (s, a) => {
      const i = s.categories.findIndex((c) => c.id === a.payload.id);
      if (i >= 0) s.categories[i] = a.payload; else s.categories.push(a.payload);
    });
    b.addCase(deleteCategory.fulfilled, (s, a) => {
      s.categories = s.categories.filter((c) => c.id !== a.payload);
    });

    b.addCase(upsertMenuItem.fulfilled, (s, a) => {
      const i = s.items.findIndex((it) => it.id === a.payload.id);
      if (i >= 0) s.items[i] = a.payload; else s.items.push(a.payload);
    });
    b.addCase(deleteMenuItem.fulfilled, (s, a) => {
      s.items = s.items.filter((it) => it.id !== a.payload);
    });
  },
});

export default menuSlice.reducer;
