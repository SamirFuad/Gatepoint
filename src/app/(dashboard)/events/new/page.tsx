import { Plus } from 'lucide-react';
import { CreateEventForm } from '@/features/events/components/event-forms';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'New Event',
};

export default function NewEventPage() {
  return (
    <div className="mx-auto w-full max-w-4xl animate-fade-in-up">
      <div className="mb-6">
        <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-accent ring-1 ring-primary/10">
          <Plus className="size-5 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create new event</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the details to set up your event.
        </p>
        <div className="mt-5 h-px bg-border" />
      </div>
      <CreateEventForm />
    </div>
  );
}
