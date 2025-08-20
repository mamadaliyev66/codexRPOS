import { calcTotals } from '../lib/pricing';

describe('calcTotals', () => {
  it('computes service, tax, and grand totals', () => {
    const items = [{ qty: 2, price: 10000 }, { qty: 1, price: 5000 }]; // 25,000
    const { subtotal, service, tax, grand } = calcTotals(items, { serviceRate: 0.1, taxRate: 0.12 });
    expect(subtotal).toBe(25000);
    expect(service).toBe(2500);        // 10%
    expect(tax).toBe( (subtotal + service) * 0.12 ); // 3300
    expect(grand).toBe(subtotal + service + tax);    // 30800
  });
});
