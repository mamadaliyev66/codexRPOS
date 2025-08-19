import { FC } from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

interface Props {
  label: string;
  value?: string;
}

export const Select: FC<Props> = ({ label, value }) => (
  <View>
    <Text>{label}</Text>
    <Text>{value}</Text>
  </View>
);
