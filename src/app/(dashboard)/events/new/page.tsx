import { redirect } from 'next/navigation';
import { CreateEventForm } from '@/features/events/components/event-forms';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Event',
};

export default async function NewEventPage() {
  const organizationService = createOrganizationService();
  const organizationsResult = await organizationService.getUserOrganizations();

  if (organizationsResult.error) {
    throw new Error(organizationsResult.error.message);
  }

  if (!organizationsResult.data?.length) {
    redirect('/create-organization');
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <CreateEventForm />
    </div>
  );
}

