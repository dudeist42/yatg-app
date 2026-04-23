import { mutationOptions } from '@tanstack/react-query';
import { signOut } from './api';

export const signOutMutationOptions = mutationOptions({
  mutationFn: signOut,
  onMutate(variables, context) {
    context.client.cancelQueries();
  },
});
