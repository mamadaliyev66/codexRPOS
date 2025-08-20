import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Screen from '../../components/ui/Screen';
import { tdoc } from '../../services/_path';
import { getDoc } from 'firebase/firestore';
import { UZ } from '../../constants/i18n';

export default function SettingsAdmin() {
  const [cfg, setCfg] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const snap = await getDoc(tdoc('settings', 'app'));
      setCfg(snap.exists() ? snap.data() : null);
    })();
  }, []);

  return (
    <Screen padded>
      <Text style={{ fontWeight: '800', fontSize: 18, marginBottom: 12 }}>{UZ.settings}</Text>
      {cfg ? (
        <View style={{ gap: 6 }}>
          <Text>Valyuta: {cfg.currency}</Text>
          <Text>Xizmat foizi: {cfg.serviceRate}</Text>
          <Text>Soliq foizi: {cfg.taxRate}</Text>
        </View>
      ) : (
        <Text>Sozlamalar topilmadi.</Text>
      )}
    </Screen>
  );
}
