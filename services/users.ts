// services/users.ts
import { getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { tcol, tdoc } from './_path';
import type { AppUser, Role } from '../types';

export async function listUsers(): Promise<AppUser[]> {
  const q = query(tcol('users'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as AppUser);
}

export async function upsertUser(user: AppUser) {
  await setDoc(tdoc('users', user.uid), user, { merge: true });
}

export async function updateUserRole(uid: string, role: Role) {
  await updateDoc(tdoc('users', uid), { role });
}

export async function toggleUserActive(uid: string, active: boolean) {
  await updateDoc(tdoc('users', uid), { active });
}

export async function deleteUser(uid: string) {
  await deleteDoc(tdoc('users', uid));
}
