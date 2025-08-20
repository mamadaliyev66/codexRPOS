import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Modal, Pressable, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { fetchByStatus, createOrder, setOrderStatus, addPayment, upsertLocal } from '../../redux/slices/ordersSlice';
import { fetchMenu } from '../../redux/slices/menuSlice';
import { fetchTables } from '../../redux/slices/tablesSlice';
import OrderCard from '../../components/order/OrderCard';
import Button from '../../components/ui/Button';
import Screen from '../../components/ui/Screen';
import { UZ } from '../../constants/i18n';
import { theme } from '../../constants/theme';
import type { Order, OrderItem, OrderStatus, Payment } from '../../types';
import { newItemId, newOrderId } from '../../lib/ids';
import { calcTotals } from '../../lib/pricing';
import { tdoc, tenantId } from '../../services/_path';
import { getDoc } from 'firebase/firestore';

const STATUSES: OrderStatus[] = ['yangi', 'oshxonada', 'tayyor', 'yopilgan'];

export default function OrdersHome() {
  const dispatch = useDispatch<AppDispatch>();
  const [active, setActive] = useState<OrderStatus>('yangi');

  const ordersState = useSelector((s: RootState) => s.orders);
  const orders = useMemo(() => ordersState.lists[active].map((id) => ordersState.byId[id]), [ordersState, active]);

  useEffect(() => {
    dispatch(fetchMenu());
    dispatch(fetchTables());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchByStatus(active));
  }, [dispatch, active]);

  // Settings (service/tax) fetch once
  const [serviceRate, setServiceRate] = useState(0.1);
  const [taxRate, setTaxRate] = useState(0.12);
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(tdoc('settings', 'app'));
        if (snap.exists()) {
          const d = snap.data() as any;
          setServiceRate(d?.serviceRate ?? 0.1);
          setTaxRate(d?.taxRate ?? 0.12);
        }
      } catch {}
    })();
  }, []);

  return (
    <Screen padded>
      {/* Status tabs */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: theme.spacing.lg, flexWrap: 'wrap' }}>
        {STATUSES.map((st) => (
          <Pressable
            key={st}
            onPress={() => setActive(st)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: active === st ? theme.colors.primary : '#fff',
              borderWidth: 1,
              borderColor: '#e5e7eb',
            }}
          >
            <Text style={{ color: active === st ? '#fff' : theme.colors.ink, fontWeight: '700' }}>
              {st.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={orders}
        keyExtractor={(o) => o.id}
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            right={
              item.status !== 'yopilgan' ? (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {item.status !== 'tayyor' && (
                    <Button
                      title={UZ.sendToKitchen}
                      onPress={() => dispatch(setOrderStatus({ orderId: item.id, status: 'oshxonada' }))}
                    />
                  )}
                  {item.status !== 'yopilgan' && (
                    <Button
                      title={UZ.payNow}
                      variant="outline"
                      onPress={() => payNow(item)}
                    />
                  )}
                </View>
              ) : null
            }
          />
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', padding: 24 }}>
            <Text style={{ color: theme.colors.muted }}>Hozircha buyurtmalar yo‘q.</Text>
          </View>
        }
      />

      {/* FAB */}
      <Pressable
        onPress={() => setShowCreate(true)}
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          backgroundColor: theme.colors.accent,
          borderRadius: 999,
          paddingHorizontal: 20,
          paddingVertical: 14,
          ...theme.shadows.card,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '800' }}>{UZ.newOrder}</Text>
      </Pressable>

      <CreateOrderModal
        visible={showCreate}
        close={() => setShowCreate(false)}
        serviceRate={serviceRate}
        taxRate={taxRate}
        onCreate={(order) => {
          dispatch(upsertLocal(order)); // optimistic local
          dispatch(createOrder(order));
          setShowCreate(false);
          setActive('yangi');
        }}
      />
    </Screen>
  );

  // ---------- local state for FAB ----------
  function payNow(order: Order) {
    Alert.alert(UZ.payment, `${UZ.total}: ${order.totals?.grand ?? 0}`, [
      {
        text: UZ.cash,
        onPress: () => doPay('cash'),
      },
      {
        text: UZ.card,
        onPress: () => doPay('card'),
      },
      { text: UZ.cancel, style: 'cancel' },
    ]);

    function doPay(type: Payment['type']) {
      const amount = order.totals?.grand ?? 0;
      const payment: Payment = {
        id: `pay_${Date.now()}`,
        type,
        amount,
        createdAt: Date.now(),
      };
      dispatch(addPayment({ orderId: order.id, payment }));
      dispatch(setOrderStatus({ orderId: order.id, status: 'yopilgan' }));
    }
  }
}

// -------------- Create Order Modal ----------------
function CreateOrderModal({
  visible,
  close,
  serviceRate,
  taxRate,
  onCreate,
}: {
  visible: boolean;
  close: () => void;
  serviceRate: number;
  taxRate: number;
  onCreate: (o: Order) => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: menuItems } = useSelector((s: RootState) => s.menu);
  const { list: tables } = useSelector((s: RootState) => s.tables);
  const auth = useSelector((s: RootState) => s.auth);

  const [tableId, setTableId] = useState<string | undefined>(tables[0]?.id);
  const [filter, setFilter] = useState('');
  const [cart, setCart] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (!menuItems.length) dispatch(fetchMenu());
    if (!tables.length) dispatch(fetchTables());
  }, [dispatch]);

  useEffect(() => {
    setTableId(tables[0]?.id);
  }, [tables]);

  const filteredMenu = useMemo(
    () =>
      menuItems
        .filter((m) => m.active)
        .filter((m) => m.name.toLowerCase().includes(filter.toLowerCase())),
    [menuItems, filter],
  );

  const totals = useMemo(
    () => calcTotals(cart.map((c) => ({ qty: c.qty, price: c.price })), { serviceRate, taxRate }),
    [cart, serviceRate, taxRate],
  );

  const [open, setOpen] = useState(visible);
  useEffect(() => setOpen(visible), [visible]);

  return (
    <Modal visible={open} animationType="slide" onRequestClose={close} transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', padding: 16, justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 16,
            maxHeight: '90%',
          }}
        >
          <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 8 }}>{UZ.newOrder}</Text>

          {/* Table & search */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
            <TextInput
              placeholder="Stol ID (masalan: T01)"
              value={tableId}
              onChangeText={setTableId}
              style={{
                flex: 1,
                backgroundColor: '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
            <TextInput
              placeholder={`${UZ.search}...`}
              value={filter}
              onChangeText={setFilter}
              style={{
                flex: 1,
                backgroundColor: '#F1F5F9',
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            />
          </View>

          {/* Menu list */}
          <FlatList
            data={filteredMenu}
            keyExtractor={(m) => m.id}
            style={{ maxHeight: 220, marginBottom: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() =>
                  setCart((prev) => [
                    ...prev,
                    { id: newItemId(), menuItemId: item.id, name: item.name, price: item.price, qty: 1 },
                  ])
                }
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  backgroundColor: '#F8FAFC',
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 6,
                }}
              >
                <Text>{item.name}</Text>
                <Text>{item.price}</Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text>Taomlar topilmadi</Text>}
          />

          {/* Cart */}
          <View style={{ backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, marginBottom: 12 }}>
            <Text style={{ fontWeight: '700', marginBottom: 6 }}>Savatcha</Text>
            {cart.length === 0 ? (
              <Text style={{ color: '#64748B' }}>Bo‘sh</Text>
            ) : (
              cart.map((c) => (
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
              ))
            )}
            <View style={{ height: 8 }} />
            <Text>Jami: {totals.subtotal} | Xizmat: {totals.service} | Soliq: {totals.tax}</Text>
            <Text style={{ fontWeight: '800' }}>Umumiy: {totals.grand}</Text>
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button title={UZ.cancel} variant="outline" onPress={close} />
            <Button
              title={UZ.sendToKitchen}
              onPress={() => {
                if (!cart.length) return Alert.alert('Xatolik', 'Taom tanlanmadi');
                const order: Order = {
                  id: newOrderId(),
                  tenantId,
                  tableId: tableId || undefined,
                  items: cart,
                  status: 'oshxonada',
                  createdBy: auth.uid || 'unknown',
                  totals: { ...totals, discount: 0 },
                  payments: [],
                  createdAt: Date.now(),
                };
                onCreate(order);
              }}
            />
            <Button
              title={UZ.payNow}
              onPress={() => {
                if (!cart.length) return Alert.alert('Xatolik', 'Taom tanlanmadi');
                const orderId = newOrderId();
                const pay: Payment = { id: `pay_${Date.now()}`, type: 'cash', amount: totals.grand, createdAt: Date.now() };
                const order: Order = {
                  id: orderId,
                  tenantId,
                  tableId: tableId || undefined,
                  items: cart,
                  status: 'yopilgan',
                  createdBy: auth.uid || 'unknown',
                  totals: { ...totals, discount: 0 },
                  payments: [pay],
                  createdAt: Date.now(),
                  closedAt: Date.now(),
                };
                onCreate(order);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
