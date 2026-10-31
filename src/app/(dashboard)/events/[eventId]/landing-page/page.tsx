import Link from 'next/link';
import { WorkspacePageHeader } from '@/components/layout/workspace-page-header';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { LandingPageForm } from '@/features/landing-pages/components/landing-page-form';
import { createLandingPageService } from '@/features/landing-pages/services/supabase-landing-page-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Landing Page',
};

export default async function EventLandingPageEditor({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const eventService = createEventService();
  const eventResult = await eventService.getById(eventId);

  if (eventResult.error || !eventResult.data) {
    notFound();
  }

  const landingPageService = createLandingPageService();
  const configResult = await landingPageService.getConfig(eventId);

  if (configResult.error || !configResult.data) {
    throw new Error(configResult.error?.message ?? 'Unable to load config.');
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <WorkspacePageHeader
        title="Give your event a beautiful home."
        description={`Make the first impression count for ${eventResult.data.title}.`}
      >
        <Link
          href={`/events/${eventId}/preview`}
          className={cn(buttonVariants({ variant: 'outline' }), 'gap-2')}
          target="_blank"
        >
          <ExternalLink />
          Preview page
        </Link>
      </WorkspacePageHeader>
      <LandingPageForm
        eventId={eventId}
        config={configResult.data}
        event={eventResult.data}
      />
    </div>
  );
}
