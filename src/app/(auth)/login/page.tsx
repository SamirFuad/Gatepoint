import { LoginForm } from '@/features/auth/components/auth-forms';

export const metadata = {
  title: 'Sign In',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    redirectTo?: string;
    reset?: string;
  }>;
}) {
  const params = await searchParams;
  const redirectTo =
    params.redirectTo?.startsWith('/') && !params.redirectTo.startsWith('//')
      ? params.redirectTo
      : '/dashboard';

  return (
    <LoginForm
      redirectTo={redirectTo}
      resetSuccess={params.reset === 'success'}
    />
  );
}

