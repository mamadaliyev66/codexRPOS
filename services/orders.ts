import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/client';
import { Order, OrderStatus, Payment } from '../types';

const tenant = process.env.EXPO_PUBLIC_TENANT_ID || 'default';

export const fetchOrders = async (): Promise<Order[]> => {
  const snap = await getDocs(collection(db, 'tenants', tenant, 'orders'));
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
};

export const createOrder = (order: Omit<Order, 'id'>) =>
  addDoc(collection(db, 'tenants', tenant, 'orders'), order);

export const updateOrderStatus = (id: string, status: OrderStatus) =>
  updateDoc(doc(db, 'tenants', tenant, 'orders', id), { status });

export const addOrderPayment = (id: string, payment: Payment) =>
  updateDoc(doc(db, 'tenants', tenant, 'orders', id), { payments: payment });
