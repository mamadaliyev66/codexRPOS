// services/auth.ts
// Client-side Auth helpers. Note: creating other users without signing out
// requires an Admin backend (Cloud Functions). This implements self-register.

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { setDoc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase/client';
import { tdoc } from './_path';
import type { AppUser, Role } from '../types';

export async function login(email: string, password: string) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  // fetch profile
  const profileSnap = await getDoc(tdoc('users', cred.user.uid));
  return { user: cred.user, profile: profileSnap.exists() ? (profileSnap.data() as AppUser) : null };
}

export async function registerSelf(params: {
  email: string;
  password: string;
  displayName: string;
  role?: Role; // default 'waiter'
}) {
  const { email, password, displayName, role = 'waiter' } = params;
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });

  const userDoc: AppUser = {
    uid: cred.user.uid,
    tenantId: process.env.EXPO_PUBLIC_TENANT_ID || 'default',
    displayName,
    email,
    role,
    active: true,
    createdAt: Date.now(),
  };
  await setDoc(tdoc('users', cred.user.uid), userDoc);
  return userDoc;
}

export async function logout() {
  await signOut(auth);
}
