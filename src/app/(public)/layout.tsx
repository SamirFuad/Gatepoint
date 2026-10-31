import { MarketingHeader } from '@/components/layout/marketing-header';
import { MarketingFooter } from '@/components/layout/marketing-footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="public-shell flex min-h-screen flex-col" id="top">
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  );
}
