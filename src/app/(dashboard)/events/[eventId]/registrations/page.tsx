import { notFound } from 'next/navigation';
import { createEventService } from '@/features/events/services/supabase-event-service';
import {
  AddFieldForm,
  FormFieldsEditor,
  RegistrationFormPreview,
  RegistrationFormSettings,
} from '@/features/registration-forms/components/registration-form-builder';
import { createRegistrationFormService } from '@/features/registration-forms/services/supabase-registration-form-service';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Registration Form',
};

export default async function RegistrationFormBuilderPage({
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

  const registrationFormService = createRegistrationFormService();
  const formResult = await registrationFormService.getByEventId(eventId);
  const form = formResult.data ?? null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registration form
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Build the attendee form for {eventResult.data.title}.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <RegistrationFormSettings eventId={eventId} form={form} />
          <AddFieldForm
            eventId={eventId}
            formId={form?.id ?? null}
            nextSortOrder={(form?.fields.length ?? 0) + 1}
          />
          <FormFieldsEditor eventId={eventId} fields={form?.fields ?? []} />
        </div>
        <div className="lg:sticky lg:top-20 lg:self-start">
          <RegistrationFormPreview form={form} />
        </div>
      </div>
    </div>
  );
}

