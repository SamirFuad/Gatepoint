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
import { googleSignInAction } from '@/features/auth/actions/google-auth-action';
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

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function OAuthDivider() {
  return (
    <div className="relative my-2">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground">or</span>
      </div>
    </div>
  );
}

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
  oauthError,
}: {
  redirectTo: string;
  resetSuccess: boolean;
  oauthError?: string | null;
}) {
  const computedInitialState: AuthActionState = oauthError
    ? { message: oauthError }
    : resetSuccess
      ? {
          success: true,
          message: 'Password updated. Sign in with your new password.',
        }
      : initialState;

  const [state, action, pending] = useActionState(
    loginAction,
    computedInitialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to manage your events.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={googleSignInAction} className="mb-1">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="w-full gap-2"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>
        <OAuthDivider />
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
        <form action={googleSignInAction} className="mb-1">
          <Button
            type="submit"
            variant="outline"
            size="lg"
            className="w-full gap-2"
          >
            <GoogleIcon />
            Continue with Google
          </Button>
        </form>
        <OAuthDivider />
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

