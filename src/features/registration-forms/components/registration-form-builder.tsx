'use client';

import { useActionState } from 'react';
import { Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { FIELD_TYPES } from '@/lib/constants';
import {
  addFormFieldAction,
  deleteFormFieldAction,
  updateFormFieldAction,
  upsertRegistrationFormAction,
  type RegistrationFormActionState,
} from '../actions';
import type {
  FormField,
  RegistrationFormWithFields,
} from '../services/registration-form-service.interface';
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

const initialState: RegistrationFormActionState = {};

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="text-xs text-destructive">{errors[0]}</p>;
}

function FormMessage({ state }: { state: RegistrationFormActionState }) {
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

function fieldTypeNeedsOptions(fieldType: string) {
  return ['select', 'multi_select', 'checkbox', 'radio'].includes(fieldType);
}

function FieldTypeSelect({
  defaultValue,
}: {
  defaultValue?: string;
}) {
  return (
    <select
      name="fieldType"
      defaultValue={defaultValue ?? FIELD_TYPES.TEXT}
      className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {Object.values(FIELD_TYPES)
        .filter((type) => type !== FIELD_TYPES.FILE)
        .map((type) => (
          <option key={type} value={type}>
            {type.replaceAll('_', ' ')}
          </option>
        ))}
    </select>
  );
}

export function RegistrationFormSettings({
  eventId,
  form,
}: {
  eventId: string;
  form: RegistrationFormWithFields | null;
}) {
  const actionForEvent = upsertRegistrationFormAction.bind(null, eventId);
  const [state, action, pending] = useActionState(
    actionForEvent,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Form settings</CardTitle>
        <CardDescription>
          Define the title and availability of this event registration form.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <FormMessage state={state} />
          <div className="space-y-2">
            <Label htmlFor="title">Form title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={form?.title ?? 'Event Registration'}
            />
            <FieldError errors={state.errors?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={form?.description ?? ''}
            />
            <FieldError errors={state.errors?.description} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="isActive" defaultChecked={form?.isActive ?? true} />
            Active for public registration
          </label>
          <Button type="submit" size="lg" disabled={pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Save />}
            Save form
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AddFieldForm({
  eventId,
  formId,
  nextSortOrder,
}: {
  eventId: string;
  formId: string | null;
  nextSortOrder: number;
}) {
  const actionForEvent = addFormFieldAction.bind(null, eventId);
  const [state, action, pending] = useActionState(
    actionForEvent,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add field</CardTitle>
        <CardDescription>
          Add questions that attendees should answer during registration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <input type="hidden" name="formId" value={formId ?? ''} />
          <input type="hidden" name="sortOrder" value={nextSortOrder} />
          <FormMessage state={state} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fieldType">Type</Label>
              <FieldTypeSelect />
              <FieldError errors={state.errors?.fieldType} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input id="label" name="label" />
              <FieldError errors={state.errors?.label} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input id="placeholder" name="placeholder" />
            <FieldError errors={state.errors?.placeholder} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="optionsText">Options</Label>
            <Textarea
              id="optionsText"
              name="optionsText"
              placeholder="One option per line for select, radio, checkbox fields"
            />
            <FieldError errors={state.errors?.optionsText} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox name="isRequired" />
            Required
          </label>
          <Button type="submit" size="lg" disabled={!formId || pending}>
            {pending ? <Loader2 className="animate-spin" /> : <Plus />}
            Add field
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function FormFieldsEditor({
  eventId,
  fields,
}: {
  eventId: string;
  fields: FormField[];
}) {
  const updateActionForEvent = updateFormFieldAction.bind(null, eventId);
  const deleteActionForEvent = deleteFormFieldAction.bind(null, eventId);
  const [updateState, updateAction, updatePending] = useActionState(
    updateActionForEvent,
    initialState
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteActionForEvent,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fields</CardTitle>
        <CardDescription>
          Keep fields ordered and concise so registration stays fast.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormMessage state={updateState.message ? updateState : deleteState} />
        {fields.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No fields yet. Add a field to start building the registration form.
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="rounded-lg border p-4">
                <form action={updateAction} className="space-y-3">
                  <input type="hidden" name="fieldId" value={field.id} />
                  <div className="grid gap-3 md:grid-cols-[160px_1fr_100px]">
                    <FieldTypeSelect defaultValue={field.fieldType} />
                    <Input name="label" defaultValue={field.label} />
                    <Input
                      name="sortOrder"
                      type="number"
                      min="0"
                      defaultValue={field.sortOrder}
                    />
                  </div>
                  <Input
                    name="placeholder"
                    defaultValue={field.placeholder ?? ''}
                    placeholder="Placeholder"
                  />
                  {fieldTypeNeedsOptions(field.fieldType) ? (
                    <Textarea
                      name="optionsText"
                      defaultValue={field.options.join('\n')}
                    />
                  ) : (
                    <input
                      type="hidden"
                      name="optionsText"
                      value={field.options.join('\n')}
                    />
                  )}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        name="isRequired"
                        defaultChecked={field.isRequired}
                      />
                      Required
                    </label>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        variant="outline"
                        disabled={updatePending}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </form>
                <form action={deleteAction} className="mt-3">
                  <input type="hidden" name="fieldId" value={field.id} />
                  <Button
                    type="submit"
                    variant="destructive"
                    size="sm"
                    disabled={deletePending}
                  >
                    <Trash2 />
                    Delete
                  </Button>
                </form>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function RegistrationFormPreview({
  form,
}: {
  form: RegistrationFormWithFields | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          This is the shape attendees will see in the public flow.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">{form?.title ?? 'Event Registration'}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {form?.description ?? 'Registration form preview.'}
          </p>
        </div>
        {(form?.fields ?? []).map((field) => (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.isRequired ? (
                <span className="text-destructive">*</span>
              ) : null}
            </Label>
            {field.fieldType === FIELD_TYPES.TEXTAREA ? (
              <Textarea placeholder={field.placeholder ?? ''} disabled />
            ) : fieldTypeNeedsOptions(field.fieldType) ? (
              <select
                className="h-9 w-full rounded-lg border border-input bg-background px-2.5 text-sm"
                disabled
              >
                <option>{field.placeholder ?? 'Choose an option'}</option>
                {field.options.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <Input
                type={field.fieldType === FIELD_TYPES.NUMBER ? 'number' : 'text'}
                placeholder={field.placeholder ?? ''}
                disabled
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

