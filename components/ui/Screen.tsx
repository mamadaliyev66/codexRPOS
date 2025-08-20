import React from 'react';
import { View, ViewProps } from 'react-native';
import { theme } from '../../constants/theme';

type Props = ViewProps & { padded?: boolean; bg?: 'light' | 'dark' | 'none' };
export default function Screen({ padded = true, bg = 'light', style, ...rest }: Props) {
  const backgroundColor =
    bg === 'light' ? theme.colors.bgLight : bg === 'dark' ? theme.colors.bgDark : 'transparent';
  return (
    <View style={[{ flex: 1, backgroundColor, padding: padded ? theme.spacing.lg : 0 }, style]} {...rest} />
  );
}
