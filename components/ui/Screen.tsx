import { FC, ReactNode } from 'react';
import { SafeAreaView, View } from 'react-native';

interface Props {
  children: ReactNode;
}

export const Screen: FC<Props> = ({ children }) => (
  <SafeAreaView className="flex-1 bg-light dark:bg-dark">
    <View className="flex-1 p-4">{children}</View>
  </SafeAreaView>
);
