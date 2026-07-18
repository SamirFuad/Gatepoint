import { VerifyEmailForm } from '@/features/auth/components/auth-forms';

export const metadata = {
  title: 'Verify Email',
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{
    email?: string;
  }>;
}) {
  const params = await searchParams;

  return <VerifyEmailForm email={params.email ?? ''} />;
}

