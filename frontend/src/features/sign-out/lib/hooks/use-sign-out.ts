import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { signOutQueries } from '../../api';

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const { mutateAsync, isPending } = useMutation(
    signOutQueries.signOutMutationOptions,
  );

  const signOutAsync = useCallback(async () => {
    await mutateAsync();
    push('/auth/sign-in');
    setTimeout(() => {
      queryClient.clear();
    }, 0);
  }, [mutateAsync, push, queryClient]);

  const signOut = useCallback(() => {
    void signOutAsync();
  }, [signOutAsync]);

  return {
    signOutAsync,
    signOut,
    isPending,
  };
};
