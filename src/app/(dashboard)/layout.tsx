// =============================================================
// Gatepoint — Dashboard Layout (Placeholder)
// =============================================================
// Will be fully built in Step 7: Dashboard Layout.
// For now, provides a basic wrapper.
// =============================================================

import { DashboardShell } from '@/components/layout/dashboard-shell';
import { createOrganizationService } from '@/features/organizations/services/supabase-organization-service';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await createOrganizationService().getUserOrganizations();

  if (result.error) {
    throw new Error(result.error.message);
  }

  return (
    <DashboardShell hasOrganization={Boolean(result.data?.length)}>
      {children}
    </DashboardShell>
  );
}
