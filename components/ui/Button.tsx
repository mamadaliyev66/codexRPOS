import { FC } from 'react';
import { Button as PaperButton, ButtonProps } from 'react-native-paper';

export const Button: FC<ButtonProps> = props => (
  <PaperButton mode="contained" {...props} />
);
