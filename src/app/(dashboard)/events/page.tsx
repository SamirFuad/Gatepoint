import Link from 'next/link';
import { ArrowUpRight, Plus } from 'lucide-react';
import { EventManager } from '@/components/events/event-manager';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';
import { createEventService } from '@/features/events/services/supabase-event-service';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your Events' };
export default async function EventsPage() {
  const result = await createOrganizationService().getUserOrganizations();
  if (result.error) throw new Error(result.error.message);
  const organization = result.data?.[0];
  if (!organization)
    return (
      <section className="mx-auto max-w-5xl">
        <div className="dashboard-greeting mb-8">
          <div>
            <h1>Make room for your next big idea.</h1>
            <p>
              A conference, a workshop, a reason to come together. Start with
              the details.
            </p>
          </div>
        </div>
        <div className="dashboard-banner">
          <div>
            <h2>Your first event is a beginning.</h2>
            <p>
              We’ll create a personal workspace automatically when you create
              your event.
            </p>
          </div>
          <Link href="/events/new" className="gp-button gp-button-dark">
            Create an event
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
    );
  const eventsResult = await createEventService().list(
    organization.id,
    { page: 1, pageSize: 100 },
    undefined,
    { column: 'starts_at', direction: 'asc' }
  );
  if (eventsResult.error) throw new Error(eventsResult.error.message);
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="dashboard-greeting">
        <div>
          <p className="greeting-label">{organization.name}</p>
          <h1>Your gatherings, all together.</h1>
          <p>Plan the next one. Fine-tune the details. Welcome your people.</p>
        </div>
        <Link href="/events/new" className="gp-button gp-button-dark">
          <Plus size={17} />
          Create an event
        </Link>
      </div>
      <EventManager events={eventsResult.data?.data ?? []} />
    </section>
  );
}
