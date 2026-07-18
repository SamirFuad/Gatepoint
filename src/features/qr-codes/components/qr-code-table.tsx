'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { QrCode } from 'lucide-react';
import {
  generateQRCodeAction,
  type QRCodeActionState,
} from '../actions';
import type { Registration } from '@/features/registrations/services/registration-service.interface';
import type { QRCodeRecord } from '../services/qr-code-service.interface';
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

const initialState: QRCodeActionState = {};

function FormMessage({ state }: { state: QRCodeActionState }) {
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

export function QRCodeTable({
  eventId,
  registrations,
  qrCodes,
}: {
  eventId: string;
  registrations: Registration[];
  qrCodes: QRCodeRecord[];
}) {
  const [state, action, pending] = useActionState(
    generateQRCodeAction,
    initialState
  );

  const qrByRegistration = new Map(
    qrCodes.map((qrCode) => [qrCode.registrationId, qrCode])
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR codes</CardTitle>
        <CardDescription>
          Generate and inspect QR codes for confirmed attendees.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormMessage state={state} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attendee</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>QR</TableHead>
              <TableHead className="w-36 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => {
              const qrCode = qrByRegistration.get(registration.id);

              return (
                <TableRow key={registration.id}>
                  <TableCell>
                    <div className="font-medium">{registration.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      {registration.confirmationNumber}
                    </div>
                  </TableCell>
                  <TableCell>{qrCode?.code ?? 'Not generated'}</TableCell>
                  <TableCell>
                    {qrCode?.qrImageUrl ? (
                      <Image
                        src={qrCode.qrImageUrl}
                        alt={`QR code for ${registration.fullName}`}
                        width={72}
                        height={72}
                        unoptimized
                      />
                    ) : (
                      <div className="flex size-16 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                        <QrCode className="size-5" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={action}>
                      <input type="hidden" name="eventId" value={eventId} />
                      <input
                        type="hidden"
                        name="registrationId"
                        value={registration.id}
                      />
                      <Button type="submit" size="sm" disabled={pending}>
                        {qrCode ? 'Refresh' : 'Generate'}
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

