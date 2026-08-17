import { CreateEventForm } from '@/features/events/components/event-forms';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Event',
};

export default function NewEventPage() {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <CreateEventForm />
    </div>
  );
}

