import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Table, TableStatus } from '../../types';

interface TablesState {
  tables: Table[];
}

const initialState: TablesState = { tables: [] };

const tablesSlice = createSlice({
  name: 'tables',
  initialState,
  reducers: {
    setTables: (s, a: PayloadAction<Table[]>) => {
      s.tables = a.payload;
    },
    updateStatus: (s, a: PayloadAction<{ id: string; status: TableStatus }>) => {
      const t = s.tables.find(t => t.id === a.payload.id);
      if (t) t.status = a.payload.status;
    },
  },
});

export const { setTables, updateStatus } = tablesSlice.actions;
export default tablesSlice.reducer;
