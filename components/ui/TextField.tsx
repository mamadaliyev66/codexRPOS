import { FC } from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';

export const TextField: FC<TextInputProps> = props => (
  <TextInput mode="outlined" {...props} />
);
