import React from 'react';
import { View, Text } from 'react-native';
import { UZ } from '../../constants/i18n';

export default function OrdersHome() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: '700' }}>{UZ.hello}</Text>
      <Text>— {UZ.orders}</Text>
    </View>
  );
}
