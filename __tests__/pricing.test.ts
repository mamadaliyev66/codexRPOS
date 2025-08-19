import { calcTotals } from '../lib/pricing';

test('calculates totals', () => {
  const res = calcTotals([{ price: 10000, qty: 2 }], { taxRate: 10, serviceRate: 5 });
  expect(res.subtotal).toBe(20000);
  expect(res.service).toBe(1000);
  expect(res.tax).toBe(2100);
  expect(res.total).toBe(23100);
});
