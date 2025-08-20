import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { fetchByStatus, addPayment, setOrderStatus } from '../../redux/slices/ordersSlice';
import OrderCard from '../../components/order/OrderCard';
import Button from '../../components/ui/Button';
import Screen from '../../components/ui/Screen';
import { UZ } from '../../constants/i18n';

export default function Cashier() {
  const dispatch = useDispatch<AppDispatch>();
  const ready = useSelector((s: RootState) =>
    s.orders.lists['tayyor'].map((id) => s.orders.byId[id]),
  );

  useEffect(() => {
    dispatch(fetchByStatus('tayyor'));
  }, [dispatch]);

  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>{UZ.cashier}</Text>
      <FlatList
        data={ready}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            right={
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button
                  title={UZ.cash}
                  onPress={() => {
                    const amount = item.totals?.grand ?? 0;
                    const payment = {
                      id: `pay_${Date.now()}`,
                      type: 'cash' as const,
                      amount,
                      createdAt: Date.now(),
                    };
                    dispatch(addPayment({ orderId: item.id, payment }));
                    dispatch(setOrderStatus({ orderId: item.id, status: 'yopilgan' }));
                  }}
                />
                <Button
                  title={UZ.card}
                  variant="outline"
                  onPress={() => {
                    const amount = item.totals?.grand ?? 0;
                    const payment = {
                      id: `pay_${Date.now()}`,
                      type: 'card' as const,
                      amount,
                      createdAt: Date.now(),
                    };
                    dispatch(addPayment({ orderId: item.id, payment }));
                    dispatch(setOrderStatus({ orderId: item.id, status: 'yopilgan' }));
                  }}
                />
              </View>
            }
          />
        )}
        ListEmptyComponent={<Text>Tayyor buyurtmalar yo‘q.</Text>}
      />
    </Screen>
  );
}
