// =============================================================
// Gatepoint — Marketing Layout
// =============================================================
// Layout for the public marketing site (homepage, pricing, etc.)
// Wraps pages with the marketing header and footer.
// =============================================================

import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
