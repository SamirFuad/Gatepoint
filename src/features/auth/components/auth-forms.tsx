'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import {
  ArrowRight,
  Building2,
  Loader2,
  MailCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  forgotPasswordAction,
  loginAction,
  registerAction,
  resendVerificationAction,
  resetPasswordAction,
  type AuthActionState,
} from '@/features/auth/actions';
import { Button, buttonVariants } from '@/components/ui/button';
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
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
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
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-card px-2 text-muted-foreground/70">
          or continue with email
        </span>
      </div>
    </div>
  );
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

function FormMessage({ state }: { state: AuthActionState }) {
  if (!state.message) return null;
  return (
    <p
      className={
        state.success
          ? 'flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2.5 text-sm text-primary'
          : 'flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2.5 text-sm text-destructive'
      }
    >
      {state.success ? (
        <CheckCircle2 className="size-4 shrink-0" />
      ) : (
        <AlertCircle className="size-4 shrink-0" />
      )}
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
    <Button
      type="submit"
      size="lg"
      className="w-full glow-cobalt active:scale-[0.98] transition-transform"
      disabled={pending}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
    </Button>
  );
}

function BrandHeader() {
  return (
    <div className="auth-brand mb-8 flex flex-col items-center justify-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary shadow-sm">
        <Building2 className="size-5 text-primary-foreground" />
      </div>
      <div className="text-center">
        <span className="text-base font-bold tracking-tight">Gatepoint</span>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Event Registration Platform
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Login Form
// ============================================================
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
    <>
      <BrandHeader />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Sign in to manage your events.</CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="/auth/google"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className:
                'mb-1 w-full gap-2 h-11 font-medium hover:shadow-sm transition-shadow',
            })}
          >
            <GoogleIcon />
            Continue with Google
          </a>
          <OAuthDivider />
          <form action={action} className="space-y-4">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <FormMessage state={state} />
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="h-10"
                placeholder="you@example.com"
              />
              <FieldError errors={state.errors?.email} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password" className="font-medium">
                  Password
                </Label>
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
                className="h-10"
                placeholder="••••••••"
              />
              <FieldError errors={state.errors?.password} />
            </div>
            <SubmitButton pending={pending}>Sign in</SubmitButton>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          New to Gatepoint?{' '}
          <Link
            href="/register"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Create an account
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}

// ============================================================
// Register Form
// ============================================================
export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, initialState);

  return (
    <>
      <BrandHeader />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Create your space. Bring your next event to life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <a
            href="/auth/google"
            className={buttonVariants({
              variant: 'outline',
              size: 'lg',
              className:
                'mb-1 w-full gap-2 h-11 font-medium hover:shadow-sm transition-shadow',
            })}
          >
            <GoogleIcon />
            Continue with Google
          </a>
          <OAuthDivider />
          <form action={action} className="space-y-4">
            <FormMessage state={state} />
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="font-medium">
                Full name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                autoComplete="name"
                className="h-10"
                placeholder="Jane Smith"
              />
              <FieldError errors={state.errors?.fullName} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="h-10"
                placeholder="you@example.com"
              />
              <FieldError errors={state.errors?.email} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="h-10"
                placeholder="••••••••"
              />
              <FieldError errors={state.errors?.password} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="font-medium">
                Confirm password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="h-10"
                placeholder="••••••••"
              />
              <FieldError errors={state.errors?.confirmPassword} />
            </div>
            <SubmitButton pending={pending}>
              Create account <ArrowRight className="size-4" />
            </SubmitButton>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}

// ============================================================
// Forgot Password Form
// ============================================================
export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(
    forgotPasswordAction,
    initialState
  );

  return (
    <>
      <BrandHeader />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Reset password</CardTitle>
          <CardDescription>
            Enter your email and we&apos;ll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <FormMessage state={state} />
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="h-10"
                placeholder="you@example.com"
              />
              <FieldError errors={state.errors?.email} />
            </div>
            <SubmitButton pending={pending}>Send reset link</SubmitButton>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Remembered it?{' '}
          <Link
            href="/login"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}

// ============================================================
// Reset Password Form
// ============================================================
export function ResetPasswordForm() {
  const [state, action, pending] = useActionState(
    resetPasswordAction,
    initialState
  );

  return (
    <>
      <BrandHeader />
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Choose a new password</CardTitle>
          <CardDescription>
            Use at least 8 characters with a letter and number.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <FormMessage state={state} />
            <div className="space-y-1.5">
              <Label htmlFor="password" className="font-medium">
                New password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="h-10"
                placeholder="••••••••"
              />
              <FieldError errors={state.errors?.password} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="font-medium">
                Confirm new password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                className="h-10"
                placeholder="••••••••"
              />
              <FieldError errors={state.errors?.confirmPassword} />
            </div>
            <SubmitButton pending={pending}>Update password</SubmitButton>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

// ============================================================
// Verify Email Form
// ============================================================
export function VerifyEmailForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(
    resendVerificationAction,
    initialState
  );

  return (
    <>
      <BrandHeader />
      <Card className="shadow-sm">
        <CardHeader>
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-accent text-primary">
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
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={email}
                autoComplete="email"
                className="h-10"
                placeholder="you@example.com"
              />
              <FieldError errors={state.errors?.email} />
            </div>
            <SubmitButton pending={pending}>Resend verification</SubmitButton>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-sm text-muted-foreground">
          Already verified?{' '}
          <Link
            href="/login"
            className="ml-1 font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
