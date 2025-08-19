import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '../../components/ui/Screen';
import { TextField } from '../../components/ui/TextField';
import { Button } from '../../components/ui/Button';
import { uz } from '../../constants/i18n';

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

type Form = z.infer<typeof schema>;

export default function Login() {
  const { control, handleSubmit } = useForm<Form>({ resolver: zodResolver(schema) });
  const onSubmit = (data: Form) => console.log(data);

  return (
    <Screen>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextField label={uz.email} autoCapitalize="none" value={value} onChangeText={onChange} />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextField label={uz.password} secureTextEntry value={value} onChangeText={onChange} />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)}>{uz.signIn}</Button>
    </Screen>
  );
}
