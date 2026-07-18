import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PublicRegistrationForm } from '@/features/registrations/components/public-registration-form';
import { createLandingPageService } from '@/features/landing-pages/services/supabase-landing-page-service';
import { createRegistrationFormService } from '@/features/registration-forms/services/supabase-registration-form-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Register',
};

export default async function PublicRegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const landingPageService = createLandingPageService();
  const eventResult = await landingPageService.getPublishedEventBySlug(slug);

  if (eventResult.error || !eventResult.data) {
    notFound();
  }

  const formService = createRegistrationFormService();
  const formResult = await formService.getByEventId(eventResult.data.id);

  if (formResult.error || !formResult.data || !formResult.data.isActive) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-4 py-12">
        <h1 className="text-2xl font-semibold">Registration unavailable</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This event is published, but its registration form is not active yet.
        </p>
        <Link
          href={`/public/events/${slug}`}
          className={cn(buttonVariants({ variant: 'outline' }), 'mt-6 w-fit')}
        >
          Back to event
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <div>
          <Link
            href={`/public/events/${slug}`}
            className="text-sm text-primary hover:underline"
          >
            Back to event
          </Link>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">
            Register for {eventResult.data.title}
          </h1>
        </div>
        <PublicRegistrationForm
          event={eventResult.data}
          form={formResult.data}
        />
      </div>
    </main>
  );
}

