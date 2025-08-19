import { useSelector } from 'react-redux';
import { Screen } from '../../components/ui/Screen';
import { Text } from 'react-native-paper';
import { RootState } from '../../redux/store';
import { uz } from '../../constants/i18n';

export default function Queue() {
  const queue = useSelector((s: RootState) => s.sync.queue);
  return (
    <Screen>
      <Text>{uz.offlineQueue}: {queue.length}</Text>
    </Screen>
  );
}
