import { fetchOrders } from './orders';
import { Order } from '../types';

export const getSalesTotals = async () => {
  const orders: Order[] = await fetchOrders();
  const sales = orders.reduce((sum, o) => sum + o.total, 0);
  return { sales, orders: orders.length };
};
