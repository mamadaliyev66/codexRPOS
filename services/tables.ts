import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/client';
import { Table, TableStatus } from '../types';

const tenant = process.env.EXPO_PUBLIC_TENANT_ID || 'default';

export const fetchTables = async (): Promise<Table[]> => {
  const snap = await getDocs(collection(db, 'tenants', tenant, 'tables'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
};

export const updateTableStatus = (id: string, status: TableStatus) =>
  updateDoc(doc(db, 'tenants', tenant, 'tables', id), { status });
