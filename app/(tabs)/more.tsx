import React from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import Screen from '../../components/ui/Screen';
import { UZ } from '../../constants/i18n';

export default function More() {
  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>{UZ.more}</Text>
      <View style={{ gap: 10 }}>
        <Link href="/waiter" style={{ fontWeight: '700' }}>• {UZ.waiter}</Link>
        <Link href="/kitchen" style={{ fontWeight: '700' }}>• {UZ.kitchen}</Link>
        <Link href="/cashier" style={{ fontWeight: '700' }}>• {UZ.cashier}</Link>
        <Link href="/admin/users" style={{ fontWeight: '700' }}>• {UZ.users}</Link>
        <Link href="/admin/settings" style={{ fontWeight: '700' }}>• {UZ.settings}</Link>
        <Link href="/offline/queue" style={{ fontWeight: '700' }}>• Oflayn navbat</Link>
      </View>
    </Screen>
  );
}
