import { FC } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface Props { message: string; }

export const EmptyState: FC<Props> = ({ message }) => (
  <View className="items-center justify-center py-10">
    <Text>{message}</Text>
  </View>
);
