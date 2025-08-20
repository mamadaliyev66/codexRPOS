import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../redux/store';
import { fetchUsers } from '../../redux/slices/usersSlice';
import Screen from '../../components/ui/Screen';
import { UZ } from '../../constants/i18n';

export default function UsersAdmin() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((s: RootState) => s.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>{UZ.users}</Text>
      {loading ? <Text>Yuklanmoqda…</Text> : null}
      <FlatList
        data={list}
        keyExtractor={(u) => u.uid}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 8 }}>
            <Text style={{ fontWeight: '700' }}>{item.displayName}</Text>
            <Text>{item.email}</Text>
            <Text>Rol: {item.role}</Text>
            <Text>Faol: {item.active ? 'Ha' : 'Yo‘q'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>Foydalanuvchilar yo‘q.</Text>}
      />
    </Screen>
  );
}
