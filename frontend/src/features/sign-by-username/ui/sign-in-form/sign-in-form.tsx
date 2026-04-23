'use client';
import { useActionState } from 'react';
import {
  Input,
  Button,
  Form,
  TextField,
  Label,
  FieldError,
} from '@heroui/react';
import { authActions } from '../../model';

export const SignInForm = () => {
  const [state, formAction] = useActionState(authActions.signIn, {
    status: null,
  });

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
        <p className="pb-2 text-xl font-medium">Sign In</p>
        <Form
          className="flex flex-col gap-4"
          validationBehavior="aria"
          validationErrors={state?.data?.errors}
          action={formAction}
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
          {!state.data?.errors && !!state.data?.message && (
            <span className="text-red-500">{state.data.message}</span>
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
};
