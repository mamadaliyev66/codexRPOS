import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { fetchTables } from '../../redux/slices/tablesSlice';
import { fetchMenu } from '../../redux/slices/menuSlice';
import { createOrder, upsertLocal } from '../../redux/slices/ordersSlice';
import Screen from '../../components/ui/Screen';
import Button from '../../components/ui/Button';
import { UZ } from '../../constants/i18n';
import { newOrderId, newItemId } from '../../lib/ids';
import type { Order, OrderItem } from '../../types';
import { calcTotals } from '../../lib/pricing';
import { tenantId } from '../../services/_path';

export default function Waiter() {
  const dispatch = useDispatch<AppDispatch>();
  const tables = useSelector((s: RootState) => s.tables.list);
  const menu = useSelector((s: RootState) => s.menu.items);
  const auth = useSelector((s: RootState) => s.auth);
  const [selectedTable, setSelectedTable] = useState<string | undefined>(undefined);
  const [filter, setFilter] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);

  useEffect(() => {
    dispatch(fetchTables());
    dispatch(fetchMenu());
  }, [dispatch]);

  const filteredMenu = menu.filter((m) => m.active && m.name.toLowerCase().includes(filter.toLowerCase()));
  const totals = calcTotals(cart.map((c) => ({ qty: c.qty, price: c.price })), { serviceRate: 0.1, taxRate: 0.12 });

  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>{UZ.waiter}</Text>

      <FlatList
        data={tables}
        keyExtractor={(t) => t.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => setSelectedTable(item.id)}
            style={{
              backgroundColor: selectedTable === item.id ? '#0E7CFF' : '#fff',
              padding: 12,
              borderRadius: 12,
              marginRight: 8,
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Text style={{ color: selectedTable === item.id ? '#fff' : '#111' }}>{item.name}</Text>
          </Pressable>
        )}
        style={{ marginBottom: 12 }}
      />

      <TextInput
        placeholder={`${UZ.search}...`}
        value={filter}
        onChangeText={setFilter}
        style={{ backgroundColor: '#F1F5F9', borderRadius: 12, padding: 12, marginBottom: 8 }}
      />

      <FlatList
        data={filteredMenu}
        keyExtractor={(m) => m.id}
        style={{ maxHeight: 260, marginBottom: 8 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              setCart((prev) => [
                ...prev,
                { id: newItemId(), menuItemId: item.id, name: item.name, price: item.price, qty: 1 },
              ])
            }
            style={{ backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 6 }}
          >
            <Text>{item.name}</Text>
          </Pressable>
        )}
        ListEmptyComponent={<Text>Taom topilmadi</Text>}
      />

      <View style={{ backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <Text style={{ fontWeight: '700', marginBottom: 6 }}>Savatcha</Text>
        {cart.map((c) => (
          <View key={c.id} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text>{c.name} × {c.qty}</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={() => setCart((prev) => prev.map((x) => x.id === c.id ? { ...x, qty: Math.max(1, x.qty - 1) } : x))}>
                <Text style={{ paddingHorizontal: 8 }}>−</Text>
              </Pressable>
              <Pressable onPress={() => setCart((prev) => prev.map((x) => x.id === c.id ? { ...x, qty: x.qty + 1 } : x))}>
                <Text style={{ paddingHorizontal: 8 }}>+</Text>
              </Pressable>
              <Pressable onPress={() => setCart((prev) => prev.filter((x) => x.id !== c.id))}>
                <Text style={{ color: '#EF4444' }}>O‘chirish</Text>
              </Pressable>
            </View>
          </View>
        ))}
        <Text style={{ fontWeight: '800' }}>Umumiy: {totals.grand}</Text>
      </View>

      <Button
        title="Oshxonaga yuborish"
        onPress={() => {
          if (!selectedTable) return Alert.alert('Xatolik', 'Stol tanlanmagan');
          if (!cart.length) return Alert.alert('Xatolik', 'Taom tanlanmadi');
          const order: Order = {
            id: newOrderId(),
            tenantId,
            tableId: selectedTable,
            items: cart,
            status: 'oshxonada',
            createdBy: auth.uid || 'unknown',
            totals: { ...totals, discount: 0 },
            payments: [],
            createdAt: Date.now(),
          };
          dispatch(upsertLocal(order));
          dispatch(createOrder(order));
          setCart([]);
        }}
      />
    </Screen>
  );
}
