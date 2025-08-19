import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppUser } from '../../types';

interface UsersState {
  users: AppUser[];
}

const initialState: UsersState = { users: [] };

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (s, a: PayloadAction<AppUser[]>) => {
      s.users = a.payload;
    },
    upsertUser: (s, a: PayloadAction<AppUser>) => {
      const idx = s.users.findIndex(u => u.id === a.payload.id);
      if (idx >= 0) s.users[idx] = a.payload;
      else s.users.push(a.payload);
    },
  },
});

export const { setUsers, upsertUser } = usersSlice.actions;
export default usersSlice.reducer;
