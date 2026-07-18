'use client';

import { useActionState } from 'react';
import { Loader2 } from 'lucide-react';
import { FIELD_TYPES } from '@/lib/constants';
import {
  submitPublicRegistrationAction,
  type RegistrationActionState,
} from '../actions';
import type { Event } from '@/features/events/services/event-service.interface';
import type { RegistrationFormWithFields } from '@/features/registration-forms/services/registration-form-service.interface';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const initialState: RegistrationActionState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

function FormMessage({ state }: { state: RegistrationActionState }) {
  if (!state.message) {
    return null;
  }

  return (
    <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
      {state.message}
    </p>
  );
}

function DynamicField({
  field,
}: {
  field: RegistrationFormWithFields['fields'][number];
}) {
  const name = `field_${field.id}`;
  const label = (
    <Label htmlFor={name}>
      {field.label}
      {field.isRequired ? <span className="text-destructive">*</span> : null}
    </Label>
  );

  if (field.fieldType === FIELD_TYPES.TEXTAREA) {
    return (
      <div className="space-y-2">
        {label}
        <Textarea
          id={name}
          name={name}
          placeholder={field.placeholder ?? ''}
          required={field.isRequired}
        />
      </div>
    );
  }

  if (
    field.fieldType === FIELD_TYPES.SELECT ||
    field.fieldType === FIELD_TYPES.RADIO
  ) {
    return (
      <div className="space-y-2">
        {label}
        <select
          id={name}
          name={name}
          required={field.isRequired}
          className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">{field.placeholder ?? 'Choose an option'}</option>
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (
    field.fieldType === FIELD_TYPES.CHECKBOX ||
    field.fieldType === FIELD_TYPES.MULTI_SELECT
  ) {
    return (
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">
          {field.label}
          {field.isRequired ? <span className="text-destructive">*</span> : null}
        </legend>
        <div className="space-y-2">
          {field.options.map((option) => (
            <label key={option} className="flex items-center gap-2 text-sm">
              <Checkbox name={name} value={option} />
              {option}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  const inputType =
    field.fieldType === FIELD_TYPES.EMAIL
      ? 'email'
      : field.fieldType === FIELD_TYPES.PHONE
        ? 'tel'
        : field.fieldType === FIELD_TYPES.DATE
          ? 'date'
          : field.fieldType === FIELD_TYPES.NUMBER
            ? 'number'
            : field.fieldType === FIELD_TYPES.URL
              ? 'url'
              : 'text';

  return (
    <div className="space-y-2">
      {label}
      <Input
        id={name}
        name={name}
        type={inputType}
        placeholder={field.placeholder ?? ''}
        required={field.isRequired}
      />
    </div>
  );
}

export function PublicRegistrationForm({
  event,
  form,
}: {
  event: Event;
  form: RegistrationFormWithFields;
}) {
  const actionForSlug = submitPublicRegistrationAction.bind(null, event.slug);
  const [state, action, pending] = useActionState(
    actionForSlug,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.title}</CardTitle>
        <CardDescription>{form.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="eventId" value={event.id} />
          <input
            type="hidden"
            name="organizationId"
            value={event.organizationId}
          />
          <input type="hidden" name="formId" value={form.id} />
          <FormMessage state={state} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" autoComplete="name" />
              <FieldError errors={state.errors?.fullName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" autoComplete="email" />
              <FieldError errors={state.errors?.email} />
            </div>
          </div>
          {form.fields.map((field) => (
            <DynamicField key={field.id} field={field} />
          ))}
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : null}
            Complete registration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

