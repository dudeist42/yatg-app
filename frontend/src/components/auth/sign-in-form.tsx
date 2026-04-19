'use client';
import { FormEvent } from 'react';
import {
  Input,
  Button,
  Form,
  TextField,
  Label,
  FieldError,
} from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { clientApi, TSignInDto } from '@/lib/clientApi/api';
import { isUnprosessableEntityError } from '@/lib/clientApi/client';
import { isAxiosError } from 'axios';
import { redirect } from 'next/navigation';

export default function SignInForm() {
  const signInMutation = useMutation({ mutationFn: clientApi.auth.signIn });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    signInMutation.mutateAsync(data as TSignInDto).then(() => {
      redirect('/');
    });
  };

  const entityError = isUnprosessableEntityError(signInMutation.error)
    ? signInMutation.error.response?.data
    : undefined;
  const errorMessage =
    isAxiosError(signInMutation.error) &&
    !signInMutation.error.response?.data.errors &&
    (signInMutation.error.response?.data.message ?? '');

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Sign In</p>
        <Form
          className="flex flex-col gap-4"
          validationBehavior="aria"
          validationErrors={entityError?.errors}
          onSubmit={handleSubmit}
        >
          <TextField name="username" type="text">
            <Label>Username</Label>
            <Input
              required
              placeholder="Enter your username"
              type="text"
              variant="primary"
            />
            <FieldError />
          </TextField>
          <TextField name="password" type="password">
            <Label>Password</Label>
            <Input
              required
              placeholder="Enter your password"
              variant="primary"
            />
            <FieldError />
          </TextField>
          {!!errorMessage && (
            <span className="text-red-500">{errorMessage}</span>
          )}
          <Button variant="primary" type="submit" className="mt-2">
            Sign In
          </Button>
        </Form>
        <div className="flex justify-between text-small">
          <a href="/auth/sign-up" className="text-primary hover:underline">
            Create account
          </a>
        </div>
      </div>
    </div>
  );
}
