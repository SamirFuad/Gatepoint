'use client';

import { useActionState } from 'react';
import { REGISTRATION_STATUS } from '@/lib/constants';
import {
  updateRegistrationStatusAction,
  type RegistrationActionState,
} from '../actions';
import type { Registration } from '../services/registration-service.interface';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const initialState: RegistrationActionState = {};

function FormMessage({ state }: { state: RegistrationActionState }) {
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

export function RegistrationTable({
  eventId,
  registrations,
}: {
  eventId: string;
  registrations: Registration[];
}) {
  const actionForEvent = updateRegistrationStatusAction.bind(null, eventId);
  const [state, action, pending] = useActionState(
    actionForEvent,
    initialState
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registrations</CardTitle>
        <CardDescription>
          Review attendees and manage registration status.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormMessage state={state} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attendee</TableHead>
              <TableHead>Confirmation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="w-56">Update</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>
                  <div className="font-medium">{registration.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    {registration.email}
                  </div>
                </TableCell>
                <TableCell>{registration.confirmationNumber}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{registration.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(registration.registeredAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <form action={action} className="flex items-center gap-2">
                    <input
                      type="hidden"
                      name="registrationId"
                      value={registration.id}
                    />
                    <select
                      name="status"
                      defaultValue={registration.status}
                      className="h-8 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {Object.values(REGISTRATION_STATUS).map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" size="sm" disabled={pending}>
                      Save
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

