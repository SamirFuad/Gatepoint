import { createClient } from '@/lib/supabase/server';
import type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  SortParams,
} from '@/types';
import type { Database } from '@/types/database.types';
import type {
  CreateEventData,
  Event,
  EventFilters,
  IEventService,
  UpdateEventData,
} from './event-service.interface';

type EventRow = Database['public']['Tables']['events']['Row'] & {
  registrations?: { count: number }[];
};
type EventUpdate = Database['public']['Tables']['events']['Update'];

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

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function toEvent(row: EventRow): Event {
  return {
    id: row.id,
    organizationId: row.organization_id,
    createdBy: row.created_by,
    title: row.title,
    slug: row.slug,
    description: row.description,
    eventType: row.event_type,
    status: row.status,
    venueName: row.venue_name,
    venueAddress: row.venue_address,
    timezone: row.timezone,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    registrationOpensAt: row.registration_opens_at,
    registrationClosesAt: row.registration_closes_at,
    maxAttendees: row.max_attendees,
    settings:
      row.settings && typeof row.settings === 'object' && !Array.isArray(row.settings)
        ? row.settings
        : {},
    landingPageConfig:
      row.landing_page_config &&
      typeof row.landing_page_config === 'object' &&
      !Array.isArray(row.landing_page_config)
        ? row.landing_page_config
        : null,
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    registrationCount: row.registrations?.[0]?.count,
  };
}

function toEventUpdate(data: UpdateEventData): EventUpdate {
  return {
    title: data.title,
    slug: data.slug ? slugify(data.slug) : undefined,
    description: data.description ?? undefined,
    event_type: data.eventType,
    status: data.status,
    venue_name: data.venueName ?? undefined,
    venue_address: data.venueAddress ?? undefined,
    timezone: data.timezone,
    starts_at: data.startsAt,
    ends_at: data.endsAt,
    registration_opens_at: data.registrationOpensAt ?? undefined,
    registration_closes_at: data.registrationClosesAt ?? undefined,
    max_attendees: data.maxAttendees ?? undefined,
    settings: data.settings as EventUpdate['settings'],
    landing_page_config:
      data.landingPageConfig as EventUpdate['landing_page_config'],
    is_published: data.isPublished,
  };
}

export class SupabaseEventService implements IEventService {
  async create(
    organizationId: string,
    data: CreateEventData
  ): Promise<ApiResponse<Event>> {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      return { data: null, error: toApiError(userError) };
    }

    if (!user) {
      return { data: null, error: { message: 'Authentication required.' } };
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        organization_id: organizationId,
        created_by: user.id,
        title: data.title,
        slug: data.slug ? slugify(data.slug) : slugify(data.title),
        description: data.description ?? null,
        event_type: data.eventType,
        venue_name: data.venueName ?? null,
        venue_address: data.venueAddress ?? null,
        timezone: data.timezone,
        starts_at: data.startsAt,
        ends_at: data.endsAt,
        registration_opens_at: data.registrationOpensAt ?? null,
        registration_closes_at: data.registrationClosesAt ?? null,
        max_attendees: data.maxAttendees ?? null,
      })
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toEvent(event), error: null };
  }

  async getById(id: string): Promise<ApiResponse<Event>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*, registrations!registrations_event_id_fkey(count)')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toEvent(data as EventRow), error: null };
  }

  async getBySlug(slug: string): Promise<ApiResponse<Event>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*, registrations!registrations_event_id_fkey(count)')
      .eq('slug', slug)
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toEvent(data as EventRow), error: null };
  }

  async listPublished(): Promise<ApiResponse<Event[]>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_published', true)
      .eq('status', 'published')
      .gte('ends_at', new Date().toISOString())
      .order('starts_at', { ascending: true });

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: data.map((event) => toEvent(event as EventRow)), error: null };
  }

  async update(
    id: string,
    data: UpdateEventData
  ): Promise<ApiResponse<Event>> {
    const supabase = await createClient();
    const { data: event, error } = await supabase
      .from('events')
      .update(toEventUpdate(data))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: toEvent(event), error: null };
  }

  async delete(id: string): Promise<ApiResponse<null>> {
    const supabase = await createClient();
    const { error } = await supabase.from('events').delete().eq('id', id);

    return { data: null, error: error ? toApiError(error) : null };
  }

  async list(
    organizationId: string,
    pagination: PaginationParams,
    filters?: EventFilters,
    sort?: SortParams
  ): Promise<ApiResponse<PaginatedResponse<Event>>> {
    const supabase = await createClient();
    const from = (pagination.page - 1) * pagination.pageSize;
    const to = from + pagination.pageSize - 1;
    let query = supabase
      .from('events')
      .select('*, registrations!registrations_event_id_fkey(count)', {
        count: 'exact',
      })
      .eq('organization_id', organizationId);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.eventType) {
      query = query.eq('event_type', filters.eventType);
    }

    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const sortColumn = sort?.column ?? 'starts_at';
    const ascending = sort?.direction === 'asc';
    const { data, error, count } = await query
      .order(sortColumn, { ascending })
      .range(from, to);

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    const total = count ?? 0;

    return {
      data: {
        data: (data as EventRow[]).map(toEvent),
        total,
        page: pagination.page,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil(total / pagination.pageSize),
      },
      error: null,
    };
  }

  async publish(id: string): Promise<ApiResponse<Event>> {
    return this.update(id, {
      status: 'published',
      isPublished: true,
    });
  }

  async cancel(id: string): Promise<ApiResponse<Event>> {
    return this.update(id, {
      status: 'cancelled',
      isPublished: false,
    });
  }

  async isSlugAvailable(slug: string): Promise<ApiResponse<boolean>> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('events')
      .select('id')
      .eq('slug', slugify(slug))
      .maybeSingle();

    if (error) {
      return { data: null, error: toApiError(error) };
    }

    return { data: data === null, error: null };
  }
}

export function createEventService(): IEventService {
  return new SupabaseEventService();
}
