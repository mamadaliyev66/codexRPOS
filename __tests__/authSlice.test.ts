jest.mock('../firebase/client', () => ({
  auth: {},
  db: {},
  storage: {},
}));
jest.mock('firebase/auth', () => ({ onAuthStateChanged: jest.fn() }));
jest.mock('firebase/firestore', () => ({ getDoc: jest.fn() }));

import reducer, { setProfile, signOut } from '../redux/slices/authSlice';
import { AppUser } from '../types';

test('setProfile and signOut clear auth state', () => {
  const user: AppUser = {
    uid: '1',
    tenantId: 't1',
    displayName: 'Test',
    email: 'a@a.com',
    role: 'admin',
    active: true,
    createdAt: 0,
  };
  let state = reducer(undefined, setProfile(user));
  expect(state.profile?.uid).toBe('1');
  state = reducer(state, signOut.fulfilled(undefined, '', undefined));
  expect(state.profile).toBeNull();
  expect(state.uid).toBeUndefined();
});
