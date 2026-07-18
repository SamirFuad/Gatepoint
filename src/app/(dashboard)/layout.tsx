// =============================================================
// Gatepoint — Dashboard Layout (Placeholder)
// =============================================================
// Will be fully built in Step 7: Dashboard Layout.
// For now, provides a basic wrapper.
// =============================================================

import { DashboardShell } from '@/components/layout/dashboard-shell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
