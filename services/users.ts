import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/client';
import { AppUser } from '../types';

const tenant = process.env.EXPO_PUBLIC_TENANT_ID || 'default';

export const fetchUsers = async (): Promise<AppUser[]> => {
  const snap = await getDocs(collection(db, 'tenants', tenant, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
};

export const saveUser = (user: AppUser) => setDoc(doc(db, 'tenants', tenant, 'users', user.id), user);
