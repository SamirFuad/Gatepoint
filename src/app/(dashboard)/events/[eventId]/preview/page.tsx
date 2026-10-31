import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createEventService } from '@/features/events/services/supabase-event-service';
import { EventExperience } from '@/features/landing-pages/components/event-experience';
import {
  defaultLandingPageConfig,
  landingPageConfigSchema,
} from '@/features/landing-pages/schemas/landing-page-schemas';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Preview Your Event',
  robots: { index: false, follow: false },
};
export default async function EventPreviewPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const client = await createClient();
  const { data: allowed } = await client.rpc('can_manage_event', {
    target_event_id: eventId,
  });
  if (!allowed) notFound();
  const { data: event } = await createEventService().getById(eventId);
  if (!event) notFound();
  const config =
    landingPageConfigSchema.safeParse(event.landingPageConfig).data ??
    defaultLandingPageConfig(event.title);
  const { data: host } = await client
    .from('organizations')
    .select('name,description,logo_url,website')
    .eq('id', event.organizationId)
    .single();
  return (
    <div className="event-full-preview">
      <EventExperience
        event={event}
        config={config}
        host={
          host
            ? {
                name: host.name,
                description: host.description,
                logoUrl: host.logo_url,
                website: host.website,
              }
            : null
        }
        preview
      />
    </div>
  );
}
