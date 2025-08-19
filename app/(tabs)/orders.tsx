import { FlatList } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { OrderCard } from '../../components/order/OrderCard';
import { uz } from '../../constants/i18n';
import { AppBar } from '../../components/ui/AppBar';

export default function Orders() {
  const orders = useSelector((s: RootState) => s.orders.orders);
  return (
    <Screen>
      <AppBar title={uz.orders} />
      <FlatList
        testID="orders-list"
        data={orders}
        keyExtractor={o => o.id}
        renderItem={({ item }) => <OrderCard order={item} />}
        ListEmptyComponent={null}
      />
    </Screen>
  );
}
