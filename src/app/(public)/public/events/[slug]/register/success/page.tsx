import { EventPass } from '@/features/qr-codes/components/event-pass';
import { createQRCodeService } from '@/features/qr-codes/services/supabase-qr-code-service';
import { createLandingPageService } from '@/features/landing-pages/services/supabase-landing-page-service';
import { notFound } from 'next/navigation';
export const metadata = {
  title: 'Your Event Pass',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';
export default async function RegistrationSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ confirmation?: string; qr?: string; email?: string }>;
}) {
  const { slug } = await params;
  const { confirmation, qr, email } = await searchParams;
  const event = await createLandingPageService().getPublishedEventBySlug(slug);
  if (!event.data) notFound();
  const result = qr ? await createQRCodeService().getByCode(qr) : null;
  const code = result?.data?.eventId === event.data.id ? result.data : null;
  return (
    <main>
      <EventPass
        qrImageUrl={code?.qrImageUrl}
        confirmation={confirmation}
        eventTitle={event.data.title}
        eventHref={'/public/events/' + slug}
        emailFailed={email === 'failed'}
      />
    </main>
  );
}
