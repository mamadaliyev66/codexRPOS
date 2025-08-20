import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { fetchMenu } from '../../redux/slices/menuSlice';
import Screen from '../../components/ui/Screen';
import { UZ } from '../../constants/i18n';

export default function Menu() {
  const dispatch = useDispatch<AppDispatch>();
  const menu = useSelector((s: RootState) => s.menu.items);
  const [q, setQ] = useState('');

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  const filtered = menu.filter((m) => m.active && m.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>{UZ.menu}</Text>
      <TextInput
        placeholder={`${UZ.search}...`}
        value={q}
        onChangeText={setQ}
        style={{ backgroundColor: '#F1F5F9', borderRadius: 12, padding: 12, marginBottom: 8 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={(m) => m.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.name}</Text>
            <Text>{item.price} UZS</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Menyu bo‘sh.</Text>}
      />
    </Screen>
  );
}
