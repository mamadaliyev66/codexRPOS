// services/sync.ts
import type { SyncTask } from '../types';
import { createOrder, updateOrderStatus, addPayment } from './orders';
import { upsertMenuItem } from './menu';
import { upsertTable } from './tables';
import { upsertUser } from './users';
import { setDoc } from 'firebase/firestore';
import { tdoc } from './_path';

export async function runSyncTask(task: SyncTask) {
  switch (task.op.type) {
    case 'CREATE_ORDER':
      await createOrder(task.op.payload);
      return;
    case 'UPSERT_ORDER': // <-- new: set/merge full order snapshot
      await setDoc(tdoc('orders', task.op.payload.id), task.op.payload, { merge: true });
      return;
    case 'UPDATE_ORDER_STATUS':
      await updateOrderStatus(task.op.payload.orderId, task.op.payload.status);
      return;
    case 'ADD_PAYMENT':
      await addPayment(task.op.payload.orderId, task.op.payload.payment);
      return;
    case 'UPSERT_MENU':
      await upsertMenuItem(task.op.payload);
      return;
    case 'UPSERT_TABLE':
      await upsertTable(task.op.payload);
      return;
    case 'UPSERT_USER':
      await upsertUser(task.op.payload);
      return;
    default:
      return;
  }
}
