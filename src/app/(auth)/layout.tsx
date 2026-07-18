// =============================================================
// Gatepoint — Auth Layout
// =============================================================
// Layout for authentication pages (login, register, etc.)
// Centered card design with no header/footer.
// =============================================================

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero bg-grid p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
