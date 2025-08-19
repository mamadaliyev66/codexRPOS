import { Screen } from '../../components/ui/Screen';
import { Text } from 'react-native-paper';
import { uz } from '../../constants/i18n';

export default function Settings() {
  return (
    <Screen>
      <Text>{uz.settings}</Text>
    </Screen>
  );
}
