import { FC } from 'react';
import { Text, View } from 'react-native';
import { Table } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Props { table: Table; }

export const TableCard: FC<Props> = ({ table }) => (
  <Card>
    <View className="items-center">
      <Text className="text-lg">{table.name}</Text>
      <Badge label={table.status} />
    </View>
  </Card>
);
