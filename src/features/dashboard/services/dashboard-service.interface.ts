import type { ApiResponse } from '@/types';
import type { EventStatus } from '@/lib/constants';

export type DashboardStats = {
  totalEvents: number;
  publishedEvents: number;
  totalRegistrations: number;
  checkedInAttendees: number;
  totalQrCodes: number;
};

export type DashboardEventOverview = {
  id: string;
  title: string;
  status: EventStatus;
  startsAt: string;
  maxAttendees: number | null;
  registrationCount: number;
};

export type DashboardRecentRegistration = {
  id: string;
  fullName: string;
  email: string;
  status: string;
  registeredAt: string;
  eventTitle: string;
};

export type OrganizerDashboard = {
  stats: DashboardStats;
  upcomingEvents: DashboardEventOverview[];
  recentRegistrations: DashboardRecentRegistration[];
};

export interface IDashboardService {
  getOrganizerDashboard(
    organizationId: string
  ): Promise<ApiResponse<OrganizerDashboard>>;
}
