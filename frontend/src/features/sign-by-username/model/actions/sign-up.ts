'use server';
import { redirect } from 'next/navigation';
import { signUp as signUpRequest } from '../api';
import { AxiosError } from 'axios';
import { setTokenCookies } from '../../lib/cookies';

export type TSignUpState = {
  status: number | null;
  data?: {
    message?: string;
    errors?: Record<string, string[]>;
  };
};

export const signUp = async (
  prevState: TSignUpState,
  formData: FormData,
): Promise<TSignUpState> => {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  try {
    const backendResponse = await signUpRequest({ username, password });

    await setTokenCookies(backendResponse);
  } catch (e) {
    if (e instanceof AxiosError) {
      return {
        status: e.status ?? 500,
        data: e.response?.data?.data ??
          e.response?.data ?? {
            message: e.message ?? 'Server error.',
          },
      };
    }

    return {
      status: 500,
      data: {
        message: 'Unknown error.',
      },
    };
  }

  redirect('/');
};
