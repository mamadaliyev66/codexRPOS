// services/tables.ts
import { getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { tcol, tdoc } from './_path';
import type { Table, TableStatus } from '../types';

export async function listTables(): Promise<Table[]> {
  const q = query(tcol('tables'), orderBy('name', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Table);
}

export async function upsertTable(table: Table) {
  await setDoc(tdoc('tables', table.id), table, { merge: true });
}

export async function updateTableStatus(id: string, status: TableStatus) {
  await updateDoc(tdoc('tables', id), { status });
}

export async function deleteTable(id: string) {
  await deleteDoc(tdoc('tables', id));
}
