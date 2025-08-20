import React from 'react';
import { View, Text } from 'react-native';
import { theme } from '../../constants/theme';

export default function AppBar({ title }: { title: string }) {
  return (
    <View
      style={{
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        backgroundColor: '#fff',
        borderRadius: theme.radii['2xl'],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
        ...theme.shadows.card,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.ink }}>{title}</Text>
    </View>
  );
}
