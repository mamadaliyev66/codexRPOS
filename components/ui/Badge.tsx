import { FC } from 'react';
import { Badge as PaperBadge } from 'react-native-paper';
import { colors } from '../../constants/theme';

interface Props {
  label: string;
  type?: 'yangi' | 'oshxonada' | 'tayyor' | 'yopilgan';
}

const map: Record<string, string> = {
  yangi: colors.primary,
  oshxonada: colors.warning,
  tayyor: colors.success,
  yopilgan: '#6B7280',
};

export const Badge: FC<Props> = ({ label, type = 'yangi' }) => (
  <PaperBadge style={{ backgroundColor: map[type] }}>{label}</PaperBadge>
);
