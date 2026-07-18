// =============================================================
// Gatepoint — Dashboard Layout (Placeholder)
// =============================================================
// Will be fully built in Step 7: Dashboard Layout.
// For now, provides a basic wrapper.
// =============================================================

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Sidebar + Topbar will be added in Step 7 */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
