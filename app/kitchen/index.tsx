import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { fetchByStatus, setOrderStatus } from '../../redux/slices/ordersSlice';
import OrderCard from '../../components/order/OrderCard';
import Button from '../../components/ui/Button';
import Screen from '../../components/ui/Screen';
import { UZ } from '../../constants/i18n';

export default function Kitchen() {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector((s: RootState) => s.orders.lists['oshxonada'].map((id) => s.orders.byId[id]));

  useEffect(() => {
    dispatch(fetchByStatus('oshxonada'));
  }, [dispatch]);

  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>{UZ.kitchen}</Text>
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            right={
              <Button
                title="TAYYOR"
                onPress={() => dispatch(setOrderStatus({ orderId: item.id, status: 'tayyor' }))}
              />
            }
          />
        )}
        ListEmptyComponent={<Text>Oshxonada buyurtma yo‘q.</Text>}
      />
    </Screen>
  );
}
