import { mutationOptions } from '@tanstack/react-query';
import { signUp } from './api';

export const signUpMutationOptions = mutationOptions({
  mutationFn: signUp,
});
