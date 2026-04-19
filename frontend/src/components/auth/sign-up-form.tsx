'use client';
import { FormEvent, useState } from 'react';
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
import { redirect } from 'next/navigation';

export default function SignUpForm() {
  const signUpMutation = useMutation({ mutationFn: clientApi.auth.signUp });
  const [errors, setErrors] = useState<{
    message: string;
    errors?: Record<string, string[]>;
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value as string;
    });

    if (data.password !== data.repeatPassword) {
      setErrors({
        message: 'Validation error',
        errors: {
          repeatPassword: ['Repeat password is different.'],
        },
      });
      return;
    }

    signUpMutation
      .mutateAsync(data as TSignInDto)
      .then(() => {
        redirect('/');
      })
      .catch((error) => {
        if (isUnprosessableEntityError(error) && error.response) {
          setErrors({
            message: error.response.data.message,
            errors: error.response.data.errors,
          });
        } else if (error instanceof Error) {
          setErrors({ message: error.message });
        } else {
          setErrors({ message: 'Unknown error. Try again later.' });
        }
      });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Sign In</p>
        <Form
          className="flex flex-col gap-4"
          validationBehavior="aria"
          validationErrors={errors?.errors}
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
          <TextField name="repeatPassword" type="password">
            <Label>Repeat password</Label>
            <Input
              required
              placeholder="Repeat your password"
              variant="primary"
            />
            <FieldError />
          </TextField>
          {!!errors?.message && !errors.errors && (
            <span className="text-red-500">{errors.message}</span>
          )}
          <Button variant="primary" type="submit" className="mt-2">
            Sign Up
          </Button>
        </Form>
        <div className="flex justify-between text-small">
          <a href="/auth/sign-in" className="text-primary hover:underline">
            I already have an account
          </a>
        </div>
      </div>
    </div>
  );
}
