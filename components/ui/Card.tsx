import { FC, ReactNode } from 'react';
import { View } from 'react-native';
import { shadows, colors } from '../../constants/theme';

interface Props { children: ReactNode; }

export const Card: FC<Props> = ({ children }) => (
  <View style={{ backgroundColor: colors.light, borderRadius: 8, padding: 12, ...shadows.card }}>
    {children}
  </View>
);
