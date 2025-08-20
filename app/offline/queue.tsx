import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import Screen from '../../components/ui/Screen';

export default function OfflineQueue() {
  const { queue, online, lastError } = useSelector((s: RootState) => s.sync);
  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>
        Oflayn navbat — {online ? 'Onlayn' : 'Oflayn'}
      </Text>
      {lastError ? <Text style={{ color: '#EF4444' }}>So‘nggi xatolik: {lastError}</Text> : null}
      <FlatList
        data={queue}
        keyExtractor={(t) => t.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.op.type}</Text>
            <Text>ID: {item.id}</Text>
            <Text>Urinishlar: {item.retries}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Navbat bo‘sh.</Text>}
      />
    </Screen>
  );
}
