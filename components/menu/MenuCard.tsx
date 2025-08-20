import { FC } from 'react';
import { Text, View, Image } from 'react-native';
import { MenuItem } from '../../types';
import { Card } from '../ui/Card';

interface Props { item: MenuItem; }

export const MenuCard: FC<Props> = ({ item }) => (
  <Card>
    {item.image && <Image source={{ uri: item.image }} className="h-24 w-full" />}
    <View className="mt-2">
      <Text className="font-bold">{item.name}</Text>
      <Text>{item.price} so'm</Text>
    </View>
  </Card>
);
