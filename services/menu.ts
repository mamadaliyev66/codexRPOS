// services/menu.ts
import {
  getDocs, setDoc, updateDoc, deleteDoc, doc, addDoc, collection, query, where, orderBy,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/client';
import { tcol, tdoc, tenantId } from './_path';
import type { MenuCategory, MenuItem } from '../types';

// Categories
export async function listCategories(): Promise<MenuCategory[]> {
  const q = query(tcol('menuCategories'), orderBy('index', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as MenuCategory);
}

export async function upsertCategory(cat: MenuCategory) {
  await setDoc(tdoc('menuCategories', cat.id), cat, { merge: true });
}

export async function deleteCategory(id: string) {
  await deleteDoc(tdoc('menuCategories', id));
}

// Items
export async function listMenuItems(params?: { categoryId?: string; activeOnly?: boolean }) {
  const filters = [];
  if (params?.categoryId) filters.push(where('categoryId', '==', params.categoryId));
  if (params?.activeOnly) filters.push(where('active', '==', true));

  const base = collection(db, 'tenants', tenantId, 'menuItems');
  const q = filters.length ? query(base, ...filters, orderBy('name', 'asc')) : query(base, orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as MenuItem);
}

export async function upsertMenuItem(item: MenuItem) {
  await setDoc(tdoc('menuItems', item.id), item, { merge: true });
}

export async function deleteMenuItem(id: string) {
  await deleteDoc(tdoc('menuItems', id));
}

// Storage: upload an image from a local/file URI and return downloadURL
export async function uploadMenuImageFromUri(localUri: string, fileName: string) {
  // fetch → blob (works in Expo)
  const res = await fetch(localUri);
  const blob = await res.blob();
  const storageRef = ref(storage, `tenants/${tenantId}/menu/${fileName}`);
  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
}
