import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Screen from '../../components/ui/Screen';
import { getKPIs } from '../../services/reports';
import { UZ } from '../../constants/i18n';

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [kpi, setKpi] = useState<any>(null);

  useEffect(() => {
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    (async () => {
      try {
        const res = await getKPIs(start.getTime(), end.getTime());
        setKpi(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>{UZ.reports}</Text>
      {loading ? (
        <Text>Yuklanmoqda…</Text>
      ) : !kpi ? (
        <Text>Hisobot mavjud emas.</Text>
      ) : (
        <View style={{ gap: 8 }}>
          <Text>Umumiy savdo: {kpi.totalSales}</Text>
          <Text>Buyurtmalar soni: {kpi.orderCount}</Text>
          <Text>O‘rtacha chek: {kpi.avgTicket}</Text>
          <Text>Naqd: {kpi.mix.cash} | Karta: {kpi.mix.card} | Keyinroq: {kpi.mix.later}</Text>
          <Text style={{ fontWeight: '700', marginTop: 8 }}>Top taomlar:</Text>
          {kpi.topItems.map((it: any) => (
            <Text key={it.name}>• {it.name} — {it.qty} dona</Text>
          ))}
        </View>
      )}
    </Screen>
  );
}
