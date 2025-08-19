import { Appbar } from 'react-native-paper';
import { FC } from 'react';

interface Props {
  title: string;
}

export const AppBar: FC<Props> = ({ title }) => (
  <Appbar.Header>
    <Appbar.Content title={title} />
  </Appbar.Header>
);
