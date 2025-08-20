export type UserRole = 'admin' | 'cashier' | 'waiter' | 'kitchen';

export const roles: Record<UserRole, string> = {
  admin: 'Admin',
  cashier: 'Kassir',
  waiter: 'Ofitsiant',
  kitchen: 'Oshpaz',
};
