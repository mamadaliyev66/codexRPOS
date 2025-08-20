import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../../firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { getDoc } from 'firebase/firestore';
import { tdoc } from '../../services/_path';
import { login as svcLogin, registerSelf as svcRegister, logout as svcLogout } from '../../services/auth';
import type { AppUser } from '../../types';

type AuthState = {
  status: 'idle' | 'loading' | 'authenticated' | 'error';
  uid?: string;
  profile?: AppUser | null;
  error?: string;
};

const initialState: AuthState = { status: 'idle' };

export const initAuth = createAsyncThunk('auth/init', async () => {
  return await new Promise<{ uid?: string; profile?: AppUser | null }>((resolve) => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(tdoc('users', u.uid));
        resolve({ uid: u.uid, profile: snap.exists() ? (snap.data() as AppUser) : null });
      } else {
        resolve({ uid: undefined, profile: null });
      }
      unsub();
    });
  });
});

export const login = createAsyncThunk('auth/login', async ({ email, password }: { email: string; password: string }) => {
  const res = await svcLogin(email, password);
  return { uid: res.user.uid, profile: res.profile };
});

export const registerSelf = createAsyncThunk(
  'auth/registerSelf',
  async (p: { email: string; password: string; displayName: string; role?: AppUser['role'] }) => {
    const profile = await svcRegister(p);
    return { uid: profile.uid, profile };
  },
);

export const signOut = createAsyncThunk('auth/logout', async () => {
  await svcLogout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<AppUser | null | undefined>) {
      state.profile = action.payload ?? null;
    },
  },
  extraReducers: (b) => {
    b.addCase(initAuth.pending, (s) => {
      s.status = 'loading';
    });
    b.addCase(initAuth.fulfilled, (s, a) => {
      s.uid = a.payload.uid;
      s.profile = a.payload.profile ?? null;
      s.status = a.payload.uid ? 'authenticated' : 'idle';
    });
    b.addCase(initAuth.rejected, (s, a) => {
      s.status = 'error';
      s.error = String(a.error.message || a.error);
    });
    b.addCase(login.pending, (s) => {
      s.status = 'loading';
    });
    b.addCase(login.fulfilled, (s, a) => {
      s.uid = a.payload.uid;
      s.profile = a.payload.profile ?? null;
      s.status = 'authenticated';
    });
    b.addCase(login.rejected, (s, a) => {
      s.status = 'error';
      s.error = String(a.error.message || a.error);
    });
    b.addCase(registerSelf.fulfilled, (s, a) => {
      s.uid = a.payload.uid;
      s.profile = a.payload.profile ?? null;
      s.status = 'authenticated';
    });
    b.addCase(signOut.fulfilled, (s) => {
      s.uid = undefined;
      s.profile = null;
      s.status = 'idle';
    });
  },
});

export const { setProfile } = authSlice.actions;
export default authSlice.reducer;
