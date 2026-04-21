import { mutationOptions } from '@tanstack/react-query';
import { signIn } from './api';

export const signInMutationOptions = mutationOptions({
  mutationFn: signIn,
});
