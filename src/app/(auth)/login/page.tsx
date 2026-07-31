import { LoginForm } from '@/features/auth/components/auth-forms';

export const metadata = {
  title: 'Sign In',
};

const OAUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed: 'Sign-in with Google failed. Please try again.',
  oauth_failed: 'Unable to start Google sign-in. Please try again.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirectTo?: string;
    reset?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const redirectTo =
    params.redirectTo?.startsWith('/') && !params.redirectTo.startsWith('//')
      ? params.redirectTo
      : '/dashboard';

  const oauthError = params.error
    ? OAUTH_ERROR_MESSAGES[params.error] ?? null
    : null;

  return (
    <LoginForm
      redirectTo={redirectTo}
      resetSuccess={params.reset === 'success'}
      oauthError={oauthError}
    />
  );
}

