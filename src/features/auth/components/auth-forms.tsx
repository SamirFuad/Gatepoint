'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { ArrowRight, Loader2, MailCheck } from 'lucide-react';
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resendVerificationAction,
  resetPasswordAction,
  type AuthActionState,
} from '@/features/auth/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialState: AuthActionState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

function FormMessage({ state }: { state: AuthActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={
        state.success
          ? 'rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary'
          : 'rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'
      }
    >
      {state.message}
    </p>
  );
}

function SubmitButton({
  pending,
  children,
}: {
  pending: boolean;
  children: React.ReactNode;
}) {
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      {children}
    </Button>
  );
}

export function LoginForm({
  redirectTo,
  resetSuccess,
}: {
  redirectTo: string;
  resetSuccess: boolean;
}) {
  const [state, action, pending] = useActionState(
    loginAction,
    resetSuccess
      ? {
          success: true,
          message: 'Password updated. Sign in with your new password.',
        }
      : initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to manage your events.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <FormMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
            <FieldError errors={state.errors?.email} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            <FieldError errors={state.errors?.password} />
          </div>
          <SubmitButton pending={pending}>Sign in</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        New to Gatepoint?{' '}
        <Link href="/register" className="ml-1 text-primary hover:underline">
          Create an account
        </Link>
      </CardFooter>
    </Card>
  );
}

export function RegisterForm() {
  const [state, action, pending] = useActionState(
    registerAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Start building events with a free Gatepoint workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" autoComplete="name" />
            <FieldError errors={state.errors?.fullName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
            <FieldError errors={state.errors?.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
            />
            <FieldError errors={state.errors?.password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
            />
            <FieldError errors={state.errors?.confirmPassword} />
          </div>
          <SubmitButton pending={pending}>
            Create account <ArrowRight />
          </SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="ml-1 text-primary hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    forgotPasswordAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
        <CardDescription>
          Enter your email and we will send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" />
            <FieldError errors={state.errors?.email} />
          </div>
          <SubmitButton pending={pending}>Send reset link</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link href="/login" className="ml-1 text-primary hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>
          Use at least 8 characters with a letter and number.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
            />
            <FieldError errors={state.errors?.password} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
            />
            <FieldError errors={state.errors?.confirmPassword} />
          </div>
          <SubmitButton pending={pending}>Update password</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}

export function VerifyEmailForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(
    resendVerificationAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MailCheck className="size-5" />
        </div>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          Use the verification link we sent to finish setting up your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={email}
              autoComplete="email"
            />
            <FieldError errors={state.errors?.email} />
          </div>
          <SubmitButton pending={pending}>Resend verification</SubmitButton>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already verified?{' '}
        <Link href="/login" className="ml-1 text-primary hover:underline">
          Sign in
        </Link>
      </CardFooter>
    </Card>
  );
}

