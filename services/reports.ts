// services/reports.ts
import { getDocs, query, where, orderBy } from 'firebase/firestore';
import { tcol } from './_path';
import type { Order } from '../types';

export interface KPI {
  totalSales: number;
  orderCount: number;
  avgTicket: number;
  mix: { cash: number; card: number; later: number };
  topItems: { name: string; qty: number; revenue: number }[];
}

export async function getKPIs(dateFromMs: number, dateToMs: number): Promise<KPI> {
  const q = query(
    tcol('orders'),
    where('createdAt', '>=', dateFromMs),
    where('createdAt', '<', dateToMs),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  const orders: Order[] = snap.docs.map((d) => d.data() as Order);

  let totalSales = 0;
  let orderCount = orders.length;
  const mix = { cash: 0, card: 0, later: 0 };
  const itemMap = new Map<string, { name: string; qty: number; revenue: number }>();

  for (const o of orders) {
    totalSales += o.totals?.grand ?? 0;
    for (const p of o.payments || []) {
      if (p.type === 'cash') mix.cash += p.amount;
      else if (p.type === 'card') mix.card += p.amount;
      else mix.later += p.amount;
    }
    for (const it of o.items) {
      const cur = itemMap.get(it.name) || { name: it.name, qty: 0, revenue: 0 };
      cur.qty += it.qty;
      cur.revenue += it.qty * it.price;
      itemMap.set(it.name, cur);
    }
  }

  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const avgTicket = orderCount ? Math.round(totalSales / orderCount) : 0;

  return { totalSales, orderCount, avgTicket, mix, topItems };
}
