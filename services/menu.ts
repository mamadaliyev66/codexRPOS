import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/client';
import { MenuCategory, MenuItem } from '../types';

const tenant = process.env.EXPO_PUBLIC_TENANT_ID || 'default';

export const fetchMenu = async (): Promise<{ categories: MenuCategory[]; items: MenuItem[] }> => {
  const catSnap = await getDocs(collection(db, 'tenants', tenant, 'menuCategories'));
  const itemSnap = await getDocs(collection(db, 'tenants', tenant, 'menuItems'));
  return {
    categories: catSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })),
    items: itemSnap.docs.map(d => ({ id: d.id, ...(d.data() as any) })),
  };
};

export const addMenuItem = (item: Omit<MenuItem, 'id'>) => addDoc(collection(db, 'tenants', tenant, 'menuItems'), item);
export const updateMenuItem = (id: string, item: Partial<MenuItem>) => updateDoc(doc(db, 'tenants', tenant, 'menuItems', id), item);
