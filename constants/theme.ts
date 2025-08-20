export const colors = {
  primary: '#0E7CFF',
  accent: '#00C2A8',
  success: '#10B981',
  warning: '#F59E0B',
  danger:  '#EF4444',
  bgLight: '#F6F8FB',
  bgDark:  '#0A0F1A',
  ink:     '#0B1220',
  muted:   '#6B7280',
};

export const radii = { sm: 10, md: 16, lg: 20, xl: 24, '2xl': 28 };
export const spacing = { xs: 6, sm: 10, md: 14, lg: 18, xl: 24 };
export const shadows = { card: { shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, elevation: 3 } };

export const theme = { colors, radii, spacing, shadows };
export type Theme = typeof theme;
