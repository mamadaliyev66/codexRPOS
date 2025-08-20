import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { theme } from '../../constants/theme';
import { formatUZS, formatDate } from '../../lib/format';
import type { Order } from '../../types';

export default function OrderCard({
  order,
  onPress,
  right,
}: {
  order: Order;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  const statusColor = {
    yangi: theme.colors.primary,
    oshxonada: theme.colors.warning,
    tayyor: theme.colors.success,
    yopilgan: theme.colors.muted,
  }[order.status];

  const total = order.totals?.grand ?? 0;

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: '#fff',
        borderRadius: theme.radii['2xl'],
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        ...theme.shadows.card,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
        <Text style={{ fontWeight: '700', fontSize: 16 }}>
          Buyurtma #{order.id.slice(-6).toUpperCase()}
        </Text>
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: statusColor,
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>{order.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={{ color: theme.colors.muted, marginBottom: 6 }}>
        {order.tableId ? `Stol: ${order.tableId}` : 'Stol: —'}
      </Text>
      <Text style={{ marginBottom: 6 }}>{formatUZS(total)}</Text>
      <Text style={{ color: theme.colors.muted }}>{formatDate(order.createdAt)}</Text>
      {right ? <View style={{ marginTop: 12 }}>{right}</View> : null}
    </Pressable>
  );
}
