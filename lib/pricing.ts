export interface TotalsOptions {
  taxRate?: number; // percent
  serviceRate?: number; // percent
}

export const calcTotals = (items: { price: number; qty: number }[], opts: TotalsOptions = {}) => {
  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const service = subtotal * ((opts.serviceRate ?? 0) / 100);
  const tax = (subtotal + service) * ((opts.taxRate ?? 0) / 100);
  const total = subtotal + service + tax;
  return { subtotal, service, tax, total };
};
