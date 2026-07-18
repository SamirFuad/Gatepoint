import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Registration Confirmed',
};

export default async function RegistrationSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ confirmation?: string }>;
}) {
  const { slug } = await params;
  const { confirmation } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-4 py-12 text-center">
      <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <CheckCircle2 className="size-6" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold">Registration confirmed</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Your confirmation number is{' '}
        <span className="font-medium text-foreground">
          {confirmation ?? 'pending'}
        </span>
        .
      </p>
      <Link
        href={`/public/events/${slug}`}
        className={cn(buttonVariants({ variant: 'outline' }), 'mx-auto mt-6')}
      >
        Back to event
      </Link>
    </main>
  );
}

