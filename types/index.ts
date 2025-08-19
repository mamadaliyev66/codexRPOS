export type TableStatus = 'bo\'sh' | 'band' | 'tayyorlanmoqda' | 'tozalanmoqda';
export type OrderStatus = 'yangi' | 'oshxonada' | 'tayyor' | 'yopilgan';

export interface AppUser {
  id: string;
  email: string;
  role: 'admin' | 'cashier' | 'waiter' | 'kitchen';
  active: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image?: string;
}

export interface Table {
  id: string;
  name: string;
  status: TableStatus;
}

export interface OrderItem {
  id: string;
  itemId: string;
  name: string;
  price: number;
  qty: number;
}

export interface Payment {
  method: 'naqd' | 'karta';
  amount: number;
}

export interface Order {
  id: string;
  tableId?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdAt: number;
  payments: Payment[];
  total: number;
}

export interface SyncTask {
  id: string;
  type: string;
  payload: any;
}
