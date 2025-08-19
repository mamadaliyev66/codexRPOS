import { FlatList } from 'react-native';
import { Screen } from '../../components/ui/Screen';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { TableCard } from '../../components/table/TableCard';
import { uz } from '../../constants/i18n';
import { AppBar } from '../../components/ui/AppBar';

export default function Tables() {
  const tables = useSelector((s: RootState) => s.tables.tables);
  return (
    <Screen>
      <AppBar title={uz.tables} />
      <FlatList
        data={tables}
        keyExtractor={t => t.id}
        numColumns={2}
        renderItem={({ item }) => <TableCard table={item} />}
        ListEmptyComponent={null}
      />
    </Screen>
  );
}
