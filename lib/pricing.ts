export const calcTotals = (
  items: { qty: number; price: number }[],
  rates: { serviceRate: number; taxRate: number },
) => {
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const service = Math.round(subtotal * (rates.serviceRate ?? 0));
  const tax = Math.round((subtotal + service) * (rates.taxRate ?? 0));
  const grand = subtotal + service + tax;
  return { subtotal, service, tax, grand };
};
