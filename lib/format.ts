import dayjs from 'dayjs';

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS' }).format(value);
};

export const formatDate = (date: Date | number | string) => dayjs(date).format('YYYY-MM-DD HH:mm');
