'use client';
import { FormEvent, useActionState, useState } from 'react';
import {
  Input,
  Button,
  Form,
  TextField,
  Label,
  FieldError,
} from '@heroui/react';
import { authActions } from '../../model';
export const SignUpForm = () => {
  const [clientErrors, setClientErrors] = useState<Record<
    string,
    string[]
  > | null>(null);
  const [state, signUpAction, isPending] = useActionState(authActions.signUp, {
    status: null,
  });

  const validateForm = (formData: FormData) => {
    const errors: Record<string, string[]> = {};
    const password = formData.get('password');
    const repeatPassword = formData.get('repeatPassword');

    if (password !== repeatPassword) {
      errors.repeatPassword = [
        ...(errors?.repeatPassword ?? []),
        'Passwords should match',
      ];
    }

    return {
      isValid: !Object.keys(errors).length,
      errors,
    };
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const { isValid, errors } = validateForm(new FormData(event.currentTarget));
    if (isValid) {
      setClientErrors(null);
      return true;
    } else {
      setClientErrors(errors);
      event.preventDefault();
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Sign In</p>
        <Form
          className="flex flex-col gap-4"
          validationBehavior="aria"
          validationErrors={clientErrors ?? state.data?.errors}
          action={signUpAction}
          onSubmit={handleSubmit}
        >
          <TextField name="username" type="text" isRequired>
            <Label>Username</Label>
            <Input
              placeholder="Enter your username"
              type="text"
              variant="primary"
            />
            <FieldError />
          </TextField>
          <TextField name="password" type="password" isRequired>
            <Label>Password</Label>
            <Input placeholder="Enter your password" variant="primary" />
            <FieldError />
          </TextField>
          <TextField name="repeatPassword" type="password" isRequired>
            <Label>Repeat password</Label>
            <Input placeholder="Repeat your password" variant="primary" />
            <FieldError />
          </TextField>
          {!state.data?.errors && !!state.data?.message && (
            <span className="text-red-500">{state.data.message}</span>
          )}
          <Button
            variant="primary"
            type="submit"
            className="mt-2"
            isPending={isPending}
          >
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
};
