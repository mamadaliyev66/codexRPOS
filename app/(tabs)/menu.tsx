import { FlatList } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { MenuCard } from '../../components/menu/MenuCard';
import { uz } from '../../constants/i18n';
import { AppBar } from '../../components/ui/AppBar';

export default function Menu() {
  const items = useSelector((s: RootState) => s.menu.items);
  return (
    <Screen>
      <AppBar title={uz.menu} />
      <FlatList
        data={items}
        keyExtractor={m => m.id}
        renderItem={({ item }) => <MenuCard item={item} />}
        ListEmptyComponent={null}
      />
    </Screen>
  );
}
