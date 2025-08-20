import reducer, { setUser, logout } from '../redux/slices/authSlice';
import { AppUser } from '../types';

test('handles login and logout', () => {
  const user: AppUser = { id: '1', email: 'a@a.com', role: 'admin', active: true };
  let state = reducer(undefined, setUser(user));
  expect(state.user?.id).toBe('1');
  state = reducer(state, logout());
  expect(state.user).toBeNull();
});
