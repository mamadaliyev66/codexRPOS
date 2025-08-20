import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { Table, TableStatus } from '../../types';
import { listTables, upsertTable as svcUpsertTable, updateTableStatus as svcUpdateStatus, deleteTable as svcDelete } from '../../services/tables';
import { RootState } from '../store';
import { enqueue } from './syncSlice';
import type { SyncTask } from '../../types';

type TablesState = {
  list: Table[];
  loading: boolean;
  error?: string;
};

const initialState: TablesState = { list: [], loading: false };

export const fetchTables = createAsyncThunk('tables/fetch', async () => {
  return await listTables();
});

export const upsertTable = createAsyncThunk<Table, Table, { state: RootState }>(
  'tables/upsert',
  async (table, { getState, dispatch }) => {
    const online = getState().sync.online;
    if (online) {
      await svcUpsertTable(table);
    } else {
      const task: SyncTask = {
        id: `sync_table_${table.id}`,
        createdAt: Date.now(),
        retries: 0,
        op: { type: 'UPSERT_TABLE', payload: table },
      };
      dispatch(enqueue(task));
    }
    return table;
  },
);

export const setTableStatus = createAsyncThunk<{ id: string; status: TableStatus }, { id: string; status: TableStatus }, { state: RootState }>(
  'tables/setStatus',
  async ({ id, status }, { getState, dispatch }) => {
    const online = getState().sync.online;
    if (online) {
      await svcUpdateStatus(id, status);
    } else {
      // store optimistic state only; no dedicated sync op for status — covered by UPSERT_TABLE when table changes.
    }
    return { id, status };
  },
);

export const deleteTable = createAsyncThunk('tables/delete', async (id: string) => {
  await svcDelete(id);
  return id;
});

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTables.pending, (s) => { s.loading = true; s.error = undefined; });
    b.addCase(fetchTables.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; });
    b.addCase(fetchTables.rejected, (s, a) => { s.loading = false; s.error = String(a.error.message || a.error); });

    b.addCase(upsertTable.fulfilled, (s, a) => {
      const i = s.list.findIndex((t) => t.id === a.payload.id);
      if (i >= 0) s.list[i] = a.payload; else s.list.push(a.payload);
    });
    b.addCase(setTableStatus.fulfilled, (s, a) => {
      const t = s.list.find((x) => x.id === a.payload.id);
      if (t) t.status = a.payload.status;
    });
    b.addCase(deleteTable.fulfilled, (s, a) => {
      s.list = s.list.filter((t) => t.id !== a.payload);
    });
  },
});

export default tablesSlice.reducer;
