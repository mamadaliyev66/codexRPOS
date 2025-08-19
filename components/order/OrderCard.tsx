import { FC } from 'react';
import { Text, View } from 'react-native';
import { Order } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Props { order: Order; }

export const OrderCard: FC<Props> = ({ order }) => (
  <Card>
    <View className="flex-row justify-between">
      <Text>#{order.id}</Text>
      <Badge label={order.status} type={order.status} />
    </View>
  </Card>
);
