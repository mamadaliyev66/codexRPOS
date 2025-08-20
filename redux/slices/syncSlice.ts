import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SyncTask } from '../../types';

type SyncState = {
  online: boolean;
  queue: SyncTask[];
  lastError?: string;
};

const initialState: SyncState = { online: false, queue: [] };

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.online = action.payload;
    },
    enqueue(state, action: PayloadAction<SyncTask>) {
      // de-dup by id
      if (!state.queue.find((t) => t.id === action.payload.id)) {
        state.queue.push(action.payload);
      }
    },
    dequeue(state, action: PayloadAction<string>) {
      state.queue = state.queue.filter((t) => t.id !== action.payload);
    },
    clearQueue(state) {
      state.queue = [];
    },
    setSyncError(state, action: PayloadAction<string | undefined>) {
      state.lastError = action.payload;
    },
  },
});

export const { setOnline, enqueue, dequeue, clearQueue, setSyncError } = syncSlice.actions;
export default syncSlice.reducer;
