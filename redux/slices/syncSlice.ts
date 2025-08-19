import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SyncTask } from '../../types';

interface SyncState {
  online: boolean;
  queue: SyncTask[];
}

const initialState: SyncState = { online: true, queue: [] };

const syncSlice = createSlice({
  name: 'sync',
  initialState,
  reducers: {
    setOnline: (s, a: PayloadAction<boolean>) => {
      s.online = a.payload;
    },
    enqueue: (s, a: PayloadAction<SyncTask>) => {
      s.queue.push(a.payload);
    },
    processQueue: s => {
      // In real app we would sync with Firestore
      s.queue = [];
    },
  },
});

export const { setOnline, enqueue, processQueue } = syncSlice.actions;
export default syncSlice.reducer;
