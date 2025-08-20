import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AppUser, Role, SyncTask } from '../../types';
import { listUsers, upsertUser as svcUpsert, updateUserRole as svcRole, toggleUserActive as svcActive, deleteUser as svcDelete } from '../../services/users';
import { RootState } from '../store';
import { enqueue } from './syncSlice';

type UsersState = {
  list: AppUser[];
  loading: boolean;
  error?: string;
};

const initialState: UsersState = { list: [], loading: false };

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  return await listUsers();
});

export const upsertUser = createAsyncThunk<AppUser, AppUser, { state: RootState }>(
  'users/upsert',
  async (user, { getState, dispatch }) => {
    const online = getState().sync.online;
    if (online) {
      await svcUpsert(user);
    } else {
      const task: SyncTask = {
        id: `sync_user_${user.uid}`,
        createdAt: Date.now(),
        retries: 0,
        op: { type: 'UPSERT_USER', payload: user },
      };
      dispatch(enqueue(task));
    }
    return user;
  },
);

export const setUserRole = createAsyncThunk<{ uid: string; role: Role }, { uid: string; role: Role }>(
  'users/role',
  async ({ uid, role }) => {
    await svcRole(uid, role);
    return { uid, role };
  },
);

export const setUserActive = createAsyncThunk<{ uid: string; active: boolean }, { uid: string; active: boolean }>(
  'users/active',
  async ({ uid, active }) => {
    await svcActive(uid, active);
    return { uid, active };
  },
);

export const deleteUser = createAsyncThunk<string, string>('users/delete', async (uid) => {
  await svcDelete(uid);
  return uid;
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchUsers.pending, (s) => { s.loading = true; s.error = undefined; });
    b.addCase(fetchUsers.fulfilled, (s, a) => { s.loading = false; s.list = a.payload; });
    b.addCase(fetchUsers.rejected, (s, a) => { s.loading = false; s.error = String(a.error.message || a.error); });

    b.addCase(upsertUser.fulfilled, (s, a) => {
      const i = s.list.findIndex((u) => u.uid === a.payload.uid);
      if (i >= 0) s.list[i] = a.payload; else s.list.push(a.payload);
    });
    b.addCase(setUserRole.fulfilled, (s, a) => {
      const u = s.list.find((x) => x.uid === a.payload.uid);
      if (u) u.role = a.payload.role;
    });
    b.addCase(setUserActive.fulfilled, (s, a) => {
      const u = s.list.find((x) => x.uid === a.payload.uid);
      if (u) u.active = a.payload.active;
    });
    b.addCase(deleteUser.fulfilled, (s, a) => {
      s.list = s.list.filter((u) => u.uid !== a.payload);
    });
  },
});

export default usersSlice.reducer;
