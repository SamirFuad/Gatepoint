'use client';

import { useActionState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { updateLandingPageAction, type LandingPageActionState } from '../actions';
import type { LandingPageConfig } from '../schemas/landing-page-schemas';
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

const initialState: LandingPageActionState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

function FormMessage({ state }: { state: LandingPageActionState }) {
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

export function LandingPageForm({
  eventId,
  config,
}: {
  eventId: string;
  config: LandingPageConfig;
}) {
  const updateAction = updateLandingPageAction.bind(null, eventId);
  const [state, action, pending] = useActionState(
    updateAction,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Landing page</CardTitle>
        <CardDescription>
          Customize the public page attendees see before registration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input
              id="headline"
              name="headline"
              defaultValue={config.headline}
            />
            <FieldError errors={state.errors?.headline} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subheadline">Subheadline</Label>
            <Textarea
              id="subheadline"
              name="subheadline"
              defaultValue={config.subheadline}
            />
            <FieldError errors={state.errors?.subheadline} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent color</Label>
              <Input
                id="accentColor"
                name="accentColor"
                type="color"
                defaultValue={config.accentColor}
                className="h-10 p-1"
              />
              <FieldError errors={state.errors?.accentColor} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={config.contactEmail}
              />
              <FieldError errors={state.errors?.contactEmail} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="agenda">Agenda highlights</Label>
            <Textarea id="agenda" name="agenda" defaultValue={config.agenda} />
            <FieldError errors={state.errors?.agenda} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venueNote">Venue note</Label>
            <Textarea
              id="venueNote"
              name="venueNote"
              defaultValue={config.venueNote}
            />
            <FieldError errors={state.errors?.venueNote} />
          </div>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Save />}
            Save landing page
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

