// services/orders.ts
import {
  getDocs, getDoc, setDoc, updateDoc, query, where, orderBy, Timestamp, arrayUnion,
} from 'firebase/firestore';
import { tcol, tdoc } from './_path';
import type { Order, OrderItem, OrderStatus, Payment } from '../types';

export async function listOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  const q = query(tcol('orders'), where('status', '==', status), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Order);
}

export async function getOrder(id: string) {
  const docSnap = await getDoc(tdoc('orders', id));
  return docSnap.exists() ? (docSnap.data() as Order) : null;
}

export async function createOrder(order: Order) {
  await setDoc(tdoc('orders', order.id), order);
}

export async function addItem(orderId: string, item: OrderItem) {
  // Using set/merge to avoid concurrency issues; in a real app you'd re-read and update totals server-side.
  const order = await getOrder(orderId);
  if (!order) throw new Error('Order not found');
  order.items = [...order.items, item];
  await setDoc(tdoc('orders', orderId), order, { merge: true });
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  await updateDoc(tdoc('orders', orderId), { status });
}

export async function addPayment(orderId: string, payment: Payment) {
  const order = await getOrder(orderId);
  if (!order) throw new Error('Order not found');
  order.payments = [...(order.payments || []), payment];
  await setDoc(tdoc('orders', orderId), order, { merge: true });
}

export async function closeOrder(orderId: string) {
  await updateDoc(tdoc('orders', orderId), { status: 'yopilgan', closedAt: Date.now() });
}
