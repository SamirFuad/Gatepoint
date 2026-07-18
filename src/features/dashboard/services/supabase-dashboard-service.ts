import { createClient } from '@/lib/supabase/server';
import type { ApiError, ApiResponse } from '@/types';
import type { Database } from '@/types/database.types';
import type {
  DashboardEventOverview,
  DashboardRecentRegistration,
  IDashboardService,
  OrganizerDashboard,
} from './dashboard-service.interface';

type EventRow = Database['public']['Tables']['events']['Row'] & {
  registrations?: { count: number }[];
};

type RecentRegistrationRow =
  Database['public']['Tables']['registrations']['Row'] & {
    events:
      | {
          title: string;
        }
      | {
          title: string;
        }[]
      | null;
  };

function toApiError(error: {
  message: string;
  code?: string;
  status?: number;
}): ApiError {
  return {
    message: error.message,
    code: error.code,
    status: error.status,
  };
}

function countOrZero(count: number | null) {
  return count ?? 0;
}

function toEventOverview(row: EventRow): DashboardEventOverview {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    startsAt: row.starts_at,
    maxAttendees: row.max_attendees,
    registrationCount: row.registrations?.[0]?.count ?? 0,
  };
}

function toRecentRegistration(
  row: RecentRegistrationRow
): DashboardRecentRegistration {
  const event = Array.isArray(row.events) ? row.events[0] : row.events;

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    status: row.status,
    registeredAt: row.registered_at,
    eventTitle: event?.title ?? 'Untitled event',
  };
}

export class SupabaseDashboardService implements IDashboardService {
  async getOrganizerDashboard(
    organizationId: string
  ): Promise<ApiResponse<OrganizerDashboard>> {
    const supabase = await createClient();

    const [
      totalEvents,
      publishedEvents,
      totalRegistrations,
      checkedInAttendees,
      totalQrCodes,
      upcomingEvents,
      recentRegistrations,
    ] = await Promise.all([
      supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId),
      supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('status', 'published'),
      supabase
        .from('registrations')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId),
      supabase
        .from('registrations')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('status', 'checked_in'),
      supabase
        .from('qr_codes')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId),
      supabase
        .from('events')
        .select('id, title, status, starts_at, max_attendees, registrations(count)')
        .eq('organization_id', organizationId)
        .gte('starts_at', new Date().toISOString())
        .order('starts_at', { ascending: true })
        .limit(4),
      supabase
        .from('registrations')
        .select('*, events(title)')
        .eq('organization_id', organizationId)
        .order('registered_at', { ascending: false })
        .limit(6),
    ]);

    const responses = [
      totalEvents,
      publishedEvents,
      totalRegistrations,
      checkedInAttendees,
      totalQrCodes,
      upcomingEvents,
      recentRegistrations,
    ];
    const failed = responses.find((response) => response.error);

    if (failed?.error) {
      return { data: null, error: toApiError(failed.error) };
    }

    return {
      data: {
        stats: {
          totalEvents: countOrZero(totalEvents.count),
          publishedEvents: countOrZero(publishedEvents.count),
          totalRegistrations: countOrZero(totalRegistrations.count),
          checkedInAttendees: countOrZero(checkedInAttendees.count),
          totalQrCodes: countOrZero(totalQrCodes.count),
        },
        upcomingEvents: ((upcomingEvents.data ?? []) as EventRow[]).map(
          toEventOverview
        ),
        recentRegistrations: (
          (recentRegistrations.data ?? []) as RecentRegistrationRow[]
        ).map(toRecentRegistration),
      },
      error: null,
    };
  }
}

export function createDashboardService(): IDashboardService {
  return new SupabaseDashboardService();
}
