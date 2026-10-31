import { createDashboardService } from '@/features/dashboard/services/supabase-dashboard-service';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';
import {
  DashboardOverview,
  DashboardWelcome,
} from '@/features/dashboard/components/dashboard-overview';
export const dynamic = 'force-dynamic';
export const metadata = { title: 'Your Workspace' };
export default async function DashboardPage() {
  const result = await createOrganizationService().getUserOrganizations();
  if (result.error) throw new Error(result.error.message);
  if (!result.data?.length) return <DashboardWelcome />;
  const organization = result.data[0];
  const dashboard = await createDashboardService().getOrganizerDashboard(
    organization.id
  );
  if (dashboard.error || !dashboard.data)
    throw new Error(
      dashboard.error?.message ?? 'Dashboard data is not available.'
    );
  return (
    <DashboardOverview organization={organization} dashboard={dashboard.data} />
  );
}
