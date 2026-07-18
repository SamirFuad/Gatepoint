'use client';

import { useActionState } from 'react';
import { Loader2, Save } from 'lucide-react';
import {
  createEventAction,
  updateEventAction,
  type EventActionState,
} from '@/features/events/actions';
import type { Event } from '@/features/events/services/event-service.interface';
import { EVENT_STATUS, EVENT_TYPES } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const initialState: EventActionState = {};

function toLocalDateTime(value: string | null) {
  if (!value) {
    return '';
  }

  return new Date(value).toISOString().slice(0, 16);
}

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

function FormMessage({ state }: { state: EventActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p
      className={
        state.success
          ? 'rounded-lg bg-primary/10 px-3 py-2 text-sm text-primary'
          : 'rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive'
      }
    >
      {state.message}
    </p>
  );
}

function EventFields({
  state,
  event,
  includeStatus,
}: {
  state: EventActionState;
  event?: Event;
  includeStatus?: boolean;
}) {
  return (
    <>
      <FormMessage state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={event?.title ?? ''} />
          <FieldError errors={state.errors?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={event?.slug ?? ''}
            placeholder="auto-generated if empty"
          />
          <FieldError errors={state.errors?.slug} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventType">Type</Label>
          <select
            id="eventType"
            name="eventType"
            defaultValue={event?.eventType ?? EVENT_TYPES.CONFERENCE}
            className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {Object.values(EVENT_TYPES).map((type) => (
              <option key={type} value={type}>
                {type.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.eventType} />
        </div>
        {includeStatus ? (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={event?.status ?? EVENT_STATUS.DRAFT}
              className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {Object.values(EVENT_STATUS).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <FieldError errors={state.errors?.status} />
          </div>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={event?.description ?? ''}
        />
        <FieldError errors={state.errors?.description} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startsAt">Starts at</Label>
          <Input
            id="startsAt"
            name="startsAt"
            type="datetime-local"
            defaultValue={toLocalDateTime(event?.startsAt ?? null)}
          />
          <FieldError errors={state.errors?.startsAt} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endsAt">Ends at</Label>
          <Input
            id="endsAt"
            name="endsAt"
            type="datetime-local"
            defaultValue={toLocalDateTime(event?.endsAt ?? null)}
          />
          <FieldError errors={state.errors?.endsAt} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="registrationOpensAt">Registration opens</Label>
          <Input
            id="registrationOpensAt"
            name="registrationOpensAt"
            type="datetime-local"
            defaultValue={toLocalDateTime(event?.registrationOpensAt ?? null)}
          />
          <FieldError errors={state.errors?.registrationOpensAt} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="registrationClosesAt">Registration closes</Label>
          <Input
            id="registrationClosesAt"
            name="registrationClosesAt"
            type="datetime-local"
            defaultValue={toLocalDateTime(event?.registrationClosesAt ?? null)}
          />
          <FieldError errors={state.errors?.registrationClosesAt} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Input
            id="timezone"
            name="timezone"
            defaultValue={event?.timezone ?? 'UTC'}
          />
          <FieldError errors={state.errors?.timezone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxAttendees">Capacity</Label>
          <Input
            id="maxAttendees"
            name="maxAttendees"
            type="number"
            min="1"
            defaultValue={event?.maxAttendees ?? ''}
          />
          <FieldError errors={state.errors?.maxAttendees} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="venueName">Venue</Label>
          <Input
            id="venueName"
            name="venueName"
            defaultValue={event?.venueName ?? ''}
          />
          <FieldError errors={state.errors?.venueName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="venueAddress">Venue address</Label>
          <Input
            id="venueAddress"
            name="venueAddress"
            defaultValue={event?.venueAddress ?? ''}
          />
          <FieldError errors={state.errors?.venueAddress} />
        </div>
      </div>
    </>
  );
}

export function CreateEventForm() {
  const [state, action, pending] = useActionState(
    createEventAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create event</CardTitle>
        <CardDescription>
          Add the core details before publishing your registration page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <EventFields state={state} />
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : null}
            Create event
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function EventSettingsForm({ event }: { event: Event }) {
  const updateAction = updateEventAction.bind(null, event.id);
  const [state, action, pending] = useActionState(
    updateAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Event settings</CardTitle>
        <CardDescription>
          Update the schedule, publication status, capacity, and venue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <EventFields state={state} event={event} includeStatus />
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Save />}
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

