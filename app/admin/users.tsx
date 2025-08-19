import { Screen } from '../../components/ui/Screen';
import { Text } from 'react-native-paper';
import { uz } from '../../constants/i18n';

export default function Users() {
  return (
    <Screen>
      <Text>{uz.users}</Text>
    </Screen>
  );
}
