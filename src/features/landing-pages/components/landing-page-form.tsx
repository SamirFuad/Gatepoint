'use client';

import { useActionState, useState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { updateLandingPageAction, type LandingPageActionState } from '../actions';
import type { AgendaItem, LandingPageConfig } from '../schemas/landing-page-schemas';
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

const emptyItem: AgendaItem = { time: '', title: '', description: '', speaker: '' };

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
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(
    config.agendaItems ?? []
  );

  function addItem() {
    setAgendaItems((prev) => [...prev, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    setAgendaItems((prev) => prev.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof AgendaItem, value: string) {
    setAgendaItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Landing page</CardTitle>
        <CardDescription>
          Customize the public page attendees see before registration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-6">
          <FormMessage state={state} />

          {/* Serialize agendaItems as hidden JSON */}
          <input
            type="hidden"
            name="agendaItems"
            value={JSON.stringify(agendaItems)}
          />

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

          {/* Agenda Items Builder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Schedule items</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addItem}
              >
                <Plus className="size-4" />
                Add item
              </Button>
            </div>
            {agendaItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No schedule items yet. Add items to show a structured timeline on the public page.
              </p>
            ) : null}
            {agendaItems.map((item, index) => (
              <div
                key={index}
                className="rounded-lg border bg-muted/30 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Item {index + 1}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Time</Label>
                    <Input
                      placeholder="e.g. 09:00 AM"
                      value={item.time}
                      onChange={(e) => updateItem(index, 'time', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Speaker (optional)</Label>
                    <Input
                      placeholder="e.g. John Doe"
                      value={item.speaker ?? ''}
                      onChange={(e) =>
                        updateItem(index, 'speaker', e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Title</Label>
                  <Input
                    placeholder="Session title"
                    value={item.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description (optional)</Label>
                  <Textarea
                    placeholder="Brief description of this session"
                    value={item.description ?? ''}
                    onChange={(e) =>
                      updateItem(index, 'description', e.target.value)
                    }
                    rows={2}
                  />
                </div>
              </div>
            ))}
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
