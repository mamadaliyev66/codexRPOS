export type Role = 'admin' | 'cashier' | 'waiter' | 'kitchen';

export interface AppUser {
  uid: string;
  tenantId: string;
  displayName: string;
  email?: string;
  phone?: string;
  role: Role;
  active: boolean;
  createdAt: number;
}

export interface MenuCategory {
  id: string;
  tenantId: string;
  name: string;
  index: number;
  active: boolean;
  createdAt: number;
}

export interface MenuItem {
  id: string;
  tenantId: string;
  name: string;        // Uzbek
  description?: string;
  categoryId: string;
  price: number;
  barcode?: string;
  imageUrl?: string;
  active: boolean;
  createdAt: number;
}

export type TableStatus = "bo'sh" | 'band' | 'tayyorlanmoqda' | 'tozalanmoqda';
export interface Table {
  id: string;
  tenantId: string;
  name: string;  // e.g. "Stol 1"
  seats: number;
  status: TableStatus;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  qty: number;
  price: number;
  notes?: string;
}

export type OrderStatus = 'yangi' | 'oshxonada' | 'tayyor' | 'yopilgan';
export interface Payment {
  id: string;
  type: 'cash' | 'card' | 'later';
  amount: number;
  createdAt: number;
}

export interface Order {
  id: string;
  tenantId: string;
  tableId?: string;
  items: OrderItem[];
  status: OrderStatus;
  createdBy: string;
  assignedTo?: string;
  totals: { subtotal: number; service: number; tax: number; grand: number; discount: number };
  payments: Payment[];
  createdAt: number;
  closedAt?: number;
}

export interface SyncTask {
  id: string;
  createdAt: number;
  retries: number;
  op:
    | { type: 'CREATE_ORDER'; payload: Order }
    | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } }
    | { type: 'ADD_PAYMENT'; payload: { orderId: string; payment: Payment } }
    | { type: 'UPSERT_MENU'; payload: MenuItem }
    | { type: 'UPSERT_TABLE'; payload: Table }
    | { type: 'UPSERT_USER'; payload: AppUser }
    | { type: 'UPSERT_ORDER'; payload: Order };

}
