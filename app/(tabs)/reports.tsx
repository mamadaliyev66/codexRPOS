import React from 'react';
import { View, Text } from 'react-native';
import { UZ } from '../../constants/i18n';
export default function Reports() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 18 }}>{UZ.reports}</Text>
    </View>
  );
}
