'use server';

import { createAttendeeService } from '@/features/attendees/services/supabase-attendee-service';

function escapeCsvField(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function exportAttendeesCsvAction(
  eventId: string
): Promise<{ csv: string | null; error: string | null }> {
  const service = createAttendeeService();
  const result = await service.listAllByEvent(eventId);

  if (result.error || !result.data) {
    return { csv: null, error: result.error?.message ?? 'Failed to fetch attendees.' };
  }

  const headers = ['Full Name', 'Email', 'Confirmation Number', 'Status', 'Registered At', 'Checked In At'];
  const rows = result.data.map((a) => [
    escapeCsvField(a.fullName),
    escapeCsvField(a.email),
    escapeCsvField(a.confirmationNumber),
    escapeCsvField(a.status),
    escapeCsvField(new Date(a.registeredAt).toISOString()),
    a.checkedInAt ? escapeCsvField(new Date(a.checkedInAt).toISOString()) : '',
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  return { csv, error: null };
}
