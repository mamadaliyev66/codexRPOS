import { useEffect, useState } from 'react';
import { Screen } from '../../components/ui/Screen';
import { Text } from 'react-native-paper';
import { uz } from '../../constants/i18n';
import { AppBar } from '../../components/ui/AppBar';
import { getSalesTotals } from '../../services/reports';

export default function Reports() {
  const [sales, setSales] = useState(0);
  useEffect(() => {
    getSalesTotals().then(r => setSales(r.sales));
  }, []);

  return (
    <Screen>
      <AppBar title={uz.reports} />
      <Text>{sales} so'm</Text>
    </Screen>
  );
}
